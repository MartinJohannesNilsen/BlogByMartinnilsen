import React, { FC, useState, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  Stack,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import TinderCard from "react-tinder-card";
import ClearIcon from "@mui/icons-material/Clear";
import { BiCopy } from "react-icons/bi";
import LaunchIcon from "@mui/icons-material/Launch";
import ReplayIcon from "@mui/icons-material/Replay";
import { useSnackbar } from "notistack";
import { useTheme } from "../../ThemeProvider";
import { StoredPost } from "../../types";
import LandingPageSwipeCard from "../Cards/LandingPageSwipeCard";

export type directionType = "left" | "right" | "up" | "down";
export type TinderSwipeType = {
  posts: StoredPost[];
};

const TinderSwipe: FC<TinderSwipeType> = (props) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const md = useMediaQuery(theme.breakpoints.only("md"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  // Tindercard
  const [currentIndex, setCurrentIndex] = useState(props.posts.length - 1);
  // const [lastDirection, setLastDirection] = useState<directionType>();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);
  const childRefs: any = useMemo(
    () =>
      Array(props.posts.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < props.posts.length - 1;
  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (
    direction: directionType,
    index: number,
    post: StoredPost
  ) => {
    // console.log(`${title} (${index}) swiped to the ${direction}`, currentIndexRef.current);
    // setLastDirection(direction);
    if (currentIndexRef.current >= index) {
      handleAction(direction, post);
    }
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name: string, idx: number) => {
    // console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()!;
  };

  const swipe = async (dir: directionType) => {
    if (canSwipe && currentIndex < props.posts.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // Snackbar
  const { enqueueSnackbar } = useSnackbar();

  // Actions
  // Go back
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard()!;
  };

  const copyToClipboard = async (link: string) => {
    if (!navigator.clipboard) {
      return Promise.reject("Clipboard not supported!");
    }

    try {
      await navigator.clipboard.writeText(link);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleAction = (dir: directionType, post: StoredPost) => {
    if (dir === "up") {
      copyToClipboard(process.env.NEXT_PUBLIC_WEBSITE_URL + "/posts/" + post.id)
        .then(() => {
          enqueueSnackbar("Link copied to clipboard!", {
            variant: "default",
            preventDuplicate: true,
          });
        })
        .catch((error) => {
          console.error(error);
          enqueueSnackbar("Unable to copy to clipboard!", {
            variant: "error",
            preventDuplicate: true,
          });
        });
    } else if (dir === "right") {
      window.location.href = "/posts/" + post.id;
    }
  };

  return (
    <Box
      height="100%"
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // overflow: "hidden",
      }}
    >
      <Box
        justifyContent="center"
        sx={{
          display: "grid",
          justifyItems: "center",
          alignItems: "center",
          gridTemplateColumns: "repeat(1)",
          gridTemplateAreas: `'card'`,
        }}
      >
        {props.posts.map((data, index) => (
          <TinderCard
            preventSwipe={["down", "up"]}
            flickOnSwipe
            swipeRequirementType="position"
            swipeThreshold={100}
            ref={childRefs[index]}
            className={"tinderCard tinderCards"}
            key={index}
            onSwipe={(dir: directionType) => {}}
            onCardLeftScreen={(dir: directionType) => {
              swiped(dir, index, data);
              outOfFrame(data.title, index);
            }}
          >
            {data ? (
              <LandingPageSwipeCard
                author={data.author}
                readTime={data.readTime}
                id={data.id}
                icon={data.icon}
                image={data.image}
                title={data.title}
                timestamp={data.timestamp}
                description={data.description}
                type={data.type}
                tags={data.tags}
                published={data.published}
              />
            ) : null}
          </TinderCard>
        ))}
        {/* Final message */}
        <Card
          className="tinderCard"
          sx={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            boxShadow: "none",
            zIndex: 0,
          }}
        >
          <CardContent>
            <Typography
              fontFamily={theme.typography.fontFamily}
              variant="subtitle2"
              color="textPrimary"
              sx={{
                opacity: "0.4",
              }}
            >
              No more posts, but maybe you want to look through them one more
              time?
            </Typography>
            <Typography
              fontFamily={theme.typography.fontFamily}
              variant="subtitle2"
              color="textPrimary"
              sx={{
                opacity: "0.4",
              }}
            >
              (Press the yellow button)
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flexGrow={1} />
      {/* Buttonstack */}
      <Box>
        <Stack direction="row" spacing={1.2} justifyContent="center">
          <IconButton
            aria-label="clear"
            disabled={!canSwipe}
            sx={{
              border: "2px solid",
              borderColor: "#fd5c63",
              color: "#FFF",
              backgroundColor: "#fd5c63",
              boxShadow:
                theme.palette.mode === "light"
                  ? "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                  : "none",
              "&:disabled": {
                opacity: 0.5,
                border: "2px solid",
                borderColor: "grey",
                backgroundColor: "grey",
              },
              "&:hover": {
                backgroundColor: "#fd858a",
                borderColor: "#fd858a",
              },
            }}
            onClick={() => swipe("left")}
          >
            <ClearIcon />
          </IconButton>
          <IconButton
            aria-label="undo"
            disabled={!canGoBack}
            sx={{
              border: "2px solid",
              borderColor: "#ffdf00",
              color: "#FFF",
              backgroundColor: "#ffdf00",
              boxShadow:
                theme.palette.mode === "light"
                  ? "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                  : "none",
              "&:disabled": {
                opacity: 0.5,
                border: "2px solid",
                borderColor: "grey",
                backgroundColor: "grey",
              },
              "&:hover": {
                backgroundColor: "#ffe740",
                borderColor: "#ffe740",
              },
            }}
            onClick={() => goBack()}
          >
            <ReplayIcon />
          </IconButton>
          <IconButton
            aria-label="copy"
            disabled={!canSwipe}
            sx={{
              border: "2px solid",
              borderColor: "#2196F3",
              color: "#FFF",
              backgroundColor: "#2196F3",
              boxShadow:
                theme.palette.mode === "light"
                  ? "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                  : "none",
              "&:disabled": {
                opacity: 0.5,
                border: "2px solid",
                borderColor: "grey",
                backgroundColor: "grey",
              },
              "&:hover": {
                backgroundColor: "#58b0f6",
                borderColor: "#58b0f6",
              },
            }}
            onClick={() => {
              swipe("up");
            }}
          >
            {/* <ContentCopyIcon /> */}
            {/* <CopyAll /> */}
            <BiCopy />
          </IconButton>
          <IconButton
            aria-label="launch"
            disabled={!canSwipe}
            sx={{
              border: "2px solid",
              borderColor: "#00e676",
              color: "#FFF",
              backgroundColor: "#00e676",
              boxShadow:
                theme.palette.mode === "light"
                  ? "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                  : "none",
              "&:disabled": {
                opacity: 0.5,
                border: "2px solid",
                borderColor: "grey",
                backgroundColor: "grey",
              },
              "&:hover": {
                backgroundColor: "#2dff99",
                borderColor: "#2dff99",
              },
            }}
            onClick={() => {
              //Open new page in new tab
              swipe("right");
            }}
          >
            <LaunchIcon />
          </IconButton>
        </Stack>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );
};
export default TinderSwipe;
