import { FC, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "../../ThemeProvider";
import { BlogpostCardProps } from "../../types";
import { makeStyles } from "@mui/styles";
import DOMPurify from "dompurify";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export const LandingViewCardLarge: FC<BlogpostCardProps> = (props) => {
  const { theme } = useTheme();

  return (
    <Card sx={{ boxShadow: "none" }}>
      <CardActionArea href={`/posts/${props.id}`} sx={{ height: "100px" }}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          sx={{ height: "100px" }}
        >
          {/* <img
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
            src={props.image}
          /> */}
          <Box
            sx={{
              textAlign: "left",
              padding: "0px 12px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Typography
              variant="body1"
              fontWeight={700}
              color="textPrimary"
              fontFamily={theme.typography.fontFamily}
            >
              {props.title}
            </Typography>
            <Typography
              variant="body2"
              color="textPrimary"
              fontFamily={theme.typography.fontFamily}
            >
              {props.summary}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export const LandingViewCard: FC<BlogpostCardProps> = (props) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const lg = useMediaQuery(theme.breakpoints.only("lg"));
  const xl = useMediaQuery(theme.breakpoints.only("xl"));
  const [state, setState] = useState({
    raised: false,
  });
  const useStyles = makeStyles({
    root: {
      transition: "transform 0.15s ease-in-out, box-shadow 0.15s",
      boxShadow:
        theme.palette.mode === "light"
          ? "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
          : "",
      width: "100%",
    },
    cardHovered: {
      transform: xl
        ? "scale3d(1.02, 1.02, 1)"
        : lg
        ? "scale3d(1.04, 1.04, 1)"
        : "scale3d(1.05, 1.05, 1)",
      width: "100%",
    },
  });
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
      classes={{ root: state.raised ? classes.cardHovered : "" }}
      onMouseOver={() => setState({ raised: true })}
      onMouseOut={() => setState({ raised: false })}
    >
      <CardActionArea
        href={`/posts/${props.id}`}
        sx={{
          height: "350px",
          width: "100%",
          "&:hover": {
            backgroundColor: theme.palette.primary.main,
          },
          padding: "20px",
        }}
      >
        <Box display="flex" flexDirection="column" sx={{ height: "100%" }}>
          {/* Image and type/tag rows */}
          <Box display="flex" flexDirection="row">
            <img
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
              src={props.image}
            />
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              sx={{
                height: "80px",
                textAlign: "left",
                padding: "10px 0px 10px 12px",
                maxWidth: "500px",
              }}
            >
              <Typography
                variant="body1"
                fontWeight={700}
                color={theme.palette.secondary.main}
                fontFamily={theme.typography.fontFamily}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "webkit-flex",
                  WebkitLineClamp: 1,
                  lineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    props.type
                      ? "//&nbsp;&nbsp;" + props.type + "&nbsp;&nbsp;//"
                      : ""
                  ),
                }}
              />
              <Typography
                variant="body2"
                color="textPrimary"
                fontFamily={theme.typography.fontFamily}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "webkit-flex",
                  WebkitLineClamp: 2,
                  lineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {props.tags.map((tag, index) =>
                  index != 0 ? ", " + tag : tag
                )}
              </Typography>
            </Box>
          </Box>
          {/* Title and summary */}
          <Box
            display="flex"
            flexDirection="column"
            pt={2}
            sx={{ maxWidth: "650px" }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color="textPrimary"
              fontFamily={theme.typography.fontFamily}
              sx={{
                lineHeight: "26px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "webkit-flex",
                WebkitLineClamp: 2,
                lineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {props.title}
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              fontWeight={500}
              color="textPrimary"
              fontFamily={theme.typography.fontFamily}
              sx={{
                lineHeight: "26px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "webkit-flex",
                WebkitLineClamp: 5,
                lineClamp: 5,
                WebkitBoxOrient: "vertical",
              }}
            >
              {props.summary}
            </Typography>
          </Box>
          {/*  */}
          <Box sx={{ flexGrow: 100 }} />
          {/* Timestamp */}
          <Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <CalendarMonthIcon
                sx={{
                  opacity: 0.6,
                  marginRight: "6px",
                  fontSize: xs ? "12px" : "default",
                }}
              />
              <Typography
                fontFamily={theme.typography.fontFamily}
                variant="body2"
                fontWeight="600"
                sx={{ opacity: 0.6, fontSize: xs ? "13px" : "default" }}
              >
                {new Date(props.timestamp).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default LandingViewCard;
