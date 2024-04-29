"use client";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Fragment, useRef, useState } from "react";
import { useTheme } from "../../../../styles/themes/ThemeProvider";
import CustomVideo from "../../Renderers/CustomVideo";
import { isvalidHTTPUrl } from "../../../PostManagement/PostManagement";
import NextLink from "next/link";

export const InlineVideo = (props: { data: { url: "" }; onDataChange: (arg0: any) => void; readOnly: boolean }) => {
	const { theme } = useTheme();
	const textFieldRef = useRef<any>();
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
						InputProps={{
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
