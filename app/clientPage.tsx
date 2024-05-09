"use client";
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
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import LandingPageCarouselCard from "../components/DesignLibrary/Cards/LandingPageCarouselCard";
import LandingPageGridCard from "../components/DesignLibrary/Cards/LandingPageGridCard";
import LandingPageListCard from "../components/DesignLibrary/Cards/LandingPageListCard";
import LandingPagePlainCard from "../components/DesignLibrary/Cards/LandingPagePlainCard";
import Navbar from "../components/Navigation/Navbar";
import TinderSwipe from "../components/TinderSwipe/TinderSwipe";
import { getCachedPublishedDescendingPostsOverview } from "../data/cache";
import { _filterListOfStoredPostsOnPublished } from "../data/db/overview";
import { useTheme } from "../styles/themes/ThemeProvider";
import { ServerPageProps, StoredPost } from "../types";
import { splitChunks } from "../utils/postChunking";
import useStickyState from "../utils/useStickyState";
import { getAllViewCounts } from "../data/middleware/views/actions";

const LandingPage = ({ sessionUser, isAuthorized, postsOverview }: ServerPageProps) => {
	const { theme } = useTheme();
	const boxRef = useRef(null);
	const [isLoading, setIsLoading] = useState(true);
	const mdDown = useMediaQuery(theme.breakpoints.down("md"));
	const [cardLayout, setCardLayout] = useStickyState("cardLayout", "plain");
	const [page, setPage] = useState(1);
	const [chunkedPosts, setChunkedPosts] = useState<StoredPost[][]>();
	const [posts, setPosts] = useState<StoredPost[]>();
	const [views, setViews] = useState<any>();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const sm = useMediaQuery(theme.breakpoints.only("sm"));
	const md = useMediaQuery(theme.breakpoints.only("md"));
	const lg = useMediaQuery(theme.breakpoints.only("lg"));
	const xl = useMediaQuery(theme.breakpoints.only("xl"));
	const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

	// Fetch views
	useEffect(() => {
		getAllViewCounts().then((data) => setViews(data));
		return () => {};
	}, []);

	// Chunk posts
	useEffect(() => {
		if (postsOverview) {
			Promise.resolve(_filterListOfStoredPostsOnPublished(postsOverview, "published")).then((data) => {
				setChunkedPosts(splitChunks(data, Number(process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE_GRID_LAYOUT)));
			});
		}
		return () => {};
	}, [postsOverview]);

	// Set posts
	useEffect(() => {
		if (chunkedPosts) {
			setIsLoading(true);
			setCurrentSlide(0);
			setPosts(!lgUp || cardLayout !== "grid" ? chunkedPosts.flat() : chunkedPosts[page - 1]);
		}
		// instanceRef && instanceRef.current?.update;
		return () => {};
	}, [chunkedPosts, cardLayout, lgUp]);

	// Disable body scroll on cardLayout change
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

	// When posts are fetched, chunked and loaded, setIsLoading(false)
	useEffect(() => {
		if (posts) {
			setIsLoading(false);
			instanceRef && instanceRef.current?.update;
		}
		return () => {};
	}, [posts]);

	const handleNextPage = () => {
		if (chunkedPosts) {
			const endPage = Math.ceil(
				chunkedPosts.flat().length / Number(process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE_GRID_LAYOUT)
			);
			if (page < endPage) {
				const newPage = Math.min(page + 1, endPage);
				setPage(newPage);
				setPosts(chunkedPosts[newPage - 1]);
			}
		}
	};

	const handlePreviousPage = () => {
		if (chunkedPosts) {
			const startPage = 1;
			if (page > startPage) {
				const newPage = Math.max(page - 1, startPage);
				setPage(newPage);
				setPosts(chunkedPosts[newPage - 1]);
			}
		}
	};

	const handleChangeView = (event: React.MouseEvent<HTMLElement>, newView: string) => {
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

	if (isLoading) return <></>;
	return !isLoading && chunkedPosts && posts ? (
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
				posts={postsOverview}
				setCardLayout={setCardLayout}
				isAuthorized={isAuthorized}
				sessionUser={sessionUser}
				centeredPadding
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
											backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
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
											backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
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
										backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
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
										backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
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
										backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
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
										backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
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
										backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
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
													views={views}
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
										"&:disabled": {
											color: theme.palette.text.primary + "30",
										},
									}}
									onClick={(e) => {
										e.stopPropagation();
										instanceRef.current?.prev();
									}}
									disabled={currentSlide === 0}
								>
									<ArrowBackIosNewSharp color="inherit" />
								</IconButton>
								<IconButton
									sx={{
										color: "text.primary",
										"&:disabled": {
											color: theme.palette.text.primary + "30",
										},
									}}
									onClick={(e) => {
										e.stopPropagation();
										instanceRef.current?.next();
									}}
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
							<TinderSwipe posts={posts.slice().reverse()} views={views} />
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
										key={index}
										xs={12}
										md={6}
										lg={index % 5 === 0 || index % 5 === 1 ? 6 : 4} // Lg and up to have 2 at top and 3 at bottom
										// lg={6}
										// xl={index % 5 === 0 || index % 5 === 1 ? 6 : 4}
									>
										<LandingPageGridCard
											views={views}
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
											// enlargeOnHover={false} // TODO Remove
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
								paddingBottom: xs ? 5 : 8,
								margin: 0,
							}}
						>
							{posts.map((data, index) => {
								return (
									<>
										<Grid key={index} md={2} lg={3} />
										<Grid key={index} xs={12} sm={12} md={8} lg={6}>
											<LandingPageListCard
												views={views}
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
												// enlargeOnHover={false} // TODO Remove
											/>
										</Grid>
										<Grid key={index} md={2} lg={3} />
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
										<Grid key={index} md={1} lg={2} />
										<Grid key={index} xs={12} sm={12} md={8} lg={6}>
											<LandingPagePlainCard
												views={views}
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
												// enlargeOnHover={false} // TODO Remove
											/>
										</Grid>
										{/* <Grid item key={index} md={3} lg={5} /> */}
										<Grid key={index} md={3} lg={4} />
									</>
								);
							})}
						</Grid>
					) : (
						<Box
							sx={{
								height: "calc(100vh - 200px)",
								width: "100%",
								display: "flex",
								flexDirection: "column",
								alignContent: "center",
								alignItems: "center",
								justifyContent: "center",
								justifyItems: "center",
								textAlign: "center",
							}}
						>
							<Typography
								variant="body1"
								sx={{
									fontFamily: theme.typography.fontFamily,
									color: theme.palette.primary.contrastText,
									border:
										"1px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[500] : theme.palette.grey[300]),
									borderRadius: 2,
									backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
									p: "4px 8px",
									width: "default",
								}}
							>
								Something went wrong. Please choose a layout.
							</Typography>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	) : (
		<></>
	);
};
export default LandingPage;
