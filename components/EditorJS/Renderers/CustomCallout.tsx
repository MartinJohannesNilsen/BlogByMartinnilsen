import {
  Box,
  ButtonBase,
  Card,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";

const CustomCallout = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box my={1} maxWidth={"100vw"}>
      {props.data.type === "message" ? (
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 2,
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
            maxWidth: "100vw",
          }}
        >
          <IconButton
            disabled
            disableRipple
            sx={{ margin: xs ? "0 7.5px 0 -5px" : "0 10px 0 0px" }}
          >
            <Typography fontSize={30}>{props.data.icon || "💬"}</Typography>
          </IconButton>
          <Box display="flex" flexDirection="column" maxWidth="100vw">
            {/* Title */}
            {props.data.title && (
              <Typography
                sx={{
                  ...theme.typography.subtitle1,
                  fontWeight: 800,
                  fontFamily: theme.typography.fontFamily,
                  pt: "4px",
                  pb: "5px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "webkit-flex",
                  WebkitLineClamp: 1,
                  lineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(props.data.title),
                }}
              />
            )}
            {/* Message */}
            <Typography
              sx={{
                ...theme.typography.body1,
                fontFamily: theme.typography.fontFamily,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "webkit-flex",
                WebkitBoxOrient: "vertical",
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  props.data.message.replace(/\n/g, "<br>")
                ),
              }}
            />
          </Box>
        </Card>
      ) : props.data.type === "note" ? (
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            maxWidth: "100vw",
            backgroundColor: "#f7cb2a",
          }}
        >
          <Box display="flex" flexDirection="row">
            {/* <Box sx={{ backgroundColor: "#575757" }} p={0.5} /> */}
            <Box sx={{ backgroundColor: "#b89002" }} p={0.5} />
            <Box display="flex" flexDirection="column" maxWidth="100vw" p={1.5}>
              {/* Title */}
              <Typography
                sx={{
                  ...theme.typography.subtitle1,
                  fontWeight: 800,
                  fontFamily: theme.typography.fontFamily,
                  "&::placeholder": {
                    color: "black", // Set the color of the placeholder
                  },
                  pt: "4px",
                  pb: "5px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "webkit-flex",
                  WebkitLineClamp: 1,
                  lineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(props.data.title || "Note"),
                }}
              />
              {/* Message */}
              <Typography
                sx={{
                  ...theme.typography.body1,
                  fontFamily: theme.typography.fontFamily,
                  pt: "0px",
                  pb: "5px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "webkit-flex",
                  WebkitBoxOrient: "vertical",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    props.data.message.replace(/\n/g, "<br>")
                  ),
                }}
              />
            </Box>
          </Box>
        </Card>
      ) : null}
    </Box>
  );
};
export default CustomCallout;
