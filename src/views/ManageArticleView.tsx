import { FC, useCallback, useEffect, useRef, useState } from "react";
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
import { useTheme } from "../ThemeProvider";
import { addPost, deletePost, updatePost } from "../database/posts";
import { EditorJSDocument, ManageArticleViewProps, Post } from "../types";
import { withStyles } from "@mui/styles";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "../components/EditorJS/tools";
import { ThemeEnum } from "../themes/themeMap";
import colorLumincance from "../utils/colorLuminance";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { postQuery } from "./ReadArticleView";
import CreatableSelect from "react-select/creatable";
import { addTag, getTags } from "../database/tags";

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

const ManageArticleView: FC<ManageArticleViewProps> = (props) => {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(props.fetch);
  const [isPosted, setIsPosted] = useState<boolean>(false);
  const [tagOptions, setTagOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [editorJSContent, setEditorJSContent] = useState<EditorJSDocument>({
    blocks: [],
  });
  const [data, setData] = useState<Post>({
    published: false,
    type: "",
    tags: [],
    title: "",
    summary: "",
    image: "http://www.",
    data: { blocks: [] },
    author: "Martin J. Nilsen",
    timestamp: Date.now(),
    views: 0,
  });
  const navigate = useNavigate();
  const handleNavigate = useCallback(
    (path) => {
      navigate(path, { replace: true });
      location.reload();
    },
    [navigate]
  );

  // Update or delete
  const params = useParams();
  const initialData = useLoaderData();
  const { data: fetchedPost } = props.fetch
    ? useQuery({
        ...postQuery(params.postId!),
        initialData,
      })
    : { data: null };

  useEffect(() => {
    setTheme(ThemeEnum.Light);
    getTags()
      .then((val) => {
        const array: { value: string; label: string }[] = val.map((item) => ({
          value: item,
          label: item,
        }));
        setTagOptions(array);
        // console.log(val);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (props.fetch) {
      if (fetchedPost === null) {
        handleNavigate("/");
      } else if (fetchedPost === undefined) {
      } else {
        const post = fetchedPost as Post;
        setData(post);
        setEditorJSContent(post.data);
        setIsLoading(false);
      }
    }
    return () => {};
  }, [fetchedPost]);

  const editorCore: any = useRef();
  const handleInitialize = useCallback((instance) => {
    editorCore.current = instance;
  }, []);
  const handleSave = useCallback(async () => {
    const savedData = await editorCore!.current!.save()!;
    setEditorJSContent(savedData);
    setIsPosted(false);
  }, []);
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
        if (props.fetch) {
          updatePost(params.postId!, newObject).then((val) => {
            if (val) {
              setIsPosted(true);
            }
          });
        } else {
          // console.log(newObject);
          addPost(newObject);
          setIsPosted(true);
        }
      }
    } catch (e) {
      // console.log(e);
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
    deletePost(params.postId!).then((val) => {
      if (val) {
        handleDeleteDialogClose();
        handleNavigate("/");
      }
    });
  };

  const handleCreateTagOption = (inputValue: string) => {
    addTag(inputValue)
      .then((val) => {
        // console.log(val);
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

  const ReactEditorJS = createReactEditorJS();
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
          sx={{ minWidth: "100vw", minHeight: "100vh" }}
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
              <ReactEditorJS
                defaultValue={editorJSContent}
                tools={EDITOR_JS_TOOLS}
                onInitialize={handleInitialize}
                onChange={handleSave}
              />
              <Box
                display="flex"
                gap="10px"
                sx={{ position: "fixed", left: 25, bottom: 25 }}
              >
                <Button
                  type="submit"
                  disabled={isPosted}
                  sx={{
                    border: isPosted
                      ? "2px solid green"
                      : "2px solid " + theme.palette.text.primary,
                    zIndex: 2,
                  }}
                >
                  <Typography
                    variant="button"
                    sx={{
                      color: isPosted ? "green" : theme.palette.text.primary,
                    }}
                  >
                    {isPosted
                      ? props.fetch
                        ? "Updated ✓"
                        : "Posted ✓"
                      : props.fetch
                      ? "Update"
                      : "Post"}
                  </Typography>
                </Button>
                {isPosted ? (
                  <Button
                    onClick={() => {
                      window.location.href = window.location.href.replace(
                        "create",
                        "posts"
                      );
                    }}
                    sx={{
                      border: "2px solid " + theme.palette.text.primary,
                      zIndex: 2,
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
                sx={{ position: "fixed", right: 25, bottom: 25 }}
              >
                {props.fetch ? (
                  <>
                    <Button
                      onClick={handleDeleteDialogOpen}
                      sx={{
                        border: "2px solid red",
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
                          {`Are you sure you want to delete the post "${data.title}" (id: ${params.postId})?`}
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
export default ManageArticleView;
