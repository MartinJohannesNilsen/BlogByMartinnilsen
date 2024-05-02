"use client";

import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { useEffect, useState } from "react";
import { ServerPageProps } from "../../types";
import useStickyState from "../../utils/useStickyState";
import Navbar from "../../components/Navbar/Navbar";

const AboutPage = ({ sessionUser, postOverview, isAuthorized }: ServerPageProps) => {
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
				<Typography variant="h3" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.primary }}>
					About
				</Typography>
			</Box>
		</Box>
	);
};
export default AboutPage;
