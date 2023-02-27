import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import ThemeProvider from "../ThemeProvider";
import "../styles/editorJS.scss";
import "../styles/globals.scss";

function MyApp({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <CssBaseline />
          <Head>
            <title>Tech blog | Martin Johannes Nilsen</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Component {...pageProps} />
          {/* {process.env.NEXT_PUBLIC_SHOW_MUI_SIZE === "true"
            ? showMuiSize()
            : ""} */}
        </ThemeProvider>
      </StyledEngineProvider>
    </SessionProvider>
  );
}
export default MyApp;
