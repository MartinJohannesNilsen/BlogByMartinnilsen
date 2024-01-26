import { ArrowBack, Bookmark, BookmarkBorder, Edit, IosShareOutlined, MenuBook } from "@mui/icons-material";
import { Box, ButtonBase, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import logo from "public/assets/imgs/terminal.png";
import { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import useSWR from "swr";
import useAuthorized from "../../components/AuthorizationHook/useAuthorized";
import { NavbarButton } from "../../components/Buttons/NavbarButton";
import ProfileMenu from "../../components/Menus/ProfileMenu";
import NotificationsModal, {
	checkForUnreadRecentNotifications,
	notificationsApiFetcher,
} from "../../components/Modals/NotificationsModal";
import SettingsModal from "../../components/Modals/SettingsModal";
import ShareModal from "../../components/Modals/ShareModal";
import TOCModal, { extractHeaders } from "../../components/Modals/TOCModal";
import { DEFAULT_OGIMAGE } from "../../components/SEO/SEO";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { FullPost } from "../../types";
import useStickyState from "../../utils/useStickyState";

type PostNavbarProps = {
	post: FullPost & { id: string };
	toc: { content: string; currentSection: string };
	shareModal: { open: boolean; setOpen: (value: boolean) => void };
};

export const PostNavbar: FC<PostNavbarProps> = (props: PostNavbarProps) => {
	const { isAuthorized, session, status } =
		process.env.NEXT_PUBLIC_LOCALHOST === "true"
			? {
					isAuthorized: true,
					session: {
						user: {
							name: "Martin the developer",
							email: "martinjnilsen@gmail.com",
							image: "https://mjntech.dev/_next/image?url=%2Fassets%2Fimgs%2Fmjntechdev.png&w=256&q=75",
						},
						expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // A year ahead
					},
					status: "authenticated",
			  }
			: useAuthorized(props.post.published);
	const { theme, setTheme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const handleNavigate = (path: string) => {
		window.location.href = path;
	};
	// Modals
	const [openTOCModal, setOpenTOCModal] = useState(false);
	const [openSettingsModal, setOpenSettingsModal] = useState(false);

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
	const { data } = useSWR(`/api/notifications`, notificationsApiFetcher);
	const [visibleBadgeNotifications, setVisibleBadgeNotifications] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [unreadNotificationsIds, setUnreadNotificationsIds] = useState([]);
	const [lastRead, setLastRead] = useStickyState("lastRead", Date.now());
	const [notificationsFilterDays, setNotificationsFilterDays] = useStickyState("notificationsFilterDays", 30);
	const [notificationsRead, setNotificationsRead] = useStickyState("notificationsRead", []);
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
			setVisibleBadgeNotifications(unreadNotifications.hasUnreadNotifications);
		}
		return () => {};
	}, [data, notificationsRead, notificationsFilterDays]);

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

	// GSAP animate

	return (
		<>
			{/* Modals */}
			{/* Notifications */}
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
					open={openTOCModal}
					handleModalOpen={() => setOpenTOCModal(true)}
					handleModalClose={() => setOpenTOCModal(false)}
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
									src: DEFAULT_OGIMAGE,
									height: 630,
									width: 1200,
									blurhash: "U00l#at7D%M{ofj[WBayD%Rj-;xuRjayt7of",
							  },
					url: window.location.href,
					height: xs ? 100 : 130,
					width: xs ? 400 : 500,
				}}
			/>

			{isMobile ? (
				// Mobile
				<Box
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
							{props.toc.content ? (
								<NavbarButton
									variant="outline"
									onClick={() => setOpenTOCModal(true)}
									icon={MenuBook}
									tooltip="Open table of contents"
									sxButton={{
										minWidth: "34px",
										minHeight: "34px",
										height: "34px",
										width: "34px",
									}}
									sxIcon={{
										height: "20px",
										width: "24px",
									}}
								/>
							) : (
								<Box sx={{ width: "34px" }} />
							)}
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
							disabled={!post.published}
							variant="outline"
							onClick={() => {
								handleSharing({
									url: typeof window !== "undefined" ? window.location.href : "",
									title: post.title,
									text: "",
									icon: post.image || DEFAULT_OGIMAGE,
									fallback: () => setOpenShareModal(true),
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
									sxIcon={{ height: "20px", width: "22px", opacity: !props.post.published && "0.5" }}
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
					display="flex"
					alignItems="center"
					width={"100%"}
					px={3}
					pt={2}
					pb={2}
					position={"sticky"}
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
						onClick={() => handleNavigate("/")}
						disableRipple
						sx={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							color: theme.palette.text.primary,
							"&:hover": {
								color: theme.palette.text.primary + "AA",
							},
						}}
					>
						<Image src={logo.src} alt="" width={32} height={32} style={{ borderRadius: "0" }} />
						<Typography
							// variant={"h5"}
							fontFamily={theme.typography.fontFamily}
							color="inherit"
							fontWeight={700}
							fontSize={22}
							textAlign="left"
							pl={0.5}
						>
							Blog
						</Typography>
					</ButtonBase>
					<Box flexGrow={100} />
					<Box display="flex">
						{isAuthorized && (
							<NavbarButton
								variant="outline"
								href={`/create/${props.post.id}`}
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
						{props.toc.content && (
							<NavbarButton
								variant="outline"
								onClick={() => setOpenTOCModal(true)}
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
						)}
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
								sxIcon={{ height: "20px", width: "22px", opacity: !props.post.published && "0.5" }}
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
								sxIcon={{ height: "18px", width: "22px", opacity: !props.post.published && "0.5" }}
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
		</>
	);
};
export default PostNavbar;
