import { KeyboardReturn } from "@mui/icons-material";
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
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { SearchModalProps, StoredPost } from "../../types";
import { DEFAULT_OGIMAGE } from "../SEO/SEO";

export const SearchModal = (props: SearchModalProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const router = useRouter();
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };
  const [textFieldValue, setTextFieldValue] = useState("");
  const [maxNumberOfItems, setMaxNumberOfItems] = useState(0);
  const [matchedItems, setMatchedItems] = useState<StoredPost[]>([]);
  const [activeItem, setActiveItem] = useState(isMobile ? -1 : 0);

  // Filter/search
  useEffect(() => {
    if (textFieldValue === "") {
      setMatchedItems([]);
      setMaxNumberOfItems(0);
    } else {
      const bestMatch = matchSorter(props.postsOverview!, textFieldValue, {
        keys: ["title", "description"],
      });
      const min = Math.min(
        bestMatch.length,
        Number(process.env.NEXT_PUBLIC_SEARCH_MAX_RESULTS)
      );
      setMatchedItems(bestMatch.slice(0, min));
      setMaxNumberOfItems(min);
    }
    return () => {};
  }, [textFieldValue]);

  // Hotkeys
  useHotkeys(["Control+k", "Meta+k"], (event) => {
    event.preventDefault();
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
      handleNavigate(`/posts/${matchedItems![activeItem].id}`);
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
            width: xs ? 370 : lgUp ? 700 : 550,
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
                placeholder={"What are you looking for?"}
                size="small"
                autoComplete="off"
                value={textFieldValue}
                InputProps={{
                  disableUnderline: true,
                }}
                inputProps={{
                  style: {
                    fontFamily: theme.typography.fontFamily,
                    fontSize: xs ? 22 : 30,
                    fontWeight: 400,
                    padding: "4px 12px",
                  },
                }}
                sx={{ paddingBottom: 0 }}
                InputLabelProps={{ style: { fontSize: xs ? 22 : 30 } }}
                onKeyDown={(e) => {
                  if (
                    (e.metaKey && e.key === "k") ||
                    (e.ctrlKey && e.key === "k")
                  ) {
                    e.preventDefault();
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
                    handleNavigate(`/posts/${matchedItems![activeItem].id}`);
                  }
                }}
                onChange={(e) => {
                  setTextFieldValue(e.target.value);
                }}
              />
            </Box>
            {props.postsOverview && (
              <List sx={{ paddingY: 0 }}>
                {matchedItems!.map((post: StoredPost, index: number) => (
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
                        if (isMobile) setActiveItem(-1);
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            marginRight: "12px",
                            borderRadius: "5px",
                            minWidth: xs ? "70px" : "124px",
                            minHeight: xs ? "50px" : "70px",
                            background: "transparent",
                          }}
                        >
                          <img
                            src={post.image || DEFAULT_OGIMAGE}
                            alt={
                              'OpenGraph image for article titled "' +
                              post.title +
                              '"'
                            }
                            style={{
                              minWidth: "125px",
                              minHeight: "82px",
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
                        secondary={post.description}
                        secondaryTypographyProps={{
                          color: theme.palette.text.primary,
                          fontFamily: theme.typography.fontFamily,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        sx={{
                          width: "100%",
                          marginRight: isMobile ? 0 : 5,
                        }}
                      />
                      {!isMobile ? (
                        <>
                          <Box flexGrow={100} />
                          <ListItemText>
                            <KeyboardReturn
                              sx={{
                                color: theme.palette.text.primary,
                                position: "absolute",
                                top: "55%",
                                right: "5px",
                                transform: "translate(-50%, -50%)",
                                display:
                                  activeItem === index
                                    ? "inline-block"
                                    : "none",
                              }}
                            />
                          </ListItemText>
                        </>
                      ) : null}
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
