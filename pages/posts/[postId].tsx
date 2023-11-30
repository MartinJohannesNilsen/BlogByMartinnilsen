import Giscus from "@giscus/react";
import {
  AccessTime,
  ArrowBack,
  CalendarMonth,
  Edit,
  ExpandMore,
  IosShareOutlined,
  MenuBook,
  Tune,
  Visibility,
} from "@mui/icons-material";
import {
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
import { useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { isMobile } from "react-device-detect";
import { renderToStaticMarkup } from "react-dom/server";
import { BiCoffeeTogo } from "react-icons/bi";
import { TbConfetti, TbShare2 } from "react-icons/tb";
import useWindowSize from "react-use/lib/useWindowSize";
import { useTheme } from "../../ThemeProvider";
import useAuthorized from "../../components/AuthorizationHook/useAuthorized";
import { style } from "../../components/EditorJS/Style";
import Footer from "../../components/Footer/Footer";
import SettingsModal from "../../components/Modals/SettingsModal";
import ShareModal from "../../components/Modals/ShareModal";
import TOCModal, { extractHeaders } from "../../components/Modals/TOCModal";
import SEO, { DEFAULT_OGIMAGE } from "../../components/SEO/SEO";
import { getAllPostIds } from "../../database/overview";
import { getPost } from "../../database/posts";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { ReadArticleViewProps } from "../../types";
// import dynamic from "next/dynamic";
// Got an error when revalidating pages on vercel, the line below fixed it, but removes toc as it does not render that well.
// const Output = dynamic(() => import("editorjs-react-renderer"), { ssr: false });
import Output from "editorjs-react-renderer";
import { useEventListener } from "usehooks-ts";
import logo from "public/assets/imgs/terminal.png";
import Image from "next/image";

// EditorJS renderers
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
import CustomIframe from "../../components/EditorJS/Renderers/CustomIframe";
import { RevealFromDownOnEnter } from "../../components/Animations/Reveal";
import PostViews from "../../components/PostViews/PostViews";
import CustomToggle, {
  Accordion,
} from "../../components/EditorJS/Renderers/CustomToggle";

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
  iframe: CustomIframe,
  toggle: CustomToggle,
};

export const handleSharing = async ({ url, title, text, icon, fallback }) => {
  const shareDetails = {
    url, // The URL of the webpage you want to share
    title, // The title of the shared content
    text, // The description or text to accompany the shared content
    icon, // URL of the image for the preview
  };
  if (navigator.share) {
    try {
      await navigator.share(shareDetails);
    } catch (error) {}
  } else {
    // fallback code
    fallback();
  }
};

export function processJsonToggleBlocks(inputJson) {
  // Deep copy the input JSON object
  let json = JSON.parse(JSON.stringify(inputJson));

  if (Array.isArray(json.blocks)) {
    // Initialize a new array for processed blocks
    let newBlocks = [];

    // Iterate over the blocks
    for (let i = 0; i < json.blocks.length; i++) {
      let block = json.blocks[i];

      // Check if the block is a toggle
      if (block.type === "toggle") {
        // Initialize an inner blocks array in the toggle block
        block.data.blocks = [];

        // Move the specified number of blocks into the toggle block
        for (
          let j = 0;
          j < block.data.items && i + 1 + j < json.blocks.length;
          j++
        ) {
          block.data.blocks.push(json.blocks[i + 1 + j]);
        }

        // Skip the moved blocks in the main loop
        i += block.data.items;
      }

      // Add the processed block to the new blocks array
      newBlocks.push(block);
    }

    // Replace the original blocks array with the new one
    json.blocks = newBlocks;

    // Return the modified JSON
    return json;
  }

  return null;
}

export const ReadArticleView: FC<ReadArticleViewProps> = (props) => {
  const post = props.post;
  const { isAuthorized, status } =
    process.env.NEXT_PUBLIC_LOCALHOST === "true"
      ? {
          isAuthorized: true,
          status: "authenticated",
        }
      : useAuthorized(!post.published);
  const { theme, setTheme } = useTheme();
  const [openTOCModal, setOpenTOCModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { width, height } = useWindowSize();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };
  const [currentSection, setCurrentSection] = useState(post.title);

  const handleThemeChange = (event: any) => {
    setTheme(
      event.target.checked === true ? ThemeEnum.Light : ThemeEnum.Dark,
      true
    );
  };

  const OutputElement = useMemo(() => {
    if (
      post &&
      post.data &&
      post.data.blocks &&
      Array.isArray(post.data.blocks)
    ) {
      const processedData = processJsonToggleBlocks(post.data);
      return (
        <Output
          renderers={renderers}
          data={processedData}
          style={style(theme)}
        />
      );
    }
    return null;
  }, [post]);

  useEffect(() => {
    // // When output element, not loading anymore
    // When status is updated, not loading anymore
    setIsLoading(false);
    // Increase view count in supabase db if not on localhost, post is published and user is not authorized
    process.env.NEXT_PUBLIC_LOCALHOST === "false" &&
    post.published &&
    status == "unauthenticated"
      ? fetch(`/api/views/${props.postId}`, {
          method: "POST",
        })
      : null;
  }, [status]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      handleNavigate(window.location.hash);
    }
  }, [isLoading]);

  const OutputString = useMemo(() => {
    return renderToStaticMarkup(OutputElement);
  }, [OutputElement]);

  useEventListener("scroll", () => {
    const sectionEls = document.querySelectorAll(".anchorHeading");
    sectionEls.forEach((sectionEl) => {
      const { top, bottom } = sectionEl.getBoundingClientRect();
      // Check if the top of the section is above the viewport's bottom
      // if (top <= 0 && bottom >= 0) {
      if (top - 50 <= 0) {
        setCurrentSection(sectionEl.id);
      }
    });
  });

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
          image: post.image || DEFAULT_OGIMAGE,
          type: "article",
          article: {
            published: new Date(post.createdAt),
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
                    onClick={() => handleNavigate("/")}
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
                      headings={extractHeaders(OutputString)}
                      currentSection={currentSection}
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
                      <>
                        <Tooltip enterDelay={2000} title={"Share"}>
                          <ButtonBase
                            onClick={() => {
                              handleSharing({
                                url:
                                  typeof window !== "undefined"
                                    ? window.location.href
                                    : "",
                                title: post.title,
                                text: "",
                                icon: post.image || DEFAULT_OGIMAGE,
                                fallback: () => setOpenShareModal(true),
                              });
                            }}
                          >
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
                                : DEFAULT_OGIMAGE,
                            url: window.location.href,
                            height: xs ? 100 : 130,
                            width: xs ? 400 : 500,
                          }}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            ) : (
              // Not mobile
              <Box
                display="flex"
                alignItems="center"
                width={"100%"}
                px={3}
                pt={2}
                pb={2}
                // position={"relative"}
                position={"sticky"}
                sx={{
                  top: 0,
                  backgroundColor: theme.palette.primary.main + "50",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  zIndex: 1000,
                  marginTop: "0",
                  WebkitTransform: "translateZ(0)",
                  // boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  backdropFilter: "blur(5px)",
                  WebkitBackdropFilter: "blur(5px)",
                }}
              >
                {/* Home button */}
                <ButtonBase
                  onClick={() => handleNavigate("/")}
                  disableRipple
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    src={logo.src}
                    alt=""
                    width={32}
                    height={32}
                    style={{ borderRadius: "0" }}
                  />
                  <Typography
                    // variant={"h5"}
                    fontFamily={theme.typography.fontFamily}
                    color={theme.palette.text.primary}
                    fontWeight={700}
                    fontSize={22}
                    textAlign="left"
                    pl={0.5}
                  >
                    Blog
                  </Typography>
                </ButtonBase>
                <Box flexGrow={100} />
                <Box display="flex">
                  {OutputString ? (
                    <Tooltip enterDelay={2000} title={"Open table of contents"}>
                      <ButtonBase
                        disableRipple
                        onClick={() => setOpenTOCModal(true)}
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
                      headings={extractHeaders(OutputString)}
                      currentSection={currentSection}
                      postTitle={post.title}
                    />
                  )}
                  {/* SettingsModal */}
                  <Tooltip enterDelay={2000} title={"Open settings"}>
                    <ButtonBase
                      disableRipple
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
                      disableRipple
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
                          : DEFAULT_OGIMAGE,
                      url: window.location.href,
                      height: xs ? 100 : 130,
                      width: xs ? 400 : 500,
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* TOC on lg xl
            {lgUp ? (
              <Box sx={{ position: "fixed", top: 80, right: 10 }}>
                <TOCModal
                  open={openTOCModal}
                  handleModalOpen={() => setOpenTOCModal(true)}
                  handleModalClose={() => setOpenTOCModal(false)}
                  headings={extractHeaders(OutputString)}
                  currentSection={currentSection}
                  postTitle={post.title}
                  sidebarMode
                />
              </Box>
            ) : null} */}

            {/* Content */}
            {/* <RevealFromDownOnEnter
              from_opacity={0}
              y={xs ? "+=10px" : "+=30px"}
              duration={2}
            > */}
            <Grid
              container
              width="100%"
              justifyContent="center"
              sx={{
                backgroundColor: theme.palette.primary.main,
                userSelect: "text",
              }}
            >
              <Grid item>
                <Stack
                  p={2}
                  sx={{
                    minHeight: isMobile
                      ? "calc(100vh - 81px - 30px)"
                      : "calc(100vh - 67px - 117px)",
                    minWidth: "380px",
                    width: xs ? "96vw" : sm ? "90vw" : "760px",
                    position: "relative",
                    userSelect: "none",
                  }}
                >
                  {/* Title box */}
                  <Box
                    id={post.title}
                    className={"anchorHeading"}
                    display="flex"
                    alignItems="center"
                    mt={isMobile ? 6 : 0}
                    mb={1}
                    pb={2}
                    sx={{ userSelect: "text" }}
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
                        my={xs ? 0 : 1}
                        textAlign="center"
                        sx={{ color: theme.palette.text.primary }}
                        fontFamily={theme.typography.fontFamily}
                        variant={"h3"}
                        fontWeight="800"
                      >
                        {post.title}
                      </Typography>
                      <Box
                        display="flex"
                        mt={mdDown ? 1 : 2}
                        mb={xs ? 0 : 1}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CalendarMonth
                          sx={{
                            color: theme.palette.text.primary,
                            opacity: 0.6,
                            marginRight: "6px",
                            // fontSize: xs ? "12px" : "default",
                            fontSize: "default",
                          }}
                        />
                        <Typography
                          fontFamily={theme.typography.fontFamily}
                          variant="body2"
                          fontWeight="600"
                          sx={{
                            color: theme.palette.text.primary,
                            opacity: 0.6,
                            // fontSize: xs ? "12px" : "default",
                            fontSize: "default",
                          }}
                        >
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              // weekday: "long",
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
                            // fontSize: xs ? "12px" : "default",
                            fontSize: "default",
                          }}
                        />
                        <Typography
                          fontFamily={theme.typography.fontFamily}
                          variant="body2"
                          fontWeight="600"
                          sx={{
                            color: theme.palette.text.primary,
                            opacity: 0.6,
                            // fontSize: xs ? "12px" : "default",
                            fontSize: "default",
                          }}
                        >
                          {post.readTime ? post.readTime : "⎯"}
                        </Typography>
                        {/* View counts */}
                        <Visibility
                          sx={{
                            opacity: 0.6,
                            marginLeft: "16px",
                            marginRight: "6px",
                            fontSize: "default",
                            color: theme.palette.text.primary,
                          }}
                        />
                        <Typography
                          fontFamily={theme.typography.fontFamily}
                          variant="body2"
                          fontWeight="600"
                          sx={{
                            opacity: 0.6,
                            fontSize: "default",
                            color: theme.palette.text.primary,
                          }}
                        >
                          {post.published ? (
                            <PostViews
                              postId={props.postId}
                              sx={{
                                fontSize: theme.typography.fontSize,
                                color: theme.palette.text.primary,
                                fontFamily: theme.typography.fontFamily,
                              }}
                            />
                          ) : (
                            "———"
                          )}
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
                      userSelect: "text",
                    }}
                  >
                    {OutputElement}
                  </Box>
                  <Box flexGrow={100} />
                  {/* Share and applause section */}
                  <Box mt={6} py={3} sx={{ userSelect: "none" }}>
                    {/* Horizontal lines */}
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
                      <Box display="flex" sx={{ paddingBottom: "6px" }}>
                        {/* Share */}
                        <Tooltip enterDelay={2000} title={"Share"}>
                          <IconButton
                            disableRipple
                            disabled={!post.published}
                            sx={{ marginLeft: 3 }}
                            onClick={() => {
                              isMobile
                                ? handleSharing({
                                    url:
                                      typeof window !== "undefined"
                                        ? window.location.href
                                        : "",
                                    title: post.title,
                                    text: "",
                                    icon: post.image || DEFAULT_OGIMAGE,
                                    fallback: () => setOpenShareModal(true),
                                  })
                                : setOpenShareModal(true);
                            }}
                          >
                            <Box
                              sx={{
                                color: theme.palette.text.primary,
                                "&:hover": {
                                  color: theme.palette.secondary.main,
                                },
                              }}
                            >
                              <TbShare2
                                style={{
                                  // opacity: 0.5,
                                  height: "30px",
                                  width: "30px",
                                }}
                              />
                            </Box>
                          </IconButton>
                        </Tooltip>
                        {/* Confetti */}
                        <Tooltip enterDelay={2000} title={"Confetti"}>
                          <IconButton
                            disableRipple
                            disabled={isExploding}
                            sx={{
                              "&:disabled": { opacity: "0.5" },
                              marginLeft: 0.5,
                              marginRight: 0.5,
                            }}
                            onClick={() => {
                              setIsExploding(true);
                              setTimeout(() => {
                                setIsExploding(false);
                              }, 3500);
                            }}
                          >
                            <Box
                              sx={{
                                color: theme.palette.text.primary,
                                "&:hover": {
                                  color: theme.palette.secondary.main,
                                },
                              }}
                            >
                              <TbConfetti
                                style={{
                                  // opacity: 0.5,
                                  height: "30px",
                                  width: "30px",
                                }}
                              />
                            </Box>
                          </IconButton>
                        </Tooltip>
                        {/* Paypal */}
                        <Tooltip enterDelay={2000} title={"Buy me a cacao"}>
                          <IconButton
                            disableRipple
                            sx={{
                              marginRight: 3,
                              marginLeft: xs ? -0.3 : -0.25,
                            }}
                            onClick={() => {
                              handleNavigate(
                                "https://www.paypal.com/donate/?hosted_button_id=MJFHZZ2RAN7HQ"
                              );
                            }}
                          >
                            <Box
                              sx={{
                                color: theme.palette.text.primary,
                                "&:hover": {
                                  color: theme.palette.secondary.main,
                                },
                              }}
                            >
                              <BiCoffeeTogo
                                style={{
                                  // opacity: 0.5,
                                  height: "29px",
                                  width: "30px",
                                }}
                              />
                            </Box>
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Box
                        style={{
                          width: "100%",
                          borderBottom: "2px solid rgba(100,100,100,0.2)",
                        }}
                      />
                    </Box>
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
            {isExploding ? (
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
                  force={isMobile ? 0.8 : 0.6}
                  duration={4000}
                  particleCount={250}
                  height={height - 100}
                  width={xs ? width + 200 : width - 100}
                />
              </Box>
            ) : null}
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
