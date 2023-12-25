import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useState } from "react";
import { useTheme } from "../../styles/themes/ThemeProvider";

type TileButtonCard = {
  icon: any;
  text: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const TileButtonCard: FC<TileButtonCard> = (props) => {
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
      width: "100%",
      height: "100%",
    },
    cardHovered: {
      cursor: "pointer",
      transform: xl
        ? "scale3d(1.02, 1.02, 1)"
        : lg
        ? "scale3d(1.04, 1.04, 1)"
        : "scale3d(1.05, 1.05, 1)",
    },
    link: {
      color: theme.palette.text.primary,
      textDecoration: "none",
      borderBottom: "2px solid " + theme.palette.secondary.main,
    },
  });
  const classes = useStyles();

  // Locked card
  if (props.disabled)
    return (
      <Card className={classes.root}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            alignItems: "center",
            alignContent: "center",
            justifyItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton disabled>{props.icon}</IconButton>
        </Box>
      </Card>
    );
  // Regular card
  return (
    <Card
      className={classes.root}
      classes={{ root: state.raised ? classes.cardHovered : "" }}
      onMouseOver={() => setState({ raised: true })}
      onMouseOut={() => setState({ raised: false })}
    >
      <CardActionArea
        {...props}
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" pt={2}>
          <IconButton disabled>{props.icon}</IconButton>
        </Box>
        <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            alignItems="center"
            justifyItems="center"
            textAlign="center"
            mt={-0.5}
          >
            <Typography variant="button" sx={{ fontSize: 14 }}>
              {props.text}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TileButtonCard;
