import { Close } from "@mui/icons-material";
import { IconButton, Link, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ModalProps } from "../../types";
import CustomParagraph from "../EditorJS/Renderers/CustomParagraph";
import Toggle from "../Toggles/Toggle";

export const AboutModal = (props: ModalProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: xs ? 370 : 500,
    maxHeight: "90vh",
    bgcolor: "background.paper",
    borderRadius: 2,
    outline: 0,
    display: "flex",
    textAlign: "left",
    flexDirection: "column",
    rowGap: "10px",
    justifyContent: "flex-start",
    boxShadow: 24,
    overflow: "scroll",
    p: 4,
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
            <Toggle
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
                    text: "<a href='https://firebase.google.com'>Firebase</a>, a product by Google, is used for storing posts. These are fetched during NextJS revalidation, only happening when the blog is built or the author create or updates a post. ",
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
                    text: "<a href='https://github.com'>GitHub</a> is used only for authenticating users. Only the elements 'email', 'name' and 'icon' will be accessed.",
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
                    text: "<a href='https://www.google.com/'>Google</a> is used only for authenticating users. Only the elements 'email', 'name' and 'icon' will be accessed.",
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
            <Toggle
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
              }}
            >
              <>
                <CustomParagraph
                  data={{
                    text: "Except for view counts, all data is stored entirely on each visitor's machine. Utilizing local storage, these fields are utilized specifically:",
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
                    text: "<ul><li><code>theme</code>: Configured theme instead of system default</li><li><code>cardLayout</code>: Card layout on landing page</li><li><code>lastRead</code>: Date as number for notifications</li><li><code>notificationsRead</code>: List of read notification ids</li><li><code>notificationFilterDays</code>: Filter notifications</li></ul>",
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
                    text: "These will be cleared if you clear your browsing data. If you want to, you can clear the local storage by pressing this button:",
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
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default AboutModal;
