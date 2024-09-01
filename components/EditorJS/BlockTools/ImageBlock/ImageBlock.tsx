"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import { StyledTextField } from "@/components/DesignLibrary/Text/TextInput";
import { getImageDetails } from "@/data/middleware/imageBlurhash/details";
import { deleteImage, uploadImage } from "@/data/middleware/imageStore/actions";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { BlockToolImageProps } from "@/types";
import { Add, AddPhotoAlternateOutlined, Delete, Link, NorthEast } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { CSSProperties, Fragment, useEffect, useRef, useState } from "react";

export const EditorjsTextBlock = ({
	value,
	setValue,
	reference,
	style,
}: {
	value: string;
	setValue: (html: any) => void;
	reference: any;
	style?: CSSProperties;
}) => {
	const { theme } = useTheme();

	useEffect(() => {
		const currentMessage: any = reference.current;
		currentMessage.innerHTML = value;
	}, [reference]);

	return (
		<div
			contentEditable="true"
			onKeyDown={(event) => {
				if (event.key === "Enter") {
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
export const ImageBlock = (props: BlockToolImageProps) => {
	const { theme } = useTheme();
	const [stateData, setStateData] = useState(
		props.data || {
			type: "upload", // url, upload // Could include "drop" for drag and drop
			url: "",
			caption: "",
			blurhash: null,
			height: null,
			width: null,
			fileRef: null,
			fileSize: null,
			// unsplash: null,
		}
	);
	const [postId, setPostId] = useState<string>();
	const [urlfieldInputValue, setUrlfieldInputValue] = useState("");
	const [uploadfieldInputValue, setUploadfieldInputValue] = useState<any>();
	const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);
	const imageCaptionRef = useRef(null);

	useEffect(() => {
		console.log("uploadfieldInputValue", uploadfieldInputValue);
	}, [uploadfieldInputValue]);

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
				{/* Image if url is set, else input block */}
				{stateData.url ? (
					<Box
						display="flex"
						flexDirection="column"
						gap={1}
						sx={{ position: "relative" }}
						onMouseLeave={() => setDeleteButtonVisible(false)}
						mb={1}
					>
						{stateData.fileRef && deleteButtonVisible && (
							<Box display="flex" alignItems="center" sx={{ position: "absolute", top: 5, right: 5 }}>
								<Typography
									fontFamily={theme.typography.fontFamily}
									fontSize={14}
									fontWeight={600}
									sx={{
										mr: 0.5,
										color: "white",
										border: "1px solid" + theme.palette.grey[900],
										borderRadius: "5px",
										backgroundColor: "black",
										padding: "3px 6px",
									}}
								>
									{`${(stateData.fileSize! / 1024).toFixed(2)}kb`}
								</Typography>
								<NavbarButton
									variant="outline"
									onClick={async () => {
										if (!stateData.fileRef) return;
										const response = await deleteImage(stateData.fileRef);
										if (response.code === 200) {
											setStateData({
												...stateData,
												url: "",
												fileRef: undefined,
												fileSize: undefined,
											});
										} else {
											enqueueSnackbar(`(${response.code}) ${response.reason}`, {
												variant: "error",
												preventDuplicate: true,
											});
										}
									}}
									icon={Delete}
									tooltip="Delete image from storage"
									sxButton={{
										minWidth: "30px",
										minHeight: "30px",
										height: "30px",
										width: "30px",
										index: 2,
										backgroundColor: "black",
										color: "white",
										"&:focus-visible": {
											backgroundColor: theme.palette.grey[800],
										},
										"&:hover": {
											border: "1px solid rgba(255,0,0,0.8)",
											color: "rgba(255,0,0,0.8)",
											backgroundColor: theme.palette.grey[800],
										},
									}}
									sxIcon={{
										height: "20px",
										width: "20px",
										color: "inherit",
									}}
								/>
							</Box>
						)}
						<img
							style={{
								width: "100%",
								borderRadius: "0px",
								objectFit: "contain",
							}}
							onMouseEnter={() => setDeleteButtonVisible(true)}
							src={stateData.url}
						/>
						<EditorjsTextBlock
							reference={imageCaptionRef}
							value={stateData.caption}
							setValue={(html: any) => {
								setStateData({
									...stateData,
									caption: html,
								});
							}}
							style={{ textAlign: "center" }}
						/>
					</Box>
				) : (
					<Box display="flex" flexDirection={"column"} gap={1}>
						{/* Button row */}
						<Box sx={{ display: "flex", gap: 1 }}>
							<NavbarButton
								variant="outline"
								onClick={() => {
									setStateData({ ...stateData, type: "url" });
									setUrlfieldInputValue("");
								}}
								disabled={!postId} // Can only have url if no postId present
								tooltip="Link to image"
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
									setUrlfieldInputValue("");
								}}
								disabled={!postId} // Can only have url if no postId present
								tooltip="Upload your image"
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
									<AddPhotoAlternateOutlined
										sx={{
											height: "14px",
											width: "14px",
											color: "#808080",
											mr: 0.5,
										}}
									/>
									<Typography variant="body2" sx={{ color: "#808080", textTransform: "none" }}>
										{!uploadfieldInputValue || !(uploadfieldInputValue instanceof File)
											? "Upload Image"
											: `${uploadfieldInputValue.name} (${
													uploadfieldInputValue.size > 1048576
														? (uploadfieldInputValue.size / 1048576).toFixed(2) + "mb"
														: (uploadfieldInputValue.size / 1024).toFixed(2) + "kb"
											  })`}
									</Typography>
									<input
										type="file"
										id="fileInput"
										accept="image/*,video/*"
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
								<StyledTextField
									InputLabelProps={{ shrink: false }}
									placeholder="URL"
									name="url"
									fullWidth
									multiline
									size="small"
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
										}
									}}
									inputProps={{
										style: { padding: "0px" },
									}}
									value={urlfieldInputValue}
									onChange={(e: { target: { name: any; value: any } }) => {
										const { name, value } = e.target;
										setUrlfieldInputValue(value);
									}}
								/>
							)}

							{/* Store image if upload and fetch image details */}
							<NavbarButton
								variant="outline"
								onClick={() => {
									if (stateData.type === "upload") {
										// Upload image or video
										uploadImage(uploadfieldInputValue, postId, null)
											.then((uploadResponse) => {
												// Check if response was ok and we got data, else error snackbar
												if (uploadResponse.data) {
													// Check if image, then fetch details and blurhash
													if (uploadfieldInputValue!.type.startsWith("image/")) {
														getImageDetails(uploadResponse.data.url)
															.then((details) => {
																if (details) {
																	setStateData({
																		...stateData,
																		type: "upload",
																		url: uploadResponse.data.url,
																		fileRef: uploadResponse.data.fileRef,
																		fileSize: uploadfieldInputValue!.size,
																		blurhash: details.encoded,
																		height: details.height,
																		width: details.width,
																	});
																} else {
																	enqueueSnackbar("Could not fetch image details", {
																		variant: "error",
																		preventDuplicate: true,
																	});
																}
															})
															.catch((error) => {
																console.error("Error fetching image details:", error);
															});
													} else if (uploadfieldInputValue!.type.startsWith("video/")) {
														setStateData({
															...stateData,
															type: "upload",
															url: uploadResponse.data.url,
															fileRef: uploadResponse.data.fileRef,
															fileSize: uploadfieldInputValue!.size,
														});
													}
												} else {
													enqueueSnackbar(`(${uploadResponse.code}) ${uploadResponse.reason}`, {
														variant: "error",
														preventDuplicate: true,
													});
												}
											})
											.catch((error) => {
												// Handle error from uploadImage
												console.error("Error uploading image:", error);
											});
									} else {
										// Fetch image details
										getImageDetails(urlfieldInputValue)
											.then((details) => {
												if (details) {
													setStateData({
														...stateData,
														type: "url",
														url: urlfieldInputValue,
														blurhash: details.encoded,
														height: details.height,
														width: details.width,
													});
												} else {
													enqueueSnackbar("Could not fetch image details", {
														variant: "error",
														preventDuplicate: true,
													});
												}
											})
											.catch((error) => {
												console.error("Error fetching image details:", error);
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
export default ImageBlock;
