"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import NavbarSearchButton from "@/components/DesignLibrary/Buttons/NavbarSearchButton";
import ProfileMenu from "@/components/DesignLibrary/Menus/ProfileMenu";
import SearchModal from "@/components/DesignLibrary/Modals/SearchModal"; // For listening to hotkeys on render, not rerender
import { MenuIcon } from "@/components/Icons/MenuIcon";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { getFontFamilyFromVariable } from "@/styles/themes/themeDefaults";
import { ThemeEnum } from "@/styles/themes/themeMap";
import { NavbarProps } from "@/types";
import { userSignOut } from "@/utils/signOut";
import { Info, LogoutRounded, PostAdd, RssFeed, Search, SettingsRounded, Tag } from "@mui/icons-material";
import { Box, ButtonBase, Typography, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
// Modals can be dynamically imported
// const SearchModal = dynamic(() => import("@/components/Modals/SearchModal"));
const NotificationsModal = dynamic(() => import("@/components/DesignLibrary/Modals/NotificationsModal"));
const SettingsModal = dynamic(() => import("@/components/DesignLibrary/Modals/SettingsModal"));

export const Navbar = ({
	posts,
	setCardLayout,
	ref,
	className,
	isAuthorized,
	sessionUser,
	centeredPadding,
}: NavbarProps) => {
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();
	// ProfileMenu
	const [anchorElProfileMenu, setAnchorElProfileMenu] = useState<null | HTMLElement>(null);
	const openProfileMenu = Boolean(anchorElProfileMenu);
	const handleProfileMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorElProfileMenu(event.currentTarget);
	};
	const handleProfileMenuClose = () => {
		setAnchorElProfileMenu(null);
	};
	// NotificationsModal
	const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
	const handleNotificationsModalOpen = () => setOpenNotificationsModal(true);
	const handleNotificationsModalClose = () => setOpenNotificationsModal(false);
	const [visibleBadgeNotifications, setVisibleBadgeNotifications] = useState(false);
	// SettingsModal
	const [openSettingsModal, setOpenSettingsModal] = useState(false);
	const handleSettingsModalOpen = () => setOpenSettingsModal(true);
	const handleSettingsModalClose = () => setOpenSettingsModal(false);
	// SearchModal
	const [openSearchModal, setOpenSearchModal] = useState(false);
	const handleSearchModalOpen = () => setOpenSearchModal(true);
	const handleSearchModalClose = () => setOpenSearchModal(false);
	useHotkeys(["Control+k", "Meta+k"], (event) => {
		event.preventDefault();
		handleSearchModalOpen();
	});
	// Theme
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

	// Navigation
	const router = useRouter();
	const handleNavigate = (path: string) => {
		router.push(path);
	};

	// Theme change
	const handleThemeChange = (event: any) => {
		setTheme(event.target.checked === true ? ThemeEnum.Light : ThemeEnum.Dark, true);
	};

	// Account page navbar
	if (pathname === "/account") {
		return (
			<Box
				className={className}
				ref={ref}
				width={"100%"}
				pt={isMobile ? 4.75 : 1}
				pb={isMobile ? 0.75 : 1}
				position={"fixed"}
				display="flex"
				alignItems="center"
				justifyContent="center"
				sx={{
					backgroundColor: theme.palette.primary.contrastText,
					top: 0,
					zIndex: 1000,
					marginTop: isMobile ? "-34px" : 0,
					WebkitTransform: "translateZ(0)",
				}}
			>
				<Box
					display="flex"
					alignItems="center"
					sx={
						centeredPadding
							? {
									width: "100%",
									paddingX: lgUp ? "150px" : xs ? "10px" : "80px",
							  }
							: { width: "95%" }
					}
				>
					{/* Home button */}
					<ButtonBase
						LinkComponent={NextLink}
						onClick={() => handleNavigate("/")}
						disableRipple
						sx={{
							border: "1px solid transparent",
							p: "2px 8px",
							borderRadius: "8px",
							transition: "box-shadow 0.3s ease",
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							color: theme.palette.text.secondary,
							"&:focus-visible": {
								backgroundColor: theme.palette.primary.contrastText,
								border: "1px solid" + theme.palette.text.primary + "40",
								boxShadow: "0 0 4px 5px" + theme.palette.text.primary + "20", // Adjust the color and size as needed
							},
							"&:hover": {
								backgroundColor: theme.palette.primary.contrastText,
								border: "1px solid" + theme.palette.text.primary + "40",
								boxShadow: "0 0 4px 5px" + theme.palette.text.primary + "20", // Adjust the color and size as needed
							},
						}}
					>
						<MenuIcon alt="Website logo" width={22} height={22} fill={theme.palette.text.secondary} style={{}} />
						<Typography
							// variant={"h5"}
							fontFamily={theme.typography.fontFamily}
							fontWeight={700}
							fontSize={22}
							textAlign="left"
							pl={0.5}
							sx={{ textDecoration: "none", color: "inherit" }}
						>
							Blog
						</Typography>
					</ButtonBase>
					<Box flexGrow={100} />
					<Box display="flex" alignItems="end" height="32px">
						<Box mr={0.5}>
							<NavbarButton
								variant="outline"
								href="/tags"
								icon={Tag}
								tooltip="Go to tags page"
								sxButton={{
									color: theme.palette.text.secondary,
									backgroundColor: "inherit",
									border:
										"1px solid " + (theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[400]),
									"&:focus-visible": {
										border:
											"1px solid " +
											(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
										backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
									},
									"&:hover": {
										color: theme.palette.secondary.main,
										border:
											"1px solid " +
											(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
										backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
									},
								}}
							/>
						</Box>
						<Box mr={0.5}>
							<NavbarButton
								variant="outline"
								onClick={handleSearchModalOpen}
								icon={Search}
								tooltip="Search"
								sxIcon={{}}
								sxButton={{
									color: theme.palette.text.secondary,
									backgroundColor: "inherit",
									border:
										"1px solid " + (theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[400]),
									"&:focus-visible": {
										border:
											"1px solid " +
											(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
										backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
									},
									"&:hover": {
										color: theme.palette.secondary.main,
										border:
											"1px solid " +
											(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
										backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
									},
								}}
							/>
						</Box>
						<Box mr={0.5}>
							<NavbarButton
								variant="outline"
								onClick={handleSettingsModalOpen}
								icon={SettingsRounded}
								tooltip="Open settings"
								sxIcon={{}}
								sxButton={{
									color: theme.palette.text.secondary,
									backgroundColor: "inherit",
									border:
										"1px solid " + (theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[400]),
									"&:focus-visible": {
										border:
											"1px solid " +
											(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
										backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
									},
									"&:hover": {
										color: theme.palette.secondary.main,
										border:
											"1px solid " +
											(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
										backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
									},
								}}
							/>
						</Box>
						<Box mr={0.5}>
							<NavbarButton
								variant="outline"
								href="/about"
								icon={Info}
								tooltip="Go to about page"
								sxIcon={{}}
								sxButton={{
									color: theme.palette.text.secondary,
									backgroundColor: "inherit",
									border:
										"1px solid " + (theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[400]),
									"&:focus-visible": {
										border:
											"1px solid " +
											(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
										backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
									},
									"&:hover": {
										color: theme.palette.secondary.main,
										border:
											"1px solid " +
											(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
										backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
									},
								}}
							/>
						</Box>
						<Box mr={0.5}>
							<NavbarButton
								variant="outline"
								onClick={() => (window.location.href = "/feed/rss.xml")}
								icon={RssFeed}
								tooltip="Subscribe"
								sxIcon={{}}
								sxButton={{
									color: theme.palette.text.secondary,
									backgroundColor: "inherit",
									border:
										"1px solid " + (theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[400]),
									"&:focus-visible": {
										border:
											"1px solid " +
											(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
										backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
									},
									"&:hover": {
										color: theme.palette.secondary.main,
										border:
											"1px solid " +
											(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
										backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
									},
								}}
							/>
						</Box>
						{sessionUser && (
							<Box>
								<NavbarButton
									variant="outline"
									onClick={() => {
										userSignOut("/", true);
									}}
									icon={LogoutRounded}
									tooltip="Sign out"
									sxIcon={{}}
									sxButton={{
										color: theme.palette.text.secondary,
										backgroundColor: "inherit",
										border:
											"1px solid " +
											(theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[400]),
										"&:focus-visible": {
											border:
												"1px solid " +
												(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
											backgroundColor:
												theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
										},
										"&:hover": {
											color: theme.palette.secondary.main,
											border:
												"1px solid " +
												(theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[300]),
											backgroundColor:
												theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[50],
										},
									}}
								/>
							</Box>
						)}
					</Box>
				</Box>

				{/* Modals */}
				<SearchModal
					open={openSearchModal}
					handleModalOpen={handleSearchModalOpen}
					handleModalClose={handleSearchModalClose}
					postsOverview={posts}
					handleSettingsModalOpen={handleSettingsModalOpen}
					handleNotificationsModalOpen={handleNotificationsModalOpen}
					notificationsBadgeVisible={visibleBadgeNotifications}
					setCardLayout={setCardLayout}
					onOpen={() => {
						handleSettingsModalClose();
						handleNotificationsModalClose();
						handleProfileMenuClose();
					}}
					isAuthorized={isAuthorized}
					sessionUser={sessionUser}
				/>
				<SettingsModal
					open={openSettingsModal}
					handleModalOpen={handleSettingsModalOpen}
					handleModalClose={handleSettingsModalClose}
					handleThemeChange={handleThemeChange}
				/>
				<NotificationsModal
					open={openNotificationsModal}
					handleModalOpen={handleNotificationsModalOpen}
					handleModalClose={handleNotificationsModalClose}
					setVisibleBadgeNotifications={setVisibleBadgeNotifications}
				/>
			</Box>
		);
	}
	// Default navbar
	return (
		<Box
			className={className}
			ref={ref}
			width={"100%"}
			pt={isMobile ? 4.75 : 1}
			pb={isMobile ? 0.375 : 1}
			position={"fixed"}
			display="flex"
			alignItems="center"
			justifyContent="center"
			sx={{
				backgroundColor: isMobile ? theme.palette.primary.main : theme.palette.primary.main + "EE",
				borderBottom: "1px solid" + (theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[200]),
				top: 0,
				zIndex: 1000,
				marginTop: isMobile ? "-34px" : 0,
				WebkitTransform: "translateZ(0)",
				backdropFilter: "blur(10px)",
				WebkitBackdropFilter: "blur(10px)",
			}}
		>
			<Box
				display="flex"
				alignItems="center"
				sx={
					centeredPadding
						? {
								width: "100%",
								paddingX: lgUp ? "150px" : xs ? "10px" : "80px",
						  }
						: { width: "95%" }
				}
			>
				{/* Home button */}
				<ButtonBase
					LinkComponent={NextLink}
					onClick={() => handleNavigate("/")}
					disableRipple
					sx={{
						border: "1px solid transparent",
						p: "2px 8px",
						borderRadius: "8px",
						transition: "box-shadow 0.3s ease",
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						color: theme.palette.text.primary,
						"&:focus-visible": {
							backgroundColor: theme.palette.primary.main,
							border: "1px solid" + theme.palette.text.primary + "40",
							boxShadow: "0 0 4px 5px" + theme.palette.text.primary + "20", // Adjust the color and size as needed
						},
						"&:hover": {
							backgroundColor: theme.palette.primary.main,
							border: "1px solid" + theme.palette.text.primary + "40",
							boxShadow: "0 0 4px 5px" + theme.palette.text.primary + "20", // Adjust the color and size as needed
						},
					}}
				>
					<MenuIcon
						alt="Website logo"
						width={22}
						height={22}
						fill={theme.palette.text.primary}
						style={{ fillRule: "evenodd" }}
					/>
					<Typography
						fontFamily={theme.typography.fontFamily}
						fontWeight={700}
						fontSize={22}
						textAlign="left"
						pl={0.5}
						color="inherit"
					>
						Blog
					</Typography>
				</ButtonBase>
				<Box flexGrow={100} />
				<Box display="flex" alignItems="end" height="34px">
					{isAuthorized && (
						<NavbarButton
							variant="outline"
							onClick={() => {
								handleNavigate("/create");
							}}
							href="/create"
							icon={PostAdd}
							tooltip="Upload new post"
							sxButton={{
								height: "34px",
								width: "34px",
								backgroundColor: theme.palette.primary.main + "50",
							}}
							sxIcon={{
								height: "24px",
								width: "24px",
							}}
						/>
					)}
					<Box mx={0.5}>
						{isMobile || xs ? (
							<NavbarButton
								icon={Search}
								variant="outline"
								onClick={handleSearchModalOpen}
								tooltip={"Search"}
								sxButton={{
									height: "34px",
									width: "34px",
									backgroundColor: theme.palette.primary.main + "50",
									color: theme.palette.text.primary,
								}}
								sxIcon={{
									height: "24px",
									width: "24px",
								}}
							/>
						) : (
							<NavbarSearchButton
								variant="outline"
								onClick={handleSearchModalOpen}
								tooltip={"Search"}
								sxButton={{
									height: "34px",
									backgroundColor: theme.palette.primary.main + "50",
									color: theme.palette.text.primary,
								}}
								sxIcon={{
									height: "24px",
									width: "24px",
								}}
								sxText={{ fontFamily: getFontFamilyFromVariable("--font-noto-sans-display") }}
							/>
						)}
					</Box>
					<Box mr={0.5}>
						<NavbarButton
							variant="outline"
							href="/tags"
							icon={Tag}
							tooltip="Go to tags page"
							sxButton={{
								height: "34px",
								width: "34px",
								backgroundColor: theme.palette.primary.main + "50",
								color: theme.palette.text.primary,
							}}
							sxIcon={{
								height: "24px",
								width: "24px",
							}}
						/>
					</Box>
					<Box>
						<ProfileMenu
							anchorEl={anchorElProfileMenu}
							open={openProfileMenu}
							handleMenuOpen={handleProfileMenuClick}
							handleMenuClose={handleProfileMenuClose}
							accountButtonSx={{
								color: theme.palette.text.primary,
								backgroundColor: theme.palette.primary.main + "50",
							}}
							showNotificationsBadge={visibleBadgeNotifications}
							notifications={{
								open: openNotificationsModal,
								handleModalOpen: handleNotificationsModalOpen,
								handleModalClose: handleNotificationsModalClose,
							}}
							settings={{
								open: openSettingsModal,
								handleModalOpen: handleSettingsModalOpen,
								handleModalClose: handleSettingsModalClose,
							}}
							isAuthorized={isAuthorized}
							sessionUser={sessionUser}
						/>
					</Box>
				</Box>
			</Box>

			{/* Modals */}
			<SearchModal
				open={openSearchModal}
				handleModalOpen={handleSearchModalOpen}
				handleModalClose={handleSearchModalClose}
				postsOverview={posts}
				handleSettingsModalOpen={handleSettingsModalOpen}
				handleNotificationsModalOpen={handleNotificationsModalOpen}
				notificationsBadgeVisible={visibleBadgeNotifications}
				setCardLayout={setCardLayout}
				onOpen={() => {
					handleSettingsModalClose();
					handleNotificationsModalClose();
					handleProfileMenuClose();
				}}
				isAuthorized={isAuthorized}
				sessionUser={sessionUser}
			/>
			<SettingsModal
				open={openSettingsModal}
				handleModalOpen={handleSettingsModalOpen}
				handleModalClose={handleSettingsModalClose}
				handleThemeChange={handleThemeChange}
			/>
			<NotificationsModal
				open={openNotificationsModal}
				handleModalOpen={handleNotificationsModalOpen}
				handleModalClose={handleNotificationsModalClose}
				setVisibleBadgeNotifications={setVisibleBadgeNotifications}
			/>
		</Box>
	);
};
export default Navbar;
