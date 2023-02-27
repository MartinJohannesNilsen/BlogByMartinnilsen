import { Create, Lock, Logout, Newspaper } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { signOut } from "next-auth/react";
import { useTheme } from "../ThemeProvider";
import useAuthorized from "../components/AuthorizationHook/useAuthorized";
import { AccountCard } from "../components/Cards/AccountCard";
import { TileButtonCard } from "../components/Cards/TileButtonCard";

export const account = () => {
  const { isAuthorized, session, status } = useAuthorized(true);
  const { theme } = useTheme();
  const backgroundBWBreakingPercentage = "45%";

  if (status === "loading") {
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
        <Grid item xs={3.6}>
          <TileButtonCard
            icon={<Newspaper sx={{ color: theme.palette.text.primary }} />}
            text="Posts"
            href="/"
          />
        </Grid>
        <Grid item xs={3.6}>
          <TileButtonCard
            icon={
              isAuthorized ? (
                <Create sx={{ color: theme.palette.text.primary }} />
              ) : (
                <Lock sx={{ color: "red" }} />
              )
            }
            text="Create"
            href={isAuthorized ? "/create" : null}
          />
        </Grid>
        <Grid item xs={3.6}>
          <TileButtonCard
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
            icon={<Logout sx={{ color: theme.palette.text.primary }} />}
            text="Sign Out"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
export default account;
