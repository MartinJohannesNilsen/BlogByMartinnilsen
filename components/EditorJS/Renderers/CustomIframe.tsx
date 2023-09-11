import { Box, Typography, useMediaQuery } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "../../../ThemeProvider";
import { EditorjsRendererProps } from "../../../types";
import Parser from "html-react-parser";

const CustomIframe = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));

  return <Box>{Parser(props.data.frame)}</Box>;
};
export default CustomIframe;
