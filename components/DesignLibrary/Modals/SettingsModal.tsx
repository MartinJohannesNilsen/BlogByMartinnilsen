"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import StyledControlledSelect, { SelectOption } from "@/components/DesignLibrary/Select/StyledControlledSelect";
import { CustomSwitchNew as Switch } from "@/components/DesignLibrary/Switch/Switch";
import { useTheme } from "@/styles/themes/ThemeProvider";
import {
	defaultAccentColorDark,
	defaultAccentColorLight,
	defaultFontFamilyVariable,
	getFontFamilyFromVariable,
} from "@/styles/themes/themeDefaults";
import { ThemeEnum } from "@/styles/themes/themeMap";
import { SettingsModalProps } from "@/types";
import { Close, Gradient, Square } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { withStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { BlockPicker } from "react-color";
import { BiMinus, BiPlus } from "react-icons/bi";

const defaultFonts = [
	{
		title: "System font",
		font: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
	},
	{ title: "Bricolage", font: "--font-bricolage-grotesque" },
	{ title: "Cabinet Grotesk", font: "--font-cabinet-grotesk" },
	{ title: "Fira Code", font: "--font-fira-code" },
	{ title: "Medieval Sharp", font: "--font-medieval-sharp" },
	{ title: "Merriweather", font: "--font-merriweather" },
	{ title: "Montserrat", font: "--font-montserrat" },
	{ title: "Noto Sans Display", font: "--font-noto-sans-display" },
	{ title: "Noto Serif", font: "--font-noto-serif" },
	{ title: "Open Sans", font: "--font-open-sans" },
	{ title: "Playfair Display", font: "--font-playfair-display" },
	{ title: "Rubik", font: "--font-rubik" },
	{ title: "Source Sans", font: "--font-source-sans-3" },
	{ title: "Zodiak", font: "--font-zodiak" },
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
	const [defaultColors, setDefaultColors] = useState<{ title: string; color?: string }[]>([]);
	const [themeUserConfigurationExist, setThemeUserConfigurationExist] = useState<boolean>();

	// Modal style
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
		p: xs ? "20px 10px 20px 20px" : "20px 10px 20px 20px",
	};

	useEffect(() => {
		// Check if localStorage is defined (only in the browser environment)
		if (typeof window !== "undefined" && window.localStorage) {
			setThemeUserConfigurationExist(localStorage.getItem("theme") !== null);
		}
		setDefaultColors([
			{ title: "Custom", color: undefined },
			{
				title: "Contrast",
				color: theme.palette.mode == "dark" ? defaultAccentColorDark.hex : defaultAccentColorLight.hex,
			},
			{ title: "Beige", color: "#e9b384" },
			{ title: "Crimson", color: "#f47373" },
			{ title: "Lime", color: "#37d67a" },
			{ title: "Yellow", color: "#fdd835" },
			{ title: "Orange", color: "#ff8a65" },
			{ title: "Pink", color: "#df487f" },
			{ title: "Purple", color: "#ba68c8" },
			{ title: "Teal", color: "#29939b" },
		]);
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
					{/* Close button */}
					<IconButton
						style={{ position: "absolute", top: "5px", right: "5px" }}
						onClick={() => {
							props.handleModalClose();
							setColorPickerOpen(false);
						}}
					>
						<Close sx={{ color: theme.palette.text.primary }} />
					</IconButton>
					{/* Title */}
					<Typography
						fontFamily={theme.typography.fontFamily}
						variant="h5"
						fontWeight="800"
						color={theme.palette.text.primary}
						mb={1}
						fontSize={"1.5rem"}
						sx={{ userSelect: "none" }}
					>
						Settings
					</Typography>
					{/* Dark/light mode */}
					<Box display="flex" gap="10px" alignItems="center" sx={{ height: "32px" }}>
						<Typography
							fontFamily={theme.typography.fontFamily}
							variant="body1"
							fontWeight="600"
							color={theme.palette.text.primary}
							fontSize={"1rem"}
							sx={{ userSelect: "none" }}
						>
							Light Mode:
						</Typography>
						<Box flexGrow="1" />
						<Box mr={-1} display="flex" justifyContent="center" alignItems="center">
							<Switch checked={theme.palette.mode === "light"} onChange={props.handleThemeChange} />
						</Box>
						<Box display="flex" alignItems="center">
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
										sx={{
											fontSize: "1rem",
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
					<Box display="flex" gap="10px" mt={1} sx={{ height: "28px" }}>
						<Typography
							fontFamily={theme.typography.fontFamily}
							variant="body1"
							fontWeight="600"
							color={theme.palette.text.primary}
							fontSize={"1rem"}
							sx={{ userSelect: "none" }}
						>
							Text size:
						</Typography>
						<Box flexGrow="1" />
						<Box mt={-0.2} mr={-1} gap="4px" display="flex" alignItems="center">
							<Typography
								variant="body2"
								fontFamily={theme.typography.fontFamily}
								fontWeight="400"
								color={theme.palette.text.primary}
								fontSize={"0.8rem"}
								sx={{ mr: 0.5, userSelect: "none" }}
							>
								{(Number(fontScale) * 100).toFixed(0)}%
							</Typography>
							<NavbarButton
								disabled={fontScale === "0.6"}
								variant="outline"
								onClick={() => {
									setFontScale(`${(Number(fontScale) - 0.1).toFixed(1)}`);
								}}
								icon={BiMinus}
								tooltip="Decrease text size"
								sxButton={{
									height: "28px",
									width: "28px",
									borderRadius: 2,
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
								tooltip="Increase text size"
								sxButton={{
									height: "28px",
									width: "28px",
									borderRadius: 2,
								}}
								styleIcon={{ height: "18px", width: "18px", opacity: fontScale === "1.5" ? "0.5" : "1" }}
							/>
						</Box>
						<Box display="flex" alignItems="center">
							<Tooltip enterDelay={2000} title="Use default settings">
								<IconButton
									disabled={["1", "1.0"].includes(fontScale)}
									aria-label="delete"
									size="small"
									onClick={() => {
										setFontScale("1");
									}}
								>
									<Close
										sx={{
											fontSize: "1rem",
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
					<Box display="flex" mt={0.4} alignItems="center">
						<Typography
							fontFamily={theme.typography.fontFamily}
							variant="body1"
							fontWeight="600"
							color={theme.palette.text.primary}
							fontSize={"1rem"}
							sx={{ userSelect: "none" }}
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
							{defaultFonts.map((element, index) => (
								<SelectOption value={element.font} key={index}>
									<Typography
										sx={{ fontFamily: getFontFamilyFromVariable(element.font), fontWeight: 400, fontSize: "0.875rem" }}
									>
										{element.title}
									</Typography>
								</SelectOption>
							))}
						</StyledControlledSelect>
						<Box display="flex" alignItems="center" ml={"2px"}>
							<Tooltip enterDelay={2000} title="Use default settings">
								<IconButton
									disabled={fontFamily === defaultFontFamilyVariable}
									aria-label="delete"
									size="small"
									onClick={() => {
										setFontFamily(defaultFontFamilyVariable);
									}}
								>
									<Close
										sx={{
											fontSize: "1rem",
											color:
												fontFamily === defaultFontFamilyVariable
													? theme.palette.text.primary + "40"
													: theme.palette.text.primary,
										}}
									/>
								</IconButton>
							</Tooltip>
						</Box>
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
							sx={{ userSelect: "none" }}
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
							// placement={isMobile ? "top" : "bottom"}
							title={
								<BlockPicker
									// triangle={isMobile ? "hide" : "top"}
									triangle={"hide"}
									colors={null}
									color={accentColor}
									onChange={(color, event) => {
										if (color.hex) {
											setAccentColor(color.hex);
											setTheme(theme.palette.mode === "dark" ? ThemeEnum.Dark : ThemeEnum.Light, true);
										}
									}}
								/>
							}
						>
							<Box display="flex" alignItems="center">
								<Box onClick={() => setColorPickerOpen(false)}>
									<StyledControlledSelect
										width="117px"
										value={accentColor}
										setValue={(value) => {
											if (value) {
												setAccentColor(value);
												setTheme(theme.palette.mode === "dark" ? ThemeEnum.Dark : ThemeEnum.Light);
											}
										}}
									>
										{defaultColors.map((element: { title: string; color?: string }, index: number) => (
											<SelectOption value={element.color} key={index}>
												<Box display="flex" alignItems="center" gap={0.25}>
													<Square sx={{ color: element.color }} />
													<Typography sx={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "0.875rem" }}>
														{element.title}
													</Typography>
												</Box>
											</SelectOption>
										))}
									</StyledControlledSelect>
								</Box>

								<NavbarButton
									variant="outline"
									onClick={() => setColorPickerOpen(!colorPickerOpen)}
									icon={Gradient}
									tooltip="Set custom color"
									sxButton={{
										height: "39px",
										width: "39px",
										ml: "3px",
										background: theme.palette.mode === "dark" ? theme.palette.grey[900] : "#fff",
										border: `1px solid ${
											theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[200]
										}`,
										color: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[900],
										boxShadow: `0px 2px 4px ${
											theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
										}`,
										"&:hover": {
											background: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
											borderColor: theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[300],
										},
										"&:focus": {
											background: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
											borderColor: theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[300],
										},
									}}
									sxIcon={{
										height: "24px",
										width: "24px",
										color: accentColor,
									}}
								/>
								<Box display="flex" alignItems="center" ml={"2px"}>
									<Tooltip enterDelay={2000} title="Use default settings">
										<IconButton
											disabled={
												(theme.palette.mode === "dark" && accentColor === defaultAccentColorDark.hex) ||
												(theme.palette.mode === "light" && accentColor === defaultAccentColorLight.hex)
											}
											aria-label="delete"
											size="small"
											onClick={() => {
												if (theme.palette.mode === "dark") {
													setAccentColor(defaultAccentColorDark.hex);
													setTheme(ThemeEnum.Dark);
												} else {
													setAccentColor(defaultAccentColorLight.hex);
													setTheme(ThemeEnum.Light);
												}
												setColorPickerOpen(false);
											}}
										>
											<Close
												sx={{
													fontSize: "1rem",
													color:
														(theme.palette.mode === "dark" && accentColor === defaultAccentColorDark.hex) ||
														(theme.palette.mode === "light" && accentColor === defaultAccentColorLight.hex)
															? theme.palette.text.primary + "40"
															: theme.palette.text.primary,
												}}
											/>
										</IconButton>
									</Tooltip>
								</Box>
							</Box>
						</TransparentTooltip>
					</Box>
					{/* Clear localstorage */}
					<Box display="flex" mt={0.2} mr={"28px"}>
						<Typography
							mt={0.8}
							fontFamily={theme.typography.fontFamily}
							variant="body1"
							fontWeight="600"
							color={theme.palette.text.primary}
							fontSize={"1rem"}
							sx={{ userSelect: "none" }}
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
