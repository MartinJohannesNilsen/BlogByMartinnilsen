"use client";
import { Box, Card, IconButton, Typography, useMediaQuery } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";
import CustomParagraph from "./CustomParagraph";

const CustomCallout = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));

	return (
		<Box my={1} maxWidth={"100vw"}>
			{props.data.type === "message" ? (
				<Card
					elevation={0}
					sx={{
						display: "flex",
						alignItems: "center",
						padding: 1,
						// boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
						backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
						border: "2px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200]),
						maxWidth: "100vw",
					}}
				>
					<IconButton disabled disableRipple sx={{ margin: xs ? "0 7.5px 0 -5px" : "0 5px 0 0px" }}>
						<Typography fontSize={16}>{props.data.icon || "💬"}</Typography>
					</IconButton>
					<Box display="flex" flexDirection="column" maxWidth="100vw">
						{/* Title */}
						{props.data.title && (
							<Typography
								sx={{
									...theme.typography.subtitle1,
									fontWeight: 800,
									fontFamily: theme.typography.fontFamily,
									// pt: "4px",
									mb: -0.5,
									// pb: -2,
									overflow: "hidden",
									textOverflow: "ellipsis",
									display: "webkit-flex",
									WebkitLineClamp: 1,
									lineClamp: 1,
									WebkitBoxOrient: "vertical",
								}}
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(props.data.title),
								}}
							/>
						)}
						{/* Message */}
						<CustomParagraph
							// data={{ text: props.data.message.replace(/\n/g, "<br>") }}
							data={{ text: props.data.message }}
							style={{
								box: { my: 0 },
								typography: {
									...theme.typography.subtitle2,
									pt: 0,
									pb: props.data.title && 0.6,
									overflow: "hidden",
									textOverflow: "ellipsis",
									display: "webkit-flex",
									WebkitBoxOrient: "vertical",
								},
							}}
						/>
					</Box>
				</Card>
			) : props.data.type === "note" ? (
				<Card
					sx={{
						display: "flex",
						alignItems: "center",
						maxWidth: "100vw",
						backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300],
						boxShadow: "none",
					}}
				>
					<Box display="flex" flexDirection="row">
						<Box
							sx={{
								backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[400],
							}}
							p={0.5}
						/>
						<Box display="flex" flexDirection="column" maxWidth="100vw" p={2}>
							{/* Title */}
							<Typography
								sx={{
									...theme.typography.subtitle1,
									fontWeight: 800,
									fontFamily: theme.typography.fontFamily,
									// color: "black",
									// pt: 0.5,
									// pb: 0.6,
									my: 0,
									overflow: "hidden",
									textOverflow: "ellipsis",
									display: "webkit-flex",
									WebkitLineClamp: 1,
									lineClamp: 1,
									WebkitBoxOrient: "vertical",
								}}
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(props.data.title || "Note"),
								}}
							/>
							{/* Message */}
							<CustomParagraph
								// data={{ text: props.data.message.replace(/\n/g, "<br>") }}
								data={{ text: props.data.message }}
								style={{
									box: { my: 0 },
									typography: {
										...theme.typography.subtitle2,
										pt: 0,
										// pb: 1,
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "webkit-flex",
										WebkitBoxOrient: "vertical",
									},
								}}
							/>
						</Box>
					</Box>
				</Card>
			) : null}
		</Box>
	);
};
export default CustomCallout;
