import { AccessTime, CalendarMonth, Visibility } from "@mui/icons-material";
import { Box, Link, Typography, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, useState } from "react";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { PostCardProps } from "../../types";
import PostViews from "../PostViews/PostViews";

export const LandingPageListCard: FC<PostCardProps> = (props) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const lg = useMediaQuery(theme.breakpoints.only("lg"));
	const xl = useMediaQuery(theme.breakpoints.only("xl"));
	const [state, setState] = useState({
		raised: false,
	});
	const useStyles = makeStyles({
		root: {
			width: "100%",
			"&:hover": {
				backgroundColor: theme.palette.primary.light,
			},
			"&:active": {
				backgroundColor: theme.palette.primary.light,
			},
			backgroundColor: theme.palette.primary.light,
		},
	});
	const classes = useStyles();

	return (
		<Link href={`/posts/${props.id}`}>
			<Box
				display="flex"
				flexDirection="column"
				sx={{
					color: theme.palette.text.primary,
					"&:hover": {
						color: theme.palette.secondary.main,
					},
					// height: "235px",
					// padding: "10px 15px",
				}}
			>
				{/* Title and description */}
				<Box display="flex" flexDirection="column" pt={0} sx={{ maxWidth: "650px", color: "inherit" }}>
					<Typography
						variant="body1"
						fontWeight={700}
						color="inherit"
						fontFamily={theme.typography.fontFamily}
						sx={{
							mt: 1,
							lineHeight: "26px",
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitLineClamp: 2,
							lineClamp: 2,
							WebkitBoxOrient: "vertical",
						}}
					>
						{props.title}
					</Typography>
				</Box>
				{/* Information gutter */}
				<Box display="flex" flexDirection="row" alignItems="center">
					{/* Timestamp */}
					<CalendarMonth
						sx={{
							opacity: 0.6,
							marginRight: "6px",
							fontSize: 12,
						}}
					/>
					<Typography
						fontFamily={theme.typography.fontFamily}
						variant="body2"
						fontWeight="600"
						sx={{ opacity: 0.6, fontSize: 12 }}
					>
						{new Date(props.createdAt).toLocaleDateString("en-GB", {
							// day: "2-digit",
							// month: "short",
							// year: "numeric",
							day: "2-digit",
							month: "long",
							year: "2-digit",
						})}
					</Typography>
					{/* Read time */}
					<AccessTime
						sx={{
							opacity: 0.6,
							marginLeft: "12px",
							marginRight: "6px",
							fontSize: 12,
						}}
					/>
					<Typography
						fontFamily={theme.typography.fontFamily}
						variant="body2"
						fontWeight="600"
						sx={{ opacity: 0.6, fontSize: 12 }}
					>
						{props.readTime ? props.readTime : "⎯"}
					</Typography>
					{/* View counts */}
					<Visibility
						sx={{
							opacity: 0.6,
							marginLeft: "12px",
							marginRight: "6px",
							fontSize: 12,
						}}
					/>
					<Typography
						fontFamily={theme.typography.fontFamily}
						variant="body2"
						fontWeight="600"
						sx={{ opacity: 0.6, fontSize: 12 }}
					>
						<PostViews
							postId={props.id}
							sx={{
								fontSize: 12,
								color: theme.palette.text.primary,
								fontFamily: theme.typography.fontFamily,
							}}
						/>
					</Typography>
					{/* Not published icon */}
					{!props.published && (
						<>
							<Box flexGrow={100} /> <Typography sx={{ fontSize: "default" }}>🖊</Typography>
						</>
					)}
				</Box>
			</Box>
		</Link>
	);
};

export default LandingPageListCard;
