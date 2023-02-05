import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IconButton, Link } from "@mui/material";
import { useTheme } from "../../ThemeProvider";
import CloseIcon from "@mui/icons-material/Close";
import { TOCModalProps } from "../../types";
import { useMemo } from "react";
import colorLuminance from "../../utils/colorLuminance";
import $ from "jquery";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 380,
  maxHeight: "60vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  outline: 0,
  display: "flex",
  textAlign: "left",
  flexDirection: "column",
  rowGap: "10px",
  justifyContent: "flex-start",
  boxShadow: 24,
  p: 4,
};

export const TOCModal = (props: TOCModalProps) => {
  const { theme } = useTheme();

  function extractHeaders(html: string) {
    const regex = /<h([1-6])(?:.*?id="(.*?)")?>(.*?)<\/h([1-6])>/g;
    const headings = [];
    let match;
    while ((match = regex.exec(html))) {
      headings.push({
        type: `h${match[1]}`,
        id: match[2] || null,
        text: match[3],
      });
    }
    return headings;
  }

  const TableOfContents = useMemo(() => {
    const headings: { type: string; id: string | null; text: string }[] =
      extractHeaders(props.outputString);
    const elements: JSX.Element[] = [];
    headings.map((heading) =>
      elements.push(
        <Link
          onClick={() => {
            props.handleModalClose();
          }}
          href={`#${heading.id}`}
        >
          <Typography
            sx={{
              color: theme.palette.text.primary,
              textDecoration: "none",
              marginLeft: theme.spacing(
                parseInt(heading.type.substring(1)) - 1
              ),
              fontWeight: 600,
              borderBottom:
                "2px solid " +
                colorLuminance(theme.palette.secondary.main, 0.33),
              "&:hover": {
                borderBottom: "2px solid " + theme.palette.secondary.main,
              },
            }}
          >
            {heading.text}
          </Typography>
        </Link>
      )
    );
    return elements;
  }, [props.outputString]);

  return (
    <Box>
      <Modal
        open={props.open}
        onClose={props.handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            style={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={() => props.handleModalClose()}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="h5"
            fontWeight="800"
            mb={1}
          >
            Table of Contents
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            gap="10px"
            sx={{
              overflowY: "scroll",
            }}
          >
            {TableOfContents}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default TOCModal;
