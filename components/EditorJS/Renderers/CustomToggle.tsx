import { Box } from "@mui/material";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";
import { useMemo, useState } from "react";
import Output from "editorjs-react-renderer";
import {
  processJsonToggleBlocks,
  renderers,
} from "../../../pages/posts/[postId]";
import { style } from "../Style";
import Toggle from "../../Toggles/Toggle";

const CustomToggle = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(props.data.status === "open");

  const handleChange = () => {
    setOpen(!open);
  };

  const OutputElement = useMemo(() => {
    if (props && props.data) {
      const processedData = processJsonToggleBlocks(props.data);
      return (
        <Output
          renderers={renderers}
          data={processedData}
          style={style(theme)}
        />
      );
    }
    return null;
  }, [props]);

  return (
    <Box my={1} display="flex" flexDirection="column" textAlign="center">
      <Toggle title={props.data.text} open={open} handleClick={handleChange}>
        {OutputElement}
      </Toggle>
    </Box>
  );
};
export default CustomToggle;
