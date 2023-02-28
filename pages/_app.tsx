import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import ThemeProvider from "../ThemeProvider";
import "../styles/editorJS.scss";
import "../styles/globals.scss";
import { DefaultSeo } from "next-seo";

function MyApp({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
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
                  url: "https://t4.ftcdn.net/jpg/05/21/18/03/360_F_521180377_2iAVJqBQSo3cgKaVp8vMBR8asrC61DoU.jpg",
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
        </ThemeProvider>
      </StyledEngineProvider>
    </SessionProvider>
  );
}
export default MyApp;
