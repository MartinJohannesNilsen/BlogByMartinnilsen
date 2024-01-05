import { CssBaseline, IconButton, StyledEngineProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider, closeSnackbar } from "notistack";
import ThemeProvider from "../styles/themes/ThemeProvider";
import "../styles/editorJS.scss";
import "../styles/globals.scss";
import { Close } from "@mui/icons-material";

function MyApp({ Component, pageProps, session }) {
  // const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  //   '&.notistack-MuiContent-success': {
  //     backgroundColor: '#2D7738',
  //   },
  //   '&.notistack-MuiContent-error': {
  //     backgroundColor: '#970C0C',
  //   },
  // }));

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
            action={(snackbarId) => (
              <IconButton
                size="small"
                disableRipple
                onClick={() => closeSnackbar(snackbarId)}
              >
                <Close fontSize="small" sx={{ color: "white" }} />
              </IconButton>
            )}
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
