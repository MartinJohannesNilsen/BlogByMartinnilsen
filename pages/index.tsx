// @ts-nocheck
import {
  ArrowBackIosNewSharp,
  ArrowForwardIosSharp,
  GridView,
  ViewColumnRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Unstable_Grid2 as Grid,
  IconButton,
  Typography,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTheme } from "../ThemeProvider";
import useAuthorized from "../components/AuthorizationHook/useAuthorized";
import LandingPageGridCard from "../components/Cards/LandingPageGridCard";
import Navbar from "../components/Navbar/Navbar";
import SEO from "../components/SEO/SEO";
import {
  _filterListOfStoredPostsOnPublished,
  getPostsOverview,
} from "../database/overview";
import { LandingPageProps, StoredPost } from "../types";
// import { Slider } from "../components/Slider/CardSlider";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import LandingPageCarouselCard from "../components/Cards/LandingPageCarouselCard";
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
  const { isAuthorized } = useAuthorized();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [gridView, setGridView] = useStickyState<Boolean>("gridView", false);
  const [page, setPage] = useState(1);
  const [chunkedPosts, setChunkedPosts] = useState<StoredPost[][]>(
    splitChunks(
      isAuthorized
        ? props.posts
        : _filterListOfStoredPostsOnPublished(props.posts, "published"),
      Number(process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE)
    )
  );
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const [posts, setPosts] = useState<StoredPost[]>(
    xs ? chunkedPosts.flat() : !gridView ? chunkedPosts.flat() : chunkedPosts[0]
  );
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const md = useMediaQuery(theme.breakpoints.only("md"));
  const lg = useMediaQuery(theme.breakpoints.only("lg"));
  const xl = useMediaQuery(theme.breakpoints.only("xl"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    setChunkedPosts(
      splitChunks(
        isAuthorized
          ? props.posts
          : _filterListOfStoredPostsOnPublished(props.posts, "published"),
        Number(process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE)
      )
    );
    return () => {};
  }, [isAuthorized]);

  useEffect(() => {
    setIsLoading(true);
    setCurrentSlide(0);
    setPosts(
      xs
        ? chunkedPosts.flat()
        : !gridView
        ? chunkedPosts.flat()
        : chunkedPosts[page - 1]
    );
    // instanceRef && instanceRef.current?.update;
    return () => {};
  }, [chunkedPosts, gridView]);

  useEffect(() => {
    setIsLoading(false);
    // instanceRef && instanceRef.current?.update;
    return () => {};
  }, [posts]);

  const handleNextPage = () => {
    const endPage = Math.ceil(
      chunkedPosts.flat().length /
        Number(process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE)
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

  const handleChangeView = (
    event: React.MouseEvent<HTMLElement>,
    newView: string | null
  ) => {
    // If toggle between anyways
    // setGridView(newView);
    if (newView == true || newView == false) setGridView(newView);
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  // const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    mode: "free-snap",
    slides: {
      origin: "auto",
      // perView: xs ? 1.2 : sm ? 1.2 : md ? 2.5 : lg ? 3.5 : 5.5,
      perView: "auto",
      spacing: xs ? 20 : sm ? 20 : md ? 30 : lg ? 40 : 50,
    },
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    // created() {
    //   setLoaded(true);
    // },
    // range: { min: 0, max: posts.length, align: true },
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
            posts={chunkedPosts.flat()}
          />
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              minHeight: isMobile ? "100vh" : "calc(100vh - 64px)",
              height: isMobile ? "100%" : "calc(100% - 64px)",
              //background: `linear-gradient(to bottom, ${theme.palette.primary.contrastText} 0%, ${theme.palette.primary.contrastText} ${backgroundBWBreakingPercentage}, ${theme.palette.primary.main} ${backgroundBWBreakingPercentage}, ${theme.palette.primary.main} 100%)`,
              background: theme.palette.primary.main,
              paddingTop: isMobile ? "50px" : "10px",
              width: "100%",
            }}
          >
            {xs ? (
              <Box height="100%">
                {/* Toggle line */}
                <Box
                  display="flex"
                  flexDirection="row"
                  px={lgUp ? "150px" : xs ? "10px" : "80px"}
                  height="100%"
                >
                  <Box flexGrow={1} />
                  {/* Grid View */}
                  <ToggleButtonGroup
                    value={gridView}
                    exclusive
                    onChange={handleChangeView}
                    size="small"
                  >
                    <ToggleButton
                      value={false}
                      selected={!gridView}
                      disabled={!gridView}
                    >
                      <ViewColumnRounded
                        sx={{ color: theme.palette.text.primary }}
                      />
                    </ToggleButton>
                    <ToggleButton
                      value={true}
                      selected={gridView}
                      disabled={gridView}
                    >
                      <GridView sx={{ color: theme.palette.text.primary }} />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                {/* Content */}
                <Box>
                  {/* Grid View */}
                  {gridView ? (
                    <Grid
                      container
                      rowSpacing={mdDown ? 2 : md ? 3 : 3}
                      columnSpacing={mdDown ? 0 : xl ? 5 : 3}
                      sx={{
                        width: "100%",
                        paddingX: lgUp ? 18 : xs ? 2 : 10,
                        paddingTop: xs ? 1 : 0,
                        paddingBottom: lgUp ? 0 : xs ? 5 : 2.5,
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
                            lg={index % 4 === 0 ? 12 : 4}
                            xl={6}
                            // xl={index % 5 === 0 || index % 5 === 1 ? 12 : 4} // 2 on first row, 3 on second
                          >
                            <LandingPageGridCard
                              author={data.author}
                              readTime={data.readTime}
                              id={data.id}
                              icon={data.icon}
                              image={data.image}
                              title={data.title}
                              timestamp={data.timestamp}
                              description={data.description}
                              type={data.type}
                              tags={data.tags}
                              published={data.published}
                              enlargeOnHover={false}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <Box height="100%">
                      <Box flexGrow={1} />
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        my={isMobile ? 4 : 6}
                        sx={{
                          padding: lgUp ? "0 150px" : xs ? "20px 0" : "0 80px",
                        }}
                      >
                        <Box
                          ref={sliderRef}
                          className="keen-slider"
                          // sx={{ padding: 2 }}
                        >
                          {posts.map((data, index) => {
                            return (
                              <Box
                                className="keen-slider__slide"
                                key={index}
                                sx={{
                                  minWidth: xs ? "calc(100vw)" : "350px",
                                  paddingX: xs ? "25px" : 0,
                                  // boxShadow:
                                  //   "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                                }}
                              >
                                {data ? (
                                  <LandingPageCarouselCard
                                    author={data.author}
                                    readTime={data.readTime}
                                    id={data.id}
                                    icon={data.icon}
                                    image={data.image}
                                    title={data.title}
                                    timestamp={data.timestamp}
                                    description={data.description}
                                    type={data.type}
                                    tags={data.tags}
                                    published={data.published}
                                  />
                                ) : null}
                              </Box>
                            );
                          })}
                        </Box>
                        <Box mt={4}>
                          <ButtonGroup sx={{ padding: 1 }}>
                            <IconButton
                              sx={{
                                color: "text.primary",
                                paddingRight: 2,
                              }}
                              onClick={(e) =>
                                e.stopPropagation() ||
                                instanceRef.current?.prev()
                              }
                              disabled={currentSlide === 0}
                            >
                              <ArrowBackIosNewSharp color="inherit" />
                            </IconButton>
                            <IconButton
                              sx={{
                                color: "text.primary",
                              }}
                              onClick={(e) =>
                                e.stopPropagation() ||
                                instanceRef.current?.next()
                              }
                              disabled={currentSlide === posts.length - 1}
                            >
                              <ArrowForwardIosSharp color="inherit" />
                            </IconButton>
                          </ButtonGroup>
                        </Box>
                      </Box>
                      <Box flexGrow={1} />
                    </Box>
                  )}
                </Box>
              </Box>
            ) : (
              <Box height="calc(100%)">
                {/* Toggle line */}
                <Box flexGrow={1} />
                <Box
                  display="flex"
                  flexDirection="row"
                  px={lgUp ? "150px" : xs ? "50px" : "80px"}
                  height="100%"
                >
                  <Box flexGrow={1} />
                  <Box>
                    {gridView ? (
                      <ButtonGroup sx={{ paddingRight: 1 }}>
                        <IconButton
                          sx={{
                            color: "text.primary",
                          }}
                          disabled={page <= 1}
                          onClick={() => handlePreviousPage()}
                        >
                          <ArrowBackIosNewSharp color="inherit" />
                        </IconButton>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ width: "40px" }}
                        >
                          <Typography variant="subtitle2" color="textPrimary">
                            {page}
                          </Typography>
                        </Box>
                        <IconButton
                          sx={{
                            color: "text.primary",
                          }}
                          disabled={
                            !(
                              page <
                              Math.ceil(
                                chunkedPosts.flat().length /
                                  Number(
                                    process.env
                                      .NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE
                                  )
                              )
                            )
                          }
                          onClick={() => handleNextPage()}
                        >
                          <ArrowForwardIosSharp color="inherit" />
                        </IconButton>
                      </ButtonGroup>
                    ) : null}
                    <ToggleButtonGroup
                      value={gridView}
                      exclusive
                      onChange={handleChangeView}
                      size="small"
                    >
                      <ToggleButton
                        value={false}
                        selected={!gridView}
                        disabled={!gridView}
                      >
                        <ViewColumnRounded
                          sx={{ color: theme.palette.text.primary }}
                        />
                      </ToggleButton>
                      <ToggleButton
                        value={true}
                        selected={gridView}
                        disabled={gridView}
                      >
                        <GridView sx={{ color: theme.palette.text.primary }} />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </Box>
                <Box flexGrow={1} />
                {/* Content */}
                <Box>
                  {/* Grid View */}
                  {gridView ? (
                    <Grid
                      container
                      rowSpacing={mdDown ? 3 : md ? 3 : 3}
                      columnSpacing={mdDown ? 0 : xl ? 5 : 3}
                      sx={{
                        width: "100%",
                        paddingX: lgUp ? "150px" : xs ? "50px" : "80px",
                        paddingBottom: lgUp ? "0px" : xs ? "30px" : "20px",
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
                            lg={index % 4 === 0 ? 12 : 4}
                            xl={6}
                            // xl={index % 5 === 0 || index % 5 === 1 ? 12 : 4} // 2 on first row, 3 on second
                          >
                            <LandingPageGridCard
                              author={data.author}
                              readTime={data.readTime}
                              id={data.id}
                              icon={data.icon}
                              image={data.image}
                              title={data.title}
                              timestamp={data.timestamp}
                              description={data.description}
                              type={data.type}
                              tags={data.tags}
                              published={data.published}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <Box height="100%">
                      <Box flexGrow={1} />
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        py={8}
                        sx={{ paddingX: lgUp ? "150px" : xs ? "50px" : "80px" }}
                      >
                        <Box
                          ref={sliderRef}
                          className="keen-slider"
                          // sx={{ padding: 2 }}
                        >
                          {posts.map((data, index) => {
                            return (
                              <Box
                                className="keen-slider__slide"
                                key={index}
                                sx={{
                                  minWidth: "350px",
                                  // boxShadow:
                                  //   "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                                }}
                              >
                                {data ? (
                                  <LandingPageCarouselCard
                                    author={data.author}
                                    readTime={data.readTime}
                                    id={data.id}
                                    icon={data.icon}
                                    image={data.image}
                                    title={data.title}
                                    timestamp={data.timestamp}
                                    description={data.description}
                                    type={data.type}
                                    tags={data.tags}
                                    published={data.published}
                                  />
                                ) : null}
                              </Box>
                            );
                          })}
                        </Box>
                        <Box mt={6}>
                          <ButtonGroup sx={{ padding: 1 }}>
                            <IconButton
                              sx={{
                                color: "text.primary",
                              }}
                              onClick={(e) =>
                                e.stopPropagation() ||
                                instanceRef.current?.prev()
                              }
                              disabled={currentSlide === 0}
                            >
                              <ArrowBackIosNewSharp color="inherit" />
                            </IconButton>
                            <IconButton
                              sx={{
                                color: "text.primary",
                              }}
                              onClick={(e) =>
                                e.stopPropagation() ||
                                instanceRef.current?.next()
                              }
                              disabled={
                                currentSlide ===
                                posts.length - (sm ? 1 : md ? 1 : lg ? 2 : 2)
                              }
                            >
                              <ArrowForwardIosSharp color="inherit" />
                            </IconButton>
                          </ButtonGroup>
                        </Box>
                      </Box>
                      <Box flexGrow={1} />
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </SEO>
  );
};
export default LandingPage;
