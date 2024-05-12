"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import NavbarSearchButton from "@/components/DesignLibrary/Buttons/NavbarSearchButton";
import ProfileMenu from "@/components/DesignLibrary/Menus/ProfileMenu";
import SearchModal from "@/components/DesignLibrary/Modals/SearchModal";
import SimpleTextModal from "@/components/DesignLibrary/Modals/SimpleTextModal";
import { extractHeaders } from "@/components/DesignLibrary/Modals/TOCModal";
import { MenuIcon } from "@/components/Icons/MenuIcon";
import { DATA_DEFAULTS } from "@/data/metadata";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { getFontFamilyFromVariable } from "@/styles/themes/themeDefaults";
import { ThemeEnum } from "@/styles/themes/themeMap";
import { PostNavbarProps, SearchActionProps } from "@/types";
import { handleSharing } from "@/utils/handleSharing";
import useStickyState from "@/utils/useStickyState";
import { Bookmark, BookmarkBorder, Edit, IosShareOutlined, Search } from "@mui/icons-material";
import { Box, ButtonBase, Typography, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
// Modals can be dynamically imported
const NotificationsModal = dynamic(() => import("@/components/DesignLibrary/Modals/NotificationsModal"));
const TOCModal = dynamic(() => import("@/components/DesignLibrary/Modals/TOCModal"));
const ShareModal = dynamic(() => import("@/components/DesignLibrary/Modals/ShareModal"));
const SettingsModal = dynamic(() => import("@/components/DesignLibrary/Modals/SettingsModal"));

export const PostNavbar = (props: PostNavbarProps) => {
	const { theme, setTheme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const handleNavigate = (path: string) => {
		window.location.href = path;
	};

	// Modals
	const [openSettingsModal, setOpenSettingsModal] = useState(false);
	// SearchModal
	const [openSearchModal, setOpenSearchModal] = useState(false);
	const handleSearchModalOpen = () => setOpenSearchModal(true);
	const handleSearchModalClose = () => setOpenSearchModal(false);
	useHotkeys(["Control+k", "Meta+k"], (event) => {
		event.preventDefault();
		handleSearchModalOpen();
	});

	// ProfileMenu
	const [anchorElProfileMenu, setAnchorElProfileMenu] = useState<null | HTMLElement>(null);
	const openProfileMenu = Boolean(anchorElProfileMenu);
	const handleProfileMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorElProfileMenu(event.currentTarget);
	};
	const handleProfileMenuClose = () => {
		setAnchorElProfileMenu(null);
	};
	const handleThemeChange = (event: any) => {
		setTheme(event.target.checked === true ? ThemeEnum.Light : ThemeEnum.Dark, true);
	};

	// NotificationsModal
	const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
	const handleNotificationsModalOpen = () => setOpenNotificationsModal(true);
	const handleNotificationsModalClose = () => setOpenNotificationsModal(false);
	const [visibleBadgeNotifications, setVisibleBadgeNotifications] = useState(false);

	// SavedModal
	const [savedPosts, setSavedPosts] = useStickyState("savedPosts", [], true);
	// const [savedPosts, setSavedPosts] = useState<string[]>([]);
	const [isSaved, setIsSaved] = useState(false);
	useEffect(() => {
		if (savedPosts && savedPosts) {
			setIsSaved(savedPosts.includes(props.post.id));
		}
		return () => {};
	}, [, savedPosts]);

	// Extra actions to search modal
	const extraActions: SearchActionProps[] = [
		{
			title: "Share post",
			keywords: ["share", "post", "send", "twitter", "facebook", "message"],
			iconElement: <IosShareOutlined sx={{ color: theme.palette.text.primary }} />,
			onClick: () => {
				handleSharing({
					url: typeof window !== "undefined" ? window.location.href : "",
					title: props.post.title,
					text: "",
					icon: props.post.ogImage.src || DATA_DEFAULTS.images.openGraph,
					fallback: () => props.shareModal.setOpen(true),
				});
			},
		},
		{
			title: "Text Configuration",
			keywords: ["text", "size", "background"],
			iconElement: (
				<Typography
					variant="body1"
					sx={{
						color: theme.palette.text.primary,
						fontFamily: getFontFamilyFromVariable("--font-noto-sans-display"),
						fontWeight: 600,
					}}
				>
					Aa
				</Typography>
			),
			onClick: () => {
				props.simpleTextModal.setOpen(true);
			},
		},
	];

	return (
		<>
			{/* Navbar based on mobile device or not */}
			{isMobile ? (
				// Mobile
				<Box
					className={props.className}
					ref={props.ref}
					width={"100%"}
					pt={4.75}
					pb={0.75}
					position={"fixed"}
					display="flex"
					justifyContent={"center"}
					sx={{
						backgroundColor: theme.palette.primary.dark,
						borderBottom:
							"1px solid" + (theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[200]),
						top: 0,
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						zIndex: 1000,
						marginTop: "-32px",
						WebkitTransform: "translateZ(0)",
					}}
				>
					<Box
						display="flex"
						alignItems="end"
						sx={{
							height: "34px",
							width: "95%",
						}}
					>
						<Box mr={0.1} display="flex" alignItems="end">
							<NavbarButton
								variant="outline"
								onClick={() => props.simpleTextModal.setOpen(true)}
								text="Aa"
								tooltip="Customize"
								sxButton={{
									height: "34px",
									width: "34px",
								}}
								sxText={{
									fontSize: "17px",
									mb: "2px",
									fontFamily: getFontFamilyFromVariable("--font-noto-sans-display"),
								}}
							/>
							{/* Save */}
							<Box ml={0.5}>
								<NavbarButton
									variant="outline"
									disabled={!props.post.published}
									onClick={() =>
										isSaved
											? setSavedPosts(savedPosts.filter((id) => id !== props.post.id))
											: setSavedPosts([...savedPosts, props.post.id])
									}
									icon={isSaved ? Bookmark : BookmarkBorder}
									tooltip="Share"
									sxButton={{
										height: "34px",
										width: "34px",
										backgroundColor: theme.palette.primary.main + "99",
									}}
									sxIcon={{ height: "20px", width: "22px", opacity: !props.post.published ? "0.5" : "1" }}
								/>
							</Box>
						</Box>
						<Box flexGrow={100} />
						<Box display="flex" alignItems="center" height="34px">
							<Typography
								variant="body2"
								fontWeight="600"
								textAlign="center"
								color={theme.palette.text.primary}
								marginX={1}
								sx={{
									// fontSize: "calc(0.875rem * var(--font-scale))",
									fontSize: "1rem",
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
									fontFamily: getFontFamilyFromVariable("--font-open-sans"),
								}}
							>
								{props.post.title}
							</Typography>
						</Box>
						<Box flexGrow={100} />
						{/* Right section */}
						<Box display="flex" ml={0.1} alignItems="end">
							<Box mr={0.5}>
								<NavbarButton
									icon={Search}
									variant="outline"
									onClick={handleSearchModalOpen}
									tooltip={"Search"}
									sxButton={{
										height: "34px",
										width: "34px",
										backgroundColor: theme.palette.primary.main + "99",
										color: theme.palette.text.primary,
									}}
									sxIcon={{
										height: "24px",
										width: "24px",
									}}
								/>
							</Box>
							{/* Account */}
							<ProfileMenu
								anchorEl={anchorElProfileMenu}
								open={openProfileMenu}
								handleMenuOpen={handleProfileMenuClick}
								handleMenuClose={handleProfileMenuClose}
								accountButtonSx={{
									backgroundColor: theme.palette.primary.main + "99",
								}}
								showNotificationsBadge={visibleBadgeNotifications}
								notifications={{
									open: openNotificationsModal,
									handleModalOpen: () => setOpenNotificationsModal(true),
									handleModalClose: () => setOpenNotificationsModal(false),
								}}
								settings={{
									open: openSettingsModal,
									handleModalOpen: () => setOpenSettingsModal(true),
									handleModalClose: () => setOpenSettingsModal(false),
								}}
								isAuthorized={props.isAuthorized}
								sessionUser={props.sessionUser}
							/>
						</Box>
					</Box>
				</Box>
			) : (
				// Not mobile
				<Box
					className={props.className}
					ref={props.ref}
					id="computer-navbar"
					display="flex"
					alignItems="center"
					width={"100%"}
					px={3}
					pt={1}
					pb={1}
					position={"fixed"}
					sx={{
						top: 0,
						backgroundColor: isMobile ? theme.palette.primary.main : theme.palette.primary.main + "CC",
						borderBottom:
							"1px solid" + (theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[200]),
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						zIndex: 1000,
						marginTop: "0",
						WebkitTransform: "translateZ(0)",
						backdropFilter: "blur(10px)",
						WebkitBackdropFilter: "blur(10px)",
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
							width={20}
							height={20}
							fill={theme.palette.text.primary}
							style={{ fillRule: "evenodd" }}
						/>
						<Typography
							// variant={"h5"}
							fontFamily={theme.typography.fontFamily}
							color="inherit"
							fontWeight={700}
							fontSize={20}
							textAlign="left"
							pl={0.5}
						>
							Blog
						</Typography>
					</ButtonBase>
					<Box flexGrow={100} />
					{/* Right section */}
					<Box display="flex" alignItems="end" height="34px">
						{/* Edit */}
						{props.isAuthorized && (
							<NavbarButton
								variant="outline"
								href={`/create/${props.post.id}`}
								// onClick={() =>(window.location.href = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/create/${props.post.id}`)}
								icon={Edit}
								tooltip="Edit post"
								sxButton={{
									height: "34px",
									width: "34px",
									backgroundColor: theme.palette.primary.main + "99",
									mr: 0.5,
								}}
								sxIcon={{
									height: "20px",
									width: "22px",
									color: "inherit",
								}}
							/>
						)}

						{/* Search */}
						<Box>
							{xs ? (
								<NavbarButton
									icon={Search}
									variant="outline"
									onClick={handleSearchModalOpen}
									tooltip={"Search"}
									sxButton={{
										height: "34px",
										width: "34px",
										backgroundColor: theme.palette.primary.main + "99",
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
										backgroundColor: theme.palette.primary.main + "99",
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
						{/* SimpleText */}
						<Box ml={0.5}>
							<NavbarButton
								variant="outline"
								onClick={() => props.simpleTextModal.setOpen(true)}
								text="Aa"
								tooltip="Customize"
								sxButton={{
									height: "34px",
									width: "34px",
									backgroundColor: theme.palette.primary.main + "99",
								}}
								sxText={{ fontSize: "17px", fontFamily: getFontFamilyFromVariable("--font-noto-sans-display") }}
							/>
						</Box>
						{/* Saved */}
						<Box ml={0.5}>
							<NavbarButton
								variant="outline"
								disabled={!props.post.published}
								onClick={() =>
									isSaved
										? setSavedPosts(savedPosts.filter((id) => id !== props.post.id))
										: setSavedPosts([...savedPosts, props.post.id])
								}
								icon={isSaved ? Bookmark : BookmarkBorder}
								tooltip="Save"
								sxButton={{
									height: "34px",
									width: "34px",
									backgroundColor: theme.palette.primary.main + "99",
								}}
								sxIcon={{ height: "20px", width: "22px", opacity: !props.post.published ? "0.5" : "1" }}
							/>
						</Box>
						{/* ShareModal */}
						<Box ml={0.5}>
							<NavbarButton
								disabled={!props.post.published}
								variant="outline"
								onClick={() => props.shareModal.setOpen(true)}
								icon={IosShareOutlined}
								tooltip="Share"
								sxButton={{
									height: "34px",
									width: "34px",
									backgroundColor: theme.palette.primary.main + "99",
								}}
								sxIcon={{ height: "18px", width: "22px", opacity: !props.post.published ? "0.5" : "1" }}
							/>
						</Box>
						{/* Profile Menu */}
						<Box ml={0.5}>
							<ProfileMenu
								anchorEl={anchorElProfileMenu}
								open={openProfileMenu}
								handleMenuOpen={handleProfileMenuClick}
								handleMenuClose={handleProfileMenuClose}
								accountButtonSx={{
									backgroundColor: theme.palette.primary.main + "99",
								}}
								showNotificationsBadge={visibleBadgeNotifications}
								notifications={{
									open: openNotificationsModal,
									handleModalOpen: () => setOpenNotificationsModal(true),
									handleModalClose: () => setOpenNotificationsModal(false),
								}}
								settings={{
									open: openSettingsModal,
									handleModalOpen: () => setOpenSettingsModal(true),
									handleModalClose: () => setOpenSettingsModal(false),
								}}
								isAuthorized={props.isAuthorized}
								sessionUser={props.sessionUser}
							/>
						</Box>
					</Box>
				</Box>
			)}

			{/* Modals */}
			{/* Search */}
			{props.postsOverview && (
				<SearchModal
					open={openSearchModal}
					handleModalOpen={handleSearchModalOpen}
					handleModalClose={handleSearchModalClose}
					postsOverview={props.postsOverview}
					handleSettingsModalOpen={() => setOpenSettingsModal(true)}
					handleNotificationsModalOpen={handleNotificationsModalOpen}
					notificationsBadgeVisible={visibleBadgeNotifications}
					setCardLayout={props.setCardLayout}
					onOpen={() => {
						setOpenSettingsModal(false);
						setOpenNotificationsModal(false);
						handleNotificationsModalClose();
						handleProfileMenuClose();
					}}
					extraActions={extraActions}
					isAuthorized={props.isAuthorized}
					sessionUser={props.sessionUser}
				/>
			)}

			{/* Notifications */}
			<NotificationsModal
				open={openNotificationsModal}
				handleModalOpen={handleNotificationsModalOpen}
				handleModalClose={handleNotificationsModalClose}
				setVisibleBadgeNotifications={setVisibleBadgeNotifications}
			/>
			{/* Settings */}
			<SettingsModal
				open={openSettingsModal}
				handleModalOpen={() => setOpenSettingsModal(true)}
				handleModalClose={() => setOpenSettingsModal(false)}
				handleThemeChange={handleThemeChange}
			/>
			{/* Simple Text */}
			<SimpleTextModal
				open={props.simpleTextModal.open}
				handleModalOpen={() => props.simpleTextModal.setOpen(true)}
				handleModalClose={() => props.simpleTextModal.setOpen(false)}
			/>
			{/* TOC */}
			{props.toc.content && (
				<TOCModal
					open={props.tocModal.open}
					handleModalOpen={() => props.tocModal.setOpen(true)}
					handleModalClose={() => props.tocModal.setOpen(false)}
					headings={extractHeaders(props.toc.content)}
					currentSection={props.toc.currentSection}
					postTitle={props.post.title}
				/>
			)}
			{/* Share */}
			<ShareModal
				open={props.shareModal.open}
				handleModalOpen={() => props.shareModal.setOpen(true)}
				handleModalClose={() => props.shareModal.setOpen(false)}
				data={{
					title: props.post.title,
					description: props.post.description,
					ogImage:
						props.post.ogImage && props.post.ogImage.src && props.post.ogImage.src.trim() !== ""
							? props.post.ogImage
							: {
									src: DATA_DEFAULTS.images.openGraph,
									height: 630,
									width: 1200,
									blurhash: "U00l#at7D%M{ofj[WBayD%Rj-;xuRjayt7of",
							  },
					url: typeof window !== "undefined" ? window.location.href : "",
					height: xs ? 100 : 130,
					width: xs ? 400 : 500,
				}}
			/>
		</>
	);
};
export default PostNavbar;
