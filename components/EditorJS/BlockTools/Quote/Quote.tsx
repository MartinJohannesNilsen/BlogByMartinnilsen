import React, { useRef } from "react";
import { Box, Card, IconButton, InputBase, MenuItem, Modal, Select, Typography, useMediaQuery } from "@mui/material";
import EmojiPicker, { EmojiClickData, SkinTonePickerLocation } from "emoji-picker-react";
import { Fragment, useEffect, useState } from "react";
import { useTheme } from "../../../../styles/themes/ThemeProvider";
import { BiSolidQuoteRight } from "react-icons/bi";

// Types
type QuoteDataProps = {
	text: string;
	caption: string;
};
type QuoteProps = {
	data: QuoteDataProps;
	onDataChange: (arg0: any) => void;
	readOnly: boolean;
};

// Component
export const Quote = (props: QuoteProps) => {
	const { theme } = useTheme();
	const mdDown = useMediaQuery(theme.breakpoints.down("md"));
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const [stateData, setStateData] = useState(
		props.data || {
			text: "",
			caption: "",
		}
	);
	const quoteTextRef = useRef(null);
	const quoteCaptionRef = useRef(null);

	// Function to check and apply the placeholder style
	const checkAndApplyPlaceholder = () => {
		const currentDiv = quoteTextRef.current;
		if (currentDiv) {
			if (!currentDiv.textContent.trim()) {
				currentDiv.classList.add("contentEditablePlaceholder");
			} else {
				currentDiv.classList.remove("contentEditablePlaceholder");
			}
		}
	};

	// Initial check for the placeholder when the component mounts
	useEffect(() => {
		if (props.data.text && props.data.text.trim() !== "") {
			quoteTextRef.current.innerHTML = props.data.text;
		} else {
			checkAndApplyPlaceholder();
		}
	}, []);

	// Change Editorjs state on state change
	useEffect(() => {
		props.onDataChange(stateData);
	}, [stateData]);

	return (
		<Fragment>
			{/* Component */}
			<Box display="flex" flexDirection="column" my={1} maxWidth={"100vw"}>
				<Box display="flex">
					<Box ml={xs ? 2 : 4} mt={0.1}>
						<BiSolidQuoteRight style={{ color: "black", opacity: 0.4 }} />
					</Box>
					<Box textAlign="left" ml={1} mr={xs ? 1 : 2.5} sx={{}}>
						<div
							contentEditable
							data-placeholder="Insert quote ..."
							// data-placeholder=""
							onKeyDown={(event) => {
								if (event.key === "Enter" && !event.shiftKey) {
									event.preventDefault();
									event.stopPropagation();
								}
							}}
							// placeholder="Insert message here ..."
							ref={quoteTextRef}
							style={{
								...theme.typography.body1,
								fontFamily: theme.typography.fontFamily,
								fontWeight: 600,
								outline: "none",
								paddingBottom: 6,
								marginBottom: -0.8,
							}}
							// onFocus={() => {
							// 	if (!stateData.text || stateData.text.trim() === "") {
							// 		quoteTextRef.current.innerHTML = "";
							// 	}
							// }}
							onInputCapture={(e) => {
								const currentDiv = quoteTextRef.current;
								if (currentDiv) {
									currentDiv.style.height = "auto";
									currentDiv.style.height = `${currentDiv.scrollHeight}px`;
									checkAndApplyPlaceholder();
								}
								setStateData({
									...stateData,
									text: e.currentTarget.innerHTML,
								});
							}}
							onBlur={checkAndApplyPlaceholder} // Check placeholder when the element loses focus
						/>
					</Box>
				</Box>
				<Box display="flex" ml={xs ? 5 : 7} sx={{ position: "relative" }}>
					<InputBase
						fullWidth
						onKeyDown={(event) => {
							if (event.key === "Enter" || event.key === "ArrowUp" || event.key === "ArrowDown") {
								event.preventDefault();
								event.stopPropagation();
							}
						}}
						placeholder="Insert caption here ..."
						value={stateData.caption}
						sx={{
							...theme.typography.body2,
							fontWeight: 600,
							fontFamily: theme.typography.fontFamily,
							marginBottom: -0.6,
							opacity: 0.4,
						}}
						onChange={(e) => {
							setStateData({
								...stateData,
								caption: e.target.value,
							});
						}}
					/>
				</Box>
			</Box>
		</Fragment>
	);
};
export default Quote;
