import { FC, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "../ThemeProvider";
import { LandingViewProps } from "../types";
import ListView from "./ListView";
import Navbar from "../components/Navbar/Navbar";
import { Helmet } from "react-helmet";

const LandingView: FC<LandingViewProps> = (props) => {
  const { theme } = useTheme();
  const xl = useMediaQuery(theme.breakpoints.only("xl"));
  const lg = useMediaQuery(theme.breakpoints.only("lg"));
  const smDown = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box>
      <Navbar />
      <Helmet>
        <title>Tech blog | Martin Johannes Nilsen</title>
        <meta
          name="description"
          content="Hello, I'm Martin. A Software Engineer, M.Sc. Student and passionate problem solver. This is my tech blog."
        />

        <meta
          property="og:image"
          content="https://t4.ftcdn.net/jpg/05/21/18/03/360_F_521180377_2iAVJqBQSo3cgKaVp8vMBR8asrC61DoU.jpg"
          data-react-helmet="false"
        />
        <meta
          property="og:title"
          content="Tech blog"
          data-react-helmet="false"
        />
        <meta
          property="og:description"
          content="A Software Engineer, M.Sc. Student and passionate problem solver. This is my tech blog."
          data-react-helmet="false"
        />
        <meta property="fb:app_id" content="ID_APP_FACEBOOK" />

        <meta
          name="twitter:card"
          content="summary_large_image"
          data-react-helmet="false"
        />
        <meta
          name="twitter:creator"
          content="@MartinJNilsen"
          data-react-helmet="false"
        />
        <meta
          name="twitter:image"
          content="https://t4.ftcdn.net/jpg/05/21/18/03/360_F_521180377_2iAVJqBQSo3cgKaVp8vMBR8asrC61DoU.jpg"
          data-react-helmet="false"
        />
        <meta
          name="twitter:title"
          content="Hello, I'm Martin."
          data-react-helmet="false"
        />
        <meta
          name="twitter:description"
          content="A Software Engineer, M.Sc. Student and passionate problem solver. This is my development blog."
          data-react-helmet="false"
        />
      </Helmet>
      <Box
        sx={{
          height: "calc(100vh - 80px)",
          backgroundColor: theme.palette.primary.main,
          position: "relative",
          padding: "0px 0px 25px 0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ListView />
      </Box>
    </Box>
  );
};
export default LandingView;
