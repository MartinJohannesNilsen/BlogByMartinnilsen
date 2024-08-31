"use client";
import PostViews from "@/components/PostViews/PostViews";
import { defaultTheme } from "@/styles/themes/themeDefaults";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { PostCardProps } from "@/types";
import { AccessTime, CalendarMonth, Visibility } from "@mui/icons-material";
import { Box, Button, Card, CardActionArea, Typography } from "@mui/material";
import NextLink from "next/link";

export const LandingPageListCard = (props: PostCardProps) => {
	const { theme } = useTheme();

	return (
		<Card
			sx={{
				width: "100%",
				border: `2px solid ${theme.palette.mode == "dark" ? theme.palette.grey[800] : theme.palette.grey[100]}`,
				"&:hover": {
					backgroundColor: theme.palette.primary.light,
				},
				"&:active": {
					backgroundColor: theme.palette.primary.light,
				},
				backgroundColor: theme.palette.primary.light,
				borderRadius: 4,
				boxShadow: "none",
			}}
		>
			<CardActionArea
				// disableTouchRipple
				href={`/posts/${props.id}`}
				sx={{
					// height: 240,
					width: "100%",
				}}
			>
				<Box
					display="flex"
					flexDirection="column"
					sx={{
						height: "210px",
						padding: "10px 15px",
					}}
				>
					{/* Title and description */}
					<Box display="flex" flexDirection="column" pt={0} sx={{ maxWidth: "650px" }}>
						<Typography
							fontWeight={700}
							color="textPrimary"
							fontFamily={theme.typography.fontFamily}
							fontSize={defaultTheme.typography.h6.fontSize}
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
						<Typography
							mt={1}
							fontWeight={500}
							color="textPrimary"
							fontFamily={theme.typography.fontFamily}
							fontSize={defaultTheme.typography.body1.fontSize}
							sx={{
								lineHeight: "26px",
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "webkit-flex",
								WebkitLineClamp: 2,
								lineClamp: 2,
								WebkitBoxOrient: "vertical",
							}}
						>
							{props.description}
						</Typography>
					</Box>
					{/* Tags */}
					<Box sx={{ flexGrow: 1 }} />
					{/* Information gutter */}
					<Box>
						{/* Tags */}
						<Box display="flex" flexDirection="row" alignItems="center" pt={2} pb={0.6}>
							{props.tags.map((tag, index) => (
								<Button LinkComponent={NextLink} key={index} disabled variant="contained" sx={{ marginRight: 1 }}>
									<Typography
										fontWeight={600}
										color="textPrimary"
										fontFamily={theme.typography.fontFamily}
										fontSize={defaultTheme.typography.body2.fontSize}
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
						{/* Date and reading time */}
						<Box display="flex" flexDirection="row" alignItems="center">
							{/* Timestamp */}
							<CalendarMonth
								sx={{
									opacity: 0.6,
									marginRight: "6px",
									fontSize: "default",
								}}
							/>
							<Typography
								fontFamily={theme.typography.fontFamily}
								variant="body2"
								fontWeight="600"
								sx={{ opacity: 0.6, fontSize: "default" }}
							>
								{new Date(props.createdAt).toLocaleDateString("en-GB", {
									day: "2-digit",
									month: "2-digit",
									year: "2-digit",
									timeZone: "Europe/Oslo",
								})}
							</Typography>
							{/* Read time */}
							<AccessTime
								sx={{
									opacity: 0.6,
									marginLeft: "12px",
									marginRight: "6px",
									fontSize: "default",
								}}
							/>
							<Typography
								fontFamily={theme.typography.fontFamily}
								variant="body2"
								fontWeight="600"
								sx={{ opacity: 0.6, fontSize: "default" }}
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
								}}
							/>
							<Typography
								fontFamily={theme.typography.fontFamily}
								variant="body2"
								fontWeight="600"
								sx={{ opacity: 0.6, fontSize: "default" }}
							>
								<PostViews
									viewCount={props.views ? props.views[props.id] : undefined}
									sx={{
										fontSize: theme.typography.fontSize,
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
				</Box>
			</CardActionArea>
		</Card>
	);
};

export default LandingPageListCard;
