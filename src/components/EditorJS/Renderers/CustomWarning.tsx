import {
  Box,
  Card,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { EditorjsRendererProps } from "../../../types";
import { useTheme } from "../../../ThemeProvider";
import DOMPurify from "dompurify";

const CustomWarning = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));

  return (
    <Box my={1}>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "15px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        }}
      >
        <IconButton disabled={true} sx={{ margin: "0 10px 0 0px" }}>
          <img
            src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/129/speech-balloon_1f4ac.png"
            width="30px"
          />
        </IconButton>
        <Box display="flex" flexDirection="column">
          <Typography
            variant="subtitle1"
            fontWeight={800}
            fontFamily={theme.typography.fontFamily}
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(props.data.title!),
            }}
          />
          <Typography
            variant="body1"
            color="textPrimary"
            fontFamily={theme.typography.fontFamily}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(props.data.message!),
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};
export default CustomWarning;
