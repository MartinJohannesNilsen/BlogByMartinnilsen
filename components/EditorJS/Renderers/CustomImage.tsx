import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DOMPurify from "isomorphic-dompurify";
import { isMobile } from "react-device-detect";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "../../../types";
import colorLuminance from "../../../utils/colorLuminance";
import { BlurhashCanvas } from "react-blurhash";
import { useEffect, useState } from "react";
import BlurHashHTMLImage from "../../Image/BlurHashHTMLImage";

const maxWidth = 760;

const CustomImage = (props: EditorjsRendererProps) => {
	const { theme } = useTheme();
	const useStyles = makeStyles(() => ({
		link: {
			color: theme.palette.text.primary,
			textDecoration: "none",
			borderBottom: "2px solid " + colorLuminance(theme.palette.secondary.main, 0.15),
			"&:hover": {
				borderBottom: "2px solid " + theme.palette.secondary.main,
			},
		},
		imgStretched: {},
	}));
	const style = useStyles();

	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.src = props.data.url;
		img.onload = () => setLoaded(true);
	}, [props.data.url]);

	return (
		<Box my={2} display="flex" width="100%" flexDirection="column" textAlign="center" alignItems="center">
			{props.data.height && props.data.width && props.data.blurhash ? (
				<>
					<Box style={{ display: loaded ? "inline" : "none" }}>
						<img
							src={props.data.url}
							alt=""
							style={{
								width: "100%",
								borderRadius: "0px",
								maxHeight: props.data.withBackground ? (isMobile ? 215 : 400) : "none",
								objectFit: "contain",
							}}
						/>
					</Box>
					<Box style={{ display: !loaded ? "inline" : "none" }}>
						<BlurhashCanvas
							hash={props.data.blurhash}
							width={Math.min(maxWidth, props.data.width)}
							height={Math.min(Math.floor(maxWidth * (props.data.height / props.data.width)), props.data.height)}
							style={{
								width: "100%",
								borderRadius: "0px",
								maxHeight: props.data.withBackground ? (isMobile ? 215 : 400) : "none",
								objectFit: "contain",
							}}
						/>
					</Box>
				</>
			) : (
				<img
					style={{
						width: "100%",
						borderRadius: "0px",
						maxHeight: props.data.withBackground ? (isMobile ? 215 : 400) : "none",
						objectFit: "contain",
					}}
					src={props.data.url ? props.data.url : props.data.file.url ? props.data.file.url : ""}
				/>
			)}

			{props.data.caption && props.data.caption !== "<br>" ? (
				<Box my={2}>
					<Typography
						fontFamily={theme.typography.fontFamily}
						variant="body2"
						color={theme.palette.text.primary}
						sx={{ opacity: 0.8 }}
						dangerouslySetInnerHTML={{
							__html: props.data.unsplash
								? DOMPurify.sanitize(
										props.data.caption! +
											` 📷 <a class=${style.link} href="${props.data.unsplash?.profileLink}">${props.data.unsplash?.author}</a>`
								  )
								: DOMPurify.sanitize(props.data.caption!),
						}}
					/>
				</Box>
			) : props.data.unsplash ? (
				<Box my={2}>
					<Typography
						fontFamily={theme.typography.fontFamily}
						color={theme.palette.text.primary}
						variant="body2"
						sx={{ opacity: 0.8 }}
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(
								`📷 <a class=${style.link} href="${props.data.unsplash?.profileLink}">${props.data.unsplash?.author}</a>`
							),
						}}
					/>
				</Box>
			) : (
				<></>
			)}
		</Box>
	);
};
export default CustomImage;
