import { ButtonBase, Tooltip, Typography } from "@mui/material";
import { ButtonProps } from "../../types";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { Search } from "@mui/icons-material";

export const NavbarSearchButton = (props: ButtonProps) => {
  const { theme } = useTheme();
  const button = (
    <ButtonBase onClick={props.onClick} href={props.href}>
      <props.icon
        sx={{
          color: props.sx?.icon?.color || theme.palette.text.primary,
          height: props.sx?.icon?.height || "30px",
          width: props.sx?.icon?.width || "30px",
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
        // backgroundColor: theme.palette.primary.main,
        p: 0.5,
        border:
          "1px solid " +
          (theme.palette.mode === "dark"
            ? theme.palette.grey[700]
            : theme.palette.grey[400]),
        borderRadius: "10px",
        height: props.sx?.button?.height || "32px",
        // width: props.sx?.button?.width || "32px",
        backgroundColor:
          props.sx?.button?.backgroundColor || theme.palette.primary.main,
        color: props.sx?.icon?.color || theme.palette.text.primary,
        "&:hover": {
          border:
            "1px solid " +
            (theme.palette.mode === "dark"
              ? theme.palette.grey[600]
              : theme.palette.grey[300]),
          backgroundColor:
            props.sx?.button?.backgroundColorHover ||
            (theme.palette.mode === "dark"
              ? theme.palette.grey[800]
              : theme.palette.grey[50]),
          color: props.sx?.icon?.colorHover || theme.palette.secondary.main,
        },
      }}
      aria-controls={props.ariaControls || undefined}
      aria-haspopup={props.ariaHasPopup || "false"}
      aria-expanded={props.ariaExpanded || undefined}
    >
      <Search
        sx={{
          height: props.sx?.icon?.height || "22px",
          width: props.sx?.icon?.width || "22px",
          color: "inherit",
          mr: 0.5,
        }}
      />
      <Typography
        fontFamily={theme.typography.fontFamily}
        fontSize={12}
        fontWeight={400}
        sx={{
          color:
            theme.palette.mode === "dark"
              ? "rgb(220, 220, 220)"
              : "rgb(100, 100, 100)",
        }}
      >
        Search...
      </Typography>
      <ButtonBase
        disabled
        sx={{
          ml: 1.5,
          borderRadius: "5px",
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[200],
          p: "2px 3px 0px 3px",
        }}
      >
        <Typography
          fontFamily={"Gotham Pro"}
          fontSize={10}
          fontWeight={600}
          sx={{ color: "#999" }}
        >
          {`${
            typeof navigator !== "undefined" &&
            navigator.userAgent.indexOf("Mac OS X") != -1
              ? "⌘K"
              : "CTRL+K"
          }`}
        </Typography>
      </ButtonBase>
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
export default NavbarSearchButton;
