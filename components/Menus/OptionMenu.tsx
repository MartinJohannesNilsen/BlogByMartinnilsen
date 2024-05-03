"use client";
import { Popper } from "@mui/base/Popper";
import { DropdownContext, useDropdown } from "@mui/base/useDropdown";
import { MenuProvider, useMenu } from "@mui/base/useMenu";
import { useMenuButton } from "@mui/base/useMenuButton";
import { useMenuItem } from "@mui/base/useMenuItem";
import { MoreVert } from "@mui/icons-material";
import { Box, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { useTheme } from "@mui/system";
import clsx from "clsx";
import * as React from "react";
import { ButtonProps, OptionMenuProps } from "../../types";
import { NavbarButton } from "../Buttons/NavbarButton";

const Menu = React.forwardRef(function Menu(
	props: React.ComponentPropsWithoutRef<"ul">,
	ref: React.Ref<HTMLUListElement>
) {
	const { children, ...other } = props;

	const { open, triggerElement, contextValue, getListboxProps } = useMenu({
		listboxRef: ref,
	});

	return (
		<Popper open={open} anchorEl={triggerElement}>
			<ul className="menu-root" {...other} {...getListboxProps()} style={{ zIndex: 9999 }}>
				<MenuProvider value={contextValue}>{children}</MenuProvider>
			</ul>
		</Popper>
	);
});

const MenuItem = React.forwardRef(function MenuItem(
	props: React.ComponentPropsWithoutRef<"li"> & { disabled?: boolean; onClick: () => void },
	ref: React.Ref<any>
) {
	const { children, onClick, ...other } = props;

	const { getRootProps, focusVisible } = useMenuItem({ rootRef: ref });

	const classes = {
		// "focus-visible": focusVisible,
		"menu-item": true,
		disabled: props.disabled,
	};

	return (
		<li {...other} {...getRootProps({ onClick: onClick ?? (() => {}) })} className={clsx(classes)}>
			{children}
		</li>
	);
});

const _MenuItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>((props, ref) => {
	const { children, onClick, ...other } = props;

	const { getRootProps, disabled, focusVisible } = useMenuItem({
		// Here, instead of directly passing `ref`, we ensure we're dealing with a ref object.
		rootRef: ref,
	});

	const handleMouseEnter = () => {
		// Now TypeScript understands that `ref` is a ref object with a `current` property.
		if (ref && "current" in ref && ref.current) {
			ref.current.focus();
		}
	};

	const classes = clsx({
		"focus-visible": focusVisible,
		"menu-item": true,
		disabled,
	});

	return (
		<li
			{...other}
			{...getRootProps({ onClick: onClick ?? (() => {}) })}
			onMouseEnter={handleMouseEnter}
			ref={ref}
			className={classes}
		>
			{children}
		</li>
	);
});

const MenuButton = React.forwardRef(function MenuButton(
	props: ButtonProps | React.PropsWithChildren<{}>,
	forwardedRef: React.ForwardedRef<HTMLButtonElement>
) {
	const { getRootProps: getButtonProps } = useMenuButton({ rootRef: forwardedRef });
	return (
		<Box {...getButtonProps()}>
			<NavbarButton variant="base" {...props} />
		</Box>
	);
});

export const OptionMenu = (props: OptionMenuProps) => {
	const { contextValue: dropdownContextValue } = useDropdown();

	return (
		<React.Fragment>
			<DropdownContext.Provider value={dropdownContextValue}>
				<MenuButton
					variant="base"
					icon={MoreVert}
					sxButton={{
						minWidth: "24px",
						minHeight: "34px",
						height: "34px",
						width: "24px",
						borderRadius: 1,
						"&:focus": {
							border: 0,
						},
						"&:active": {
							border: 0,
						},
					}}
					sxIcon={{
						opacity: 0.75,
						height: "22px",
						width: "22px",
						color: "inherit",
					}}
				/>
				<Menu id="hooks-menu">
					{props.menuItems.map((item) => (
						<MenuItem disabled={item.disabled} onClick={() => !item.disabled && item.onClick()}>
							{item.text}
						</MenuItem>
					))}
				</Menu>
			</DropdownContext.Provider>
			<Styles />
		</React.Fragment>
	);
};
export default OptionMenu;

const blue = {
	50: "#F0F7FF",
	100: "#C2E0FF",
	200: "#99CCF3",
	300: "#66B2FF",
	400: "#3399FF",
	500: "#007FFF",
	600: "#0072E6",
	700: "#0059B3",
	800: "#004C99",
	900: "#003A75",
};

const grey = {
	50: "#F3F6F9",
	100: "#E5EAF2",
	200: "#DAE2ED",
	300: "#C7D0DD",
	400: "#B0B8C4",
	500: "#9DA8B7",
	600: "#6B7A90",
	700: "#434D5B",
	800: "#303740",
	900: "#1C2025",
};

function useIsDarkMode() {
	const theme = useTheme();
	return theme.palette.mode === "dark";
}

function Styles() {
	// Replace this with your app logic for determining dark mode
	const isDarkMode = useIsDarkMode();

	const styles = `
    .menu-root {
      z-index: 10000,
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 0.875rem;
      box-sizing: border-box;
      padding: 5px;
      margin: 10px 0;
      min-width: 200px;
      background: #fff;
      border: 1px solid ${grey[200]};
      border-radius: 0.75em;
      color: ${grey[900]};
      overflow: auto;
      outline: 0px;
      box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.05);
    }

    .mode-dark .menu-root {
      background: ${grey[900]};
      border-color: ${grey[700]};
      color: ${grey[300]};
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
    }

    .menu-item {
      list-style: none;
      padding: 8px;
      border-radius: 0.45em;
      cursor: default;
      user-select: none;
    }

    .menu-item:last-of-type {
      border-bottom: none;
    }

    .menu-item:focus {
      background-color: ${grey[100]};
      color: ${grey[900]};
      outline: 0;
    }
    
	.menu-item:hover {
      background-color: ${grey[100]};
      color: ${grey[900]};
      outline: 0;
    }
	.menu-item.disabled:hover {
		background: #fff;
	}

    .mode-dark .menu-item:focus {
      background-color: ${grey[800]};
      color: ${grey[300]};
    }

    .menu-item.disabled {
      color: ${grey[400]};
    }

  .mode-dark .menu-item.disabled {
    color: ${grey[700]};
  }

  `;

	// eslint-disable-next-line react/no-danger
	return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}
