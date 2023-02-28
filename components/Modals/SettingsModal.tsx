import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IconButton, Tooltip } from "@mui/material";
import { getSelectedTheme, useTheme } from "../../ThemeProvider";
import Switch from "../Switch/Switch";
import CloseIcon from "@mui/icons-material/Close";
import { SettingsModalProps } from "../../types";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { defaultFontFamily } from "../../styles/themes/themeDefaults";
import SquareIcon from "@mui/icons-material/Square";

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

  return (
    <Box>
      <Modal
        open={props.open}
        onClose={props.handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            style={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={() => props.handleModalClose()}
          >
            <CloseIcon />
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
                  <CloseIcon fontSize="inherit" />
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
            {[
              { title: "System font", font: defaultFontFamily },
              { title: "Gotham Pro", font: "Gotham Pro" },
              { title: "Source Sans Pro", font: "Source Sans Pro" },
              { title: "Consolas", font: "Consolas, monospace" },
              { title: "Fantasy", font: "Luminari, sans-serif" },
            ].map((element: { title: string; font: string }, index: number) => (
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
            ))}
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
            {[
              { title: "Teal", color: "#29939b" },
              { title: "Green", color: "#739574" },
              { title: "Yellow", color: "#fdd835" },
              { title: "Pink", color: "#df487f" },
              { title: "Red", color: "#ff1744" },
            ].map(
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
                      <SquareIcon
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
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default SettingsModal;
