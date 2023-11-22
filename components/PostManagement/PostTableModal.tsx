import { FC } from "react";
import { Box, Modal } from "@mui/material";
import PostTable from "./PostTable";
import { ModalProps } from "../../types";

export const PostTableModal: FC<ModalProps> = (props) => {
  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 2,
    display: "flex",
    textAlign: "left",
    flexDirection: "column",
    rowGap: "5px",
    justifyContent: "flex-start",
    boxShadow: 24,
    p: 1,
    outline: 0,
    width: 1220,
    height: 646,
  };

  return (
    <Box>
      <Modal
        open={props.open}
        onClose={props.handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus
      >
        <Box sx={modalStyle}>
          <PostTable />
        </Box>
      </Modal>
    </Box>
  );
};
export default PostTableModal;
