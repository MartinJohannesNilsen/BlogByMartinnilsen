import { Avatar, Box, Card, CardContent, Typography, useMediaQuery } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useTheme } from "../../styles/themes/ThemeProvider";
import colors from "../../styles/colors";

type AccountCard = {
	sessionUser:
		| {
				name?: string | null | undefined;
				email?: string | null | undefined;
				image?: string | null | undefined;
		  }
		| undefined;
	isAuthorized: boolean;
};

export const AccountCard: FC<AccountCard> = ({ sessionUser, isAuthorized }) => {
	const { theme } = useTheme();
	const lg = useMediaQuery(theme.breakpoints.only("lg"));
	const xl = useMediaQuery(theme.breakpoints.only("xl"));
	const [state, setState] = useState({
		raised: false,
	});
	const [isLoading, setIsLoading] = useState<boolean>();

	useEffect(() => {
		if (theme) setIsLoading(false);
	}, [theme]);

	if (isLoading) return <></>;
	return (
		<Card
			sx={
				state.raised
					? {
							boxackgroundColor: theme.palette.mode === "light" ? colors.white : colors.lightGrey,
							transition: "transform 0.15s ease-in-out, box-shadow 0.15s",
							transform: xl ? "scale3d(1.02, 1.02, 1)" : lg ? "scale3d(1.04, 1.04, 1)" : "scale3d(1.03, 1.03, 1)",
							boxShadow: theme.palette.mode === "light" ? "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" : "",
							width: "350px",
							padding: 2,
					  }
					: {
							boxackgroundColor: theme.palette.mode === "light" ? colors.white : colors.lightGrey,
							transition: "transform 0.15s ease-in-out, box-shadow 0.15s",
							boxShadow: theme.palette.mode === "light" ? "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" : "",
							width: "350px",
							padding: 2,
					  }
			}
			onMouseOver={() => setState({ raised: true })}
			onMouseOut={() => setState({ raised: false })}
		>
			<Box display="flex" justifyContent="center" alignItems="center" p={2}>
				{/* Image, or first letter of name or anonymous */}
				{sessionUser?.image ? (
					<Avatar sx={{ bgcolor: "black", width: "150px", height: "150px" }} src={sessionUser.image} />
				) : sessionUser?.name ? (
					<Avatar
						sx={{
							bgcolor: theme.palette.text.primary,
							width: "150px",
							height: "150px",
						}}
					>
						<Typography variant="h3" fontWeight={500} color="textSecondary" fontFamily={theme.typography.fontFamily}>
							{sessionUser.name
								.split(" ")
								.map((n) => n[0])
								.join("")
								.substring(0, 5)}
						</Typography>
					</Avatar>
				) : (
					<Avatar
						sx={{
							bgcolor: theme.palette.text.primary,
							width: "150px",
							height: "150px",
						}}
					>
						<Typography variant="h3" fontWeight={500} color="textSecondary" fontFamily={theme.typography.fontFamily}>
							A
						</Typography>
					</Avatar>
				)}
			</Box>
			<CardContent>
				<Box
					display="flex"
					flexDirection="column"
					width="100%"
					alignItems="center"
					justifyItems="center"
					textAlign="center"
					mt={1}
				>
					<Typography
						variant="h5"
						gutterBottom
						sx={{
							fontFamily: theme.typography.fontFamily,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitLineClamp: 1,
							lineClamp: 1,
							WebkitBoxOrient: "vertical",
						}}
					>
						{sessionUser?.name || "Anonymous Reader"}
					</Typography>
					<Typography
						variant="body1"
						sx={{
							fontFamily: theme.typography.fontFamily,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitLineClamp: 1,
							lineClamp: 1,
							WebkitBoxOrient: "vertical",
						}}
					>
						{sessionUser?.email}
					</Typography>
					<Typography
						variant="body1"
						sx={{
							fontWeight: 800,
							color: theme.palette.secondary.main,
							fontFamily: theme.typography.fontFamily,
						}}
						mt={4}
						mb={-1}
					>
						{isAuthorized ? "Wordsmith" : "Adventurer"}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};
export default AccountCard;
