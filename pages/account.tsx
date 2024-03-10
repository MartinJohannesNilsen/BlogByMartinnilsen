import { Api, Bookmark, Create, Newspaper, Notifications } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useAuthorized from "../components/AuthorizationHook/useAuthorized";
import { AccountCard } from "../components/Cards/AccountCard";
import { TileButtonCard } from "../components/Cards/TileButtonCard";
import { checkForUnreadRecentNotifications, notificationsApiFetcher } from "../components/Modals/NotificationsModal";
import Navbar from "../components/Navbar/Navbar";
import SEO from "../components/SEO/SEO";
import { useTheme } from "../styles/themes/ThemeProvider";
import useStickyState from "../utils/useStickyState";
import dynamic from "next/dynamic";
// Modals can be dynamically imported
const PostTableModal = dynamic(() => import("../components/Modals/PostTableModal"));
const NotificationsModal = dynamic(() => import("../components/Modals/NotificationsModal"));

export const Account = () => {
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
			: useAuthorized(true);
	const { theme } = useTheme();
	const backgroundBWBreakingPercentage = "45%";
	// Post Table Modal
	const [openPostTableModal, setOpenPostTableModal] = useState(false);
	const handlePostTableModalOpen = () => setOpenPostTableModal(true);
	const handlePostTableModalClose = () => setOpenPostTableModal(false);
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
			// setUnreadNotificationsIds(unreadNotifications.unreadNotificationsFilteredOnDateIds); // TODO Filter on day select option
			setVisibleBadgeNotifications(unreadNotifications.hasUnreadNotifications);
		}
		return () => {};
	}, [data, notificationsRead, notificationsFilterDays]);

	if (status === "loading") {
		return <></>;
	}
	return (
		<SEO pageMeta={{ title: "Account" }}>
			<Grid
				container
				spacing={0}
				direction="column"
				gridTemplateColumns="100px 100px 100px"
				alignContent="center"
				justifyContent="center"
				sx={{
					minHeight: "100vh",
					width: "100%",
					background: `linear-gradient(to bottom, ${theme.palette.primary.contrastText} 0%, ${theme.palette.primary.contrastText} ${backgroundBWBreakingPercentage}, ${theme.palette.primary.main} ${backgroundBWBreakingPercentage}, ${theme.palette.primary.main} 100%)`,
				}}
			>
				<Navbar
					backgroundColor={theme.palette.primary.contrastText}
					textColor={theme.palette.primary.main}
					accountPage={true}
				/>
				<Grid
					container
					sx={{ width: "350px" }}
					justifyContent="space-between"
					justifyItems="space-between"
					alignItems="space-between"
					alignContent="space-between"
				>
					<Grid item xs={12} mb={2}>
						<AccountCard session={session} isAuthorized={isAuthorized} />
					</Grid>
					{isAuthorized && (
						<>
							<Grid item xs={5.7} mb={2}>
								<TileButtonCard
									href={"/create"}
									icon={<Create sx={{ color: theme.palette.text.primary }} />}
									text="Create"
								/>
							</Grid>
							<Grid item xs={5.7} mb={2}>
								<TileButtonCard
									href={"/apidoc"}
									icon={<Api sx={{ color: theme.palette.text.primary }} />}
									text="API-DOC"
								/>
							</Grid>
						</>
					)}
					<Grid item xs={5.7}>
						{isAuthorized ? (
							<TileButtonCard
								icon={<Newspaper sx={{ color: theme.palette.text.primary }} />}
								text="Post Table"
								onClick={handlePostTableModalOpen}
							/>
						) : (
							// <TileButtonCard icon={<Newspaper sx={{ color: theme.palette.text.primary }} />} text="Posts" href="/" />
							<TileButtonCard
								icon={<Bookmark sx={{ color: theme.palette.text.primary }} />}
								text="Saved Posts"
								href="/tags?name=Saved"
							/>
						)}
					</Grid>
					<Grid item xs={5.7}>
						<TileButtonCard
							showBadge={visibleBadgeNotifications}
							// disabled
							icon={<Notifications sx={{ color: theme.palette.text.primary }} />}
							text="Notifications"
							onClick={handleNotificationsModalOpen}
						/>
					</Grid>
				</Grid>

				{/* Modals */}
				<PostTableModal
					open={openPostTableModal}
					handleModalOpen={handlePostTableModalOpen}
					handleModalClose={handlePostTableModalClose}
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
			</Grid>
		</SEO>
	);
};
export default Account;
