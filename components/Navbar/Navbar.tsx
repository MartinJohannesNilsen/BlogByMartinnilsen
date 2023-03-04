import { Person, PostAdd, Search, Tune } from "@mui/icons-material";
import { AppBar, Box, ButtonBase, Toolbar, Tooltip } from "@mui/material";
import $ from "jquery";
import Image from "next/image";
import logo from "public/assets/img/terminal.png";
import { FC, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "../../ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { NavbarProps } from "../../types";
import useAuthorized from "../AuthorizationHook/useAuthorized";
import SearchModal from "../Modals/SearchModal";
import SettingsModal from "../Modals/SettingsModal";
import { useRouter } from "next/router";

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
  const { isAuthorized } = useAuthorized();
  // SetingsModal
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const handleSettingsModalOpen = () => setOpenSettingsModal(true);
  const handleSettingsModalClose = () => setOpenSettingsModal(false);
  // SearchModal
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const handleSearchModalOpen = () => setOpenSearchModal(true);
  const handleSearchModalClose = () => setOpenSearchModal(false);
  useHotkeys(["Control+k", "Meta+k"], (event) => {
    event.preventDefault();
    handleSearchModalOpen();
  });

  // Navigation
  const router = useRouter();
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleThemeChange = (event: any) => {
    setTheme(
      event.target.checked === true ? ThemeEnum.Light : ThemeEnum.Dark,
      true
    );
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
            <Image
              src={logo.src}
              alt=""
              width={32}
              height={32}
              style={{ borderRadius: "0" }}
            />
          </ButtonBase>
          <Box flexGrow={1} />
          {isAuthorized ? (
            <Box mt={isMobile ? 0 : -0.2}>
              <Tooltip enterDelay={2000} title={"Upload new post"}>
                <ButtonBase
                  onClick={() => {
                    handleNavigate("/create");
                  }}
                >
                  <PostAdd
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
          ) : null}
          <Box mx={1} mt={isMobile ? 0.25 : 0}>
            <Tooltip
              enterDelay={2000}
              title={`Search${
                isMobile
                  ? ""
                  : typeof navigator !== "undefined" &&
                    navigator.userAgent.indexOf("Mac OS X") != -1
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
          <Box mt={isMobile ? 0.37 : 0} mr={1}>
            <Tooltip enterDelay={2000} title={"Open settings"}>
              <ButtonBase
                onClick={() => {
                  handleSettingsModalOpen();
                }}
              >
                <Tune
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
          <Box mt={isMobile ? 0.25 : 0}>
            <Tooltip enterDelay={2000} title={"Go to account"}>
              <ButtonBase href="/account">
                <Person
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
        postsOverview={props.posts}
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
