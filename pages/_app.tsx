import { Close } from "@mui/icons-material";
import { CssBaseline, IconButton, StyledEngineProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider, closeSnackbar } from "notistack";
import "../styles/editorJS.scss";
import "../styles/globals.scss";
import ThemeProvider from "../styles/themes/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps, session }) {
	return (
		<SessionProvider session={session}>
			<StyledEngineProvider injectFirst>
				<ThemeProvider>
					<SnackbarProvider
						preventDuplicate
						maxSnack={Number(process.env.NEXT_PUBLIC_MAX_STACK_OF_SNACKBARS)}
						// anchorOrigin={{
						// 	vertical: "top",
						// 	horizontal: "center",
						// }}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "right",
						}}
						action={(snackbarId) => (
							<IconButton size="small" disableRipple onClick={() => closeSnackbar(snackbarId)}>
								<Close fontSize="small" sx={{ color: "white" }} />
							</IconButton>
						)}
					>
						<CssBaseline />
						{process.env.NEXT_PUBLIC_LOCALHOST === "false" && <Analytics />}
						<Component {...pageProps} />
					</SnackbarProvider>
				</ThemeProvider>
			</StyledEngineProvider>
		</SessionProvider>
	);
}
export default MyApp;
