"use client";
import colors from "@/styles/colors";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { TileButtonCardProps } from "@/types";
import {
	Badge,
	Box,
	Card,
	CardActionArea,
	CardContent,
	Icon,
	IconButton,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { useState } from "react";

export const TileButtonCard = (props: TileButtonCardProps) => {
	const { theme } = useTheme();
	const lg = useMediaQuery(theme.breakpoints.only("lg"));
	const xl = useMediaQuery(theme.breakpoints.only("xl"));
	const [state, setState] = useState({
		raised: false,
	});
	const { showBadge, ...cardActionAreaProps } = props;

	// Locked card
	if (props.disabled)
		return (
			<Card>
				<Box
					sx={{
						transition: "transform 0.15s ease-in-out, box-shadow 0.15s",
						backgroundColor: theme.palette.primary.main,
						boxShadow: theme.palette.mode === "light" ? "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" : "",
						width: "100%",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						alignContent: "center",
						justifyItems: "center",
						justifyContent: "center",
					}}
				>
					<IconButton disabled sx={{ opacity: 0.5 }}>
						{props.icon}
					</IconButton>
				</Box>
			</Card>
		);
	// Regular card
	return (
		<Card
			sx={
				state.raised
					? {
							boxackgroundColor: theme.palette.mode === "light" ? colors.white : colors.lightGrey,
							transition: "transform 0.15s ease-in-out, box-shadow 0.15s",
							boxShadow: theme.palette.mode === "light" ? "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" : "",
							cursor: "pointer",
							transform: xl ? "scale3d(1.02, 1.02, 1)" : lg ? "scale3d(1.04, 1.04, 1)" : "scale3d(1.05, 1.05, 1)",
					  }
					: {
							boxackgroundColor: theme.palette.mode === "light" ? colors.white : colors.lightGrey,
							transition: "transform 0.15s ease-in-out, box-shadow 0.15s",
							boxShadow: theme.palette.mode === "light" ? "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" : "",
							width: "100%",
							height: "100%",
					  }
			}
			onMouseOver={() => setState({ raised: true })}
			onMouseOut={() => setState({ raised: false })}
		>
			<CardActionArea
				{...cardActionAreaProps}
				sx={{
					height: "100%",
					width: "100%",
				}}
			>
				<Box display="flex" justifyContent="center" alignItems="center" pt={2}>
					{showBadge ? (
						<Badge
							color="secondary"
							variant="dot"
							invisible={false}
							overlap="circular"
							badgeContent=" "
							sx={{
								position: "relative", // Use relative positioning
								left: "-6px", // Adjust left position as needed
								top: "5px",
							}}
						>
							<Icon
								sx={{
									position: "relative", // Use relative positioning
									right: "-6px", // Adjust left position as needed
									bottom: "5px",
								}}
							>
								{props.icon}
							</Icon>
						</Badge>
					) : (
						<Icon>{props.icon}</Icon>
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
						mt={-0.5}
					>
						<Typography variant="button" sx={{ fontSize: 14, fontFamily: theme.typography.fontFamily }}>
							{props.text}
						</Typography>
					</Box>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default TileButtonCard;
