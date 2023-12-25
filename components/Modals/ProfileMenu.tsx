import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Badge, ButtonBase, Typography } from "@mui/material";
import { Notifications, Person } from "@mui/icons-material";
import { ProfileMenuProps } from "../../types";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { signIn, signOut } from "next-auth/react";
import useAuthorized from "../AuthorizationHook/useAuthorized";
import { NavbarButton } from "../Buttons/NavbarButton";

export const AccountMenu = (props: ProfileMenuProps) => {
  const { theme } = useTheme();
  const { isAuthorized, session, status } =
    process.env.NEXT_PUBLIC_LOCALHOST === "true"
      ? {
          isAuthorized: true,
          session: {
            user: {
              name: "Martin the developer",
              email: "martinjnilsen@gmail.com",
              image:
                "https://mjntech.dev/_next/image?url=%2Fassets%2Fimgs%2Fmjntechdev.png&w=256&q=75",
            },
            expires: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ).toISOString(), // A year ahead
          },
          status: "authenticated",
        }
      : useAuthorized(false);

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <NavbarButton
          variant="outline"
          onClick={props.handleMenuOpen}
          icon={Person}
          tooltip="Account settings"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{
            icon: { height: "24px", width: "24px" },
            button: { height: "34px", width: "34px" },
          }}
        />
      </Box>
      <Menu
        anchorEl={props.anchorEl}
        id="account-menu"
        open={props.open}
        onClose={props.handleMenuOpen}
        onClick={props.handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 30,
              height: 30,
              ml: -0.4,
              mr: 1.5,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Account */}
        {status === "authenticated" ? (
          <MenuItem onClick={() => (window.location.href = "/account")}>
            <Avatar
              src={(session.user && session.user.image) || null}
              sx={{ width: 10, height: 10 }}
            >
              {session.user ? session.user.name[0] : null}
            </Avatar>
            <Typography fontFamily={theme.typography.fontFamily}>
              My account
            </Typography>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              signIn();
              props.handleMenuClose();
            }}
          >
            <Avatar src={null} sx={{ width: 10, height: 10 }} />
            {/* Log in */}
            <Typography fontFamily={theme.typography.fontFamily}>
              Sign in
            </Typography>
          </MenuItem>
        )}

        <Divider />

        {/* Notifications */}
        {/* props.notifications */}
        {false && (
          <MenuItem
            onClick={() => {
              props.notifications.handleModalOpen();
              props.handleMenuClose();
            }}
          >
            <ListItemIcon sx={{ mr: 0.25 }}>
              {props.showNotificationsBadge ? (
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={false}
                  overlap="circular"
                  badgeContent=" "
                >
                  <Notifications
                    fontSize="medium"
                    sx={{ color: theme.palette.text.primary }}
                  />
                </Badge>
              ) : (
                <Notifications
                  fontSize="medium"
                  sx={{ color: theme.palette.text.primary }}
                />
              )}
            </ListItemIcon>
            <Typography fontFamily={theme.typography.fontFamily}>
              Notifications
            </Typography>
          </MenuItem>
        )}

        {/* Settings */}
        {props.settings && (
          <MenuItem
            onClick={() => {
              props.settings.handleModalOpen();
              props.handleMenuClose();
            }}
          >
            <ListItemIcon sx={{ mr: 0.25 }}>
              <Settings
                fontSize="medium"
                sx={{ color: theme.palette.text.primary }}
              />
            </ListItemIcon>
            <Typography fontFamily={theme.typography.fontFamily}>
              Settings
            </Typography>
          </MenuItem>
        )}

        {/* Sign out */}
        <MenuItem
          onClick={() => {
            signOut({ callbackUrl: "/" });
            props.handleMenuClose();
          }}
        >
          <ListItemIcon sx={{ mr: 0.25 }}>
            <Logout
              fontSize="medium"
              sx={{ color: theme.palette.text.primary }}
            />
          </ListItemIcon>
          {/* Logout */}
          <Typography fontFamily={theme.typography.fontFamily}>
            Sign out
          </Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
export default AccountMenu;
