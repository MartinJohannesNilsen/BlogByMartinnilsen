import {
  Close,
  Facebook,
  LinkedIn,
  Mail,
  Reddit,
  Twitter,
} from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  ClickAwayListener,
  IconButton,
  Modal,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { useState } from "react";
import { FaLink } from "react-icons/fa";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
} from "react-share";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ShareModalProps } from "../../types";
import SharePreviewCard from "../Cards/SharePreviewCard";

const TransparentTooltip = withStyles({
  tooltip: {
    backgroundColor: "transparent",
  },
})(Tooltip);

export const ShareModal = (props: ShareModalProps) => {
  const { theme } = useTheme();
  const [openCopiedLinkTooltip, setOpenCopiedLinkTooltip] = useState(false);
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: xs ? 464 : 564,
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

  return (
    <Box>
      <Modal
        open={props.open}
        onClose={() => {
          props.handleModalClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} display="flex" flexDirection="column">
          {/* Close icon */}
          <IconButton
            style={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={() => {
              props.handleModalClose();
            }}
          >
            <Close />
          </IconButton>
          {/* Title */}
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="h5"
            fontWeight="800"
            color={theme.palette.text.primary}
            mb={1}
          >
            Share
          </Typography>
          {/* Card preview */}
          <SharePreviewCard
            title={props.data.title}
            description={props.data.description}
            image={props.data.image}
            url={window.location.host}
            width={props.data.width}
            height={props.data.height}
          />
          {/* Button row */}
          <Box display="flex" mt={2} columnGap={2}>
            <ClickAwayListener
              onClickAway={() => setOpenCopiedLinkTooltip(false)}
            >
              <Tooltip
                placement="top"
                PopperProps={{
                  disablePortal: true,
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -12],
                      },
                    },
                  ],
                }}
                TransitionProps={{ timeout: 200 }}
                onClose={() => setOpenCopiedLinkTooltip(false)}
                open={openCopiedLinkTooltip}
                disableFocusListener
                // disableHoverListener
                disableTouchListener
                title={
                  <Typography
                    fontFamily={theme.typography.fontFamily}
                    fontSize="10px"
                  >
                    Copied link
                  </Typography>
                }
              >
                <IconButton
                  onClick={() => {
                    setOpenCopiedLinkTooltip(true);
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  disableRipple
                  sx={{
                    width: 40,
                    height: 40,
                    color: theme.palette.text.primary,
                    "&:hover": {
                      color: theme.palette.secondary.main,
                    },
                  }}
                >
                  <FaLink />
                </IconButton>
              </Tooltip>
            </ClickAwayListener>
            <EmailShareButton
              url={props.data.url}
              title={props.data.title}
              subject=""
              body=""
              separator=""
            >
              <Mail
                sx={{
                  height: 40,
                  width: 40,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
            </EmailShareButton>
            <FacebookShareButton
              url={props.data.url}
              title={props.data.title}
              quote={props.data.description}
            >
              <Facebook
                sx={{
                  width: 40,
                  height: 40,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
            </FacebookShareButton>
            <TwitterShareButton url={props.data.url} title={props.data.title}>
              <Twitter
                sx={{
                  width: 40,
                  height: 40,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
            </TwitterShareButton>
            <LinkedinShareButton
              url={props.data.url}
              title={props.data.title}
              summary={props.data.description}
              source={window.location.host}
            >
              <LinkedIn
                sx={{
                  width: 40,
                  height: 40,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
            </LinkedinShareButton>
            <RedditShareButton url={props.data.url} title={props.data.title}>
              <Reddit
                sx={{
                  width: 40,
                  height: 40,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
            </RedditShareButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default ShareModal;
