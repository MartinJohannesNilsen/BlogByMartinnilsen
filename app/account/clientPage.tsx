"use client";
import { AccountCard } from "@/components/DesignLibrary/Cards/AccountCard";
import { TileButtonCard } from "@/components/DesignLibrary/Cards/TileButtonCard";
import Navbar from "@/components/Navigation/Navbar";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { ServerPageProps } from "@/types";
import useStickyState from "@/utils/useStickyState";
import { Api, Bookmark, Create, Newspaper, Notifications } from "@mui/icons-material";
import { GridLegacy as Grid } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// Modals can be dynamically imported
const PostTableModal = dynamic(() => import("@/components/DesignLibrary/Modals/PostTableModal"));
const NotificationsModal = dynamic(() => import("@/components/DesignLibrary/Modals/NotificationsModal"));

const Account = ({ sessionUser, postsOverview, isAuthorized }: ServerPageProps) => {
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
	const [_, setCardLayout] = useStickyState("cardLayout", "plain");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(false);

		return () => {};
	}, [isLoading]);

	if (isLoading) {
		return <></>;
	}
	return (
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
				posts={postsOverview}
				setCardLayout={setCardLayout}
				isAuthorized={isAuthorized}
				sessionUser={sessionUser}
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
					<AccountCard sessionUser={sessionUser} isAuthorized={isAuthorized} />
				</Grid>
				{isAuthorized && (
					<>
						<Grid item xs={5.7} mb={2}>
							<TileButtonCard
								icon={<Newspaper sx={{ color: theme.palette.text.primary }} />}
								text="Post Table"
								onClick={handlePostTableModalOpen}
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
					<TileButtonCard
						icon={<Bookmark sx={{ color: theme.palette.text.primary }} />}
						text="Saved Posts"
						href="/tags?name=Saved"
					/>
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
			{postsOverview && (
				<PostTableModal
					open={openPostTableModal}
					handleModalOpen={handlePostTableModalOpen}
					handleModalClose={handlePostTableModalClose}
					postsOverview={postsOverview}
				/>
			)}
			<NotificationsModal
				open={openNotificationsModal}
				handleModalOpen={handleNotificationsModalOpen}
				handleModalClose={handleNotificationsModalClose}
				setVisibleBadgeNotifications={setVisibleBadgeNotifications}
			/>
		</Grid>
	);
};
export default Account;
