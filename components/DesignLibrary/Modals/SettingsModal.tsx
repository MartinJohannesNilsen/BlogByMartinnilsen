"use client";
import { getFontFamilyFromVariable } from "@/styles/fonts";
import { Close, Gradient, Square } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { withStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { BlockPicker } from "react-color";
import { isMobile } from "react-device-detect";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../../styles/themes/themeMap";
import { SettingsModalProps } from "../../../types";
import StyledControlledSelect, { SelectOption } from "../Select/StyledControlledSelect";
import { CustomSwitchNew as Switch } from "../Switch/Switch";
import CustomSlider from "../Slider/Slider";
import { NavbarButton } from "../Buttons/NavbarButton";
import { BiMinus, BiPlus } from "react-icons/bi";

const defaultFonts = [
	{ title: "Bricolage", font: "--font-bricolage-grotesque" },
	{ title: "Fira Code", font: "--font-fira-code" },
	{ title: "Open Sans", font: "--font-open-sans" },
	{ title: "Josefin Sans", font: "--font-josefin-sans" },
	{ title: "Noto Sans Display", font: "--font-noto-sans-display" },
	{ title: "Merriweather Sans", font: "--font-merriweather-sans" },
	{ title: "Noto Serif", font: "--font-noto-serif" },
	{ title: "Source Sans 3", font: "--font-source-sans-3" },
	{ title: "Playfair Display", font: "--font-playfair-display" },
	{ title: "Dancing Script", font: "--font-dancing-script" },
	{ title: "Rubik", font: "--font-rubik" },
	{ title: "Montserrat", font: "--font-montserrat" },
	{ title: "Pixelify Sans", font: "--font-pixelify" },
	{ title: "Medieval Sharp", font: "--font-medieval-sharp" },
	{ title: "Cabinet Grotesk", font: "--font-cabinet-grotesk" },
	{ title: "General Sans", font: "--font-general-sans" },
	{ title: "Merriweather", font: "--font-merriweather" },
	{ title: "Zodiak", font: "--font-zodiak" },
	{
		title: "System font",
		font: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
	},
	// { title: "General Sans", font: "General Sans" },
	// { title: "Gotham Pro", font: "Gotham Pro, montserrat" },
	// { title: "Luminari", font: "Luminari, sans-serif" },
	// { title: "Merriweather", font: "Merriweather" },
	// { title: "Source Sans Pro", font: "Source Sans Pro, calibri" },
	// { title: "Zodiak", font: "Zodiak" },
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
	const {
		theme,
		setTheme,
		setDefaultTheme,
		accentColor,
		setAccentColor,
		fontFamily,
		setFontFamily,
		fontScale,
		setFontScale,
	} = useTheme();
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
						fontSize={"1.5rem"}
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
							fontSize={"1rem"}
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
										sx={{
											color: themeUserConfigurationExist
												? theme.palette.text.primary
												: theme.palette.text.primary + "40",
										}}
									/>
								</IconButton>
							</Tooltip>
						</Box>
					</Box>
					{/* Font Scale */}
					<Box display="flex" gap="10px" mt={0.4}>
						<Typography
							fontFamily={theme.typography.fontFamily}
							variant="body1"
							fontWeight="600"
							color={theme.palette.text.primary}
							fontSize={"1rem"}
						>
							Text size:
						</Typography>
						<Box flexGrow="1" />
						<Box mt={-0.2} mr={-1} gap="10px">
							{/* <CustomSlider
								sx={{ width: "100%" }}
								aria-label="Small steps"
								defaultValue={1.0}
								// getAriaValueText={""}
								step={0.1}
								marks
								min={0.8}
								max={1.5}
								// valueLabelDisplay="auto"
								onChange={(_, value) => {
									setFontScale(`${value}`);
								}}
							/>
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography variant="body2" onClick={() => setFontScale("0.8")} sx={{ cursor: "pointer" }}>
									Aa
								</Typography>
								<Typography variant="body1" onClick={() => setFontScale("1.5")} sx={{ cursor: "pointer" }}>
									Aa
								</Typography>
							</Box> */}
							<NavbarButton
								disabled={fontScale === "0.6"}
								variant="outline"
								onClick={() => {
									setFontScale(`${(Number(fontScale) - 0.1).toFixed(1)}`);
								}}
								icon={BiMinus}
								tooltip="Share"
								sxButton={{
									height: "36px",
									width: "36px",
									mr: 0.5,
									// "&:disabled": { opacity: "0.5" },
								}}
								styleIcon={{ height: "22px", width: "24px", opacity: fontScale === "0.6" ? "0.5" : "1" }}
							/>
							<NavbarButton
								disabled={fontScale === "1.5"}
								variant="outline"
								onClick={() => {
									setFontScale(`${(Number(fontScale) + 0.1).toFixed(1)}`);
								}}
								icon={BiPlus}
								tooltip="Share"
								sxButton={{
									height: "36px",
									width: "36px",
									// "&:disabled": { opacity: "0.5" },
								}}
								styleIcon={{ height: "22px", width: "24px", opacity: fontScale === "1.5" ? "0.5" : "1" }}
							/>
						</Box>
						<Box mt={-0.2}>
							<Tooltip enterDelay={2000} title="Use system settings">
								<IconButton
									disabled={["1", "1.0"].includes(fontScale)}
									aria-label="delete"
									size="small"
									onClick={() => {
										setFontScale("1");
									}}
								>
									<Close
										fontSize="inherit"
										sx={{
											color: ["1", "1.0"].includes(fontScale)
												? theme.palette.text.primary + "40"
												: theme.palette.text.primary,
										}}
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
							fontSize={"1rem"}
						>
							Font Family:
						</Typography>
						<Box flexGrow="1" />
						<StyledControlledSelect
							value={fontFamily}
							setValue={(value) => {
								console.log(value);
								setFontFamily(value);
								setTheme(theme.palette.mode === "dark" ? ThemeEnum.Dark : ThemeEnum.Light);
							}}
						>
							{defaultFonts.map((element) => (
								<SelectOption value={element.font}>
									<Typography sx={{ fontFamily: getFontFamilyFromVariable(element.font), fontWeight: 400 }}>
										{element.title}
									</Typography>
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
							fontSize={"1rem"}
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
							fontSize={"1rem"}
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
								fontSize={"0.7rem"}
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
