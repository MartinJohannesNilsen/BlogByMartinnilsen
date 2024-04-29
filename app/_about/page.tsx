"use client";
import { Box } from "@mui/material";
import { Metadata } from "next";
// import useAuthorized from "../../components/AuthorizationHook/useAuthorized";
import { useTheme } from "../../styles/themes/ThemeProvider";

const About = () => {
	// const { isAuthorized, session, status } =
	// 	process.env.NEXT_PUBLIC_LOCALHOST === "true"
	// 		? {
	// 				isAuthorized: true,
	// 				session: {
	// 					user: {
	// 						name: "Martin the developer",
	// 						email: "martinjnilsen@gmail.com",
	// 						image: null,
	// 					},
	// 					expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // A year ahead
	// 				},
	// 				status: "authenticated",
	// 		  }
	// 		: useAuthorized(true);
	const { theme, setTheme } = useTheme();

	const metadata: Metadata = {
		title: "About",
		description: "About the tech blog",
	};

	// if (status === "loading") {
	// 	return <></>;
	// }
	return <Box sx={{ minHeight: "100vh", minWidth: "100vw", backgroundColor: theme.palette.primary.main }}></Box>;
};
export default About;
