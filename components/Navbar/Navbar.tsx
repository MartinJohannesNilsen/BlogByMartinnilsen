import { Person, PostAdd, Search, Tag, Tune } from "@mui/icons-material";
import { AppBar, Box, ButtonBase, Toolbar, Tooltip } from "@mui/material";
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
    <Box
      width={"100%"}
      pt={isMobile ? 4.75 : 2}
      pb={isMobile ? 0.75 : 2}
      position={isMobile ? "fixed" : "relative"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: props.backgroundColor,
        top: 0,
        zIndex: 1000,
        marginTop: isMobile ? "-34px" : 0,
        WebkitTransform: "translateZ(0)",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        sx={{
          width: isMobile ? "95%" : "80%",
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
        <Box flexGrow={100} />
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
                    color: props.textColor,
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
        <Box mt={isMobile ? 0.25 : 0} mx={isMobile ? 0.25 : 0.5}>
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
                  color: props.textColor,
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
        <Box mt={isMobile ? 0.37 : 0} mr={isMobile ? 0.25 : 0.5}>
          <Tooltip enterDelay={2000} title={"Go to tags"}>
            <ButtonBase href="/tags">
              <Tag
                sx={{
                  color: props.textColor,
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
        <Box mt={isMobile ? 0.37 : 0} mr={isMobile ? 0.25 : 0.5}>
          <Tooltip enterDelay={2000} title={"Open settings"}>
            <ButtonBase
              onClick={() => {
                handleSettingsModalOpen();
              }}
            >
              <Tune
                sx={{
                  color: props.textColor,
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
                  color: props.textColor,
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
    </Box>
  );
};
export default Navbar;
