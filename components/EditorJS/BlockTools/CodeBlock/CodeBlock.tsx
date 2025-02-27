"use client";
import { allowedLanguages } from "@/components/EditorJS/BlockTools/CodeBlock/allowedLanguages";
import { InputElement, TextareaAutosizeElement } from "@/components/EditorJS/BlockTools/CodeBlock/styledMuiComponents";
import { EDITORTHEME } from "@/components/EditorJS/Renderers/CustomCode";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { BlockToolCodeBlockProps } from "@/types";
import { Autocomplete, Box, Checkbox, Input, TextField, Typography, useMediaQuery } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";

// Functions
const allowedLanguagesOptions = allowedLanguages.map((option) => {
	const firstLetter = option[0].toUpperCase();
	return {
		language: option,
		firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
	};
});

// Component
export const CodeBlock = (props: BlockToolCodeBlockProps) => {
	const { theme } = useTheme();
	const mdDown = useMediaQuery(theme.breakpoints.down("md"));
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const [stateData, setStateData] = useState(
		props.data || {
			code: "",
			language: "",
			multiline: true,
			linenumbers: false,
			textwrap: false,
			filename: "",
			caption: "",
			render: false,
			highlightLines: [],
		}
	);

	// Change Editorjs state on state change
	useEffect(() => {
		props.onDataChange(stateData);
	}, [stateData]);

	return (
        <Fragment>
            <Box sx={{ position: "relative", borderRadius: "50px" }} my={2}>
				<Box>
					{/* Header row */}
					<Box
						sx={{
							backgroundColor: "#363642",
							borderRadius: "10px 10px 0px 0px",
							padding: "5px",
						}}
						display="flex"
						alignItems="center"
					>
						{/* Filename */}
						<Box ml={1.75} mr={1.75}>
							<Typography
								fontFamily={theme.typography.fontFamily}
								variant="body2"
								color="white"
								py={1}
								sx={{ opacity: 0.6 }}
							>
								<Input
									// disabled={!stateData.multiline}
									value={stateData.filename}
									onChange={(e) => setStateData({ ...stateData, filename: e.target.value })}
									size="small"
									sx={{
										width: mdDown ? "100%" : 220,
										height: "40px",
										"&:hover:before": {
											borderBottomColor: "white !important", // Underline color on hover (including when clicked)
										},
										":before": { borderBottomColor: "white" },
										// underline when selected
										":after": { borderBottomColor: "white" },
										"& input": {
											color: "white", // Color for the text
										},
										"& input::placeholder": {
											color: "#abb2bf", // Color for the placeholder text
										},
									}}
									placeholder="Filename"
								/>
							</Typography>
						</Box>
						<Box flexGrow={100} />
						{/* Multiline */}
						<Box textAlign="center">
							<Typography fontSize={10} color="#abb2bf" fontFamily={theme.typography.fontFamily}>
								Rows
							</Typography>
							<Checkbox
								checked={stateData.multiline}
								sx={{
									color: "#abb2bf",
									"&.Mui-checked": {
										color: "white",
									},
								}}
								onChange={(e) =>
									setStateData({
										...stateData,
										multiline: e.target.checked,
										textwrap: e.target.checked ? stateData.textwrap : false,
										linenumbers: e.target.checked ? stateData.linenumbers : false,
									})
								}
							/>
						</Box>
						{/* LineNumbers */}
						<Box textAlign="center">
							<Typography fontSize={10} color="#abb2bf" fontFamily={theme.typography.fontFamily}>
								Num
							</Typography>
							<Checkbox
								disabled={!stateData.multiline}
								checked={stateData.linenumbers}
								sx={{
									color: "#abb2bf",
									"&.Mui-checked": {
										color: "white",
									},
								}}
								onChange={(e) => setStateData({ ...stateData, linenumbers: e.target.checked })}
							/>
						</Box>
						{/* Textwrap */}
						<Box textAlign="center">
							<Typography fontSize={10} color="#abb2bf" fontFamily={theme.typography.fontFamily}>
								Wrap
							</Typography>
							<Checkbox
								sx={{
									color: "#abb2bf",
									"&.Mui-checked": {
										color: "white",
									},
								}}
								disabled={!stateData.multiline}
								checked={stateData.textwrap}
								onChange={(e) => setStateData({ ...stateData, textwrap: e.target.checked })}
							/>
						</Box>
						{/* Language */}
						<Box px={1}>
							<Autocomplete
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === "ArrowUp" || e.key === "ArrowDown") {
										e.preventDefault();
										// Optionally, you can stop the event propagation as well
										e.stopPropagation();
									}
								}}
								isOptionEqualToValue={(option: { language: string; firstLetter: string }, value) =>
									option.language === value.language
								}
								options={allowedLanguagesOptions.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
								groupBy={(option) => option.firstLetter}
								getOptionLabel={(option) => option.language}
								sx={{
									width: mdDown ? (xs ? "100%" : 150) : 200,
									".MuiOutlinedInput-notchedOutline": {
										borderColor: "#abb2bf",
									},
									".MuiOutlinedInput-root": {
										"&:hover fieldset": {
											borderColor: "white",
										},
										"&.Mui-focused fieldset": {
											borderColor: "white",
										},
									},
									".MuiInputLabel-root": {
										color: "#abb2bf",
									},
									"&:focus-within .MuiInputLabel-root": {
										color: "white", // Color when focused
									},
									".MuiInputBase-input": {
										color: "#abb2bf",
									},
									".MuiAutocomplete-clearIndicator, .MuiAutocomplete-popupIndicator": {
										color: "#abb2bf",
										"&:hover": {
											color: "white",
										},
									},
								}}
								size="small"
								renderInput={(params) => (
									<TextField {...params} label="Language" variant="outlined" slotProps={{
                                        inputLabel: undefined
                                    }} />
								)}
								value={{
									language: stateData.language,
									firstLetter:
										stateData.language && stateData.language.length > 0 ? stateData.language[0].toUpperCase() : "0",
								}}
								onChange={(_, newValue) => {
									setStateData({
										...stateData,
										language: newValue ? newValue.language : "",
									});
								}}
							/>
						</Box>
						{/* Render */}
						<Box textAlign="center">
							<Typography fontSize={10} color="#abb2bf" fontFamily={theme.typography.fontFamily}>
								Render
							</Typography>
							<Checkbox
								checked={stateData.render}
								sx={{
									color: "#abb2bf",
									"&.Mui-checked": {
										color: "white",
									},
								}}
								onChange={(e) => setStateData({ ...stateData, render: e.target.checked })}
							/>
						</Box>
					</Box>
					{/* Editor */}
					<Box
						sx={{
							"& pre": {
								// margin: 0,
								// padding: "0px",
								// backgroundColor: "#f7f7f7",
								// Add scrollbar styles
								// marginY: "10px",
								"&::-webkit-scrollbar": {
									height: "0px",
									// width: "20px !important",
								},
								"&::-webkit-scrollbar-thumb": {
									backgroundColor: "#888",
									borderRadius: "6px",
								},
								"&::-webkit-scrollbar-thumb:hover": {
									backgroundColor: "#555",
								},
								"&::-webkit-scrollbar-track": {
									marginY: "10px",
								},
							},
						}}
					>
						{stateData.render ? (
							<SyntaxHighlighter
								language={stateData.language && stateData.language !== "" ? stateData.language : "plaintext"}
								showLineNumbers={stateData.linenumbers}
								lineNumberStyle={{ color: "#ffffff20", minWidth: "45px" }}
								style={EDITORTHEME}
								wrapLongLines={stateData.textwrap}
								customStyle={{
									height: !stateData.multiline ? "54px" : "default",
									overflowY: "hidden",
									backgroundColor: "rgb(36, 39, 46)",
									margin: "0px",
									marginBottom: 0,
									padding: "15px",
									borderRadius: "0 0 10px 10px",
								}}
								lineProps={(lineNumber) => ({
									style: stateData.highlightLines.includes(lineNumber)
										? {
												backgroundColor: "#ffffff15",
												margin: "0 -15px",
												padding: "0 13px",
												borderLeft: "2px solid grey",
										  }
										: { backgroundColor: "transparent" },
									onClick() {
										if (
											stateData.highlightLines &&
											Array.isArray(stateData.highlightLines) &&
											stateData.highlightLines.includes(lineNumber)
										) {
											setStateData({
												...stateData,
												highlightLines: stateData.highlightLines.filter((line) => line !== lineNumber),
											});
										} else {
											setStateData({
												...stateData,
												highlightLines: [...stateData.highlightLines, lineNumber],
											});
										}
									},
								})}
							>
								{stateData.multiline ? stateData.code : stateData.code.replace(/(\r\n|\n|\r)/gm, "")}
							</SyntaxHighlighter>
						) : stateData.multiline ? (
							<TextareaAutosizeElement
								onKeyDown={(event) => {
									if (event.key === "Enter" && !event.shiftKey) {
										event.preventDefault();
										event.stopPropagation();
									}
								}}
								sx={{
									color: "#abb2bf",
									background: "#282c34",
									resize: "none",
									padding: "15px",
									marginBottom: -0.8,
									overflowX: "scroll",
									whiteSpace: stateData.textwrap ? "break-spaces" : "pre",
								}}
								onChange={(e) => {
									setStateData({ ...stateData, code: e.target.value });
								}}
								value={stateData.code}
							/>
						) : (
							<InputElement
								onChange={(e) => {
									setStateData({ ...stateData, code: e.target.value });
								}}
								onKeyDown={(event) => {
									if (event.key === "Enter" && event.shiftKey) {
										event.preventDefault();
										event.stopPropagation();
									}
								}}
								value={stateData.code}
								sx={{
									// marginBottom: 3,
									color: "#abb2bf",
									background: "#282c34",
									padding: "15px",
								}}
							/>
						)}
					</Box>
				</Box>
			</Box>
        </Fragment>
    );
};
export default CodeBlock;
