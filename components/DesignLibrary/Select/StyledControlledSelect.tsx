"use client";
import { Option as BaseOption, optionClasses } from "@mui/base/Option";
import { Select as BaseSelect, selectClasses, SelectProps, SelectRootSlotProps } from "@mui/base/Select";
import { UnfoldMoreRounded } from "@mui/icons-material";
import { styled } from "@mui/system";
import * as React from "react";
import { SelectContentProps } from "../../../types";

export default function StyledControlledSelect(props: SelectContentProps) {
	return (
		<Select defaultValue={props.value} onChange={(_, newValue) => props.setValue(newValue)}>
			{props.children}
		</Select>
	);
}

function Select(props: SelectProps<number, false>) {
	const slots: SelectProps<number, false>["slots"] = {
		root: StyledButton,
		listbox: Listbox,
		popup: Popup,
		...props.slots,
	};

	return <BaseSelect {...props} slots={slots} />;
}

const CustomButton = React.forwardRef(function CustomButton(
	props: SelectRootSlotProps<number, false>,
	ref: React.ForwardedRef<HTMLButtonElement>
) {
	const { ownerState, ...other } = props;
	return (
		<button
			type="button"
			{...other}
			ref={ref}
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				minWidth: "160px",
			}}
		>
			<span>{other.children}</span>
			<UnfoldMoreRounded />
		</button>
	);
});

const StyledButton = styled(CustomButton, { shouldForwardProp: () => true })(
	({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    // min-width: 336px;
    padding: 8px 12px;
    border-radius: 8px;
    text-align: left;
    line-height: 1.5;
    background: ${theme.palette.mode === "dark" ? theme.palette.grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[200]};
    color: ${theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[900]};
    position: relative;
    box-shadow: 0px 2px 4px ${theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"};
  
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50]};
      border-color: ${theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[300]};
      cursor: 'pointer';
    }
  
    &.${selectClasses.focusVisible} {
      outline: 0;
      border-color: ${theme.palette.grey[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[200]};
    }
  
    & > svg {
      font-size: 1rem;
      position: absolute;
      height: 100%;
      top: 0;
      right: 10px;
    }
    `
);

const Listbox = styled("ul")(
	({ theme }) => `
  height: 250px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  // min-width: 336px;
  min-width: 160px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === "dark" ? theme.palette.grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[200]};
  color: ${theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[900]};
  box-shadow: 0px 2px 4px ${theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"};
  `
);

export const SelectOption = styled(BaseOption)(
	({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionClasses.selected} {
    background-color: ${theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100]};
    color: ${theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.grey[900]};
  }

  &.${optionClasses.highlighted} {
    background-color: ${theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100]};
    color: ${theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[900]};
  }

  &:focus-visible {
    outline: 3px solid ${theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[200]};
  }
  
  &.${optionClasses.highlighted}.${optionClasses.selected} {
    background-color: ${theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100]};
    color: ${theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.grey[900]};
  }

  &.${optionClasses.disabled} {
    color: ${theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400]};
  }

  &:hover:not(.${optionClasses.disabled}) {
    background-color: ${theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100]};
    color: ${theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[900]};
  }
  `
);

const Popup = styled("div")`
	z-index: 1400;
`;

// const Paragraph = styled("p")(
// 	({ theme }) => `
//   font-family: 'IBM Plex Sans', sans-serif;
//   font-size: 0.875rem;
//   margin: 10px 0;
//   color: ${theme.palette.mode === "dark" ? grey[400] : grey[700]};
//   `
// );
