"use client";
import Footer from "@/components/Navigation/LinkFooter";
import Navbar from "@/components/Navigation/Navbar";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { ServerPageProps } from "@/types";
import useStickyState from "@/utils/useStickyState";
import { useGSAP } from "@gsap/react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import gsap from "gsap";
import { Metadata } from "next";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

export const metadata: Metadata = {
	title: "Design",
};

const DesignPage = ({ sessionUser, postsOverview, isAuthorized }: ServerPageProps) => {
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
		<Box
			ref={containerRef}
			sx={{
				height: "calc(100% - 185px)",
				width: "100vw",
				backgroundColor: theme.palette.primary.main,
			}}
		>
			<Navbar
				posts={postsOverview}
				setCardLayout={setCardLayout}
				className="navBar"
				isAuthorized={isAuthorized}
				sessionUser={sessionUser}
			/>
			<Box pt={10} pb={6} sx={{ paddingX: lgUp ? "150px" : xs ? "10px" : "80px", height: "100%", width: "100%" }}>
				<Typography
					pb={2}
					variant="h3"
					sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}
				>
					Design System
				</Typography>
				<Box
					sx={{
						height: "100%",
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignContent: "center",
						alignItems: "center",
						justifyContent: "center",
						justifyItems: "center",
						textAlign: "center",
					}}
				>
					<Typography
						variant="body1"
						sx={{
							fontFamily: theme.typography.fontFamily,
							color: theme.palette.primary.contrastText,
							border:
								"1px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[500] : theme.palette.grey[300]),
							borderRadius: 2,
							backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
							p: "4px 8px",
							width: "default",
						}}
					>
						Coming soon
					</Typography>
				</Box>
			</Box>
			<Footer />
		</Box>
	);
};
export default DesignPage;
