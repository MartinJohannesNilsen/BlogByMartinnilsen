import { checkboxClasses, createTheme, radioClasses } from "@mui/material";
import { themeCreator } from "./themeMap";

export const defaultFontFamily =
  "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol";
export const defaultAccentColor = "#29939b";

// Create base theme
const defaultTheme = createTheme();
// https://mui.com/material-ui/customization/default-theme/
export const baseTheme = createTheme({
  typography: {
    fontFamily:
      JSON.parse(String(localStorage.getItem("font"))) ||
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
    // Headings
    // Usage:
    h1: {},
    // Usage:
    h2: {},
    // Usage:
    h3: { fontWeight: 800 },
    // Usage:
    h4: { fontWeight: 800 },
    // Usage:
    h5: { fontWeight: 800 },
    // Usage:
    h6: { fontWeight: 800 },

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
    // Radio group and checkboxes
    MuiRadio: {
      styleOverrides: {
        root: {
          color: defaultTheme.palette.text.primary,
          [`&.${radioClasses.checked}`]: {
            color: defaultAccentColor,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: defaultTheme.palette.text.primary,
          [`&.${checkboxClasses.checked}`]: {
            color: defaultAccentColor,
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
