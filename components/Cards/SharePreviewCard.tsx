import { Box, Card, Typography } from "@mui/material";
import Image from "next/image";
import { FC } from "react";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { SharePreviewCardProps } from "../../types";

export const SharePreviewCard: FC<SharePreviewCardProps> = (props) => {
  const { theme } = useTheme();

  return (
    <Card
      sx={{
        boxShadow: 0,
        // boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        // boxShadow:
        // "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
        height: `${props.height}px`,
        width: `${props.width}px`,
        padding: 0,
      }}
    >
      <Box display="flex" width="100%" height="100%">
        <Image
          src={props.image}
          alt={`Image for the post titled "${props.title}"`}
          width={props.height}
          height={props.height}
          style={{ objectFit: "cover" }}
        />
        {/* Title and summary */}
        <Box
          display="flex"
          flexDirection="column"
          height={"100%"}
          justifyItems={"center"}
          justifyContent={"center"}
          sx={{ padding: "5px 10px" }}
        >
          <Typography
            variant="body2"
            fontWeight={500}
            color="textPrimary"
            fontSize={14}
            fontFamily={theme.typography.fontFamily}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "webkit-flex",
              WebkitLineClamp: 1,
              lineClamp: 1,
              WebkitBoxOrient: "vertical",
              opacity: 0.6,
            }}
          >
            {props.url}
          </Typography>
          <Typography
            variant={"body1"}
            fontWeight={700}
            fontSize={16}
            color="textPrimary"
            fontFamily={theme.typography.fontFamily}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "webkit-flex",
              WebkitLineClamp: 1,
              lineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {props.title}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={500}
            fontSize={14}
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
            {props.description}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default SharePreviewCard;
