import { Close } from "@mui/icons-material";
import { Divider, IconButton, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { NotificationProps, NotificationsModalProps } from "../../types";
import CustomParagraph from "../EditorJS/Renderers/CustomParagraph";
import StyledControlledSelect, { SelectOption } from "../StyledMUI/StyledControlledSelect";

export const notificationsApiFetcher = async (url: RequestInfo) => {
	// Add apikey header
	const headers = new Headers();
	headers.append("apikey", process.env.NEXT_PUBLIC_API_AUTHORIZATION_TOKEN);

	// Fetch and return
	const res: Response = await fetch(url, {
		method: "GET", // or 'POST', 'PUT', etc.
		headers: headers,
	});
	return await res.json();
};

type UnreadFunctionProps = {
	allNotificationsFilteredOnDate: NotificationProps[];
	allNotificationsFilteredOnDateIds: number[];
	unreadNotifications: NotificationProps[];
	unreadNotificationsIds: number[];
	hasUnreadNotifications: boolean;
};

export const checkForUnreadRecentNotifications = (
	data: NotificationProps[],
	lastRead: number,
	notificationsFilterDays: number,
	notificationsRead: number[]
): UnreadFunctionProps => {
	if (!data) return;
	// Would need to have the filter option days in milliseconds for later
	const notificationDaysInMilliseconds = notificationsFilterDays * 24 * 60 * 60 * 1000;
	// Find all notifications which are either not read or is important, and should should be shown
	const allFilteredOnDateOrImportant = data
		.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
		.filter(
			// Only show new notifications for past (notificationFilterDays) days, but important should be visible as well
			(notification) =>
				Date.parse(notification.createdAt) > lastRead - notificationDaysInMilliseconds || notification.important
		);
	// Find all notifications which are either not read, or is important - but only their id
	const allFilteredOnDateIds = allFilteredOnDateOrImportant.map((notification) => notification.id);
	// Find all notifications that are undread and visible based on notificationsFilterDays option
	const unreadNotifications = data
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

	useEffect(() => {
		if (props.open) {
			props.setLastRead(Date.now());
			// Await to set read for seeing the notifications count
			setTimeout(() => {
				props.setNotificationsRead([...props.notificationsRead, ...props.unreadNotificationsIds]);
			}, 5000);
		}
		return () => {};
	}, [props.open, props.notificationsFilterDays]);

	useEffect(() => {
		console.log("Read", props.notificationsRead);
		console.log("Unread", props.unreadNotificationsIds);
		return () => {};
	}, [props.notificationsRead]);

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
			<Modal
				open={props.open}
				onClose={props.handleModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					{/* Close button */}
					<IconButton
						style={{ position: "absolute", top: "5px", right: "5px" }}
						onClick={() => props.handleModalClose()}
					>
						<Close />
					</IconButton>
					{/* Title */}
					<Typography
						fontFamily={theme.typography.fontFamily}
						variant="h5"
						fontWeight="800"
						color={theme.palette.text.primary}
						mb={1}
					>
						Notifications{" "}
						{props.unreadNotificationsIds.length !== 0 ? `‎ • ‎ ${props.unreadNotificationsIds.length}` : null}
					</Typography>
					{/* <UnstyledSelect value={props.notificationsFilterDays} setValue={props.setNotificationsFilterDays} /> */}
					<StyledControlledSelect value={props.notificationsFilterDays} setValue={props.setNotificationsFilterDays}>
						<SelectOption value={7}>Last 7 days</SelectOption>
						<SelectOption value={14}>Last 14 days</SelectOption>
						<SelectOption value={30}>Last 30 days</SelectOption>
						<SelectOption value={180}>Last 180 days</SelectOption>
						<SelectOption value={365}>Last 365 days</SelectOption>
					</StyledControlledSelect>
					{/* Content */}
					<Box
						sx={{
							border: "1px solid" + (theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300]),
							borderRadius: "5px",
							backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[200],
							padding: "5px 15px 8px 15px",
							overflowY: "scroll",
						}}
					>
						{props.allNotificationsFilteredOnDate.length > 0 ? (
							props.allNotificationsFilteredOnDate.map((notification, index) => (
								<>
									<Box my={1}>
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
											config={null}
											classNames={null}
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
											config={null}
											classNames={null}
										/>
									</Box>
									{index !== props.allNotificationsFilteredOnDate.length - 1 && <Divider sx={{ mt: 2, mb: 1.5 }} />}
								</>
							))
						) : (
							<Typography
								my={1}
								fontFamily={theme.typography.fontFamily}
								variant="body2"
								fontWeight="500"
								color={theme.palette.text.primary}
							>
								No notifications for the past {props.notificationsFilterDays} days
							</Typography>
						)}
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};
export default NotificationsModal;
