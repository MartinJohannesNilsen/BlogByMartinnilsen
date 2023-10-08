import { createTheme } from "@mui/material";
import { baseTheme } from "./themeDefaults";

export const dark = createTheme({
  palette: {
    mode: "dark",
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
        (typeof window !== "undefined" &&
          localStorage.getItem("accent") &&
          JSON.parse(String(localStorage.getItem("accent")))) ||
        "#29939b",
    },
    // outline shadow for project images
    grey: {
      600: "#585d63",
      700: "#3e4347",
      800: "#27323b",
    },
  },
  breakpoints: baseTheme.breakpoints,
  components: baseTheme.components,
  typography: baseTheme.typography,
});
export default dark;
