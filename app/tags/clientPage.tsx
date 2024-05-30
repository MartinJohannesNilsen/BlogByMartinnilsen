"use client";
import TagsPageCard from "@/components/DesignLibrary/Cards/TagsPageCard";
import Navbar from "@/components/Navigation/Navbar";
import { _filterListOfStoredPostsOnPublished } from "@/data/middleware/overview/overview";
import { getAllViewCounts } from "@/data/middleware/views/actions";
import colors from "@/styles/colors";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { StoredPost, TagsPageProps } from "@/types";
import colorLumincance from "@/utils/colorLuminance";
import { getBackgroundColorLightOrDark } from "@/utils/getBackgroundColorLightOrDark";
import useStickyState from "@/utils/useStickyState";
import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import ErrorPage from "next/error";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

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

const TagsPage = ({ posts, tags, isAuthorized, sessionUser }: TagsPageProps) => {
	const { theme } = useTheme();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const router = useRouter();
	const [tag, setTag] = useState<string | null>("loading");
	// const { query, isReady } = useRouter();
	const searchParams = useSearchParams();
	const [statePosts, setStatePosts] = useState<StoredPost[]>(posts);
	const [_, setCardLayout] = useStickyState("cardLayout", "plain");
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
	const [views, setViews] = useState();

	useEffect(() => {
		// Get views
		getAllViewCounts().then((data) => setViews(data));
	}, []);

	const updateData = () => {
		if (!tag) {
			setStatePosts(posts);
		} else if (tag.toLowerCase() === "published") {
			setStatePosts(_filterListOfStoredPostsOnPublished(posts, "published"));
		} else if (tag.toLowerCase() === "unpublished") {
			setStatePosts(_filterListOfStoredPostsOnPublished(posts, "unpublished"));
		} else if (tag.toLowerCase() === "saved") {
			setStatePosts(_filterListOfStoredPostsOnPublished(posts, "saved"));
		} else {
			setStatePosts(_filterListOfStoredPostsOnTag(posts, _getCaseInsensitiveElement(tags, tag)!));
		}
	};

	useEffect(() => {
		if (searchParams) {
			setTag(searchParams.get("name"));
		}
	}, [searchParams]);

	useEffect(() => {
		// if (searchParams) {
		updateData();
		// }
	}, [tag]);

	useEffect(() => {
		setIsLoading(false);
		return () => {};
	}, [statePosts]);

	// Check if single tag is provided or if tag not in allowed list
	if (tag === "loading") return <></>;
	if (tag && (tag.toLowerCase() === "unpublished" || tag.toLowerCase() === "published") && !isAuthorized) {
		return <ErrorPage statusCode={403} title="Unauthorized access" />;
	}
	if (
		// (tag && router.query.tag.length > 1) ||
		tag &&
		!["all", "published", "unpublished", "saved"]
			.concat(tags)
			.find((item) => tag.toLowerCase().replace(" ", "") === item.toLowerCase().replace(" ", ""))
	) {
		return <ErrorPage statusCode={404} title="This tag could not be found" />;
	}
	return !isLoading ? (
		<Box
			sx={{
				height: "100%",
				width: "100%",
				background: theme.palette.primary.main,
			}}
		>
			<Navbar
				posts={isAuthorized ? posts : _filterListOfStoredPostsOnPublished(posts, "published")}
				setCardLayout={setCardLayout}
				isAuthorized={isAuthorized}
				sessionUser={sessionUser}
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
								: "#" + _getCaseInsensitiveElement(tags, tag)!.replace(" ", "")
							: "All posts"}
					</Typography>
				</Box>
				{/* Grid of tags and posts */}
				<Grid container pt={xs ? 2 : lgUp ? 4 : 2} pb={8} rowSpacing={xs ? 2 : 4}>
					{/* Tags */}
					<Grid item xs={12} lg={3} order={{ lg: 3, xl: 3 }} sx={lgUp ? { position: "fixed", right: 30, mt: -10 } : {}}>
						<Box>
							<Button
								LinkComponent={NextLink}
								size="small"
								disabled={!tag}
								disableFocusRipple
								sx={{
									width: "fit-content",
									border: "1px solid " + theme.palette.secondary.main,
									backgroundColor: !tag ? theme.palette.secondary.main : "default",
									"&:hover": {
										border: "1px solid " + colorLumincance(theme.palette.secondary.main, 0.1),
										backgroundColor: !tag
											? theme.palette.secondary.main
											: theme.palette.mode == "dark"
											? theme.palette.grey[900]
											: theme.palette.grey[100],
									},
									"&:focus": {
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
									color={
										getBackgroundColorLightOrDark(!tag ? theme.palette.secondary.main : theme.palette.primary.main) ===
										"dark"
											? colors.white
											: colors.black
									}
									variant="body2"
									fontSize={xs ? "11px" : "13px"}
									textTransform="none"
									fontWeight={600}
								>
									All posts
								</Typography>
							</Button>
							{(isAuthorized ? ["Published", "Unpublished", "Saved"] : ["Saved"])
								.concat(tags.sort())
								.map((element, index) => (
									<Button
										LinkComponent={NextLink}
										key={index}
										size="small"
										disabled={
											tag ? tag.toLowerCase().replace(" ", "") === element.toLowerCase().replace(" ", "") : false
										}
										disableFocusRipple
										sx={{
											width: "fit-content",
											border: "1px solid " + theme.palette.secondary.main,
											backgroundColor:
												tag && tag.toLowerCase().replace(" ", "") === element.toLowerCase().replace(" ", "")
													? theme.palette.secondary.main
													: "default",
											"&:hover": {
												border: "1px solid " + colorLumincance(theme.palette.secondary.main, 0.1),
												backgroundColor:
													tag && tag.toLowerCase().replace(" ", "") === element.toLowerCase().replace(" ", "")
														? theme.palette.secondary.main
														: theme.palette.mode == "dark"
														? theme.palette.grey[900]
														: theme.palette.grey[100],
											},
											"&:focus": {
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
											color={
												getBackgroundColorLightOrDark(
													tag && tag.toLowerCase().replace(" ", "") === element.toLowerCase().replace(" ", "")
														? theme.palette.secondary.main
														: theme.palette.primary.main
												) === "dark"
													? colors.white
													: colors.black
											}
											variant="body2"
											fontSize={xs ? "11px" : "13px"}
											textTransform="none"
											fontWeight={600}
										>
											{element === "Published" || element === "Unpublished" || element === "Saved"
												? element
												: "#" + _getCaseInsensitiveElement(tags, element)!.replace(" ", "")}
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
						{statePosts && statePosts.length > 0 ? (
							statePosts.map((data, index) => {
								return (
									<Grid item key={index} xs={12}>
										<TagsPageCard
											views={views}
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
	) : (
		<></>
	);
};

export default TagsPage;
