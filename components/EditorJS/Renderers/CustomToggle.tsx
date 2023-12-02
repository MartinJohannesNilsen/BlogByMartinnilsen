import { Box, Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import ReactPlayer from "react-player/lazy";
import { useTheme } from "../../../ThemeProvider";
import { EditorjsRendererProps } from "../../../types";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useMemo, useState } from "react";
import Output from "editorjs-react-renderer";
import {
  processJsonToggleBlocks,
  renderers,
} from "../../../pages/posts/[postId]";
import { style } from "../Style";
import CustomParagraph from "./CustomParagraph";

// Accordion styled
export const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  textAlign: "left",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 5,
}));
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "transparent",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({}));

const CustomToggle = (props: EditorjsRendererProps) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(props.data.status === "open");

  const handleChange = (event: React.SyntheticEvent) => {
    setOpen(!open);
  };

  const OutputElement = useMemo(() => {
    if (props && props.data) {
      const processedData = processJsonToggleBlocks(props.data);
      return (
        <Output
          renderers={renderers}
          data={processedData}
          style={style(theme)}
        />
      );
    }
    return null;
  }, [props]);

  return (
    <Box my={1} display="flex" flexDirection="column" textAlign="center">
      <Accordion expanded={open} onChange={handleChange}>
        <AccordionSummary aria-controls="toggle text">
          <CustomParagraph
            data={{ text: props.data.text }}
            style={null}
            config={null}
            classNames={null}
          />
        </AccordionSummary>
        <AccordionDetails>{OutputElement}</AccordionDetails>
      </Accordion>
    </Box>
  );
};
export default CustomToggle;
