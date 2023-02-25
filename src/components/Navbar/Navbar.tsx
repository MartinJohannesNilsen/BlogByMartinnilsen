import { FC, useCallback, useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  ButtonBase,
  Tooltip,
  Avatar,
} from "@mui/material";
import { ThemeEnum } from "../../themes/themeMap";
import { useTheme } from "../../ThemeProvider";
import TuneIcon from "@mui/icons-material/Tune";
import PostAddIcon from "@mui/icons-material/PostAdd";
import $ from "jquery";
import SettingsModal from "../Modals/SettingsModal";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import logo from "../../assets/img/terminal.png";
import { NavbarProps, SimplifiedPost } from "../../types";
import { useHotkeys } from "react-hotkeys-hook";
import SearchModal from "../Modals/SearchModal";
import { Search } from "@mui/icons-material";
import { getPostsOverview } from "../../database/search";

export const handleScroll = (name: string) => {
  $("html, body").animate(
    {
      scrollTop: $("#" + name)!.offset()!.top,
    },
    100
  );
};

export const Navbar: FC<NavbarProps> = (props: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  // SetingsModal
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const handleSettingsModalOpen = () => setOpenSettingsModal(true);
  const handleSettingsModalClose = () => setOpenSettingsModal(false);
  // SearchModal
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const handleSearchModalOpen = () => setOpenSearchModal(true);
  const handleSearchModalClose = () => setOpenSearchModal(false);
  useHotkeys(["Control+k", "Meta+k"], () => {
    handleSearchModalOpen();
  });
  const [searchModalData, setSearchModalData] = useState<SimplifiedPost[]>([]);

  useEffect(() => {
    getPostsOverview()
      .then((data) => {
        process.env.REACT_APP_MANAGE_POSTS_AVAILABLE === "true"
          ? setSearchModalData(data)
          : setSearchModalData(data.filter((post) => post.published));
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {};
  }, []);

  // Navigation
  const navigate = useNavigate();
  const handleNavigate = useCallback(
    (path) => {
      navigate(path, { replace: true });
      location.reload();
    },
    [navigate]
  );

  const handleThemeChange = (event: any) => {
    event.target.checked === true
      ? setTheme(ThemeEnum.Light)
      : setTheme(ThemeEnum.Dark);
  };

  return (
    <AppBar
      elevation={0}
      position={isMobile ? "fixed" : "static"}
      sx={{
        zIndex: 2,
        maxHeight: isMobile ? "30px" : "80px",
        backgroundColor: props.backgroundColor,
      }}
    >
      <Toolbar
        sx={{
          zIndex: 2,
          marginTop: isMobile ? "-35px" : "0",
          paddingTop: isMobile ? "59px" : "0",
          paddingBottom: isMobile ? "26px" : "0",
          maxHeight: isMobile ? "30px" : "80px",
          backgroundColor: props.backgroundColor,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: isMobile ? "96%" : "90%",
            marginX: isMobile ? "2%" : "5%",
          }}
        >
          <ButtonBase onClick={() => handleNavigate("/")}>
            <Avatar
              sx={{
                height: "32px",
                width: "32px",
                borderRadius: "0",
              }}
              src={logo}
            />
          </ButtonBase>
          <Box flexGrow={1} />
          {process.env.REACT_APP_MANAGE_POSTS_AVAILABLE === "true" ? (
            <Box mt={isMobile ? 0 : -0.2}>
              <Tooltip enterDelay={2000} title={"Upload new post"}>
                <ButtonBase
                  onClick={() => {
                    handleNavigate("/create");
                  }}
                >
                  <PostAddIcon
                    sx={{
                      color: theme.palette.text.secondary,
                      height: "30px",
                      width: "30px",
                      "&:hover": {
                        color: theme.palette.secondary.main,
                      },
                    }}
                  />
                </ButtonBase>
              </Tooltip>
            </Box>
          ) : (
            <></>
          )}
          <Box mx={1} mt={isMobile ? 0.25 : 0}>
            <Tooltip
              enterDelay={2000}
              title={`Search${
                isMobile
                  ? ""
                  : navigator.userAgent.indexOf("Mac OS X") != -1
                  ? " (⌘ + k)"
                  : " (ctrl + k)"
              }`}
            >
              <ButtonBase
                onClick={() => {
                  handleSearchModalOpen();
                }}
              >
                <Search
                  sx={{
                    color: theme.palette.text.secondary,
                    height: "30px",
                    width: "30px",
                    "&:hover": {
                      color: theme.palette.secondary.main,
                    },
                  }}
                />
              </ButtonBase>
            </Tooltip>
          </Box>
          <Box mt={isMobile ? 0.37 : 0}>
            <Tooltip enterDelay={2000} title={"Open settings"}>
              <ButtonBase
                onClick={() => {
                  handleSettingsModalOpen();
                }}
              >
                <TuneIcon
                  sx={{
                    color: theme.palette.text.secondary,
                    height: "30px",
                    width: "30px",
                    "&:hover": {
                      color: theme.palette.secondary.main,
                    },
                  }}
                />
              </ButtonBase>
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>
      <SearchModal
        open={openSearchModal}
        handleModalOpen={handleSearchModalOpen}
        handleModalClose={handleSearchModalClose}
        postsOverview={searchModalData}
      />
      <SettingsModal
        open={openSettingsModal}
        handleModalOpen={handleSettingsModalOpen}
        handleModalClose={handleSettingsModalClose}
        handleThemeChange={handleThemeChange}
      />
    </AppBar>
  );
};
export default Navbar;
