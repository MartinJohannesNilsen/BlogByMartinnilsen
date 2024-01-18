import { AccessTime, CalendarMonth, Visibility } from "@mui/icons-material";
import { Box, Button, Card, CardActionArea, Typography, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import { FC } from "react";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { PostCardProps } from "../../types";
import PostViews from "../PostViews/PostViews";
import { DEFAULT_OGIMAGE } from "../SEO/SEO";

export const LandingPageGridCard: FC<PostCardProps> = (props) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
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
		<Card className={classes.root} sx={{ width: "100%", borderRadius: 4, boxShadow: "none" }}>
			<CardActionArea
				href={`/posts/${props.id}`}
				sx={{
					height: xs ? "235px" : "260px",
					width: "100%",
					padding: "20px",
				}}
			>
				<Box display="flex" flexDirection="column" sx={{ height: "100%" }}>
					{/* Image and type/tag rows */}
					<Box display="flex" flexDirection="row">
						<Image
							src={props.image || DEFAULT_OGIMAGE}
							alt=""
							fill={true}
							style={{
								borderRadius: 4,
								objectFit: "cover",
							}}
						/>
					</Box>
					{/* Tags */}
					<Box display="flex" flexDirection="row" alignItems="center" pt={0.7} pb={0.6}>
						{props.tags.map((tag, index) => (
							<Button key={index} disabled variant="contained" sx={{ marginRight: 1, backgroundColor: "white" }}>
								<Typography
									variant="body2"
									fontWeight={600}
									color="white"
									fontFamily={theme.typography.fontFamily}
									sx={{
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "webkit-flex",
										WebkitLineClamp: 2,
										lineClamp: 2,
										WebkitBoxOrient: "vertical",
										opacity: 0.6,
									}}
								>
									{tag}
								</Typography>
							</Button>
						))}
					</Box>
					<Box sx={{ flexGrow: 1 }} />

					{/* Date and reading time */}
					<Box display="flex" flexDirection="row" alignItems="center">
						{/* Timestamp */}
						<CalendarMonth
							sx={{
								opacity: 0.6,
								marginRight: "6px",
								fontSize: "default",
								color: "white",
							}}
						/>
						<Typography
							fontFamily={theme.typography.fontFamily}
							variant="body2"
							fontWeight="600"
							sx={{ opacity: 0.6, fontSize: "default", color: "white" }}
						>
							{new Date(props.createdAt).toLocaleDateString("en-GB", {
								day: "2-digit",
								month: "2-digit",
								year: "2-digit",
							})}
						</Typography>
						{/* Read time */}
						<AccessTime
							sx={{
								opacity: 0.6,
								marginLeft: "12px",
								marginRight: "6px",
								fontSize: "default",
								color: "white",
							}}
						/>
						<Typography
							fontFamily={theme.typography.fontFamily}
							variant="body2"
							fontWeight="600"
							sx={{ opacity: 0.6, fontSize: "default", color: "white" }}
						>
							{props.readTime ? props.readTime : "⎯"}
						</Typography>
						{/* View counts */}
						<Visibility
							sx={{
								opacity: 0.6,
								marginLeft: "12px",
								marginRight: "6px",
								fontSize: "default",
								color: "white",
							}}
						/>
						<Typography
							fontFamily={theme.typography.fontFamily}
							variant="body2"
							fontWeight="600"
							sx={{ opacity: 0.6, fontSize: "default", color: "white" }}
						>
							<PostViews
								postId={props.id}
								sx={{
									fontSize: theme.typography.fontSize,
									color: "white",
									fontFamily: theme.typography.fontFamily,
								}}
							/>
						</Typography>
						{/* Not published icon */}
						{!props.published && (
							<>
								<Box flexGrow={100} />
								<Button disabled variant="contained" sx={{ backgroundColor: "white", p: "8px 8px" }}>
									<Typography sx={{ fontSize: "default" }}>🖊</Typography>
								</Button>
							</>
						)}
					</Box>
				</Box>
			</CardActionArea>
		</Card>
	);
};

export default LandingPageGridCard;
