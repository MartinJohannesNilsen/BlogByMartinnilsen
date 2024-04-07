import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import NextLink from "next/link";
import { useState } from "react";
import { IoCheckmark, IoCopyOutline } from "react-icons/io5";
import SyntaxHighlighter from "react-syntax-highlighter";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";

// Themes
import { enqueueSnackbar } from "notistack";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { copyToClipboardV2 } from "../../../utils/copyToClipboard";

export const EDITORTHEME = atomOneDark;
const CustomCodebox = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();
	const handleButtonClick = (copyText: string) => {
		copyToClipboardV2(copyText)
			.then(() => {
				setCopyMessageShown(true);
				setTimeout(() => {
					setCopyMessageShown(false);
				}, 4000);
			})
			.catch((error) => {
				enqueueSnackbar("Unable to copy to clipboard!", {
					variant: "error",
					preventDuplicate: true,
				});
			});
	};
	const [copyMessageShown, setCopyMessageShown] = useState(false);
	const [isCopyButtonVisible, setCopyButtonVisible] = useState(false);

	const handleMouseEnter = () => {
		setCopyButtonVisible(true);
	};

	const handleMouseLeave = () => {
		setCopyButtonVisible(false);
	};

	return (
		<Box
			sx={{
				position: "relative",
				borderRadius: "10px",
				// border: "2px solid" + theme.palette.secondary.main,
				"& .language-plaintext code": {
					userSelect: "none",
					margin: "-15px 10px -15px -15px",
					padding: "15px 0px 15px 15px",
					backgroundColor: "rgb(30, 30, 30)",
				},
			}}
			my={2}
		>
			{props.data.multiline ? (
				// Multiline codeblock
				<Box>
					{/* Header row */}
					<Box
						sx={{
							userSelect: "none",
							backgroundColor: "#363642",
							// backgroundColor: "#282a2e",
							borderRadius: "10px 10px 0px 0px",
							padding: "5px",
						}}
						display="flex"
						alignItems="center"
					>
						<Box ml={1.75}>
							<Typography
								fontFamily={theme.typography.fontFamily}
								variant="body2"
								color="white"
								py={1}
								sx={{ opacity: 0.6 }}
							>
								{props.data.filename && props.data.filename !== ""
									? props.data.filename
									: props.data.language && props.data.language !== ""
									? props.data.language
									: ""}
							</Typography>
						</Box>
						<Box flexGrow={100} />
						<Box mr={1}>
							<Button
								disableFocusRipple
								LinkComponent={NextLink}
								disabled={copyMessageShown}
								sx={{
									color: "white",
									"&:disabled": {
										color: "white",
									},
									"&:focus-visible": {
										backgroundColor: theme.palette.grey[700],
									},
								}}
								onClick={() => handleButtonClick(props.data.code!)}
								startIcon={
									copyMessageShown ? (
										<IoCheckmark size="16px" style={{ margin: "0 -2px 0 2px" }} />
									) : (
										<IoCopyOutline size="16px" style={{ margin: "0 -2px 0 2px" }} />
									)
								}
							>
								<Typography
									fontFamily={theme.typography.fontFamily}
									variant="body2"
									color="white"
									sx={{ opacity: 1, textTransform: "none" }}
								>
									{copyMessageShown ? "Copied!" : "Copy Code"}
								</Typography>
							</Button>
						</Box>
					</Box>
					{/* Editor */}
					<Box
						sx={{
							"& pre": {
								"&::-webkit-scrollbar": {
									height: "0px",
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
						<SyntaxHighlighter
							language={props.data.language && props.data.language !== "" ? props.data.language : "plaintext"}
							style={EDITORTHEME}
							showLineNumbers={props.data.linenumbers}
							lineNumberStyle={{ color: "#ffffff20", minWidth: "45px" }}
							wrapLongLines={props.data.textwrap}
							customStyle={{
								backgroundColor: "rgb(36, 39, 46)",
								margin: "0px",
								padding: "15px",
								borderRadius: "0 0 10px 10px",
							}}
							lineProps={(lineNumber) => ({
								style: {
									backgroundColor:
										props.data.highlightLines &&
										Array.isArray(props.data.highlightLines) &&
										props.data.highlightLines.includes(lineNumber)
											? "#ffffff15"
											: "transparent",
								},
							})}
						>
							{props.data.code}
						</SyntaxHighlighter>
					</Box>
				</Box>
			) : (
				// Singleline codeblock
				<Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} position="relative">
					{isCopyButtonVisible && (
						<Box
							sx={{
								position: "absolute",
								right: "0",
								top: "50%",
								transform: "translateY(-50%)",
								backgroundColor: "#25272D",
								width: "46px",
							}}
						>
							{copyMessageShown ? (
								<IconButton
									disabled={true}
									sx={{
										pr: 1,
										borderRadius: 2,
										"&:disabled": {
											color: "white",
											// backgroundColor: "black",
											backgroundColor: "#20222A",
										},
									}}
								>
									<IoCheckmark />
								</IconButton>
							) : (
								<Tooltip title="Copy code" enterDelay={2000}>
									<IconButton
										sx={{
											pr: 1,
											borderRadius: 2,
											color: "white",
											backgroundColor: theme.palette.grey[800], // Change the alpha value for opacity
											"&:hover": {
												color: "white",
												// backgroundColor: "black",
												backgroundColor: "#22242A",
											},
										}}
										onClick={() =>
											handleButtonClick(
												props.data.multiline ? props.data.code : props.data.code.replace(/(\r\n|\n|\r)/gm, "")
											)
										}
									>
										<IoCopyOutline />
									</IconButton>
								</Tooltip>
							)}
						</Box>
					)}
					<SyntaxHighlighter
						language={props.data.language && props.data.language !== "" ? props.data.language : "plaintext"}
						style={EDITORTHEME}
						customStyle={{
							height: "54px",
							overflowY: "hidden",
							backgroundColor: "rgb(36, 39, 46)",
							padding: "15px",
							borderRadius: "10px 10px",
						}}
					>
						{props.data.multiline ? props.data.code : props.data.code.replace(/(\r\n|\n|\r)/gm, "")}
					</SyntaxHighlighter>
				</Box>
			)}
		</Box>
	);
};
export default CustomCodebox;
