"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import Navbar from "@/components/Navigation/Navbar";
import PostTable from "@/components/Tables/PostTable";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { SessionUser, StoredPost } from "@/types";
import { Add, Home } from "@mui/icons-material";
import { Box, Typography, useMediaQuery } from "@mui/material";
import ErrorPage from "next/error";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

const CMSPage = ({
  postsOverview,
  isAuthorized,
  sessionUser,
}: {
  postsOverview: StoredPost[];
  isAuthorized: boolean;
  sessionUser?: SessionUser;
}) => {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  if (!isAuthorized)
    return (
      <ErrorPage
        statusCode={403}
        title="You are not permitted to enter here! Please return home"
      />
    );

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) return <></>;
  return (
    <Box
      height="100%"
      width="100%"
      // sx={{ backgroundColor: theme.palette.primary.main }}
    >
      {/* Navbar */}
      <Navbar
        posts={postsOverview}
        isAuthorized={isAuthorized}
        sessionUser={sessionUser}
        hideNewPostButton={true}
      />

      <Box px={xs ? "20px" : "40px"} pt={isMobile ? "55px" : "80px"} pb={8}>
        {/* Top Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h3" component="h1">
            CMS Dashboard
          </Typography>
          <NavbarButton
            variant="outline"
            href="/cms/create"
            icon={Add}
            tooltip="Create new post"
            text="New Post"
            sxButton={{
              minWidth: "120px",
              height: "40px",
            }}
          />
        </Box>

        {/* Table */}
        <PostTable postsOverview={postsOverview} />
      </Box>
    </Box>
  );
};
export default CMSPage;
