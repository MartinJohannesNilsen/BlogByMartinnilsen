import { auth } from "@/auth";
import { Metadata, Viewport } from "next";
import Script from "next/script";
import SessionProvider from "../components/Auth/SessionProvider";
import CustomSnackbarProvider from "../components/SnackbarProvider/CustomSnackbarProvider";
import { defaultMetadata } from "../data/metadata";
import "../styles/editorJS.scss";
import "../styles/globals.scss";
import { CustomThemeProvider } from "../styles/themes/ThemeProvider";

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#161518" },
	],
};

export const metadata: Metadata = {
	...defaultMetadata,
};

export default async function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	return (
		<html lang="en">
			<head></head>
			<body>
				<SessionProvider session={session}>
					<CustomThemeProvider>
						<CustomSnackbarProvider>
							{process.env.NEXT_PUBLIC_LOCALHOST === "false" && (
								<Script
									defer
									src="https://analytics.mjntech.dev/script.js"
									data-website-id="ea67c45e-6f9e-47f5-b459-6923cfb179a8"
								/>
							)}
							{children}
						</CustomSnackbarProvider>
					</CustomThemeProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
