import {
  ArrowBackIosNewSharp,
  ArrowForwardIosSharp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTheme } from "../ThemeProvider";
import useAuthorized from "../components/AuthorizationHook/useAuthorized";
import TagsPageCard from "../components/Cards/TagsPageCard";
import Navbar from "../components/Navbar/Navbar";
import SEO from "../components/SEO/SEO";
import {
  _filterListOfStoredPostsOnPublished,
  getPostsOverview,
} from "../database/overview";
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

export const _caseInsensitiveIncludes = (
  list: string[],
  word: string,
  removeSpace?: boolean
) => {
  const lowerCaseList = list.map((e) => e.toLowerCase());
  if (!removeSpace) return lowerCaseList.includes(word.toLowerCase());
  return lowerCaseList.map((e) => e.replace(" ", ""));
};

const _getCaseInsensitiveElement = (list: string[], element: string) => {
  const index = list.findIndex(
    (item) =>
      element.toLowerCase().replace(" ", "") ===
      item.toLowerCase().replace(" ", "")
  );
  if (index === -1) return null;
  return list[index];
};

export const _filterListOfStoredPostsOnTag = (
  data: StoredPost[],
  tag: string
) => {
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
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [tag, setTag] = useState<string>("loading");
  const { query, isReady } = useRouter();
  const [chunkedPosts, setChunkedPosts] = useState<StoredPost[][]>([[]]);
  const [posts, setPosts] = useState<StoredPost[]>(chunkedPosts[0]);
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const updateData = () => {
    if (!tag) {
      setChunkedPosts(
        splitChunks(
          isAuthorized
            ? props.posts
            : _filterListOfStoredPostsOnPublished(props.posts, "published"),
          Number(process.env.NEXT_PUBLIC_TAGS_PAGE_POSTS_PER_PAGE)
        )
      );
    } else if (tag.toLowerCase() === "published") {
      setChunkedPosts(
        splitChunks(
          _filterListOfStoredPostsOnPublished(props.posts, "published"),
          Number(process.env.NEXT_PUBLIC_TAGS_PAGE_POSTS_PER_PAGE)
        )
      );
    } else if (tag.toLowerCase() === "unpublished") {
      if (isAuthorized) {
        setChunkedPosts(
          splitChunks(
            _filterListOfStoredPostsOnPublished(props.posts, "unpublished"),
            Number(process.env.NEXT_PUBLIC_TAGS_PAGE_POSTS_PER_PAGE)
          )
        );
      }
    } else {
      setChunkedPosts(
        splitChunks(
          isAuthorized
            ? _filterListOfStoredPostsOnTag(
                props.posts,
                _getCaseInsensitiveElement(props.tags, tag)
              )
            : _filterListOfStoredPostsOnTag(
                _filterListOfStoredPostsOnPublished(props.posts, "published"),
                _getCaseInsensitiveElement(props.tags, tag)
              ),
          Number(process.env.NEXT_PUBLIC_TAGS_PAGE_POSTS_PER_PAGE)
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
    setPosts(chunkedPosts[page - 1]);
    setIsLoading(false);
    return () => {};
  }, [chunkedPosts]);

  const handleNextPage = () => {
    const endPage = Math.ceil(
      chunkedPosts.flat().length /
        Number(process.env.NEXT_PUBLIC_TAGS_PAGE_POSTS_PER_PAGE)
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
      .find(
        (item) =>
          tag.toLowerCase().replace(" ", "") ===
          item.toLowerCase().replace(" ", "")
      )
  ) {
    return <ErrorPage statusCode={404} title="This tag could not be found" />;
  }
  return (
    <SEO
      pageMeta={{
        title: tag
          ? tag.toLowerCase() === "published" ||
            tag.toLowerCase() === "unpublished"
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
            posts={
              isAuthorized
                ? props.posts
                : _filterListOfStoredPostsOnPublished(props.posts, "published")
            }
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
                  ? tag.toLowerCase() === "published" ||
                    tag.toLowerCase() === "unpublished"
                    ? tag.charAt(0).toUpperCase() + tag.slice(1)
                    : "#" +
                      _getCaseInsensitiveElement(props.tags, tag).replace(
                        " ",
                        ""
                      )
                  : "All posts"}
              </Typography>
            </Box>
            {/* Grid of tags and posts */}
            <Grid container py={xs ? 2 : 4} rowSpacing={xs ? 2 : 4}>
              {/* Tags */}
              <Grid item xs={12} lg={4} order={{ lg: 3, xl: 3 }}>
                <Box>
                  <Button
                    disabled={!tag}
                    sx={{
                      border: "2px solid " + theme.palette.secondary.main,
                      backgroundColor: !tag ? theme.palette.secondary.main : "",
                      "&:hover": {
                        border:
                          "2px solid " +
                          colorLumincance(theme.palette.secondary.main, 0.1),
                        backgroundColor: !tag
                          ? theme.palette.secondary.main
                          : "",
                      },
                      margin: 0.5,
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
                      fontSize={xs ? "11px" : ""}
                      textTransform="none"
                      fontWeight={600}
                    >
                      All posts
                    </Typography>
                  </Button>
                  {(isAuthorized ? ["Published", "Unpublished"] : [])
                    .concat(props.tags)
                    .map((element) => (
                      <Button
                        disabled={
                          tag &&
                          tag.toLowerCase().replace(" ", "") ===
                            element.toLowerCase().replace(" ", "")
                        }
                        sx={{
                          border: "2px solid " + theme.palette.secondary.main,
                          backgroundColor:
                            tag &&
                            tag.toLowerCase().replace(" ", "") ===
                              element.toLowerCase().replace(" ", "")
                              ? theme.palette.secondary.main
                              : "",
                          "&:hover": {
                            border:
                              "2px solid " +
                              colorLumincance(
                                theme.palette.secondary.main,
                                0.1
                              ),
                            backgroundColor:
                              tag &&
                              tag.toLowerCase().replace(" ", "") ===
                                element.toLowerCase().replace(" ", "")
                                ? theme.palette.secondary.main
                                : "",
                          },
                          margin: 0.5,
                        }}
                        onClick={() => {
                          router.replace(
                            "/tags?name=" + element.replace(" ", "")
                          );
                          setTag(element);
                        }}
                      >
                        <Typography
                          fontFamily={theme.typography.fontFamily}
                          color={theme.palette.text.primary}
                          variant="body2"
                          fontSize={xs ? "11px" : ""}
                          textTransform="none"
                          fontWeight={600}
                        >
                          {element === "Published" || element === "Unpublished"
                            ? element
                            : "#" +
                              _getCaseInsensitiveElement(
                                props.tags,
                                element
                              ).replace(" ", "")}
                        </Typography>
                      </Button>
                    ))}
                </Box>
              </Grid>
              {/* Separator */}
              <Grid item xs={0} lg={1} order={{ lg: 2, xl: 2 }} />
              {/* Cards and pagination */}
              <Grid
                item
                container
                xs={12}
                lg={7}
                order={{ lg: 1, xl: 1 }}
                rowSpacing={2.5}
              >
                {/* Cards */}
                {posts ? (
                  posts.map((data, index) => {
                    return (
                      <Grid item key={index} xs={12}>
                        <TagsPageCard
                          author={data.author}
                          description={data.description}
                          icon={data.icon}
                          id={data.id}
                          image={data.image}
                          published={data.published}
                          readTime={data.readTime}
                          tags={data.tags}
                          timestamp={data.timestamp}
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
            {/* Pagination */}
            <Box flexGrow={1} />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              pt={xs ? 3 : 5}
              pb={xs ? 5 : 10}
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
                        Number(process.env.NEXT_PUBLIC_TAGS_PAGE_POSTS_PER_PAGE)
                    )
                  )
                }
                onClick={() => handleNextPage()}
              >
                <ArrowForwardIosSharp color="inherit" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </SEO>
  );
};
export default TagsPage;
