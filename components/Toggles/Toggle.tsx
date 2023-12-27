import { Box } from "@mui/material";
import { SxProps, styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useState } from "react";
import CustomParagraph from "../EditorJS/Renderers/CustomParagraph";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ExpandMore } from "@mui/icons-material";

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

const Toggle = (props: {
  open?: boolean;
  handleClick?: () => void;
  title: string;
  children: JSX.Element;
  accordionSx?: SxProps;
  boxSx?: SxProps;
}) => {
  return (
    <Box
      sx={{ my: 1, ...props.boxSx }}
      display="flex"
      flexDirection="column"
      textAlign="center"
    >
      <Accordion
        expanded={props.open}
        onChange={props.handleClick}
        sx={{ ...props.accordionSx }}
      >
        <AccordionSummary aria-controls="toggle text">
          <CustomParagraph
            data={{ text: props.title }}
            style={null}
            config={null}
            classNames={null}
          />
        </AccordionSummary>
        <AccordionDetails>{props.children}</AccordionDetails>
      </Accordion>
    </Box>
  );
};
export default Toggle;
