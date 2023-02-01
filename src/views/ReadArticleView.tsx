import { FC, useCallback, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Stack,
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
import { IosShare } from "@mui/icons-material";
import { RWebShare } from "react-web-share";
import { Helmet } from "react-helmet";
import DOMPurify from "dompurify";
import ClappingHands from "../assets/img/clapping-hands.png";
import AvatarMJN from "../assets/img/ProfileCutoutSquare.png";

// Components
import CustomDelimiter from "../components/EditorJS/Renderers/CustomDelimiter";
import CustomImage from "../components/EditorJS/Renderers/CustomImage";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CustomLinkTool from "../components/EditorJS/Renderers/CustomLinkTool";
import ConfettiExplosion from "react-confetti-explosion";
import useWindowSize from "react-use/lib/useWindowSize";
import CustomQuote from "../components/EditorJS/Renderers/CustomQuote";
import CustomTable from "../components/EditorJS/Renderers/CustomTable";
import CustomPersonality from "../components/EditorJS/Renderers/CustomPersonality";
import CustomParagraph from "../components/EditorJS/Renderers/CustomParagraph";
import CustomWarning from "../components/EditorJS/Renderers/CustomWarning";
import CustomVideo from "../components/EditorJS/Renderers/CustomVideo";
import CustomChecklist from "../components/EditorJS/Renderers/CustomChecklist";
import CustomCode from "../components/EditorJS/Renderers/CustomCode";
import CustomMath from "../components/EditorJS/Renderers/CustomMath";
import { isMobile } from "react-device-detect";

// function extractContent(html: any) {
//   return new DOMParser().parseFromString(html, "text/html").documentElement
//     .textContent;
// }

function extractContent(html: string) {
  return html.replace(/<[^>]+>/g, " ");
}

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

  const ReadingTime = useMemo(() => {
    const text = extractContent(renderToString(OutputElement));
    return readingTime(text, 275);
  }, [OutputElement]);

  return (
    <Grid
      container
      width="100vw"
      justifyContent="center"
      sx={{ backgroundColor: theme.palette.primary.main }}
    >
      {isLoading ? (
        <></>
      ) : !fetchedPost ? (
        <Navigate to="/" />
      ) : (
        <Grid item>
          {/* {console.log(post.data)} */}
          <Helmet>
            <title>{post.title}</title>
          </Helmet>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            justifyItems="center"
            width="100%"
            pt={isMobile ? 10 : 2}
            pb={isMobile ? 0.5 : 2}
            position={isMobile ? "fixed" : "relative"}
            sx={{
              top: 0,
              left: 0,
              backgroundColor: theme.palette.primary.main,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              zIndex: 10000,
              marginTop: isMobile ? "-75px" : "0",
              paddingX: isMobile ? "5%" : "0",
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
              <Box ml={-5} display="flex">
                <Avatar
                  alt="Author profile image"
                  sx={{
                    width: "28px",
                    height: "28px",
                    margin: "0 16px 0 16px",
                  }}
                  src={AvatarMJN}
                />
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
                  {post.author}
                </Typography>
              </Box>
            )}
            <Box flexGrow={100} />
            <RWebShare
              data={{
                text: 'Check out this blog post: "' + post.title + '"!',
                url: window.location.href,
                title: "Link to blogpost",
              }}
            >
              <IconButton sx={{ color: "text.primary" }}>
                <IosShare color="inherit" sx={{ fontSize: "25px" }} />
              </IconButton>
            </RWebShare>
          </Box>
          <Stack
            p={2}
            sx={{
              minHeight: "calc(100vh - 120px)",
              width: xs ? "380px" : sm ? "500px" : "700px",
              position: "relative",
            }}
          >
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
            <Box
              mb={1}
              sx={{
                backgroundColor: "transparent",
              }}
            >
              {OutputElement}
            </Box>
            <Box
              my={8}
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
                    force={0.5}
                    duration={4000}
                    particleCount={200}
                    height={height - 30}
                    width={width - 30}
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
                <Typography variant="button" color={theme.palette.text.primary}>
                  Update
                </Typography>
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Grid>
      )}
      <Footer />
    </Grid>
  );
};
export default ReadArticleView;
