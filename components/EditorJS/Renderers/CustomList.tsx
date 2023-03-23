import { Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "../../../ThemeProvider";
import { EditorjsRendererProps } from "../../../types";
import { makeStyles } from "@mui/styles";
import colorLuminance from "../../../utils/colorLuminance";

const CustomList = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const useStyles = makeStyles(() => ({
    code: {
      color: "#d9363e",
      margin: "0 1px",
      padding: "2px 5px",
      backgroundColor:
        theme.palette.mode === "dark"
          ? // ? theme.palette.primary.dark
            theme.palette.grey[800]
          : theme.palette.grey[100],
      // fontFamily: theme.typography.fontFamily,
      // borderRadius: "2px",
      borderRadius: "4px",
    },
    mark: {
      margin: "0 1px",
      padding: "1px 2px",
      borderRadius: "1px",
      backgroundColor: theme.palette.secondary.main,
    },
    link: {
      color: theme.palette.text.primary,
      textDecoration: "none",
      borderBottom:
        "2px solid " + colorLuminance(theme.palette.secondary.main, 0.15),
      "&:hover": {
        borderBottom: "2px solid " + theme.palette.secondary.main,
      },
    },
    underline: {
      color: theme.palette.text.primary,
      textDecoration: "none",
      borderBottom: "2px solid " + theme.palette.text.primary,
    },
  }));
  const style = useStyles();

  // HTML elements to replace
  const code = `<code class=${style.code}>`;
  const mark = `<mark class=${style.mark}>`;
  const link = `<a class=${style.link} href=`;

  let items = [];
  if (props.data.items.length <= 0) return null;
  props.data.items!.map((item: string) => {
    items.push(
      <Typography
        variant="body1"
        color="textPrimary"
        fontFamily={theme.typography.fontFamily}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            props.data
              .text!.replace(/<code .*?>/gm, code)
              .replace(/<mark .*?>/gm, mark)
              // .replace(/<u .*?>/gm, underline)
              .replace(/<a href=/gm, link)
          ),
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
