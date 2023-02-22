import React, { FC } from "react";
import {
  Box,
  Link,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "../../ThemeProvider";
import { FooterProps } from "../../types";
import colorLuminance from "../../utils/colorLuminance";
import usePercentageScrollPosition from "../../utils/usePercentageScrollPosition";
import { useParams } from "react-router-dom";

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 400,
  },
});

const Footer: FC<FooterProps> = (props) => {
  const { theme } = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const scrollPosition = usePercentageScrollPosition();
  const params = useParams();

  return (
    <>
      {params.postId ? (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "8px",
            background: "transparent",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: scrollPosition + "0%",
              // background:
              //   "radial-gradient(circle at 10% 20%, rgb(233, 122, 129) 0%, rgb(181, 64, 149) 100.2%)",
              background: theme.palette.secondary.main,
              transition: "background .15s ease",
            }}
          />
        </Box>
      ) : (
        <></>
      )}
      <Box
        display="flex"
        justifyContent="center"
        alignContent="center"
        sx={{
          width: "100%",
          backgroundColor: "primary.dark",
          position: "relative",
        }}
      >
        <Box py={5} px={3} textAlign="center">
          <Box pb={1} px={1}>
            <Typography
              variant="body1"
              color="textPrimary"
              style={{ fontWeight: 600, fontSize: lgUp ? "1rem" : "0.8rem" }}
            >
              {"Made by "}
              <Link
                fontFamily={theme.typography.fontFamily}
                display="inline-block"
                variant="body1"
                color="textPrimary"
                // href={"https://martinjohannesnilsen.no"}
                // href={"https://blog.mjntech.dev/posts/yjdttN68e7V3E8SKIupT"}
                href={"/posts/yjdttN68e7V3E8SKIupT"}
                sx={{
                  fontWeight: 600,
                  fontSize: lgUp ? "1.1rem" : "0.9rem",
                  textDecoration: "none",
                  borderBottom:
                    "2px solid " +
                    colorLuminance(theme.palette.secondary.main, 0.33),
                  "&:hover": {
                    borderBottom: "2px solid " + theme.palette.secondary.main,
                  },
                }}
              >
                Martin
              </Link>
              {" with 🖤"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default Footer;
