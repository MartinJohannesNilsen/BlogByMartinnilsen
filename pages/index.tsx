// @ts-nocheck
import {
  ArrowBackIosNewSharp,
  ArrowForwardIosSharp,
  GridViewSharp,
  TableRowsSharp,
  ViewWeekSharp,
} from "@mui/icons-material";
import {
  Box,
  ButtonGroup,
  Unstable_Grid2 as Grid,
  IconButton,
  Typography,
  Tooltip,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTheme } from "../ThemeProvider";
import useAuthorized from "../components/AuthorizationHook/useAuthorized";
import Navbar from "../components/Navbar/Navbar";
import SEO from "../components/SEO/SEO";
import {
  _filterListOfStoredPostsOnPublished,
  getPostsOverview,
} from "../database/overview";
import { LandingPageProps, StoredPost } from "../types";
import useStickyState from "../utils/useStickyState";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import LandingPageCarouselCard from "../components/Cards/LandingPageCarouselCard";
import LandingPageGridCard from "../components/Cards/LandingPageGridCard";
import LandingPageListCard from "../components/Cards/LandingPageListCard";

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
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [cardLayout, setCardLayout] = useStickyState<String>(
    "cardLayout",
    mdDown ? "grid" : "carousel"
  );
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
    setIsLoading(true);
    setCurrentSlide(0);
    setPosts(
      !lgUp || cardLayout !== "grid"
        ? chunkedPosts.flat()
        : chunkedPosts[page - 1]
    );
    // instanceRef && instanceRef.current?.update;
    return () => {};
  }, [chunkedPosts, cardLayout, lgUp]);

  useEffect(() => {
    setIsLoading(false);
    // instanceRef && instanceRef.current?.update;
    return () => {};
  }, [posts]);

  const handleNextPage = () => {
    const endPage = Math.ceil(
      chunkedPosts.flat().length /
        Number(process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE_GRID_LAYOUT)
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
    if (["carousel", "grid", "list"].includes(newView)) setCardLayout(newView);
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
      {isLoading ? (
        <></>
      ) : (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            background: theme.palette.primary.main,
            userSelect: "none",
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
              minHeight: "100vh",
              height: "100%",
              background: theme.palette.primary.main,
              paddingTop: isMobile ? "50px" : "80px",
              width: "100%",
            }}
          >
            <Box height="100%">
              {/* Toggle line */}
              <Box
                display="flex"
                flexDirection="row"
                px={lgUp ? "150px" : xs ? "10px" : "80px"}
                height="100%"
              >
                <Box flexGrow={1} />
                <Box>
                  {lgUp && cardLayout === "grid" ? (
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
                                    .NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE_GRID_LAYOUT
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
                    value={cardLayout}
                    exclusive
                    onChange={handleChangeView}
                    size="small"
                  >
                    <ToggleButton
                      value={"carousel"}
                      selected={cardLayout === "carousel"}
                      disabled={cardLayout === "carousel"}
                    >
                      {/* <ViewCarouselSharp
                        sx={{ color: theme.palette.text.primary }}
                      /> */}
                      <Tooltip enterDelay={2000} title="Carousel layout">
                        <ViewWeekSharp
                          sx={{ color: theme.palette.text.primary }}
                        />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton
                      value={"grid"}
                      selected={cardLayout === "grid"}
                      disabled={cardLayout === "grid"}
                    >
                      <Tooltip enterDelay={2000} title="Grid layout">
                        <GridViewSharp
                          sx={{ color: theme.palette.text.primary }}
                        />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton
                      value={"list"}
                      selected={cardLayout === "list"}
                      disabled={cardLayout === "list"}
                    >
                      <Tooltip enterDelay={2000} title="List layout">
                        <TableRowsSharp
                          sx={{ color: theme.palette.text.primary }}
                        />
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>

              {/* Content */}
              <Box>
                {/* Card layouts */}
                {cardLayout === "carousel" ? (
                  <Box height="100%">
                    <Box flexGrow={1} />
                    <Box
                      height="100%"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        my: xs ? (isMobile ? 4 : 6) : 0,
                        paddingX: "0px",
                        paddingY: xs ? "20px" : 8,
                      }}
                    >
                      <Box ref={sliderRef} className="keen-slider">
                        {posts.map((data, index) => {
                          return (
                            <Box
                              className="keen-slider__slide"
                              key={index}
                              sx={{
                                minWidth: xs ? "calc(100vw)" : "350px",
                                paddingX: xs ? "25px" : 0,
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
                      <Box mt={xs ? 4 : 7}>
                        <ButtonGroup sx={{ padding: 1, gap: 1 }}>
                          <IconButton
                            sx={{
                              color: "text.primary",
                            }}
                            onClick={(e) =>
                              e.stopPropagation() || instanceRef.current?.prev()
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
                              e.stopPropagation() || instanceRef.current?.next()
                            }
                            disabled={
                              xs
                                ? currentSlide === posts.length - 1
                                : currentSlide ===
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
                ) : cardLayout === "grid" ? (
                  <Grid
                    container
                    rowSpacing={xs ? 2 : 3}
                    columnSpacing={mdDown ? 0 : xl ? 5 : 3}
                    sx={{
                      width: "100%",
                      paddingTop: xs ? 1 : 2.5,
                      paddingX: lgUp ? "150px" : xs ? 2 : "80px",
                      paddingBottom: lgUp ? "0px" : 5,
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
                          // lg={index % 4 === 0 ? 12 : 4}
                          lg={index % 5 === 0 || index % 5 === 1 ? 6 : 4}
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
                ) : cardLayout === "list" ? (
                  <Grid
                    container
                    rowSpacing={xs ? 2.5 : 3}
                    columnSpacing={mdDown ? 0 : xl ? 5 : 3}
                    sx={{
                      width: "100%",
                      paddingTop: mdDown ? 1 : 2.5,
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
                          <Grid item key={index} md={2} lg={3} />
                        </>
                      );
                    })}
                  </Grid>
                ) : null}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </SEO>
  );
};
export default LandingPage;
