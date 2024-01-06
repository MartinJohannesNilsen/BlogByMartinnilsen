import { AccessTime, CalendarMonth, Visibility } from "@mui/icons-material";
import { Box, Button, Card, CardActionArea, Link, Typography, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import { FC, useState } from "react";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { PostCardProps } from "../../types";
import { DEFAULT_OGIMAGE } from "../SEO/SEO";
import PostViews from "../PostViews/PostViews";

export const TagsPageCard: FC<PostCardProps> = (props) => {
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
		<Card className={classes.root} sx={{ width: "100%", boxShadow: "none" }}>
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
						<Image
							src={props.image || DEFAULT_OGIMAGE}
							alt={'OpenGraph image for article titled "' + props.title + '"'}
							width={xs ? 70 : 125}
							height={xs ? 70 : 82}
							style={{ borderRadius: 2, objectFit: "cover" }}
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

							{/* Not published icon */}
							{!props.published && (
								<>
									<Box flexGrow={100} />
									<Link href={`/create/${props.id}`} sx={{}}>
										<Typography sx={{ fontSize: "13px" }}>🖊</Typography>
									</Link>
								</>
							)}
						</Box>
					</Box>
				</Box>
			</CardActionArea>
		</Card>
	);
};

export default TagsPageCard;
