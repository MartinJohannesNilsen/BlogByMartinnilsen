import { ContentCopy, CopyAll } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { useTheme } from "../../../ThemeProvider";
import { EditorjsRendererProps } from "../../../types";
import { IoCopyOutline } from "react-icons/io5";

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

export const EDITORTHEME = atomOneDark;
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
  const [isCopyButtonVisible, setCopyButtonVisible] = useState(false);

  const handleMouseEnter = () => {
    setCopyButtonVisible(true);
  };

  const handleMouseLeave = () => {
    setCopyButtonVisible(false);
  };

  return (
    <Box sx={{ position: "relative", borderRadius: "50px" }} my={1}>
      {props.data.multiline ? (
        // Multiline codeblock
        <Box>
          {/* Header row */}
          <Box
            sx={{
              backgroundColor: "#363642",
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
                {props.data.filename && props.data.filename !== ""
                  ? props.data.filename
                  : props.data.language && props.data.language !== ""
                  ? props.data.language
                  : ""}
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
                  // <ContentCopy
                  //   sx={{ color: "white", width: "15px", marginLeft: "5px" }}
                  // />
                  <IoCopyOutline
                    size="16px"
                    style={{ margin: "0 -2px 0 2px" }}
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
          {/* Editor (highlighted) */}
          <SyntaxHighlighter
            language={
              props.data.language && props.data.language !== ""
                ? props.data.language
                : "plaintext"
            }
            style={EDITORTHEME}
            showLineNumbers={props.data.linenumbers}
            wrapLongLines={props.data.textwrap}
            customStyle={{
              backgroundColor: "rgb(36, 39, 46)",
              margin: "0px",
              marginTop: "-1px",
              padding: "15px",
              borderRadius: "0 0 10px 10px",
            }}
          >
            {props.data.code!}
          </SyntaxHighlighter>
        </Box>
      ) : (
        // Singleline codeblock
        <Box
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          position="relative"
        >
          {isCopyButtonVisible && (
            <IconButton
              sx={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                borderRadius: 2,
              }}
              onClick={() =>
                copyToClipboard(
                  props.data.multiline
                    ? props.data.code
                    : props.data.code.replace(/(\r\n|\n|\r)/gm, "")
                )
              }
            >
              <IoCopyOutline />
            </IconButton>
          )}
          <SyntaxHighlighter
            language={
              props.data.language && props.data.language !== ""
                ? props.data.language
                : "plaintext"
            }
            style={EDITORTHEME}
            customStyle={{
              backgroundColor: "rgb(36, 39, 46)",
              margin: "0px",
              marginTop: "-1px",
              padding: "15px",
              borderRadius: "10px 10px",
            }}
          >
            {props.data.multiline
              ? props.data.code
              : props.data.code.replace(/(\r\n|\n|\r)/gm, "")}
          </SyntaxHighlighter>
        </Box>
      )}
    </Box>
  );
};
export default CustomCodebox;
