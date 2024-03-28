import { Api, Bookmark, Create, Newspaper, Notifications } from "@mui/icons-material";
import { Grid } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import useAuthorized from "../components/AuthorizationHook/useAuthorized";
import { AccountCard } from "../components/Cards/AccountCard";
import { TileButtonCard } from "../components/Cards/TileButtonCard";
import Navbar from "../components/Navbar/Navbar";
import SEO from "../components/SEO/SEO";
import { useTheme } from "../styles/themes/ThemeProvider";
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
							image: null,
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
	const [visibleBadgeNotifications, setVisibleBadgeNotifications] = useState(false);

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
					setVisibleBadgeNotifications={setVisibleBadgeNotifications}
				/>
			</Grid>
		</SEO>
	);
};
export default Account;
