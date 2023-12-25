import {
  Logout,
  Person,
  PostAdd,
  Search,
  Tag,
  Tune,
} from "@mui/icons-material";
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
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { NavbarProps } from "../../types";
import useAuthorized from "../AuthorizationHook/useAuthorized";
import SearchModal from "../Modals/SearchModal";
import SettingsModal from "../Modals/SettingsModal";
import ProfileMenu from "../Modals/ProfileMenu";
import NavbarSearchButton from "../Buttons/NavbarSearchButton";
import { NavbarButton } from "../Buttons/NavbarButton";
import NotificationsModal from "../Modals/NotificationsModal";

export const Navbar: FC<NavbarProps> = (props: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const { isAuthorized } =
    process.env.NEXT_PUBLIC_LOCALHOST === "true"
      ? {
          isAuthorized: true,
        }
      : useAuthorized();
  // ProfileMenu
  const [anchorElProfileMenu, setAnchorElProfileMenu] =
    useState<null | HTMLElement>(null);
  const openProfileMenu = Boolean(anchorElProfileMenu);
  const handleProfileMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElProfileMenu(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorElProfileMenu(null);
  };
  // NotificationsModal
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
  const handleNotificationsModalOpen = () => setOpenNotificationsModal(true);
  const handleNotificationsModalClose = () => setOpenNotificationsModal(false);
  // SettingsModal
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
          // backgroundColor: isMobile ? props.backgroundColor : "transparent",
          backgroundColor: props.backgroundColor,
          opacity: isMobile ? "100%" : "80%",
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
          <Box flexGrow={100} />
          <Box>
            <NavbarButton
              variant="base"
              // variant="base"
              onClick={() => {
                handleNavigate("/create");
              }}
              icon={Logout}
              tooltip="Sign out"
              sx={{
                icon: {
                  color: theme.palette.text.secondary,
                  height: "28px",
                  width: "28px",
                },
                // button: { height: "34px", width: "34px" },
              }}
            />
          </Box>
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
        // backgroundColor: isMobile ? props.backgroundColor : "transparent",
        backgroundColor: isMobile
          ? props.backgroundColor
          : props.backgroundColor + "99",
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
          // <Box mt={isMobile ? 0 : -0.2}>
          <Box>
            <NavbarButton
              variant="outline"
              // variant="base"
              onClick={() => {
                handleNavigate("/create");
              }}
              icon={PostAdd}
              tooltip="Upload new post"
              sx={{
                icon: { height: "24px", width: "24px" },
                button: { height: "34px", width: "34px" },
              }}
            />
          </Box>
        ) : null}
        <Box mx={0.5}>
          {isMobile || xs ? (
            <NavbarButton
              icon={Search}
              variant="outline"
              onClick={() => handleSearchModalOpen()}
              tooltip={"Search"}
              sx={{
                icon: { height: "24px", width: "24px" },
                button: { height: "34px", width: "34px" },
              }}
            />
          ) : (
            <NavbarSearchButton
              variant="outline"
              onClick={() => handleSearchModalOpen()}
              tooltip={"Search"}
              sx={{
                icon: { height: "24px", width: "24px" },
                button: { height: "34px", width: "34px" },
              }}
            />
          )}
        </Box>
        <Box mr={0.5}>
          <NavbarButton
            variant="outline"
            href="/tags"
            icon={Tag}
            tooltip="Go to tags"
            sx={{
              icon: { height: "24px", width: "24px" },
              button: { height: "34px", width: "34px" },
            }}
          />
        </Box>
        <Box>
          <ProfileMenu
            anchorEl={anchorElProfileMenu}
            open={openProfileMenu}
            handleMenuOpen={handleProfileMenuClick}
            handleMenuClose={handleProfileMenuClose}
            accountButton={{
              color: props.textColor || theme.palette.text.primary,
            }}
            showNotificationsBadge={true}
            notifications={{
              open: openNotificationsModal,
              handleModalOpen: handleNotificationsModalOpen,
              handleModalClose: handleNotificationsModalClose,
            }}
            settings={{
              open: openSettingsModal,
              handleModalOpen: handleSettingsModalOpen,
              handleModalClose: handleSettingsModalClose,
            }}
          />
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
      <NotificationsModal
        open={openNotificationsModal}
        handleModalOpen={handleNotificationsModalOpen}
        handleModalClose={handleNotificationsModalClose}
      />
    </Box>
  );
};
export default Navbar;
