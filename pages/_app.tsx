import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "../ThemeProvider";
import "../styles/editorJS.scss";
import "../styles/globals.scss";

function MyApp({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <SnackbarProvider
            preventDuplicate
            maxSnack={Number(process.env.NEXT_PUBLIC_MAX_STACK_OF_SNACKBARS)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <CssBaseline />
            <Component {...pageProps} />
            {/* {process.env.NEXT_PUBLIC_SHOW_MUI_SIZE === "true"
            ? showMuiSize()
            : ""} */}
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </SessionProvider>
  );
}
export default MyApp;
