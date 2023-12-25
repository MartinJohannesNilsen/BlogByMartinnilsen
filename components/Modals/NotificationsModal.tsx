import { Close } from "@mui/icons-material";
import { ButtonBase, IconButton, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { NotificationsModalProps } from "../../types";
import DOMPurify from "dompurify";

export const NotificationsModal = (props: NotificationsModalProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: xs ? 370 : 500,
    maxHeight: "70vh",
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
            Notifications
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};
export default NotificationsModal;
