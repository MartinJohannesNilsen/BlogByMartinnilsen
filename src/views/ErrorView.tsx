import { FC, useCallback } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "../ThemeProvider";
import { LandingViewProps } from "../types";
import { useNavigate } from "react-router-dom";

const LandingView: FC<LandingViewProps> = (props) => {
  const { theme } = useTheme();
  const xl = useMediaQuery(theme.breakpoints.only("xl"));
  const lg = useMediaQuery(theme.breakpoints.only("lg"));
  const smDown = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const handleOnClick = useCallback(
    (path) => {
      navigate(path, { replace: true });
      location.reload();
    },
    [navigate]
  );

  return (
    <Box>
      <Box
        sx={{
          minHeight: "calc(100vh - 80px - 120px)",
          backgroundColor: theme.palette.primary.main,
          position: "relative",
          padding: "0px 0px 25px 0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography variant="h2">Hmmmm</Typography>
        </Box>
        <Box mt={5} textAlign="center">
          <Typography variant="h4">Something went wrong!</Typography>
          <Typography variant="h4">
            Press the button below for returning to the landing page.{" "}
          </Typography>
        </Box>
        <Box mt={5}>
          <Button
            sx={{
              border: "2px solid " + theme.palette.text.primary,
            }}
            onClick={() => handleOnClick("/")}
          >
            <Typography variant="button" color="textPrimary">
              Return home
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default LandingView;
