"use client";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { Box } from "@mui/material";

const CustomDivider = () => {
	const { theme } = useTheme();

	return (
		<Box
			sx={{
				width: "80%",
				marginLeft: "10%",
				marginY: "60px",
				borderBottom: "3px solid " + theme.palette.secondary.main,
				opacity: 0.6,
				borderRadius: 5,
			}}
		/>
	);
};
export default CustomDivider;
