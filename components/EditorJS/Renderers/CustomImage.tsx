import { Box, Typography } from "@mui/material";
import { EditorjsRendererProps } from "../../../types";
import { useTheme } from "../../../ThemeProvider";
import DOMPurify from "isomorphic-dompurify";
import colorLuminance from "../../../utils/colorLuminance";
import { makeStyles } from "@mui/styles";

const CustomImage = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const useStyles = makeStyles(() => ({
    link: {
      color: theme.palette.text.primary,
      textDecoration: "none",
      borderBottom:
        "2px solid " + colorLuminance(theme.palette.secondary.main, 0.15),
      "&:hover": {
        borderBottom: "2px solid " + theme.palette.secondary.main,
      },
    },
  }));
  const style = useStyles();

  return (
    <Box
      my={2}
      display="flex"
      width="100%"
      flexDirection="column"
      textAlign="center"
    >
      <img
        style={{ width: "100%", borderRadius: "0px" }}
        src={
          props.data.url
            ? props.data.url
            : props.data.file.url
            ? props.data.file.url
            : ""
        }
      />
      {props.data.caption && props.data.caption !== "<br>" ? (
        <Box my={2}>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="body2"
            color={theme.palette.text.primary}
            sx={{ opacity: 0.8 }}
            dangerouslySetInnerHTML={{
              __html: props.data.unsplash
                ? DOMPurify.sanitize(
                    props.data.caption! +
                      ` 📷 <a class=${style.link} href="${props.data.unsplash?.profileLink}">${props.data.unsplash?.author}</a>`
                  )
                : DOMPurify.sanitize(props.data.caption!),
            }}
          />
        </Box>
      ) : props.data.unsplash ? (
        <Box my={2}>
          <Typography
            fontFamily={theme.typography.fontFamily}
            color={theme.palette.text.primary}
            variant="body2"
            sx={{ opacity: 0.8 }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                `📷 <a class=${style.link} href="${props.data.unsplash?.profileLink}">${props.data.unsplash?.author}</a>`
              ),
            }}
          />
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
export default CustomImage;
