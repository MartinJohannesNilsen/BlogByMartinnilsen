import { Info, LogoutRounded, PostAdd, Search, SettingsRounded, Tag } from "@mui/icons-material";
import { Box, ButtonBase, Link, Typography, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { NavbarProps } from "../../types";
import { userSignOut } from "../../utils/signOut";
import useStickyState from "../../utils/useStickyState";
import useAuthorized from "../AuthorizationHook/useAuthorized";
import { NavbarButton } from "../Buttons/NavbarButton";
import NavbarSearchButton from "../Buttons/NavbarSearchButton";
import { MenuIcon } from "../Icons/MenuIcon";
import ProfileMenu from "../Menus/ProfileMenu";
import { checkForUnreadRecentNotifications, notificationsApiFetcher } from "../Modals/NotificationsModal";
// Modals can be dynamically imported
const NotificationsModal = dynamic(() => import("../Modals/NotificationsModal"));
const SearchModal = dynamic(() => import("../Modals/SearchModal"));
const SettingsModal = dynamic(() => import("../Modals/SettingsModal"));

export const Navbar: FC<NavbarProps> = (props: NavbarProps) => {
	const { theme, setTheme } = useTheme();
	const { isAuthorized, status } =
		process.env.NEXT_PUBLIC_LOCALHOST === "true"
			? {
					isAuthorized: true,
					status: "authenticated",
			  }
			: useAuthorized();
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
	const { data } = useSWR(`/api/notifications`, notificationsApiFetcher);
	const [visibleBadgeNotifications, setVisibleBadgeNotifications] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [unreadNotificationsIds, setUnreadNotificationsIds] = useState([]);
	const [lastRead, setLastRead] = useStickyState("lastRead", Date.now());
	const [notificationsFilterDays, setNotificationsFilterDays] = useStickyState("notificationsFilterDays", 30);
	const [notificationsRead, setNotificationsRead] = useStickyState("notificationsRead", []);
	const [savedPosts, setSavedPosts] = useStickyState("savedPosts", []);
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

	// Notifications and badge
	useEffect(() => {
		const unreadNotifications = checkForUnreadRecentNotifications(
			data,
			lastRead,
			notificationsFilterDays,
			notificationsRead
		);
		if (data) {
			setNotifications(unreadNotifications.allNotificationsFilteredOnDate);
			setUnreadNotificationsIds(unreadNotifications.unreadNotificationsIds);
			// setUnreadNotificationsIds(unreadNotifications.unreadNotificationsFilteredOnDateIds); // TODO Filter on day select option
			setVisibleBadgeNotifications(unreadNotifications.hasUnreadNotifications);
		}
		return () => {};
	}, [data, notificationsRead, notificationsFilterDays]);

	// Account page navbar
	if (!props.posts) {
		const AboutModal = dynamic(() => import("../Modals/AboutModal"));
		return (
			<Box
				width={"100%"}
				pt={isMobile ? 4.75 : 1.5}
				pb={isMobile ? 0.75 : 1.5}
				// pt={2}
				// pb={2}
				position={"fixed"}
				display="flex"
				alignItems="center"
				justifyContent="center"
				sx={{
					backgroundColor: props.backgroundColor,
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
					<Link
						component={NextLink}
						href="/"
						sx={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							color: props.textColor || theme.palette.text.primary,
							"&:focus-visible": {
								// color: theme.palette.secondary.main,
								color: (props.textColor ? props.textColor : theme.palette.text.primary) + "BB",
							},
							"&:hover": {
								// color: theme.palette.secondary.main,
								color: (props.textColor ? props.textColor : theme.palette.text.primary) + "BB",
							},
						}}
						underline="none"
					>
						<MenuIcon
							alt="Website logo"
							width={22}
							height={22}
							fill={props.textColor ? props.textColor : theme.palette.text.primary}
							style={{ fillRule: "evenodd" }}
						/>
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
					</Link>
					<Box flexGrow={100} />
					<Box display="flex" flexDirection="row">
						<Box mr={1}>
							<NavbarButton
								variant="base"
								onClick={handleSettingsModalOpen}
								icon={SettingsRounded}
								tooltip="Open settings"
								sxIcon={{
									color: theme.palette.text.secondary,
									height: "28px",
									width: "28px",
								}}
							/>
						</Box>
						<Box mr={1}>
							<NavbarButton
								variant="base"
								onClick={handleAboutModalOpen}
								icon={Info}
								tooltip="Open about"
								sxIcon={{
									color: theme.palette.text.secondary,
									height: "28px",
									width: "28px",
								}}
							/>
						</Box>
						{status === "authenticated" && (
							<Box>
								<NavbarButton
									variant="base"
									onClick={() => {
										userSignOut("/", true);
									}}
									icon={LogoutRounded}
									tooltip="Sign out"
									sxIcon={{
										color: theme.palette.text.secondary,
										height: "28px",
										width: "28px",
									}}
								/>
							</Box>
						)}
					</Box>
				</Box>

				{/* Modals */}
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
					lastRead={lastRead}
					setLastRead={setLastRead}
					notificationsRead={notificationsRead}
					setNotificationsRead={setNotificationsRead}
					allNotificationsFilteredOnDate={notifications}
					unreadNotificationsIds={unreadNotificationsIds}
					setVisibleBadgeNotifications={setVisibleBadgeNotifications}
					notificationsFilterDays={notificationsFilterDays}
					setNotificationsFilterDays={setNotificationsFilterDays}
				/>
			</Box>
		);
	}

	// Default navbar
	return (
		<Box
			width={"100%"}
			pt={isMobile ? 4.75 : 1.5}
			pb={isMobile ? 0.75 : 1.5}
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
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						color: props.textColor || theme.palette.text.primary,
						"&:focus-visible": {
							// color: theme.palette.secondary.main,
							color: (props.textColor ? props.textColor : theme.palette.text.primary) + "BB",
						},
						"&:hover": {
							// color: theme.palette.secondary.main,
							color: (props.textColor ? props.textColor : theme.palette.text.primary) + "BB",
						},
					}}
				>
					<MenuIcon
						alt="Website logo"
						width={22}
						height={22}
						fill={props.textColor ? props.textColor : theme.palette.text.primary}
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
							// variant="base"
							// onClick={() => {
							// 	handleNavigate("/create");
							// }}
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
							color: props.textColor || theme.palette.text.primary,
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
					// handleAboutModalClose();
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
				lastRead={lastRead}
				setLastRead={setLastRead}
				notificationsRead={notificationsRead}
				setNotificationsRead={setNotificationsRead}
				allNotificationsFilteredOnDate={notifications}
				unreadNotificationsIds={unreadNotificationsIds}
				setVisibleBadgeNotifications={setVisibleBadgeNotifications}
				notificationsFilterDays={notificationsFilterDays}
				setNotificationsFilterDays={setNotificationsFilterDays}
			/>
		</Box>
	);
};
export default Navbar;
