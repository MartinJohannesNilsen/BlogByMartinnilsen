import { Close } from "@mui/icons-material";
import { CssBaseline, IconButton, StyledEngineProvider } from "@mui/material";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider, closeSnackbar } from "notistack";
import "../styles/editorJS.scss";
import "../styles/globals.scss";
import ThemeProvider from "../styles/themes/ThemeProvider";

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
						{process.env.NEXT_PUBLIC_LOCALHOST === "false" && (
							<Script
								defer
								src="https://analytics.mjntech.dev/script.js"
								data-website-id="ea67c45e-6f9e-47f5-b459-6923cfb179a8"
							/>
						)}
						<Component {...pageProps} />
					</SnackbarProvider>
				</ThemeProvider>
			</StyledEngineProvider>
		</SessionProvider>
	);
}
export default MyApp;
