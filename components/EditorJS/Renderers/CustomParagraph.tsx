"use client";
import colors from "@/styles/colors";
import { getFontFamilyFromVariable } from "@/styles/themes/themeDefaults";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "@/types";
import colorLuminance from "@/utils/colorLuminance";
import { getBackgroundColorLightOrDark } from "@/utils/getBackgroundColorLightOrDark";
import { Box, Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";

const CustomParagraph = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();

	// Styled components
	const codeStyle = `
        color: ${theme.palette.mode === "dark" ? "#abb2bf" : "black"};
        background-color: ${theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200]};
        margin: 0 1px;
        padding: 2px 5px;
        border-radius: 4px;
		font-family: ${getFontFamilyFromVariable("--font-fira-code")};
		font-size: ${theme.typography.body2.fontSize}
    `;
	const markStyle = `
        margin: 0 1px;
        padding: 1px 2px;
        border-radius: 1px;
        background-color: ${theme.palette.secondary.main};
		color: ${getBackgroundColorLightOrDark(theme.palette.secondary.main) === "dark" ? colors.white : colors.black};
    `;
	// TODO Rethink and implement solution for hover effects. Might need to include a css class here?
	const linkStyle = `
        color: ${theme.palette.text.primary};
        text-decoration: none;
        border-bottom: 2px solid ${colorLuminance(theme.palette.secondary.main, 0.15)};
    `;
	const underlineStyle = `
        color: ${theme.palette.text.primary};
        text-decoration: none;
        border-bottom: 2px solid ${theme.palette.text.primary};
    `;
	const code = `<code style="${codeStyle}">`;
	const mark = `<mark style="${markStyle}">`;
	const link = `<a style="${linkStyle}" href=`;
	const underline = `<u style="${underlineStyle}">`;

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
								.text!.replace(/<code .*?>/gm, code)
								.replace(/<mark .*?>/gm, mark)
								// // .replace(/<u .*?>/gm, underline)
								.replace(/<a href=/gm, link)
						),
					}}
				/>
			)}
		</Box>
	);
};
export default CustomParagraph;
