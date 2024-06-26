// @ts-nocheck
import {
	ArrowBackIosNewSharp,
	ArrowBackIosSharp,
	ArrowForwardIosSharp,
	FormatListBulletedSharp,
	GridViewSharp,
	TableRowsSharp,
	ViewCarousel,
	ViewWeekSharp,
} from "@mui/icons-material";
import {
	Box,
	ButtonGroup,
	Unstable_Grid2 as Grid,
	IconButton,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { FC, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import LandingPageCarouselCard from "../components/Cards/LandingPageCarouselCard";
import LandingPageGridCard from "../components/Cards/LandingPageGridCard";
import LandingPageListCard from "../components/Cards/LandingPageListCard";
import LandingPagePlainCard from "../components/Cards/LandingPagePlainCard";
import Navbar from "../components/Navbar/Navbar";
import SEO from "../components/SEO/SEO";
import TinderSwipe from "../components/TinderSwipe/TinderSwipe";
import { _filterListOfStoredPostsOnPublished, getPostsOverview } from "../database/overview";
import { useTheme } from "../styles/themes/ThemeProvider";
import { LandingPageProps, StoredPost } from "../types";
import useStickyState from "../utils/useStickyState";

export function splitChunks(arr: StoredPost[], chunkSize: number) {
	if (chunkSize <= 0) throw "chunkSize must be greater than 0";
	let result = [];
	for (var i = 0; i < arr.length; i += chunkSize) {
		result[i / chunkSize] = arr.slice(i, i + chunkSize);
	}
	return result;
}

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

	return {
		props: {
			posts,
		},
	};
};

const LandingPage: FC<LandingPageProps> = (props) => {
	// const { isAuthorized } = useAuthorized();
	const { theme } = useTheme();
	const boxRef = useRef(null);
	const [isLoading, setIsLoading] = useState(true);
	const mdDown = useMediaQuery(theme.breakpoints.down("md"));
	const [cardLayout, setCardLayout] = useStickyState<String>("cardLayout", mdDown ? "grid" : "plain");
	const [page, setPage] = useState(1);
	const [chunkedPosts, setChunkedPosts] = useState<StoredPost[][]>(
		splitChunks(
			_filterListOfStoredPostsOnPublished(props.posts, "published"),
			Number(process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE_GRID_LAYOUT)
		)
	);
	const [posts, setPosts] = useState<StoredPost[]>(
		mdDown || cardLayout !== "grid" ? chunkedPosts.flat() : chunkedPosts[0]
	);
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const sm = useMediaQuery(theme.breakpoints.only("sm"));
	const md = useMediaQuery(theme.breakpoints.only("md"));
	const lg = useMediaQuery(theme.breakpoints.only("lg"));
	const xl = useMediaQuery(theme.breakpoints.only("xl"));
	const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

	useEffect(() => {
		setChunkedPosts(
			splitChunks(
				_filterListOfStoredPostsOnPublished(props.posts, "published"),
				Number(process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE_GRID_LAYOUT)
			)
		);
		return () => {};
	}, []);

	useEffect(() => {
		if (cardLayout === "carousel" || cardLayout === "swipe") {
			disableBodyScroll(boxRef);
		} else {
			enableBodyScroll(boxRef);
		}
		return () => {
			disableBodyScroll();
		};
	}, [, cardLayout]);

	useEffect(() => {
		setIsLoading(true);
		setCurrentSlide(0);
		setPosts(!lgUp || cardLayout !== "grid" ? chunkedPosts.flat() : chunkedPosts[page - 1]);
		// instanceRef && instanceRef.current?.update;
		return () => {};
	}, [chunkedPosts, cardLayout, lgUp]);

	useEffect(() => {
		setIsLoading(false);
		instanceRef && instanceRef.current?.update;
		return () => {};
	}, [posts]);

	const handleNextPage = () => {
		const endPage = Math.ceil(
			chunkedPosts.flat().length / Number(process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE_GRID_LAYOUT)
		);
		if (page < endPage) {
			const newPage = Math.min(page + 1, endPage);
			setPage(newPage);
			setPosts(chunkedPosts[newPage - 1]);
		}
	};

	const handlePreviousPage = () => {
		const startPage = 1;
		if (page > startPage) {
			const newPage = Math.max(page - 1, startPage);
			setPage(newPage);
			setPosts(chunkedPosts[newPage - 1]);
		}
	};

	const handleChangeView = (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
		if (["carousel", "swipe", "grid", "list", "plain"].includes(newView)) setCardLayout(newView);
	};

	const [currentSlide, setCurrentSlide] = useState(0);
	const [sliderRef, instanceRef] = useKeenSlider({
		mode: "free-snap",
		slides: {
			origin: xs ? "auto" : "center",
			// perView: xs ? 1.2 : sm ? 1.2 : md ? 2.5 : lg ? 3.5 : 5.5,
			perView: "auto",
			spacing: xs ? 20 : sm ? 20 : md ? 30 : lg ? 40 : 50,
		},
		initial: typeof window !== "undefined" && window.innerWidth >= 1200 ? 1 : 0,
		slideChanged(slider) {
			setCurrentSlide(slider.track.details.rel);
		},
		defaultAnimation: {
			duration: 3000,
		},
	});

	return (
		<SEO
			pageMeta={{
				themeColor: theme.palette.primary.main,
			}}
		>
			{!isLoading && (
				<Box
					sx={{
						width: "100vw",
						// maxHeight: cardLayout === "swipe" ? "100vh" : "default",
						overflow: cardLayout === "swipe" ? "hidden" : "auto",
						maxWidth: "100vw",
						background: theme.palette.primary.main,
						userSelect: "none",
					}}
				>
					<Navbar
						backgroundColor={theme.palette.primary.main}
						textColor={theme.palette.text.primary}
						posts={chunkedPosts.flat()}
						setCardLayout={setCardLayout}
					/>
					<Box
						display="flex"
						flexDirection="column"
						sx={{
							background: theme.palette.primary.main,
							marginTop: isMobile ? "54px" : "80px",
							width: "100%",
							// overflowY: "scroll",
						}}
					>
						{/* <Box height="100%"> */}
						{/* Toggle line */}
						<Box display="flex" flexDirection="row" px={lgUp ? "150px" : xs ? "10px" : "80px"}>
							<Box flexGrow={1} />
							<Box display="flex" justifyContent="center">
								{/* Navigation buttons if large screen grid layout */}
								{lgUp && cardLayout === "grid" && (
									<ToggleButtonGroup size="small" sx={{ paddingRight: 1 }}>
										<ToggleButton
											disableFocusRipple
											value
											sx={{
												width: 30,
												height: 34,
												borderRadius: "10px",
												color: theme.palette.text.primary,
												"&:disabled": {
													color: theme.palette.text.primary + "50",
												},
												"&:focus-visible": {
													backgroundColor:
														theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
												},
											}}
											disabled={page <= 1}
											onClick={() => handlePreviousPage()}
										>
											<Tooltip enterDelay={2000} title="Previous page">
												<ArrowBackIosSharp
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
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}
											disabled
										>
											<Typography variant="subtitle2" color="textPrimary" fontFamily={theme.typography.fontFamily}>
												{page}
											</Typography>
										</ToggleButton>
										<ToggleButton
											disableFocusRipple
											value
											sx={{
												width: 30,
												height: 34,
												borderRadius: "10px",
												color: theme.palette.text.primary,
												"&:disabled": {
													color: theme.palette.text.primary + "50",
												},
												"&:focus-visible": {
													backgroundColor:
														theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
												},
											}}
											disabled={
												!(
													page <
													Math.ceil(
														chunkedPosts.flat().length /
															Number(process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE_GRID_LAYOUT)
													)
												)
											}
											onClick={() => handleNextPage()}
										>
											<Tooltip enterDelay={2000} title="Next page">
												<ArrowForwardIosSharp
													sx={{
														height: 16,
														width: 16,
														color: "inherit",
													}}
												/>
											</Tooltip>
										</ToggleButton>
									</ToggleButtonGroup>
								)}
								{/* Toggle for switching layouts */}
								<ToggleButtonGroup value={cardLayout} exclusive onChange={handleChangeView} size="small">
									<ToggleButton
										disableFocusRipple
										sx={{
											width: 34,
											height: 34,
											borderRadius: "10px",
											"&:focus-visible": {
												backgroundColor:
													theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
											},
										}}
										value={"carousel"}
										selected={cardLayout === "carousel"}
										disabled={cardLayout === "carousel"}
									>
										<Tooltip enterDelay={2000} title="Carousel layout">
											<ViewWeekSharp
												sx={{
													height: 22,
													width: 22,
													color: theme.palette.text.primary,
												}}
											/>
										</Tooltip>
									</ToggleButton>
									<ToggleButton
										disableFocusRipple
										sx={{
											width: 34,
											height: 34,
											"&:focus-visible": {
												backgroundColor:
													theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
											},
										}}
										value={"swipe"}
										selected={cardLayout === "swipe"}
										disabled={cardLayout === "swipe"}
									>
										<Tooltip enterDelay={2000} title="Swipe layout">
											<ViewCarousel
												sx={{
													height: 26,
													width: 26,
													color: theme.palette.text.primary,
												}}
											/>
										</Tooltip>
									</ToggleButton>
									<ToggleButton
										disableFocusRipple
										sx={{
											width: 34,
											height: 34,
											"&:focus-visible": {
												backgroundColor:
													theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
											},
										}}
										value={"grid"}
										selected={cardLayout === "grid"}
										disabled={cardLayout === "grid"}
									>
										<Tooltip enterDelay={2000} title="Grid layout">
											<GridViewSharp
												sx={{
													pb: 0.1,
													height: 21,
													width: 21,
													color: theme.palette.text.primary,
												}}
											/>
										</Tooltip>
									</ToggleButton>
									<ToggleButton
										disableFocusRipple
										sx={{
											width: 34,
											height: 34,
											borderRadius: "10px",
											"&:focus-visible": {
												backgroundColor:
													theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
											},
										}}
										value={"list"}
										selected={cardLayout === "list"}
										disabled={cardLayout === "list"}
									>
										<Tooltip enterDelay={2000} title="List layout">
											<TableRowsSharp
												sx={{
													height: 22,
													width: 22,
													color: theme.palette.text.primary,
												}}
											/>
										</Tooltip>
									</ToggleButton>
									<ToggleButton
										disableFocusRipple
										sx={{
											width: 34,
											height: 34,
											borderRadius: "10px",
											"&:focus-visible": {
												backgroundColor:
													theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
											},
										}}
										value={"plain"}
										selected={cardLayout === "plain"}
										disabled={cardLayout === "plain"}
									>
										<Tooltip enterDelay={2000} title="Plain layout">
											<FormatListBulletedSharp
												sx={{
													height: 22,
													width: 22,
													color: theme.palette.text.primary,
												}}
											/>
										</Tooltip>
									</ToggleButton>
								</ToggleButtonGroup>
							</Box>
						</Box>

						{/* Content */}
						<Box height="100%">
							{/* Card layouts */}
							{cardLayout === "carousel" ? (
								<Box
									ref={boxRef}
									// height={"100vh"}
									height={xs && isMobile ? "calc(100vh - 88px)" : "calc(100vh - 114px)"}
									display="flex"
									flexDirection="column"
									justifyContent="center"
									alignItems="center"
									sx={{
										paddingTop: 2,
									}}
								>
									<Box flexGrow={1} />
									<Box ref={sliderRef} className="keen-slider">
										{posts.map((data, index) => {
											return (
												<Box
													className="keen-slider__slide"
													key={index}
													sx={{
														minWidth: xs ? "calc(100vw)" : "350px",
														paddingX: xs ? 4.5 : 0,
													}}
												>
													{data && (
														<LandingPageCarouselCard
															author={data.author}
															readTime={data.readTime}
															id={data.id}
															ogImage={data.ogImage}
															title={data.title}
															createdAt={data.createdAt}
															updatedAt={data.updatedAt}
															description={data.description}
															type={data.type}
															tags={data.tags}
															keywords={data.keywords}
															published={data.published}
														/>
													)}
												</Box>
											);
										})}
									</Box>
									<Box flexGrow={1} />
									<ButtonGroup sx={{ padding: 1, gap: 1 }}>
										<IconButton
											sx={{
												color: "text.primary",
											}}
											onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
											disabled={currentSlide === 0}
										>
											<ArrowBackIosNewSharp color="inherit" />
										</IconButton>
										<IconButton
											sx={{
												color: "text.primary",
											}}
											onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
											disabled={xs ? currentSlide === posts.length - 1 : currentSlide === posts.length - 1}
										>
											<ArrowForwardIosSharp color="inherit" />
										</IconButton>
									</ButtonGroup>
									<Box flexGrow={1} />
								</Box>
							) : cardLayout === "swipe" ? (
								<Box
									ref={boxRef}
									// height="100%"
									// height={xs && isMobile ? "calc(100vh - 234px)" : "calc(100vh - 210px)"}
									height={xs && isMobile ? "calc(100vh - 160px)" : "calc(100vh - 114px)"}
									display="flex"
									flexDirection="column"
									justifyContent="center"
									alignItems="center"
									sx={{
										my: xs ? (isMobile ? 4 : 6) : 0,
										// paddingX: "0px",
										paddingTop: xs ? 2.5 : 8.5,
										paddingBottom: xs ? 2.5 : 0,
									}}
								>
									<TinderSwipe posts={posts.slice().reverse()} />
								</Box>
							) : cardLayout === "grid" ? (
								<Grid
									container
									rowSpacing={2}
									columnSpacing={mdDown ? 0 : 2}
									sx={{
										width: "100%",
										paddingTop: xs ? 1 : 2.5,
										paddingX: lgUp ? "150px" : xs ? 2 : "80px",
										paddingBottom: lgUp ? 1 : 5,
										margin: 0,
									}}
								>
									{posts.map((data, index) => {
										return (
											<Grid
												item
												key={index}
												xs={12}
												md={6}
												lg={index % 5 === 0 || index % 5 === 1 ? 6 : 4} // Lg and up to have 2 at top and 3 at bottom
												// lg={6}
												// xl={index % 5 === 0 || index % 5 === 1 ? 6 : 4}
											>
												<LandingPageGridCard
													author={data.author}
													readTime={
														// Remove read for the bottom third row
														mdDown || index % 5 === 0 || index % 5 === 1
															? data.readTime
															: data.readTime.replace(" read", "")
													}
													// readTime={data.readTime}
													id={data.id}
													ogImage={data.ogImage}
													title={data.title}
													createdAt={data.createdAt}
													updatedAt={data.updatedAt}
													description={data.description}
													type={data.type}
													tags={data.tags}
													keywords={data.keywords}
													published={data.published}
													enlargeOnHover={false}
												/>
											</Grid>
										);
									})}
								</Grid>
							) : cardLayout === "list" ? (
								<Grid
									container
									rowSpacing={2}
									columnSpacing={mdDown ? 0 : xl ? 5 : 2}
									sx={{
										width: "100%",
										paddingTop: xs ? 1 : 2.5,
										paddingX: lgUp ? "150px" : xs ? 2 : "80px",
										paddingBottom: xs ? 5 : 7,
										margin: 0,
									}}
								>
									{posts.map((data, index) => {
										return (
											<>
												<Grid item key={index} md={2} lg={3} />
												<Grid item key={index} xs={12} sm={12} md={8} lg={6}>
													<LandingPageListCard
														author={data.author}
														readTime={data.readTime}
														id={data.id}
														ogImage={data.ogImage}
														title={data.title}
														createdAt={data.createdAt}
														updatedAt={data.updatedAt}
														description={data.description}
														type={data.type}
														tags={data.tags}
														keywords={data.keywords}
														published={data.published}
														enlargeOnHover={false}
													/>
												</Grid>
												<Grid item key={index} md={2} lg={3} />
											</>
										);
									})}
								</Grid>
							) : cardLayout === "plain" ? (
								<Grid
									container
									rowSpacing={2}
									columnSpacing={mdDown ? 0 : xl ? 5 : 2}
									sx={{
										width: "100%",
										paddingTop: xs ? 1 : 2.5,
										paddingX: lgUp ? "150px" : xs ? 2 : "80px",
										paddingBottom: xs ? 5 : 7,
										margin: 0,
									}}
								>
									{posts.map((data, index) => {
										return (
											<>
												{/* <Grid item key={index} md={1} lg={1} /> */}
												<Grid item key={index} md={1} lg={2} />
												<Grid item key={index} xs={12} sm={12} md={8} lg={6}>
													<LandingPagePlainCard
														author={data.author}
														readTime={data.readTime}
														id={data.id}
														ogImage={data.ogImage}
														title={data.title}
														createdAt={data.createdAt}
														updatedAt={data.updatedAt}
														description={data.description}
														type={data.type}
														tags={data.tags}
														keywords={data.keywords}
														published={data.published}
														enlargeOnHover={false}
													/>
												</Grid>
												{/* <Grid item key={index} md={3} lg={5} /> */}
												<Grid item key={index} md={3} lg={4} />
											</>
										);
									})}
								</Grid>
							) : null}
						</Box>
						{/* </Box> */}
					</Box>
				</Box>
			)}
		</SEO>
	);
};
export default LandingPage;
