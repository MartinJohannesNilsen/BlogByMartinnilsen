"use client";
import CustomVideo from "@/components/EditorJS/Renderers/CustomVideo";
import { isvalidHTTPUrl } from "@/components/PostManagement/PostManagement";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { Box, Button, TextField, Typography } from "@mui/material";
import NextLink from "next/link";
import { Fragment, useRef, useState } from "react";

export const InlineVideo = (props: { data: { url: "" }; onDataChange: (arg0: any) => void; readOnly: boolean }) => {
	const { theme } = useTheme();
	const textFieldRef = useRef<any>(null);
	const [textfieldData, setTextfieldData] = useState(props.data || { url: "" });

	return (
		<Fragment>
			<Box my={1}>
				{textfieldData.url === "" ? (
					<TextField
						disabled={props.readOnly}
						autoFocus
						fullWidth
						id="video-textfield"
						// label="Video url"
						placeholder="Insert video url here ..."
						inputRef={textFieldRef}
						slotProps={{
							input: {
								endAdornment: (
									<Button
										LinkComponent={NextLink}
										disabled={props.readOnly}
										onClick={() => {
											if (isvalidHTTPUrl(textFieldRef.current.value)) {
												props.onDataChange({ url: textFieldRef.current.value });
												setTextfieldData({ url: textFieldRef.current.value });
											}
										}}
									>
										<Typography
											fontFamily={theme.typography.fontFamily}
											variant="body2"
											fontWeight={600}
											color={theme.palette.text.primary}
											sx={{ opacity: 1 }}
										>
											Insert
										</Typography>{" "}
									</Button>
								),
							},
						}}
					/>
				) : (
					<CustomVideo data={textfieldData} style={{}} config={{}} classNames={{}} />
				)}
			</Box>
		</Fragment>
	);
};
export default InlineVideo;
