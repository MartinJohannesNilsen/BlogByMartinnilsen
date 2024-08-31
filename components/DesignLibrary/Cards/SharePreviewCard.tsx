"use client";
import BlurHashHTMLImage from "@/components/DesignLibrary/Image/BlurHashHTMLImage";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { SharePreviewCardProps } from "@/types";
import { Box, Card, Typography, useMediaQuery } from "@mui/material";

export const SharePreviewCard = (props: SharePreviewCardProps) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));

	return (
		<Card
			sx={{
				boxShadow: 0,
				height: `${props.height}px`,
				width: `${props.width}px`,
				padding: 0,
				backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[200],
				border: theme.palette.mode === "dark" ? "none" : "1px solid" + theme.palette.grey[300],
			}}
		>
			<Box display="flex" width="100%" height="100%">
				<BlurHashHTMLImage
					src={props.ogImage.src}
					blurhash={{ encoded: props.ogImage.blurhash! }}
					alt={`Image for the post titled "${props.title}"`}
					style={{
						width: props.height,
						height: props.height,
						objectFit: "cover",
						borderRadius: 0,
						maxHeight: xs ? 250 : 230,
					}}
				/>

				{/* Title and summary */}
				<Box
					display="flex"
					flexDirection="column"
					height={"100%"}
					justifyItems={"center"}
					justifyContent={"center"}
					sx={{ padding: "5px 10px" }}
				>
					<Typography
						variant="body2"
						fontWeight={500}
						color="textPrimary"
						fontSize={14}
						fontFamily={theme.typography.fontFamily}
						sx={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "webkit-flex",
							WebkitLineClamp: 1,
							lineClamp: 1,
							WebkitBoxOrient: "vertical",
							opacity: 0.6,
						}}
					>
						{props.url}
					</Typography>
					<Typography
						variant={"body1"}
						fontWeight={700}
						fontSize={16}
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
						variant="body2"
						fontWeight={500}
						fontSize={14}
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
						{props.description}
					</Typography>
				</Box>
			</Box>
		</Card>
	);
};

export default SharePreviewCard;
