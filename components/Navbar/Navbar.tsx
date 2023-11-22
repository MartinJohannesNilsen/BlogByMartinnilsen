import { Person, PostAdd, Search, Tag, Tune } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  Link,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "public/assets/imgs/terminal.png";
import { FC, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "../../ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { NavbarProps } from "../../types";
import useAuthorized from "../AuthorizationHook/useAuthorized";
import SearchModal from "../Modals/SearchModal";
import SettingsModal from "../Modals/SettingsModal";

export const Navbar: FC<NavbarProps> = (props: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const { isAuthorized } =
    process.env.NEXT_PUBLIC_LOCALHOST === "true"
      ? {
          isAuthorized: true,
        }
      : useAuthorized();
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
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const md = useMediaQuery(theme.breakpoints.only("md"));
  const lg = useMediaQuery(theme.breakpoints.only("lg"));
  const xl = useMediaQuery(theme.breakpoints.only("xl"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

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

  if (!props.posts)
    return (
      <Box
        width={"100%"}
        pt={isMobile ? 4.75 : 2}
        pb={isMobile ? 0.75 : 2}
        // position={isMobile ? "fixed" : "relative"}
        position={"fixed"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: isMobile ? props.backgroundColor : "transparent",
          top: 0,
          zIndex: 1000,
          marginTop: isMobile ? "-34px" : 0,
          WebkitTransform: "translateZ(0)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          sx={{
            // width: isMobile || xs ? "95%" : "80%",
            width: "100%",
            paddingX: lgUp ? "150px" : xs ? "10px" : "80px",
          }}
        >
          {/* Home button */}
          <Link
            // onClick={() => handleNavigate("/")}
            href="/"
            // disableRipple
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            underline="none"
          >
            <Image
              src={logo.src}
              alt=""
              width={32}
              height={32}
              style={{ borderRadius: "0" }}
            />
            <Typography
              // variant={"h5"}
              fontFamily={theme.typography.fontFamily}
              color={props.textColor || theme.palette.text.primary}
              fontWeight={700}
              fontSize={22}
              textAlign="left"
              pl={0.5}
              sx={{ textDecoration: "none" }}
            >
              Blog
            </Typography>
          </Link>
        </Box>
      </Box>
    );
  return (
    <Box
      width={"100%"}
      pt={isMobile ? 4.75 : 2}
      pb={isMobile ? 0.75 : 2}
      // position={isMobile ? "fixed" : "relative"}
      position={"fixed"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: isMobile ? props.backgroundColor : "transparent",
        top: 0,
        zIndex: 1000,
        marginTop: isMobile ? "-34px" : 0,
        WebkitTransform: "translateZ(0)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        sx={{
          // width: isMobile || xs ? "95%" : "80%",
          width: "100%",
          paddingX: lgUp ? "150px" : xs ? "10px" : "80px",
        }}
      >
        {/* Home button */}
        <ButtonBase
          onClick={() => handleNavigate("/")}
          disableRipple
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={logo.src}
            alt=""
            width={32}
            height={32}
            style={{ borderRadius: "0" }}
          />
          <Typography
            // variant={"h5"}
            fontFamily={theme.typography.fontFamily}
            color={props.textColor || theme.palette.text.primary}
            fontWeight={700}
            fontSize={22}
            textAlign="left"
            pl={0.5}
          >
            Blog
          </Typography>
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
                    color: props.textColor || theme.palette.text.primary,
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
                  color: props.textColor || theme.palette.text.primary,
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
                  color: props.textColor || theme.palette.text.primary,
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
                  color: props.textColor || theme.palette.text.primary,
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
                  color: props.textColor || theme.palette.text.primary,
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
