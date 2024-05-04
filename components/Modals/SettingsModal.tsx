"use client";
import { Close, Gradient, Square } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { withStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { BlockPicker } from "react-color";
import { isMobile } from "react-device-detect";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { SettingsModalProps } from "../../types";
import StyledControlledSelect, { SelectOption } from "../StyledMUI/StyledControlledSelect";
import { CustomSwitchNew as Switch } from "../Switch/Switch";

const defaultFonts = [
	{ title: "Cabinet Grotesk", font: "Cabinet Grotesk" },
	// { title: "Chillax", font: "Chillax" },
	{ title: "Consolas", font: "Consolas, monospace" },
	{ title: "General Sans", font: "General Sans" },
	{ title: "Gotham Pro", font: "Gotham Pro, montserrat" },
	{ title: "Luminari", font: "Luminari, sans-serif" },
	{ title: "Merriweather", font: "Merriweather" },
	{ title: "Source Sans Pro", font: "Source Sans Pro, calibri" },
	// { title: "Stardom", font: "Stardom" },
	{
		title: "System font",
		font: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
	},
	{ title: "Zodiak", font: "Zodiak" },
];

const defaultColors = [
	{ title: "Beige", color: "#e9b384" },
	{ title: "Crimson", color: "#f47373" },
	// { title: "Green", color: "#51a83e" },
	{ title: "Lime", color: "#37d67a" },
	{ title: "Yellow", color: "#fdd835" },
	{ title: "Orange", color: "#ff8a65" },
	{ title: "Pink", color: "#df487f" },
	{ title: "Purple", color: "#ba68c8" },
	{ title: "Teal", color: "#29939b" },
	{ title: "Custom", color: undefined },
];

const TransparentTooltip = withStyles({
	tooltip: {
		backgroundColor: "transparent",
	},
})(Tooltip);

export const SettingsModal = (props: SettingsModalProps) => {
	const { theme, setTheme, setDefaultTheme, accentColor, setAccentColor, fontFamily, setFontFamily } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const [colorPickerOpen, setColorPickerOpen] = useState(false);
	const [themeUserConfigurationExist, setThemeUserConfigurationExist] = useState<boolean>();

	const style = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 370,
		bgcolor: "background.paper",
		borderRadius: 2,
		outline: 0,
		display: "flex",
		textAlign: "left",
		flexDirection: "column",
		rowGap: "10px",
		justifyContent: "flex-start",
		boxShadow: 24,
		p: xs ? 2.5 : 4,
	};

	useEffect(() => {
		// Check if localStorage is defined (only in the browser environment)
		if (typeof window !== "undefined" && window.localStorage) {
			setThemeUserConfigurationExist(localStorage.getItem("theme") !== null);
		}
	}, [, theme]);

	return (
		<Box>
			<Modal
				open={props.open}
				onClose={() => {
					props.handleModalClose();
					setColorPickerOpen(false);
				}}
				onKeyDown={(e) => {
					e.key === "Enter" && colorPickerOpen && setColorPickerOpen(false);
				}}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<IconButton
						style={{ position: "absolute", top: "5px", right: "5px" }}
						onClick={() => {
							props.handleModalClose();
							setColorPickerOpen(false);
						}}
					>
						<Close sx={{ color: theme.palette.text.primary }} />
					</IconButton>
					<Typography
						fontFamily={theme.typography.fontFamily}
						variant="h5"
						fontWeight="800"
						color={theme.palette.text.primary}
						mb={1}
					>
						Settings
					</Typography>
					{/* Dark/light mode */}
					<Box display="flex" gap="10px">
						<Typography
							fontFamily={theme.typography.fontFamily}
							variant="body1"
							fontWeight="600"
							color={theme.palette.text.primary}
						>
							Light Mode:
						</Typography>
						<Box flexGrow="1" />
						<Box mt={-0.2} mr={-1}>
							<Switch checked={theme.palette.mode === "light"} onChange={props.handleThemeChange} />
						</Box>
						<Box mt={-0.2}>
							<Tooltip enterDelay={2000} title="Use system settings">
								<IconButton
									disabled={!themeUserConfigurationExist}
									aria-label="delete"
									size="small"
									onClick={() => {
										setDefaultTheme();
									}}
								>
									<Close
										fontSize="inherit"
										sx={{ color: themeUserConfigurationExist ? theme.palette.text.primary : undefined }}
									/>
								</IconButton>
							</Tooltip>
						</Box>
					</Box>
					{/* Font family */}
					<Box display="flex" mt={0.4} alignItems="baseline">
						<Typography
							mt={0.8}
							fontFamily={theme.typography.fontFamily}
							variant="body1"
							fontWeight="600"
							color={theme.palette.text.primary}
						>
							Font Family:
						</Typography>
						<Box flexGrow="1" />
						<StyledControlledSelect
							value={fontFamily}
							setValue={(value) => {
								setFontFamily(value);
								setTheme(theme.palette.mode === "dark" ? ThemeEnum.Dark : ThemeEnum.Light);
							}}
						>
							{defaultFonts.map((element) => (
								<SelectOption value={element.font}>
									<Typography sx={{ fontFamily: element.font, fontWeight: 400 }}>{element.title}</Typography>
								</SelectOption>
							))}
						</StyledControlledSelect>
					</Box>
					{/* Accent color */}
					<Box display="flex" mt={0.2}>
						<Typography
							mt={0.8}
							fontFamily={theme.typography.fontFamily}
							variant="body1"
							fontWeight="600"
							color={theme.palette.text.primary}
						>
							Accent color:
						</Typography>
						<Box flexGrow="1" />
						<TransparentTooltip
							PopperProps={{
								disablePortal: true,
							}}
							open={colorPickerOpen}
							disableFocusListener
							disableHoverListener
							disableTouchListener
							placement={isMobile ? "top" : "bottom"}
							title={
								<BlockPicker
									triangle={isMobile ? "hide" : "top"}
									colors={null}
									color={accentColor}
									onChange={(color, event) => {
										setAccentColor(color.hex);
										setTheme(theme.palette.mode === "dark" ? ThemeEnum.Dark : ThemeEnum.Light, true);
									}}
								/>
							}
						>
							<Box>
								<StyledControlledSelect
									value={accentColor}
									setValue={(value) => {
										if (value === undefined || value) {
											setAccentColor(value);
											setTheme(theme.palette.mode === "dark" ? ThemeEnum.Dark : ThemeEnum.Light);
										}
									}}
								>
									{defaultColors.map((element: { title: string; color?: string }, index: number) => (
										<SelectOption
											value={element.color}
											onClick={() => {
												// element.title === "Custom" ? setColorPickerOpen(true) :  ;
												setColorPickerOpen(element.title === "Custom");
											}}
										>
											<Box display="flex" alignItems="center" gap={0.25}>
												{element.color ? (
													<Square sx={{ color: element.color }} />
												) : (
													<Gradient
														sx={{
															color: !defaultColors.some((obj) => obj.color === accentColor)
																? accentColor
																: theme.palette.text.primary,
														}}
													/>
												)}

												<Typography sx={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "0.875rem" }}>
													{element.title}
												</Typography>
											</Box>
										</SelectOption>
									))}
								</StyledControlledSelect>
							</Box>
						</TransparentTooltip>
					</Box>
					{/* Clear localstorage */}
					<Box display="flex" mt={0.2}>
						<Typography
							mt={0.8}
							fontFamily={theme.typography.fontFamily}
							variant="body1"
							fontWeight="600"
							color={theme.palette.text.primary}
						>
							Remove data:
						</Typography>
						<Box flexGrow="1" />

						<Button
							// disabled={buttonDisabled}
							sx={{
								border: "1px solid " + theme.palette.error.main,
								backgroundColor: theme.palette.primary.main,
								"&:hover": { backgroundColor: theme.palette.error.main },
								"&:disabled": { opacity: 0.8 },
								borderRadius: "5px",
								p: "5px 10px",
								mt: 0.4,
							}}
							onClick={() => {
								localStorage.clear();
							}}
						>
							<Typography
								fontFamily={theme.typography.fontFamily}
								variant="subtitle2"
								sx={{ textTransform: "none" }}
								fontWeight="600"
								color={theme.palette.text.primary}
							>
								Clear local storage
							</Typography>
						</Button>
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};
export default SettingsModal;
