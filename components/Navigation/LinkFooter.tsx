import { Box, Grid, Link, Typography, useMediaQuery } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { FooterProps } from "../../types";
import usePercentageScrollPosition from "../../utils/usePercentageScrollPosition";
import { MenuIcon } from "../Icons/MenuIcon";

const Footer = ({ postId }: FooterProps) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const scrollPosition = usePercentageScrollPosition();
	const horizontalDesign = true;

	return (
		<>
			{/* Animated scrollbar progress line */}
			{postId ? (
				horizontalDesign ? (
					<Box
						sx={{
							position: "fixed",
							left: 0,
							bottom: 0,
							width: "100%",
							height: "3px",
							borderRadius: 2,
							background: "transparent",
							zIndex: 1,
						}}
					>
						<Box
							sx={{
								height: "100%",
								width: `calc(${scrollPosition}%)`,
								background: theme.palette.secondary.main,
								transition: "background .15s ease",
							}}
						/>
					</Box>
				) : (
					<Box
						sx={{
							position: "fixed",
							right: 5,
							top: "50%",
							height: "400px",
							transform: "translate(-50%, -50%)",
							width: "2px",
							borderRadius: 2,
							background: "transparent",
							zIndex: 1,
						}}
					>
						<Box
							sx={{
								width: "100%",
								height: `calc(${scrollPosition}% - 1px)`,
								background: theme.palette.secondary.main,
								transition: "background .15s ease",
							}}
						/>
					</Box>
				)
			) : (
				<></>
			)}
			{/* Footer */}
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignContent="center"
				py={4}
				px={xs ? 3 : 6}
				sx={{
					userSelect: "none",
					width: "100%",
					backgroundColor: "primary.dark",
					position: "relative",
				}}
			>
				{/* Links */}
				<Grid container spacing={2}>
					<Grid item xs={4} sm={3}>
						<Box display="flex" flexDirection="column">
							<Link underline="none" href="/">
								<Typography
									sx={{
										fontFamily: theme.typography.fontFamily,
										color: theme.palette.text.primary + "50",
										"&:hover": { color: theme.palette.text.primary },
									}}
								>
									Home
								</Typography>
							</Link>
							<Link underline="none" href="/tags">
								<Typography
									sx={{
										fontFamily: theme.typography.fontFamily,
										color: theme.palette.text.primary + "50",
										"&:hover": { color: theme.palette.text.primary },
									}}
								>
									Tags
								</Typography>
							</Link>
							<Link underline="none" href="/about">
								<Typography
									sx={{
										fontFamily: theme.typography.fontFamily,
										color: theme.palette.text.primary + "50",
										"&:hover": { color: theme.palette.text.primary },
									}}
								>
									About
								</Typography>
							</Link>
						</Box>
					</Grid>
					<Grid item xs={4} sm={3}>
						<Box display="flex" flexDirection="column">
							<Link underline="none" href="/account">
								<Typography
									sx={{
										fontFamily: theme.typography.fontFamily,
										color: theme.palette.text.primary + "50",
										"&:hover": { color: theme.palette.text.primary },
									}}
								>
									Account
								</Typography>
							</Link>
							<Link underline="none" href="/design">
								<Typography
									sx={{
										fontFamily: theme.typography.fontFamily,
										color: theme.palette.text.primary + "50",
										"&:hover": { color: theme.palette.text.primary },
									}}
								>
									Design
								</Typography>
							</Link>
							<Link underline="none" href="/feed/rss.xml">
								<Typography
									sx={{
										fontFamily: theme.typography.fontFamily,
										color: theme.palette.text.primary + "50",
										"&:hover": { color: theme.palette.text.primary },
									}}
								>
									RSS
								</Typography>
							</Link>
						</Box>
					</Grid>
					<Grid item xs={4} sm={3}>
						<Box display="flex" flexDirection="column">
							<Link underline="none" href="https://martinjohannesnilsen.no">
								<Typography
									sx={{
										fontFamily: theme.typography.fontFamily,
										color: theme.palette.text.primary + "50",
										"&:hover": { color: theme.palette.text.primary },
									}}
								>
									Portfolio
								</Typography>
							</Link>
							<Link underline="none" href="https://links.martinjohannesnilsen.no">
								<Typography
									sx={{
										fontFamily: theme.typography.fontFamily,
										color: theme.palette.text.primary + "50",
										"&:hover": { color: theme.palette.text.primary },
									}}
								>
									SoMe
								</Typography>
							</Link>
							<Link underline="none" href="https://www.paypal.com/donate/?hosted_button_id=MJFHZZ2RAN7HQ">
								<Typography
									sx={{
										fontFamily: theme.typography.fontFamily,
										color: theme.palette.text.primary + "50",
										"&:hover": { color: theme.palette.text.primary },
									}}
								>
									{/* Buy me a coffee */}
									Buy me a cocoa
								</Typography>
							</Link>
						</Box>
					</Grid>
				</Grid>
				{/* Bottom row */}
				<Box pt={3} display="flex" justifyContent="space-between" width="100%">
					<Typography
						sx={{
							fontFamily: theme.typography.fontFamily,
							color: theme.palette.text.primary + "BB",
						}}
					>
						© {new Date().getFullYear().toString()} Martin Johannes Nilsen ⸺ Norway
						{/* {new Date().getFullYear().toString()} Martin Johannes Nilsen — Norway */}
					</Typography>
					<MenuIcon alt="Website logo" width={22} height={22} fill={theme.palette.text.primary} />
				</Box>
			</Box>
		</>
	);
};
export default Footer;
