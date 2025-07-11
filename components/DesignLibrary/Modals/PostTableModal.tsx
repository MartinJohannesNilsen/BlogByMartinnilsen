"use client";
import PostTable from "@/components/Tables/PostTable";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { PostTableProps } from "@/types";
import { Box, Modal, useMediaQuery } from "@mui/material";

export const PostTableModal = ({ open, handleModalOpen, handleModalClose, postsOverview }: PostTableProps) => {
	const { theme } = useTheme();
	const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

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
		width: lgUp ? 1220 : "95vw",
		height: 646,
	};

	return (
		<Box>
			<Modal open={open} onClose={handleModalClose} disableAutoFocus>
				<Box sx={modalStyle}>
					<PostTable postsOverview={postsOverview} />
				</Box>
			</Modal>
		</Box>
	);
};
export default PostTableModal;
