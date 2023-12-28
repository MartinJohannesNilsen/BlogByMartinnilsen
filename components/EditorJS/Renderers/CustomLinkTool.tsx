import {
  Box,
  Card,
  CardActionArea,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";

const CustomLinkTool = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const containerWidth = xs ? 380 - 16 * 2 : sm ? 500 - 16 * 2 : 700 - 16 * 2;

  return (
    <Box
      my={1}
      display="flex"
      width="100%"
      flexDirection="column"
      textAlign="center"
    >
      <Card
        elevation={0}
        sx={{
          display: "flex",
          height: props.data.link! ? "150px" : "120px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 8px",
          border:
            "1px solid" +
            (theme.palette.mode === "dark"
              ? theme.palette.grey[700]
              : theme.palette.grey[200]),
        }}
      >
        <CardActionArea
          href={props.data.link!}
          sx={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.grey[0],
          }}
        >
          <Box display="flex" alignItems="center">
            <Box
              display="flex"
              flexDirection="column"
              sx={{
                textAlign: "left",
                width: (containerWidth / 5) * 3.5,
              }}
              px={1.5}
            >
              <Typography
                variant="subtitle1"
                fontWeight={800}
                fontFamily={theme.typography.fontFamily}
                sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {props.data.meta?.title}
              </Typography>
              <Typography
                variant="subtitle2"
                fontWeight={400}
                fontFamily={theme.typography.fontFamily}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "webkit-flex",
                  WebkitLineClamp: 3,
                  lineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {props.data.meta?.description}
              </Typography>
              {props.data.link ? (
                <Typography
                  mt={1}
                  variant="subtitle2"
                  fontWeight={600}
                  fontFamily={theme.typography.fontFamily}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "webkit-flex",
                    WebkitLineClamp: 1,
                    lineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    color: theme.palette.secondary.main,
                  }}
                >
                  {new URL(props.data.link).hostname}
                </Typography>
              ) : (
                <></>
              )}
            </Box>
            <Box flexGrow={100} />
            <img
              style={{
                height: props.data.meta?.image ? "150px" : "120px",
                width: (containerWidth / 5) * 1.5,
                objectFit: "cover",
              }}
              src={props.data.meta?.image}
            />
          </Box>
        </CardActionArea>
      </Card>
    </Box>
  );
};
export default CustomLinkTool;
