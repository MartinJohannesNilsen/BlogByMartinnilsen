import { IosShareOutlined, MenuBook, Tune } from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
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
import Output from "editorjs-react-renderer";
import DOMPurify from "isomorphic-dompurify";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { isMobile } from "react-device-detect";
import { renderToString } from "react-dom/server";
import useWindowSize from "react-use/lib/useWindowSize";
import { RWebShare } from "react-web-share";
import { readingTime } from "reading-time-estimator";
import { useTheme } from "../../ThemeProvider";
import useAuthorized from "../../components/AuthorizationHook/useAuthorized";
import { style } from "../../components/EditorJS/Style";
import Footer from "../../components/Footer/Footer";
import TOCModal from "../../components/Modals/TOCModal";
import { getAllPostIds } from "../../database/overview";
import { getPost } from "../../database/posts";
import ClappingHands from "../../public/assets/img/clapping-hands.png";
import { ReadArticleViewProps } from "../../types";
import colorLumincance from "../../utils/colorLuminance";
import SettingsModal from "../../components/Modals/SettingsModal";

// EditorJS renderers
import CustomChecklist from "../../components/EditorJS/Renderers/CustomChecklist";
import CustomCode from "../../components/EditorJS/Renderers/CustomCode";
import CustomDivider from "../../components/EditorJS/Renderers/CustomDivider";
import CustomHeader from "../../components/EditorJS/Renderers/CustomHeader";
import CustomImage from "../../components/EditorJS/Renderers/CustomImage";
import CustomLinkTool from "../../components/EditorJS/Renderers/CustomLinkTool";
import CustomParagraph from "../../components/EditorJS/Renderers/CustomParagraph";
import CustomPersonality from "../../components/EditorJS/Renderers/CustomPersonality";
import CustomQuote from "../../components/EditorJS/Renderers/CustomQuote";
import CustomTable from "../../components/EditorJS/Renderers/CustomTable";
import CustomVideo from "../../components/EditorJS/Renderers/CustomVideo";
import CustomWarning from "../../components/EditorJS/Renderers/CustomWarning";
import { ThemeEnum } from "../../styles/themes/themeMap";

export async function getStaticPaths() {
  const idList = await getAllPostIds(false); // Not filter on visibility
  const paths: string[] = [];
  idList.forEach((id) => {
    paths.push(`/posts/${id}`);
  });
  return { paths, fallback: "blocking" };
}

export const getStaticProps = async (context: any) => {
  const post = await getPost(context.params.postId as string);
  if (!post) {
    return {
      notFound: true, //redirects to 404 page
    };
  }

  return {
    props: {
      post,
    },
  };
};

export const ReadArticleView: FC<ReadArticleViewProps> = (props) => {
  const { theme, setTheme } = useTheme();
  const [openTOCModal, setOpenTOCModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { width, height } = useWindowSize();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };
  const router = useRouter();
  const postId = router.query.postId;
  const post = props.post;
  const { isAuthorized } = useAuthorized();

  // Pass your custom renderers to Output
  const renderers = {
    paragraph: CustomParagraph,
    header: CustomHeader,
    code: CustomCode,
    divider: CustomDivider,
    image: CustomImage,
    simpleimage: CustomImage,
    linktool: CustomLinkTool,
    quote: CustomQuote,
    personality: CustomPersonality,
    warning: CustomWarning,
    video: CustomVideo,
    checklist: CustomChecklist,
    table: CustomTable,
    // math: CustomMath,
  };

  const handleThemeChange = (event: any) => {
    event.target.checked === true
      ? setTheme(ThemeEnum.Light)
      : setTheme(ThemeEnum.Dark);
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
      window.location.href = window.location.hash;
    }
  }, [OutputElement]);

  const OutputString = useMemo(() => {
    return renderToString(OutputElement);
  }, [OutputElement]);

  function extractTextContent(html: string) {
    return html.replace(/<[^>]+>/g, " ");
  }

  const ReadingTime = useMemo(() => {
    const text = extractTextContent(OutputString);
    return readingTime(text, 275);
  }, [OutputString]);

  return (
    <Box width="100%">
      {isLoading ? (
        <></>
      ) : !post ? (
        <></>
      ) : (
        // (window.location.href = "/")
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
              display="flex"
              alignItems="center"
              width={"95%"}
              pt={5}
              pb={0.5}
              position={"fixed"}
              sx={{
                top: 0,
                backgroundColor: theme.palette.primary.main,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                zIndex: 1000,
                marginTop: "-32px",
                WebkitTransform: "translateZ(0)",
              }}
            >
              <Link
                fontFamily={theme.typography.fontFamily}
                variant="body1"
                fontWeight="900"
                sx={{
                  fontSize: "25px",
                  textDecoration: "none",
                  color: theme.palette.secondary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: colorLumincance(theme.palette.secondary.main, 0.33),
                  },
                }}
                href={"/"}
              >
                ←
              </Link>
              {OutputString && (
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
                <RWebShare
                  data={{
                    text: 'Check out this post: "' + post.title + '"!',
                    url:
                      typeof window !== "undefined" ? window.location.href : "",
                    title: "Link to post",
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
              </Box>
            </Box>
          ) : (
            // Not mobile
            <Box
              display="flex"
              alignItems="center"
              width={xs ? "380px" : sm ? "500px" : "700px"}
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
                mr={OutputString ? 7.25 : 1.25}
                sx={{
                  fontSize: theme.typography.body1.fontSize,
                  textDecoration: "none",
                  color: theme.palette.secondary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: colorLumincance(theme.palette.secondary.main, 0.33),
                  },
                }}
                href={"/"}
              >
                {"← Home"}
              </Link>
              <Box flexGrow={100} />
              <Box display="flex" ml={1}>
                {OutputString && (
                  <Tooltip enterDelay={2000} title={"Open table of contents"}>
                    <ButtonBase
                      onClick={() => setOpenTOCModal(true)}
                      sx={{
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
                <Tooltip enterDelay={2000} title={"Open settings"}>
                  <ButtonBase
                    sx={{ marginTop: 0.42 }}
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
                <RWebShare
                  data={{
                    text: 'Check out this post: "' + post.title + '"!',
                    url:
                      typeof window !== "undefined" ? window.location.href : "",
                    title: "Link to post",
                  }}
                >
                  <Tooltip enterDelay={2000} title={"Share"}>
                    <ButtonBase>
                      <IosShareOutlined
                        sx={{
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
              <NextSeo
                title={post.title}
                description={post.summary}
                canonical={window.location.href}
                openGraph={{
                  type: "article",
                  article: {
                    publishedTime:
                      new Date(post.timestamp).getFullYear() +
                      "-" +
                      ("0" + (new Date(post.timestamp).getMonth() + 1)).slice(
                        -2
                      ) +
                      "-" +
                      ("0" + new Date(post.timestamp).getDate()).slice(-2),
                    tags: post.tags,
                  },
                  url: window.location.href,
                  images: [
                    {
                      url: post.image,
                    },
                  ],
                  site_name: "MJNTech.dev",
                }}
              />
              <Stack
                p={2}
                sx={{
                  minHeight: isMobile
                    ? "calc(100vh - 73px - 120px)"
                    : "calc(100vh - 73px - 120px)",
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
                      <CalendarMonthIcon
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
                        {new Date(post.timestamp).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                      <AccessTimeIcon
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
                        {ReadingTime.text}
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
                {/* Share and exploding */}
                <Box
                  mt={6}
                  mb={3}
                  py={2}
                  sx={{
                    borderTop: "2px solid rgba(100,100,100,0.2)",
                    borderBottom: "2px solid rgba(100,100,100,0.2)",
                  }}
                  display="flex"
                  justifyContent="center"
                >
                  <IconButton
                    disabled={isExploding}
                    sx={{ "&:disabled": { opacity: "0.5" } }}
                    onClick={() => {
                      setIsExploding(true);
                      setTimeout(() => {
                        setIsExploding(false);
                      }, 4000);
                    }}
                  >
                    <Image
                      src={ClappingHands.src}
                      width={30}
                      height={30}
                      alt="Clapping hands button"
                    />
                  </IconButton>
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
                handleNavigate(("/create/" + postId) as string);
              }}
              display="flex"
              gap="10px"
              sx={{ position: "fixed", left: 25, bottom: 25, zIndex: 10 }}
            >
              <Button
                sx={{
                  border: "2px solid " + theme.palette.text.primary,
                }}
              >
                <Typography variant="button" color={theme.palette.text.primary}>
                  Update
                </Typography>
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      )}
    </Box>
  );
};
export default ReadArticleView;
