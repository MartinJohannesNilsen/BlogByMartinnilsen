import {
  AccessTime,
  ArrowBack,
  CalendarMonth,
  Edit,
  ExpandMore,
  IosShareOutlined,
  MenuBook,
  Tune,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonBase,
  Grid,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { isMobile } from "react-device-detect";
import { renderToStaticMarkup } from "react-dom/server";
import useWindowSize from "react-use/lib/useWindowSize";
import { RWebShare } from "react-web-share";
import { readingTime } from "reading-time-estimator";
import { useTheme } from "../../ThemeProvider";
import useAuthorized from "../../components/AuthorizationHook/useAuthorized";
import { style } from "../../components/EditorJS/Style";
import Footer from "../../components/Footer/Footer";
import SettingsModal from "../../components/Modals/SettingsModal";
import TOCModal from "../../components/Modals/TOCModal";
import { getAllPostIds } from "../../database/overview";
import { getPost } from "../../database/posts";
import ClappingHands from "../../public/assets/img/clapping-hands.png";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { ReadArticleViewProps } from "../../types";
// import dynamic from "next/dynamic";
// Got an error when revalidating pages on vercel, the line below fixed it, but removes toc as it does not render that well.
// const Output = dynamic(() => import("editorjs-react-renderer"), { ssr: false });
import Output from "editorjs-react-renderer";

// EditorJS renderers
import Giscus from "@giscus/react";
import CustomChecklist from "../../components/EditorJS/Renderers/CustomChecklist";
import CustomCode from "../../components/EditorJS/Renderers/CustomCode";
import CustomDivider from "../../components/EditorJS/Renderers/CustomDivider";
import CustomHeader from "../../components/EditorJS/Renderers/CustomHeader";
import CustomImage from "../../components/EditorJS/Renderers/CustomImage";
import CustomLinkTool from "../../components/EditorJS/Renderers/CustomLinkTool";
import CustomList from "../../components/EditorJS/Renderers/CustomList";
import CustomMath from "../../components/EditorJS/Renderers/CustomMath";
import CustomParagraph from "../../components/EditorJS/Renderers/CustomParagraph";
import CustomPersonality from "../../components/EditorJS/Renderers/CustomPersonality";
import CustomQuote from "../../components/EditorJS/Renderers/CustomQuote";
import CustomTable from "../../components/EditorJS/Renderers/CustomTable";
import CustomVideo from "../../components/EditorJS/Renderers/CustomVideo";
import CustomWarning from "../../components/EditorJS/Renderers/CustomWarning";
import ShareModal from "../../components/Modals/ShareModal";
import SEO from "../../components/SEO/SEO";

export async function getStaticPaths() {
  const idList = await getAllPostIds(false); // Not filter on visibility
  const paths: string[] = [];
  idList.forEach((id) => {
    paths.push(`/posts/${id}`);
  });
  return { paths, fallback: "blocking" };
}

export const getStaticProps = async (context: any) => {
  const postId = context.params.postId as string;
  const post = await getPost(postId);
  if (!post) {
    return {
      notFound: true, //redirects to 404 page
    };
  }
  return {
    props: {
      post,
      postId,
    },
  };
};

export const DEFAULT_OGIMAGE = "https://blog.mjntech.dev/icons/ogimage.png";

// Pass your custom renderers to Output
export const renderers = {
  paragraph: CustomParagraph,
  header: CustomHeader,
  code: CustomCode,
  divider: CustomDivider,
  simpleimage: CustomImage,
  uploadimage: CustomImage,
  urlimage: CustomImage,
  linktool: CustomLinkTool,
  quote: CustomQuote,
  personality: CustomPersonality,
  warning: CustomWarning,
  video: CustomVideo,
  checklist: CustomChecklist,
  table: CustomTable,
  math: CustomMath,
  list: CustomList,
};

export const ReadArticleView: FC<ReadArticleViewProps> = (props) => {
  const post = props.post;
  const { isAuthorized, status } = useAuthorized(!post.published);
  const { theme, setTheme } = useTheme();
  const [openTOCModal, setOpenTOCModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { width, height } = useWindowSize();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const router = useRouter();
  const handleNavigate = (path: string) => {
    // router.push(path); // TODO Seems to only getting a blank page
    window.location.href = path;
  };

  const handleThemeChange = (event: any) => {
    setTheme(
      event.target.checked === true ? ThemeEnum.Light : ThemeEnum.Dark,
      true
    );
  };

  const OutputElement = useMemo(() => {
    return (
      post &&
      post.data && (
        <Output renderers={renderers} data={post.data} style={style(theme)} />
      )
    );
  }, [post]);

  useEffect(() => {
    setIsLoading(false);
    if (typeof window !== "undefined" && window.location.hash) {
      router.push(window.location.hash);
    }
  }, [OutputElement]);

  const OutputString = useMemo(() => {
    return renderToStaticMarkup(OutputElement);
  }, [OutputElement]);

  if (!post.published && !isAuthorized) return <></>;
  return (
    <SEO
      pageMeta={{
        title: post.title,
        description: post.description,
        themeColor: isMobile
          ? theme.palette.primary.dark
          : theme.palette.primary.main,
        canonical: "https://blog.mjntech.dev/posts/" + props.postId,
        openGraph: {
          url: "https://blog.mjntech.dev/posts/" + props.postId,
          image:
            post.image && post.image.trim() !== ""
              ? post.image
              : "https://blog.mjntech.dev/icons/ogimage.png",
          type: "article",
          article: {
            published: new Date(post.timestamp),
            keywords: post.tags,
          },
        },
      }}
    >
      <Box width="100%">
        {isLoading ? (
          <></>
        ) : !post ? (
          <></>
        ) : !post.published && status === "loading" ? (
          <></>
        ) : (
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            justifyItems="center"
            sx={{ backgroundColor: theme.palette.primary.main }}
          >
            {/* Header row */}
            {isMobile ? (
              // Mobile
              <Box
                width={"100%"}
                pt={4.75}
                pb={0.75}
                position={"fixed"}
                display="flex"
                justifyContent={"center"}
                sx={{
                  backgroundColor: theme.palette.primary.dark,
                  top: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  zIndex: 1000,
                  marginTop: "-32px",
                  WebkitTransform: "translateZ(0)",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    width: "95%",
                  }}
                >
                  <ArrowBack
                    sx={{
                      fontFamily: theme.typography.fontFamily,
                      fontSize: "30px",
                      color: theme.palette.text.primary,
                      "&:hover": {
                        cursor: "pointer",
                        color: theme.palette.secondary.main,
                      },
                    }}
                    onClick={() => router.push("/")}
                  />
                  {OutputString ? (
                    <Tooltip enterDelay={2000} title={"Open table of contents"}>
                      <ButtonBase
                        onClick={() => setOpenTOCModal(true)}
                        sx={{
                          marginTop: -0.4,
                          marginX: theme.spacing(0.75),
                        }}
                      >
                        <MenuBook
                          sx={{
                            color: theme.palette.text.primary,
                            height: "32px",
                            width: "32px",
                            "&:hover": {
                              color: theme.palette.secondary.main,
                            },
                          }}
                        />
                      </ButtonBase>
                    </Tooltip>
                  ) : (
                    <Box sx={{ height: "32px", width: "32px" }} />
                  )}
                  {/* TOCModal */}
                  {OutputString && (
                    <TOCModal
                      open={openTOCModal}
                      handleModalOpen={() => setOpenTOCModal(true)}
                      handleModalClose={() => setOpenTOCModal(false)}
                      outputString={OutputString}
                      postTitle={post.title}
                    />
                  )}
                  <Box flexGrow={100} />
                  <Typography
                    fontFamily={theme.typography.fontFamily}
                    variant="body1"
                    fontWeight="800"
                    textAlign="center"
                    color={theme.palette.text.primary}
                    marginX={1}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Box flexGrow={100} />
                  <Box display="flex" ml={1}>
                    <Tooltip enterDelay={2000} title={"Open settings"}>
                      <ButtonBase
                        sx={{ marginBottom: 0 }}
                        onClick={() => {
                          setOpenSettingsModal(true);
                        }}
                      >
                        <Tune
                          sx={{
                            color: theme.palette.text.primary,
                            height: "32px",
                            width: "32px",
                            "&:hover": {
                              color: theme.palette.secondary.main,
                            },
                          }}
                        />
                      </ButtonBase>
                    </Tooltip>
                    <SettingsModal
                      open={openSettingsModal}
                      handleModalOpen={() => setOpenSettingsModal(true)}
                      handleModalClose={() => setOpenSettingsModal(false)}
                      handleThemeChange={handleThemeChange}
                    />
                    {!post.published ? (
                      <IosShareOutlined
                        sx={{
                          marginBottom: 0.33,
                          color: theme.palette.text.primary,
                          height: "28px",
                          width: "32px",
                        }}
                      />
                    ) : (
                      <RWebShare
                        data={{
                          text: post.title,
                          url:
                            typeof window !== "undefined"
                              ? window.location.href
                              : "",
                          title: "Check out this post!",
                        }}
                      >
                        <Tooltip enterDelay={2000} title={"Share"}>
                          <ButtonBase>
                            <IosShareOutlined
                              sx={{
                                marginBottom: 0.33,
                                color: theme.palette.text.primary,
                                height: "28px",
                                width: "32px",
                                "&:hover": {
                                  color: theme.palette.secondary.main,
                                },
                              }}
                            />
                          </ButtonBase>
                        </Tooltip>
                      </RWebShare>
                    )}
                  </Box>
                </Box>
              </Box>
            ) : (
              // Not mobile
              <Box
                display="flex"
                alignItems="center"
                width={"80%"}
                px={3}
                pt={2}
                pb={2}
                position={"relative"}
                sx={{
                  top: 0,
                  backgroundColor: theme.palette.primary.main,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  zIndex: 1000,
                  marginTop: "0",
                  WebkitTransform: "translateZ(0)",
                }}
              >
                <Link
                  fontFamily={theme.typography.fontFamily}
                  variant="body1"
                  fontWeight="900"
                  sx={{
                    fontSize: theme.typography.body1.fontSize,
                    textDecoration: "none",
                    color: theme.palette.text.primary,
                    "&:hover": {
                      cursor: "pointer",
                      color: theme.palette.secondary.main,
                    },
                  }}
                  href={"/"}
                >
                  {"← Home"}
                </Link>
                <Box flexGrow={100} />
                <Box display="flex">
                  {OutputString ? (
                    <Tooltip enterDelay={2000} title={"Open table of contents"}>
                      <ButtonBase onClick={() => setOpenTOCModal(true)}>
                        <MenuBook
                          sx={{
                            color: theme.palette.text.primary,
                            height: "32px",
                            width: "32px",
                            "&:hover": {
                              color: theme.palette.secondary.main,
                            },
                          }}
                        />
                      </ButtonBase>
                    </Tooltip>
                  ) : (
                    <Box sx={{ height: "32px", width: "32px" }} />
                  )}
                  {/* TOCModal */}
                  {OutputString && (
                    <TOCModal
                      open={openTOCModal}
                      handleModalOpen={() => setOpenTOCModal(true)}
                      handleModalClose={() => setOpenTOCModal(false)}
                      outputString={OutputString}
                      postTitle={post.title}
                    />
                  )}
                  {/* SettingsModal */}
                  <Tooltip enterDelay={2000} title={"Open settings"}>
                    <ButtonBase
                      sx={{ marginTop: 0.42, marginLeft: theme.spacing(1) }}
                      onClick={() => {
                        setOpenSettingsModal(true);
                      }}
                    >
                      <Tune
                        sx={{
                          color: theme.palette.text.primary,
                          height: "32px",
                          width: "32px",
                          "&:hover": {
                            color: theme.palette.secondary.main,
                          },
                        }}
                      />
                    </ButtonBase>
                  </Tooltip>
                  <SettingsModal
                    open={openSettingsModal}
                    handleModalOpen={() => setOpenSettingsModal(true)}
                    handleModalClose={() => setOpenSettingsModal(false)}
                    handleThemeChange={handleThemeChange}
                  />
                  {/* ShareModal */}
                  <Tooltip enterDelay={2000} title={"Share"}>
                    <ButtonBase
                      disabled={!post.published}
                      onClick={() => {
                        setOpenShareModal(true);
                      }}
                      sx={{
                        marginLeft: theme.spacing(0.25),
                        marginRight: theme.spacing(-0.75),
                      }}
                    >
                      <IosShareOutlined
                        sx={{
                          color: theme.palette.text.primary,
                          height: "28px",
                          width: "32px",
                          alignText: "right",
                          "&:hover": {
                            color: theme.palette.secondary.main,
                          },
                        }}
                      />
                    </ButtonBase>
                  </Tooltip>
                  <ShareModal
                    open={openShareModal}
                    handleModalOpen={() => setOpenShareModal(true)}
                    handleModalClose={() => setOpenShareModal(false)}
                    data={{
                      title: post.title,
                      description: post.description,
                      image:
                        post.image && post.image.trim() !== ""
                          ? post.image
                          : "https://blog.mjntech.dev/icons/ogimage.png",
                      url: window.location.href,
                      height: xs ? 100 : 130,
                      width: xs ? 400 : 500,
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Content */}
            {/* <RevealFromDownOnEnter from_opacity={0} y={"+=10px"}> */}
            <Grid
              container
              width="100%"
              justifyContent="center"
              sx={{ backgroundColor: theme.palette.primary.main }}
            >
              <Grid item>
                <Stack
                  p={2}
                  sx={{
                    minHeight: isMobile
                      ? "calc(100vh - 81px - 30px)"
                      : "calc(100vh - 67px - 117px)",
                    width: xs ? "380px" : sm ? "500px" : "700px",
                    position: "relative",
                  }}
                >
                  {/* Title box */}
                  <Box
                    display="flex"
                    alignItems="center"
                    mt={isMobile ? 6 : 0}
                    mb={1}
                    pb={2}
                  >
                    <Box
                      display="flex"
                      width="100%"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography
                        my={1}
                        textAlign="center"
                        fontFamily={theme.typography.fontFamily}
                        variant="h5"
                        fontWeight="800"
                        sx={{ color: theme.palette.secondary.main }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            post.type
                              ? "//&nbsp;&nbsp;&nbsp;&nbsp;" +
                                  post.type +
                                  "&nbsp;&nbsp;&nbsp;&nbsp;//"
                              : ""
                          ),
                        }}
                      />
                      <Typography
                        my={xs ? 0.5 : 1}
                        textAlign="center"
                        sx={{ color: theme.palette.text.primary }}
                        fontFamily={theme.typography.fontFamily}
                        variant={xs ? "h4" : "h3"}
                        fontWeight="800"
                      >
                        {post.title}
                      </Typography>
                      <Box
                        display="flex"
                        mt={2}
                        mb={xs ? 0 : 1}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CalendarMonth
                          sx={{
                            color: theme.palette.text.primary,
                            opacity: 0.6,
                            marginRight: "6px",
                            fontSize: xs ? "12px" : "default",
                          }}
                        />
                        <Typography
                          fontFamily={theme.typography.fontFamily}
                          variant="body2"
                          fontWeight="600"
                          sx={{
                            color: theme.palette.text.primary,
                            opacity: 0.6,
                            fontSize: xs ? "12px" : "default",
                          }}
                        >
                          {new Date(post.timestamp).toLocaleDateString(
                            "en-GB",
                            {
                              weekday: "long",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </Typography>
                        <AccessTime
                          sx={{
                            color: theme.palette.text.primary,
                            opacity: 0.6,
                            marginLeft: "16px",
                            marginRight: "6px",
                            fontSize: xs ? "12px" : "default",
                          }}
                        />
                        <Typography
                          fontFamily={theme.typography.fontFamily}
                          variant="body2"
                          fontWeight="600"
                          sx={{
                            color: theme.palette.text.primary,
                            opacity: 0.6,
                            fontSize: xs ? "12px" : "default",
                          }}
                        >
                          {post.readTime ? post.readTime : "⎯"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {/* EditorJS rendering */}
                  <Box
                    id="output"
                    mb={1}
                    sx={{
                      backgroundColor: "transparent",
                    }}
                  >
                    {OutputElement}
                  </Box>
                  <Box flexGrow={100} />
                  {/* Share and applause section */}
                  <Box mt={6} py={3}>
                    {/* Clap with horizontal lines */}
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box
                        style={{
                          width: "100%",
                          borderBottom: "2px solid rgba(100,100,100,0.2)",
                        }}
                      />
                      <Tooltip enterDelay={2000} title={"Clap"}>
                        <IconButton
                          disabled={isExploding}
                          sx={{
                            "&:disabled": { opacity: "0.5" },
                            marginLeft: 3,
                            marginRight: isMobile ? 3 : 0.5,
                          }}
                          onClick={() => {
                            setIsExploding(true);
                            setTimeout(() => {
                              setIsExploding(false);
                            }, 3500);
                          }}
                        >
                          <Image
                            src={ClappingHands.src}
                            width={30}
                            height={30}
                            alt="Clapping hands button"
                          />
                        </IconButton>
                      </Tooltip>
                      {!isMobile ? (
                        <>
                          <Tooltip enterDelay={2000} title={"Share"}>
                            <IconButton
                              disabled={!post.published}
                              sx={{ marginRight: 3 }}
                              onClick={() => {
                                setOpenShareModal(true);
                              }}
                            >
                              <IosShareOutlined
                                sx={{
                                  color: theme.palette.text.primary,
                                  opacity: 0.5,
                                  height: "30px",
                                  width: "30px",
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                          <ShareModal
                            open={openShareModal}
                            handleModalOpen={() => setOpenShareModal(true)}
                            handleModalClose={() => setOpenShareModal(false)}
                            data={{
                              title: post.title,
                              description: post.description,
                              image:
                                post.image && post.image.trim() !== ""
                                  ? post.image
                                  : "https://blog.mjntech.dev/icons/ogimage.png",
                              url: window.location.href,
                              height: xs ? 100 : 130,
                              width: xs ? 400 : 500,
                            }}
                          />
                        </>
                      ) : null}
                      <Box
                        style={{
                          width: "100%",
                          borderBottom: "2px solid rgba(100,100,100,0.2)",
                        }}
                      />
                    </Box>
                    {/* Share and funding */}
                    {/* <Box sx={{ display: "flex", flexDirection: "row" }}> */}
                    {/* Left */}
                    {/* <Box width="100%" display="flex" justifyContent="center">
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        color="textPrimary"
                        fontFamily={theme.typography.fontFamily}
                      >
                        Share on
                      </Typography>
                    </Box>
                    <Box width={108} mx={3} />
                    <Box width="100%" display="flex" justifyContent="center">
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        color="textPrimary"
                        fontFamily={theme.typography.fontFamily}
                      >
                        Share on
                      </Typography>
                    </Box>
                  </Box> */}
                  </Box>
                  {/* Comment section */}
                  <Box mb={3}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography
                          fontFamily={theme.typography.fontFamily}
                          color={theme.palette.text.primary}
                        >
                          Reactions & Comments
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Giscus
                          repo={`${process.env.NEXT_PUBLIC_GISCUS_USER}/${process.env.NEXT_PUBLIC_GISCUS_REPO}`}
                          repoId={process.env.NEXT_PUBLIC_GISCUS_REPOID}
                          categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORYID}
                          id="comments"
                          category="Comments"
                          mapping="url"
                          term="Welcome to the comment section!"
                          strict="1"
                          reactionsEnabled="1"
                          emitMetadata="0"
                          inputPosition="top"
                          theme={
                            theme.palette.mode === "light" ? "light" : "dark"
                          }
                          lang="en"
                          loading="lazy"
                        />
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
            {/* </RevealFromDownOnEnter> */}
            {isExploding && (
              <Box
                sx={{
                  position: "fixed",
                  bottom: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  overflow: "visible",
                  zIndex: 5,
                  display: "inline-block",
                }}
              >
                <ConfettiExplosion
                  force={isMobile ? 0.8 : 0.5}
                  duration={4000}
                  particleCount={250}
                  height={height - 100}
                  width={width - 100}
                />
              </Box>
            )}
            <Footer />
            {/* Buttons for administration */}
            {isAuthorized ? (
              <Box
                onClick={() => {
                  handleNavigate("/create/" + props.postId);
                }}
                display="flex"
                gap="10px"
                sx={{ position: "fixed", left: 25, bottom: 25, zIndex: 10 }}
              >
                <Tooltip enterDelay={2000} title="Edit post" placement="top">
                  <Button
                    sx={{
                      border: "2px solid " + theme.palette.text.primary,
                      index: 2,
                      backgroundColor: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <Edit
                      sx={{
                        color: theme.palette.text.primary,
                      }}
                    />
                  </Button>
                </Tooltip>
              </Box>
            ) : (
              <></>
            )}
          </Box>
        )}
      </Box>
    </SEO>
  );
};
export default ReadArticleView;
