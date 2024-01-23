import React, { useRef } from "react";
import { Box, Card, IconButton, InputBase, MenuItem, Modal, Select, Typography, useMediaQuery } from "@mui/material";
import EmojiPicker, { EmojiClickData, SkinTonePickerLocation } from "emoji-picker-react";
import { Fragment, useEffect, useState } from "react";
import { useTheme } from "../../../../styles/themes/ThemeProvider";
import DOMPurify from "dompurify";
import { StyledTextField } from "../../../StyledMUI/TextInput";
import { NavbarButton } from "../../../Buttons/NavbarButton";
import { Add, Upload } from "@mui/icons-material";

export const imageDetailsApiFetcher = async (url: RequestInfo) => {
	// Add apikey header
	const headers = new Headers();
	headers.append("apikey", process.env.NEXT_PUBLIC_API_AUTHORIZATION_TOKEN);

	// Fetch and return
	const res: Response = await fetch(url, {
		method: "GET", // or 'POST', 'PUT', etc.
		headers: headers,
	});
	return await res.json();
};

// Types
type ImageDataProps = {
	type: string; // url, upload, unsplash, paste?
	url: string;
	caption: string;
	blurhash: string;
	height: number;
	width: number;
	filename: string;
	unsplash: { author: string; profileLink: string };
};
type ImageProps = {
	data: ImageDataProps;
	onDataChange: (arg0: any) => void;
	readOnly: boolean;
};

// Component
export const ImageBlock = (props: ImageProps) => {
	const { theme } = useTheme();
	const mdDown = useMediaQuery(theme.breakpoints.down("md"));
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const [stateData, setStateData] = useState(
		props.data || {
			type: "upload", // url, upload, unsplash, paste?
			url: "",
			caption: "",
			blurhash: "",
			height: 0,
			width: 0,
			filename: null,
			unsplash: null,
		}
	);
	const [inputValue, setInputValue] = useState("");

	// Change Editorjs state on state change
	useEffect(() => {
		props.onDataChange(stateData);
	}, [stateData]);

	return (
		<Fragment>
			<Box my={2} sx={{ userSelect: "none" }}>
				{stateData.url ? (
					// Render image, caption and deletebutton (if filename)
					<Box display="flex" flexDirection="column" gap={1}>
						<img
							style={{
								width: "100%",
								borderRadius: "0px",
								objectFit: "contain",
							}}
							src={stateData.url}
						/>
						<StyledTextField
							InputLabelProps={{ shrink: false }}
							placeholder="Caption"
							name="caption"
							fullWidth
							multiline
							size="small"
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									event.preventDefault();
								}
							}}
							inputProps={{
								style: { padding: "0px" },
							}}
							value={stateData.caption}
							onChange={(e: { target: { name: any; value: any } }) => {
								const { name, value } = e.target;
								setStateData({
									...stateData,
									[name]: value,
								});
							}}
						/>
					</Box>
				) : (
					// Render input box
					<Box display="flex" gap={1}>
						<StyledTextField
							InputLabelProps={{ shrink: false }}
							placeholder="URL"
							name="url"
							fullWidth
							multiline
							size="small"
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									event.preventDefault();
								}
							}}
							inputProps={{
								style: { padding: "0px" },
							}}
							value={inputValue}
							onChange={(e: { target: { name: any; value: any } }) => {
								const { name, value } = e.target;
								setInputValue(value);
							}}
						/>
						{/* Upload image */}
						<NavbarButton
							variant="outline"
							disabled
							onClick={() => {}}
							icon={Add}
							tooltip="Upload to storage"
							sxButton={{
								minWidth: "40px",
								minHeight: "40px",
								height: "40px",
								width: "40px",
							}}
							sxIcon={{
								height: "22px",
								width: "22px",
								color: "inherit",
							}}
						/>
						{/* Fetch image */}
						<NavbarButton
							variant="outline"
							onClick={async () => {
								const details = await imageDetailsApiFetcher(
									process.env.NEXT_PUBLIC_SERVER_URL + "/editorjs/imageblurhash?url=" + encodeURIComponent(inputValue)
								);
								setStateData({
									...stateData,
									type: "url",
									url: inputValue,
									blurhash: details.encoded,
									height: details.height,
									width: details.width,
								});
							}}
							icon={Upload}
							tooltip="Fetch image"
							sxButton={{
								minWidth: "40px",
								minHeight: "40px",
								height: "40px",
								width: "40px",
							}}
							sxIcon={{
								height: "22px",
								width: "22px",
								color: "inherit",
							}}
						/>
					</Box>
				)}
			</Box>
		</Fragment>
	);
};
export default ImageBlock;
