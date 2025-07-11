"use client";
import BlurHashHTMLImage from "@/components/DesignLibrary/Image/BlurHashHTMLImage";
import PostViews from "@/components/Skeletons/PostViews";
import { DATA_DEFAULTS } from "@/data/metadata";
import { defaultTheme } from "@/styles/themes/themeDefaults";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { PostCardProps } from "@/types";
import { AccessTime, CalendarMonth, Visibility } from "@mui/icons-material";
import { Box, Button, Card, CardActionArea, CardMedia, Typography, useMediaQuery } from "@mui/material";
import NextLink from "next/link";

export const LandingPageGridCard = (props: PostCardProps) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));

	return (
		<Card
			sx={{
				height: xs ? "235px" : "260px",
				position: "relative",
				width: "100%",
				borderRadius: 4,
				boxShadow: "none",
				backgroundColor: theme.palette.primary.light,
			}}
		>
			<CardMedia>
				<BlurHashHTMLImage
					src={props.ogImage.src || DATA_DEFAULTS.images.openGraph}
					blurhash={{ encoded: props.ogImage.blurhash!, width: 100, height: 100 }}
					alt={`OpenGraph image for post titled "${props.title}"`}
					style={{
						width: "100%",
						height: xs ? "235px" : "260px",
						position: "absolute",
						left: 0,
						top: 0,
						right: 0,
						bottom: 0,
						objectFit: "cover",
						borderRadius: 4,
					}}
				/>
			</CardMedia>
			<CardActionArea
				href={`/posts/${props.id}`}
				sx={{
					height: xs ? "235px" : "260px",
					width: "100%",
					padding: "20px",
				}}
			>
				<Box display="flex" flexDirection="column" sx={{ height: "100%" }}>
					{/* Tags */}
					<Box display="flex" flexDirection="row" alignItems="center" pt={0.7} pb={0.6}>
						{props.tags.map((tag, index) => (
							<Button
								LinkComponent={NextLink}
								key={index}
								disabled
								variant="contained"
								sx={{ marginRight: 1, backgroundColor: "white" }}
							>
								<Typography
									fontWeight={600}
									color="white"
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
								viewCount={props.views ? props.views[props.id] : undefined}
								sx={{
									fontSize: theme.typography.fontSize,
									color: "white",
									fontFamily: theme.typography.fontFamily,
								}}
							/>
						</Typography>
					</Box>
				</Box>
			</CardActionArea>
		</Card>
	);
};

export default LandingPageGridCard;
