"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { ProfileMenuProps } from "@/types";
import { userSignOut } from "@/utils/signOut";
import { Bookmark, Notifications, Person, RssFeed } from "@mui/icons-material";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { Badge, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { signIn } from "next-auth/react";
import * as React from "react";

export const AccountMenu = (props: ProfileMenuProps) => {
	const { theme } = useTheme();

	return (
		<React.Fragment>
			<Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
				<NavbarButton
					variant="outline"
					onClick={props.handleMenuOpen}
					icon={Person}
					tooltip="Profile menu"
					aria-controls={props.open ? "profile-menu" : undefined}
					aria-haspopup="true"
					aria-expanded={props.open ? "true" : undefined}
					sxButton={{
						minWidth: "34px",
						minHeight: "34px",
						height: "34px",
						width: "34px",
						...props.accountButtonSx,
					}}
					sxIcon={{
						height: "24px",
						width: "24px",
						color: "inherit",
					}}
				/>
			</Box>
			<Menu
				anchorEl={props.anchorEl}
				id="profile-menu"
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
				{props.sessionUser ? (
					<MenuItem onClick={() => (window.location.href = "/account")}>
						<Avatar src={(props.sessionUser && props.sessionUser.image) || undefined} sx={{ width: 10, height: 10 }}>
							{props.sessionUser.name ? props.sessionUser.name[0] : undefined}
						</Avatar>
						<Typography fontFamily={theme.typography.fontFamily}>My account</Typography>
					</MenuItem>
				) : (
					<MenuItem
						onClick={() => {
							signIn();
							props.handleMenuClose();
						}}
					>
						<Avatar src={undefined} sx={{ width: 10, height: 10 }} />
						{/* Log in */}
						<Typography fontFamily={theme.typography.fontFamily}>Sign in</Typography>
					</MenuItem>
				)}

				<Divider />

				{/* Notifications */}
				{props.notifications && (
					<MenuItem
						onClick={() => {
							props.notifications!.handleModalOpen();
							props.handleMenuClose();
						}}
					>
						<ListItemIcon sx={{ mr: 0.25 }}>
							{props.showNotificationsBadge ? (
								<Badge color="secondary" variant="dot" invisible={false} overlap="circular" badgeContent=" ">
									<Notifications fontSize="medium" sx={{ color: theme.palette.text.primary }} />
								</Badge>
							) : (
								<Notifications fontSize="medium" sx={{ color: theme.palette.text.primary }} />
							)}
						</ListItemIcon>
						<Typography fontFamily={theme.typography.fontFamily}>Notifications</Typography>
					</MenuItem>
				)}

				{/* Saved */}
				<MenuItem onClick={() => (window.location.href = "/tags?name=saved")}>
					<ListItemIcon sx={{ mr: 0.25 }}>
						<Bookmark fontSize="medium" sx={{ color: theme.palette.text.primary }} />
					</ListItemIcon>
					<Typography fontFamily={theme.typography.fontFamily}>Saved</Typography>
				</MenuItem>

				{/* Settings */}
				{props.settings && (
					<MenuItem
						onClick={() => {
							props.settings!.handleModalOpen();
							props.handleMenuClose();
						}}
					>
						<ListItemIcon sx={{ mr: 0.25 }}>
							<Settings fontSize="medium" sx={{ color: theme.palette.text.primary }} />
						</ListItemIcon>
						<Typography fontFamily={theme.typography.fontFamily}>Settings</Typography>
					</MenuItem>
				)}

				{/* About */}
				{/*
				{props.about && (
					<MenuItem
						onClick={() => {
							props.about!.handleModalOpen();
							props.handleMenuClose();
						}}
					>
						<ListItemIcon sx={{ mr: 0.25 }}>
							<Info fontSize="medium" sx={{ color: theme.palette.text.primary }} />
						</ListItemIcon>
						<Typography fontFamily={theme.typography.fontFamily}>About</Typography>
					</MenuItem>
				)}
				*/}

				{/* RSS Feed */}
				<MenuItem onClick={() => (window.location.href = "/feed/rss.xml")}>
					<ListItemIcon sx={{ mr: 0.25 }}>
						<RssFeed fontSize="medium" sx={{ color: theme.palette.text.primary }} />
					</ListItemIcon>
					<Typography fontFamily={theme.typography.fontFamily}>Subscribe</Typography>
				</MenuItem>

				{/* Sign out */}
				{props.sessionUser && (
					<MenuItem
						onClick={() => {
							userSignOut("", true);
							props.handleMenuClose();
						}}
					>
						<ListItemIcon sx={{ mr: 0.25 }}>
							<Logout fontSize="medium" sx={{ color: theme.palette.text.primary }} />
						</ListItemIcon>
						{/* Logout */}
						<Typography fontFamily={theme.typography.fontFamily}>Sign out</Typography>
					</MenuItem>
				)}
			</Menu>
		</React.Fragment>
	);
};
export default AccountMenu;
