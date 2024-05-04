"use client";
import { buttonClasses } from "@mui/base/Button";
import { Tab as BaseTab, tabClasses } from "@mui/base/Tab";
import { TabPanel as BaseTabPanel } from "@mui/base/TabPanel";
import { Tabs as BaseTabs } from "@mui/base/Tabs";
import { TabsList as BaseTabsList } from "@mui/base/TabsList";
import { styled } from "@mui/system";

// const blue = {
// 	50: "#F0F7FF",
// 	100: "#C2E0FF",
// 	200: "#80BFFF",
// 	300: "#66B2FF",
// 	400: "#3399FF",
// 	500: "#007FFF",
// 	600: "#0072E5",
// 	700: "#0059B2",
// 	800: "#004C99",
// 	900: "#003A75",
// };

const blue = {
	50: "#000000",
	100: "#000000",
	200: "#000000",
	300: "#000000",
	400: "#000000",
	500: "#000000",
	600: "#000000",
	700: "#000000",
	800: "#000000",
	900: "#000000",
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

export const Tab = styled(BaseTab)`
	font-family: "IBM Plex Sans", sans-serif;
	color: white;
	cursor: pointer;
	font-size: 0.875rem;
	font-weight: bold;
	background-color: transparent;
	width: 100%;
	padding: 12px;
	border: none;
	border-radius: 7px;
	display: flex;
	justify-content: center;

	&:hover {
		background-color: ${blue[400]};
	}

	&:focus {
		color: #fff;
		outline: 3px solid ${blue[200]};
	}

	&.${buttonClasses.focusVisible} {
		background-color: #fff;
		color: ${blue[600]};
	}

	&.${tabClasses.disabled} {
		opacity: 0.5;
		cursor: not-allowed;
	}

	&.${tabClasses.selected} {
		background-color: #fff;
		color: ${blue[600]};
	}
`;

export const TabPanel = styled(BaseTabPanel)`
	width: 100%;
	font-family: "IBM Plex Sans", sans-serif;
	font-size: 0.875rem;
`;

export const Tabs = styled(BaseTabs)`
	display: flex;
	gap: 16px;
	width: 200px;
`;

export const TabsListHorizontal = styled(BaseTabsList)(
	({ theme }) => `
  min-width: 80px;
  background-color: ${blue[500]};
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  padding: 6px;
  gap: 6px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 8px ${theme.palette.mode === "dark" ? grey[900] : grey[200]};
  `
);

export const TabsListVertical = styled(BaseTabsList)(
	({ theme }) => `
  min-width: 80px;
  background-color: ${blue[500]};
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  padding: 6px;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 8px ${theme.palette.mode === "dark" ? grey[900] : grey[200]};
  `
);
