import { FC, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "../ThemeProvider";
import { LandingViewProps } from "../types";
import ListView from "./ListView";
import Navbar from "../components/Navbar/Navbar";

const LandingView: FC<LandingViewProps> = (props) => {
  const { theme } = useTheme();
  const xl = useMediaQuery(theme.breakpoints.only("xl"));
  const lg = useMediaQuery(theme.breakpoints.only("lg"));
  const smDown = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box>
      <Navbar />
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
