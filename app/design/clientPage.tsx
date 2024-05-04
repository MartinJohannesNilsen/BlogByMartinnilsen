"use client";

import { useGSAP } from "@gsap/react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import gsap from "gsap";
import { Metadata } from "next";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { MenuIcon } from "../../components/Icons/MenuIcon";
import Navbar from "../../components/Navbar/Navbar";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ServerPageProps } from "../../types";
import useStickyState from "../../utils/useStickyState";
import Footer from "../../components/Footer/LinkFooter";

export const metadata: Metadata = {
	title: "Design",
};

const DesignPage = ({ sessionUser, postOverview, isAuthorized }: ServerPageProps) => {
	const { theme } = useTheme();
	const [isLoading, setIsLoading] = useState(true);
	const [_, setCardLayout] = useStickyState("cardLayout", "plain");
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

	useEffect(() => {
		setIsLoading(false);
		return () => {};
	}, []);

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
		<Box ref={containerRef} sx={{ minHeight: "100vh", width: "100vw", backgroundColor: theme.palette.primary.main }}>
			<Navbar posts={postOverview} setCardLayout={setCardLayout} className="navBar" isAuthorized={isAuthorized} />
			<Box pt={10} pb={6} sx={{ paddingX: lgUp ? "150px" : xs ? "10px" : "80px" }}>
				<Typography
					pb={2}
					variant="h3"
					sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
				>
					Design System
				</Typography>
				{/* Logo */}
				<Box py={2}>
					<Typography variant="h4" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
						Logo
					</Typography>
					<Box pt={2}>
						<MenuIcon width={44} height={44} fill={theme.palette.text.primary} style={{ fillRule: "evenodd" }} />
					</Box>
				</Box>
				{/* Typography */}
				<Box py={2}>
					<Typography variant="h4" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
						Typography
					</Typography>
					<Box pt={1}>
						<Typography
							variant="body1"
							sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
						>
							TODO Describe available fonts and fontsizes. Each font in different weights
						</Typography>
					</Box>
				</Box>
				{/* Colors */}
				<Box py={2}>
					<Typography variant="h4" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
						Colors
					</Typography>
					<Box pt={1}>
						<Typography
							variant="body1"
							sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
						>
							TODO Circle with all colors that is available. Primary main, dark, light. Background and foreground.
							Secondary color options in settings.
						</Typography>
					</Box>
				</Box>
				{/* Buttons and Links*/}
				<Box py={2}>
					<Typography variant="h4" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
						Buttons and Links
					</Typography>
					<Box pt={1}>
						<Typography
							variant="body1"
							sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
						></Typography>
					</Box>
				</Box>
				{/* Switch */}
				<Box py={2}>
					<Typography variant="h4" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
						Switch
					</Typography>
					<Box pt={1}>
						<Typography
							variant="body1"
							sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
						></Typography>
					</Box>
				</Box>
				{/* Select */}
				<Box py={2}>
					<Typography variant="h4" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
						Select
					</Typography>
					<Box pt={1}>
						<Typography
							variant="body1"
							sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
						></Typography>
					</Box>
				</Box>
				{/* TextField */}
				<Box py={2}>
					<Typography variant="h4" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
						TextField
					</Typography>
					<Box pt={1}>
						<Typography
							variant="body1"
							sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
						></Typography>
					</Box>
				</Box>
				{/* Pills */}
				<Box py={2}>
					<Typography variant="h4" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
						Pills
					</Typography>
					<Box pt={1}>
						<Typography
							variant="body1"
							sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
						></Typography>
					</Box>
				</Box>
				{/* Cards */}
				<Box py={2}>
					<Typography variant="h4" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
						Cards
					</Typography>
					<Box pt={1}>
						<Typography
							variant="body1"
							sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
						></Typography>
					</Box>
				</Box>
				{/* Modals */}
				<Box py={2}>
					<Typography variant="h4" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
						Modals
					</Typography>
					<Box pt={1}>
						<Typography
							variant="body1"
							sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
						></Typography>
					</Box>
				</Box>
				{/* EditorJS Components */}
				<Box py={2}>
					<Typography variant="h4" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
						EditorJS Rendered Components
					</Typography>
					<Box pt={1}>
						<Typography
							variant="body1"
							sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
						></Typography>
					</Box>
				</Box>
			</Box>
			<Footer />
		</Box>
	);
};
export default DesignPage;
