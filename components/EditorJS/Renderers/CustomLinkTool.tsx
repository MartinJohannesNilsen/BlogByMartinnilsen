"use client";
import { defaultTheme } from "@/styles/themes/themeDefaults";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "@/types";
import { Box, Card, CardActionArea, Typography, useMediaQuery } from "@mui/material";

const CustomLinkTool = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const mdDown = useMediaQuery(theme.breakpoints.down("md"));

	return (
		<Box my={1} display="flex" width="100%" flexDirection="column" textAlign="center">
			<Card
				elevation={0}
				sx={{
					display: "flex",
					minHeight: props.data.link! ? "100px" : "80px",
					maxHeight: props.data.link! ? "150px" : "120px",
					backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
				}}
			>
				<CardActionArea
					href={props.data.link!}
					sx={{
						position: "relative",
						width: "100%",
						backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[0],
					}}
				>
					<Box display="flex" alignItems="center" height="100%">
						{/* Text */}
						<Box
							display="flex"
							flexDirection="column"
							sx={{
								width: "100%",
								// border: "2px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200]),
								textAlign: "left",
							}}
							px={2}
							py={1}
						>
							<Typography
								variant="subtitle1"
								fontFamily={theme.typography.fontFamily}
								sx={{
									...theme.typography.subtitle1,
									fontSize: defaultTheme.typography.subtitle1.fontSize,
									fontWeight: 800,
									overflow: "hidden",
									textOverflow: "ellipsis",
									display: "webkit-flex",
									WebkitLineClamp: 1,
									lineClamp: 1,
									WebkitBoxOrient: "vertical",
								}}
							>
								{props.data.meta?.title}
							</Typography>
							<Typography
								variant="subtitle2"
								fontWeight={400}
								fontFamily={theme.typography.fontFamily}
								sx={{
									...theme.typography.subtitle2,
									fontSize: defaultTheme.typography.subtitle2.fontSize,
									overflow: "hidden",
									textOverflow: "ellipsis",
									display: "webkit-flex",
									WebkitLineClamp: 3,
									lineClamp: 3,
									WebkitBoxOrient: "vertical",
								}}
							>
								{props.data.meta?.description}
							</Typography>
							{props.data.link ? (
								<Typography
									mt={0.5}
									variant="subtitle2"
									fontWeight={600}
									fontFamily={theme.typography.fontFamily}
									sx={{
										fontSize: defaultTheme.typography.subtitle2.fontSize,
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "webkit-flex",
										WebkitLineClamp: 1,
										lineClamp: 1,
										WebkitBoxOrient: "vertical",
										color: theme.palette.secondary.main,
									}}
								>
									{new URL(props.data.link).hostname}
								</Typography>
							) : (
								<></>
							)}
						</Box>
						<Box flexGrow={1} />
						{/* Image */}
						<img
							style={{
								minHeight: props.data.meta?.image ? "100px" : "80px",
								maxHeight: props.data.meta?.image ? "135px" : "120px",
								height: "100%",
								width: xs ? 150 : mdDown ? 175 : 200,
								objectFit: "cover",
							}}
							src={props.data.meta?.image}
						/>
					</Box>
				</CardActionArea>
			</Card>
		</Box>
	);
};
export default CustomLinkTool;
