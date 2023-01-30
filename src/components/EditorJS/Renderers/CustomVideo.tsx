import { Box, Typography, useMediaQuery } from "@mui/material";
import { EditorjsRendererProps } from "../../../types";
import { useTheme } from "../../../ThemeProvider";
import ReactPlayer from "react-player/lazy";
import DOMPurify from "dompurify";

const CustomVideo = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));

  return (
    <Box my={1} display="flex" flexDirection="column" textAlign="center">
      <Box display="flex" width="100%" justifyContent="center">
        <ReactPlayer url={props.data.file?.url} controls={true} />
      </Box>
      <Typography
        fontFamily={theme.typography.fontFamily}
        variant="body2"
        sx={{ opacity: 0.8, marginY: 2 }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(props.data.caption!),
        }}
      />
    </Box>
  );
};
export default CustomVideo;
