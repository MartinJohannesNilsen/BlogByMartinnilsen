"use client";
import { NavbarButton } from "@/components/DesignLibrary/Buttons/NavbarButton";
import CustomParagraph from "@/components/EditorJS/Renderers/CustomParagraph";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "@/types";
import { handleSharing } from "@/utils/handleSharing";
import { IosShare } from "@mui/icons-material";
import { Box, Card, IconButton, Typography, useMediaQuery } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { useState } from "react";
import { BiSolidQuoteRight } from "react-icons/bi";
const { convert } = require("html-to-text");

const CustomCallout = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();
	const mdDown = useMediaQuery(theme.breakpoints.down("md"));
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const [hover, setHover] = useState(false);

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
						{/* Label */}
						{props.data.label && (
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
									__html: DOMPurify.sanitize(props.data.label),
								}}
							/>
						)}
						{/* Content */}
						<CustomParagraph
							// data={{ text: props.data.content.replace(/\n/g, "<br>") }}
							data={{ text: props.data.content }}
							style={{
								box: { my: 0 },
								typography: {
									...theme.typography.subtitle2,
									fontFamily: theme.typography.fontFamily,
									pt: 0,
									pb: props.data.content && 0.6,
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
							{/* Label */}
							<Typography
								sx={{
									...theme.typography.subtitle1,
									fontWeight: 800,
									fontFamily: theme.typography.fontFamily,
									my: 0,
									overflow: "hidden",
									textOverflow: "ellipsis",
									display: "webkit-flex",
									WebkitLineClamp: 1,
									lineClamp: 1,
									WebkitBoxOrient: "vertical",
								}}
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(props.data.label || "Note"),
								}}
							/>
							{/* Content */}
							<CustomParagraph
								// data={{ text: props.data.content.replace(/\n/g, "<br>") }}
								data={{ text: props.data.content }}
								style={{
									box: { my: 0 },
									typography: {
										...theme.typography.subtitle2,
										fontFamily: theme.typography.fontFamily,
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
			) : props.data.type === "quote" ? (
				<Box
					display="flex"
					my={1}
					flexDirection="row"
					onMouseEnter={() => {
						setHover(true);
					}}
					onMouseLeave={() => {
						setHover(false);
					}}
					sx={{ position: "relative" }}
				>
					{/* Icon */}
					<Box ml={xs ? 2 : 4} mt={0.1}>
						<BiSolidQuoteRight style={{ color: "black", opacity: 0.4 }} />
					</Box>

					{/* Content */}
					<Box
						display="flex"
						flexDirection="column"
						maxWidth="100vw"
						ml={1.5}
						sx={{
							width: mdDown ? "85vw" : "100vw",
							maxWidth: "625px",
						}}
					>
						{/* Content */}
						<CustomParagraph
							// data={{ text: props.data.content.replace(/\n/g, "<br>") }}
							data={{ text: props.data.content }}
							style={{
								box: { my: 0 },
								typography: {
									...theme.typography.body1,
									fontFamily: theme.typography.fontFamily,
									fontWeight: 600,
									outline: "none",
									paddingBottom: theme.spacing(2),
									marginBottom: -0.8,
								},
							}}
						/>

						{/* Label */}
						<CustomParagraph
							data={{ text: props.data.label }}
							style={{
								box: { my: 0 },
								typography: {
									...theme.typography.body2,
									fontWeight: 600,
									fontFamily: theme.typography.fontFamily,
									outline: "none",
									marginBottom: -0.6,
									opacity: 0.4,
								},
							}}
						/>

						{hover && (
							<NavbarButton
								variant="outline"
								onClick={() => {
									handleSharing({
										text:
											'"' +
											convert(props.data.content).trimEnd() +
											'"' +
											(props.data.label && " ~ " + convert(props.data.label).trimEnd()) +
											"\n\nA quote from the post available at " +
											window.location.href,
									});
								}}
								icon={IosShare}
								tooltip="Share quote"
								sxButton={{
									position: "absolute",
									right: xs ? 12 : 20,
									bottom: 2,
									minWidth: "30px",
									minHeight: "30px",
									height: "30px",
									width: "30px",
								}}
								sxIcon={{
									height: "16px",
									width: "18px",
									color: "inherit",
								}}
							/>
						)}
					</Box>
				</Box>
			) : null}
		</Box>
	);
};
export default CustomCallout;
