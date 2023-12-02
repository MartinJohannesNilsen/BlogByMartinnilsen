import {
  Box,
  Card,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import speechBalloon from "public/assets/imgs/speech-balloon.png";
import { useTheme } from "../../../ThemeProvider";
import { EditorjsRendererProps } from "../../../types";

const CustomWarning = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <Box my={1} maxWidth={"100vw"}>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          padding: xs ? "15px" : "15px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          maxWidth: "100vw",
        }}
      >
        <IconButton
          disabled={true}
          sx={{ margin: xs ? "0 7.5px 0 -5px" : "0 10px 0 0px" }}
        >
          <Image
            src={speechBalloon.src}
            width={30}
            height={30}
            alt="Speech balloon icon"
          />
        </IconButton>
        <Box display="flex" flexDirection="column" maxWidth={"100vw"}>
          <Typography
            variant="subtitle1"
            fontWeight={800}
            fontFamily={theme.typography.fontFamily}
            sx={{
              // textOverflow: "ellipsis",
              // whiteSpace: "nowrap",
              // overflow: "hidden",
              lineHeight: theme.typography.subtitle2.lineHeight,
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
