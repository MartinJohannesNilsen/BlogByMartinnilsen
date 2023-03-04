import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import ThemeProvider from "../ThemeProvider";
import "../styles/editorJS.scss";
import "../styles/globals.scss";
import { DefaultSeo } from "next-seo";
import { Analytics } from "@vercel/analytics/react";
import { SnackbarProvider } from "notistack";

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
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
            </Head>
            <DefaultSeo
              title="Tech blog | Martin Johannes Nilsen"
              defaultTitle="Tech blog | Martin Johannes Nilsen"
              description="A tech blog by Martin Johannes Nilsen, a Software Engineer, M.Sc. Student and passionate problem solver."
              openGraph={{
                type: "website",
                locale: "en_US",
                url: "https://MJNTech.dev",
                siteName: "MJNTech.dev",
                images: [
                  {
                    url: "https://blog.mjntech.dev/icons/ogimage.png",
                  },
                ],
              }}
              twitter={{
                handle: "@MartinJNilsen",
                cardType: "summary",
              }}
            />
            <Component {...pageProps} />
            {/* {process.env.NEXT_PUBLIC_SHOW_MUI_SIZE === "true"
            ? showMuiSize()
            : ""} */}
            <Analytics />
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </SessionProvider>
  );
}
export default MyApp;
