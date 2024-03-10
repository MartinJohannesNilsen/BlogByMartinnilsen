import { Box, Link, styled, Tooltip, tooltipClasses, TooltipProps, Typography, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { FC } from "react";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { FooterProps } from "../../types";
import colorLuminance from "../../utils/colorLuminance";
import usePercentageScrollPosition from "../../utils/usePercentageScrollPosition";
import NextLink from "next/link";

const Footer: FC<FooterProps> = (props) => {
	const { theme } = useTheme();
	const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
	const scrollPosition = usePercentageScrollPosition();
	const router = useRouter();
	const { postId } = router.query;

	return (
		<>
			{/* Scrollbar */}
			{postId ? (
				<Box
					sx={{
						position: "fixed",
						left: 0,
						bottom: 0,
						width: "100%",
						// height: "8px",
						height: "5px",
						background: "transparent",
						zIndex: 1,
					}}
				>
					<Box
						sx={{
							height: "100%",
							width: scrollPosition + "0%",
							// background:
							// "radial-gradient(circle at 10% 20%, rgb(233, 122, 129) 0%, rgb(181, 64, 149) 100.2%)",
							background: theme.palette.secondary.main,
							transition: "background .15s ease",
						}}
					/>
				</Box>
			) : (
				<></>
			)}
			{/* Footer */}
			<Box
				display="flex"
				justifyContent="center"
				alignContent="center"
				sx={{
					width: "100%",
					backgroundColor: "primary.dark",
					position: "relative",
				}}
			>
				<Box my={5} px={3} textAlign="center">
					<Box pb={1} px={1}>
						<Typography
							fontFamily={theme.typography.fontFamily}
							variant="body1"
							color="textPrimary"
							style={{ fontWeight: 600, fontSize: lgUp ? "1.1rem" : "0.9rem" }}
						>
							{"Made in 🇳🇴 by "}
							<Link
								component={NextLink}
								fontFamily={theme.typography.fontFamily}
								display="inline-block"
								variant="body1"
								color="textPrimary"
								href={"/posts/yjdttN68e7V3E8SKIupT"}
								sx={{
									fontWeight: 600,
									fontSize: lgUp ? "1.1rem" : "0.9rem",
									textDecoration: "none",
									borderBottom: "2px solid " + colorLuminance(theme.palette.secondary.main, 0.15),
									"&:hover": {
										borderBottom: "2px solid " + theme.palette.secondary.main,
									},
								}}
							>
								Martin
							</Link>
						</Typography>
					</Box>
				</Box>
			</Box>
		</>
	);
};
export default Footer;
