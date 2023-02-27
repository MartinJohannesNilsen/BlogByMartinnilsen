import { Box, Card, IconButton, Typography } from "@mui/material";
import { EditorjsRendererProps } from "../../../types";
import { useTheme } from "../../../ThemeProvider";
import DOMPurify from "isomorphic-dompurify";
import speechBalloon from "public/assets/img/speech-balloon.png";
import Image from "next/image";

const CustomWarning = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();

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
          <Image
            src={speechBalloon.src}
            width={30}
            height={30}
            alt="Speech balloon icon"
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
