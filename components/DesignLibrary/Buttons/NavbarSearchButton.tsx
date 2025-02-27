"use client";
import { getFontFamilyFromVariable } from "@/styles/themes/themeDefaults";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { ButtonProps } from "@/types";
import { Search } from "@mui/icons-material";
import { ButtonBase, Tooltip, Typography } from "@mui/material";
import NextLink from "next/link";

export const NavbarSearchButton = (props: ButtonProps) => {
	const { theme } = useTheme();
	const button = (
		// @ts-ignore
		(<ButtonBase LinkComponent={NextLink} aria-label={props.tooltip} onClick={props.onClick} href={props.href}>
            {props.icon && (
				<props.icon
					sx={{
						color: theme.palette.text.primary,
						height: "30px",
						width: "30px",
						"&:focus-visible": {
							color: theme.palette.secondary.main,
						},
						"&:hover": {
							color: theme.palette.secondary.main,
						},
						...props.sxIcon,
					}}
				/>
			)}
        </ButtonBase>)
	);
	const outlineButton = (
		// @ts-ignore
		(<ButtonBase
			LinkComponent={NextLink}
			aria-label={props.tooltip}
			onClick={props.onClick}
			href={props.href}
			disabled={props.disabled || false}
			sx={{
				p: 0.5,
				border: "1px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400]),
				borderRadius: "10px",
				height: "32px",
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.text.primary,
				"&:focus": {
					border: "1px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[300]),
					backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
				},
				"&:hover": {
					border: "1px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[300]),
					backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
					color: theme.palette.secondary.main,
				},
				...props.sxButton,
			}}
			aria-controls={props.ariaControls || undefined}
			aria-haspopup={props.ariaHasPopup || "false"}
			aria-expanded={props.ariaExpanded || undefined}
		>
            <Search
				sx={{
					height: "22px",
					width: "22px",
					color: "inherit",
					mr: 0.5,
					...props.sxIcon,
				}}
			/>
            <Typography
				fontSize={12}
				fontWeight={400}
				sx={{
					fontFamily: theme.typography.fontFamily,
					color: theme.palette.mode === "dark" ? "rgb(220, 220, 220)" : "rgb(100, 100, 100)",
					...props.sxText,
				}}
			>
				Search...
			</Typography>
            <ButtonBase
				disabled
				sx={{
					ml: 1.5,
					borderRadius: "5px",
					backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[200],
					p: "2px 3px 0px 3px",
				}}
			>
				<Typography
					fontFamily={getFontFamilyFromVariable("--font-open-sans")}
					fontSize={10}
					fontWeight={600}
					sx={{ color: "#999" }}
				>
					{`${typeof navigator !== "undefined" && navigator.userAgent.indexOf("Mac OS X") != -1 ? "⌘K" : "CTRL+K"}`}
				</Typography>
			</ButtonBase>
        </ButtonBase>)
	);

	return props.tooltip ? (
		<Tooltip enterDelay={2000} title={props.tooltip}>
			{props.variant === "outline" ? outlineButton : props.variant === "base" ? button : <></>}
		</Tooltip>
	) : (
		button
	);
};
export default NavbarSearchButton;
