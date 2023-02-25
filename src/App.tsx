import { CssBaseline, StyledEngineProvider } from "@mui/material";
import ThemeProvider from "./ThemeProvider";
import showMuiSize from "./utils/showMuiSize";

// Views
import AppRouter from "./Router";

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <CssBaseline />
        {/* {process.env.REACT_APP_SHOW_MUI_SIZE === "true" ? showMuiSize() : ""} */}
        <AppRouter />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
