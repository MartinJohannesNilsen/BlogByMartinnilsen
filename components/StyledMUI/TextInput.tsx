import { Input as BaseInput, InputProps } from "@mui/base/Input";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { TextField } from "@mui/material";
import { withStyles } from "@mui/styles";
import { styled } from "@mui/system";
import * as React from "react";

// Textfield
export const StyledTextField = withStyles((theme) => ({
	root: {
		"& label": {
			color: "#808080",
		},
		"& label.Mui-focused": {
			color: "#2684FF",
		},
		"& .MuiOutlinedInput-root": {
			paddingTop: "8px",
			paddingBottom: "8px",
			paddingLeft: "10px",
			paddingRight: "10px",
			borderColor: "#CCCCCC",
			"& fieldset": {
				borderColor: "#CCCCCC",
			},
			"&:hover fieldset": {
				borderColor: "#B3B3B3",
			},
			"&.Mui-focused fieldset": {
				borderColor: "#2684FF",
			},
		},
	},
}))(TextField);

// Textarea
const TextAreaInput = React.forwardRef(function CustomInput(
	props: InputProps,
	ref: React.ForwardedRef<HTMLDivElement>
) {
	return (
		<BaseInput
			slots={{
				root: RootDiv,
				input: "input",
				textarea: TextareaElement,
			}}
			{...props}
			ref={ref}
		/>
	);
});
export function InputMultilineAutosize() {
	return <TextAreaInput aria-label="Demo input" multiline placeholder="Type something…" />;
}
const blue = {
	100: "#DAECFF",
	200: "#80BFFF",
	400: "#3399FF",
	500: "#007FFF",
	600: "#0072E5",
	700: "#0059B2",
};
const grey = {
	50: "#F3F6F9",
	100: "#E5EAF2",
	200: "#DAE2ED",
	300: "#C7D0DD",
	400: "#B0B8C4",
	500: "#9DA8B7",
	600: "#6B7A90",
	700: "#434D5B",
	800: "#303740",
	900: "#1C2025",
};
const RootDiv = styled("div")`
	display: flex;
	max-width: 100%;
`;
const TextareaElement = styled(TextareaAutosize)(
	({ theme }) => `
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5rem;
  padding: 8px 12px;
  border-radius: 8px 8px 0 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? blue[500] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);
