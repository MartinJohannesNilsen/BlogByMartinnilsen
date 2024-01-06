import Image from "next/image";
import { useState } from "react";

function BlurImage({ src, alt, ...props }) {
	const [isLoading, setLoading] = useState(true);

	return (
		<Image
			{...props}
			src={src}
			alt={alt}
			style={{
				transitionDuration: "700ms",
				transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
				transform: isLoading ? "scale(1.1)" : "scale(1)",
				filter: isLoading ? "blur('40px') grayscale(1)" : "blur('0px') grayscale(0)",
			}}
			onLoadingComplete={() => setLoading(false)}
		/>
	);
}

export default BlurImage;
