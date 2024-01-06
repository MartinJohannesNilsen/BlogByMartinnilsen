import { Option as BaseOption, optionClasses } from "@mui/base/Option";
import { Popper as BasePopper } from "@mui/base/Popper";
import { Select as BaseSelect, selectClasses, SelectProps, SelectRootSlotProps } from "@mui/base/Select";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import { styled } from "@mui/system";
import * as React from "react";

export const UnstyledSelect = (props: { value: number; setValue: (value: number) => void }) => {
	return (
		<Select defaultValue={props.value} onChange={(_, newValue: number) => props.setValue(newValue)}>
			<Option value={7}>Last 7 days</Option>
			<Option value={14}>Last 14 days</Option>
			<Option value={30}>Last 30 days</Option>
			<Option value={180}>Last 180 days</Option>
			<Option value={365}>Last 365 days</Option>
		</Select>
	);
};

const Select = React.forwardRef(function CustomSelect<TValue extends {}, Multiple extends boolean>(
	props: SelectProps<TValue, Multiple>,
	ref: React.ForwardedRef<HTMLButtonElement>
) {
	const slots = {
		root: StyledButton,
		listbox: Listbox,
		popper: Popper,
		...props.slots,
	};

	return <BaseSelect {...props} ref={ref} slots={slots} />;
});

const blue = {
	100: "#DAECFF",
	200: "#99CCF3",
	400: "#3399FF",
	500: "#007FFF",
	600: "#0072E5",
	700: "#0059B2",
	900: "#003A75",
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

const Button = React.forwardRef(function Button<TValue extends {}, Multiple extends boolean>(
	props: SelectRootSlotProps<TValue, Multiple>,
	ref: React.ForwardedRef<HTMLButtonElement>
) {
	const { ownerState, ...other } = props;
	return (
		<button type="button" {...other} ref={ref}>
			{other.children}
			<UnfoldMoreRoundedIcon />
		</button>
	);
});

const StyledButton = styled(Button, { shouldForwardProp: () => true })(
	({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  min-width: 320px;
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
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 320px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === "dark" ? theme.palette.grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[200]};
  color: ${theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[900]};
  box-shadow: 0px 2px 4px ${theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"};
  `
);

const Option = styled(BaseOption)(
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

const Popper = styled(BasePopper)`
	z-index: 1400;
`;

export default UnstyledSelect;
