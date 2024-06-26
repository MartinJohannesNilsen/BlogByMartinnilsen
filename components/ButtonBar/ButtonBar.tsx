import { SvgIconTypeMap, SxProps, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { MutableRefObject } from "react";
import { isMobile } from "react-device-detect";
import { IconType } from "react-icons/lib";
import { useTheme } from "../../styles/themes/ThemeProvider";

export type ButtonBarProps = {
	buttons: ButtonBarButtonProps[];
	sx?: SxProps & {};
	ref?: MutableRefObject<any>;
	className?: string;
};

export type ButtonBarButtonProps = {
	fetched?: boolean;
	icon?:
		| (OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
				muiName: string;
		  })
		| IconType;
	text?: string;
	onClick?: (() => void) | ((event: React.MouseEvent<HTMLElement>) => void);
	href?: string;
	disabled?: boolean;
};

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
				...props.sx,
			}}
			aria-label=""
		>
			{props.buttons.map((button) => (
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
								fontFamily: theme.typography.fontFamily,
								fontSize: theme.typography.body1.fontSize,
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
								fontFamily={theme.typography.fontFamily}
								variant="body1"
								fontWeight="600"
								sx={{ color: theme.palette.text.primary + "bb" }}
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
