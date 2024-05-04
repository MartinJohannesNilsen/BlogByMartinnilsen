"use client";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";
import { BlurHashImageProps } from "../../../types";

export const BlurHashImage = (props: BlurHashImageProps) => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.src = props.src;
		img.onload = () => setLoaded(true);
	}, [props.src]);

	return (
		<>
			<Box style={{ display: loaded ? "inline" : "none" }}>
				<img src={props.src} alt={props.alt} style={props.style} />
			</Box>
			<Box style={{ display: !loaded ? "inline" : "none" }}>
				<Blurhash
					hash={props.blurhash.encoded}
					width={props.blurhash.width || undefined}
					height={props.blurhash.height || undefined}
					punch={props.blurhash.punch || undefined}
					style={props.style}
				/>
			</Box>
		</>
	);
};
export default BlurHashImage;
