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
import LandingPageCard from "../components/Cards/LandingPageGridCard";
import Navbar from "../components/Navbar/Navbar";
import SEO from "../components/SEO/SEO";
import {
  _filterListOfStoredPostsOnPublished,
  getPostsOverview,
} from "../database/overview";
import { LandingPageProps, StoredPost } from "../types";

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
  const [page, setPage] = useState(1);
  const [chunkedPosts, setChunkedPosts] = useState<StoredPost[][]>(
    splitChunks(
      isAuthorized
        ? props.posts
        : _filterListOfStoredPostsOnPublished(props.posts, "published"),
      Number(process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE)
    )
  );
  const [posts, setPosts] = useState<StoredPost[]>(chunkedPosts[0]);
  const [cardView, setCardView] = useState<Boolean>(true);
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const md = useMediaQuery(theme.breakpoints.only("md"));
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
    setPosts(chunkedPosts[page - 1]);
    setIsLoading(false);
    return () => {};
  }, [chunkedPosts]);

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
    setCardView(newView);
  };

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
              <Box>
                <Grid
                  container
                  rowSpacing={mdDown ? 5 : md ? 3 : 3}
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
                        <LandingPageCard
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
              </Box>
            ) : (
              <Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  px={lgUp ? "150px" : xs ? "50px" : "80px"}
                >
                  <Box flexGrow={1} />
                  <Box>
                    {cardView ? (
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
                    ) : (
                      <></>
                    )}
                    <ToggleButtonGroup
                      value={cardView}
                      exclusive
                      onChange={handleChangeView}
                      size="small"
                    >
                      <ToggleButton value={false}>
                        <ViewColumnRounded
                          sx={{ color: theme.palette.text.primary }}
                        />
                      </ToggleButton>
                      <ToggleButton value={true}>
                        <GridView sx={{ color: theme.palette.text.primary }} />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </Box>
                <Box>
                  {cardView ? (
                    <Grid
                      container
                      rowSpacing={mdDown ? 5 : md ? 3 : 3}
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
                            <LandingPageCard
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
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      mt="200px"
                    >
                      <Typography variant="h4"> Coming soon ... </Typography>
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
