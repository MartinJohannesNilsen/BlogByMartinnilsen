import { AccessTime, CalendarMonth } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { FC, useState } from "react";
import { useTheme } from "../../ThemeProvider";
import { PostCardProps } from "../../types";
import React from "react";

export const LandingPageGridCard: FC<PostCardProps> = (props) => {
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
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
      "&:active": {
        backgroundColor: theme.palette.primary.main,
      },
      backgroundColor: theme.palette.primary.main,
    },
    cardHovered: {
      transform: !props.enlargeOnHover
        ? "none"
        : xl
        ? "scale3d(1.02, 1.02, 1)"
        : lg
        ? "scale3d(1.03, 1.03, 1)"
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
      sx={{ width: "100%" }}
    >
      <CardActionArea
        href={`/posts/${props.id}`}
        sx={{
          height: "350px",
          width: "100%",
          padding: "20px",
        }}
      >
        <Box display="flex" flexDirection="column" sx={{ height: "100%" }}>
          {/* Image and type/tag rows */}
          <Box display="flex" flexDirection="row">
            <Image
              src={props.icon}
              alt=""
              width={80}
              height={80}
              style={{ borderRadius: 2, objectFit: "cover" }}
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
                WebkitLineClamp: xs ? 3 : 5,
                lineClamp: xs ? 3 : 5,
                WebkitBoxOrient: "vertical",
              }}
            >
              {props.description}
            </Typography>
          </Box>
          {/*  */}
          <Box sx={{ flexGrow: 100 }} />
          {/* Information gutter */}
          <Box display="flex" flexDirection="row" alignItems="center">
            {/* Timestamp */}
            <CalendarMonth
              sx={{
                opacity: 0.6,
                marginRight: "6px",
                // marginBottom: "3px",
                fontSize: "default",
              }}
            />
            <Typography
              fontFamily={theme.typography.fontFamily}
              variant="body2"
              fontWeight="600"
              sx={{ opacity: 0.6, fontSize: "default" }}
            >
              {new Date(props.timestamp).toLocaleDateString("en-GB", {
                // weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Typography>
            {/* Read time */}
            <AccessTime
              sx={{
                opacity: 0.6,
                marginLeft: "12px",
                marginRight: "6px",
                // marginBottom: "3px",
                fontSize: "default",
              }}
            />
            <Typography
              fontFamily={theme.typography.fontFamily}
              variant="body2"
              fontWeight="600"
              sx={{ opacity: 0.6, fontSize: "default" }}
            >
              {props.readTime ? props.readTime : "⎯"}
            </Typography>
            {/* Not published icon */}
            {!props.published && (
              <>
                <Box flexGrow={100} />{" "}
                <Typography sx={{ fontSize: "default" }}>🖊</Typography>
              </>
            )}
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default LandingPageGridCard;
