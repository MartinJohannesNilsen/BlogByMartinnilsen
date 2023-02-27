import { Box, Typography, useMediaQuery } from "@mui/material";
import { EditorjsRendererProps } from "../../../types";
import { useTheme } from "../../../ThemeProvider";
import DOMPurify from "isomorphic-dompurify";

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
          variant="h6"
          fontWeight="400"
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
          variant="body1"
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
