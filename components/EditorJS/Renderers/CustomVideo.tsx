"use client";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "@/types";
import { Box, Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import ReactPlayer from "react-player/lazy";

const CustomVideo = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();

	return (
		<Box my={1} display="flex" flexDirection="column" textAlign="center">
			{props.data.url ? (
				<Box display="flex" width="100%" justifyContent="center">
					<ReactPlayer url={props.data.url} controls={true} />
				</Box>
			) : (
				<></>
			)}
			{props.data.caption ? (
				<Typography
					fontFamily={theme.typography.fontFamily}
					variant="body2"
					sx={{ opacity: 0.8, marginY: 2 }}
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(props.data.caption),
					}}
				/>
			) : (
				<></>
			)}
		</Box>
	);
};
export default CustomVideo;
