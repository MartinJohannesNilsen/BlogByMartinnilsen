"use client";
import { ArrowBack, Bookmark, BookmarkBorder, Edit, IosShareOutlined, Search } from "@mui/icons-material";
import { Box, ButtonBase, Typography, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import useAuthorized from "../../components/AuthorizationHook/useAuthorized";
import { NavbarButton } from "../../components/Buttons/NavbarButton";
import ProfileMenu from "../../components/Menus/ProfileMenu";
import { extractHeaders } from "../../components/Modals/TOCModal";
import { DATA_DEFAULTS } from "../../components/SEO/SEO";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { PostNavbarProps, SearchActionProps } from "../../types";
import { handleSharing } from "../../utils/handleSharing";
import useStickyState from "../../utils/useStickyState";
import NavbarSearchButton from "../Buttons/NavbarSearchButton";
import { MenuIcon } from "../Icons/MenuIcon";
import SearchModal from "../Modals/SearchModal";
// Modals can be dynamically imported
const NotificationsModal = dynamic(() => import("../Modals/NotificationsModal"));
const TOCModal = dynamic(() => import("../Modals/TOCModal"));
const ShareModal = dynamic(() => import("../Modals/ShareModal"));
const SettingsModal = dynamic(() => import("../Modals/SettingsModal"));

export const PostNavbar: FC<PostNavbarProps> = (props: PostNavbarProps) => {
	const { isAuthorized, session, status } =
		process.env.NEXT_PUBLIC_LOCALHOST === "true"
			? {
					isAuthorized: true,
					session: {
						user: {
							name: "Martin the developer",
							email: "martinjnilsen@gmail.com",
							image: null,
						},
						expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // A year ahead
					},
					status: "authenticated",
			  }
			: useAuthorized();
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
	const [savedPosts, setSavedPosts] = useStickyState("savedPosts", []);
	// const [savedPosts, setSavedPosts] = useState<string[]>([]);
	const [isSaved, setIsSaved] = useState(false);
	useEffect(() => {
		if (savedPosts && savedPosts) {
			setIsSaved(savedPosts.includes(props.post.id));
		}
		return () => {};
	}, [, savedPosts]);

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
					icon: props.post.ogImage.src || DATA_DEFAULTS.ogImage,
					fallback: () => props.shareModal.setOpen(true),
				});
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
						alignItems="center"
						sx={{
							width: "95%",
						}}
					>
						{isAuthorized ? (
							<NavbarButton
								variant="outline"
								href={`/create/${props.post.id}`}
								// onClick={() =>(window.location.href = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/create/${props.post.id}`)}
								icon={Edit}
								tooltip="Edit post"
								sxButton={{
									minWidth: "34px",
									minHeight: "34px",
									height: "34px",
									width: "34px",
								}}
								sxIcon={{
									height: "20px",
									width: "22px",
									color: "inherit",
								}}
							/>
						) : (
							<NavbarButton
								variant="outline"
								onClick={() => handleNavigate("/")}
								icon={ArrowBack}
								tooltip="Back"
								sxButton={{
									minWidth: "34px",
									minHeight: "34px",
									height: "34px",
									width: "34px",
								}}
								sxIcon={{
									height: "24px",
									width: "24px",
								}}
							/>
						)}
						<Box ml={0.5} mr={0.1}>
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
						<Box flexGrow={100} />
						<Typography
							fontFamily={theme.typography.fontFamily}
							variant="body1"
							fontWeight="800"
							textAlign="center"
							color={theme.palette.text.primary}
							marginX={1}
							sx={{
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}
						>
							{props.post.title}
						</Typography>
						<Box flexGrow={100} />
						<Box display="flex" ml={0.1}>
							{/* Share */}
							{/* <Box mr={0.5}>
								<NavbarButton
									disabled={!props.post.published}
									variant="outline"
									onClick={() => {
										handleSharing({
											url: typeof window !== "undefined" ? window.location.href : "",
											title: props.post.title,
											text: "",
											icon: props.post.ogImage || DATA_DEFAULTS.ogImage,
											fallback: () => props.shareModal.setOpen(true),
										});
									}}
									icon={IosShareOutlined}
									tooltip="Share"
									sxButton={{
										minWidth: "34px",
										minHeight: "34px",
										height: "34px",
										width: "34px",
										"&:disabled": { opacity: "0.5" },
									}}
									sxIcon={{
										height: "18px",
										width: "22px",
									}}
								/>
							</Box> */}

							{/* Save */}
							<Box mr={0.5}>
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
					<Box display="flex">
						{/* Edit */}
						{isAuthorized && (
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

						{/* TOC */}
						{/* {props.toc.content && (
							<NavbarButton
								variant="outline"
								onClick={() => props.tocModal.setOpen(true)}
								icon={MenuBook}
								tooltip="Open table of contents"
								sxButton={{
									height: "34px",
									width: "34px",
									backgroundColor: theme.palette.primary.main + "99",
								}}
								sxIcon={{
									height: "20px",
									width: "24px",
								}}
							/>
						)} */}

						{/* Search */}
						<Box ml={0.5}>
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
								/>
							)}
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
							/>
						</Box>
					</Box>
				</Box>
			)}

			{/* Modals */}
			{/* Search */}
			{props.postOverview && (
				<SearchModal
					open={openSearchModal}
					handleModalOpen={handleSearchModalOpen}
					handleModalClose={handleSearchModalClose}
					postsOverview={props.postOverview}
					handleSettingsModalOpen={() => setOpenSettingsModal(true)}
					handleNotificationsModalOpen={handleNotificationsModalOpen}
					notificationsBadgeVisible={visibleBadgeNotifications}
					setCardLayout={props.setCardLayout}
					onOpen={() => {
						setOpenSettingsModal(false);
						setOpenNotificationsModal(false);
						handleNotificationsModalClose();
						handleProfileMenuClose();
						// handleAboutModalClose();
					}}
					extraActions={extraActions}
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
									src: DATA_DEFAULTS.ogImage,
									height: 630,
									width: 1200,
									blurhash: "U00l#at7D%M{ofj[WBayD%Rj-;xuRjayt7of",
							  },
					url: window.location.href,
					height: xs ? 100 : 130,
					width: xs ? 400 : 500,
				}}
			/>
		</>
	);
};
export default PostNavbar;
