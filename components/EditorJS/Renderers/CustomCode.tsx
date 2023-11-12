import { ContentCopy } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { useTheme } from "../../../ThemeProvider";
import { EditorjsRendererProps } from "../../../types";

// Themes
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

function copyToClipboard(str: string) {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  document.body.appendChild(el);

  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    // save current contentEditable/readOnly status
    var editable = el.contentEditable;
    var readOnly = el.readOnly;

    // convert to editable with readonly to stop iOS keyboard opening
    // el.contentEditable = true;
    el.readOnly = true;

    // create a selectable range
    var range = document.createRange();
    range.selectNodeContents(el);

    // select the range
    var selection = window.getSelection();
    selection!.removeAllRanges();
    selection!.addRange(range);
    el.setSelectionRange(0, 999999);

    // restore contentEditable/readOnly to original state
    el.contentEditable = editable;
    el.readOnly = readOnly;
  } else {
    el.select();
  }
  document.execCommand("copy");
  document.body.removeChild(el);
}

const CustomCodebox = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const handleButtonClick = (copyText: string) => {
    copyToClipboard(copyText);
    setCopyMessageShown(true);
    setTimeout(() => {
      setCopyMessageShown(false);
    }, 4000);
  };
  const [copyMessageShown, setCopyMessageShown] = useState(false);
  const EDITORTHEME = atomOneDark;

  return (
    <Box sx={{ position: "relative", borderRadius: "50px" }} my={1}>
      <Box
        sx={
          {
            // borderRadius: "10px", // border width + borderradius from before
            // border: "4px solid" + theme.palette.secondary.main,
          }
        }
      >
        <Box
          sx={{
            backgroundColor: "#363642",
            // backgroundColor: "#66667d",
            // height: "35px",
            borderRadius: "10px 10px 0px 0px",
            padding: "5px",
          }}
          display="flex"
          alignItems="center"
        >
          <Box ml={1.75}>
            <Typography
              fontFamily={theme.typography.fontFamily}
              variant="body2"
              color="white"
              py={1}
              sx={{ opacity: 0.6 }}
            >
              {props.data.language !== "plain" ? props.data.language : null}
            </Typography>
          </Box>
          <Box flexGrow={100} />
          <Box mr={1}>
            <Button
              disabled={copyMessageShown}
              sx={{
                color: "white",
              }}
              onClick={() => handleButtonClick(props.data.code!)}
              startIcon={
                <ContentCopy
                  sx={{ color: "white", width: "15px", marginLeft: "5px" }}
                />
              }
            >
              <Typography
                fontFamily={theme.typography.fontFamily}
                variant="body2"
                color="white"
                sx={{ opacity: 1, textTransform: "none" }}
              >
                {copyMessageShown ? "Copied!" : "Copy Code"}
              </Typography>
            </Button>
          </Box>
        </Box>
        <SyntaxHighlighter
          language={
            props.data.language === "plain"
              ? "plaintext"
              : props.data.language || "plaintext"
          }
          // showLineNumbers={true}
          style={EDITORTHEME}
          wrapLines={true}
          customStyle={{
            backgroundColor: "rgb(36, 39, 46)",
            // backgroundColor: "rgb(31, 34, 41)",
            margin: "0px",
            marginTop: "-1px",
            padding: "15px",
            borderRadius: "0 0 10px 10px",
          }}
        >
          {props.data.code!}
        </SyntaxHighlighter>
      </Box>
      {/* {props.data.caption !== "" ? (
        <Box my={2} textAlign="center">
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="body2"
            sx={{ opacity: 0.8 }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(props.data.caption!),
            }}
          />
        </Box>
      ) : (
        <></>
      )} */}
    </Box>
  );
};
export default CustomCodebox;
