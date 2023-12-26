import { ButtonBase, Tooltip } from "@mui/material";
import { ButtonProps } from "../../types";
import { useTheme } from "../../styles/themes/ThemeProvider";

export const NavbarButton = (props: ButtonProps) => {
  const { theme } = useTheme();
  const button = (
    <ButtonBase onClick={props.onClick} href={props.href}>
      <props.icon
        sx={{
          color: props.sxIcon?.color || theme.palette.text.primary,
          height: props.sxIcon?.height || "30px",
          width: props.sxIcon?.width || "30px",
          "&:hover": {
            color: theme.palette.secondary.main,
          },
        }}
      />
    </ButtonBase>
  );
  const outlineButton = (
    <ButtonBase
      onClick={props.onClick}
      href={props.href}
      disabled={props.disabled || false}
      sx={{
        ...props.sxButton,
        // backgroundColor: theme.palette.primary.main,
        border:
          "1px solid " +
          (theme.palette.mode === "dark"
            ? theme.palette.grey[700]
            : theme.palette.grey[400]),
        borderRadius: "10px",
        height: props.sxButton?.height || "32px",
        width: props.sxButton?.width || "32px",
        backgroundColor:
          props.sxButton?.backgroundColor || theme.palette.primary.main,
        color: props.sxIcon?.color || theme.palette.text.primary,
        "&:hover": {
          border:
            "1px solid " +
            (theme.palette.mode === "dark"
              ? theme.palette.grey[600]
              : theme.palette.grey[300]),
          backgroundColor:
            props.sxButton?.backgroundColorHover ||
            (theme.palette.mode === "dark"
              ? theme.palette.grey[800]
              : theme.palette.grey[50]),
          color: props.sxIcon?.colorHover || theme.palette.secondary.main,
        },
      }}
      aria-controls={props.ariaControls || undefined}
      aria-haspopup={props.ariaHasPopup || "false"}
      aria-expanded={props.ariaExpanded || undefined}
    >
      {props.icon && (
        <props.icon
          sx={{
            ...props.sxIcon,
            height: props.sxIcon?.height || "22px",
            width: props.sxIcon?.width || "22px",
            color: "inherit",
          }}
          style={props.styleIcon}
        />
      )}
    </ButtonBase>
  );

  return props.tooltip ? (
    <Tooltip enterDelay={2000} title={props.tooltip}>
      {props.variant === "outline"
        ? outlineButton
        : props.variant === "base"
        ? button
        : null}
    </Tooltip>
  ) : (
    button
  );
};
