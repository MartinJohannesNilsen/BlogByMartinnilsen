import { FC, useCallback, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  ButtonBase,
  useMediaQuery,
  Tooltip,
  Avatar,
} from "@mui/material";
import { ThemeEnum } from "../../themes/themeMap";
import { useTheme } from "../../ThemeProvider";
import TuneIcon from "@mui/icons-material/Tune";
import PostAddIcon from "@mui/icons-material/PostAdd";
import $ from "jquery";
import SettingsModal from "../SettingsModal/SettingsModal";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import logo from "../../assets/img/terminal.png";
import { NavbarProps } from "../../types";

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
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const handleSettingsModalOpen = () => setOpenSettingsModal(true);
  const handleSettingsModalClose = () => setOpenSettingsModal(false);
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

  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const smDown = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      elevation={0}
      position={isMobile ? "fixed" : "static"}
      sx={{
        zIndex: 2,
        marginTop: isMobile ? "-5px" : "0px",
        maxHeight: isMobile ? "30px" : "80px",
        backgroundColor: props.backgroundColor,
      }}
    >
      <Toolbar
        sx={{
          zIndex: 2,
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
            <Box mx={2} mt={isMobile ? 0.25 : -0.2}>
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
