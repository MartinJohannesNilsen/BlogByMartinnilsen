import { ArrowBackIosNewSharp, ArrowBackIosSharp, ArrowForwardIosSharp } from "@mui/icons-material";
import {
	Box,
	Button,
	Grid,
	IconButton,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
	Typography,
	useMediaQuery,
} from "@mui/material";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTheme } from "../styles/themes/ThemeProvider";
import useAuthorized from "../components/AuthorizationHook/useAuthorized";
import TagsPageCard from "../components/Cards/TagsPageCard";
import Navbar from "../components/Navbar/Navbar";
import SEO from "../components/SEO/SEO";
import { _filterListOfStoredPostsOnPublished, getPostsOverview } from "../database/overview";
import { getTags } from "../database/tags";
import { StoredPost, TagsPageProps } from "../types";
import colorLumincance from "../utils/colorLuminance";
import { splitChunks } from "./index";

// Next.js functions
// On-demand Revalidation, thus no defined revalidation interval
// This means we only revalidate (build) when updating/creating/deleting posts
// https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
export const getStaticProps = async (context: any) => {
	const db_posts = await getPostsOverview(
		"desc",
		false // Do not filter on published
		// process.env.NEXT_PUBLIC_LOCALHOST === "false"
	);
	const posts = db_posts;
	const tags = await getTags();

	return {
		props: {
			posts,
			tags,
		},
	};
};

export const _caseInsensitiveIncludes = (list: string[], word: string, removeSpace?: boolean) => {
	const lowerCaseList = list.map(e => e.toLowerCase());
	if (!removeSpace) return lowerCaseList.includes(word.toLowerCase());
	return lowerCaseList.map(e => e.replace(" ", ""));
};

const _getCaseInsensitiveElement = (list: string[], element: string) => {
	const index = list.findIndex(item => element.toLowerCase().replace(" ", "") === item.toLowerCase().replace(" ", ""));
	if (index === -1) return null;
	return list[index];
};

export const _filterListOfStoredPostsOnTag = (data: StoredPost[], tag: string) => {
	return data.filter(post => post.tags.includes(tag));
};

const TagsPage: FC<TagsPageProps> = props => {
	const { isAuthorized } =
		process.env.NEXT_PUBLIC_LOCALHOST === "true"
			? {
					isAuthorized: true,
			  }
			: useAuthorized();
	const { theme } = useTheme();
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);
	const router = useRouter();
	const [tag, setTag] = useState<string>("loading");
	const { query, isReady } = useRouter();
	const [posts, setPosts] = useState<StoredPost[]>(props.posts);
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

	const updateData = () => {
		if (!tag) {
			setPosts(isAuthorized ? props.posts : _filterListOfStoredPostsOnPublished(props.posts, "published"));
		} else if (tag.toLowerCase() === "published") {
			setPosts(_filterListOfStoredPostsOnPublished(props.posts, "published"));
		} else if (tag.toLowerCase() === "unpublished") {
			if (isAuthorized) {
				setPosts(_filterListOfStoredPostsOnPublished(props.posts, "unpublished"));
			}
		} else {
			setPosts(
				isAuthorized
					? _filterListOfStoredPostsOnTag(props.posts, _getCaseInsensitiveElement(props.tags, tag))
					: _filterListOfStoredPostsOnTag(
							_filterListOfStoredPostsOnPublished(props.posts, "published"),
							_getCaseInsensitiveElement(props.tags, tag)
					  )
			);
		}
	};

	useEffect(() => {
		updateData();
		return () => {};
	}, [isAuthorized]);

	useEffect(() => {
		if (isReady) {
			if (query.name as string) {
				setTag(query.name as string);
			} else {
				setTag(null);
			}
		}
	}, [isReady]);

	useEffect(() => {
		if (isReady) {
			updateData();
			setPage(1);
		}
	}, [tag]);

	useEffect(() => {
		setIsLoading(false);
		return () => {};
	}, [posts]);

	// Check if single tag is provided or if tag not in allowed list
	if (tag === "loading") return <></>;
	if (tag && (tag === "unpublished" || tag === "published") && !isAuthorized) {
		return <ErrorPage statusCode={403} title="Unauthorized access" />;
	}
	if (
		// (tag && router.query.tag.length > 1) ||
		tag &&
		!["all", "published", "unpublished"]
			.concat(props.tags)
			.find(item => tag.toLowerCase().replace(" ", "") === item.toLowerCase().replace(" ", ""))
	) {
		return <ErrorPage statusCode={404} title="This tag could not be found" />;
	}
	return (
		<SEO
			pageMeta={{
				title: tag
					? tag.toLowerCase() === "published" || tag.toLowerCase() === "unpublished"
						? tag.charAt(0).toUpperCase() + tag.slice(1)
						: "#" + _getCaseInsensitiveElement(props.tags, tag).replace(" ", "")
					: "All posts",
			}}
		>
			{isLoading ? (
				<></>
			) : (
				<Box
					sx={{
						height: "100%",
						width: "100%",
						background: theme.palette.primary.main,
					}}
				>
					<Navbar
						backgroundColor={theme.palette.primary.main}
						textColor={theme.palette.text.primary}
						posts={isAuthorized ? props.posts : _filterListOfStoredPostsOnPublished(props.posts, "published")}
					/>
					<Box
						display="flex"
						flexDirection="column"
						sx={{
							minHeight: "100vh",
							height: "100%",
							width: "100%",
							paddingX: lgUp ? "150px" : xs ? "20px" : "80px",
							paddingTop: isMobile ? "55px" : "80px",
							backgroundColor: theme.palette.primary.main,
						}}
					>
						{/* Header */}
						<Box>
							<Typography
								variant={xs ? "h4" : "h3"}
								fontFamily={theme.typography.fontFamily}
								color={theme.palette.text.primary}
								fontWeight={600}
							>
								{tag
									? tag.toLowerCase() === "published" || tag.toLowerCase() === "unpublished"
										? tag.charAt(0).toUpperCase() + tag.slice(1)
										: "#" + _getCaseInsensitiveElement(props.tags, tag).replace(" ", "")
									: "All posts"}
							</Typography>
						</Box>
						{/* Grid of tags and posts */}
						<Grid container pt={xs ? 2 : lgUp ? 4 : 2} pb={4} rowSpacing={xs ? 2 : 4}>
							{/* Tags */}
							<Grid item xs={12} lg={3} order={{ lg: 3, xl: 3 }} sx={lgUp && { position: "fixed", right: 30, mt: -10 }}>
								{/* <Box display={lgUp && "flex"} flexDirection={"column"}> */}
								<Box>
									<Button
										size="small"
										disabled={!tag}
										sx={{
											width: "fit-content",
											border: "1px solid " + theme.palette.secondary.main,
											backgroundColor: !tag ? theme.palette.secondary.main : "",
											"&:hover": {
												border: "1px solid " + colorLumincance(theme.palette.secondary.main, 0.1),
												backgroundColor: !tag
													? theme.palette.secondary.main
													: theme.palette.mode == "dark"
													? theme.palette.grey[900]
													: theme.palette.grey[100],
											},
											margin: 0.5,
											padding: "5px 6px",
										}}
										onClick={() => {
											router.replace("/tags");
											setTag(null);
										}}
									>
										<Typography
											fontFamily={theme.typography.fontFamily}
											color={theme.palette.text.primary}
											variant="body2"
											fontSize={xs ? "11px" : "13px"}
											textTransform="none"
											fontWeight={600}
										>
											All posts
										</Typography>
									</Button>
									{(isAuthorized ? ["Published", "Unpublished"] : []).concat(props.tags.sort()).map(element => (
										<Button
											size="small"
											disabled={tag && tag.toLowerCase().replace(" ", "") === element.toLowerCase().replace(" ", "")}
											sx={{
												width: "fit-content",
												border: "1px solid " + theme.palette.secondary.main,
												backgroundColor:
													tag && tag.toLowerCase().replace(" ", "") === element.toLowerCase().replace(" ", "")
														? theme.palette.secondary.main
														: "",
												"&:hover": {
													border: "1px solid " + colorLumincance(theme.palette.secondary.main, 0.1),
													backgroundColor:
														tag && tag.toLowerCase().replace(" ", "") === element.toLowerCase().replace(" ", "")
															? theme.palette.secondary.main
															: theme.palette.mode == "dark"
															? theme.palette.grey[900]
															: theme.palette.grey[100],
												},
												margin: 0.5,
												padding: "5px 6px",
											}}
											onClick={() => {
												router.replace("/tags?name=" + element.replace(" ", ""));
												setTag(element);
											}}
										>
											<Typography
												fontFamily={theme.typography.fontFamily}
												color={theme.palette.text.primary}
												variant="body2"
												fontSize={xs ? "11px" : "13px"}
												textTransform="none"
												fontWeight={600}
											>
												{element === "Published" || element === "Unpublished"
													? element
													: "#" + _getCaseInsensitiveElement(props.tags, element).replace(" ", "")}
											</Typography>
										</Button>
									))}
								</Box>
							</Grid>
							{/* Separator */}
							<Grid item xs={0} lg={1} order={{ lg: 2, xl: 2 }} />
							{/* Cards and pagination */}
							<Grid item container xs={12} lg={7} order={{ lg: 1, xl: 1 }} rowSpacing={2.5}>
								{/* Cards */}
								{posts && posts.length > 0 ? (
									posts.map((data, index) => {
										return (
											<Grid item key={index} xs={12}>
												<TagsPageCard
													author={data.author}
													description={data.description}
													id={data.id}
													image={data.image}
													published={data.published}
													readTime={data.readTime}
													tags={data.tags}
													createdAt={data.createdAt}
													updatedAt={data.updatedAt}
													title={data.title}
													type={data.type}
												/>
											</Grid>
										);
									})
								) : (
									<Box my={5}>
										<Typography
											variant={"h6"}
											fontFamily={theme.typography.fontFamily}
											color={theme.palette.text.primary}
											fontWeight={600}
											sx={{ opacity: 0.5 }}
										>
											No posts yet with this tag ...
										</Typography>
									</Box>
								)}
								{/* Push items down */}
								<Grid item xs={12} />
							</Grid>
						</Grid>
					</Box>
				</Box>
			)}
		</SEO>
	);
};
export default TagsPage;
