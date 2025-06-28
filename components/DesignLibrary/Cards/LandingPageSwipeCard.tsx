"use client";
import BlurHashHTMLImage from "@/components/DesignLibrary/Image/BlurHashHTMLImage";
import PostViews from "@/components/Skeletons/PostViews";
import { DATA_DEFAULTS } from "@/data/metadata";
import { defaultTheme } from "@/styles/themes/themeDefaults";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { PostCardProps } from "@/types";
import { AccessTime, CalendarMonth, Visibility } from "@mui/icons-material";
import { Box, Button, Card, Typography, useMediaQuery } from "@mui/material";
import NextLink from "next/link";
import { isMobile } from "react-device-detect";

export const LandingPageCarouselCard = (props: PostCardProps) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));

	return (
		<Card
			sx={{
				borderRadius: 4,
				boxShadow: "none",
				height: xs ? (isMobile ? 520 : 540) : 520,
				maxHeight: xs ? (isMobile ? 520 : 540) : 520,
				width: "100%",
			}}
		>
			<Box
				sx={{
					backgroundColor:
						theme.palette.mode === "dark"
							? "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))"
							: "rgb(245, 245, 247)",
					height: xs ? (isMobile ? 520 : 540) : 520,
					maxHeight: xs ? (isMobile ? 520 : 540) : 520,
					width: "100%",
				}}
			>
				<Box display="flex" flexDirection="column" sx={{ height: xs ? 250 : 230 }}>
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
				</Box>
				<Box
					display="flex"
					flexDirection="column"
					sx={{
						height: xs && isMobile ? "265px" : "285px",
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
						<Box display="flex" flexDirection="row" alignItems="center" pt={1} pb={1}>
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
			</Box>
		</Card>
	);
};

export default LandingPageCarouselCard;
