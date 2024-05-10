"use client";
import dark from "@/styles/themes/dark";
import light from "@/styles/themes/light";
import { Box, Button, Modal, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../../styles/themes/themeMap";
import { ModalProps } from "../../../types";
import { NavbarButton } from "../Buttons/NavbarButton";
import { getFontFamilyFromVariable } from "@/styles/themes/themeDefaults";

export const SimpleTextModal = ({ open, handleModalOpen, handleModalClose }: ModalProps) => {
	const { theme, setTheme, fontScale, setFontScale } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));

	const style = {
		position: "absolute" as "absolute",
		bottom: "0",
		right: "0",
		width: "100%",
		bgcolor: theme.palette.mode == "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
		borderRadius: "5px 5px 0px 0px",
		outline: 0,
		display: "flex",
		flexDirection: "row",
		rowGap: "10px",
		justifyContent: "flex-start",
		// boxShadow: 24,
		p: "12px 18px",
	};

	return (
		<Box>
			<Modal
				open={open}
				onClose={() => {
					handleModalClose();
				}}
				// hideBackdrop
				slotProps={{ backdrop: { style: { background: "rgba(0,0,0,0.2)", userSelect: "none" } } }}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style} display="flex">
					{/* Theme */}
					<Box
						display="flex"
						flexDirection="column"
						justifyContent="center"
						alignItems="flex-start"
						sx={{ width: "100%" }}
					>
						{/* Text */}
						<Box pb={1}>
							<Typography
								variant="body2"
								fontWeight="500"
								color={theme.palette.text.primary}
								fontSize={"0.9rem"}
								sx={{ userSelect: "none", fontFamily: getFontFamilyFromVariable("--font-open-sans") }}
							>
								Background Color
							</Typography>
						</Box>
						<Box display="flex" gap="5px">
							<Tooltip enterDelay={2000} title={"Change to light theme"}>
								<Button
									disableRipple
									onClick={() => {
										setTheme(ThemeEnum.Light);
									}}
									sx={{
										backgroundColor: light.palette.primary.main,
										minWidth: "44px",
										minHeight: "44px",
										borderRadius: 10,
										border: `2px solid ${theme.palette.mode == "light" ? theme.palette.secondary.main : "transparent"}`,
										"&:hover": {
											backgroundColor: light.palette.primary.main,
										},
									}}
								/>
							</Tooltip>
							<Tooltip enterDelay={2000} title={"Change to dark theme"}>
								<Button
									disableRipple
									onClick={() => {
										setTheme(ThemeEnum.Dark);
									}}
									sx={{
										backgroundColor: dark.palette.primary.main,
										minWidth: "44px",
										minHeight: "44px",
										borderRadius: 10,
										border: `2px solid ${theme.palette.mode == "dark" ? theme.palette.secondary.main : "transparent"}`,
										"&:hover": {
											backgroundColor: dark.palette.primary.main,
										},
									}}
								/>
							</Tooltip>
						</Box>
					</Box>
					<Box flexGrow={1} />
					{/* Font Scale */}
					<Box
						display="flex"
						flexDirection="column"
						justifyContent="center"
						alignItems="flex-end"
						sx={{ width: "100%" }}
					>
						<Box pb={1} sx={{ width: "100%", textAlign: "right" }}>
							<Typography
								variant="body2"
								fontWeight="500"
								color={theme.palette.text.primary}
								fontSize={"0.9rem"}
								sx={{
									userSelect: "none",
									whiteSpace: "nowrap",
									fontFamily: getFontFamilyFromVariable("--font-open-sans"),
								}}
							>
								Text size - {(Number(fontScale) * 100).toFixed(0)}%
							</Typography>
						</Box>
						<Box display="flex" gap="5px" mt="2px">
							<NavbarButton
								disabled={fontScale === "0.6"}
								variant="outline"
								onClick={() => {
									setFontScale(`${(Number(fontScale) - 0.1).toFixed(1)}`);
								}}
								icon={BiMinus}
								tooltip="Decrease text size"
								sxButton={{
									height: "40px",
									width: "40px",
									borderRadius: 2,
									backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
									"&:hover": {
										backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
									},
								}}
								styleIcon={{
									height: "20px",
									width: "20px",
									opacity: fontScale === "0.6" ? "0.5" : "1",
									color: theme.palette.text.primary,
								}}
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
									height: "40px",
									width: "40px",
									borderRadius: 2,
									backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
									"&:hover": {
										backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
									},
								}}
								styleIcon={{
									height: "20px",
									width: "20px",
									opacity: fontScale === "1.5" ? "0.5" : "1",
									color: theme.palette.text.primary,
								}}
							/>
						</Box>
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};
export default SimpleTextModal;
