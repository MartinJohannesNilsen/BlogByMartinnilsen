import { FC, useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "../ThemeProvider";
import { ListViewProps } from "../types";
import { getPaginatedCollection, getPostCount } from "../database/posts";
import { QueryDocumentSnapshot } from "firebase/firestore";
import BlogpostCard from "../components/Cards/BlogpostCard";
import {
  ArrowBackIosNewSharp,
  ArrowForwardIosSharp,
} from "@mui/icons-material";

const ListView: FC<ListViewProps> = (props) => {
  const { theme } = useTheme();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [queryDocumentSnapshots, setQueryDocumentSnapshots] = useState<
    QueryDocumentSnapshot[]
  >([]);
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const postsPerPage = xs ? 3 : 4;

  useEffect(() => {
    // Only show published when not on localhost
    if (process.env.REACT_APP_MANAGE_POSTS_AVAILABLE === "true") {
      getPostCount().then((data) => setCount(data));
      getPaginatedCollection(postsPerPage).then((data) =>
        setQueryDocumentSnapshots(data)
      );
    } else {
      getPostCount({
        key: "published",
        operator: "==",
        value: true,
      }).then((data) => setCount(data));
      getPaginatedCollection(postsPerPage, undefined, undefined, {
        key: "published",
        operator: "==",
        value: true,
      }).then((data) => setQueryDocumentSnapshots(data));
    }
  }, []);

  const handleNextPage = () => {
    const endPage = Math.ceil(count / postsPerPage);
    if (page < endPage) {
      setPage(Math.min(page + 1, endPage));
      getPaginatedCollection(postsPerPage, "next", queryDocumentSnapshots).then(
        (data) => setQueryDocumentSnapshots(data)
      );
    }
  };

  const handlePreviousPage = () => {
    const startPage = 1;
    if (page > startPage) {
      setPage(Math.max(page - 1, startPage));
      getPaginatedCollection(postsPerPage, "prev", queryDocumentSnapshots).then(
        (data) => setQueryDocumentSnapshots(data)
      );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          minHeight: "calc(100vh - 80px)",
          backgroundColor: theme.palette.primary.main,
          position: "relative",
          padding: "0px 0px 25px 0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "left",
        }}
      >
        <Box sx={{ width: "100vw", padding: smDown ? "0px 30px" : "0px 20vw" }}>
          <Typography
            variant="h5"
            color="textPrimary"
            fontFamily={theme.typography.fontFamily}
          >
            Recent posts
          </Typography>
        </Box>
        <Box
          // minHeight={"60vh"}
          mb={2}
          sx={{ padding: smDown ? "10px 30px" : "10px 20vw" }}
        >
          {queryDocumentSnapshots.map((document, index) => {
            const data = document.data();
            const id = document.id;
            return (
              <Box py={2} key={index}>
                <BlogpostCard
                  id={id}
                  image={data.image}
                  title={data.title}
                  timestamp={data.timestamp}
                  summary={data.summary}
                />
              </Box>
            );
          })}
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton
            sx={{
              color: "text.primary",
            }}
            disabled={!(page > 1)}
            onClick={() => handlePreviousPage()}
          >
            <ArrowBackIosNewSharp color="inherit" />
          </IconButton>
          <Typography marginX={3} variant="subtitle2" color="textPrimary">
            {page}
          </Typography>
          <IconButton
            sx={{
              color: "text.primary",
            }}
            disabled={!(page < Math.ceil(count / postsPerPage))}
            onClick={() => handleNextPage()}
          >
            <ArrowForwardIosSharp color="inherit" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
export default ListView;
