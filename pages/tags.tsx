import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import useAuthorized from "../components/AuthorizationHook/useAuthorized";
import TagsPageCard from "../components/Cards/TagsPageCard";
import Navbar from "../components/Navbar/Navbar";
import SEO from "../components/SEO/SEO";
import { _filterListOfStoredPostsOnPublished, getPostsOverview } from "../database/overview";
import { getTags } from "../database/tags";
import { useTheme } from "../styles/themes/ThemeProvider";
import { StoredPost, TagsPageProps } from "../types";
import colorLumincance from "../utils/colorLuminance";
import NextLink from "next/link";
import { WebPageJsonLd } from "next-seo";

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
	const lowerCaseList = list.map((e) => e.toLowerCase());
	if (!removeSpace) return lowerCaseList.includes(word.toLowerCase());
	return lowerCaseList.map((e) => e.replace(" ", ""));
};

const _getCaseInsensitiveElement = (list: string[], element: string) => {
	const index = list.findIndex(
		(item) => element.toLowerCase().replace(" ", "") === item.toLowerCase().replace(" ", "")
	);
	if (index === -1) return null;
	return list[index];
};

export const _filterListOfStoredPostsOnTag = (data: StoredPost[], tag: string) => {
	return data.filter((post) => post.tags.includes(tag));
};

const TagsPage: FC<TagsPageProps> = (props) => {
	const { isAuthorized } =
		process.env.NEXT_PUBLIC_LOCALHOST === "true"
			? {
					isAuthorized: true,
			  }
			: useAuthorized();
	const { theme } = useTheme();
	const [isLoading, setIsLoading] = useState(true);
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
		} else if (tag.toLowerCase() === "saved") {
			setPosts(_filterListOfStoredPostsOnPublished(props.posts, "saved"));
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
		!["all", "published", "unpublished", "saved"]
			.concat(props.tags)
			.find((item) => tag.toLowerCase().replace(" ", "") === item.toLowerCase().replace(" ", ""))
	) {
		return <ErrorPage statusCode={404} title="This tag could not be found" />;
	}
	return (
		<SEO
			pageMeta={{
				title: tag
					? tag.toLowerCase() === "published" || tag.toLowerCase() === "unpublished" || tag.toLowerCase() === "saved"
						? tag.charAt(0).toUpperCase() + tag.slice(1) + " posts"
						: "#" + _getCaseInsensitiveElement(props.tags, tag).replace(" ", "")
					: "All posts",
				description: "Navigate the full collection of posts, filtering based on their associated tag(s).",
			}}
		>
			<WebPageJsonLd
				description="Navigate the full collection of posts, filtering based on their associated tag(s)."
				id={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/tags`}
				lastReviewed={new Date(Math.max(...posts.map((post) => post.updatedAt || post.createdAt), 0)).toISOString()}
				reviewedBy={{
					type: "Person",
					name: "Martin Johannes Nilsen",
				}}
			/>
			{!isLoading && (
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
						<Box display="flex" alignItems="center">
							<Typography
								variant={xs ? "h4" : "h3"}
								fontFamily={theme.typography.fontFamily}
								color={theme.palette.text.primary}
								fontWeight={600}
							>
								{tag
									? tag.toLowerCase() === "published" ||
									  tag.toLowerCase() === "unpublished" ||
									  tag.toLowerCase() === "saved"
										? tag.charAt(0).toUpperCase() + tag.slice(1) + " posts"
										: "#" + _getCaseInsensitiveElement(props.tags, tag).replace(" ", "")
									: "All posts"}
								{/* {" (" + posts.length + ")"} */}
							</Typography>
							{/* <Typography
								ml={1}
								variant={xs ? "h6" : "h5"}
								fontFamily={theme.typography.fontFamily}
								color={theme.palette.text.primary}
								fontWeight={600}
							>
								{"⋅ " + posts.length}
							</Typography> */}
						</Box>
						{/* Grid of tags and posts */}
						<Grid container pt={xs ? 2 : lgUp ? 4 : 2} pb={8} rowSpacing={xs ? 2 : 4}>
							{/* Tags */}
							<Grid item xs={12} lg={3} order={{ lg: 3, xl: 3 }} sx={lgUp && { position: "fixed", right: 30, mt: -10 }}>
								<Box>
									<Button
										LinkComponent={NextLink}
										size="small"
										disabled={!tag}
										sx={{
											width: "fit-content",
											border: "1px solid " + theme.palette.secondary.main,
											backgroundColor: !tag && theme.palette.secondary.main,
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
									{(isAuthorized ? ["Published", "Unpublished", "Saved"] : ["Saved"])
										.concat(props.tags.sort())
										.map((element, index) => (
											<Button
												LinkComponent={NextLink}
												key={index}
												size="small"
												disabled={tag && tag.toLowerCase().replace(" ", "") === element.toLowerCase().replace(" ", "")}
												sx={{
													width: "fit-content",
													border: "1px solid " + theme.palette.secondary.main,
													backgroundColor:
														tag &&
														tag.toLowerCase().replace(" ", "") === element.toLowerCase().replace(" ", "") &&
														theme.palette.secondary.main,
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
													{element === "Published" || element === "Unpublished" || element === "Saved"
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
													ogImage={data.ogImage}
													published={data.published}
													readTime={data.readTime}
													tags={data.tags}
													keywords={data.keywords}
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
											{tag &&
												(tag.toLowerCase() === "published"
													? // "Currently, the author is in deep contemplation (or maybe just daydreaming). Posts will appear as soon as thoughts transform into words!"
													  //   "The author's pen is still busy at work. No published posts yet, but great stories are on the way!"
													  "It appears the author (that's me!) is still warming up their keyboard. Stay tuned for posts coming soon!"
													: tag.toLowerCase() === "unpublished"
													? "No unpublished posts at the moment, what should we write about next?"
													: tag.toLowerCase() === "saved"
													? // ? "Are your saved posts section playing hide and seek?"
													  "Your list of saved posts is waiting to be filled!"
													: "No posts yet with this tag, but check back soon!")}
										</Typography>
									</Box>
								)}
								{/* Push items down */}
								{/* <Grid item xs={12} /> */}
							</Grid>
						</Grid>
					</Box>
				</Box>
			)}
		</SEO>
	);
};
export default TagsPage;
