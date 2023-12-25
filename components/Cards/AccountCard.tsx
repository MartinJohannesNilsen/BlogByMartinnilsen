import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Session } from "next-auth";
import { FC, useState } from "react";
import { useTheme } from "../../styles/themes/ThemeProvider";

type AccountCard = {
  session: Session;
  isAuthorized: boolean;
};

export const AccountCard: FC<AccountCard> = (props) => {
  const { theme } = useTheme();
  const lg = useMediaQuery(theme.breakpoints.only("lg"));
  const xl = useMediaQuery(theme.breakpoints.only("xl"));
  const [state, setState] = useState({
    raised: false,
  });
  const useStyles = makeStyles({
    root: {
      transition: "transform 0.15s ease-in-out, box-shadow 0.15s",
      boxShadow:
        theme.palette.mode === "light"
          ? "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
          : "",
      width: "350px",
    },
    cardHovered: {
      transform: xl
        ? "scale3d(1.02, 1.02, 1)"
        : lg
        ? "scale3d(1.04, 1.04, 1)"
        : "scale3d(1.03, 1.03, 1)",
      width: "350px",
    },
    link: {
      color: theme.palette.text.primary,
      textDecoration: "none",
      borderBottom: "2px solid " + theme.palette.secondary.main,
    },
  });
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
      classes={{ root: state.raised ? classes.cardHovered : "" }}
      onMouseOver={() => setState({ raised: true })}
      onMouseOut={() => setState({ raised: false })}
      sx={{ padding: 2 }}
    >
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        {props.session.user.image ? (
          <Avatar
            sx={{ bgcolor: "black", width: "150px", height: "150px" }}
            src={props.session.user.image}
          />
        ) : props.session.user.name ? (
          <Avatar
            sx={{
              bgcolor: theme.palette.text.primary,
              width: "150px",
              height: "150px",
            }}
          >
            <Typography
              variant="h3"
              fontWeight={500}
              color="textSecondary"
              fontFamily={theme.typography.fontFamily}
            >
              {props.session.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 5)}
            </Typography>
          </Avatar>
        ) : (
          <Avatar
            sx={{
              bgcolor: theme.palette.text.primary,
              width: "150px",
              height: "150px",
            }}
          >
            <Typography
              variant="h3"
              fontWeight={500}
              color="textSecondary"
              fontFamily={theme.typography.fontFamily}
            >
              ANON
            </Typography>
          </Avatar>
        )}
      </Box>
      <CardContent>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems="center"
          justifyItems="center"
          textAlign="center"
          mt={1}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "webkit-flex",
              WebkitLineClamp: 1,
              lineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {props.session.user.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "webkit-flex",
              WebkitLineClamp: 1,
              lineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {props.session.user.email}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: 800, color: theme.palette.secondary.main }}
            mt={4}
            mb={-1}
          >
            {props.isAuthorized ? "Wordsmith" : "Adventurer"}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <IconButton></IconButton>
      </CardActions>
    </Card>
  );
};
export default AccountCard;
