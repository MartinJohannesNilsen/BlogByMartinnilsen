import { FC, useEffect, useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "../ThemeProvider";
import { LandingViewProps } from "../types";
import Navbar from "../components/Navbar/Navbar";
import { Helmet } from "react-helmet";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { getPaginatedCollection, getPostCount } from "../database/posts";
import LandingViewCard from "../components/Cards/LandingViewCard";
import WavingHand from "../assets/img/waving-hand.png";
import {
  ArrowBackIosNewSharp,
  ArrowForwardIosSharp,
} from "@mui/icons-material";

const LandingView: FC<LandingViewProps> = (props) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [queryDocumentSnapshots, setQueryDocumentSnapshots] = useState<
    QueryDocumentSnapshot[]
  >([]);
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const md = useMediaQuery(theme.breakpoints.only("md"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const backgroundBWBreakingPercentage = lgUp
    ? "40%"
    : mdDown
    ? "27.5%"
    : "35%";
  const postsPerPage = 4;

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

  useEffect(() => {
    setIsLoading(false);
  }, [queryDocumentSnapshots]);

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
      {/* <Box flexGrow={100} /> */}
      <Helmet>
        <title>Tech blog | Martin Johannes Nilsen</title>
      </Helmet>
      {isLoading ? (
        <></>
      ) : (
        <>
          <Navbar backgroundColor={theme.palette.primary.contrastText} />
          <Box
            sx={{
              minHeight: "calc(100vh - 64px)",
              width: "100%",
              background: `linear-gradient(to bottom, ${theme.palette.primary.contrastText} 0%, ${theme.palette.primary.contrastText} ${backgroundBWBreakingPercentage}, ${theme.palette.primary.main} ${backgroundBWBreakingPercentage}, ${theme.palette.primary.main} 100%)`,
              // backgroundColor: theme.palette.primary.main,
            }}
          >
            <Grid
              container
              rowSpacing={mdDown ? 5 : md ? 3 : 6}
              columnSpacing={mdDown ? 0 : 3}
              sx={{
                width: "100%",
                height: "100%",
                paddingX: lgUp ? "150px" : xs ? "50px" : "80px",
                paddingY: lgUp ? "100px" : xs ? "50px" : "80px",
                marginX: 0,
                paddingBottom: "100px",
              }}
            >
              <Grid
                item
                sx={{
                  marginBottom: mdDown ? "0px" : md ? "40px" : "20px",
                  marginTop: mdDown ? "50px" : "20px",
                }}
                xs={12}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  variant={mdDown ? "h3" : "h1"}
                  fontFamily={theme.typography.fontFamily}
                  color={theme.palette.text.secondary}
                  fontWeight={600}
                >
                  Welcome
                </Typography>
                <img
                  src={WavingHand}
                  style={{
                    marginLeft: mdDown ? "15px" : "25px",
                    width: mdDown
                      ? theme.typography.h3.fontSize
                      : theme.typography.h1.fontSize,
                    height: mdDown
                      ? theme.typography.h3.fontSize
                      : theme.typography.h1.fontSize,
                    marginBottom: "5px",
                  }}
                />
              </Grid>
              {queryDocumentSnapshots.map((document, index) => {
                const data = document.data();
                const id = document.id;
                return (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    md={6}
                    lg={index % 4 === 0 ? 12 : 4}
                    xl={6}
                    // xl={index % 5 === 0 || index % 5 === 1 ? 12 : 4} // 2 on first row, 3 on second
                  >
                    <LandingViewCard
                      id={id}
                      image={data.image}
                      title={data.title}
                      timestamp={data.timestamp}
                      summary={data.summary}
                      type={data.type}
                      tags={data.tags}
                    />
                  </Grid>
                );
              })}
              <Grid
                item
                xs={12}
                mt={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
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
                  <Typography
                    marginX={3}
                    variant="subtitle2"
                    color="textPrimary"
                  >
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
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};
export default LandingView;
