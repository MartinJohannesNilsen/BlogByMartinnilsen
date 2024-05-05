"use client";
import { useGSAP } from "@gsap/react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import gsap from "gsap";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import CustomHeader from "../../components/EditorJS/Renderers/CustomHeader";
import CustomParagraph from "../../components/EditorJS/Renderers/CustomParagraph";
import Footer from "../../components/Navigation/LinkFooter";
import Navbar from "../../components/Navigation/Navbar";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ServerPageProps } from "../../types";
import useStickyState from "../../utils/useStickyState";

const AboutPage = ({ sessionUser, postsOverview, isAuthorized }: ServerPageProps) => {
	const { theme } = useTheme();
	const [isLoading, setIsLoading] = useState(true);
	const [_, setCardLayout] = useStickyState("cardLayout", "plain");
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
	const searchParams = useSearchParams();

	useEffect(() => {
		setIsLoading(false);
		return () => {};
	}, []);

	useEffect(() => {
		// Go to hash if present
		if (typeof window !== "undefined" && window.location.hash) {
			window.location.href = window.location.hash;
		}
	}, [isLoading, searchParams]);

	// Animation
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
		}
	}, []);
	// Animations with GSAP
	const containerRef = useRef();
	useGSAP(
		() => {
			// Animations
			const navBarAnimation = gsap.to(".navBar", {
				y: "-60px",
				paused: true,
				duration: 0.4,
			});

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
				} else if (scrollDirection === 1 && scrollDistance >= distanceToTrigger) {
					// Scrolling downwards
					if (
						(process.env.NEXT_PUBLIC_HIDE_NAVBAR_DESKTOP === "true" && !isMobile) ||
						(process.env.NEXT_PUBLIC_HIDE_NAVBAR_MOBILE === "true" && isMobile)
					) {
						navBarAnimation.play();
					}
				}

				lastScrollTop = scrollTop;
			});
			return () => {
				removeEventListener("scroll", this!);
			};
		},
		{ dependencies: [isLoading], scope: containerRef }
	);

	if (isLoading) return <></>;
	return (
		<Box
			ref={containerRef}
			sx={{ minHeight: "100vh", width: "100vw", backgroundColor: theme.palette.primary.main }}
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			<Navbar posts={postsOverview} setCardLayout={setCardLayout} className="navBar" isAuthorized={isAuthorized} />
			<Box pt={10} pb={6} px={2.5} sx={{ maxWidth: lgUp ? "750px" : xs ? "480px" : "600px" }}>
				{/* Title */}
				<Typography variant="h3" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
					About
				</Typography>
				{/* Introduction */}
				<Typography
					mt={2}
					mb={1}
					variant="body1"
					sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
				>
					Hi. My name is Martin, and I am the creator of this Tech Blog. In this section, I would like to cover aspects
					such as terms of usage, data privacy, external services and how you can best support me. Let's have a look,
					shall we?
				</Typography>

				{/* Section 1: Terms */}
				<CustomHeader data={{ level: 2, text: "Terms" }} />
				<CustomParagraph
					data={{
						text: `The content on this site is provided for free and is intended to be used for informational purposes only. The
						views expressed on this site are my own and do not reflect the views of my employer or any other organization I
						am affiliated with.`,
					}}
					style={{
						box: { my: 0 },
						typography: {
							...theme.typography.body1,
							pt: 0.0,
							pb: 0.6,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitBoxOrient: "vertical",
						},
					}}
				/>

				{/* Section 2: Privacy */}
				<CustomHeader data={{ level: 2, text: "Privacy" }} />
				<CustomParagraph
					data={{
						text: `The site implicitly does not collect any identifiable data. 
							   All user-specific data is either 
							   (1) fetched from a service provider such as Google or Github, if specifically authorized, or 
							   (2) stored in your browser's local storage.`,
					}}
					style={{
						box: { my: 0 },
						typography: {
							...theme.typography.body1,
							pt: 0.6,
							pb: 0.6,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitBoxOrient: "vertical",
						},
					}}
				/>
				<CustomParagraph
					data={{
						text: `The current scope of the site does not allow users to 
						create an account, although one may log in using either Google or Github.
						This will only personalize a small fraction of the experience, and is used mainly
						for access control. The fields gathered from the providers are <b><i>email</i></b>,
						<b><i>name</i></b> and <b><i>icon</i></b>.`,
					}}
					style={{
						box: { my: 0 },
						typography: {
							...theme.typography.body1,
							pt: 0.6,
							pb: 0.6,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitBoxOrient: "vertical",
						},
					}}
				/>
				<CustomParagraph
					data={{
						text: `Some data is stored locally to enhance the user experience
						       coming back to the page. That is, decisions that are made,
							   such as the user's preferred layout and theme, is stored in
							   your browser.
							   The stored fields are:`,
					}}
					style={{
						box: {},
						typography: {
							...theme.typography.body1,
							pt: 0.6,
							pb: 0,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitBoxOrient: "vertical",
						},
					}}
				/>
				<CustomParagraph
					data={{
						text: `<ul>
						<li><code>theme</code>: Dark/light mode. Defaults to system default</li>
						<li><code>accent</code>: Accent color</li>
						<li><code>font</code>: Font family</li>
						<li><code>cardLayout</code>: Card layout on landing page</li>
						<li><code>lastRead</code>: Date as number for notifications</li>
						<li><code>notificationsRead</code>: List of read notification ids</li>
						<li><code>notificationFilterDays</code>: Filter period in days</li>
						<li><code>savedPosts</code>: List of saved post ids</li>
						</ul>`,
					}}
					style={{
						box: { mx: -1.5, my: -0.5 },
						typography: {
							...theme.typography.body2,
							fontWeight: 600,
							userSelect: "none",
						},
					}}
				/>
				<CustomParagraph
					data={{
						text: `These will be cleared if you clear your browsing data, or can be manually reset in the settings modal, accessible from the navbar profile menu.`,
					}}
					style={{
						box: {},
						typography: {
							...theme.typography.body1,
							pt: 0.6,
							pb: 0,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitBoxOrient: "vertical",
						},
					}}
				/>

				<CustomParagraph
					data={{
						text: `Regarding general data, a few notes can be made. 
						First, a numeric counter for the total amount of visitors per
						post is stored in a <a href="https://supabase.com">Supabase</a> database.
						Additionally, I self-host an <a href="https://umami.is">Umami</a> server for analyzing web traffic - promising 
						data privacy, no cookie usage, and GDPR & CCPA compliance. I want to emphasize the fact
						that none of these data points can be used to identify any of the 
						readers of this site, nor be used in targeted advertisements.`,
					}}
					style={{
						box: { my: 0 },
						typography: {
							...theme.typography.body1,
							pt: 0.6,
							pb: 0.6,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitBoxOrient: "vertical",
						},
					}}
				/>

				{/* Section 3: Services */}
				<CustomHeader data={{ level: 2, text: "Services" }} />
				<CustomParagraph
					data={{
						text: `This page utilize external services for certain aspects, all of which are:`,
					}}
					style={{
						box: { my: 0 },
						typography: {
							...theme.typography.body1,
							pt: 0.6,
							pb: 0.6,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitBoxOrient: "vertical",
						},
					}}
				/>
				<>
					<CustomParagraph
						data={{
							text: "<a href='https://firebase.google.com'>Firebase</a>, a Google product, specifically their document database for blog post storage. Except for new version builds, the documents are fetched only when creating or updating posts, using Next.js caching and tag-based revalidation.",
						}}
						style={{
							typography: { ...theme.typography.body2, fontWeight: 600 },
						}}
					/>
					<CustomParagraph
						data={{
							text: "<a href='https://giscus.app'>Giscus</a> is used for post reactions and comments. Each comment section serves as a wrapper for a GitHub discussion per post.",
						}}
						style={{
							typography: { ...theme.typography.body2, fontWeight: 600 },
						}}
					/>
					<CustomParagraph
						data={{
							text: "<a href='https://github.com'>GitHub</a> and <a href='https://www.google.com/'>Google</a> are used for authenticating users. Only the elements <b><i>email</i></b>, <b><i>name</i></b> and <b><i>icon</i></b> will be accessed.",
						}}
						style={{
							typography: { ...theme.typography.body2, fontWeight: 600 },
						}}
					/>
					<CustomParagraph
						data={{
							text: "<a href='https://supabase.com'>Supabase</a> is used for managing notifications, in addition to storing numeric view counts per post.",
						}}
						style={{
							typography: { ...theme.typography.body2, fontWeight: 600 },
						}}
					/>
				</>

				{/* Section 4: Support */}
				<CustomHeader data={{ level: 2, text: "Support" }} />
				<CustomParagraph
					data={{
						text: `
						Thank you for even reading this section. 
						First of all, I appreciate you sharing posts you find helpful, and subscribing to a feed (<code>/feed/[rss.xml/rss.json/atom.xml]</code>) for not missing any new content. 
						Second, I highly appreciate any reactions, comments and/or feedback you may have.
						Furthermore, you can donate/buy me a hot cocoa using the link in the footer. 
						I do not use advertisements on this site, and have not been that fixated on earning money on my posts.
						It has mostly been a platform for me to write about the cool stuff I learn on my SE journey, retaining knowledge
						and challenging myself into explaining concepts for a better understanding.
						Finally, if you are a company or an individual that is looking to cooperate/sponsor me in any way, you can reach
						out to me using any of the social media links or contact information found in my portfolio, all available in the footer below.`,
					}}
					style={{
						box: { my: 0 },
						typography: {
							...theme.typography.body1,
							pt: 0.6,
							pb: 0.6,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitBoxOrient: "vertical",
						},
					}}
				/>

				{/* Section 5: Final words
				<CustomHeader data={{ level: 2, text: "Final words" }} />
				<CustomParagraph
					data={{
						text: `
						Wihu`,
					}}
					style={{
						box: { my: 0 },
						typography: {
							...theme.typography.body1,
							pt: 0.6,
							pb: 0.6,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitBoxOrient: "vertical",
						},
					}}
				/> */}
			</Box>
			<Footer />
		</Box>
	);
};
export default AboutPage;
