import { Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "../../../ThemeProvider";
import { EditorjsRendererProps } from "../../../types";

const CustomList = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();

  let items = [];
  if (props.data.items.length <= 0) return null;
  props.data.items!.map((item: string) => {
    items.push(
      <Typography
        variant="body1"
        color="textPrimary"
        fontFamily={theme.typography.fontFamily}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(item),
        }}
      />
    );
  });
  if (props.data.style === "ordered") {
    return (
      <ol style={{ color: theme.palette.text.primary }}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    );
  } else if (props.data.style === "unordered") {
    return (
      <ul style={{ color: theme.palette.text.primary }}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  } else return null;
};
export default CustomList;
