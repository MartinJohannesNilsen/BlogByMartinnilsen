"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { PostRecommendationCardProps } from "@/types";
import { AccessTime, Bookmark, BookmarkBorder, CalendarMonth } from "@mui/icons-material";
import { Box, Card, CardActionArea, Typography, useMediaQuery } from "@mui/material";

export const PostRecommendationCard = (props: PostRecommendationCardProps) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));

	return (
		<Card
			sx={{
				width: "100%",
				boxShadow: "none",
				border: `1px solid ${theme.palette.mode == "dark" ? theme.palette.grey[800] : theme.palette.grey[200]}`,
				"&:hover": {
					backgroundColor: theme.palette.primary.light,
				},
				"&:active": {
					backgroundColor: theme.palette.primary.light,
				},
				backgroundColor: theme.palette.primary.light,
				position: "relative",
			}}
		>
			<CardActionArea
				href={`/posts/${props.id}`}
				sx={{
					width: "100%",
					padding: "20px",
				}}
			>
				<Box display="flex" flexDirection="row" sx={{ height: "100%" }}>
					<Box display="flex" flexDirection="column" sx={{ height: "100%" }}>
						{/* Image, title and summary */}
						<Box display="flex" flexDirection="row">
							{/* Title and summary */}
							<Box pr="15px" display="flex" flexDirection="column" sx={{ maxWidth: "650px" }}>
								<Typography
									variant={"body1"}
									// fontSize={xs ? "16px" : ""}
									fontWeight={700}
									color="textPrimary"
									fontFamily={theme.typography.fontFamily}
									sx={{
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
									mb={0.1}
									variant="body2"
									// fontSize={xs ? "14px" : ""}
									fontWeight={500}
									color="textPrimary"
									fontFamily={theme.typography.fontFamily}
									sx={{
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
						</Box>
						{/* Information gutter */}
						<Box pt="10px">
							<Box display="flex" flexDirection="row" alignItems="center" height="14px">
								{/* Timestamp */}
								<CalendarMonth
									sx={{
										opacity: 0.6,
										marginRight: "6px",
										fontSize: "13px",
									}}
								/>
								<Typography
									fontFamily={theme.typography.fontFamily}
									variant="body2"
									fontWeight="600"
									sx={{ opacity: 0.6, fontSize: "13px" }}
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
										fontSize: "13px",
									}}
								/>
								<Typography
									fontFamily={theme.typography.fontFamily}
									variant="body2"
									fontWeight="600"
									sx={{ opacity: 0.6, fontSize: "13px" }}
								>
									{props.readTime ? props.readTime : "⎯"}
								</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			</CardActionArea>
			{/* Buttons */}
			<Box display="flex" flexDirection="column" sx={{ position: "absolute", right: 12, bottom: 12 }}>
				<NavbarButton
					variant="outline"
					disabled={!props.published}
					onClick={() => props.toggleIsSaved()}
					icon={props.isSaved ? Bookmark : BookmarkBorder}
					tooltip="Save"
					sxButton={{
						height: "34px",
						width: "34px",
						backgroundColor: theme.palette.primary.main + "99",
					}}
					sxIcon={{ height: "20px", width: "22px", opacity: !props.published ? "0.5" : "1" }}
				/>
			</Box>
		</Card>
	);
};

export default PostRecommendationCard;
