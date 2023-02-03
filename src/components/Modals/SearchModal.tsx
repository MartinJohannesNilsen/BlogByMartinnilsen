import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "../../ThemeProvider";
import { SearchModalProps, SimplifiedPost } from "../../types";
import { useHotkeys } from "react-hotkeys-hook";
import { useCallback, useEffect, useState } from "react";
import { matchSorter } from "match-sorter";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

export const SearchModal = (props: SearchModalProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  // Navigation
  const navigate = useNavigate();
  const handleNavigate = useCallback(
    (path) => {
      navigate(path, { replace: true });
      location.reload();
    },
    [navigate]
  );
  const [textFieldValue, setTextFieldValue] = useState("");
  const [maxNumberOfItems, setMaxNumberOfItems] = useState(5);
  const [matchedItems, setMatchedItems] = useState(
    props.postsOverview?.slice(0, maxNumberOfItems)
  );
  const [activeItem, setActiveItem] = useState(isMobile ? -1 : 0);

  // Filter/search
  useEffect(() => {
    const bestMatch = matchSorter(props.postsOverview!, textFieldValue, {
      keys: ["title", "summary"],
    });
    const min = Math.min(bestMatch.length, 5);
    setMatchedItems(bestMatch.slice(0, min));
    setMaxNumberOfItems(min);
    return () => {};
  }, [textFieldValue]);

  // Hotkeys
  useHotkeys(["Control+k", "Meta+k"], () => {
    props.handleModalClose();
  });
  useHotkeys(
    "ArrowUp",
    () => {
      setActiveItem(Math.max(0, activeItem - 1));
    },
    [activeItem]
  );
  useHotkeys(
    "ArrowDown",
    () => {
      setActiveItem(Math.min(maxNumberOfItems - 1, activeItem + 1));
    },
    [activeItem]
  );
  useHotkeys(
    "Enter",
    () => {
      props.handleModalClose();
      setTextFieldValue("");
      // window.location.href = `${window.location.href}posts/${
      //   matchedItems![activeItem].id
      // }`;
      handleNavigate(`posts/${matchedItems![activeItem].id}`);
    },
    [activeItem]
  );

  const modalStyle = {
    bgcolor: "background.paper",
    borderRadius: 2,
    display: "flex",
    textAlign: "left",
    flexDirection: "column",
    rowGap: "5px",
    justifyContent: "flex-start",
    boxShadow: 24,
    p: 1,
    outline: 0,
  };

  return (
    <Box>
      <Modal
        open={props.open}
        onClose={props.handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus
      >
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: xs ? 380 : 500,
            height: "450px",
            outline: 0,
          }}
        >
          <Box sx={modalStyle}>
            <Box>
              <TextField
                variant="filled"
                fullWidth
                autoFocus
                placeholder="Search..."
                size="small"
                autoComplete="off"
                value={textFieldValue}
                InputProps={{
                  disableUnderline: true,
                }}
                inputProps={{
                  style: {
                    fontFamily: theme.typography.fontFamily,
                    fontSize: 30,
                    fontWeight: 400,
                    padding: "4px 12px",
                  },
                }}
                sx={{ paddingBottom: 0 }}
                InputLabelProps={{ style: { fontSize: 30 } }}
                onKeyDown={(e) => {
                  if (
                    (e.metaKey && e.key === "k") ||
                    (e.ctrlKey && e.key === "k")
                  ) {
                    props.handleModalClose();
                  } else if (e.key === "ArrowUp") {
                    setActiveItem(Math.max(0, activeItem - 1));
                  } else if (e.key === "ArrowDown") {
                    setActiveItem(
                      Math.min(maxNumberOfItems - 1, activeItem + 1)
                    );
                  } else if (e.key === "Enter") {
                    props.handleModalClose();
                    setTextFieldValue("");
                    // window.location.href = `${window.location.href}posts/${
                    //   matchedItems![activeItem].id
                    // }`;
                    handleNavigate(`posts/${matchedItems![activeItem].id}`);
                  }
                }}
                onChange={(e) => {
                  setTextFieldValue(e.target.value);
                }}
              />
            </Box>
            {props.postsOverview && (
              <List sx={{ paddingY: 0 }}>
                {matchedItems!.map((post: SimplifiedPost, index: number) => (
                  <ListItem
                    key={index}
                    sx={{
                      padding: "2px 0px 2px 0px",
                    }}
                  >
                    <ListItemButton
                      selected={activeItem === index}
                      onMouseOver={() => {
                        setActiveItem(index);
                      }}
                      sx={{
                        paddingLeft: "8px",
                        "&.Mui-selected": {
                          backgroundColor:
                            activeItem === index
                              ? theme.palette.mode === "dark"
                                ? "#2B2B2B"
                                : "#F6F6F6"
                              : "transparent",
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor:
                            activeItem === index
                              ? theme.palette.mode === "dark"
                                ? "#2B2B2B"
                                : "#F6F6F6"
                              : "transparent",
                        },
                        "&.Mui-focusVisible": {
                          backgroundColor:
                            activeItem === index
                              ? theme.palette.mode === "dark"
                                ? "#2B2B2B"
                                : "#F6F6F6"
                              : "transparent",
                        },
                        ":hover": {
                          backgroundColor:
                            activeItem === index
                              ? theme.palette.mode === "dark"
                                ? "#2B2B2B"
                                : "#F6F6F6"
                              : "transparent",
                        },
                      }}
                      component="a"
                      href={`/posts/${post.id}`}
                      onClick={() => {
                        props.handleModalClose();
                        setTextFieldValue("");
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            marginRight: "10px",
                            borderRadius: "5px",
                            minWidth: "50px",
                            minHeight: "50px",
                          }}
                        >
                          <img
                            src={post.img}
                            style={{
                              minWidth: "50px",
                              minHeight: "50px",
                              objectFit: "cover",
                            }}
                          />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={post.title}
                        primaryTypographyProps={{
                          color: theme.palette.text.primary,
                          fontFamily: theme.typography.fontFamily,
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        // secondary={`${window.location.href}posts/${post.id}`}
                        secondary={post.summary}
                        secondaryTypographyProps={{
                          color: theme.palette.text.primary,
                          fontFamily: theme.typography.fontFamily,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        sx={{
                          width: "100%",
                          marginRight: 6,
                        }}
                      />
                      <Box flexGrow={100} />
                      <ListItemText>
                        <Typography
                          sx={{
                            position: "absolute",
                            top: "55%",
                            right: "10px",
                            transform: "translate(-50%, -50%)",
                          }}
                          fontFamily={theme.typography.fontFamily}
                          fontWeight={600}
                        >
                          {/* {activeItem === index ? "↩" : `⌘${index + 1}`} */}
                          {activeItem === index ? "↩" : ""}
                        </Typography>
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default SearchModal;
