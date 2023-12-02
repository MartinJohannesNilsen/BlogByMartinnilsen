import { Box } from "@mui/material";
import { BlockMath } from "react-katex";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";

const CustomMath = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  return (
    <Box my={1}>
      {props.data.math ? (
        <Box sx={{ color: theme.palette.text.primary }}>
          <BlockMath math={props.data.math} />
        </Box>
      ) : null}
    </Box>
  );
};
export default CustomMath;
