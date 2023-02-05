import { FC, useCallback, useMemo, useState } from "react";
import {
  Avatar,
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
import { useTheme } from "../ThemeProvider";
import { style } from "../components/EditorJS/Style";
import Output from "editorjs-react-renderer";
import {
  Navigate,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { getPost } from "../database/posts";
import { Post, ReadArticleViewProps } from "../types";
import colorLumincance from "../utils/colorLuminance";
import Footer from "../components/Footer/Footer";
import { renderToString } from "react-dom/server";
import { readingTime } from "reading-time-estimator";
import { IosShare, Toc } from "@mui/icons-material";
import { RWebShare } from "react-web-share";
import { Helmet } from "react-helmet";
import DOMPurify from "dompurify";
import ClappingHands from "../assets/img/clapping-hands.png";
import AvatarMJN from "../assets/img/ProfileCutoutSquare.png";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfettiExplosion from "react-confetti-explosion";
import useWindowSize from "react-use/lib/useWindowSize";
import { isMobile } from "react-device-detect";

// Components
import CustomDelimiter from "../components/EditorJS/Renderers/CustomDelimiter";
import CustomImage from "../components/EditorJS/Renderers/CustomImage";
import CustomLinkTool from "../components/EditorJS/Renderers/CustomLinkTool";
import CustomQuote from "../components/EditorJS/Renderers/CustomQuote";
import CustomTable from "../components/EditorJS/Renderers/CustomTable";
import CustomPersonality from "../components/EditorJS/Renderers/CustomPersonality";
import CustomParagraph from "../components/EditorJS/Renderers/CustomParagraph";
import CustomWarning from "../components/EditorJS/Renderers/CustomWarning";
import CustomVideo from "../components/EditorJS/Renderers/CustomVideo";
import CustomChecklist from "../components/EditorJS/Renderers/CustomChecklist";
import CustomCode from "../components/EditorJS/Renderers/CustomCode";
import CustomMath from "../components/EditorJS/Renderers/CustomMath";
import CustomHeader from "../components/EditorJS/Renderers/CustomHeader";
import TOCModal from "../components/Modals/TOCModal";

export const postQuery = (id: string) => ({
  queryKey: ["posts", id],
  queryFn: async () => getPost(id),
});

export const loader =
  (queryClient: QueryClient) =>
  ({ params }: any) => {
    return queryClient.fetchQuery({
      ...postQuery(params.postId),
      staleTime: 1000 * 60 * 2,
    });
  };

export const ReadArticleView: FC<ReadArticleViewProps> = (props) => {
  const { theme } = useTheme();
  const params = useParams();
  const initialData = useLoaderData();
  const { data: fetchedPost } = useQuery({
    ...postQuery(params.postId!),
    initialData,
  });
  const [openTOCModal, setOpenTOCModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExploding, setIsExploding] = useState(false);
  const { width, height } = useWindowSize();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const navigate = useNavigate();
  const handleNavigate = useCallback(
    (path) => {
      navigate(path, { replace: true });
      location.reload();
    },
    [navigate]
  );

  const cachedPost = useMemo(() => {
    setIsLoading(false);
    return fetchedPost;
  }, []);
  const post = cachedPost as Post;

  // Pass your custom renderers to Output
  const renderers = {
    paragraph: CustomParagraph,
    header: CustomHeader,
    code: CustomCode,
    delimiter: CustomDelimiter,
    image: CustomImage,
    simpleimage: CustomImage,
    linktool: CustomLinkTool,
    quote: CustomQuote,
    personality: CustomPersonality,
    warning: CustomWarning,
    video: CustomVideo,
    checklist: CustomChecklist,
    table: CustomTable,
    math: CustomMath,
  };

  const OutputElement = useMemo(() => {
    return (
      post &&
      post.data && (
        <Output renderers={renderers} data={post.data} style={style(theme)} />
      )
    );
  }, [post]);

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
      ) : !fetchedPost ? (
        <Navigate to="/" />
      ) : (
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          justifyItems="center"
        >
          {/* Header row */}
          <Box
            display="flex"
            alignItems="center"
            width={isMobile ? "90%" : xs ? "380px" : sm ? "500px" : "700px"}
            pt={isMobile ? 5 : 2}
            pb={isMobile ? 0.5 : 2}
            position={isMobile ? "fixed" : "relative"}
            sx={{
              // width: ,
              top: 0,
              backgroundColor: theme.palette.primary.main,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              zIndex: 1000,
              marginTop: isMobile ? "-35px" : "0",
              WebkitTransform: "translateZ(0)",
            }}
          >
            <Link
              fontFamily={theme.typography.fontFamily}
              variant="body1"
              fontWeight="900"
              mr={0.5}
              sx={{
                fontSize: isMobile ? "25px" : theme.typography.body1.fontSize,
                textDecoration: "none",
                color: theme.palette.secondary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: colorLumincance(theme.palette.secondary.main, 0.33),
                },
              }}
              href={"/"}
            >
              {isMobile ? "←" : "← Home"}
            </Link>
            <Box flexGrow={100} />
            {isMobile ? (
              <Typography
                variant="body1"
                fontWeight="800"
                textAlign="center"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {post.title}
              </Typography>
            ) : (
              <></>
            )}
            <Box flexGrow={100} />
            {OutputString && (
              <Tooltip enterDelay={2000} title={"Open table of contents"}>
                <ButtonBase
                  onClick={() => setOpenTOCModal(true)}
                  sx={{
                    marginRight: theme.spacing(0.5),
                    height: "30px",
                    width: "30px",
                    color: theme.palette.text.primary,
                    "&:hover": {
                      color: theme.palette.secondary.main,
                    },
                  }}
                >
                  <Toc
                    color="inherit"
                    sx={{
                      border: "2px solid",
                      borderRadius: "2.5px",
                      height: "24px",
                      width: "24px",
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
              />
            )}

            <RWebShare
              data={{
                text: 'Check out this blog post: "' + post.title + '"!',
                url: window.location.href,
                title: "Link to blogpost",
              }}
            >
              <Tooltip enterDelay={2000} title={"Open settings"}>
                <ButtonBase
                  sx={{
                    height: "30px",
                    width: "30px",
                    color: theme.palette.text.primary,
                    "&:hover": {
                      color: theme.palette.secondary.main,
                    },
                  }}
                >
                  <IosShare
                    color="inherit"
                    sx={{
                      height: "24px",
                      width: "24px",
                    }}
                  />
                </ButtonBase>
              </Tooltip>
            </RWebShare>
          </Box>
          {/* Content */}
          <Grid
            container
            width="100%"
            justifyContent="center"
            sx={{ backgroundColor: theme.palette.primary.main }}
          >
            <Grid item>
              <Helmet>
                <title>{post.title}</title>
                <meta name="theme-color" content={theme.palette.primary.main} />
              </Helmet>
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
                  mt={0}
                  mb={1}
                  pt={isMobile ? 6 : 0}
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
                          opacity: 0.6,
                          marginRight: "6px",
                          fontSize: xs ? "12px" : "default",
                        }}
                      />
                      <Typography
                        fontFamily={theme.typography.fontFamily}
                        variant="body2"
                        fontWeight="600"
                        sx={{ opacity: 0.6, fontSize: xs ? "13px" : "default" }}
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
                          opacity: 0.6,
                          marginLeft: "16px",
                          marginRight: "6px",
                          fontSize: xs ? "13px" : "default",
                        }}
                      />
                      <Typography
                        fontFamily={theme.typography.fontFamily}
                        variant="body2"
                        fontWeight="600"
                        sx={{ opacity: 0.6, fontSize: xs ? "13px" : "default" }}
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
                    <img src={ClappingHands} width="30px" />
                  </IconButton>
                </Box>
              </Stack>
              {/* Buttons for administration */}
              {process.env.REACT_APP_MANAGE_POSTS_AVAILABLE === "true" ? (
                <Box
                  onClick={() => {
                    handleNavigate("/create/" + params.postId);
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
                    <Typography
                      variant="button"
                      color={theme.palette.text.primary}
                    >
                      Update
                    </Typography>
                  </Button>
                </Box>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
      <Footer />
    </Box>
  );
};
export default ReadArticleView;
