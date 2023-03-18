import { OutputData } from "@editorjs/editorjs";
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
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useTheme } from "../../ThemeProvider";
import {
  addPostsOverview,
  deletePostsOverview,
  updatePostsOverview,
} from "../../database/overview";
import { addPost, deletePost, updatePost } from "../../database/posts";
import { addTag, getTags } from "../../database/tags";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { ManageArticleViewProps, FullPost } from "../../types";
import { useSnackbar } from "notistack";
import { Delete, Launch, Save, Update } from "@mui/icons-material";
import Output from "editorjs-react-renderer";
import { renderToStaticMarkup } from "react-dom/server";
import { readingTime } from "reading-time-estimator";
import { renderers } from "../../pages/posts/[postId]";
let EditorBlock;
if (typeof window !== "undefined") {
  EditorBlock = dynamic(() => import("../EditorJS/EditorJS"));
}

const OGDEFAULTS = {
  titleOptimal: 55,
  titleMax: 60,
  descriptionOptimal: 55,
  descriptionWarning: 60,
  descriptionMax: 160,
};

const revalidatePages = async (pages: string[]) => {
  try {
    const responses = await Promise.all(
      pages.map((page) => {
        return fetch(
          "/api/revalidate?secret=" +
            process.env.NEXT_PUBLIC_REVALIDATION_AUTH_TOKEN +
            "&path=" +
            page,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
      })
    );
    const res: {
      status: number;
      requests: {
        status: number;
        path: string;
        revalidated: boolean;
      }[];
    } = { status: 200, requests: [] };
    responses.map((response) => {
      if (response.status !== 200) {
        res.status = response.status;
      }
      res.requests.push({
        status: response.status,
        path: new URL(response.url).searchParams.get("path"),
        revalidated: response.status === 200,
      });
    });
    return res;
  } catch (error) {
    console.log(error);
  }
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
  const [isRevalidated, setIsRevalidated] = useState<boolean>(false);
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
  const [data, setData] = useState<FullPost>({
    published: false,
    type: "",
    tags: [],
    title: "",
    description: "",
    icon: "",
    image: "",
    data: { blocks: [] },
    author: "Martin Johannes Nilsen",
    timestamp: Date.now(),
    readTime: "",
  });
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
    setIsRevalidated(false);
    return () => {};
  }, [editorJSContent]);

  // Width
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const width = xs ? "380px" : sm ? "500px" : "700px";

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setIsPosted(false);
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  function extractTextContent(html: string) {
    return html.replace(/<[^>]+>/g, " ");
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    try {
      event.preventDefault();
      if (!isPosted) {
        // Get read time
        const html = renderToStaticMarkup(
          <Output renderers={renderers} data={data.data} />
        );
        const text = extractTextContent(html);
        // const readTime = readingTime(text, 275).text;
        // const readTime = "<" + Math.max(readingTime(text, 275).minutes, 1) + " min read";
        const readTime =
          Math.max(readingTime(text, 275).minutes, 1) + " min read";

        // Create object
        const newObject = {
          ...data,
          data: editorJSContent,
          readTime: readTime,
        };

        // Check if post exists, then update, or add new
        if (props.post) {
          updatePost(postId, newObject).then((postWasUpdated) => {
            if (postWasUpdated) {
              const key = enqueueSnackbar("Saving changes ...", {
                variant: "default",
                preventDuplicate: true,
                onClick: () => {
                  closeSnackbar(key);
                },
              });
              updatePostsOverview({
                id: postId,
                title: newObject.title,
                description: newObject.description,
                icon: newObject.icon,
                image: newObject.image,
                published: newObject.published,
                timestamp: newObject.timestamp,
                type: newObject.type,
                tags: newObject.tags,
                author: newObject.author,
                readTime: newObject.readTime,
              }).then((overviewWasUpdated) => {
                if (overviewWasUpdated) {
                  const key = enqueueSnackbar("Your changes are saved!", {
                    variant: "success",
                    preventDuplicate: true,
                    onClick: () => {
                      closeSnackbar(key);
                    },
                  });
                  setIsPosted(true);
                } else {
                  const key = enqueueSnackbar("An error occurred!", {
                    variant: "error",
                    preventDuplicate: true,
                    onClick: () => {
                      closeSnackbar(key);
                    },
                  });
                }
              });
            }
          });
        } else {
          addPost(newObject).then((postId) => {
            if (postId) {
              const key = enqueueSnackbar("Creating post ...", {
                variant: "default",
                preventDuplicate: true,
                onClick: () => {
                  closeSnackbar(key);
                },
              });
              addPostsOverview({
                id: postId,
                title: newObject.title,
                description: newObject.description,
                icon: newObject.icon,
                image: newObject.image,
                published: newObject.published,
                timestamp: newObject.timestamp,
                type: newObject.type,
                tags: newObject.tags,
                author: newObject.author,
                readTime: newObject.readTime,
              }).then((overviewWasAdded) => {
                if (overviewWasAdded) {
                  const key = enqueueSnackbar("Successfully created post!", {
                    variant: "success",
                    preventDuplicate: true,
                    onClick: () => {
                      closeSnackbar(key);
                    },
                  });
                  setPostId(postId);
                  setIsPosted(true);
                } else {
                  const key = enqueueSnackbar("An error occurred!", {
                    variant: "error",
                    preventDuplicate: true,
                    onClick: () => {
                      closeSnackbar(key);
                    },
                  });
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
    handleDeleteDialogClose();
    const key = enqueueSnackbar("Deleting post ...", {
      variant: "default",
      preventDuplicate: true,
      onClick: () => {
        closeSnackbar(key);
      },
    });
    deletePost(postId).then((postWasDeleted) => {
      if (postWasDeleted) {
        deletePostsOverview(postId).then((overviewWasUpdated) => {
          if (overviewWasUpdated) {
            const key = enqueueSnackbar("Successfully deleted post!", {
              variant: "success",
              preventDuplicate: true,
              onClick: () => {
                closeSnackbar(key);
              },
            });
            revalidatePages(["/", "/posts/" + postId]).then((res) => {
              handleNavigate("/");
            });
          } else {
            const key = enqueueSnackbar("An error occured ...", {
              variant: "error",
              preventDuplicate: true,
              onClick: () => {
                closeSnackbar(key);
              },
            });
          }
        });
      } else {
        const key = enqueueSnackbar("An error occured ...", {
          variant: "error",
          preventDuplicate: true,
          onClick: () => {
            closeSnackbar(key);
          },
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

  // TODO implement useHotKeys onSubmit. Now it gives empty object. Make sure to validate form and save non-empty object
  // useHotkeys(["Control+s", "Meta+s"], (event) => {
  //   event.preventDefault();
  //   handleSubmit(event);
  // });

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
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
                {!xs ? (
                  <Link
                    fontFamily={theme.typography.fontFamily}
                    variant="body1"
                    fontWeight="900"
                    sx={{
                      textDecoration: "none",
                      color: theme.palette.text.primary,
                      "&:hover": {
                        cursor: "pointer",
                        color: theme.palette.secondary.main,
                      },
                    }}
                    href={"/"}
                  >
                    ← Home
                  </Link>
                ) : (
                  <Box sx={{ minHeight: "40px" }} />
                )}
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
                inputProps={{
                  maxlength: OGDEFAULTS.titleMax,
                }}
                helperText={`${data.title.length}/${OGDEFAULTS.titleMax}`}
                sx={{
                  ".MuiFormHelperText-root": {
                    color:
                      data.title.length <= OGDEFAULTS.titleOptimal
                        ? "green"
                        : "#cfa602",
                  },
                }}
                value={data.title}
                onChange={handleInputChange}
              />
              <StyledTextField
                label="Description"
                name="description"
                fullWidth
                inputProps={{
                  maxlength: OGDEFAULTS.descriptionMax,
                }}
                helperText={`${data.description.length}/${OGDEFAULTS.descriptionMax}`}
                sx={{
                  ".MuiFormHelperText-root": {
                    color:
                      data.description.length <= OGDEFAULTS.descriptionOptimal
                        ? "green"
                        : data.description.length <=
                          OGDEFAULTS.descriptionWarning
                        ? theme.palette.text.primary
                        : "#cfa602",
                  },
                }}
                value={data.description}
                onChange={handleInputChange}
              />
              <StyledTextField
                label="Icon"
                name="icon"
                error={
                  data.icon &&
                  data.icon.trim() !== "" &&
                  !isvalidHTTPUrl(data.icon)
                }
                helperText={"Incorrect url format (missing http/https)"}
                required
                fullWidth
                value={data.icon}
                onChange={handleInputChange}
              />
              <StyledTextField
                label="Open Graph Image"
                name="image"
                error={
                  data.image &&
                  data.image.trim() !== "" &&
                  !isvalidHTTPUrl(data.image)
                }
                helperText={"Incorrect url format (missing http/https)"}
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
                sx={
                  xs
                    ? { position: "fixed", left: 25, top: 25, zIndex: 100 }
                    : { position: "fixed", left: 25, bottom: 25, zIndex: 100 }
                }
              >
                {/* Submit button */}
                <Tooltip enterDelay={2000} title="Save changes" placement="top">
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
                    <Save
                      sx={{
                        color: isPosted ? "green" : theme.palette.text.primary,
                      }}
                    />
                  </Button>
                </Tooltip>
                {/* Revalidate button */}
                {isPosted ? (
                  <Tooltip
                    enterDelay={2000}
                    title="Revalidate pages"
                    placement="top"
                  >
                    <Button
                      onClick={() => {
                        const key = enqueueSnackbar("Revalidating pages ...", {
                          variant: "default",
                          preventDuplicate: true,
                          onClick: () => {
                            closeSnackbar(key);
                          },
                        });
                        revalidatePages(["/", "/posts/" + postId]).then(
                          (res) => {
                            if (res.status === 200) {
                              const key = enqueueSnackbar(
                                "Revalidated pages!",
                                {
                                  variant: "success",
                                  preventDuplicate: true,
                                  onClick: () => {
                                    closeSnackbar(key);
                                  },
                                }
                              );
                              setIsRevalidated(true);
                            } else {
                              const key = enqueueSnackbar(
                                "Error during revalidation!",
                                {
                                  variant: "error",
                                  preventDuplicate: true,
                                  onClick: () => {
                                    closeSnackbar(key);
                                  },
                                }
                              );
                            }
                          }
                        );
                      }}
                      disabled={isRevalidated}
                      sx={{
                        border: isRevalidated
                          ? "2px solid green"
                          : "2px solid " + theme.palette.text.primary,
                        zIndex: 2,
                        backgroundColor: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      <Update
                        sx={{
                          color: isRevalidated
                            ? "green"
                            : theme.palette.text.primary,
                        }}
                      />
                    </Button>
                  </Tooltip>
                ) : (
                  <></>
                )}
                {/* View button */}
                {isPosted && isRevalidated ? (
                  <Tooltip enterDelay={2000} title="View post" placement="top">
                    <Button
                      onClick={() => {
                        handleNavigate(`/posts/${postId}`);
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
                      <Launch
                        sx={{
                          color: theme.palette.text.primary,
                        }}
                      />
                    </Button>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </Box>
              <Box
                display="flex"
                gap="10px"
                sx={
                  xs
                    ? { position: "fixed", right: 25, top: 25, zIndex: 100 }
                    : { position: "fixed", right: 25, bottom: 25, zIndex: 100 }
                }
              >
                {props.post ? (
                  <>
                    <Tooltip
                      enterDelay={2000}
                      title="Delete post"
                      placement="top"
                    >
                      <Button
                        onClick={handleDeleteDialogOpen}
                        sx={{
                          border: "2px solid red",
                          index: 2,
                          backgroundColor: theme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        <Delete
                          sx={{
                            color: "red",
                          }}
                        />
                      </Button>
                    </Tooltip>
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
