"use client";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { Box } from "@mui/material";

export default function Loading() {
	const { theme } = useTheme();

	return (
		<Box
			height="100%"
			width="100%"
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			justifyItems="center"
			sx={{ backgroundColor: theme.palette.primary.main }}
		></Box>
	);
}
