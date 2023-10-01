import { Close, GradientSharp, Square } from "@mui/icons-material";
import {
  Box,
  ClickAwayListener,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { useState } from "react";
import { BlockPicker } from "react-color";
import { isMobile } from "react-device-detect";
import { useTheme } from "../../ThemeProvider";
import { defaultFontFamily } from "../../styles/themes/themeDefaults";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { SettingsModalProps } from "../../types";
import { CustomSwitch as Switch } from "../Switch/Switch";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 370,
  bgcolor: "background.paper",
  borderRadius: 2,
  outline: 0,
  display: "flex",
  textAlign: "left",
  flexDirection: "column",
  rowGap: "10px",
  justifyContent: "flex-start",
  boxShadow: 24,
  p: 4,
};

const defaultFonts = [
  { title: "System font", font: defaultFontFamily },
  { title: "Gotham Pro", font: "Gotham Pro" },
  { title: "Source Sans Pro", font: "Source Sans Pro" },
  { title: "Consolas", font: "Consolas, monospace" },
  { title: "Fantasy", font: "Luminari, sans-serif" },
];

const defaultColors = [
  { title: "Teal", color: "#29939b" },
  { title: "Yellow", color: "#fdd835" },
  { title: "Pink", color: "#df487f" },
  { title: "Red", color: "#ff1744" },
];

const TransparentTooltip = withStyles({
  tooltip: {
    backgroundColor: "transparent",
  },
})(Tooltip);

export const SettingsModal = (props: SettingsModalProps) => {
  const {
    theme,
    setTheme,
    setDefaultTheme,
    accentColor,
    setAccentColor,
    fontFamily,
    setFontFamily,
  } = useTheme();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const blockPickerColors = [
    "#D9E3F0",
    "#F47373",
    "#697689",
    "#37D67A",
    "#2CCCE4",
    "#555555",
    "#E9B384",
    "#ff8a65",
    "#ba68c8",
    "#7ca18d",
  ];

  return (
    <Box>
      <Modal
        open={props.open}
        onClose={() => {
          props.handleModalClose();
          setColorPickerOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            style={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={() => {
              props.handleModalClose();
              setColorPickerOpen(false);
            }}
          >
            <Close />
          </IconButton>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="h5"
            fontWeight="800"
            color={theme.palette.text.primary}
            mb={1}
          >
            Settings
          </Typography>
          <Box display="flex" gap="10px">
            <Typography
              fontFamily={theme.typography.fontFamily}
              variant="body1"
              fontWeight="800"
              color={theme.palette.text.primary}
            >
              Light Mode:
            </Typography>
            <Box flexGrow="1" />
            <Box mt={-0.6} mr={-1.8}>
              <Switch
                checked={theme.palette.mode === "light"}
                onChange={props.handleThemeChange}
              />
            </Box>
            <Box mt={-0.2}>
              <Tooltip enterDelay={2000} title="Use system settings">
                <IconButton
                  disabled={localStorage.getItem("theme") === null}
                  aria-label="delete"
                  size="small"
                  onClick={() => {
                    setDefaultTheme();
                  }}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box display="flex" mt={0.4} alignItems="baseline">
            <Typography
              fontFamily={theme.typography.fontFamily}
              variant="body1"
              fontWeight="800"
              color={theme.palette.text.primary}
            >
              Font Family:
            </Typography>
            <Box flexGrow="1" />
            {defaultFonts.map(
              (element: { title: string; font: string }, index: number) => (
                <Box mt={-0.6} display="flex" key={index}>
                  <Tooltip enterDelay={2000} title={element.title}>
                    <IconButton
                      onClick={() => {
                        setFontFamily(element.font);
                        setTheme(
                          theme.palette.mode === "dark"
                            ? ThemeEnum.Dark
                            : ThemeEnum.Light
                        );
                      }}
                      disabled={fontFamily === element.font}
                      sx={{
                        width: "35px",
                        height: "35px",
                      }}
                    >
                      <Typography
                        // mt={index === 1 ? "4.2px" : index === 4 ? "2px" : 0}
                        color={theme.palette.text.primary}
                        sx={{
                          fontFamily: element.font,
                          fontWeight: 600,
                          borderBottom:
                            fontFamily === element.font
                              ? "2px solid " + theme.palette.text.primary
                              : "",
                        }}
                      >
                        Aa
                      </Typography>
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            )}
          </Box>
          <Box display="flex" mt={0.3}>
            <Typography
              fontFamily={theme.typography.fontFamily}
              variant="body1"
              fontWeight="800"
              color={theme.palette.text.primary}
            >
              Accent color:
            </Typography>
            <Box flexGrow="1" />
            {defaultColors.map(
              (element: { title: string; color: string }, index: number) => (
                <Box mt={-0.6} key={index}>
                  <Tooltip enterDelay={2000} title={element.title}>
                    <IconButton
                      onClick={() => {
                        setAccentColor(element.color);
                        setTheme(
                          theme.palette.mode === "dark"
                            ? ThemeEnum.Dark
                            : ThemeEnum.Light
                        );
                      }}
                      disabled={accentColor === element.color}
                      sx={{
                        width: "35px",
                        height: "35px",
                      }}
                    >
                      <Square
                        fontFamily={theme.typography.fontFamily}
                        sx={{
                          color: element.color,
                          fontWeight: 600,
                          borderBottom:
                            accentColor === element.color
                              ? "2px solid " + theme.palette.secondary.main
                              : "",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            )}
            <Box mt={-0.6}>
              <ClickAwayListener onClickAway={() => setColorPickerOpen(false)}>
                <Box>
                  <TransparentTooltip
                    PopperProps={{
                      disablePortal: true,
                    }}
                    onClose={() => setColorPickerOpen(false)}
                    open={colorPickerOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    placement={isMobile ? "top" : "bottom"}
                    title={
                      <BlockPicker
                        triangle={isMobile ? "hide" : "top"}
                        colors={blockPickerColors}
                        color={accentColor}
                        onChange={(color, event) => {
                          setAccentColor(color.hex);
                          setTheme(
                            theme.palette.mode === "dark"
                              ? ThemeEnum.Dark
                              : ThemeEnum.Light,
                            true
                          );
                        }}
                      />
                    }
                  >
                    <IconButton
                      onClick={() => {
                        setColorPickerOpen(!colorPickerOpen);
                      }}
                      sx={{
                        width: "35px",
                        height: "35px",
                      }}
                    >
                      <GradientSharp
                        fontFamily={theme.typography.fontFamily}
                        sx={{
                          color:
                            defaultColors.filter(function (e) {
                              return e.color === accentColor;
                            }).length === 0
                              ? accentColor
                              : theme.palette.text.primary,
                          fontWeight: 600,
                          borderBottom:
                            defaultColors.filter(function (e) {
                              return e.color === accentColor;
                            }).length === 0
                              ? "2px solid " + theme.palette.secondary.main
                              : "",
                        }}
                      />
                    </IconButton>
                  </TransparentTooltip>
                </Box>
              </ClickAwayListener>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default SettingsModal;
