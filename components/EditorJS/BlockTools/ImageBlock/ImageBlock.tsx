import { Add, AddPhotoAlternateOutlined, Delete, Link } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { Fragment, useEffect, useState } from "react";
import { useTheme } from "../../../../styles/themes/ThemeProvider";
import { NavbarButton } from "../../../Buttons/NavbarButton";
import { deleteImage, uploadImage } from "../../../PostManagement/PostManagement";
import { StyledTextField } from "../../../StyledMUI/TextInput";

export const imageDetailsApiFetcher = async (url: RequestInfo) => {
	// Add apikey header
	const headers = new Headers();
	headers.append("apikey", process.env.NEXT_PUBLIC_API_AUTHORIZATION_TOKEN);

	// Fetch and return
	const res: Response = await fetch(url, {
		method: "GET", // or 'POST', 'PUT', etc.
		headers: headers,
	});
	return await res.json();
};

// Types
type ImageDataProps = {
	type: string; // url, upload, unsplash, paste?
	url: string;
	caption: string;
	blurhash: string;
	height: number;
	width: number;
	fileRef?: string;
	fileSize?: number;
	// unsplash?: { author: string; profileLink: string };
};
type ImageProps = {
	data: ImageDataProps;
	onDataChange: (arg0: any) => void;
	readOnly: boolean;
};

// Component
export const ImageBlock = (props: ImageProps) => {
	const { theme } = useTheme();
	const [stateData, setStateData] = useState(
		props.data || {
			type: "upload", // url, upload // Maybe unsplash & paste?
			url: "",
			caption: "",
			blurhash: "",
			height: 0,
			width: 0,
			fileRef: null,
			fileSize: null,
			// unsplash: null,
		}
	);
	const [postId, setPostId] = useState(null);
	const [urlfieldInputValue, setUrlfieldInputValue] = useState("");
	const [uploadfieldInputValue, setUploadfieldInputValue] = useState(null);
	const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);

	useEffect(() => {
		const pathSegments = window.location.pathname.split("/").filter(Boolean); // Split by '/' and remove any empty segments
		const lastSegment = pathSegments.pop(); // Gets the last segment

		// Check if the last segment is not "create"
		if (lastSegment.toLowerCase() !== "create") {
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
									}}
								>
									{`${(stateData.fileSize / 1024).toFixed(2)}kb`}
								</Typography>
								<NavbarButton
									variant="outline"
									onClick={async () => {
										const response = await deleteImage(stateData.fileRef);
										if (response.code === 200) {
											setStateData({
												...stateData,
												url: "",
												fileRef: null,
												fileSize: null,
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
										border: "1px solid red",
										index: 2,
										backgroundColor: "black",
										color: "red",
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
									event.preventDefault();
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
									setUrlfieldInputValue(null);
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
										setUploadfieldInputValue(e.target.files[0]);
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
										event.preventDefault();
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
							onClick={async () => {
								if (stateData.type === "upload") {
									// Upload image or video
									const uploadResponse = await uploadImage(uploadfieldInputValue, postId, null);

									// Check if response was ok and we got data, else error snackbar
									if (uploadResponse.hasOwnProperty("data")) {
										// Check if image, then fetch details and blurhash
										if (uploadfieldInputValue.type.startsWith("image/")) {
											const details = await imageDetailsApiFetcher(
												process.env.NEXT_PUBLIC_SERVER_URL +
													"/editorjs/imageblurhash?url=" +
													encodeURIComponent(uploadResponse.data.url)
											);
											if (details.hasOwnProperty("code") && details.code !== 200) {
												enqueueSnackbar(details.reason, {
													variant: "error",
													preventDuplicate: true,
												});
											} else {
												await setStateData({
													...stateData,
													type: "upload",
													url: uploadResponse.data.url,
													fileRef: uploadResponse.data.fileRef,
													fileSize: uploadfieldInputValue.size,
													blurhash: details.encoded,
													height: details.height,
													width: details.width,
												});
											}
										} else if (uploadfieldInputValue.type.startsWith("video/")) {
											await setStateData({
												...stateData,
												type: "upload",
												url: uploadResponse.data.url,
												fileRef: uploadResponse.data.fileRef,
												fileSize: uploadfieldInputValue.size,
											});
										}
									} else {
										enqueueSnackbar(`(${uploadResponse.code}) ${uploadResponse.reason}`, {
											variant: "error",
											preventDuplicate: true,
										});
									}
								} else {
									// Fetch image details
									const details = await imageDetailsApiFetcher(
										process.env.NEXT_PUBLIC_SERVER_URL +
											"/editorjs/imageblurhash?url=" +
											encodeURIComponent(urlfieldInputValue)
									);
									if (details.hasOwnProperty("code") && details.code !== 200) {
										enqueueSnackbar(details.reason, {
											// variant: "default",
											variant: "error",
											preventDuplicate: true,
										});
									} else {
										setStateData({
											...stateData,
											type: "url",
											url: urlfieldInputValue,
											blurhash: details.encoded,
											height: details.height,
											width: details.width,
										});
									}
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
