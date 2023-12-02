import { AccessTime, CalendarMonth, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useState } from "react";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { PostCardProps } from "../../types";
import React from "react";
import PostViews from "../PostViews/PostViews";

export const LandingPageListCard: FC<PostCardProps> = (props) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const lg = useMediaQuery(theme.breakpoints.only("lg"));
  const xl = useMediaQuery(theme.breakpoints.only("xl"));
  const [state, setState] = useState({
    raised: false,
  });
  const useStyles = makeStyles({
    root: {
      // transition: "transform 0.15s ease-in-out, box-shadow 0.15s",
      width: "100%",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
      },
      "&:active": {
        backgroundColor: theme.palette.primary.light,
      },
      backgroundColor: theme.palette.primary.light,
      // boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
    },
  });
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
      // onMouseOver={() => setState({ raised: true })}
      // onMouseOut={() => setState({ raised: false })}
      sx={{
        borderRadius: 4,
        boxShadow: "none",
      }}
    >
      <CardActionArea
        // disableTouchRipple
        href={`/posts/${props.id}`}
        sx={{
          // height: 240,
          width: "100%",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            height: "235px",
            padding: "10px 20px",
          }}
        >
          {/* Title and description */}
          <Box
            display="flex"
            flexDirection="column"
            pt={0}
            sx={{ maxWidth: "650px" }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color="textPrimary"
              fontFamily={theme.typography.fontFamily}
              sx={{
                mt: 1,
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
                WebkitLineClamp: 3,
                lineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {props.description}
            </Typography>
          </Box>
          {/* Tags */}
          <Box sx={{ flexGrow: 1 }} />
          {/* Information gutter */}
          <Box>
            {/* Tags */}
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              pt={2}
              pb={0.6}
            >
              {props.tags.map((tag, index) => (
                <Button
                  key={index}
                  disabled
                  variant="contained"
                  sx={{ marginRight: 1 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="textPrimary"
                    fontFamily={theme.typography.fontFamily}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "webkit-flex",
                      WebkitLineClamp: 2,
                      lineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      opacity: 0.6,
                    }}
                  >
                    {tag}
                  </Typography>
                </Button>
              ))}
            </Box>
            {/* Date and reading time */}
            <Box display="flex" flexDirection="row" alignItems="center">
              {/* Timestamp */}
              <CalendarMonth
                sx={{
                  opacity: 0.6,
                  marginRight: "6px",
                  fontSize: "default",
                }}
              />
              <Typography
                fontFamily={theme.typography.fontFamily}
                variant="body2"
                fontWeight="600"
                sx={{ opacity: 0.6, fontSize: "default" }}
              >
                {new Date(props.createdAt).toLocaleDateString("en-GB", {
                  // day: "2-digit",
                  // month: "short",
                  // year: "numeric",
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </Typography>
              {/* Read time */}
              <AccessTime
                sx={{
                  opacity: 0.6,
                  marginLeft: "12px",
                  marginRight: "6px",
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
              {/* View counts */}
              <Visibility
                sx={{
                  opacity: 0.6,
                  marginLeft: "12px",
                  marginRight: "6px",
                  fontSize: "default",
                }}
              />
              <Typography
                fontFamily={theme.typography.fontFamily}
                variant="body2"
                fontWeight="600"
                sx={{ opacity: 0.6, fontSize: "default" }}
              >
                <PostViews
                  postId={props.id}
                  sx={{
                    fontSize: theme.typography.fontSize,
                    color: theme.palette.text.primary,
                    fontFamily: theme.typography.fontFamily,
                  }}
                />
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
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default LandingPageListCard;
