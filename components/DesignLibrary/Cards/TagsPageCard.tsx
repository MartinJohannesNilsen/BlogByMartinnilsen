"use client";
import { AccessTime, CalendarMonth, Edit, Visibility } from "@mui/icons-material";
import { Box, Card, CardActionArea, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { PostCardProps } from "../../../types";
import { NavbarButton } from "../Buttons/NavbarButton";
import BlurHashHTMLImage from "../Image/BlurHashHTMLImage";
import PostViews from "../../PostViews/PostViews";
import { DATA_DEFAULTS } from "../../../data/metadata";

export const TagsPageCard = (props: PostCardProps) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));

	return (
		<Card
			sx={{
				width: "100%",
				boxShadow: "none",
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
				<Box display="flex" flexDirection="column" sx={{ height: "100%" }}>
					{/* Image, title and summary */}
					<Box display="flex" flexDirection="row">
						{/* Title and summary */}
						<Box pr="15px" display="flex" flexDirection="column" sx={{ maxWidth: "650px" }}>
							<Typography
								variant={"h6"}
								fontSize={xs ? "16px" : ""}
								fontWeight={700}
								color="textPrimary"
								fontFamily={theme.typography.fontFamily}
								sx={{
									overflow: "hidden",
									textOverflow: "ellipsis",
									display: "webkit-flex",
									WebkitLineClamp: 1,
									lineClamp: 1,
									WebkitBoxOrient: "vertical",
								}}
							>
								{props.title}
							</Typography>
							<Typography
								mt={1}
								mb={0.1}
								variant="body2"
								fontSize={xs ? "14px" : ""}
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
						<Box flexGrow={1} />
						<BlurHashHTMLImage
							src={props.ogImage.src || DATA_DEFAULTS.images.openGraph}
							blurhash={{ encoded: props.ogImage.blurhash! }}
							alt={'OpenGraph image for article titled "' + props.title + '"'}
							style={{ borderRadius: 2, objectFit: "cover", width: xs ? 70 : 125, height: xs ? 70 : 82 }}
						/>
					</Box>
					{/* Information gutter */}
					<Box pt="10px">
						<Box display="flex" flexDirection="row" alignItems="center">
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
							{/* View counts */}
							{props.published && (
								<>
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
											postId={props.id}
											sx={{
												fontSize: theme.typography.fontSize,
												color: theme.palette.text.primary,
												fontFamily: theme.typography.fontFamily,
											}}
										/>
									</Typography>
								</>
							)}
						</Box>
					</Box>
				</Box>
			</CardActionArea>
			{/* Not published icon */}
			{!props.published && (
				<>
					<Box flexGrow={100} />
					<NavbarButton
						variant="outline"
						href={`/create/${props.id}`}
						// onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/create/${props.id}`)}
						icon={Edit}
						tooltip="Edit post"
						sxButton={{
							minWidth: "30px",
							minHeight: "30px",
							height: "30px",
							width: "30px",
							position: "absolute",
							right: 20,
							bottom: 12,
						}}
						sxIcon={{
							height: "16px",
							width: "16px",
							color: "inherit",
						}}
					/>
				</>
			)}
		</Card>
	);
};

export default TagsPageCard;
