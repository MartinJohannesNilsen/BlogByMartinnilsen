"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import { StyledTextField } from "@/components/DesignLibrary/Text/TextInput";
import { deleteFile, uploadFile } from "@/data/middleware/fileStore/actions";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { BlockToolFileProps } from "@/types";
import { Delete, FileUploadOutlined, NorthEast } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import EmojiPicker, { EmojiClickData, SkinTonePickerLocation } from "emoji-picker-react";
import { enqueueSnackbar } from "notistack";
import { CSSProperties, Fragment, useEffect, useRef, useState } from "react";

export const EditorjsTextBlock = ({
	value,
	setValue,
	reference,
	style,
	dataPlaceholder,
}: {
	value: string;
	setValue: (html: any) => void;
	reference: any;
	style?: CSSProperties;
	dataPlaceholder?: string;
}) => {
	const { theme } = useTheme();

	useEffect(() => {
		const currentMessage: any = reference.current;
		if (value && value.trim() !== "") {
			currentMessage.innerHTML = value;
		} else {
			if (currentMessage) {
				if (!currentMessage.textContent.trim()) {
					currentMessage.classList.add("contentEditablePlaceholder");
				} else {
					currentMessage.classList.remove("contentEditablePlaceholder");
				}
			}
		}
	}, [, reference]);

	return (
		<div
			contentEditable="true"
			className="cdx-input"
			data-placeholder={dataPlaceholder}
			onKeyDown={(event) => {
				if (event.key === "Enter" || (value.trim() == "" && (event.key === "Delete" || event.key === "Backspace"))) {
					event.preventDefault();
					event.stopPropagation();
				}
			}}
			ref={reference}
			style={{
				...theme.typography.subtitle2,
				fontFamily: theme.typography.fontFamily,
				outline: "none",
				...style,
			}}
			onInputCapture={(e) => {
				e.preventDefault();
				const currentDiv: any = reference.current;
				if (currentDiv) {
					currentDiv.style.height = "auto";
					currentDiv.style.height = `${currentDiv.scrollHeight}px`;
				}
				setValue(e.currentTarget.innerHTML);
			}}
		/>
	);
};

// Component
export const FileBlock = (props: BlockToolFileProps) => {
	const { theme } = useTheme();
	const [stateData, setStateData] = useState(
		props.data || {
			type: "upload", // url, upload // Could include "drop" for drag and drop
			url: "",
			description: "",
			icon: "📎",
			fileRef: null,
			fileSize: null,
			// unsplash: null,
		}
	);
	const [postId, setPostId] = useState<string>();
	const [urlfieldLinkInputValue, setUrlfieldLinkInputValue] = useState("");
	const [urlfieldSizeInputValue, setUrlfieldSizeInputValue] = useState("");
	const [uploadfieldInputValue, setUploadfieldInputValue] = useState<any>();
	const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);
	const [emojiPickerModalOpen, setEmojiPickerModalOpen] = useState<boolean>(false);
	const fileDescriptionRef = useRef(null);

	useEffect(() => {
		const pathSegments = window.location.pathname.split("/").filter(Boolean); // Split by '/' and remove any empty segments
		const lastSegment = pathSegments.pop(); // Gets the last segment

		// Check if the last segment is not "create"
		if (lastSegment!.toLowerCase() !== "create") {
			setPostId(lastSegment); // Store the last segment in postId
		} else {
			setStateData({ ...stateData, type: "url" }); // Cannot upload to path with postId if postId not present
		}
		return () => {};
	}, []);

	// Change Editorjs state on state change
	useEffect(() => {
		props.onDataChange(stateData);
	}, [stateData]);

	return (
		<Fragment>
			<Box
				my={2}
				sx={{
					userSelect: "none",
					backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
					p: 1,
					borderRadius: "5px",
					border: "2px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
					display: "flex",
					flexDirection: "column",
				}}
			>
				{/* Display block if url is set, else input block */}
				{stateData.url ? (
					<Box
						display="flex"
						flexDirection="row"
						justifyContent="space-between"
						alignItems="center"
						gap={1}
						sx={{ position: "relative" }}
						onMouseEnter={() => setDeleteButtonVisible(true)}
						onMouseLeave={() => setDeleteButtonVisible(false)}
						p={1}
					>
						{/* Icon modal */}
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

						{/* Icon (tooltip if filesize is set) */}
						{stateData.fileSize ? (
							<Tooltip
								enterDelay={2000}
								title={
									stateData.fileSize > 1073741824
										? `${(stateData.fileSize / 1073741824).toFixed(2)}gb`
										: stateData.fileSize > 1048576
										? `${(stateData.fileSize / 1048576).toFixed(2)}mb`
										: `${(stateData.fileSize / 1024).toFixed(2)}kb`
								}
							>
								<IconButton
									onClick={() => setEmojiPickerModalOpen(true)}
									disableRipple
									sx={{
										width: "50px",
										height: "50px",
										p: 1.5,
									}}
								>
									<Typography fontSize={20}>{stateData.icon}</Typography>
								</IconButton>
							</Tooltip>
						) : (
							<IconButton
								onClick={() => setEmojiPickerModalOpen(true)}
								disableRipple
								sx={{
									width: "50px",
									height: "50px",
									p: 1.5,
								}}
							>
								<Typography fontSize={30}>{stateData.icon}</Typography>
							</IconButton>
						)}

						{/* Description */}
						<EditorjsTextBlock
							value={stateData.description}
							setValue={(html: any) => {
								setStateData({
									...stateData,
									description: html,
								});
							}}
							reference={fileDescriptionRef}
							dataPlaceholder={["", "<br>"].includes(stateData.description.trim()) ? "Description" : ""}
						/>

						{/* Delete button if fileref, else open arrow */}
						{stateData.fileRef && deleteButtonVisible ? (
							<NavbarButton
								variant="base"
								icon={Delete}
								sxButton={{ p: 0.5, "&:focus": { borderRadius: 50 } }}
								sxIcon={{ strokeWidth: 0.5, fontSize: "0.5rem" }}
								onClick={() => {
									// Delete file
									deleteFile(stateData.fileRef!)
										.then((deleteResponse) => {
											// Check if response was ok and we got data, else error snackbar
											if (deleteResponse.response) {
												// If delete was successful, set stateData
												setStateData({
													...stateData,
													type: "upload",
													url: "",
													description: "",
													fileRef: undefined,
													fileSize: undefined,
												});
											} else {
												enqueueSnackbar(`(${deleteResponse.code}) ${deleteResponse.reason}`, {
													variant: "error",
													preventDuplicate: true,
												});
											}
										})
										.catch((error) => {
											// Handle error from deleteFile
											console.error("Error deleting file:", error);
										});
								}}
							/>
						) : (
							<NavbarButton
								variant="base"
								icon={NorthEast}
								sxButton={{ p: 0.5, "&:focus": { borderRadius: 50 } }}
								sxIcon={{ strokeWidth: 0.5, fontSize: "0.5rem" }}
								onClick={() => {
									open(stateData.url);
								}}
							/>
						)}
					</Box>
				) : (
					// Input block
					<Box display="flex" flexDirection={"column"} gap={1}>
						{/* Header */}
						<Typography
							variant="body2"
							sx={{ color: theme.palette.text.primary, opacity: 0.2, right: 15, position: "absolute", fontWeight: 600 }}
						>
							File
						</Typography>
						{/* Button row */}
						<Box sx={{ display: "flex", gap: 1 }}>
							<NavbarButton
								variant="outline"
								onClick={() => {
									setStateData({ ...stateData, type: "url" });
									setUrlfieldLinkInputValue("");
								}}
								disabled={!postId} // Can only have url if no postId present
								tooltip="Link to file"
								sxButton={{
									backgroundColor:
										stateData.type == "url"
											? theme.palette.mode == "dark"
												? theme.palette.grey[700]
												: theme.palette.grey[200]
											: theme.palette.mode == "dark"
											? theme.palette.grey[800]
											: theme.palette.grey[100],
									borderRadius: "5px",
									border:
										"2px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
									p: "2px 4px",
									width: "normal",
									height: "normal",
									"&:hover": {
										backgroundColor: stateData.type == "link" ? theme.palette.grey[200] : theme.palette.grey[200],
										color: theme.palette.secondary.main,
										width: "normal",
										height: "normal",
									},
								}}
								text="Link"
							/>
							<NavbarButton
								variant="outline"
								onClick={() => {
									setStateData({ ...stateData, type: "upload" });
									setUrlfieldLinkInputValue("");
								}}
								disabled={!postId} // Can only upload if postId present
								tooltip="Upload your file"
								sxButton={{
									backgroundColor:
										stateData.type == "upload"
											? theme.palette.mode == "dark"
												? theme.palette.grey[700]
												: theme.palette.grey[200]
											: theme.palette.mode == "dark"
											? theme.palette.grey[800]
											: theme.palette.grey[100],
									borderRadius: "5px",
									border:
										"2px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
									p: "2px 4px",
									width: "normal",
									height: "normal",
									"&:hover": {
										backgroundColor: stateData.type == "upload" ? theme.palette.grey[200] : theme.palette.grey[200],
										color: theme.palette.secondary.main,
										width: "normal",
										height: "normal",
									},
								}}
								text="Upload"
							/>
						</Box>

						{/* Content */}
						<Box display="flex" flexDirection="row" gap={1} sx={{}}>
							{stateData.type === "upload" ? (
								// Upload field
								<Button
									component="label"
									role={undefined}
									variant="contained"
									tabIndex={-1}
									sx={{
										backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
										borderRadius: "5px",
										border:
											"1px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[600] : theme.palette.grey[300]),
										p: "2px 4px",
										height: "normal",
										boxShadow: "none",
										width: "100%",
										"&:hover": {
											backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
											color: theme.palette.secondary.main,
											width: "normal",
											height: "normal",
											boxShadow: "none",
										},
									}}
								>
									<FileUploadOutlined
										sx={{
											height: "14px",
											width: "14px",
											color: "#808080",
											mr: 0.5,
										}}
									/>
									<Typography variant="body2" sx={{ color: "#808080", textTransform: "none" }}>
										{!uploadfieldInputValue || !(uploadfieldInputValue instanceof File)
											? "Upload File"
											: `${uploadfieldInputValue.name} (${
													uploadfieldInputValue.size > 1048576
														? (uploadfieldInputValue.size / 1048576).toFixed(2) + "mb"
														: (uploadfieldInputValue.size / 1024).toFixed(2) + "kb"
											  })`}
									</Typography>
									<input
										type="file"
										id="fileInput"
										// accept="image/*,video/*"
										// accept="image/*"
										style={{
											clip: "rect(0 0 0 0)",
											clipPath: "inset(50%)",
											height: 1,
											overflow: "hidden",
											position: "absolute",
											bottom: 0,
											left: 0,
											whiteSpace: "nowrap",
											width: 1,
										}}
										onChange={(e) => {
											setUploadfieldInputValue(e.target.files![0]);
										}}
									/>
								</Button>
							) : (
								<Box display="flex" width="100%" gap={1}>
									<StyledTextField
										InputLabelProps={{ shrink: false }}
										placeholder="URL"
										name="url"
										fullWidth
										size="small"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
											}
										}}
										inputProps={{
											style: { padding: "0px" },
										}}
										value={urlfieldLinkInputValue}
										onChange={(e: { target: { name: any; value: any } }) => {
											const { name, value } = e.target;
											setUrlfieldLinkInputValue(value);
										}}
									/>
									<StyledTextField
										InputLabelProps={{ shrink: false }}
										placeholder="Size (bytes)"
										name="filesize"
										size="small"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
											}
										}}
										inputProps={{
											style: { padding: "0px" },
										}}
										value={urlfieldSizeInputValue}
										onChange={(e: { target: { name: any; value: any } }) => {
											const { name, value } = e.target;
											setUrlfieldSizeInputValue(value);
										}}
									/>
								</Box>
							)}

							{/* Store image if upload */}
							<NavbarButton
								variant="outline"
								onClick={() => {
									if (stateData.type === "upload") {
										// Upload file
										uploadFile(uploadfieldInputValue, postId, null)
											.then((uploadResponse) => {
												// Check if response was ok and we got data, else error snackbar
												if (uploadResponse.data) {
													// If upload was successful, set stateData
													setStateData({
														...stateData,
														type: "upload",
														url: uploadResponse.data.url,
														fileRef: uploadResponse.data.fileRef,
														fileSize: uploadfieldInputValue!.size,
													});
												} else {
													enqueueSnackbar(`(${uploadResponse.code}) ${uploadResponse.reason}`, {
														variant: "error",
														preventDuplicate: true,
													});
												}
											})
											.catch((error) => {
												// Handle error from uploadImage
												console.error("Error uploading file:", error);
											});
									} else {
										// Set download link as url
										setStateData({
											...stateData,
											type: "url",
											url: urlfieldLinkInputValue,
											fileSize: urlfieldSizeInputValue ? parseInt(urlfieldSizeInputValue) : undefined,
										});
									}
								}}
								icon={NorthEast}
								tooltip={stateData.type === "upload" ? "Store image and fetch image details" : "Fetch image from url"}
								sxButton={{
									minWidth: "40px",
									minHeight: "40px",
									height: "40px",
									width: "40px",
									backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
									borderColor: theme.palette.grey[400],
									"&:hover": {
										backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
									},
								}}
								sxIcon={{
									height: "22px",
									width: "22px",
									color: theme.palette.text.primary,
									"&:hover": {
										opacity: 0.8,
									},
								}}
							/>
						</Box>
					</Box>
				)}
			</Box>
		</Fragment>
	);
};
export default FileBlock;
