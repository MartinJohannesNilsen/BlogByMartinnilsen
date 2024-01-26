import Giscus from "@giscus/react";
import {
	AccessTime,
	ArrowBack,
	Bookmark,
	BookmarkBorder,
	CalendarMonth,
	Edit,
	IosShareOutlined,
	MenuBook,
	Visibility,
} from "@mui/icons-material";
import { Box, ButtonBase, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { FC, useEffect, useMemo, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { isMobile } from "react-device-detect";
import { renderToStaticMarkup } from "react-dom/server";
import { BiCoffeeTogo } from "react-icons/bi";
import { TbConfetti, TbShare2 } from "react-icons/tb";
import useWindowSize from "react-use/lib/useWindowSize";
import useAuthorized from "../../components/AuthorizationHook/useAuthorized";
import { style } from "../../components/EditorJS/style";
import Footer from "../../components/Footer/Footer";
import SettingsModal from "../../components/Modals/SettingsModal";
import ShareModal from "../../components/Modals/ShareModal";
import TOCModal, { extractHeaders } from "../../components/Modals/TOCModal";
import SEO, { DEFAULT_OGIMAGE } from "../../components/SEO/SEO";
import { getAllPostIds } from "../../database/overview";
import { getPost } from "../../database/posts";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { ReadArticleViewProps } from "../../types";
// import dynamic from "next/dynamic";
// Got an error when revalidating pages on vercel, the line below fixed it, but removes toc as it does not render that well.
// const Output = dynamic(() => import("editorjs-react-renderer"), { ssr: false });
import Output from "editorjs-react-renderer";
import Image from "next/image";
import logo from "public/assets/imgs/terminal.png";
import useSWR from "swr";
import { useEventListener } from "usehooks-ts";
import { NavbarButton } from "../../components/Buttons/NavbarButton";
import ProfileMenu from "../../components/Menus/ProfileMenu";
import NotificationsModal, {
	checkForUnreadRecentNotifications,
	notificationsApiFetcher,
} from "../../components/Modals/NotificationsModal";
import Toggle from "../../components/Toggles/Toggle";
import useStickyState from "../../utils/useStickyState";

// EditorJS renderers
import CustomCallout from "../../components/EditorJS/Renderers/CustomCallout";
import CustomChecklist from "../../components/EditorJS/Renderers/CustomChecklist";
import CustomCode from "../../components/EditorJS/Renderers/CustomCode";
import CustomDivider from "../../components/EditorJS/Renderers/CustomDivider";
import CustomHeader from "../../components/EditorJS/Renderers/CustomHeader";
import CustomIframe from "../../components/EditorJS/Renderers/CustomIframe";
import CustomImage from "../../components/EditorJS/Renderers/CustomImage";
import CustomLinkTool from "../../components/EditorJS/Renderers/CustomLinkTool";
import CustomList from "../../components/EditorJS/Renderers/CustomList";
import CustomMath from "../../components/EditorJS/Renderers/CustomMath";
import CustomParagraph from "../../components/EditorJS/Renderers/CustomParagraph";
import CustomQuote from "../../components/EditorJS/Renderers/CustomQuote";
import CustomTable from "../../components/EditorJS/Renderers/CustomTable";
import CustomToggle from "../../components/EditorJS/Renderers/CustomToggle";
import CustomVideo from "../../components/EditorJS/Renderers/CustomVideo";
import PostViews from "../../components/PostViews/PostViews";
import PostNavbar from "../../components/Navbar/PostNavbar";
// import CustomPersonality from "../../components/EditorJS/Renderers/_CustomPersonality";

export async function getStaticPaths() {
	const idList = await getAllPostIds(false); // Not filter on visibility
	const paths: string[] = [];
	idList.forEach((id) => {
		paths.push(`/posts/${id}`);
	});
	return { paths, fallback: "blocking" };
}

export const getStaticProps = async (context: any) => {
	const postId = context.params.postId as string;
	const post = await getPost(postId);
	if (!post) {
		return {
			notFound: true, //redirects to 404 page
		};
	}
	return {
		props: {
			post,
			postId,
		},
	};
};

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

type NavigatorShareProps = {
	url?: string; // The URL of the webpage you want to share
	title?: string; // The title of the shared content, although may be ignored by the target
	text: string; // The description or text to accompany the shared content
	icon?: string; // URL of the image for the preview
	fallback?: () => void; // Fallback method
};

export const handleSharing = async (shareDetails: NavigatorShareProps) => {
	if (navigator.share) {
		try {
			await navigator.share(shareDetails);
		} catch (error) {}
	} else {
		// fallback code
		shareDetails.fallback && shareDetails.fallback();
	}
};

export function processJsonToggleBlocks(inputJson) {
	// Deep copy the input JSON object
	let json = JSON.parse(JSON.stringify(inputJson));

	if (Array.isArray(json.blocks)) {
		// Initialize a new array for processed blocks
		let newBlocks = [];

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

export const ReadArticleView: FC<ReadArticleViewProps> = (props) => {
	const post = props.post;
	const { isAuthorized, session, status } =
		process.env.NEXT_PUBLIC_LOCALHOST === "true"
			? {
					isAuthorized: true,
					session: {
						user: {
							name: "Martin the developer",
							email: "martinjnilsen@gmail.com",
							image: "https://mjntech.dev/_next/image?url=%2Fassets%2Fimgs%2Fmjntechdev.png&w=256&q=75",
						},
						expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // A year ahead
					},
					status: "authenticated",
			  }
			: useAuthorized(!post.published);
	const { theme, setTheme } = useTheme();
	const [isExploding, setIsExploding] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const { width, height } = useWindowSize();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const sm = useMediaQuery(theme.breakpoints.only("sm"));
	const mdDown = useMediaQuery(theme.breakpoints.down("md"));
	const handleNavigate = (path: string) => {
		window.location.href = path;
	};
	const [currentSection, setCurrentSection] = useState(post.title);

	const OutputElement = useMemo(() => {
		if (post && post.data && post.data.blocks && Array.isArray(post.data.blocks)) {
			const processedData = processJsonToggleBlocks(post.data);
			return <Output renderers={renderers} data={processedData} style={style(theme)} />;
		}
		return null;
	}, [post]);

	useEffect(() => {
		// Increase view count in supabase db
		// Esure not on localhost
		process.env.NEXT_PUBLIC_LOCALHOST === "false" &&
			// Ensure published post
			post.published &&
			// Ensure either unauthenticated or authenticated without being admin
			(status === "unauthenticated" ||
				(status === "authenticated" && session && session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)) &&
			// All criterias are met, run POST request to increment counter
			fetch(`/api/views/${props.postId}`, {
				method: "POST",
				headers: {
					apikey: process.env.NEXT_PUBLIC_API_AUTHORIZATION_TOKEN,
				},
			});
		// When session is updated, not loading anymore
		setIsLoading(false);
	}, [session]);

	useEffect(() => {
		if (typeof window !== "undefined" && window.location.hash) {
			handleNavigate(window.location.hash);
		}
	}, [isLoading]);

	const OutputString = useMemo(() => {
		return renderToStaticMarkup(OutputElement);
	}, [OutputElement]);

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

	// ShareModal
	const [openShareModal, setOpenShareModal] = useState(false);

	if (!post.published && !isAuthorized) return <></>;
	return (
		<SEO
			pageMeta={{
				title: post.title,
				description: post.description,
				themeColor: isMobile ? theme.palette.primary.dark : theme.palette.primary.main,
				canonical: "https://blog.mjntech.dev/posts/" + props.postId,
				openGraph: {
					url: "https://blog.mjntech.dev/posts/" + props.postId,
					image: post.ogImage.src || DEFAULT_OGIMAGE,
					type: "article",
					article: {
						published: new Date(post.createdAt),
						keywords: post.tags,
					},
				},
			}}
		>
			<Box width="100%">
				{isLoading ? (
					<></>
				) : !post ? (
					<></>
				) : !post.published && status === "loading" ? (
					<></>
				) : (
					<Box
						width="100%"
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						justifyItems="center"
						sx={{ backgroundColor: theme.palette.primary.main }}
					>
						{/* Navbar */}
						<PostNavbar
							post={{ ...post, id: props.postId }}
							toc={{ content: OutputString, currentSection: currentSection }}
							shareModal={{ open: openShareModal, setOpen: setOpenShareModal }}
						/>
						{/* Content */}
						<Grid
							container
							width="100%"
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
										minHeight: isMobile ? "calc(100vh - 81px - 30px)" : "calc(100vh - 67px - 117px)",
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
										mt={isMobile ? 6 : 0}
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
											<Box
												display="flex"
												mt={mdDown ? 1 : 2}
												mb={xs ? 0 : 1}
												justifyContent="center"
												alignItems="center"
											>
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
															postId={props.postId}
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
																		icon: post.ogImage.src || DEFAULT_OGIMAGE,
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
														styleIcon={{ height: "22px", width: "24px", opacity: !post.published && "0.5" }}
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
														styleIcon={{ height: "22px", width: "24px", opacity: isExploding && "0.5" }}
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
										{post.updatedAt && post.updatedAt !== -1 && (
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
												})}
											</Typography>
										)}
									</Box>
									{/* Comment section */}
									<Box mb={3}>
										<Toggle title={"Reactions & Comments"}>
											<Giscus
												repo={`${process.env.NEXT_PUBLIC_GISCUS_USER}/${process.env.NEXT_PUBLIC_GISCUS_REPO}`}
												repoId={process.env.NEXT_PUBLIC_GISCUS_REPOID}
												categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORYID}
												id="comments"
												category="Comments"
												mapping="url"
												term="Welcome to the comment section!"
												strict="1"
												reactionsEnabled="1"
												emitMetadata="0"
												inputPosition="top"
												theme={theme.palette.mode === "light" ? "light" : "dark"}
												lang="en"
												loading="lazy"
											/>
										</Toggle>
									</Box>
								</Stack>
							</Grid>
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
								/>
							</Box>
						)}
						<Footer />
					</Box>
				)}
			</Box>
		</SEO>
	);
};
export default ReadArticleView;
