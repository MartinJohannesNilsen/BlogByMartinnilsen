import { Box } from "@mui/material";
import { CSSProperties } from "@mui/styles";
import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";

type BlurHashImageProps = {
	blurhash: { encoded: string; height?: number; width?: number; punch?: number };
	src: string;
	alt: string;
	style: CSSProperties;
};

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
					width={props.blurhash.width || null}
					height={props.blurhash.height || null}
					punch={props.blurhash.punch || null}
					style={props.style}
				/>
			</Box>
		</>
	);
};
export default BlurHashImage;
