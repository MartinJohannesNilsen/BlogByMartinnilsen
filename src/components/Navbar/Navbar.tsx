import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  ButtonBase,
  useMediaQuery,
  Tooltip,
  Button,
} from "@mui/material";
import { ThemeEnum } from "../../themes/themeMap";
import { useTheme } from "../../ThemeProvider";
import TuneIcon from "@mui/icons-material/Tune";
import PostAddIcon from "@mui/icons-material/PostAdd";
import $ from "jquery";
import SettingsModal from "../SettingsModal/SettingsModal";
import { useNavigate } from "react-router-dom";

export const handleScroll = (name: string) => {
  $("html, body").animate(
    {
      scrollTop: $("#" + name)!.offset()!.top,
    },
    100
  );
};

export const Navbar: FC = (props) => {
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
      position="static"
      sx={{
        zIndex: 2,
        height: "80px",
        backgroundColor: "primary.main",
      }}
    >
      <Toolbar
        sx={{
          zIndex: 2,
          height: "80px",
          backgroundColor: "primary.main",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ width: "90%", marginX: "5%" }}
        >
          <Button onClick={() => handleNavigate("/")}>
            <Typography
              fontFamily={theme.typography.fontFamily}
              variant="h4"
              fontWeight="800"
              sx={{
                color: "secondary.main",
              }}
            >
              Blog
            </Typography>
          </Button>
          <Box flexGrow={1} />
          {process.env.REACT_APP_MANAGE_POSTS_AVAILABLE === "true" ? (
            <Box mx={2} mb={0.2}>
              <Tooltip enterDelay={2000} title={"Upload new post"}>
                <ButtonBase
                  onClick={() => {
                    handleNavigate("/create");
                  }}
                >
                  <PostAddIcon
                    sx={{
                      color: theme.palette.text.primary,
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
          <Box>
            <Tooltip enterDelay={2000} title={"Open settings"}>
              <ButtonBase
                onClick={() => {
                  handleSettingsModalOpen();
                }}
              >
                <TuneIcon
                  sx={{
                    color: theme.palette.text.primary,
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
