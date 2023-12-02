import { AccessTime, CalendarMonth, Visibility } from "@mui/icons-material";
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
import { useTheme } from "../../styles/themes/ThemeProvider";
import { PostCardProps } from "../../types";
import { DEFAULT_OGIMAGE } from "../SEO/SEO";
import { isMobile } from "react-device-detect";
import React from "react";
import PostViews from "../PostViews/PostViews";

export const LandingPageCarouselCard: FC<PostCardProps> = (props) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "none",
        height: xs ? (isMobile ? 490 : 540) : 520,
        maxHeight: xs ? (isMobile ? 490 : 540) : 520,
        width: "100%",
      }}
    >
      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))"
              : "rgb(245, 245, 247)",
          height: xs ? (isMobile ? 490 : 540) : 520,
          maxHeight: xs ? (isMobile ? 490 : 540) : 520,
          width: "100%",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          sx={{ height: xs ? 250 : 230 }}
        >
          <Image
            src={props.image || DEFAULT_OGIMAGE}
            draggable={false}
            alt=""
            height={xs ? 250 : 230}
            width={350}
            // fill={true}
            style={{
              objectFit: "cover",
              maxHeight: xs ? 250 : 230,
              userSelect: "none",
            }}
          />
        </Box>
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
      </Box>
    </Card>
  );
};

export default LandingPageCarouselCard;
