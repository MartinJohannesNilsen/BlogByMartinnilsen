import { Close } from "@mui/icons-material";
import { Button, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ModalProps } from "../../types";
import CustomParagraph from "../EditorJS/Renderers/CustomParagraph";
import Toggle from "../Toggles/Toggle";
import { useEffect, useState } from "react";

export const AboutModal = (props: ModalProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const nToggles = 2;
  const [openToggles, setOpenToggles] = useState(Array(nToggles).fill(false));
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleClick = (index) => {
    if (index > nToggles || index < 0) return;
    let newArray = Array(nToggles).fill(false);
    newArray[index] = !openToggles[index];
    setOpenToggles(newArray);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: xs ? 370 : 500,
    maxHeight: "95vh",
    bgcolor: "background.paper",
    borderRadius: 2,
    outline: 0,
    display: "flex",
    textAlign: "left",
    flexDirection: "column",
    rowGap: "10px",
    justifyContent: "flex-start",
    boxShadow: 24,
    p: xs ? 2 : 4,
  };

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
            <Close />
          </IconButton>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="h5"
            fontWeight="800"
            color={theme.palette.text.primary}
            mb={1}
          >
            About
          </Typography>
          {/* Content */}
          <Box>
            <CustomParagraph
              data={{
                text: 'This blog is created and written by Martin Johannes Nilsen, a Norwegian software engineer. For more information about the author, follow this <a href="https://martinjohannesnilsen.no">link</a> to visit his portfolio.',
              }}
              style={{
                box: { my: 0 },
                typography: { ...theme.typography.body2, fontWeight: 600 },
              }}
              config={null}
              classNames={null}
            />
            <CustomParagraph
              data={{
                text: "Read more about aspects of this blog:",
              }}
              style={{
                box: { my: 1 },
                typography: { ...theme.typography.body2, fontWeight: 600 },
              }}
              config={null}
              classNames={null}
            />
            {/* Services */}
            <Toggle
              open={openToggles[0]}
              handleClick={() => {
                handleClick(0);
              }}
              title="Services"
              accordionSx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : theme.palette.grey[200],
                border:
                  "1px solid " +
                  (theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300]),
              }}
              boxSx={{
                mt: 1,
              }}
            >
              <>
                <CustomParagraph
                  data={{
                    text: "<a href='https://firebase.google.com'>Firebase</a>, a Google product, stores posts that are retrieved only when the author creates or updates a post, using NextJS revalidation. ",
                  }}
                  style={{
                    box: { mt: -0.5, my: 0.5 },
                    typography: { ...theme.typography.body2, fontWeight: 600 },
                  }}
                  config={null}
                  classNames={null}
                />
                <CustomParagraph
                  data={{
                    text: "<a href='https://giscus.app'>Giscus</a> is used for post reactions and comments.",
                  }}
                  style={{
                    box: { my: 0.5 },
                    typography: { ...theme.typography.body2, fontWeight: 600 },
                  }}
                  config={null}
                  classNames={null}
                />
                <CustomParagraph
                  data={{
                    text: "<a href='https://github.com'>GitHub</a> and <a href='https://www.google.com/'>Google</a> are used for authenticating users. Only the elements 'email', 'name' and 'icon' will be accessed.",
                  }}
                  style={{
                    box: { my: 0.5 },
                    typography: { ...theme.typography.body2, fontWeight: 600 },
                  }}
                  config={null}
                  classNames={null}
                />
                <CustomParagraph
                  data={{
                    text: "<a href='https://supabase.com'>Supabase</a> is used for keeping track of view counts, that is only incrementing numbers, and notifications.",
                  }}
                  style={{
                    box: { my: 0.5 },
                    typography: { ...theme.typography.body2, fontWeight: 600 },
                  }}
                  config={null}
                  classNames={null}
                />
              </>
            </Toggle>
            {/* Local storage */}
            <Toggle
              open={openToggles[1]}
              handleClick={() => {
                handleClick(1);
              }}
              title="Local storage"
              accordionSx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : theme.palette.grey[200],
                border:
                  "1px solid " +
                  (theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300]),
              }}
              boxSx={{
                mt: 1,
                my: 0,
                userSelect: "none",
              }}
            >
              <>
                <CustomParagraph
                  data={{
                    text: "Except for view counts, all data is stored entirely on each visitor's machine. These fields are stored locally:",
                  }}
                  style={{
                    box: { mt: -0.5, my: 0.5 },
                    typography: {
                      ...theme.typography.body2,
                      fontWeight: 600,
                      userSelect: "none",
                    },
                  }}
                  config={null}
                  classNames={null}
                />
                <CustomParagraph
                  data={{
                    text: "<ul><li><code>theme</code>: Configured theme instead of system default</li><li><code>cardLayout</code>: Card layout on landing page</li><li><code>lastRead</code>: Date as number for notifications</li><li><code>notificationsRead</code>: List of read notification ids</li><li><code>notificationFilterDays</code>: Filter notifications</li></ul>",
                  }}
                  style={{
                    box: { my: 0.5 },
                    typography: {
                      ...theme.typography.body2,
                      fontWeight: 600,
                      userSelect: "none",
                    },
                  }}
                  config={null}
                  classNames={null}
                />
                <CustomParagraph
                  data={{
                    text: "These will be cleared if you clear your browsing data, or by pressing the button below:",
                  }}
                  style={{
                    box: { my: 0.5 },
                    typography: {
                      ...theme.typography.body2,
                      fontWeight: 600,
                      userSelect: "none",
                    },
                  }}
                  config={null}
                  classNames={null}
                />
                <Tooltip
                  title="Cleared! Refresh browser to see changes"
                  open={tooltipOpen}
                  placement={xs ? "top-start" : "right"}
                  disableHoverListener
                >
                  <Button
                    disabled={buttonDisabled}
                    sx={{
                      border: "1px solid " + theme.palette.error.main,
                      backgroundColor: theme.palette.error.dark,
                      "&:hover": { backgroundColor: theme.palette.error.main },
                      "&:disabled": { opacity: 0.8 },
                      borderRadius: "5px",
                      p: "5px 10px",
                      mt: 1,
                    }}
                    onClick={() => {
                      localStorage.clear();
                      setTooltipOpen(true);
                      setButtonDisabled(true);
                      setTimeout(() => {
                        setTooltipOpen(false);
                      }, 5000);
                    }}
                  >
                    <Typography
                      fontFamily={theme.typography.fontFamily}
                      variant="subtitle2"
                      sx={{ textTransform: "none" }}
                      fontWeight="600"
                      color={theme.palette.text.primary}
                    >
                      Clear local storage
                    </Typography>
                  </Button>
                </Tooltip>
              </>
            </Toggle>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default AboutModal;
