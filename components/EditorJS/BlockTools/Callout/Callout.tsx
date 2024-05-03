"use client";
import { Box, Card, IconButton, InputBase, MenuItem, Modal, Select, Typography, useMediaQuery } from "@mui/material";
import EmojiPicker, { EmojiClickData, SkinTonePickerLocation } from "emoji-picker-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTheme } from "../../../../styles/themes/ThemeProvider";
import { BlockToolCalloutProps } from "../../../../types";

// Component
export const Callout = (props: BlockToolCalloutProps) => {
	const { theme } = useTheme();
	const [emojiPickerModalOpen, setEmojiPickerModalOpen] = useState<boolean>(false);
	const mdDown = useMediaQuery(theme.breakpoints.down("md"));
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const [stateData, setStateData] = useState(
		props.data || {
			type: "message",
			message: "",
			title: "",
			icon: "",
		}
	);
	const messageRef = useRef(null);

	// On componentType change
	// useEffect(() => {
	//   if (componentType === "note") setStateData({ ...stateData, title: "" });
	// }, [componentType]);

	// Set message value on render
	// useEffect(() => {
	// 	messageRef.current.innerHTML = props.data.message;
	// 	return () => {};
	// }, []);

	// Set message value on stateData.type change
	useEffect(() => {
		const currentMessage: any = messageRef.current;
		currentMessage.innerHTML = stateData.message;
	}, [stateData.type]);

	// Change Editorjs state on state change
	useEffect(() => {
		props.onDataChange(stateData);
	}, [stateData]);

	return (
		<Fragment>
			<Box my={2} sx={{ userSelect: "none" }}>
				{/* Option row */}
				<Box>
					<Select
						sx={{ width: "150px" }}
						size="small"
						value={stateData.type}
						onChange={(e) => setStateData({ ...stateData, type: e.target.value })}
					>
						<MenuItem value={"message"}>Message</MenuItem>
						<MenuItem value={"note"}>Note</MenuItem>
					</Select>
				</Box>
				{/* Component */}
				<Box my={1} maxWidth={"100vw"}>
					{stateData.type === "message" ? (
						<>
							<Modal open={emojiPickerModalOpen} onClose={() => setEmojiPickerModalOpen(false)}>
								<Box
									sx={{
										position: "absolute" as "absolute",
										top: "50%",
										left: "50%",
										transform: "translate(-50%, -50%)",
										bgcolor: "background.paper",
										boxShadow: 24,
										borderRadius: 4,
									}}
								>
									<EmojiPicker
										skinTonePickerLocation={SkinTonePickerLocation.SEARCH}
										previewConfig={{
											// defaultEmoji: "1f60a", // defaults to: "1f60a"
											// defaultCaption: "Speech Balloon", // defaults to: "What's your mood?"
											showPreview: false, // defaults to: true
										}}
										onEmojiClick={(emojiData: EmojiClickData, _) => {
											setStateData({ ...stateData, icon: emojiData.emoji });
											setEmojiPickerModalOpen(false);
										}}
									/>
								</Box>
							</Modal>
							<Card
								elevation={0}
								sx={{
									display: "flex",
									alignItems: "center",
									padding: 1,
									// boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
									backgroundColor: theme.palette.grey[100],
									border: "2px solid " + theme.palette.grey[200],
									maxWidth: "100vw",
								}}
							>
								<IconButton
									onClick={() => setEmojiPickerModalOpen(true)}
									disableRipple
									sx={{ margin: xs ? "0 7.5px 0 -5px" : "0 10px 0 0px" }}
								>
									<Typography fontSize={20}>{stateData.icon}</Typography>
								</IconButton>
								<Box
									display="flex"
									flexDirection="column"
									sx={{
										width: mdDown ? "74vw" : "100vw",
										maxWidth: "550px",
									}}
								>
									{/* Title */}
									<InputBase
										fullWidth
										onKeyDown={(event) => {
											if (event.key === "Enter" || event.key === "ArrowUp" || event.key === "ArrowDown") {
												event.preventDefault();
												event.stopPropagation();
											}
										}}
										placeholder="Insert title here ..."
										value={stateData.title}
										sx={{
											...theme.typography.subtitle1,
											fontWeight: 800,
											fontFamily: theme.typography.fontFamily,
											marginBottom: -0.6,
										}}
										onChange={(e) => {
											setStateData({
												...stateData,
												title: e.target.value,
											});
										}}
									/>
									{/* Message */}
									<div
										contentEditable
										onKeyDown={(event) => {
											if (event.key === "Enter" && !event.shiftKey) {
												event.preventDefault();
												event.stopPropagation();
											}
										}}
										// placeholder="Insert message here ..."
										ref={messageRef}
										style={{
											...theme.typography.subtitle2,
											fontFamily: theme.typography.fontFamily,
											outline: "none",
											paddingBottom: 6,
										}}
										onInputCapture={(e) => {
											const currentDiv: any = messageRef.current;
											if (currentDiv) {
												currentDiv.style.height = "auto";
												currentDiv.style.height = `${currentDiv.scrollHeight}px`;
											}
											setStateData({
												...stateData,
												message: e.currentTarget.innerHTML,
											});
										}}
									/>
								</Box>
							</Card>
						</>
					) : stateData.type === "note" ? (
						<Card
							sx={{
								display: "flex",
								alignItems: "center",
								// backgroundColor: "#f7cb2a",
								backgroundColor: theme.palette.grey[300],
							}}
						>
							<Box display="flex" flexDirection="row">
								{/* <Box sx={{ backgroundColor: "#575757" }} p={0.5} /> */}
								{/* <Box sx={{ backgroundColor: "#b89002" }} p={0.5} /> */}
								<Box sx={{ backgroundColor: theme.palette.grey[400] }} p={0.5} />
								<Box
									display="flex"
									flexDirection="column"
									maxWidth="100vw"
									p={1.5}
									sx={{
										width: mdDown ? "85vw" : "100vw",
										maxWidth: "625px",
									}}
								>
									{/* Title */}
									<InputBase
										fullWidth
										onKeyDown={(event) => {
											if (event.key === "Enter" || event.key === "ArrowUp" || event.key === "ArrowDown") {
												event.preventDefault();
												event.stopPropagation();
											}
										}}
										placeholder="Note"
										value={stateData.title}
										sx={{
											...theme.typography.subtitle1,
											fontWeight: 800,
											fontFamily: theme.typography.fontFamily,
											"&::placeholder": {
												color: "black", // Set the color of the placeholder
											},
											my: -0.4,
											overflow: "hidden",
											textOverflow: "ellipsis",
											display: "webkit-flex",
											WebkitBoxOrient: "vertical",
										}}
										onChange={(e) => {
											setStateData({
												...stateData,
												title: e.target.value,
											});
										}}
									/>
									{/* Message */}
									<div
										contentEditable
										onKeyDown={(event) => {
											if (event.key === "Enter" && !event.shiftKey) {
												event.preventDefault();
												event.stopPropagation();
											}
										}}
										// placeholder="Insert message here ..."
										ref={messageRef}
										style={{
											...theme.typography.subtitle2,
											fontFamily: theme.typography.fontFamily,
											outline: "none",
										}}
										onInputCapture={(e) => {
											const currentDiv: any = messageRef.current;
											if (currentDiv) {
												currentDiv.style.height = "auto";
												currentDiv.style.height = `${currentDiv.scrollHeight}px`;
											}
											setStateData({
												...stateData,
												message: e.currentTarget.innerHTML,
											});
										}}
									/>
								</Box>
							</Box>
						</Card>
					) : null}
				</Box>
			</Box>
		</Fragment>
	);
};
export default Callout;
