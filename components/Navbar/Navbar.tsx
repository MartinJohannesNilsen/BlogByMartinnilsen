"use client";
import { Info, LogoutRounded, PostAdd, RssFeed, Search, SettingsRounded, Tag } from "@mui/icons-material";
import { Box, ButtonBase, Typography, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { NavbarProps } from "../../types";
import { userSignOut } from "../../utils/signOut";
import useAuthorized from "../AuthorizationHook/useAuthorized";
import { NavbarButton } from "../Buttons/NavbarButton";
import NavbarSearchButton from "../Buttons/NavbarSearchButton";
import { MenuIcon } from "../Icons/MenuIcon";
import ProfileMenu from "../Menus/ProfileMenu";
// Modals can be dynamically imported
import SearchModal from "../Modals/SearchModal"; // For listening to hotkeys on render, not rerender
// const SearchModal = dynamic(() => import("../Modals/SearchModal"));
const NotificationsModal = dynamic(() => import("../Modals/NotificationsModal"));
const SettingsModal = dynamic(() => import("../Modals/SettingsModal"));
const AboutModal = dynamic(() => import("../Modals/AboutModal"));

export const Navbar = (props: NavbarProps) => {
	const { theme, setTheme } = useTheme();
	const { isAuthorized, status } =
		process.env.NEXT_PUBLIC_LOCALHOST === "true"
			? {
					isAuthorized: true,
					status: "authenticated",
			  }
			: useAuthorized();
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
	// AboutModal
	const [openAboutModal, setOpenAboutModal] = useState(false);
	const handleAboutModalOpen = () => setOpenAboutModal(true);
	const handleAboutModalClose = () => setOpenAboutModal(false);
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
				className={props.className}
				ref={props.ref}
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
					sx={{
						width: "100%",
						paddingX: lgUp ? "150px" : xs ? "10px" : "80px",
					}}
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
								border: "1px solid" + theme.palette.grey[theme.palette.mode === "dark" ? 300 : 200],
								boxShadow: "0 0 8px 10px" + theme.palette.text.secondary + "20", // Adjust the color and size as needed
							},
							"&:hover": {
								backgroundColor: theme.palette.primary.contrastText,
								border: "1px solid" + theme.palette.grey[theme.palette.mode === "dark" ? 300 : 200],
								boxShadow: "0 0 8px 10px" + theme.palette.text.secondary + "20", // Adjust the color and size as needed
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
					<Box display="flex" flexDirection="row">
						<Box mr={0.5}>
							<NavbarButton
								variant="outline"
								href="/tags"
								icon={Tag}
								tooltip="Go to tags"
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
								onClick={handleAboutModalOpen}
								icon={Info}
								tooltip="Open about"
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
						{status === "authenticated" && (
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
					postsOverview={props.posts}
					handleSettingsModalOpen={handleSettingsModalOpen}
					handleNotificationsModalOpen={handleNotificationsModalOpen}
					notificationsBadgeVisible={visibleBadgeNotifications}
					setCardLayout={props.setCardLayout}
					onOpen={() => {
						handleSettingsModalClose();
						handleNotificationsModalClose();
						handleProfileMenuClose();
						handleAboutModalClose();
					}}
				/>
				<SettingsModal
					open={openSettingsModal}
					handleModalOpen={handleSettingsModalOpen}
					handleModalClose={handleSettingsModalClose}
					handleThemeChange={handleThemeChange}
				/>
				<AboutModal
					open={openAboutModal}
					handleModalOpen={handleAboutModalOpen}
					handleModalClose={handleAboutModalClose}
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
			className={props.className}
			ref={props.ref}
			width={"100%"}
			pt={isMobile ? 4.75 : 1}
			pb={isMobile ? 0.75 : 1}
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
				sx={{
					width: "100%",
					paddingX: lgUp ? "150px" : xs ? "10px" : "80px",
				}}
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
							border: "1px solid" + theme.palette.text.primary,
							boxShadow: "0 0 8px 10px" + theme.palette.text.primary + "20", // Adjust the color and size as needed
						},
						"&:hover": {
							backgroundColor: theme.palette.primary.main,
							border: "1px solid" + theme.palette.text.primary,
							boxShadow: "0 0 8px 10px" + theme.palette.text.primary + "20", // Adjust the color and size as needed
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
				{isAuthorized && (
					<Box>
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
					</Box>
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
						/>
					)}
				</Box>
				<Box mr={0.5}>
					<NavbarButton
						variant="outline"
						href="/tags"
						icon={Tag}
						tooltip="Go to tags"
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
						about={{
							open: openAboutModal,
							handleModalOpen: handleAboutModalOpen,
							handleModalClose: handleAboutModalClose,
						}}
					/>
				</Box>
			</Box>

			{/* Modals */}
			<SearchModal
				open={openSearchModal}
				handleModalOpen={handleSearchModalOpen}
				handleModalClose={handleSearchModalClose}
				postsOverview={props.posts}
				handleSettingsModalOpen={handleSettingsModalOpen}
				handleNotificationsModalOpen={handleNotificationsModalOpen}
				notificationsBadgeVisible={visibleBadgeNotifications}
				setCardLayout={props.setCardLayout}
				onOpen={() => {
					handleSettingsModalClose();
					handleNotificationsModalClose();
					handleProfileMenuClose();
					handleAboutModalClose();
				}}
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
			<AboutModal
				open={openAboutModal}
				handleModalOpen={handleAboutModalOpen}
				handleModalClose={handleAboutModalClose}
			/>
		</Box>
	);
};
export default Navbar;
