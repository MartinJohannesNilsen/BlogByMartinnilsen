import { Box } from "@mui/material";
import { EditorjsRendererProps } from "../../../types";
import { useTheme } from "../../../ThemeProvider";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

const CustomMath = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();

  return (
    <Box my={1}>
      {props.data.math ? <BlockMath math={props.data.math} /> : <></>}
    </Box>
  );
};
export default CustomMath;
