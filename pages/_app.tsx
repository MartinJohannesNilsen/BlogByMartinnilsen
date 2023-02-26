import type { AppProps } from "next/app";
import "../styles/globals.scss";
import "../styles/editorJS.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import ThemeProvider from "../ThemeProvider";
import showMuiSize from "../utils/showMuiSize";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <CssBaseline />
          {/* {process.env.NEXT_PUBLIC_SHOW_MUI_SIZE === "true" ? showMuiSize() : ""} */}
          <Head>
            <title>Tech blog | Martin Johannes Nilsen</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Component {...pageProps} />
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
