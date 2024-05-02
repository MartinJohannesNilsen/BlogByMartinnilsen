"use client";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Box } from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import { SxProps, styled } from "@mui/material/styles";
import { MutableRefObject } from "react";
import CustomParagraph from "../EditorJS/Renderers/CustomParagraph";
import colors from "../../styles/colors";

// Accordion styled
export const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	textAlign: "left",
	// backgroundColor: theme.palette.background.paper,
	backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
	borderRadius: 5,
}));
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: "transparent",
	flexDirection: "row-reverse",
	"& .MuiAccordionSummary-expandIconWrapper": {
		color: theme.palette.mode === "dark" ? colors.white : colors.black,
	},
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
	ref?: MutableRefObject<any>;
}) => {
	return (
		<Box sx={{ my: 1, ...props.boxSx }} ref={props.ref} display="flex" flexDirection="column" textAlign="center">
			<Accordion expanded={props.open} onChange={props.handleClick} sx={{ ...props.accordionSx }}>
				<AccordionSummary aria-controls="toggle text">
					<CustomParagraph data={{ text: props.title }} />
				</AccordionSummary>
				<AccordionDetails sx={{ paddingTop: 0, paddingBottom: 1 }}>{props.children}</AccordionDetails>
			</Accordion>
		</Box>
	);
};
export default Toggle;
