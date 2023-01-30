import { FC } from "react";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { useTheme } from "../../ThemeProvider";
import { BlogpostCardProps } from "../../types";

export const BlogpostCard: FC<BlogpostCardProps> = (props) => {
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
          <img
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
            src={props.image}
          />
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
export default BlogpostCard;
