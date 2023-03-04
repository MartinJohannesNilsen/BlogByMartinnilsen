import { Box } from "@mui/material";
import { BlockMath } from "react-katex";
import { EditorjsRendererProps } from "../../../types";

const CustomMath = (props: EditorjsRendererProps) => {
  return (
    <Box my={1}>
      {props.data.math ? <BlockMath math={props.data.math} /> : null}
    </Box>
  );
};
export default CustomMath;
