"use client";
import { getFontFamilyFromVariable } from "@/styles/themes/themeDefaults";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import NextLink from "next/link";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { IoCheckmark, IoCopyOutline } from "react-icons/io5";
import SyntaxHighlighter from "react-syntax-highlighter";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";
import { copyToClipboardV2 } from "../../../utils/copyToClipboard";

// Themes
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

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
	const [copyEventListenerActive, setCopyEventListenerActive] = useState(false);

	useEffect(() => {
		const textToBeCopied = props.data.multiline ? props.data.code! : props.data.code!.replace(/(\r\n|\n|\r)/gm, "");
		const handleCopy = (event) => {
			event.preventDefault();
			handleButtonClick(textToBeCopied);
		};
		if (copyEventListenerActive) {
			document.addEventListener("copy", handleCopy);
		} else {
			document.removeEventListener("copy", handleCopy);
		}

		return () => {
			document.removeEventListener("copy", handleCopy);
		};
	}, [copyEventListenerActive]);

	return (
		<Box
			onMouseEnter={() => {
				setCopyEventListenerActive(true);
			}}
			onMouseLeave={() => {
				setCopyEventListenerActive(false);
			}}
			sx={{
				position: "relative",
				borderRadius: "10px",
				"& .language-plaintext code": {
					userSelect: "none",
					margin: "-15px 10px -15px -15px",
					padding: "15px 0px 15px 15px",
					backgroundColor: "rgb(30, 30, 30)",
				},
				transition: "border .15s ease",
				"&:hover": {
					border: "2px solid" + theme.palette.secondary.main,
				},
				border: "2px solid transparent",
			}}
			my={2}
			mx="-2px"
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
							borderRadius: "8px 8px 0px 0px",
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
							lineNumberStyle={{ color: "#ffffff20" }}
							wrapLongLines={props.data.textwrap}
							customStyle={{
								backgroundColor: "rgb(36, 39, 46)",
								margin: "0px",
								padding: "15px",
								borderRadius: "0 0 8px 8px",
								fontSize: "calc(1rem * var(--font-scale))",
							}}
							codeTagProps={{
								style: {
									fontFamily: getFontFamilyFromVariable("--font-fira-code"),
								},
							}}
							lineProps={(lineNumber) => ({
								style:
									props.data.highlightLines &&
									Array.isArray(props.data.highlightLines) &&
									props.data.highlightLines.includes(lineNumber)
										? {
												backgroundColor: "#ffffff15",
												margin: "0 -15px",
												padding: "0 13px",
												borderLeft: "2px solid grey",
										  }
										: { backgroundColor: "transparent" },
							})}
						>
							{props.data.code!}
						</SyntaxHighlighter>
					</Box>
				</Box>
			) : (
				// Singleline codeblock
				<Box
					onMouseEnter={() => {
						setCopyButtonVisible(true);
					}}
					onMouseLeave={() => {
						setCopyButtonVisible(false);
					}}
					position="relative"
				>
					{isCopyButtonVisible && (
						<Box
							sx={{
								position: "absolute",
								right: "0",
								top: "50%",
								transform: "translateY(-50%)",
								backgroundColor: "#25272D",
								width: "46px",
								borderRadius: "2px 2px 2px 2px",
							}}
						>
							{copyMessageShown ? (
								<IconButton
									disabled={true}
									sx={{
										borderRadius: "3px 3px 3px 3px",
										"&:disabled": {
											color: "white",
											backgroundColor: "#22242A",
										},
										height: "calc(1.4rem * var(--font-scale))",
									}}
								>
									<IoCheckmark style={{ height: "calc(1.4rem * var(--font-scale))" }} />
								</IconButton>
							) : (
								<Tooltip title="Copy code" enterDelay={2000}>
									<IconButton
										sx={{
											borderRadius: "3px 3px 3px 3px",
											color: "white",
											backgroundColor: theme.palette.grey[800], // Change the alpha value for opacity
											"&:hover": {
												color: "white",
												// backgroundColor: "black",
												backgroundColor: "#22242A",
											},
											height: "calc(1.4rem * var(--font-scale))",
										}}
										onClick={() =>
											handleButtonClick(
												props.data.multiline ? props.data.code! : props.data.code!.replace(/(\r\n|\n|\r)/gm, "")
											)
										}
									>
										<IoCopyOutline style={{ height: "calc(1.4rem * var(--font-scale))" }} />
									</IconButton>
								</Tooltip>
							)}
						</Box>
					)}
					<SyntaxHighlighter
						language={props.data.language && props.data.language !== "" ? props.data.language : "plaintext"}
						style={EDITORTHEME}
						customStyle={{
							margin: 0,
							display: "flex",
							alignItems: "center",
							height: "calc(45px * var(--font-scale))",
							overflowY: "hidden",
							backgroundColor: "rgb(36, 39, 46)",
							padding: "10px 15px",
							// borderRadius: "calc(10px * var(--font-scale))",
							// fontSize: "calc(1rem * var(--font-scale))",
							borderRadius: "8px",
						}}
						codeTagProps={{
							id: "code-text",
							style: {
								fontFamily: getFontFamilyFromVariable("--font-fira-code"),
							},
						}}
					>
						{props.data.multiline ? props.data.code! : props.data.code!.replace(/(\r\n|\n|\r)/gm, "")}
					</SyntaxHighlighter>
				</Box>
			)}
		</Box>
	);
};
export default CustomCodebox;
