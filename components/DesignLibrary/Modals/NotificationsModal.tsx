"use client";
import StyledControlledSelect, { SelectOption } from "@/components/DesignLibrary/Select/StyledControlledSelect";
import CustomParagraph from "@/components/EditorJS/Renderers/CustomParagraph";
import { getAllNotifications } from "@/data/middleware/notifications/actions";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { NotificationProps, NotificationsModalProps, UnreadFunctionProps } from "@/types";
import useStickyState from "@/utils/useStickyState";
import { Close } from "@mui/icons-material";
import { Box, Divider, IconButton, Modal, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

export const checkForUnreadRecentNotifications = (
	data: NotificationProps[],
	lastRead: number,
	notificationsFilterDays: number,
	notificationsRead: number[]
): UnreadFunctionProps => {
	// if (!data) return;
	// Would need to have the filter option days in milliseconds for later
	const notificationDaysInMilliseconds = notificationsFilterDays * 24 * 60 * 60 * 1000;
	// Find all notifications which are either not read or is important, and should should be shown
	const allFilteredOnDateOrImportant =
		data &&
		data
			.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
			.filter(
				// Only show new notifications for past (notificationFilterDays) days, but important should be visible as well
				(notification) =>
					Date.parse(notification.createdAt) > lastRead - notificationDaysInMilliseconds || notification.important
			);
	// Find all notifications which are either not read, or is important - but only their id
	const allFilteredOnDateIds = allFilteredOnDateOrImportant.map((notification) => notification.id);
	// Find all notifications that are undread and visible based on notificationsFilterDays option
	const unreadNotifications =
		data &&
		data
			.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
			// .filter((notification) => !notificationsRead.includes(notification.id));
			.filter(
				(notification) =>
					!notificationsRead.includes(notification.id) &&
					(Date.parse(notification.createdAt) > Date.now() - notificationDaysInMilliseconds || notification.important) // Also count important in unread notifications as these are visible as well
			); //Need to include the filtering if notificationsFilterDate is larger (thus not visible)
	const unreadNotificationsIds = unreadNotifications.map((notification) => notification.id);
	return {
		allNotificationsFilteredOnDate: allFilteredOnDateOrImportant,
		allNotificationsFilteredOnDateIds: allFilteredOnDateIds,
		unreadNotifications: unreadNotifications,
		unreadNotificationsIds: unreadNotificationsIds,
		hasUnreadNotifications: unreadNotificationsIds.length !== 0,
	};
};

export const NotificationsModal = (props: NotificationsModalProps) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const [fetchedNotifications, setFetchedNotifications] = useState<NotificationProps[]>([]);
	const [notifications, setNotifications] = useState<NotificationProps[]>([]);
	const [unreadNotificationsIds, setUnreadNotificationsIds] = useState<number[]>([]);
	const [lastRead, setLastRead] = useStickyState("lastRead", Date.now(), true);
	const [notificationsFilterDays, setNotificationsFilterDays] = useStickyState("notificationsFilterDays", 30, true);
	const [notificationsRead, setNotificationsRead] = useStickyState("notificationsRead", [], true);

	useEffect(() => {
		getAllNotifications().then((data) => setFetchedNotifications(data));
	}, []);

	// Update modal when data is fetched, when modal is opened or select value is changed
	useEffect(() => {
		if (!fetchedNotifications) return;

		// Logic for finding unread notifications
		const unreadNotifications = checkForUnreadRecentNotifications(
			fetchedNotifications,
			lastRead,
			notificationsFilterDays,
			notificationsRead
		);

		// Set all notifications
		setNotifications(unreadNotifications.allNotificationsFilteredOnDate);

		// Set badge visibility
		props.setVisibleBadgeNotifications(unreadNotifications.hasUnreadNotifications);

		// Set unread ids
		setUnreadNotificationsIds(unreadNotifications.unreadNotificationsIds);

		// Set last read
		setLastRead(Date.now());

		// If open and has unread, we (1) update read notifications, (2) clear list of unread ids, and (3) remove icon badge
		if (props.open && unreadNotifications.hasUnreadNotifications) {
			setTimeout(() => {
				setNotificationsRead([...notificationsRead, ...unreadNotifications.unreadNotificationsIds]);
				setUnreadNotificationsIds([]);
				props.setVisibleBadgeNotifications(false);
			}, 5000);
		}

		return () => {};
	}, [fetchedNotifications, props.open, notificationsFilterDays]);

	// Modal style
	const style = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: xs ? 370 : 500,
		maxHeight: "70vh",
		bgcolor: "background.paper",
		borderRadius: 2,
		outline: 0,
		display: "flex",
		textAlign: "left",
		flexDirection: "column",
		rowGap: "10px",
		justifyContent: "flex-start",
		boxShadow: 24,
		p: xs ? 2 : 4,
	};

	return (
		<Box>
			<Modal open={props.open} onClose={props.handleModalClose}>
				<Box sx={style}>
					{/* Close button */}
					<IconButton
						style={{ position: "absolute", top: "5px", right: "5px" }}
						onClick={() => props.handleModalClose()}
					>
						<Close sx={{ color: theme.palette.text.primary }} />
					</IconButton>
					{/* Title */}
					<Typography
						fontFamily={theme.typography.fontFamily}
						variant="h5"
						fontWeight="800"
						color={theme.palette.text.primary}
						mb={1}
					>
						Notifications {unreadNotificationsIds.length !== 0 && `‎ • ‎ ${unreadNotificationsIds.length}`}
					</Typography>
					{/* <UnstyledSelect value={props.notificationsFilterDays} setValue={props.setNotificationsFilterDays} /> */}
					<StyledControlledSelect value={notificationsFilterDays} setValue={setNotificationsFilterDays}>
						<SelectOption value={7}>Last 7 days</SelectOption>
						<SelectOption value={14}>Last 14 days</SelectOption>
						<SelectOption value={30}>Last 30 days</SelectOption>
						<SelectOption value={60}>Last 60 days</SelectOption>
						<SelectOption value={90}>Last 90 days</SelectOption>
						<SelectOption value={180}>Last 180 days</SelectOption>
						<SelectOption value={365}>Last 365 days</SelectOption>
						<SelectOption value={10 ** 10}>All notifications</SelectOption>
					</StyledControlledSelect>
					{/* Content */}
					<Box
						sx={{
							border: "1px solid" + (theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300]),
							borderRadius: "5px",
							backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[200],
							padding: "5px 15px 8px 0px",
							overflowY: "scroll",
						}}
					>
						{notifications.length > 0 ? (
							notifications.map((notification, index) => (
								<Box key={index}>
									<Box
										my={1}
										sx={
											!notificationsRead.includes(notification.id)
												? { borderLeft: "3px solid " + theme.palette.text.disabled, pl: "12px" }
												: { pl: "15px" }
										}
									>
										<CustomParagraph
											data={{
												text: notification.title,
											}}
											style={{
												typography: {
													...theme.typography.body1,
													// userSelect: "none",
													fontFamily: theme.typography.fontFamily,
													fontWeight: 800,
													color: theme.palette.text.primary,
												},
												box: { my: 0, mb: 0.2 },
											}}
										/>
										<CustomParagraph
											data={{
												text: notification.content,
											}}
											style={{
												typography: {
													...theme.typography.body2,
													// userSelect: "none",
													fontFamily: theme.typography.fontFamily,
													fontWeight: 400,
													color: theme.palette.text.primary,
												},
												box: { my: 0 },
											}}
										/>
									</Box>
									{index !== notifications.length - 1 && <Divider sx={{ mt: 2, mb: 1.5 }} />}
								</Box>
							))
						) : (
							<Typography
								my={1}
								px={1.5}
								fontFamily={theme.typography.fontFamily}
								variant="body2"
								fontWeight="500"
								color={theme.palette.text.primary}
							>
								No notifications for the past {notificationsFilterDays} days
							</Typography>
						)}
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};
export default NotificationsModal;
