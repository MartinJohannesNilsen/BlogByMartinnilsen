"use client";
import PostViews from "@/components/PostViews/PostViews";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { PostCardProps } from "@/types";
import { AccessTime, CalendarMonth, Visibility } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";

export const LandingPageListCard = (props: PostCardProps) => {
	const { theme } = useTheme();

	return (
		<Link href={`/posts/${props.id}`} component={NextLink}>
			<Box
				display="flex"
				flexDirection="column"
				sx={{
					color: theme.palette.text.primary,
					"&:hover": {
						color: theme.palette.text.primary + "BB",
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
							viewCount={props.views ? props.views[props.id] : undefined}
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
