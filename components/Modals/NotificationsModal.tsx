import { Close } from "@mui/icons-material";
import { ButtonBase, IconButton, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { NotificationsModalProps } from "../../types";
import useStickyState from "../../utils/useStickyState";
import useSWR from "swr";
import { useEffect } from "react";

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
  allNotificationsFilteredOnDate: [];
  allNotificationsFilteredOnDateIds: number[];
  unreadNotifications: [];
  unreadNotificationsIds: number[];
  unreadNotificationsFilteredOnDateIds: number[];
  hasUnreadNotifications: boolean;
};

export const checkForUnreadRecentNotifications = (
  data: any,
  lastRead: number,
  notificationsRead: number[]
): UnreadFunctionProps => {
  if (!data) return;
  const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
  const allFilteredOnDate = data.filter(
    // Only show notifications on new past 30 days
    (notification) =>
      Date.parse(notification.createdAt) > lastRead - thirtyDaysInMilliseconds
  );
  const allFilteredOnDateIds = allFilteredOnDate.map(
    (notification) => notification.id
  );
  const unreadNotifications = data.filter((notification) => {
    return !notificationsRead.includes(notification.id);
  });
  const unreadNotificationsIds = unreadNotifications.map(
    (notification) => notification.id
  );
  const unreadFilteredOnDateIds = unreadNotifications.filter(
    // Only show notifications on new past 30 days
    (notification) =>
      Date.parse(notification.createdAt) > lastRead - thirtyDaysInMilliseconds
  );
  return {
    allNotificationsFilteredOnDate: allFilteredOnDate,
    allNotificationsFilteredOnDateIds: allFilteredOnDateIds,
    unreadNotifications: unreadNotifications,
    unreadNotificationsIds: unreadNotificationsIds,
    unreadNotificationsFilteredOnDateIds: unreadFilteredOnDateIds,
    hasUnreadNotifications: unreadFilteredOnDateIds.length !== 0,
  };
};

export const NotificationsModal = (props: NotificationsModalProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  useEffect(() => {
    if (props.open) {
      props.setLastRead(Date.now());
      props.setNotificationsRead([
        ...props.notificationsRead,
        ...props.unreadNotificationsIds,
      ]);
      console.log(props.unreadNotificationsIds);
    }
    return () => {};
  }, [props.open]);

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
    p: 4,
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
          <IconButton
            style={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={() => props.handleModalClose()}
          >
            <Close />
          </IconButton>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="h5"
            fontWeight="800"
            color={theme.palette.text.primary}
            mb={1}
          >
            Notifications
          </Typography>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="body1"
            fontWeight="600"
            color={theme.palette.text.primary}
            mb={1}
          >
            Something is in the making!
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};
export default NotificationsModal;
