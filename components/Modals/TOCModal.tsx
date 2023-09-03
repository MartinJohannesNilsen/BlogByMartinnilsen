import { Close } from "@mui/icons-material";
import { ButtonBase, IconButton, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useTheme } from "../../ThemeProvider";
import { TOCModalProps } from "../../types";
import colorLuminance from "../../utils/colorLuminance";

export const TOCModal = (props: TOCModalProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: xs ? 350 : 500,
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

  function extractHeaders(html: string) {
    const regex =
      /<div.*?>(<a.*?id="(.*?)".*?><\/a>.*?<h([1-6]).*?>(.*?)<\/h[1-6]>)<\/div>/g;
    const headings = [];
    let match;
    while ((match = regex.exec(html))) {
      headings.push({
        type: `h${match[3]}`,
        id: match[2],
        text: match[4],
      });
    }
    return headings;
  }

  const TableOfContents = useMemo(() => {
    if (!props.outputString) return null;
    const headings: { type: string; id: string | null; text: string }[] =
      extractHeaders(props.outputString);
    const elements: JSX.Element[] = [
      <ButtonBase
        onClick={() => {
          props.handleModalClose();
          window.scrollTo(0, 0);
          router.replace(window.location.pathname + window.location.search);
        }}
        sx={{ maxWidth: "100%" }}
      >
        <Typography
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
            textDecoration: "none",
            marginLeft: theme.spacing(0),
            fontWeight: 600,
            fontSize: 14,
            borderBottom:
              "2px solid " + colorLuminance(theme.palette.secondary.main, 0.15),
            "&:hover": {
              borderBottom: "2px solid " + theme.palette.secondary.main,
            },
          }}
        >
          {props.postTitle}
        </Typography>
      </ButtonBase>,
    ];
    headings.map((heading) =>
      elements.push(
        <ButtonBase
          onClick={() => {
            props.handleModalClose();
            router.replace(`#${heading.id}`);
          }}
          sx={{ maxWidth: "100%" }}
        >
          <Typography
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
              textDecoration: "none",
              marginLeft: theme.spacing(
                parseInt(heading.type.substring(1)) - 1
              ),
              fontWeight: 600,
              fontSize: 14,
              borderBottom:
                "2px solid " +
                colorLuminance(theme.palette.secondary.main, 0.15),
              "&:hover": {
                borderBottom: "2px solid " + theme.palette.secondary.main,
              },
            }}
          >
            {heading.text}
          </Typography>
        </ButtonBase>
      )
    );
    return elements;
  }, [props.outputString, theme]);

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
            <Close />
          </IconButton>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="h5"
            fontWeight="800"
            color={theme.palette.text.primary}
            mb={1}
          >
            Table of Contents
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
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
