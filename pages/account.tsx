import { Create, Lock, Logout, Newspaper } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { signOut } from "next-auth/react";
import { useTheme } from "../ThemeProvider";
import useAuthorized from "../components/AuthorizationHook/useAuthorized";
import { AccountCard } from "../components/Cards/AccountCard";
import { TileButtonCard } from "../components/Cards/TileButtonCard";
import SEO from "./SEO";

export const Account = () => {
  const { isAuthorized, session, status } = useAuthorized(true);
  const { theme } = useTheme();
  const backgroundBWBreakingPercentage = "45%";

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
              disabled={!isAuthorized}
              icon={
                isAuthorized ? (
                  <Create sx={{ color: theme.palette.text.primary }} />
                ) : (
                  <Lock sx={{ fontSize: 36, opacity: 0.25 }} />
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
    </SEO>
  );
};
export default Account;
