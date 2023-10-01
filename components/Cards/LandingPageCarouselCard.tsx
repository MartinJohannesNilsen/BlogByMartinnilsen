import { AccessTime, CalendarMonth } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { FC, useState } from "react";
import { useTheme } from "../../ThemeProvider";
import { PostCardProps } from "../../types";
import { DEFAULT_OGIMAGE } from "../SEO/SEO";
import { isMobile } from "react-device-detect";
import React from "react";

export const LandingPageCarouselCard: FC<PostCardProps> = (props) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
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
    },
  });
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
      sx={{
        borderRadius: 4,
        boxShadow: "none",
      }}
    >
      <CardActionArea
        // disableTouchRipple
        href={`/posts/${props.id}`}
        sx={{
          height: xs && isMobile ? 450 : 500,
          maxHeight: xs && isMobile ? 450 : 500,
          width: "100%",
        }}
      >
        <CardMedia sx={{ height: 210 }}>
          <Image
            src={props.image || DEFAULT_OGIMAGE}
            alt=""
            fill={true}
            style={{ objectFit: "cover", borderRadius: 0, maxHeight: 210 }}
          />
        </CardMedia>
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            height: xs && isMobile ? "235px" : "285px",
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
              pt={3}
              pb={1}
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
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default LandingPageCarouselCard;
