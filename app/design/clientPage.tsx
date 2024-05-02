"use client";

import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import useStickyState from "../../utils/useStickyState";
import { ServerPageProps } from "../../types";
import { MenuIcon } from "../../components/Icons/MenuIcon";

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

	if (isLoading) return <></>;
	return (
		<Box sx={{ minHeight: "100vh", width: "100vw", backgroundColor: theme.palette.primary.main }}>
			<Navbar posts={postOverview} setCardLayout={setCardLayout} />
			<Box pt={10} sx={{ paddingX: lgUp ? "150px" : xs ? "10px" : "80px" }}>
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
		</Box>
	);
};
export default DesignPage;
