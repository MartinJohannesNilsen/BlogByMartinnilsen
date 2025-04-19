"use client";
import * as fonts from "@/styles/fonts";
import { createTheme } from "@mui/material";

// Functions
export function getFontFamilyFromVariable(variable?: string) {
	return !variable
		? defaultFontFamily // If not specified, return default
		: fonts.availableFontFamilies.hasOwnProperty(variable) && fonts.availableFontFamilies[variable]
		? fonts.availableFontFamilies[variable] // If available, return font
		: variable; // If not available, return variable string
}

// Defaults
export const defaultAccentColorLight = { hex: "#333333", name: "Contrast" };
export const defaultAccentColorDark = { hex: "#dddddd", name: "Contrast" };
export const defaultFontFamily = fonts.inter.style.fontFamily;
export const defaultFontFamilyVariable = "--font-inter";
export const defaultFontScale = "1";

// Create base theme
export const defaultTheme = createTheme({ cssVariables: true });
// Find default values here: https://mui.com/material-ui/customization/default-theme/
export const baseTheme = createTheme({
	cssVariables: true,
	typography: {
		fontFamily:
			(typeof window !== "undefined" && localStorage.getItem("fontFamily")) || undefined
				? getFontFamilyFromVariable((typeof window !== "undefined" && localStorage.getItem("fontFamily")) || undefined)
				: defaultFontFamily,
		fontSize: 14,
		// Headings
		// Usage:
		h1: { fontSize: "calc(4rem * var(--font-scale))" },
		// Usage:
		h2: { fontSize: "calc(3.5rem * var(--font-scale))" },
		// Usage:
		h3: {
			fontSize: "calc(2rem * var(--font-scale))",
			fontWeight: 800,
			[defaultTheme.breakpoints.only("sm")]: {
				fontSize: "calc(32px * var(--font-scale))",
			},
			[defaultTheme.breakpoints.only("xs")]: {
				fontSize: "calc(24px * var(--font-scale))",
			},
		},
		// Usage:
		h4: {
			fontWeight: 800,
			fontSize: "calc(1.6rem * var(--font-scale))",
			[defaultTheme.breakpoints.only("sm")]: {
				fontSize: "calc(24px * var(--font-scale))",
			},
			[defaultTheme.breakpoints.only("xs")]: {
				fontSize: "calc(22px * var(--font-scale))",
			},
		},
		// Usage:
		h5: {
			fontWeight: 800,
			fontSize: "calc(1.3rem * var(--font-scale))",
			[defaultTheme.breakpoints.only("sm")]: {
				fontSize: "calc(22px * var(--font-scale))",
			},
			[defaultTheme.breakpoints.only("xs")]: {
				fontSize: "calc(20px * var(--font-scale))",
			},
		},
		// Usage:
		h6: {
			fontWeight: 800,
			fontSize: "calc(1.15rem * var(--font-scale))",
			[defaultTheme.breakpoints.only("sm")]: {
				fontSize: "calc(20px * var(--font-scale))",
			},
			[defaultTheme.breakpoints.only("xs")]: {
				fontSize: "calc(18px * var(--font-scale))",
			},
		},

		// Subtitles
		// Usage:
		subtitle1: {
			fontSize: "calc(1rem * var(--font-scale))",
		},
		// Usage:
		subtitle2: {
			fontSize: "calc(0.875rem * var(--font-scale))",
		},

		// Bodies
		// Usage:
		body1: {
			fontSize: "calc(1rem * var(--font-scale))",
			fontWeight: 400, // 500
		},
		// Usage:
		body2: {
			fontSize: "calc(0.875rem * var(--font-scale))",
		},

		// Buttons
		button: {
			// fontSize: "1rem",
			fontSize: "calc(1rem * var(--font-scale))",
			fontWeight: 800,
		},

		// Caption
		caption: {
			fontSize: "calc(0.75rem * var(--font-scale))",
		},

		// Tooltips
		overline: {
			// fontSize: "0.75rem", // Default
			fontSize: "calc(0.7rem * var(--font-scale))",
			fontWeight: 800,
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {},
			},
		},

		// SearchField Input
		MuiFilledInput: {
			styleOverrides: {
				root: {
					backgroundColor: "transparent",
					"&:hover": {
						backgroundColor: "transparent",
						// Reset on touch devices, it doesn't add specificity
						"@media (hover: none)": {
							backgroundColor: "transparent",
						},
					},
					"&.Mui-focused": {
						backgroundColor: "transparent",
					},
				},
			},
		},

		// Radio group and checkboxes
		// MuiRadio: {
		// 	styleOverrides: {
		// 		root: {
		// 			color: defaultTheme.palette.text.primary,
		// 			[`&.${radioClasses.checked}`]: {
		// 				color: defaultAccentColor.hex,
		// 			},
		// 		},
		// 	},
		// },
		// MuiCheckbox: {
		// 	styleOverrides: {
		// 		root: {
		// 			color: defaultTheme.palette.text.primary,
		// 			[`&.${checkboxClasses.checked}`]: {
		// 				color: defaultAccentColor.hex,
		// 			},
		// 		},
		// 	},
		// },
		// No default width on buttons
		// MuiButton: {
		// 	styleOverrides: {
		// 		root: {
		// 			minWidth: "0px",
		// 		},
		// 	},
		// },
		// For tooltips
		// MuiTooltip: {
		// 	styleOverrides: {
		// 		tooltip: {
		// 			backgroundColor: defaultTheme.palette.grey[800],
		// 		},
		// 	},
		// },
	},
	breakpoints: defaultTheme.breakpoints,
	palette: defaultTheme.palette,
	spacing: 8,
});
