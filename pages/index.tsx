// @ts-nocheck
import {
  ArrowBackIosNewSharp,
  ArrowForwardIosSharp,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Unstable_Grid2 as Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import WavingHand from "public/assets/imgs/waving-hand.png";
import { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTheme } from "../ThemeProvider";
import useAuthorized from "../components/AuthorizationHook/useAuthorized";
import LandingPageCard from "../components/Cards/LandingPageCard";
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
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const md = useMediaQuery(theme.breakpoints.only("md"));
  const xl = useMediaQuery(theme.breakpoints.only("xl"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const backgroundBWBreakingPercentage = lgUp ? "45%" : mdDown ? "35%" : "35%";

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
          {/* <RevealFromDownOnEnter from_opacity={0} y={"+=10px"}> */}
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              minHeight: isMobile ? "100vh" : "calc(100vh - 64px)",
              height: isMobile ? "100%" : "calc(100% - 64px)",
              //background: `linear-gradient(to bottom, ${theme.palette.primary.contrastText} 0%, ${theme.palette.primary.contrastText} ${backgroundBWBreakingPercentage}, ${theme.palette.primary.main} ${backgroundBWBreakingPercentage}, ${theme.palette.primary.main} 100%)`,
              background: theme.palette.primary.main,
              paddingTop: isMobile ? "50px" : "0",
              width: "100%",
            }}
          >
            <Box flexGrow={1} />
            {/* Tech Blog */}
            <Box
              sx={{
                // marginTop: xs ? "30px" : isMobile ? "2%" : "8%",
                // marginBottom: xs ? "15px" : isMobile ? "2%" : "5%",
                marginTop: xs ? "30px" : "50px",
                marginBottom: xs ? "15px" : "20px",
              }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="30vh"
            >
              <Typography
                variant={mdDown ? "h3" : "h1"}
                fontFamily={theme.typography.fontFamily}
                color={theme.palette.text.primary}
                fontWeight={600}
                style={{
                  borderBottomWidth: "600px",
                  borderBottom: "solid 4px " + theme.palette.secondary.main,
                }}
                py={2}
                px={5}
                textAlign="center"
              >
                MJNTech
              </Typography>
              <Typography
                variant={mdDown ? "h5" : "h3"}
                fontFamily={theme.typography.fontFamily}
                color={theme.palette.text.primary}
                fontWeight={600}
                textAlign="center"
                mx={isMobile || mdDown ? "15px" : "20%"}
                mt={2}
                mb={5}
              >
                A blog about technology, programming and everything between.
              </Typography>
            </Box>

            <Box flexGrow={1} />
            {/* <Typography
              variant={mdDown ? "h5" : "h3"}
              fontFamily={theme.typography.fontFamily}
              color={theme.palette.text.primary}
              fontWeight={600}
              mt={2}
              mb={0.5}
              px={lgUp ? "150px" : xs ? "50px" : "80px"}
              sx={{ opacity: 0.6 }}
            >
              Latest
            </Typography> */}
            <Grid
              container
              rowSpacing={mdDown ? 5 : md ? 3 : 6}
              columnSpacing={mdDown ? 0 : xl ? 5 : 3}
              sx={{
                width: "100%",
                paddingX: lgUp ? "150px" : xs ? "50px" : "80px",
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
            {/* Pagination */}
            <Box flexGrow={1} />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              py={xs ? 5 : 10}
            >
              <IconButton
                sx={{
                  color: "text.primary",
                }}
                disabled={page <= 1}
                onClick={() => handlePreviousPage()}
              >
                <ArrowBackIosNewSharp color="inherit" />
              </IconButton>
              <Typography marginX={3} variant="subtitle2" color="textPrimary">
                {page}
              </Typography>
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
                          process.env.NEXT_PUBLIC_LANDING_PAGE_POSTS_PER_PAGE
                        )
                    )
                  )
                }
                onClick={() => handleNextPage()}
              >
                <ArrowForwardIosSharp color="inherit" />
              </IconButton>
            </Box>
            {/* </RevealFromDownOnEnter> */}
          </Box>
        </Box>
      )}
    </SEO>
  );
};
export default LandingPage;
