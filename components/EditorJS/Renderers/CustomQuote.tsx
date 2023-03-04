import { Box, Typography, useMediaQuery } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "../../../ThemeProvider";
import { EditorjsRendererProps } from "../../../types";

const CutsomQuote = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));

  return (
    <Box display="flex" flexDirection="column" my={1} pl={1}>
      <Box
        sx={{ borderLeft: "3px solid" + theme.palette.secondary.main }}
        textAlign="left"
        pl={1.5}
      >
        <Typography
          fontFamily={theme.typography.fontFamily}
          variant="h6"
          fontWeight="400"
          color={theme.palette.text.primary}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(props.data.text!),
          }}
        />
      </Box>
      <Box
        display="flex"
        pl={2}
        mt={0.5}
        sx={{ borderLeft: "5px solid transparent" }}
      >
        <Typography
          fontFamily={theme.typography.fontFamily}
          variant="body1"
          color={theme.palette.text.primary}
          sx={{ opacity: 0.8 }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(props.data.caption!),
          }}
        />
      </Box>
    </Box>
  );
};
export default CutsomQuote;
