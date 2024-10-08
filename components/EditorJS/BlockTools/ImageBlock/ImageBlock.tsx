"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import { StyledTextField } from "@/components/DesignLibrary/Text/TextInput";
import { getImageDetails } from "@/data/middleware/imageBlurhash/details";
import { deleteImage, uploadImage } from "@/data/middleware/imageStore/actions";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { BlockToolImageProps } from "@/types";
import { Add, AddPhotoAlternateOutlined, Delete, Link } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { Fragment, useEffect, useState } from "react";

// Component
export const ImageBlock = (props: BlockToolImageProps) => {
	const { theme } = useTheme();
	const [stateData, setStateData] = useState(
		props.data || {
			type: "upload", // url, upload // Maybe unsplash & paste?
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
			<Box my={2} sx={{ userSelect: "none" }}>
				{stateData.url ? (
					// Render image, caption and deletebutton (if fileRef)
					<Box
						display="flex"
						flexDirection="column"
						gap={1}
						sx={{ position: "relative" }}
						onMouseLeave={() => setDeleteButtonVisible(false)}
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
						<StyledTextField
							InputLabelProps={{ shrink: false }}
							placeholder="Caption"
							name="caption"
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
							value={stateData.caption}
							onChange={(e: { target: { name: any; value: any } }) => {
								const { name, value } = e.target;
								setStateData({
									...stateData,
									[name]: value,
								});
							}}
						/>
					</Box>
				) : (
					// Render input box
					<Box display="flex" gap={1} alignItems="center">
						{/* Upload image */}
						<NavbarButton
							variant="outline"
							onClick={() => {
								if (stateData.type === "upload") {
									setStateData({ ...stateData, type: "url" });
									setUrlfieldInputValue("");
								} else {
									setStateData({ ...stateData, type: "upload" });
									setUrlfieldInputValue("");
								}
							}}
							disabled={!postId} // Can only have url if no postId present
							icon={stateData.type === "upload" ? Link : AddPhotoAlternateOutlined}
							tooltip="Switch between upload and url mode"
							sxButton={{
								minWidth: "40px",
								minHeight: "40px",
								height: "40px",
								width: "40px",
								backgroundColor: theme.palette.text.primary,
								borderColor: theme.palette.grey[400],
								"&:hover": {
									backgroundColor: theme.palette.grey[200],
									borderColor: theme.palette.grey[300],
								},
							}}
							sxIcon={{
								height: "22px",
								width: "22px",
								color: theme.palette.text.secondary,
								"&:hover": {
									opacity: 0.8,
								},
							}}
						/>
						{stateData.type === "upload" ? (
							<>
								<input
									type="file"
									id="fileInput"
									accept="image/*,video/*"
									// accept="image/*"
									style={{ marginLeft: 10 }}
									onChange={(e) => {
										setUploadfieldInputValue(e.target.files![0]);
									}}
								/>
								<Box flexGrow={1} />
							</>
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
							icon={Add}
							tooltip={stateData.type === "upload" ? "Store image and fetch image details" : "Fetch image from url"}
							sxButton={{
								minWidth: "40px",
								minHeight: "40px",
								height: "40px",
								width: "40px",
								backgroundColor: theme.palette.text.primary,
								borderColor: theme.palette.grey[400],
								"&:hover": {
									backgroundColor: theme.palette.grey[200],
									borderColor: theme.palette.grey[300],
								},
							}}
							sxIcon={{
								height: "22px",
								width: "22px",
								color: theme.palette.text.secondary,
								"&:hover": {
									opacity: 0.8,
								},
							}}
						/>
					</Box>
				)}
			</Box>
		</Fragment>
	);
};
export default ImageBlock;
