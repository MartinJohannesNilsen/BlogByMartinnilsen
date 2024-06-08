import { renderers } from "@/app/posts/[postId]/clientPage";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import { BpRadio } from "@/components/DesignLibrary/Buttons/RadioButton";
import OptionMenu from "@/components/DesignLibrary/Menus/OptionMenu";
import EditableTypography from "@/components/DesignLibrary/Text/EditableTypography";
import { StyledTextField } from "@/components/DesignLibrary/Text/TextInput";
import { revalidatePost, revalidatePostsOverview, revalidateTags } from "@/data/actions";
import { deleteImage, getImageDetails, uploadImage } from "@/data/middleware/imageStore/actions";
import { addPostsOverview, deletePostsOverview, updatePostsOverview } from "@/data/middleware/overview/actions";
import { addPost, deletePost, updatePost } from "@/data/middleware/posts/actions";
import { addTag, getTags } from "@/data/middleware/tags/actions";
import { DATA_DEFAULTS } from "@/data/metadata";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { FullPost, ManagePostPageProps } from "@/types";
import { copyToClipboardV2 } from "@/utils/copyToClipboard";
import { getTimeZoneUTCFormatString } from "@/utils/timeZoneUTCFormatString";
import { OutputData } from "@editorjs/editorjs";
import { Clear, Close, Delete, Home, Launch, MoreVert, Save, Update, UploadFile } from "@mui/icons-material";
import {
	Autocomplete,
	Box,
	Button,
	ButtonBase,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	Grid,
	IconButton,
	RadioGroup,
	Typography,
	useMediaQuery,
} from "@mui/material";
import Output from "editorjs-react-renderer";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { closeSnackbar, useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { renderToStaticMarkup } from "react-dom/server";
import { useHotkeys } from "react-hotkeys-hook";
import CreatableSelect from "react-select/creatable";
import { readingTime } from "reading-time-estimator";
let EditorBlock;
if (typeof window !== "undefined") {
	EditorBlock = dynamic(() => import("@/components/EditorJS/EditorJS"));
}

const OGDEFAULTS = {
	titleOptimal: 55,
	titleMax: 60,
	descriptionOptimal: 55,
	descriptionWarning: 60,
	descriptionMax: 160,
};

export function isvalidHTTPUrl(string: string) {
	let url;
	try {
		url = new URL(string);
	} catch (e) {
		return false;
	}
	return url.protocol === "http:" || url.protocol === "https:";
}

const CreatePost = ({ post, id }: ManagePostPageProps) => {
	const { theme, setTheme } = useTheme();
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const [isRevalidated, setIsRevalidated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);
	const [postId, setPostId] = useState(id);
	const [tagOptions, setTagOptions] = useState<{ value: string; label: string }[]>([]);
	const [editorJSContent, setEditorJSContent] = useState<OutputData>(post ? post.data : { blocks: [] });
	const [data, setData] = useState<FullPost>({
		published: false,
		type: "",
		tags: [],
		keywords: [],
		title: "",
		description: "",
		ogImage: {
			src: "https://blog.mjntech.dev/assets/icons/ogimage.png",
			// blurhash: null,
			// height: null,
			// width: null,
			// // fileRef: null,
			// fileSize: null,
		},
		data: { blocks: [] },
		author: "Martin Johannes Nilsen",
		createdAt: Date.now(),
		// updatedAt: null,
		readTime: "",
	});
	const handleNavigate = (path: string) => {
		window.location.href = path;
	};
	const { enqueueSnackbar } = useSnackbar();
	const [createdAtEditable, setCreatedAtEditable] = useState(false);
	const [updatedAtEditable, setUpdatedAtEditable] = useState(false);
	const [automaticallySetUpdatedAt, setAutomaticallySetUpdatedAt] = useState(true);

	useEffect(() => {
		if (post) {
			setData(post);
			setEditorJSContent(post.data);
		}
		getTags()
			.then((val) => {
				const array: { value: string; label: string }[] = val.map((item) => ({
					value: item,
					label: item,
				}));
				setTagOptions(array);
			})
			.catch((error) => {
				console.log(error);
			});
		setIsLoading(false);
		return () => {};
	}, []);

	useEffect(() => {
		setIsSaved(false);
		setIsRevalidated(false);
		return () => {};
	}, [editorJSContent]);

	// Width
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const mdDown = useMediaQuery(theme.breakpoints.down("md"));
	const width = mdDown ? "90vw" : "750px";

	const handleInputChange = (e: { target: { name: any; value: any } }) => {
		setIsSaved(false);
		const { name, value } = e.target;
		setData({
			...data,
			[name]: value,
		});
	};

	function extractTextContent(html: string) {
		return html.replace(/<[^>]+>/g, " ");
	}

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		try {
			event.preventDefault();
			if (!isSaved) {
				// Get read time
				const html = renderToStaticMarkup(<Output renderers={renderers} data={data.data} />);
				const text = extractTextContent(html);
				// const readTime = readingTime(text, 275).text;
				// const readTime = "<" + Math.max(readingTime(text, 275).minutes, 1) + " min read";
				const readTime = Math.max(readingTime(text, 275).minutes, 1) + " min read";

				// Create object
				let newObject = {
					...data,
					data: editorJSContent,
					readTime: readTime,
				};

				// Fetch blurhash if null
				if (!data.ogImage.blurhash) {
					// Get image details
					const details = await getImageDetails(data.ogImage.src);
					if (details.hasOwnProperty("code") && details.code !== 200) {
						enqueueSnackbar(`Open Graph Image: ${details.reason}`, {
							variant: "error",
							preventDuplicate: true,
						});
					} else {
						newObject = {
							...newObject,
							ogImage: { ...data.ogImage, blurhash: details.encoded, height: details.height, width: details.width },
						};
					}
				}

				// If post exists, then update, or add new
				if (postId) {
					// Update field 'updatedAt' only when not localhost and not adjusted already
					// if (process.env.NEXT_PUBLIC_LOCALHOST === "false" && post.updatedAt === newObject.updatedAt) {
					if (process.env.NEXT_PUBLIC_LOCALHOST === "false" && automaticallySetUpdatedAt) {
						newObject.updatedAt = Date.now();
						setData({ ...data, updatedAt: newObject.updatedAt });
					}
					updatePost(postId, newObject).then((postWasUpdated) => {
						if (postWasUpdated) {
							enqueueSnackbar("Saving changes ...", {
								variant: "default",
								preventDuplicate: true,
							});
							const { data, ...overviewObject } = newObject; // Should not include data in postsOverview
							updatePostsOverview({
								...overviewObject,
								id: postId,
							}).then((overviewWasUpdated) => {
								if (overviewWasUpdated) {
									enqueueSnackbar("Your changes are saved!", {
										variant: "success",
										preventDuplicate: true,
									});
									setIsSaved(true);
								} else {
									enqueueSnackbar("An error occurred!", {
										variant: "error",
										preventDuplicate: true,
									});
								}
							});
						}
					});
				} else {
					addPost(newObject).then((postId) => {
						if (postId) {
							enqueueSnackbar("Creating post ...", {
								variant: "default",
								preventDuplicate: true,
							});
							// Remove data before pushing to posts overview
							const { data, ...newPost } = newObject;
							// Push to posts overview
							addPostsOverview({
								...newPost,
								id: postId,
							}).then((overviewWasAdded) => {
								if (overviewWasAdded) {
									enqueueSnackbar("Successfully created post!", {
										variant: "success",
										preventDuplicate: true,
									});
									setPostId(postId);
									setIsSaved(true);
									handleRevalidate(postId);
								} else {
									enqueueSnackbar("An error occurred!", {
										variant: "error",
										preventDuplicate: true,
									});
								}
							});
						}
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const handleDeleteDialogOpen = () => {
		setDeleteDialogOpen(true);
	};
	const handleDeleteDialogClose = () => {
		setDeleteDialogOpen(false);
	};

	const handleDeletePost = () => {
		handleDeleteDialogClose();
		enqueueSnackbar("Deleting post ...", {
			variant: "default",
			preventDuplicate: true,
		});
		if (postId) {
			deletePost(postId).then((postWasDeleted) => {
				if (postWasDeleted) {
					deletePostsOverview(postId).then((overviewWasUpdated) => {
						if (overviewWasUpdated) {
							enqueueSnackbar("Successfully deleted post!", {
								variant: "success",
								preventDuplicate: true,
							});
							Promise.all([revalidatePost(postId), revalidatePostsOverview(), revalidateTags()])
								.then(() => {
									handleNavigate("/");
								})
								.catch((error) =>
									enqueueSnackbar("Error during cache revalidation!", {
										variant: "error",
										preventDuplicate: true,
									})
								);
						} else {
							enqueueSnackbar("An error occured ...", {
								variant: "error",
								preventDuplicate: true,
							});
						}
					});
				} else {
					enqueueSnackbar("An error occured ...", {
						variant: "error",
						preventDuplicate: true,
					});
				}
			});
		}
	};

	const handleCreateTagOption = (inputValue: string) => {
		addTag(inputValue)
			.then((val) => {
				if (val) {
					const newOption = { value: inputValue, label: inputValue };
					setTagOptions((prev) => [...prev, newOption]);
					setData({ ...data, tags: data.tags.concat(newOption.value) });
				}
			})
			.catch((error) => console.log(error));
	};

	const handlePublishedRadioChange = (event: { target: { value: any } }) => {
		setIsSaved(false);
		setData({ ...data, published: event.target.value === "true" });
	};

	const revalidateAction = (snackbarId, postId) => (
		<>
			<IconButton size="small" disableRipple onClick={() => (window.location.href = `/posts/${postId}`)}>
				<Launch fontSize="small" sx={{ color: "white" }} />
			</IconButton>
			<IconButton size="small" disableRipple onClick={() => closeSnackbar(snackbarId)}>
				<Close fontSize="small" sx={{ color: "white" }} />
			</IconButton>
		</>
	);
	const handleRevalidate = (postId) => {
		enqueueSnackbar("Revalidating cache ...", {
			variant: "default",
			preventDuplicate: true,
		});
		Promise.all([revalidatePost(postId), revalidatePostsOverview(), revalidateTags()])
			.then(() => {
				enqueueSnackbar("Revalidated cache!", {
					action: (id) => revalidateAction(id, postId),
					variant: "success",
					preventDuplicate: true,
				});
				setIsRevalidated(true);
			})
			.catch((error) =>
				enqueueSnackbar("Error during cache revalidation!", {
					variant: "error",
					preventDuplicate: true,
				})
			);
	};

	useHotkeys(["Control+s", "Meta+s"], (event) => {
		event.preventDefault();
		// handleSubmit(event);
	});

	return (
		<>
			{!isLoading && (
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					sx={{
						minWidth: "100vw",
						minHeight: "100vh",
						height: "100%",
						backgroundColor: theme.palette.primary.main,
					}}
				>
					<form
						onSubmit={handleSubmit}
						onKeyDown={(e) => {
							if ((e.metaKey && e.key === "s") || (e.ctrlKey && e.key === "s")) {
								e.preventDefault();
								handleSubmit(e);
							} else if (e.key === "Tab") {
								// e.preventDefault();
							}
						}}
						// style={{ position: "relative", width: "100%" }}
					>
						{/* Button row */}
						<Box my={1}>
							<Box display="flex" alignItems="center" minWidth={"380px"} width={width} py={2} columnGap={1}>
								{xs && <Box sx={{ width: "40px" }} />}
								{xs && <Box sx={{ width: "40px" }} />}
								{/* Home */}
								<NavbarButton
									variant="outline"
									// href="/"
									onClick={() => (window.location.href = `/`)}
									icon={Home}
									tooltip="Go to landing page"
									sxButton={{
										minWidth: "40px",
										minHeight: "40px",
										height: "40px",
										width: "40px",
									}}
									sxIcon={{
										height: "22px",
										width: "22px",
										color: "inherit",
									}}
								/>
								{/* Launch */}
								{postId && (
									<NavbarButton
										variant="outline"
										// href={`/posts/${postId}`}
										onClick={() => (window.location.href = `/posts/${postId}`)}
										icon={Launch}
										tooltip="View post"
										sxButton={{
											minWidth: "40px",
											minHeight: "40px",
											height: "40px",
											width: "40px",
										}}
										sxIcon={{
											height: "22px",
											width: "22px",
											color: "inherit",
										}}
									/>
								)}
								<Box flexGrow={1} />
								{/* Delete */}
								{post && (
									<>
										<NavbarButton
											variant="outline"
											onClick={handleDeleteDialogOpen}
											icon={Delete}
											tooltip="Delete post"
											sxButton={{
												minWidth: "40px",
												minHeight: "40px",
												height: "40px",
												width: "40px",
												index: 2,
												backgroundColor: theme.palette.primary.main,
												"&:focus-visible": {
													backgroundColor:
														theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
												},
												"&:hover": {
													border: "1px solid rgba(255,0,0,0.8)",
													color: "rgba(255,0,0,0.8)",
													backgroundColor:
														theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
												},
											}}
											sxIcon={{
												height: "24px",
												width: "24px",
												color: "inherit",
											}}
										/>
										<Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
											<DialogTitle>Delete post</DialogTitle>
											<DialogContent>
												<Typography
													fontFamily={theme.typography.fontFamily}
													variant="body1"
													color={theme.palette.text.primary}
												>
													{`Are you sure you want to delete the post "${data.title}" (id: ${postId})?`}
												</Typography>
											</DialogContent>
											<DialogActions sx={{ marginRight: theme.spacing(2) }}>
												<Button
													LinkComponent={NextLink}
													onClick={handleDeleteDialogClose}
													sx={
														{
															// border: "2px solid " + theme.palette.text.primary,
														}
													}
												>
													<Typography
														fontFamily={theme.typography.fontFamily}
														variant="button"
														color={theme.palette.text.primary}
													>
														No
													</Typography>
												</Button>
												<Button
													LinkComponent={NextLink}
													onClick={handleDeletePost}
													autoFocus
													sx={
														{
															// border: "2px solid red",
														}
													}
												>
													<Typography fontFamily={theme.typography.fontFamily} variant="button" color="red">
														Yes
													</Typography>
												</Button>
											</DialogActions>
										</Dialog>
									</>
								)}
							</Box>
						</Box>

						{/* Title */}
						<EditableTypography
							variant="h3"
							sx={{
								my: 1,
								width: width,
								opacity: data.title.trim() == "" ? 0.3 : 1,
								color:
									data.title.length > OGDEFAULTS.titleOptimal
										? data.title.length > OGDEFAULTS.titleMax
											? "red"
											: "#cfa602"
										: theme.palette.text.primary,
							}}
							onChange={(e) => setData({ ...data, title: e })}
							placeholder="Untitled"
						>
							{data.title}
						</EditableTypography>

						{/* Properties */}
						<Box display="flex" flexDirection="column" sx={{ width: width }} rowGap={2} my={1}>
							<Divider />
							<Typography variant="h6" color="textPrimary" fontFamily={theme.typography.fontFamily} mt={1} mb={-1}>
								Properties
							</Typography>
							<Grid container alignItems="center" justifyContent="flex-start" rowGap={1}>
								{/* Date and time */}
								{post && (
									<>
										<Grid item xs={3} md={2}>
											<Typography sx={{ fontWeight: 600 }}>Created at</Typography>
										</Grid>
										<Grid item xs={9} md={10}>
											{/* Created At */}
											<Box display="flex" gap={0.5} alignItems="center">
												{/* {xs && <Box flexGrow={1} />} */}
												<Box sx={{ width: "180px" }}>
													<input
														style={{
															border:
																"1px solid " +
																(theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400]),
															borderRadius: 5,
															padding: 5,
															fontFamily: theme.typography.fontFamily,
															fontWeight: 600,
															fontSize: isMobile ? 18 : 15,
															width: "100%",
														}}
														disabled={!createdAtEditable}
														type="datetime-local"
														name="createdAt"
														// onKeyDown={(e) => {
														// 	if (e.key === "Delete") e.preventDefault();
														// }}
														value={getTimeZoneUTCFormatString(new Date(data.createdAt), "Europe/Oslo")}
														onChange={(e) => {
															setData({ ...data, createdAt: new Date(e.target.value).valueOf() });
														}}
													/>
												</Box>
												<OptionMenu
													icon={MoreVert}
													menuItems={[
														{
															text: createdAtEditable ? "Set uneditable " : "Set editable",
															onClick: () => {
																setCreatedAtEditable(!createdAtEditable);
															},
														},
														{
															text: "Set to initial",
															disabled: !post,
															onClick: () => {
																setData({ ...data, createdAt: post!.createdAt });
																setCreatedAtEditable(false);
															},
														},
														{
															text: "Set to now",
															onClick: () => {
																setData({ ...data, createdAt: Date.now() });
															},
														},
													]}
												/>
											</Box>
										</Grid>
										<Grid item xs={3} md={2}>
											<Typography sx={{ fontWeight: 600 }}>Last edited</Typography>
										</Grid>
										<Grid item xs={9} md={10}>
											{/* Updated At */}
											<Box display="flex" gap={0.5} alignItems="center" justifyContent="flex-start">
												{/* {xs && <Box flexGrow={1} />} */}
												<Box sx={{ width: "180px" }}>
													{automaticallySetUpdatedAt ? (
														<input
															style={{
																border:
																	"1px solid " +
																	(theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400]),
																borderRadius: 5,
																padding: "7px 7px",
																marginRight: -1,
																fontFamily: theme.typography.fontFamily,
																fontWeight: 600,
																fontSize: isMobile ? 18 : 15,
																color: theme.palette.grey[400],
																width: "100%",
															}}
															disabled
															name="updatedAt"
															value="Automatic on save"
															onChange={(e) => setData({ ...data, updatedAt: new Date(e.target.value).valueOf() })}
														/>
													) : data.updatedAt ? (
														<input
															style={{
																border:
																	"1px solid " +
																	(theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400]),
																borderRadius: 5,
																padding: "5px 5px",
																fontFamily: theme.typography.fontFamily,
																fontWeight: 600,
																fontSize: isMobile ? 18 : 15,
																width: "100%",
															}}
															disabled={!updatedAtEditable}
															type="datetime-local"
															name="updatedAt"
															value={getTimeZoneUTCFormatString(new Date(data.updatedAt), "Europe/Oslo")}
															onChange={(e) => setData({ ...data, updatedAt: new Date(e.target.value).valueOf() })}
														/>
													) : (
														<input
															style={{
																border:
																	"1px solid " +
																	(theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400]),
																borderRadius: 5,
																padding: "7px 7px",
																fontFamily: theme.typography.fontFamily,
																fontWeight: 600,
																fontSize: isMobile ? 18 : 15,
																color: theme.palette.grey[400],
																width: "100%",
																marginRight: -1,
															}}
															disabled
															name="updatedAt"
															value={post.updatedAt ? "Will be removed" : "Not yet updated"}
															onChange={(e) => {
																setData({ ...data, updatedAt: new Date(e.target.value).valueOf() });
															}}
														/>
													)}
												</Box>
												<OptionMenu
													icon={MoreVert}
													menuItems={[
														{
															text: "Set editable",
															disabled: updatedAtEditable,
															onClick: () => {
																setData({ ...data, updatedAt: post!.updatedAt || data.createdAt });
																setAutomaticallySetUpdatedAt(false);
																setUpdatedAtEditable(true);
															},
														},
														{
															text: "Set to initial",
															disabled: !post,
															onClick: () => {
																setData({ ...data, updatedAt: post!.updatedAt });
																setAutomaticallySetUpdatedAt(false);
																setUpdatedAtEditable(false);
															},
														},
														{
															text: "Set to default",
															onClick: () => {
																setUpdatedAtEditable(false);
																setAutomaticallySetUpdatedAt(true);
															},
														},
														{
															text: "Remove",
															disabled: !post?.updatedAt,
															onClick: () => {
																setData({ ...data, updatedAt: null });
																setAutomaticallySetUpdatedAt(false);
																setUpdatedAtEditable(false);
															},
														},
													]}
												/>
												{/* <NavbarButton
													variant="outline"
													onClick={() => {
														setData({ ...data, updatedAt: post.updatedAt || data.createdAt });
														setAutomaticallySetUpdatedAt(false);
														setUpdatedAtEditable(true);
													}}
													icon={Edit}
													tooltip="Edit"
													disabled={updatedAtEditable}
													sxButton={{
														minWidth: "36px",
														minHeight: "36px",
														height: "36px",
														width: "36px",
													}}
													sxIcon={{
														height: "18px",
														width: "18px",
														color: "inherit",
													}}
												/>
												<NavbarButton
													variant="outline"
													onClick={() => {
														setData({ ...data, updatedAt: post.updatedAt });
														setAutomaticallySetUpdatedAt(false);
														setUpdatedAtEditable(false);
													}}
													disabled={!post}
													icon={Restore}
													tooltip="Revert"
													sxButton={{
														minWidth: "36px",
														minHeight: "36px",
														height: "36px",
														width: "36px",
													}}
													sxIcon={{
														height: "18px",
														width: "18px",
														color: "inherit",
													}}
												/>
												<Typography
													// onClick={() => setData({ ...data, updatedAt: Date.now() })}
													onClick={() => {
														setUpdatedAtEditable(false);
														setAutomaticallySetUpdatedAt(true);
													}}
													ml={1}
													sx={{
														fontFamily: theme.typography.fontFamily,
														fontSize: 14,
														fontWeight: 600,
														color: theme.palette.grey[500],
														display: "inline-block", // Allows the underline to fit the text
														cursor: "pointer", // Changes the cursor to indicate it's clickable
														textDecoration: "none", // Ensures text is not underlined by default
														"&:hover": {
															textDecoration: "underline", // Underlines text on hover
														},
													}}
												>
													Default
												</Typography>
												<Typography
													onClick={() => {
														setData({ ...data, updatedAt: null });
														setAutomaticallySetUpdatedAt(false);
														setUpdatedAtEditable(false);
													}}
													ml={1}
													sx={{
														fontFamily: theme.typography.fontFamily,
														fontSize: 14,
														fontWeight: 600,
														color: theme.palette.grey[500],
														display: "inline-block", // Allows the underline to fit the text
														cursor: "pointer", // Changes the cursor to indicate it's clickable
														textDecoration: "none", // Ensures text is not underlined by default
														"&:hover": {
															textDecoration: "underline", // Underlines text on hover
														},
													}}
												>
													Remove
												</Typography> */}
											</Box>
										</Grid>
									</>
								)}
								{/* Open Graph Image */}
								{postId && (
									<>
										<Grid item xs={3} md={2}>
											<Typography sx={{ fontWeight: 600 }}>OG Image</Typography>
										</Grid>
										<Grid item xs={9} md={10}>
											{data.ogImage.hasOwnProperty("fileRef") && data.ogImage.fileRef ? (
												<Box display="flex" alignItems="center" gap={0.5}>
													<StyledTextField
														disabled
														InputLabelProps={{ shrink: false }}
														placeholder="Open Graph Image"
														inputProps={{ style: { padding: 0 } }}
														// sx={{ backgroundColor: theme.palette.primary.main, width: 155.5 }}
														sx={{ backgroundColor: theme.palette.primary.main, width: "100%" }}
														name="image"
														// fullWidth
														value={data.ogImage.src}
													/>
													<OptionMenu
														icon={MoreVert}
														menuItems={[
															{
																text: "Copy",
																onClick: async () => {
																	await copyToClipboardV2(data.ogImage.src)
																		.then(() =>
																			enqueueSnackbar(`Link copied to clipboard`, {
																				variant: "success",
																				preventDuplicate: true,
																			})
																		)
																		.catch(() =>
																			enqueueSnackbar(`Could not copy to clipboard`, {
																				variant: "error",
																				preventDuplicate: true,
																			})
																		);
																},
															},
															{
																text: "Open",
																onClick: () => {
																	window.open(data.ogImage.src, "_blank");
																},
															},
															{
																text: `Size: ${(data.ogImage.fileSize! / 1024).toFixed(2)}kb`,
																disabled: true,
																onClick: () => {},
															},
															{
																text: "Delete",
																onClick: async () => {
																	const response = await deleteImage(data.ogImage.fileRef);
																	if (response.code === 200) {
																		setData({
																			...data,
																			ogImage: {
																				...data.ogImage,
																				src: DATA_DEFAULTS.images.openGraph,
																				fileRef: undefined,
																				fileSize: undefined,
																			},
																		});
																		enqueueSnackbar(`Open Graph Image successfully deleted`, {
																			variant: "success",
																			preventDuplicate: true,
																		});
																	} else {
																		enqueueSnackbar(`(${response.code}) ${response.reason}`, {
																			variant: "error",
																			preventDuplicate: true,
																		});
																	}
																},
															},
														]}
													/>
												</Box>
											) : (
												// Old version
												<>
													<input
														type="file"
														id="fileInput"
														accept="image/*"
														onChange={async (e) => {
															const file = e.target.files && e.target.files[0];
															const uploadResponse = await uploadImage(file, postId, "ogImage");
															if (uploadResponse.hasOwnProperty("data")) {
																const details = await getImageDetails(uploadResponse.data.url);
																setData({
																	...data,
																	ogImage: {
																		...data.ogImage,
																		src: uploadResponse.data.url,
																		height: details.height,
																		width: details.width,
																		blurhash: details.encoded,
																		fileRef: uploadResponse.data.fileRef,
																		fileSize: file!.size,
																	},
																});
																enqueueSnackbar(`Open Graph Image uploaded (${(file!.size / 1024).toFixed(2)}kb)`, {
																	variant: "success",
																	preventDuplicate: true,
																});
															} else {
																enqueueSnackbar(`(${uploadResponse.code}) ${uploadResponse.reason}`, {
																	variant: "error",
																	preventDuplicate: true,
																});
															}
														}}
														style={{ display: "none" }}
													/>
													<label htmlFor="fileInput">
														<Button
															component="span"
															sx={{
																border:
																	"1px solid " +
																	(theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400]),
																borderRadius: "5px",
																padding: "5px 5px",
																fontFamily: theme.typography.fontFamily,
																fontWeight: 600,
																fontSize: isMobile ? 18 : 15,
																color: theme.palette.grey[400],
																width: "180px",
																textTransform: "none",
															}}
														>
															<UploadFile sx={{ mr: "2px", fontSize: isMobile ? 18 : 15 }} />
															Select File
														</Button>
													</label>
												</>

												// New version
												// <FileInputSelector
												// 	type="file"
												// 	id="fileInput"
												// 	accept="image/*"
												// 	onChange={async (e) => {
												// 		const file = e.target.files && e.target.files[0];
												// 		const uploadResponse = await uploadImage(file, postId, "ogImage");
												// 		if (uploadResponse.hasOwnProperty("data")) {
												// 			const details = await getImageDetails(uploadResponse.data.url);
												// 			setData({
												// 				...data,
												// 				ogImage: {
												// 					...data.ogImage,
												// 					src: uploadResponse.data.url,
												// 					height: details.height,
												// 					width: details.width,
												// 					blurhash: details.encoded,
												// 					fileRef: uploadResponse.data.fileRef,
												// 					fileSize: file!.size,
												// 				},
												// 			});
												// 			enqueueSnackbar(`Open Graph Image uploaded (${(file!.size / 1024).toFixed(2)}kb)`, {
												// 				variant: "success",
												// 				preventDuplicate: true,
												// 			});
												// 		} else {
												// 			enqueueSnackbar(`(${uploadResponse.code}) ${uploadResponse.reason}`, {
												// 				variant: "error",
												// 				preventDuplicate: true,
												// 			});
												// 		}
												// 	}}
												// />
											)}
										</Grid>
									</>
								)}
								{/* Tags */}
								<Grid item xs={3} md={2}>
									<Typography sx={{ fontWeight: 600 }}>Tags</Typography>
								</Grid>
								<Grid item xs={9} md={10}>
									<Box sx={{ zIndex: 5 }}>
										<CreatableSelect
											isMulti
											isClearable
											isSearchable
											placeholder="Tags"
											value={data.tags.map((tag) => ({ value: tag, label: tag }))}
											onChange={(array) => {
												setData({ ...data, tags: array.map((item) => item.value) });
											}}
											onCreateOption={handleCreateTagOption}
											options={tagOptions}
											maxMenuHeight={204}
										/>
									</Box>
								</Grid>
								{/* Keywords */}
								<Grid item xs={3} md={2}>
									<Typography sx={{ fontWeight: 600 }}>Keywords</Typography>
								</Grid>
								<Grid item xs={9} md={10}>
									<Autocomplete
										freeSolo
										multiple
										options={[]}
										value={data.keywords}
										onChange={(event, newValue) => {
											setData({ ...data, keywords: newValue });
										}}
										renderInput={(params) => (
											<StyledTextField
												{...params}
												InputLabelProps={{ shrink: false }}
												placeholder={data.keywords && data.keywords.length !== 0 ? "" : "Keywords"}
												variant="outlined"
												sx={{ backgroundColor: theme.palette.primary.main }}
												InputProps={{
													style: { padding: 3 },
													startAdornment: (
														<Box marginLeft={0.5} display="flex" flexWrap="wrap">
															{data.keywords?.map((value, index) => (
																<Box
																	key={index}
																	display="flex"
																	sx={{
																		backgroundColor: "#E6E6E6",
																		borderRadius: 0.5,
																		padding: "2px 4px",
																		marginLeft: 0.5,
																		marginY: 0.25,
																	}}
																>
																	<Typography sx={{ color: "#333333", fontWeight: 500, fontSize: 14 }}>
																		{value}
																	</Typography>
																	<ButtonBase
																		LinkComponent={NextLink}
																		sx={{
																			"&: hover": { backgroundColor: "#F5C0B0", color: "#CC4525" },
																			margin: "-2px -4px -2px 3px",
																			padding: 0.5,
																			borderRadius: 0.25,
																		}}
																		onClick={() => {
																			setData({
																				...data,
																				keywords: data.keywords.filter((keyword) => keyword !== value),
																			});
																		}}
																	>
																		<Clear sx={{ width: 12, height: 12, fontWeight: 1000 }} />
																	</ButtonBase>
																</Box>
															))}
														</Box>
													),
												}}
												inputProps={{
													...params.inputProps,
													onKeyDown: (e) => {
														if (e.key === "Enter") {
															// e.stopPropagation();
															e.preventDefault();
														}
													},
													style: { paddingLeft: "3px", paddingRight: "3px", paddingTop: "4px", paddingBottom: "4px" },
												}}
											/>
										)}
									/>
								</Grid>
								{/* Type */}
								<Grid item xs={3} md={2}>
									<Typography sx={{ fontWeight: 600 }}>Type</Typography>
								</Grid>
								<Grid item xs={9} md={10}>
									<StyledTextField
										InputLabelProps={{ shrink: false }}
										placeholder="Type"
										inputProps={{ style: { padding: 0 } }}
										name="type"
										required
										fullWidth
										sx={{ backgroundColor: theme.palette.primary.main }}
										value={data.type}
										onChange={handleInputChange}
									/>
								</Grid>
								{/* Description */}
								<Grid item xs={3} md={2}>
									<Typography sx={{ fontWeight: 600 }}>Description</Typography>
								</Grid>
								<Grid item xs={9} md={10}>
									<StyledTextField
										InputLabelProps={{ shrink: false }}
										placeholder="Description"
										name="description"
										fullWidth
										multiline
										size="small"
										sx={{ backgroundColor: theme.palette.primary.main }}
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												event!.preventDefault();
											}
										}}
										inputProps={{
											maxlength: OGDEFAULTS.descriptionMax,
											style: { padding: 0 },
										}}
										InputProps={{
											endAdornment: (
												<Typography
													fontFamily={theme.typography.fontFamily}
													fontSize={12}
													fontWeight={400}
													sx={{
														ml: 1,
														color:
															data.description.length <= OGDEFAULTS.descriptionOptimal
																? "green"
																: data.description.length <= OGDEFAULTS.descriptionWarning
																? theme.palette.text.primary
																: "#cfa602",
													}}
												>
													{`${data.description.length}/${OGDEFAULTS.descriptionMax}`}
												</Typography>
											),
										}}
										value={data.description}
										onChange={handleInputChange}
									/>
								</Grid>
								{/* Published */}
								<Grid item xs={3} md={2}>
									<Typography sx={{ fontWeight: 600 }}>Published</Typography>
								</Grid>
								<Grid item xs={9} md={10}>
									<RadioGroup
										sx={{ marginLeft: theme.spacing(0.5) }}
										row
										value={data.published}
										name="published-radio-buttons-group"
										onChange={handlePublishedRadioChange}
									>
										<FormControlLabel value={true} control={<BpRadio />} label="Yes" />
										<FormControlLabel value={false} control={<BpRadio />} label="No" />
									</RadioGroup>
								</Grid>
							</Grid>
							<Divider />
						</Box>

						{/* Content */}
						<Box display="flex" flexDirection="column" sx={{ width: width }}>
							{EditorBlock && !isLoading && (
								<Box mt={3}>
									<EditorBlock data={editorJSContent} onChange={setEditorJSContent} holder="editorjs-container" />
								</Box>
							)}
						</Box>

						{/* Button row */}
						<Box
							display="flex"
							columnGap={1}
							sx={
								xs
									? { position: "fixed", left: 22, top: 24, zIndex: 100 }
									: { position: "fixed", left: 25, bottom: 25, zIndex: 100 }
							}
						>
							{/* Submit button */}
							<NavbarButton
								type="submit"
								variant="outline"
								icon={Save}
								tooltip="Save changes"
								disabled={isSaved || editorJSContent.blocks.length === 0}
								sxButton={{
									minWidth: "40px",
									minHeight: "40px",
									height: "40px",
									width: "40px",
									border: isSaved
										? "1px solid green"
										: "1px solid " +
										  (theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400]),
									color: isSaved ? "green" : theme.palette.text.primary,
								}}
								sxIcon={{
									height: "24px",
									width: "24px",
									color: "inherit",
								}}
							/>
							{/* Revalidate button */}
							{isSaved && (
								<NavbarButton
									variant="outline"
									onClick={() => {
										handleRevalidate(postId);
									}}
									icon={Update}
									tooltip="Revalidate pages"
									disabled={isRevalidated}
									sxButton={{
										minWidth: "40px",
										minHeight: "40px",
										height: "40px",
										width: "40px",
										border: isRevalidated
											? "1px solid green"
											: "1px solid " +
											  (theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400]),
										color: isRevalidated ? "green" : theme.palette.text.primary,
									}}
									sxIcon={{
										height: "24px",
										width: "24px",
										color: "inherit",
									}}
								/>
							)}
						</Box>
					</form>
				</Box>
			)}
		</>
	);
};
export default CreatePost;
