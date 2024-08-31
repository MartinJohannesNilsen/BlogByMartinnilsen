"use client";
import { getFontFamilyFromVariable } from "@/styles/themes/themeDefaults";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { ButtonBarProps } from "@/types";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { isMobile } from "react-device-detect";

export const ButtonBar = (props: ButtonBarProps) => {
	const { theme } = useTheme();

	return (
		<ToggleButtonGroup
			className={props.className}
			ref={props.ref}
			sx={{
				backgroundColor: isMobile ? theme.palette.primary.main : theme.palette.primary.main + "EE",
				WebkitTransform: "translateZ(0)",
				backdropFilter: "blur(10px)",
				WebkitBackdropFilter: "blur(10px)",
				borderRadius: 5,
				boxShadow:
					theme.palette.mode == "dark"
						? "rgba(50, 50, 50, 0.2) 0px 2px 8px 0px"
						: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
				...props.sx,
			}}
		>
			{props.buttons.map((button) => (
				// @ts-ignore
				<ToggleButton
					disableFocusRipple
					sx={{
						display: "flex",
						gap: 1,
						padding: "6px 12px",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 5,
						border: "1px solid" + (theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[200]),
						textTransform: "none",
						"&:focus": {
							backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[200],
						},
						m: 0,
					}}
					value=""
					onClick={button.onClick}
					href={button.href}
				>
					{button.icon && (
						<button.icon
							sx={{
								color: theme.palette.text.primary + "bb",
								fontFamily: getFontFamilyFromVariable("--font-open-sans"),
								// fontSize: isMobile ? "1.1rem" : theme.typography.body1.fontSize,
								fontSize: isMobile ? "1.1rem" : "1rem",
								my: 0.5,
							}}
						/>
					)}
					{!button.fetched && button.fetched === false ? (
						<></>
					) : (
						button.text && (
							<Typography
								textAlign="center"
								variant="body1"
								sx={{
									color: theme.palette.text.primary + "bb",
									fontFamily: getFontFamilyFromVariable("--font-open-sans"),
									// fontSize: isMobile ? "1.1rem" : theme.typography.body1.fontSize,
									fontSize: isMobile ? "1.1rem" : "1rem",
									fontWeight: "500",
								}}
							>
								{button.text}
							</Typography>
						)
					)}
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
};
export default ButtonBar;
