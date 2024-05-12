"use client";
import { createTheme } from "@mui/material";
import { baseTheme, defaultAccentColorDark } from "./themeDefaults";

export const dark = createTheme({
	palette: {
		...baseTheme.palette,
		mode: "dark",
		background: {
			// default: baseTheme.palette.background.default,
			default: "#161518",
			// default: "green",
			paper: "#1C1C1C",
		},
		text: {
			primary: "#FFFFFF",
			secondary: "#000000",
		},
		// background
		primary: {
			contrastText: "#fbfbfb",
			main: "#161518",
			dark: "#141315",
			light: "#141315",
		},
		// accent color
		secondary: {
			main:
				(typeof window !== "undefined" && localStorage.getItem("accent")?.replace('"', "")) ||
				defaultAccentColorDark.hex,
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
export default dark;
