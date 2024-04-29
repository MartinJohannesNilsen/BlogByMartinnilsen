import { Close } from "@mui/icons-material";
import { CssBaseline, IconButton } from "@mui/material";
import { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import Script from "next/script";
import { SnackbarProvider, closeSnackbar } from "notistack";
import SessionProvider from "../components/Auth/SessionProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import "../styles/editorJS.scss";
import "../styles/globals.scss";
import { CustomThemeProvider } from "../styles/themes/ThemeProvider";

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fff" },
		{ media: "(prefers-color-scheme: dark)", color: "#161518" },
	],
};

export const metadata: Metadata = {
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
		// shortcut: '/shortcut-icon.png',
		// other: {
		//   rel: 'apple-touch-icon-precomposed',
		//   url: '/apple-touch-icon-precomposed.png',
		// },
	},
	manifest: "/manifest.json",
};

export default async function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();

	return (
		<html lang="en">
			<head></head>
			<body>
				<SessionProvider session={session}>
					{/* <AppRouterCacheProvider options={{ key: "mui", prepend: true, enableCssLayer: true }}> */}
					<AppRouterCacheProvider options={{ key: "css" }}>
						<CustomThemeProvider>
							{/* <SnackbarProvider
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
								> */}

							{process.env.NEXT_PUBLIC_LOCALHOST === "false" && (
								<Script
									defer
									src="https://analytics.mjntech.dev/script.js"
									data-website-id="ea67c45e-6f9e-47f5-b459-6923cfb179a8"
								/>
							)}
							{children}
							{/* </SnackbarProvider> */}
						</CustomThemeProvider>
					</AppRouterCacheProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
