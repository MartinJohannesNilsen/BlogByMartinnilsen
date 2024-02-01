import { ButtonBase, Tooltip } from "@mui/material";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ButtonProps } from "../../types";
import NextLink from "next/link";

export const NavbarButton = (props: ButtonProps) => {
	const { theme } = useTheme();
	const button = (
		<ButtonBase
			LinkComponent={NextLink}
			tabIndex={0}
			aria-label={props.tooltip}
			onClick={props.onClick}
			href={props.href}
			type={props.type || undefined}
		>
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
		</ButtonBase>
	);
	const outlineButton = (
		<ButtonBase
			LinkComponent={NextLink}
			tabIndex={0}
			aria-label={props.tooltip}
			onClick={props.onClick}
			href={props.href}
			disabled={props.disabled || false}
			sx={{
				border: "1px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400]),
				borderRadius: "10px",
				height: "32px",
				width: "32px",
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.text.primary,
				"&:focus-visible": {
					border: "1px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[300]),
					backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
				},
				"&:hover": {
					border: "1px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[300]),
					backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
					color: theme.palette.secondary.main,
				},
				...props.sxButton,
			}}
			aria-controls={props.ariaControls || undefined}
			aria-haspopup={props.ariaHasPopup || "false"}
			aria-expanded={props.ariaExpanded || undefined}
			type={props.type || undefined}
		>
			{props.icon && (
				<props.icon
					sx={{
						height: "22px",
						width: "22px",
						color: "inherit",
						...props.sxIcon,
					}}
					style={props.styleIcon}
				/>
			)}
		</ButtonBase>
	);

	return props.tooltip ? (
		<Tooltip enterDelay={2000} title={props.tooltip}>
			{props.variant === "outline" ? outlineButton : props.variant === "base" ? button : null}
		</Tooltip>
	) : (
		button
	);
};
