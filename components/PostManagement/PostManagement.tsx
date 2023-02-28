import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "../../ThemeProvider";
import { addPost, deletePost, getPost, updatePost } from "../../database/posts";
import { ManageArticleViewProps, Post } from "../../types";
import { withStyles } from "@mui/styles";
import { ThemeEnum } from "../../styles/themes/themeMap";
import colorLumincance from "../../utils/colorLuminance";
import CreatableSelect from "react-select/creatable";
import { addTag, getTags } from "../../database/tags";
import {
  addPostsOverview,
  deletePostsOverview,
  updatePostsOverview,
} from "../../database/overview";
import { useRouter } from "next/router";
import { OutputData } from "@editorjs/editorjs";
import dynamic from "next/dynamic";
let EditorBlock;
if (typeof window !== "undefined") {
  EditorBlock = dynamic(() => import("../EditorJS/EditorJS"));
}

const revalidatePages = async (pages: string[]) => {
  const res: string[] = [];
  pages.map((page) => {
    fetch(
      "/api/revalidate?secret=" +
        process.env.NEXT_PUBLIC_REVALIDATION_AUTH_TOKEN +
        "&path=" +
        page,
      {
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.text())
      .then((text) => res.push(page + ": " + text));
  });
  return res;
};

const StyledTextField = withStyles((theme) => ({
  root: {
    "& label": {
      color: "#808080",
    },
    "& label.Mui-focused": {
      color: "#2684FF",
    },
    "& .MuiOutlinedInput-root": {
      borderColor: "#CCCCCC",
      "& fieldset": {
        borderColor: "#CCCCCC",
      },
      "&:hover fieldset": {
        borderColor: "#B3B3B3",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2684FF",
      },
    },
  },
}))(TextField);

export function isvalidHTTPUrl(string: string) {
  let url;
  try {
    url = new URL(string);
  } catch (e) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

const CreatePost: FC<ManageArticleViewProps> = (props) => {
  const { theme, setTheme } = useTheme();
  const [isPosted, setIsPosted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [postId, setPostId] = useState<string>(
    props.post ? (router.query.postId[0] as string) : ""
  );
  const [tagOptions, setTagOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [editorJSContent, setEditorJSContent] = useState<OutputData>(
    props.post ? props.post.data : { blocks: [] }
  );
  const [data, setData] = useState<Post>({
    published: false,
    type: "",
    tags: [],
    title: "",
    summary: "",
    image: "http://www.",
    data: { blocks: [] },
    author: "Martin Johannes Nilsen",
    timestamp: Date.now(),
    views: 0,
    readTime: "",
  });
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  useEffect(() => {
    setTheme(ThemeEnum.Light);
    getTags()
      .then((val) => {
        const array: { value: string; label: string }[] = val.map((item) => ({
          value: item,
          label: item,
        }));
        setTagOptions(array);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (props.post) {
      setData(props.post);
      setEditorJSContent(props.post.data);
      setIsLoading(false);
    }
    setIsLoading(false);
    return () => {};
  }, []);

  useEffect(() => {
    setIsPosted(false);
    return () => {};
  }, [editorJSContent]);

  const width = "700px";

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setIsPosted(false);
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    try {
      event.preventDefault();
      if (!isPosted) {
        const newObject = {
          ...data,
          data: editorJSContent,
        };
        if (props.post) {
          updatePost(postId, newObject).then((postWasUpdated) => {
            if (postWasUpdated) {
              updatePostsOverview({
                id: postId,
                title: newObject.title,
                summary: newObject.summary,
                image: newObject.image,
                published: newObject.published,
                timestamp: newObject.timestamp,
                type: newObject.type,
                tags: newObject.tags,
                author: newObject.author,
                readTime: newObject.readTime,
              }).then((overviewWasUpdated) => {
                if (overviewWasUpdated) {
                  setIsPosted(true);
                  revalidatePages(["/", "/posts/" + postId]);
                }
              });
            }
          });
        } else {
          addPost(newObject).then((postId) => {
            if (postId) {
              addPostsOverview({
                id: postId,
                title: newObject.title,
                summary: newObject.summary,
                image: newObject.image,
                published: newObject.published,
                timestamp: newObject.timestamp,
                type: newObject.type,
                tags: newObject.tags,
                author: newObject.author,
                readTime: newObject.readTime,
              }).then((overviewWasAdded) => {
                if (overviewWasAdded) {
                  setPostId(postId);
                  setIsPosted(true);
                  revalidatePages(["/", "/posts/" + postId]);
                }
              });
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeletePost = () => {
    deletePost(postId).then((postWasDeleted) => {
      if (postWasDeleted) {
        deletePostsOverview(postId).then((overviewWasUpdated) => {
          if (overviewWasUpdated) {
            handleDeleteDialogClose();
            revalidatePages(["/", "/posts/" + postId]);
            setTimeout(() => {
              handleNavigate("/");
            }, 2000);
          }
        });
      }
    });
  };

  const handleCreateTagOption = (inputValue: string) => {
    addTag(inputValue)
      .then((val) => {
        if (val) {
          const newOption = { value: inputValue, label: inputValue };
          setTagOptions((prev) => [...prev, newOption]);
          setData({ ...data, tags: data.tags.concat(newOption.value) });
        }
      })
      .catch((error) => console.log(error));
  };

  const handlePublishedRadioChange = (event: { target: { value: any } }) => {
    setIsPosted(false);
    setData({ ...data, published: event.target.value === "true" });
  };

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          // justifyContent="center"
          alignItems="center"
          sx={{
            minWidth: "100vw",
            minHeight: "100vh",
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box my={1}>
              <Box
                display="flex"
                alignItems="center"
                width={width}
                py={2}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Link
                  fontFamily={theme.typography.fontFamily}
                  variant="body1"
                  fontWeight="900"
                  sx={{
                    textDecoration: "none",
                    color: theme.palette.secondary.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: colorLumincance(
                        theme.palette.secondary.main,
                        0.33
                      ),
                    },
                  }}
                  href={"/"}
                >
                  ← Home
                </Link>
              </Box>
              <Divider />
              <Typography
                my={2.5}
                variant="h4"
                color="textPrimary"
                fontFamily={theme.typography.fontFamily}
              >
                Information
              </Typography>
              <Divider />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              sx={{ width: width }}
              rowGap={3}
            >
              <Box sx={{ zIndex: 5 }}>
                <CreatableSelect
                  isMulti
                  isClearable
                  isSearchable
                  value={data.tags.map((tag) => ({ value: tag, label: tag }))}
                  onChange={(array) => {
                    setData({ ...data, tags: array.map((item) => item.value) });
                  }}
                  onCreateOption={handleCreateTagOption}
                  options={tagOptions}
                />
              </Box>
              <StyledTextField
                label="Type"
                name="type"
                required
                fullWidth
                value={data.type}
                onChange={handleInputChange}
              />
              <StyledTextField
                label="Title"
                name="title"
                required
                fullWidth
                value={data.title}
                onChange={handleInputChange}
              />
              <StyledTextField
                label="Summary"
                name="summary"
                fullWidth
                value={data.summary}
                onChange={handleInputChange}
              />
              <StyledTextField
                label="Image"
                name="image"
                error={!isvalidHTTPUrl(data.image)}
                helperText={"Incorrect url format (missing http/https)"}
                required
                fullWidth
                value={data.image}
                onChange={handleInputChange}
              />
              <RadioGroup
                sx={{ marginTop: theme.spacing(-2) }}
                row
                value={data.published}
                name="published-radio-buttons-group"
                onChange={handlePublishedRadioChange}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Published"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Not published"
                />
              </RadioGroup>
              <Divider />
              <Typography
                variant="h4"
                color="textPrimary"
                fontFamily={theme.typography.fontFamily}
              >
                Article
              </Typography>
              <Divider />
              {EditorBlock && !isLoading ? (
                <EditorBlock
                  data={editorJSContent}
                  onChange={setEditorJSContent}
                  holder="editorjs-container"
                />
              ) : (
                <></>
              )}
              <Box
                display="flex"
                gap="10px"
                sx={{ position: "fixed", left: 25, bottom: 25, zIndex: 100 }}
              >
                <Button
                  type="submit"
                  disabled={isPosted}
                  sx={{
                    border: isPosted
                      ? "2px solid green"
                      : "2px solid " + theme.palette.text.primary,
                    zIndex: 2,
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  <Typography
                    variant="button"
                    sx={{
                      color: isPosted ? "green" : theme.palette.text.primary,
                    }}
                  >
                    {isPosted
                      ? props.post
                        ? "Updated ✓"
                        : "Posted ✓"
                      : props.post
                      ? "Update"
                      : "Post"}
                  </Typography>
                </Button>

                {isPosted ? (
                  <Button
                    onClick={() => {
                      // handleNavigate(`/posts/${postId}`);
                      window.location.href = `/posts/${postId}`;
                    }}
                    sx={{
                      border: "2px solid " + theme.palette.text.primary,
                      zIndex: 2,
                      backgroundColor: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <Typography
                      variant="button"
                      sx={{
                        color: theme.palette.text.primary,
                      }}
                    >
                      View
                    </Typography>
                  </Button>
                ) : (
                  <></>
                )}
              </Box>
              <Box
                display="flex"
                gap="10px"
                sx={{ position: "fixed", right: 25, bottom: 25, zIndex: 100 }}
              >
                {props.post ? (
                  <>
                    <Button
                      onClick={handleDeleteDialogOpen}
                      sx={{
                        border: "2px solid red",
                        backgroundColor: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      <Typography
                        variant="button"
                        sx={{
                          color: "red",
                          zIndex: 2,
                        }}
                      >
                        Delete
                      </Typography>
                    </Button>
                    <Dialog
                      open={deleteDialogOpen}
                      onClose={handleDeleteDialogClose}
                    >
                      <DialogTitle>Delete post</DialogTitle>
                      <DialogContent>
                        <Typography
                          fontFamily={theme.typography.fontFamily}
                          variant="body1"
                          color={theme.palette.text.primary}
                        >
                          {`Are you sure you want to delete the post "${data.title}" (id: ${postId})?`}
                        </Typography>
                      </DialogContent>
                      <DialogActions sx={{ marginRight: theme.spacing(2) }}>
                        <Button
                          onClick={handleDeleteDialogClose}
                          sx={
                            {
                              // border: "2px solid " + theme.palette.text.primary,
                            }
                          }
                        >
                          <Typography
                            fontFamily={theme.typography.fontFamily}
                            variant="button"
                            color={theme.palette.text.primary}
                          >
                            No
                          </Typography>
                        </Button>
                        <Button
                          onClick={handleDeletePost}
                          autoFocus
                          sx={
                            {
                              // border: "2px solid red",
                            }
                          }
                        >
                          <Typography
                            fontFamily={theme.typography.fontFamily}
                            variant="button"
                            color="red"
                          >
                            Yes
                          </Typography>
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
          </form>
        </Box>
      )}
    </>
  );
};
export default CreatePost;
