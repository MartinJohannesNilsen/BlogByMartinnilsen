"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import { StyledTextField } from "@/components/DesignLibrary/Text/TextInput";
import { getImageDetails } from "@/data/middleware/imageBlurhash/details";
import { deleteImage, uploadImage } from "@/data/middleware/imageStore/actions";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { BlockToolImageCarouselProps } from "@/types";
import {
	Add,
	AddPhotoAlternateOutlined,
	Clear,
	Collections,
	Delete,
	DragHandle,
	DragIndicator,
	FormatListBulleted,
	Preview,
} from "@mui/icons-material";
import { Box, Button, Divider, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { createRef, Fragment, useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { EditorjsTextBlock } from "../../SharedComponents";
import { ImageCarousel } from "../../Renderers/CustomImageCarousel";

// Component
export const ImageCarouselBlock = (props: BlockToolImageCarouselProps) => {
	const { theme } = useTheme();
	const [stateData, setStateData] = useState(
		props.data || {
			items: [],
		}
	);
	const [newItemData, setNewItemData] = useState({
		type: "url", // url, upload
		url: "",
		fileSize: undefined,
		fileRef: undefined,
	});
	const [postId, setPostId] = useState<string>();
	const [viewMode, setViewMode] = useState<"thumbnail" | "list" | "preview">("thumbnail");
	const [inputType, setInputType] = useState<"url" | "upload">("url");
	const [urlfieldInputValue, setUrlfieldInputValue] = useState("");
	const [uploadfieldInputValue, setUploadfieldInputValue] = useState<any>();
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const captionRefs = useRef<Array<any>>(props.data ? props.data.items.map(() => createRef()) : []);

	// Get PostId from URL
	useEffect(() => {
		const pathSegments = window.location.pathname.split("/").filter(Boolean); // Split by '/' and remove any empty segments
		const lastSegment = pathSegments.pop(); // Gets the last segment

		// Check if the last segment is not "create", then store postId
		if (lastSegment!.toLowerCase() !== "create") {
			setPostId(lastSegment); // Store the last segment in postId
		}
		return () => {};
	}, []);

	// Change Editorjs state on state change
	useEffect(() => {
		props.onDataChange(stateData);
	}, [stateData]);

	// Ensure captionRefs array length matches stateData.items length
	useEffect(() => {
		captionRefs.current = captionRefs.current.slice(0, stateData.items.length);
		while (captionRefs.current.length < stateData.items.length) {
			captionRefs.current.push(createRef());
		}
	}, [stateData.items]);

	// Reorder items in list
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	// Drag and drop handler
	const onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}
		const newItems = reorder(stateData.items, result.source.index, result.destination.index);
		// @ts-ignore
		setStateData({ ...stateData, items: newItems });
	};

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
				{/* Top row */}
				<Box display="flex">
					{/* URL and Upload Buttons */}
					{viewMode !== "preview" && (
						<Box sx={{ display: "flex", gap: 1 }}>
							<NavbarButton
								variant="outline"
								onClick={() => {
									setNewItemData({ ...newItemData, type: "url" });
									setUrlfieldInputValue("");
								}}
								disabled={!postId} // Can only have url if no postId present
								tooltip="Link to image"
								sxButton={{
									backgroundColor:
										newItemData.type == "url"
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
										backgroundColor: newItemData.type == "link" ? theme.palette.grey[200] : theme.palette.grey[200],
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
									setNewItemData({ ...newItemData, type: "upload" });
									setUrlfieldInputValue("");
								}}
								disabled={!postId} // Can only have url if no postId present
								tooltip={!postId ? "Need postId to upload, please create post first!" : "Upload your image"}
								sxButton={{
									backgroundColor:
										newItemData.type == "upload"
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
										backgroundColor: newItemData.type == "upload" ? theme.palette.grey[200] : theme.palette.grey[200],
										color: theme.palette.secondary.main,
										width: "normal",
										height: "normal",
									},
								}}
								text="Upload"
							/>
						</Box>
					)}
					<Box flexGrow={1} />

					{/* View mode buttons */}
					<ToggleButtonGroup size="small">
						<ToggleButton
							disableFocusRipple
							value
							sx={{
								width: 30,
								height: 34,
								borderRadius: "10px",
								color: theme.palette.text.primary,
								border:
									"2px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
								"&:disabled": {
									color: theme.palette.text.primary,
									backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
									border:
										"2px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
								},
								// "&:focus-visible": {
								// 	backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
								// },
							}}
							disabled={viewMode === "thumbnail"}
							onClick={() => setViewMode("thumbnail")}
						>
							<Tooltip enterDelay={2000} title="Thumbnail mode">
								<Collections
									sx={{
										height: 15,
										width: 15,
										color: "inherit",
									}}
								/>
							</Tooltip>
						</ToggleButton>
						<ToggleButton
							disableFocusRipple
							value
							sx={{
								width: 30,
								height: 34,
								borderRadius: "10px",
								color: theme.palette.text.primary,
								border:
									"2px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
								"&:disabled": {
									color: theme.palette.text.primary,
									backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
									border:
										"2px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
								},
								// "&:focus-visible": {
								// 	backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
								// },
							}}
							disabled={viewMode === "list"}
							onClick={() => setViewMode("list")}
						>
							<Tooltip enterDelay={2000} title="List mode">
								<FormatListBulleted
									sx={{
										height: 16,
										width: 16,
										color: "inherit",
									}}
								/>
							</Tooltip>
						</ToggleButton>
						<ToggleButton
							disableFocusRipple
							value
							sx={{
								width: 30,
								height: 34,
								borderRadius: "10px",
								color: theme.palette.text.primary,
								border:
									"2px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
								"&:disabled": {
									color: theme.palette.text.primary,
									backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
									border:
										"2px solid " + (theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
								},
								// "&:focus-visible": {
								// 	backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
								// },
							}}
							disabled={viewMode === "preview"}
							onClick={() => setViewMode("preview")}
						>
							<Tooltip enterDelay={2000} title="Preview mode">
								<Preview
									sx={{
										height: 16,
										width: 16,
										color: "inherit",
									}}
								/>
							</Tooltip>
						</ToggleButton>
					</ToggleButtonGroup>
				</Box>

				{/* Content */}
				{viewMode !== "preview" && (
					<>
						<Box display="flex" flexDirection="row" gap={1} sx={{ my: 2 }}>
							{newItemData.type === "upload" ? (
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
									if (newItemData.type === "upload") {
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
																		items: [
																			...stateData.items,
																			{
																				...newItemData,
																				type: "upload",
																				caption: "",
																				url: uploadResponse.data.url,
																				fileRef: uploadResponse.data.fileRef,
																				fileSize: uploadfieldInputValue!.size,
																				blurhash: details.encoded,
																				height: details.height,
																				width: details.width,
																			},
																		],
																	});
																	setNewItemData({
																		type: "url", // url, upload
																		url: "",
																		fileSize: undefined,
																		fileRef: undefined,
																	});
																	setUploadfieldInputValue("");
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
															items: [
																...stateData.items,
																{
																	...newItemData,
																	type: "upload",
																	caption: "",
																	url: uploadResponse.data.url,
																	fileRef: uploadResponse.data.fileRef,
																	fileSize: uploadfieldInputValue!.size,
																},
															],
														});
														setNewItemData({
															type: "url", // url, upload
															url: "",
															fileSize: undefined,
															fileRef: undefined,
														});
														setUploadfieldInputValue("");
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
												if (details && !details.code) {
													setStateData({
														...stateData,
														items: [
															...stateData.items,
															{
																...newItemData,
																type: "url",
																url: urlfieldInputValue,
																caption: "",
																blurhash: details.encoded,
																height: details.height,
																width: details.width,
															},
														],
													});
													setNewItemData({
														type: "url", // url, upload
														url: "",
														fileSize: undefined,
														fileRef: undefined,
													});
													setUrlfieldInputValue("");
												} else {
													enqueueSnackbar("Could not fetch image details", {
														variant: "error",
														preventDuplicate: true,
													});
												}
											})
											.catch((error) => {
												console.error("Error fetching image details:", error);
												enqueueSnackbar("Could not fetch image details", {
													variant: "error",
													preventDuplicate: true,
												});
											});
									}
								}}
								icon={Add}
								tooltip={newItemData.type === "upload" ? "Store image and fetch image details" : "Fetch image from url"}
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
						<Divider />
					</>
				)}

				{/* Thumbnail display of images */}
				{stateData.items.length === 0 ? (
					<Typography
						variant="body2"
						sx={{ color: theme.palette.text.primary, opacity: 0.2, textAlign: "center", my: 2 }}
					>
						Add the first image in this carousel!
					</Typography>
				) : viewMode === "thumbnail" ? (
					// Display thumbnail images
					<Box sx={{ mt: 1, overflowX: "auto" }}>
						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable droppableId="droppable" direction="horizontal">
								{(provided) => (
									<Box {...provided.droppableProps} ref={provided.innerRef} sx={{ display: "flex" }}>
										{stateData.items.map((item, index) => (
											<Draggable key={index} draggableId={String(index)} index={index}>
												{(provided) => (
													<Box
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														onMouseEnter={() => setHoveredIndex(index)}
														onMouseLeave={() => setHoveredIndex(null)}
														sx={{
															position: "relative",
															display: "flex",
															flexDirection: "column",
															justifyContent: "center",
															alignItems: "center",
															borderRadius: "5px",
															backgroundColor:
																theme.palette.mode == "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
															width: "80px",
															height: "80px",
															margin: "10px 8px 0px 0px",
														}}
													>
														{/* Image */}
														<Box
															sx={{
																position: "relative",
																width: "80px",
																height: "80px",
																borderRadius: "5px",
																overflow: "hidden",
																backgroundColor:
																	theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
															}}
														>
															<img
																src={item.url}
																alt={item.caption}
																style={{
																	width: "100%",
																	height: "100%",
																	objectFit: "cover",
																	filter: hoveredIndex === index ? "brightness(0.6)" : "none", // Darker overlay on hover
																}}
															/>
															{hoveredIndex === index && (
																<DragIndicator
																	sx={{
																		position: "absolute",
																		top: "50%",
																		left: "50%",
																		transform: "translate(-50%, -50%)",
																		color: "white",
																		opacity: 0.8,
																		fontSize: "24px",
																	}}
																/>
															)}
														</Box>

														{/* Delete button */}
														{hoveredIndex === index && (
															<NavbarButton
																variant="outline"
																onClick={() => {
																	const newItems = stateData.items.filter((_, i) => i !== index);
																	if (item.type === "upload" && item.fileRef) {
																		deleteImage(item.fileRef)
																			.then((deleteResponse) => {
																				if (deleteResponse.code === 200) {
																					setStateData({ ...stateData, items: newItems });
																				} else {
																					enqueueSnackbar(`(${deleteResponse.code}) ${deleteResponse.reason}`, {
																						variant: "error",
																						preventDuplicate: true,
																					});
																				}
																			})
																			.catch((error) => {
																				console.error("Error deleting image:", error);
																			});
																	}
																	setStateData({ ...stateData, items: newItems });
																}}
																icon={item.type === "url" ? Clear : Delete}
																tooltip={item.type === "url" ? "Remove" : "Delete"}
																sxButton={{
																	position: "absolute",
																	top: -8,
																	right: -8,
																	minWidth: "20px",
																	minHeight: "20px",
																	height: "20px",
																	width: "20px",
																	backgroundColor:
																		theme.palette.mode == "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
																	borderColor: theme.palette.grey[400],
																	"&:hover": {
																		backgroundColor:
																			theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
																	},
																}}
																sxIcon={{
																	height: "14px",
																	width: "14px",
																	color: theme.palette.text.primary,
																	"&:hover": {
																		opacity: 0.8,
																	},
																}}
															/>
														)}
													</Box>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</Box>
								)}
							</Droppable>
						</DragDropContext>
					</Box>
				) : viewMode === "list" ? (
					// List display of images
					<Box sx={{ mt: 1 }}>
						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable droppableId="droppable" direction="vertical">
								{(provided) => (
									<Box
										{...provided.droppableProps}
										ref={provided.innerRef}
										sx={{ display: "flex", flexDirection: "column", gap: 1 }}
									>
										{stateData.items.map((item, index) => (
											<Draggable key={index} draggableId={String(index)} index={index}>
												{(provided) => (
													<Box
														ref={provided.innerRef}
														{...provided.draggableProps}
														onMouseEnter={() => setHoveredIndex(index)}
														onMouseLeave={() => setHoveredIndex(null)}
														sx={{
															position: "relative",
															display: "flex",
															flexDirection: "row",
															alignItems: "center",
															justifyContent: "center",
															borderRadius: "5px",
															border:
																"2px solid " +
																(theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
															backgroundColor:
																theme.palette.mode == "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
															padding: 1,
														}}
													>
														{/* Drag handle */}
														<Box
															{...provided.dragHandleProps}
															sx={{ cursor: "grab", marginRight: 2, color: theme.palette.grey[500], opacity: 0.6 }}
														>
															<DragHandle />
														</Box>

														{/* Image */}
														<Box
															sx={{
																position: "relative",
																width: "50px",
																height: "50px",
																borderRadius: "5px",
																overflow: "hidden",
																marginRight: 2,
															}}
														>
															<img
																src={item.url}
																alt={item.caption}
																style={{
																	width: "100%",
																	height: "100%",
																	objectFit: "cover",
																}}
															/>
														</Box>

														{/* Caption */}
														<EditorjsTextBlock
															value={item.caption}
															setValue={(html) => {
																const newItems = [...stateData.items];
																newItems[index].caption = html;
																setStateData({ ...stateData, items: newItems });
															}}
															reference={captionRefs.current[index]}
															style={{
																...theme.typography.subtitle1,
																textAlign: "left",
																flexGrow: 1,
																fontFamily: theme.typography.fontFamily,
																fontWeight: 600,
															}}
															dataPlaceholder={["", "<br>"].includes(item.caption.trim()) ? "Caption" : ""}
														/>

														{/* File size */}
														{item.fileSize && (
															<Typography
																variant="body2"
																sx={{ color: theme.palette.text.primary, opacity: 0.2, right: 15, fontWeight: 600 }}
															>
																{item.fileSize > 1073741824
																	? `${(item.fileSize / 1073741824).toFixed(2)} GB`
																	: item.fileSize > 1048576
																	? `${(item.fileSize / 1048576).toFixed(2)} MB`
																	: `${(item.fileSize / 1024).toFixed(2)} KB`}
															</Typography>
														)}

														{/* Delete button */}
														<NavbarButton
															variant="base"
															onClick={() => {
																const newItems = stateData.items.filter((_, i) => i !== index);
																if (item.type === "upload" && item.fileRef) {
																	deleteImage(item.fileRef)
																		.then((deleteResponse) => {
																			if (deleteResponse.code === 200) {
																				setStateData({ ...stateData, items: newItems });
																			} else {
																				enqueueSnackbar(`(${deleteResponse.code}) ${deleteResponse.reason}`, {
																					variant: "error",
																					preventDuplicate: true,
																				});
																			}
																		})
																		.catch((error) => {
																			console.error("Error deleting image:", error);
																		});
																}
																setStateData({ ...stateData, items: newItems });
															}}
															icon={item.type === "url" ? Clear : Delete}
															tooltip={item.type === "url" ? "Remove" : "Delete"}
															sxButton={{ p: 0.5, "&:focus": { borderRadius: 50 } }}
															sxIcon={{ strokeWidth: 0.5, fontSize: "0.5rem" }}
														/>
													</Box>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</Box>
								)}
							</Droppable>
						</DragDropContext>
					</Box>
				) : viewMode === "preview" ? (
					<ImageCarousel items={stateData.items} />
				) : null}
			</Box>
		</Fragment>
	);
};
export default ImageCarouselBlock;
