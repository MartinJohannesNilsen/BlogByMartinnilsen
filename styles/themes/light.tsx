"use client";
import { createTheme } from "@mui/material";
import { baseTheme } from "./themeDefaults";

export const light = createTheme({
	palette: {
		mode: "light",
		background: {
			// default: baseTheme.palette.background.default,
			default: "#FFFFFF",
			paper: "#f7faf9",
		},
		text: {
			primary: "#000000",
			secondary: "#FFFFFF",
		},
		// background
		primary: {
			contrastText: "#161518",
			main: "#FFFFFF",
			dark: "#fcfcfc",
			light: "#F5F5F7",
		},
		// accent color
		secondary: {
			main:
				(typeof window !== "undefined" &&
					localStorage.getItem("accent") &&
					JSON.parse(String(localStorage.getItem("accent")))) ||
				"#29939b",
		},
		grey: {
			600: "#585d63",
			700: "#3e4347",
			800: "#25272D",
		},
	},
	breakpoints: baseTheme.breakpoints,
	components: baseTheme.components,
	typography: baseTheme.typography,
});
export default light;
