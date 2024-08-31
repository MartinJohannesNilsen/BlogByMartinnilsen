"use client";
import { styled } from "@mui/material";
import Switch, { SwitchProps } from "@mui/material/Switch";
import withStyles from "@mui/styles/withStyles";

export const CustomSwitch = withStyles((theme) => ({
	root: {
		width: 45,
		height: 20,
		padding: "0 0 0 1px",
		margin: theme.spacing(1),
	},
	switchBase: {
		padding: 1,
		color: "white",
		"&$checked": {
			transform: "translateX(24px)",
			color: "white",
			"& + $track": {
				opacity: 1,
				backgroundColor: "white", //checked track color
				borderColor: "grey", //checked border color
			},
		},
	},
	thumb: {
		boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.75)",
		width: 18,
		height: 18,
		margin: "0 0 0 1px",
	},
	track: {
		border: `1px solid grey`,
		borderRadius: 26 / 2,
		opacity: 1,
		backgroundColor: "#000",
	},
	checked: {},
}))(Switch);

export const IOSSwitch = styled((props: SwitchProps) => (
	<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
	width: 42,
	height: 26,
	padding: 0,
	"& .MuiSwitch-switchBase": {
		padding: 0,
		margin: 2,
		transitionDuration: "300ms",
		"&.Mui-checked": {
			transform: "translateX(16px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
				opacity: 1,
				border: 0,
			},
			"&.Mui-disabled + .MuiSwitch-track": {
				opacity: 0.5,
			},
		},
		"&.Mui-focusVisible .MuiSwitch-thumb": {
			color: "#33cf4d",
			border: "6px solid #fff",
		},
		"&.Mui-disabled .MuiSwitch-thumb": {
			color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
		},
		"&.Mui-disabled + .MuiSwitch-track": {
			opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
		},
	},
	"& .MuiSwitch-thumb": {
		boxSizing: "border-box",
		width: 22,
		height: 22,
	},
	"& .MuiSwitch-track": {
		borderRadius: 26 / 2,
		backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
		opacity: 1,
		transition: theme.transitions.create(["background-color"], {
			duration: 500,
		}),
	},
}));

export const CustomSwitchNew = styled((props: SwitchProps) => (
	<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
	width: 36,
	height: 20,
	padding: 0,
	"& .MuiSwitch-switchBase": {
		padding: 0,
		margin: 2,
		transitionDuration: "300ms",
		"&.Mui-checked": {
			transform: "translateX(16px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				// backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
				backgroundColor: theme.palette.secondary.main,
				// backgroundColor: theme.palette.grey[300]
				opacity: 1,
				border: 0,
			},
			"&.Mui-disabled + .MuiSwitch-track": {
				opacity: 0.5,
			},
		},
		"&.Mui-focusVisible .MuiSwitch-thumb": {
			color: "#33cf4d",
			border: "6px solid #fff",
		},
		"&.Mui-disabled .MuiSwitch-thumb": {
			color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
		},
		"&.Mui-disabled + .MuiSwitch-track": {
			opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
		},
	},
	"& .MuiSwitch-thumb": {
		boxSizing: "border-box",
		width: 16,
		height: 16,
	},
	"& .MuiSwitch-track": {
		borderRadius: 26 / 2,
		backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
		// backgroundColor: theme.palette.mode === "light" ? "black" : "black",
		opacity: 1,
		transition: theme.transitions.create(["background-color"], {
			duration: 500,
		}),
	},
}));

export default CustomSwitchNew;
