import {
  ArrowBackIosNewSharp,
  ArrowForwardIosSharp,
} from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import WavingHand from "public/assets/img/waving-hand.png";
import { FC, useEffect, useState } from "react";
import { useTheme } from "../ThemeProvider";
import LandingViewCard from "../components/Cards/LandingViewCard";
import Navbar from "../components/Navbar/Navbar";
import {
  _filterListOfSimplifiedPostsOnPublished,
  getPostsOverview,
} from "../database/overview";
import { LandingViewProps, SimplifiedPost } from "../types";
import useAuthorized from "../components/AuthorizationHook/useAuthorized";
import { NextSeo } from "next-seo";

function splitChunks(arr: SimplifiedPost[], chunkSize: number) {
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

const LandingView: FC<LandingViewProps> = (props) => {
  const { isAuthorized } = useAuthorized();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [chunckedPosts, setChunkedPosts] = useState<SimplifiedPost[][]>(
    splitChunks(
      isAuthorized
        ? props.posts
        : _filterListOfSimplifiedPostsOnPublished(props.posts, "published"),
      Number(process.env.NEXT_PUBLIC_LANDING_VIEW_POSTS_PER_PAGE)
    )
  );
  const [posts, setPosts] = useState<SimplifiedPost[]>(chunckedPosts[0]);
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const md = useMediaQuery(theme.breakpoints.only("md"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const backgroundBWBreakingPercentage = lgUp
    ? "40%"
    : mdDown
    ? "27.5%"
    : "35%";

  useEffect(() => {
    setChunkedPosts(
      splitChunks(
        isAuthorized
          ? props.posts
          : _filterListOfSimplifiedPostsOnPublished(props.posts, "published"),
        Number(process.env.NEXT_PUBLIC_LANDING_VIEW_POSTS_PER_PAGE)
      )
    );
    return () => {};
  }, [isAuthorized]);

  useEffect(() => {
    setPosts(chunckedPosts[page - 1]);
    setIsLoading(false);
    return () => {};
  }, [chunckedPosts]);

  const handleNextPage = () => {
    const endPage = Math.ceil(
      props.posts.flat().length /
        Number(process.env.NEXT_PUBLIC_LANDING_VIEW_POSTS_PER_PAGE)
    );
    if (page < endPage) {
      const newPage = Math.min(page + 1, endPage);
      setPage(newPage);
      setPosts(chunckedPosts[newPage - 1]);
    }
  };

  const handlePreviousPage = () => {
    const startPage = 1;
    if (page > startPage) {
      const newPage = Math.max(page - 1, startPage);
      setPage(newPage);
      setPosts(chunckedPosts[newPage - 1]);
    }
  };

  return (
    <Box>
      {/* <Box flexGrow={100} /> */}
      <NextSeo
        title="Tech blog | Martin Johannes Nilsen"
        themeColor={theme.palette.primary.contrastText}
      />
      {isLoading ? (
        <></>
      ) : (
        <>
          <Navbar
            backgroundColor={theme.palette.primary.contrastText}
            posts={chunckedPosts.flat()}
          />
          <Box
            sx={{
              minHeight: "calc(100vh - 64px)",
              width: "100%",
              background: `linear-gradient(to bottom, ${theme.palette.primary.contrastText} 0%, ${theme.palette.primary.contrastText} ${backgroundBWBreakingPercentage}, ${theme.palette.primary.main} ${backgroundBWBreakingPercentage}, ${theme.palette.primary.main} 100%)`,
              // backgroundColor: theme.palette.primary.main,
            }}
          >
            {/* <RevealFromDownOnEnter from_opacity={0} y={"+=10px"}> */}
            <Grid
              container
              rowSpacing={mdDown ? 5 : md ? 3 : 6}
              columnSpacing={mdDown ? 0 : 3}
              sx={{
                width: "100%",
                height: "100%",
                paddingX: lgUp ? "150px" : xs ? "50px" : "80px",
                paddingY: lgUp ? "100px" : xs ? "50px" : "80px",
                marginX: 0,
                paddingBottom: "100px",
              }}
            >
              <Grid
                item
                sx={{
                  marginBottom: mdDown ? "0px" : md ? "40px" : "20px",
                  marginTop: mdDown ? "50px" : "20px",
                }}
                xs={12}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  variant={mdDown ? "h3" : "h1"}
                  fontFamily={theme.typography.fontFamily}
                  color={theme.palette.text.secondary}
                  fontWeight={600}
                >
                  Welcome
                </Typography>
                <Image
                  src={WavingHand.src}
                  width={WavingHand.width}
                  height={WavingHand.width}
                  alt="Icon of a waving hand"
                  style={{
                    marginLeft: mdDown ? "15px" : "25px",
                    width: mdDown
                      ? theme.typography.h3.fontSize
                      : theme.typography.h1.fontSize,
                    height: mdDown
                      ? theme.typography.h3.fontSize
                      : theme.typography.h1.fontSize,
                    marginBottom: "5px",
                  }}
                />
              </Grid>
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
                    <LandingViewCard
                      id={data.id}
                      image={data.image}
                      title={data.title}
                      timestamp={data.timestamp}
                      summary={data.summary}
                      type={data.type}
                      tags={data.tags}
                      published={data.published}
                    />
                  </Grid>
                );
              })}
              <Grid
                item
                xs={12}
                mt={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box display="flex" alignItems="center">
                  <IconButton
                    sx={{
                      color: "text.primary",
                    }}
                    disabled={page <= 1}
                    onClick={() => handlePreviousPage()}
                  >
                    <ArrowBackIosNewSharp color="inherit" />
                  </IconButton>
                  <Typography
                    marginX={3}
                    variant="subtitle2"
                    color="textPrimary"
                  >
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
                          props.posts.flat().length /
                            Number(
                              process.env
                                .NEXT_PUBLIC_LANDING_VIEW_POSTS_PER_PAGE
                            )
                        )
                      )
                    }
                    onClick={() => handleNextPage()}
                  >
                    <ArrowForwardIosSharp color="inherit" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            {/* </RevealFromDownOnEnter> */}
          </Box>
        </>
      )}
    </Box>
  );
};
export default LandingView;
