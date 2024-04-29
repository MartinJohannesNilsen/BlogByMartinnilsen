"use client";
import { Box, styled, Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";
import colorLuminance from "../../../utils/colorLuminance";

const CustomParagraph = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();

	// Styles
	const Code = styled("code")({
		// color: "#d9363e", // red
		// color: "#abb2bf", // grey
		color: theme.palette.mode === "dark" ? "#abb2bf" : "black",
		backgroundColor:
			// "#25272D",
			theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200],
		margin: "0 1px",
		padding: "2px 5px",
		borderRadius: "4px",
		// borderRadius: "2px",
		// fontFamily: theme.typography.fontFamily,
	});
	const Mark = styled("code")({
		margin: "0 1px",
		padding: "1px 2px",
		borderRadius: "1px",
		backgroundColor: theme.palette.secondary.main,
	});
	const Underline = styled("u")({
		color: theme.palette.text.primary,
		textDecoration: "none",
		borderBottom: "2px solid " + theme.palette.text.primary,
	});
	const linkStyle = {
		color: theme.palette.text.primary,
		textDecoration: "none",
		borderBottom: "2px solid " + colorLuminance(theme.palette.secondary.main, 0.15),
		"&:hover": {
			borderBottom: "2px solid " + theme.palette.secondary.main,
		},
	};

	return (
		<Box sx={{ userSelect: "text", my: 1, ...props.style?.box }}>
			{props.data.text === "" ? (
				<br />
			) : (
				<Typography
					sx={{ ...props.style?.typography }}
					variant="body1"
					color="textPrimary"
					fontFamily={theme.typography.fontFamily}
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(
							props.data
								.text! // .replace(/<code .*?>/gm, code)
								// .replace(/<mark .*?>/gm, mark)
								// // .replace(/<u .*?>/gm, underline)
								// .replace(/<a href=/gm, link)
								.replace(/<code .*?>/gm, "<Code>")
								.replace(/<\/code>/gm, "</Code>")
								.replace(/<mark .*?>/gm, "<Mark>")
								.replace(/<\/mark>/gm, "</Mark>")
								.replace(/<a href=/gm, `<a style="${linkStyle} href=`)
						),
					}}
				/>
			)}
		</Box>
	);
};
export default CustomParagraph;
