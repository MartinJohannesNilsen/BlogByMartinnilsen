import { checkboxClasses, createTheme, radioClasses } from "@mui/material";

export const defaultFontFamily =
	"-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol";
export const defaultAccentColor = { hex: "#e9b384", name: "Beige" };

// Create base theme
const defaultTheme = createTheme();
// https://mui.com/material-ui/customization/default-theme/
export const baseTheme = createTheme({
	typography: {
		fontFamily:
			typeof window !== "undefined"
				? JSON.parse(String(localStorage.getItem("font")))
				: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
		// Headings
		// Usage:
		h1: {},
		// Usage:
		h2: {},
		// Usage:
		h3: {
			fontWeight: 800,
			[defaultTheme.breakpoints.only("sm")]: {
				fontSize: "32px",
			},
			[defaultTheme.breakpoints.only("xs")]: {
				fontSize: "24px",
			},
		},
		// Usage:
		h4: {
			fontWeight: 800,
			[defaultTheme.breakpoints.only("sm")]: {
				fontSize: "24px",
			},
			[defaultTheme.breakpoints.only("xs")]: {
				fontSize: "22px",
			},
		},
		// Usage:
		h5: {
			fontWeight: 800,
			[defaultTheme.breakpoints.only("sm")]: {
				fontSize: "22px",
			},
			[defaultTheme.breakpoints.only("xs")]: {
				fontSize: "20px",
			},
		},
		// Usage:
		h6: {
			fontWeight: 800,
			[defaultTheme.breakpoints.only("sm")]: {
				fontSize: "20px",
			},
			[defaultTheme.breakpoints.only("xs")]: {
				fontSize: "18px",
			},
		},

		// Subtitles
		// Usage:
		subtitle1: {
			// fontSize: "1.5rem",
			// fontWeight: 600,
		},
		// Usage:
		subtitle2: {
			// fontSize: "1.2rem",
			// fontWeight: 600,
		},

		// Bodies
		// Usage:
		body1: {
			// fontSize: "125%",
			fontWeight: 500,
			// [defaultTheme.breakpoints.only("sm")]: {
			//   fontSize: "15px",
			// },
			// [defaultTheme.breakpoints.only("xs")]: {
			//   fontSize: "15px",
			// },
		},
		// Usage:
		body2: {
			// fontSize: "1.2rem",
			// fontWeight: 400,
		},

		// Buttons
		button: {
			fontSize: "1rem",
			fontWeight: 800,
		},

		// Tooltips
		overline: {
			fontSize: "0.7rem",
			fontWeight: 800,
		},

		//
		caption: {},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {},
			},
		},
		// Mui Filled TextField
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
		MuiRadio: {
			styleOverrides: {
				root: {
					color: defaultTheme.palette.text.primary,
					[`&.${radioClasses.checked}`]: {
						color: defaultAccentColor.hex,
					},
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					color: defaultTheme.palette.text.primary,
					[`&.${checkboxClasses.checked}`]: {
						color: defaultAccentColor.hex,
					},
				},
			},
		},
		// No default width on buttons
		MuiButton: {
			styleOverrides: {
				root: {
					minWidth: "0px",
				},
			},
		},
		// For tooltips
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					backgroundColor: defaultTheme.palette.grey[800],
				},
			},
		},
	},
	breakpoints: defaultTheme.breakpoints,
	palette: defaultTheme.palette,
});
