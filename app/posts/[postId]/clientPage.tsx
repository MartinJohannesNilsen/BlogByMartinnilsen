"use client";
import Giscus from "@giscus/react";
import { useGSAP } from "@gsap/react";
import { AccessTime, ArrowUpward, CalendarMonth, Comment, Menu, ThumbUpAlt, Visibility } from "@mui/icons-material";
import { Box, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import DOMPurify from "isomorphic-dompurify";
import { ArticleJsonLd } from "next-seo";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { isMobile } from "react-device-detect";
import { renderToStaticMarkup } from "react-dom/server";
import { BiCoffeeTogo } from "react-icons/bi";
import { TbConfetti, TbShare2 } from "react-icons/tb";
import useWindowSize from "react-use/lib/useWindowSize";
import { useEventListener } from "usehooks-ts";
import { NavbarButton } from "../../../components/DesignLibrary/Buttons/NavbarButton";
import Toggle from "../../../components/DesignLibrary/Toggles/Toggle";
import { style } from "../../../components/EditorJS/style";
import ButtonBar from "../../../components/Navigation/ButtonBar";
import Footer from "../../../components/Navigation/LinkFooter";
import PostNavbar from "../../../components/Navigation/PostNavbar";
import PostViews from "../../../components/PostViews/PostViews";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { ButtonBarButtonProps, ReadPostPageProps } from "../../../types";
import { IDiscussionData, IMetadataMessage } from "../../../utils/giscus";
// gsap.registerPlugin(useGSAP, ScrollTrigger);

// Editorjs render
import Output from "editorjs-react-renderer";
// Got an error when revalidating pages on vercel, the line below fixed it, but removes toc as it does not render that well.
// import dynamic from "next/dynamic";
// const Output = dynamic(() => import("editorjs-react-renderer"), { ssr: false });
// const Output = dynamic(async () => (await import("editorjs-react-renderer")).default, { ssr: false });

// EditorJS renderers
import CustomCallout from "../../../components/EditorJS/Renderers/CustomCallout";
import CustomChecklist from "../../../components/EditorJS/Renderers/CustomChecklist";
import CustomCode from "../../../components/EditorJS/Renderers/CustomCode";
import CustomDivider from "../../../components/EditorJS/Renderers/CustomDivider";
import CustomHeader from "../../../components/EditorJS/Renderers/CustomHeader";
import CustomIframe from "../../../components/EditorJS/Renderers/CustomIframe";
import CustomImage from "../../../components/EditorJS/Renderers/CustomImage";
import CustomLinkTool from "../../../components/EditorJS/Renderers/CustomLinkTool";
import CustomList from "../../../components/EditorJS/Renderers/CustomList";
import CustomMath from "../../../components/EditorJS/Renderers/CustomMath";
import CustomParagraph from "../../../components/EditorJS/Renderers/CustomParagraph";
import CustomQuote from "../../../components/EditorJS/Renderers/CustomQuote";
import CustomTable from "../../../components/EditorJS/Renderers/CustomTable";
import CustomToggle from "../../../components/EditorJS/Renderers/CustomToggle";
import CustomVideo from "../../../components/EditorJS/Renderers/CustomVideo";
import { getViewCountsByPostId, incrementPostViews } from "../../../data/middleware/views/actions";
import { DATA_DEFAULTS } from "../../../data/metadata";
import { handleSharing } from "../../../utils/handleSharing";
import useStickyState from "../../../utils/useStickyState";

// Pass your custom renderers to Output
export const renderers = {
	paragraph: CustomParagraph,
	header: CustomHeader,
	code: CustomCode,
	divider: CustomDivider,
	image: CustomImage,
	linktool: CustomLinkTool,
	quote: CustomQuote,
	video: CustomVideo,
	checklist: CustomChecklist,
	table: CustomTable,
	math: CustomMath,
	list: CustomList,
	iframe: CustomIframe,
	toggle: CustomToggle,
	callout: CustomCallout,
};

export function processJsonToggleBlocks(inputJson) {
	// Deep copy the input JSON object
	let json = JSON.parse(JSON.stringify(inputJson));

	if (Array.isArray(json.blocks)) {
		// Initialize a new array for processed blocks
		let newBlocks: any = [];

		// Iterate over the blocks
		for (let i = 0; i < json.blocks.length; i++) {
			let block = json.blocks[i];

			// Check if the block is a toggle
			if (block.type === "toggle") {
				// Initialize an inner blocks array in the toggle block
				block.data.blocks = [];

				// Move the specified number of blocks into the toggle block
				for (let j = 0; j < block.data.items && i + 1 + j < json.blocks.length; j++) {
					block.data.blocks.push(json.blocks[i + 1 + j]);
				}

				// Skip the moved blocks in the main loop
				i += block.data.items;
			}

			// Add the processed block to the new blocks array
			newBlocks.push(block);
		}

		// Replace the original blocks array with the new one
		json.blocks = newBlocks;

		// Return the modified JSON
		return json;
	}

	return null;
}

export const ReadPostPage = ({ post, postId, postsOverview, isAuthorized }: ReadPostPageProps) => {
	const searchParams = useSearchParams();
	const { theme, setTheme } = useTheme();
	const [isExploding, setIsExploding] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const { width, height } = useWindowSize();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const sm = useMediaQuery(theme.breakpoints.only("sm"));
	const mdDown = useMediaQuery(theme.breakpoints.down("md"));
	const [_, setCardLayout] = useStickyState("cardLayout", "plain");
	const [currentSection, setCurrentSection] = useState(post.title);
	const [discussionData, setDiscussionData] = useState<IDiscussionData>({
		id: "",
		url: "",
		locked: undefined,
		repository: {
			nameWithOwner: "",
		},
		reactionCount: undefined,
		totalCommentCount: undefined,
		totalReplyCount: undefined,
		reactions: {
			THUMBS_UP: { count: undefined, viewerHasReacted: false },
			THUMBS_DOWN: { count: undefined, viewerHasReacted: false },
			LAUGH: { count: undefined, viewerHasReacted: false },
			HOORAY: { count: undefined, viewerHasReacted: false },
			CONFUSED: { count: undefined, viewerHasReacted: false },
			HEART: { count: undefined, viewerHasReacted: false },
			ROCKET: { count: undefined, viewerHasReacted: false },
			EYES: { count: undefined, viewerHasReacted: false },
		},
	});
	const toggleRef = useRef<null | HTMLDivElement>(null);
	const [toggleRCOpen, setToggleRCOpen] = useState<boolean>(false);
	const [views, setViews] = useState<number>();

	const OutputElement = useMemo(() => {
		if (post && post.data && post.data.blocks && Array.isArray(post.data.blocks)) {
			const processedData = processJsonToggleBlocks(post.data);
			return <Output renderers={renderers} data={processedData} style={style(theme)} />;
		}
		return null;
	}, [post]);

	// On session update, we can update views and go to hash if present
	useEffect(() => {
		// Increase view count in supabase db if: (1) not on localhost, (2) post is published and (3) !isAuthorized
		process.env.NEXT_PUBLIC_LOCALHOST === "false" &&
			post.published &&
			!isAuthorized &&
			// All criterias are met, run POST request to increment counter
			incrementPostViews(postId);

		// Get views
		getViewCountsByPostId(postId).then((data) => {
			setViews(data.viewCount);
		});

		// When session is updated, not loading anymore
		setIsLoading(false);
	}, [OutputElement]);

	useEffect(() => {
		// Go to hash if present
		if (typeof window !== "undefined" && window.location.hash) {
			// router.replace(window.location.hash);
			window.location.href = window.location.hash;

			// Alternate approach with instant scroll
			// const targetElement = document.querySelector(hash);
			// if (targetElement) {
			// 	targetElement.scrollIntoView({ behavior: "instant" });
			// }
		}
	}, [isLoading, searchParams]);

	useEffect(() => {
		if (
			!isLoading &&
			((process.env.NEXT_PUBLIC_HIDE_NAVBAR_DESKTOP === "true" && !isMobile) ||
				(process.env.NEXT_PUBLIC_HIDE_NAVBAR_MOBILE === "true" && isMobile))
		) {
			const navBarAnimation = gsap.to(".navBar", {
				y: "-60px",
				paused: true,
				duration: 0.4,
			});
			navBarAnimation.play();
			// Hide button bar as well?
			// const buttonBarAnimation = gsap.to(".buttonBar", {
			// 	y: "60px",
			// 	paused: true,
			// 	duration: 0.4,
			// });
			// buttonBarAnimation.reverse();
		}
	}, []);

	// Render markup for toc
	const OutputString = useMemo(() => {
		if (OutputElement) return renderToStaticMarkup(OutputElement);
	}, [OutputElement]);

	// Get current section for toc
	useEventListener("scroll", () => {
		const sectionEls = document.querySelectorAll(".anchorHeading");
		sectionEls.forEach((sectionEl) => {
			const { top, bottom } = sectionEl.getBoundingClientRect();
			// Check if the top of the section is above the viewport's bottom
			// if (top <= 0 && bottom >= 0) {
			if (top - 50 <= 0) {
				setCurrentSection(sectionEl.id);
			}
		});
	});

	// Modals
	const [openShareModal, setOpenShareModal] = useState(false);
	const [openTOCModal, setOpenTOCModal] = useState(false);

	// Giscus reactions and comments
	useEffect(() => {
		// Function for handling event message
		const handleMessage = (event) => {
			// Check that the message comes from giscus
			if (event.origin !== "https://giscus.app") return;
			if (!(typeof event.data === "object" && event.data.giscus)) return;

			const giscusData = event.data.giscus;

			if ("discussion" in giscusData) {
				const metadataMessage: IMetadataMessage = giscusData;
				setDiscussionData(metadataMessage.discussion);
			}
		};

		// Configure and clean up event listener
		window.addEventListener("message", handleMessage);
		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	// ButtonBar
	const buttonBarButtons: ButtonBarButtonProps[] = [
		{
			icon: ThumbUpAlt,
			fetched: discussionData.reactionCount !== null ? true : false,
			text: isMobile
				? discussionData.reactionCount
					? discussionData.reactionCount.toString()
					: "0"
				: discussionData.reactionCount
				? `${discussionData.reactionCount.toString()}
				reaction${discussionData.reactionCount !== 1 ? "s" : ""}`
				: `0 reactions`,
			onClick: () => {
				setToggleRCOpen(true);
				setTimeout(() => {
					toggleRef.current!.scrollIntoView({ behavior: "instant", block: "start", inline: "center" });
				}, 250);
			},
		},
		{
			icon: Comment,
			fetched: discussionData.totalCommentCount !== null ? true : false,
			text: isMobile
				? discussionData.totalCommentCount
					? discussionData.totalCommentCount.toString()
					: "0"
				: discussionData.totalCommentCount
				? `${discussionData.totalCommentCount.toString()}
				comment${discussionData.totalCommentCount !== 1 ? "s" : ""}`
				: `0 comments`,
			onClick: () => {
				setToggleRCOpen(true);
				setTimeout(() => {
					toggleRef.current!.scrollIntoView({ behavior: "instant", block: "start", inline: "center" });
				}, 250);
			},
		},
		{
			icon: Menu,
			text: isMobile ? "" : "Table of contents",
			onClick: () => {
				setOpenTOCModal(true);
			},
		},
		{
			icon: ArrowUpward,
			text: isMobile ? "" : "Back to top",
			onClick: () => {
				window.scrollTo({
					top: 0,
					behavior: "smooth",
				});
			},
		},
	];

	// Animations with GSAP
	const containerRef = useRef();
	useEffect(() => {
		ScrollTrigger.refresh();

		return () => {};
	}, [isLoading, toggleRCOpen]);
	useGSAP(
		() => {
			// Animations
			const navBarAnimation = gsap.to(".navBar", {
				y: "-60px",
				paused: true,
				duration: 0.4,
			});
			const buttonBarAnimation = gsap.to(".buttonBar", {
				y: "-120px",
				paused: true,
				duration: 0.4,
				reversed: true, // Start in reverse
			});

			// Scrolltrigger approach
			// ScrollTrigger.create({
			// 	start: "bottom bottom",
			// 	// As both "max" or a dynamic value in document.body.scrollheight (as state) did not work as expected, setting an arbitrary high number
			// 	end: `123456789px`,
			// 	scrub: true, // Number for smoother connection between scrollbar and animation
			// 	onUpdate: (self) => {
			// 		self.direction === -1 ? navBarAnimation.reverse() : navBarAnimation.play();
			// 	},
			// });
			// ScrollTrigger.create({
			// 	start: "top top",
			// 	end: `123456789px`,
			// 	scrub: true, // Number for smoother connection between scrollbar and animation
			// 	onUpdate: (self) => {
			// 		self.direction === -1 ? buttonBarAnimation.play() : buttonBarAnimation.reverse();
			// 	},
			// });
			// return () => {
			// 	buttonBarAnimation.reverse();
			// };

			// Await scroll in same direction for some time to trigger
			let lastScrollTop = 0;
			let scrollDistance = 0;
			let distanceToTrigger = parseInt(process.env.NEXT_PUBLIC_HIDE_NAVBAR_DISTANCE_IN_PX!);
			let lastScrollDirection = 0;
			window.addEventListener("scroll", function () {
				// if (event.isTrusted) {} else {} // Differentiate between user and scripted user scroll (trusted => user)
				const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
				const scrollDirection = scrollTop > lastScrollTop ? 1 : -1;
				const scrollDelta = Math.abs(scrollTop - lastScrollTop);

				// Update scroll distance only if direction remains the same
				if (scrollDirection === lastScrollDirection) {
					scrollDistance += scrollDelta;
				} else {
					// Direction changed, reset scroll distance
					scrollDistance = 0;
					lastScrollDirection = scrollDirection;
				}

				if (scrollDirection === -1 && scrollDistance >= distanceToTrigger) {
					// Scrolling upwards
					if (
						(process.env.NEXT_PUBLIC_HIDE_NAVBAR_DESKTOP === "true" && !isMobile) ||
						(process.env.NEXT_PUBLIC_HIDE_NAVBAR_MOBILE === "true" && isMobile)
					) {
						navBarAnimation.reverse();
					}
					buttonBarAnimation.play();
				} else if (scrollDirection === 1 && scrollDistance >= distanceToTrigger) {
					// Scrolling downwards
					if (
						(process.env.NEXT_PUBLIC_HIDE_NAVBAR_DESKTOP === "true" && !isMobile) ||
						(process.env.NEXT_PUBLIC_HIDE_NAVBAR_MOBILE === "true" && isMobile)
					) {
						navBarAnimation.play();
					}
					buttonBarAnimation.reverse();
				}

				lastScrollTop = scrollTop;
			});
			return () => {
				buttonBarAnimation.reverse();
				removeEventListener("scroll", this!);
			};
		},
		{ dependencies: [isLoading], scope: containerRef }
	);

	return (
		<>
			<ArticleJsonLd
				type="BlogPosting"
				url={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${postId}`}
				images={[post.ogImage.src]}
				datePublished={new Date(post.createdAt).toISOString()}
				dateModified={post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined}
				title={post.title}
				description={post.description}
				// authorName={post.author}
				authorName={{
					"@type": "Person",
					name: post.author,
					url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/yjdttN68e7V3E8SKIupT`,
				}}
			/>
			<Box width="100%" height="100%" position="relative" className="page">
				<Box
					height="100%"
					width="100%"
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					justifyItems="center"
					sx={{ backgroundColor: theme.palette.primary.main }}
					ref={containerRef}
				>
					{/* Navbar */}
					<PostNavbar
						className="navBar"
						post={{ ...post, id: postId }}
						toc={{ content: OutputString!, currentSection: currentSection }}
						tocModal={{ open: openTOCModal, setOpen: setOpenTOCModal }}
						shareModal={{ open: openShareModal, setOpen: setOpenShareModal }}
						postsOverview={postsOverview}
						setCardLayout={setCardLayout}
					/>
					{/* Content */}
					<Grid
						container
						width="100%"
						minHeight="100%"
						justifyContent="center"
						sx={{
							backgroundColor: theme.palette.primary.main,
							userSelect: "text",
						}}
					>
						<Grid item>
							<Stack
								p={2}
								sx={{
									// height: "100%",
									minHeight: isMobile ? "calc(100vh - 81px - 30px)" : "calc(100vh - 67px - 104px)",
									minWidth: "380px",
									width: xs ? "96vw" : sm ? "90vw" : "760px",
									position: "relative",
									userSelect: "none",
								}}
							>
								{/* Title box */}
								<Box
									id={post.title}
									className={"anchorHeading"}
									display="flex"
									alignItems="center"
									mt={isMobile ? 6 : 9}
									mb={1}
									pb={2}
									sx={{ userSelect: "text" }}
								>
									<Box display="flex" width="100%" flexDirection="column" justifyContent="center" alignItems="center">
										<Typography
											my={1}
											textAlign="center"
											fontFamily={theme.typography.fontFamily}
											variant="h5"
											fontWeight="800"
											sx={{ color: theme.palette.secondary.main }}
											dangerouslySetInnerHTML={{
												__html: DOMPurify.sanitize(
													post.type ? "//&nbsp;&nbsp;&nbsp;&nbsp;" + post.type + "&nbsp;&nbsp;&nbsp;&nbsp;//" : ""
												),
											}}
										/>
										<Typography
											my={xs ? 0 : 1}
											textAlign="center"
											sx={{ color: theme.palette.text.primary }}
											fontFamily={theme.typography.fontFamily}
											variant={"h3"}
											fontWeight="800"
										>
											{post.title}
										</Typography>
										<Box display="flex" mt={mdDown ? 1 : 2} mb={xs ? 0 : 1} justifyContent="center" alignItems="center">
											<CalendarMonth
												sx={{
													color: theme.palette.text.primary,
													opacity: 0.6,
													marginRight: "6px",
													// fontSize: xs ? "12px" : "default",
													fontSize: "default",
												}}
											/>
											<Typography
												fontFamily={theme.typography.fontFamily}
												variant="body2"
												fontWeight="600"
												sx={{
													color: theme.palette.text.primary,
													opacity: 0.6,
													// fontSize: xs ? "12px" : "default",
													fontSize: "default",
												}}
											>
												{new Date(post.createdAt).toLocaleDateString("en-GB", {
													// weekday: "long",
													day: "2-digit",
													month: "short",
													year: "numeric",
													timeZone: "Europe/Oslo",
												})}
											</Typography>
											<AccessTime
												sx={{
													color: theme.palette.text.primary,
													opacity: 0.6,
													marginLeft: "16px",
													marginRight: "6px",
													// fontSize: xs ? "12px" : "default",
													fontSize: "default",
												}}
											/>
											<Typography
												fontFamily={theme.typography.fontFamily}
												variant="body2"
												fontWeight="600"
												sx={{
													color: theme.palette.text.primary,
													opacity: 0.6,
													// fontSize: xs ? "12px" : "default",
													fontSize: "default",
												}}
											>
												{post.readTime ? post.readTime : "⎯"}
											</Typography>
											{/* View counts */}
											<Visibility
												sx={{
													opacity: 0.6,
													marginLeft: "16px",
													marginRight: "6px",
													fontSize: "default",
													color: theme.palette.text.primary,
												}}
											/>
											<Typography
												fontFamily={theme.typography.fontFamily}
												variant="body2"
												fontWeight="600"
												sx={{
													opacity: 0.6,
													fontSize: "default",
													color: theme.palette.text.primary,
												}}
											>
												{post.published ? (
													<PostViews
														viewCount={views}
														sx={{
															fontSize: theme.typography.fontSize,
															color: theme.palette.text.primary,
															fontFamily: theme.typography.fontFamily,
														}}
													/>
												) : (
													"———"
												)}
											</Typography>
										</Box>
									</Box>
								</Box>
								{/* EditorJS rendering */}
								<Box
									id="output"
									mb={1}
									sx={{
										backgroundColor: "transparent",
										userSelect: "text",
									}}
								>
									{OutputElement}
								</Box>
								<Box flexGrow={100} />
								{/* Share and applause section */}
								<Box mt={6} sx={{ userSelect: "none" }}>
									{/* Horizontal lines */}
									<Box display="flex" justifyContent="center" alignItems="center">
										<Box
											style={{
												width: "100%",
												borderBottom: "2px solid rgba(100,100,100,0.2)",
											}}
										/>
										<Box display="flex">
											{/* Share */}
											<Box ml={3}>
												<NavbarButton
													disabled={!post.published}
													variant="outline"
													onClick={() => {
														isMobile
															? handleSharing({
																	url: typeof window !== "undefined" ? window.location.href : "",
																	title: post.title,
																	text: "",
																	icon: post.ogImage.src || DATA_DEFAULTS.images.openGraph,
																	fallback: () => setOpenShareModal(true),
															  })
															: setOpenShareModal(true);
													}}
													icon={TbShare2}
													tooltip="Share"
													sxButton={{
														height: "36px",
														width: "36px",
														// "&:disabled": { opacity: "0.5" },
													}}
													styleIcon={{ height: "22px", width: "24px", opacity: !post.published ? "0.5" : "1" }}
												/>
											</Box>

											{/* Confetti */}
											<Box mx={1}>
												<NavbarButton
													disabled={isExploding}
													variant="outline"
													onClick={() => {
														setIsExploding(true);
														setTimeout(() => {
															setIsExploding(false);
														}, 3500);
													}}
													icon={TbConfetti}
													tooltip="Celebrate with me"
													sxButton={{
														height: "36px",
														width: "36px",
													}}
													styleIcon={{ height: "22px", width: "24px", opacity: isExploding ? "0.5" : "1" }}
												/>
											</Box>

											{/* Paypal */}
											<Box mr={3}>
												<NavbarButton
													variant="outline"
													href="https://www.paypal.com/donate/?hosted_button_id=MJFHZZ2RAN7HQ"
													icon={BiCoffeeTogo}
													tooltip="Donate cacao"
													sxButton={{
														height: "36px",
														width: "36px",
													}}
													styleIcon={{ height: "22px", width: "24px" }}
												/>
											</Box>
										</Box>
										<Box
											style={{
												width: "100%",
												borderBottom: "2px solid rgba(100,100,100,0.2)",
											}}
										/>
									</Box>
								</Box>
								<Box mt={3} mb={3} display="flex" flexDirection="column">
									<Typography
										variant="body1"
										fontFamily={theme.typography.fontFamily}
										color={theme.palette.text.primary}
										sx={{ opacity: 0.6 }}
									>
										Author: {post.author}
									</Typography>
									{post.updatedAt &&
										post.updatedAt !== -1 && ( // Go from -1 to null for each none-updated yet, but some have -1 value
											<Typography
												variant="body1"
												fontFamily={theme.typography.fontFamily}
												color={theme.palette.text.primary}
												sx={{ opacity: 0.6 }}
											>
												Last updated:{" "}
												{new Date(post.updatedAt).toLocaleDateString("en-GB", {
													// weekday: "long",
													day: "2-digit",
													month: "short",
													year: "numeric",
													timeZone: "Europe/Oslo",
												})}
											</Typography>
										)}
								</Box>
								{/* Comment section */}
								<Box mb={3} ref={toggleRef}>
									<Toggle
										open={toggleRCOpen}
										handleClick={() => {
											setToggleRCOpen(!toggleRCOpen);
										}}
										title={"Reactions & Comments"}
										accordionSx={
											discussionData.locked === true
												? {
														".MuiAccordionDetails-root": {
															maxHeight: "250px",
														},
												  }
												: {}
										}
									>
										<Box
											sx={
												discussionData.locked === true
													? { position: "relative", maxHeight: "250px", height: "250px" }
													: { height: "100%" }
											}
										>
											<Giscus
												repo={`${process.env.NEXT_PUBLIC_GISCUS_USER}/${process.env.NEXT_PUBLIC_GISCUS_REPO}`}
												repoId={process.env.NEXT_PUBLIC_GISCUS_REPOID!}
												categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORYID}
												id="comments"
												category="Comments"
												mapping="specific"
												term={`Post: ${postId}`}
												strict="1"
												reactionsEnabled="1"
												emitMetadata="1"
												inputPosition="top"
												theme={theme.palette.mode === "light" ? "light" : "dark"}
												lang="en"
												// loading="lazy"
											/>
											{discussionData.locked === true && (
												<Typography
													my={1}
													textAlign="center"
													fontFamily={theme.typography.fontFamily}
													variant="body1"
													fontWeight="600"
													sx={{ color: theme.palette.text.disabled, position: "absolute", bottom: 2 }}
												>
													The comment section has been deactivated for this post.
												</Typography>
											)}
										</Box>
									</Toggle>
								</Box>
							</Stack>
						</Grid>
						<Footer />
					</Grid>
					{/* Exploding animation if active */}
					{isExploding && (
						<Box
							sx={{
								position: "fixed",
								bottom: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								overflow: "visible",
								// zIndex: 99999,
								zIndex: 5,
								display: "inline-block",
							}}
						>
							<ConfettiExplosion
								force={isMobile ? 0.8 : 0.6}
								duration={4000}
								particleCount={250}
								height={height - 100}
								width={xs ? width + 200 : width - 100}
								// height={1000}
								// width={1000}
							/>
						</Box>
					)}
					{/* Render buttonBar */}
					<Box height="100%" ref={containerRef} sx={{ width: "100vw", display: "flex", justifyContent: "center" }}>
						<ButtonBar
							className="buttonBar"
							sx={{ position: "fixed", bottom: "-100px", zIndex: 1000 }}
							buttons={buttonBarButtons}
						/>
					</Box>
				</Box>
			</Box>
		</>
	);
};
export default ReadPostPage;
