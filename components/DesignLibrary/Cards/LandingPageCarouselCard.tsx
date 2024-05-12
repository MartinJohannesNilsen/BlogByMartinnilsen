"use client";
import BlurHashHTMLImage from "@/components/DesignLibrary/Image/BlurHashHTMLImage";
import PostViews from "@/components/PostViews/PostViews";
import { DATA_DEFAULTS } from "@/data/metadata";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { PostCardProps } from "@/types";
import { AccessTime, CalendarMonth, Visibility } from "@mui/icons-material";
import { Box, Button, Card, CardActionArea, CardMedia, Typography, useMediaQuery } from "@mui/material";
import NextLink from "next/link";
import { isMobile } from "react-device-detect";

export const LandingPageCarouselCard = (props: PostCardProps) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));

	return (
		<Card
			sx={{
				// transition: "transform 0.15s ease-in-out, box-shadow 0.15s",
				width: "100%",
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
				tabIndex={0}
				// disableTouchRipple
				href={`/posts/${props.id}`}
				sx={{
					height: xs ? (isMobile ? 490 : 540) : 520,
					maxHeight: xs ? (isMobile ? 490 : 540) : 520,
					width: "100%",
				}}
			>
				<CardMedia sx={{ height: xs ? 250 : 230 }}>
					<BlurHashHTMLImage
						src={props.ogImage.src || DATA_DEFAULTS.images.openGraph}
						blurhash={{ encoded: props.ogImage.blurhash! }}
						alt={`OpenGraph image for post titled "${props.title}"`}
						style={{
							width: "100%",
							height: xs ? 250 : 230,
							objectFit: "cover",
							borderRadius: 0,
						}}
					/>
				</CardMedia>
				<Box
					display="flex"
					flexDirection="column"
					sx={{
						height: xs && isMobile ? "235px" : "285px",
						padding: "10px 15px",
					}}
				>
					{/* Title and description */}
					<Box display="flex" flexDirection="column" pt={0} sx={{ maxWidth: "650px" }}>
						<Typography
							variant="h6"
							fontWeight={700}
							color="textPrimary"
							fontFamily={theme.typography.fontFamily}
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
							{props.title}
						</Typography>
						<Typography
							mt={1}
							variant="body1"
							fontWeight={500}
							color="textPrimary"
							fontFamily={theme.typography.fontFamily}
							sx={{
								lineHeight: "26px",
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "webkit-flex",
								WebkitLineClamp: 5,
								lineClamp: 5,
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
						<Box display="flex" flexDirection="row" alignItems="center" pt={3} pb={1}>
							{props.tags.map((tag, index) => (
								<Button LinkComponent={NextLink} key={index} disabled variant="contained" sx={{ marginRight: 1 }}>
									<Typography
										variant="body2"
										fontWeight={600}
										color="textPrimary"
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

export default LandingPageCarouselCard;
