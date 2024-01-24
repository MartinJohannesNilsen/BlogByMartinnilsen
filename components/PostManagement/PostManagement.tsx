import { OutputData } from "@editorjs/editorjs";
import { Clear, Delete, Home, Launch, Save, Update } from "@mui/icons-material";
import {
	Autocomplete,
	Box,
	Button,
	ButtonBase,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	RadioGroup,
	Typography,
	useMediaQuery,
} from "@mui/material";
import Output from "editorjs-react-renderer";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { FC, useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useHotkeys } from "react-hotkeys-hook";
import CreatableSelect from "react-select/creatable";
import { readingTime } from "reading-time-estimator";
import { addPostsOverview, deletePostsOverview, updatePostsOverview } from "../../database/overview";
import { addPost, deletePost, updatePost } from "../../database/posts";
import { addTag, getTags } from "../../database/tags";
import { renderers } from "../../pages/posts/[postId]";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { FullPost, ManageArticleViewProps } from "../../types";
import { NavbarButton } from "../Buttons/NavbarButton";
import { BpRadio } from "../StyledMUI/RadioButton";
import { Tab, Tabs, TabsListHorizontal } from "../StyledMUI/Tabs";
import { StyledTextField } from "../StyledMUI/TextInput";
import { imageDetailsApiFetcher } from "../EditorJS/BlockTools/ImageBlock/ImageBlock";
let EditorBlock;
if (typeof window !== "undefined") {
	EditorBlock = dynamic(() => import("../EditorJS/EditorJS"));
}

const OGDEFAULTS = {
	titleOptimal: 55,
	titleMax: 60,
	descriptionOptimal: 55,
	descriptionWarning: 60,
	descriptionMax: 160,
};

const revalidatePages = async (pages: string[]) => {
	try {
		const responses = await Promise.all(
			pages.map((page) => {
				return fetch("/api/revalidate?path=" + page, {
					headers: {
						accept: "application/json",
						apikey: process.env.NEXT_PUBLIC_API_AUTHORIZATION_TOKEN,
					},
				});
			})
		);
		const res: {
			status: number;
			requests: {
				status: number;
				path: string;
				revalidated: boolean;
			}[];
		} = { status: 200, requests: [] };
		responses.map((response) => {
			if (response.status !== 200) {
				res.status = response.status;
			}
			res.requests.push({
				status: response.status,
				path: new URL(response.url).searchParams.get("path"),
				revalidated: response.status === 200,
			});
		});
		return res;
	} catch (error) {
		console.log(error);
	}
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

const CreatePost: FC<ManageArticleViewProps> = (props) => {
	const { theme, setTheme } = useTheme();
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const [isRevalidated, setIsRevalidated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const [postId, setPostId] = useState<string>(props.post ? (router.query.postId[0] as string) : "");
	const [tagOptions, setTagOptions] = useState<{ value: string; label: string }[]>([]);
	const [editorJSContent, setEditorJSContent] = useState<OutputData>(props.post ? props.post.data : { blocks: [] });
	const [data, setData] = useState<FullPost>({
		published: false,
		type: "",
		tags: [],
		keywords: [],
		title: "",
		description: "",
		ogImage: { src: "", blurhash: null, height: null, width: null },
		data: { blocks: [] },
		author: "Martin Johannes Nilsen",
		createdAt: Date.now(),
		updatedAt: -1,
		readTime: "",
	});
	const handleNavigate = (path: string) => {
		window.location.href = path;
	};
	const { enqueueSnackbar } = useSnackbar();
	const [openTab, setOpenTab] = useState(postId ? 1 : 0);

	useEffect(() => {
		setTheme(ThemeEnum.Light);
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
	}, []);

	useEffect(() => {
		if (props.post) {
			setData(props.post);
			setEditorJSContent(props.post.data);
			setIsLoading(false);
		}
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

				// Get image details
				const details = await imageDetailsApiFetcher(
					process.env.NEXT_PUBLIC_SERVER_URL + "/editorjs/imageblurhash?url=" + encodeURIComponent(data.ogImage.src)
				);

				// Create object
				const newObject = {
					...data,
					data: editorJSContent,
					readTime: readTime,
					// ogImage: { ...data.ogImage, blurhash: details.encoded, height: details.height, width: details.width },
				};

				// If post exists, then update, or add new
				if (postId !== "") {
					// Update field 'updatedAt' only when not localhost
					if (process.env.NEXT_PUBLIC_LOCALHOST === "false") {
						newObject.updatedAt = Date.now();
					}
					updatePost(postId, newObject).then((postWasUpdated) => {
						if (postWasUpdated) {
							enqueueSnackbar("Saving changes ...", {
								variant: "default",
								preventDuplicate: true,
							});
							updatePostsOverview({
								...newObject,
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
							addPostsOverview({
								...newObject,
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
		deletePost(postId).then((postWasDeleted) => {
			if (postWasDeleted) {
				deletePostsOverview(postId).then((overviewWasUpdated) => {
					if (overviewWasUpdated) {
						enqueueSnackbar("Successfully deleted post!", {
							variant: "success",
							preventDuplicate: true,
						});
						revalidatePages(["/", "/tags", "/posts/" + postId]).then(() => {
							handleNavigate("/");
						});
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

	const handleRevalidate = (postId) => {
		enqueueSnackbar("Revalidating pages ...", {
			variant: "default",
			preventDuplicate: true,
		});
		revalidatePages(["/", "/tags", "/posts/" + postId]).then((res) => {
			if (res.status === 200) {
				enqueueSnackbar("Revalidated pages!", {
					variant: "success",
					preventDuplicate: true,
				});
				setIsRevalidated(true);
			} else {
				enqueueSnackbar("Error during revalidation!", {
					variant: "error",
					preventDuplicate: true,
				});
			}
		});
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
					>
						<Box my={1}>
							{/* Button row */}
							<Box display="flex" alignItems="center" minWidth={"380px"} width={width} py={2} columnGap={1}>
								{xs && <Box sx={{ width: "40px" }} />}
								{xs && <Box sx={{ width: "40px" }} />}
								{/* Home */}
								<NavbarButton
									variant="outline"
									href="/"
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
										href={`/posts/${postId}`}
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
								{props.post && (
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
												border: "1px solid red",
												index: 2,
												backgroundColor: theme.palette.primary.main,
												"&:hover": {
													color: "red",
												},
												color: "red",
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

						<Tabs
							defaultValue={openTab}
							onChange={(event, value) => {
								setOpenTab(Number(value));
							}}
						>
							{/* {mdDown ? (
								<TabsListHorizontal>
									<Tab>Info</Tab>
									<Tab>Content</Tab>
								</TabsListHorizontal>
							) : (
								<TabsListVertical>
									<Tab>Info</Tab>
									<Tab>Content</Tab>
								</TabsListVertical>
							)} */}
							<TabsListHorizontal>
								<Tab>Info</Tab>
								<Tab>Content</Tab>
							</TabsListHorizontal>
						</Tabs>

						{/* Information */}
						{openTab === 0 && (
							<Box display="flex" flexDirection="column" sx={{ width: width }} rowGap={2}>
								<Typography variant="h6" color="textPrimary" fontFamily={theme.typography.fontFamily} mt={2} mb={-1.5}>
									Required
								</Typography>
								<StyledTextField
									InputLabelProps={{ shrink: false }}
									placeholder="Type"
									inputProps={{ style: { padding: 10 } }}
									name="type"
									required
									fullWidth
									value={data.type}
									onChange={handleInputChange}
								/>
								<StyledTextField
									InputLabelProps={{ shrink: false }}
									placeholder="Title"
									name="title"
									required
									fullWidth
									inputProps={{
										style: { padding: 10 },
										maxlength: OGDEFAULTS.titleMax,
									}}
									InputProps={{
										endAdornment: (
											<Typography
												fontFamily={theme.typography.fontFamily}
												fontSize={12}
												fontWeight={400}
												sx={{
													ml: 1,
													color: data.title.length <= OGDEFAULTS.titleOptimal ? "green" : "#cfa602",
												}}
											>
												{`${data.title.length}/${OGDEFAULTS.titleMax}`}
											</Typography>
										),
									}}
									value={data.title}
									onChange={handleInputChange}
								/>
								<StyledTextField
									InputLabelProps={{ shrink: false }}
									placeholder="Description"
									name="description"
									fullWidth
									multiline
									size="small"
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											event.preventDefault();
										}
									}}
									inputProps={{
										maxlength: OGDEFAULTS.descriptionMax,
										style: { padding: "0px" },
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
								<Typography variant="h6" color="textPrimary" fontFamily={theme.typography.fontFamily} mt={2} mb={-1.5}>
									Optional
								</Typography>
								<StyledTextField
									InputLabelProps={{ shrink: false }}
									placeholder="Open Graph Image"
									inputProps={{ style: { padding: 10 } }}
									name="image"
									error={
										data.ogImage &&
										data.ogImage.src &&
										data.ogImage.src.trim() !== "" &&
										!isvalidHTTPUrl(data.ogImage.src)
									}
									InputProps={{
										endAdornment: data.ogImage &&
											data.ogImage.src &&
											data.ogImage.src.trim() !== "" &&
											!isvalidHTTPUrl(data.ogImage.src) && (
												<Typography
													fontFamily={theme.typography.fontFamily}
													fontSize={12}
													fontWeight={400}
													sx={{
														ml: 1,
														color: "red",
													}}
												>
													URL
												</Typography>
											),
									}}
									fullWidth
									value={data.ogImage.src}
									onChange={(e) => {
										setIsSaved(false);
										const { value } = e.target;
										setData({
											...data,
											ogImage: { ...data.ogImage, src: value },
										});
									}}
								/>

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
																	sx={{
																		"&: hover": { backgroundColor: "#F5C0B0", color: "#CC4525" },
																		margin: "-2px -4px -2px 3px",
																		padding: 0.5,
																		borderRadius: 0.25,
																	}}
																	onClick={() => {
																		console.log(value);
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
										/>
									)}
								/>
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
									/>
								</Box>
								<Box mt={3} mb={10}>
									<Typography variant="h6" color="textPrimary" fontFamily={theme.typography.fontFamily} mb={0.5}>
										Published
									</Typography>
									<RadioGroup
										// sx={{ marginTop: theme.spacing(-2) }}
										row
										value={data.published}
										name="published-radio-buttons-group"
										onChange={handlePublishedRadioChange}
									>
										<FormControlLabel value={true} control={<BpRadio />} label="Yes" />
										<FormControlLabel value={false} control={<BpRadio />} label="No" />
									</RadioGroup>
								</Box>
							</Box>
						)}

						{/* Content */}
						{openTab === 1 && (
							<Box display="flex" flexDirection="column" sx={{ width: width }}>
								{EditorBlock && !isLoading && (
									<Box mt={3}>
										<EditorBlock data={editorJSContent} onChange={setEditorJSContent} holder="editorjs-container" />
									</Box>
								)}
							</Box>
						)}

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
