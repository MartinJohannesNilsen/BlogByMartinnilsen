import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useState } from "react";
import { useTheme } from "../../ThemeProvider";

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
      width: "105px",
      height: "105px",
    },
    cardHovered: {
      transform: xl
        ? "scale3d(1.02, 1.02, 1)"
        : lg
        ? "scale3d(1.04, 1.04, 1)"
        : "scale3d(1.05, 1.05, 1)",
      width: "105px",
      height: "105px",
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
      style={{
        background: props.href || props.onClick ? "" : "lightgrey",
      }}
      onMouseOver={() =>
        setState({ raised: props.href || props.onClick ? true : false })
      }
      onMouseOut={() => setState({ raised: false })}
    >
      <CardActionArea
        {...props}
        sx={{
          height: "100%",
          width: "100%",
          "&:hover": {
            background:
              props.href || props.onClick ? theme.palette.primary.main : "",
          },
          // backgroundColor: !props.href && !props.onClick ? "grey" : "",
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" pt={2}>
          <IconButton disabled sx={{ color: "green" }}>
            {props.icon}
          </IconButton>
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
