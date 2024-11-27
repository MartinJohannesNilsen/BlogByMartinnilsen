import { useTheme } from "@/styles/themes/ThemeProvider";
import { EditorjsRendererProps } from "@/types";
import { ArrowBackIosSharp, ArrowForwardIosSharp } from "@mui/icons-material";
import { Box, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

type CarouselItem = {
	url: string;
	caption: string;
};

// Editor.js Image Carousel Renderer
export const CustomImageCarousel = (props: EditorjsRendererProps) => {
	const isCarouselItem = (item: any): item is CarouselItem => {
		return item.url !== undefined && item.caption !== undefined;
	};
	const carouselItems: CarouselItem[] = props.data.items!.filter(isCarouselItem);
	return <ImageCarousel items={carouselItems} />;
};

// Image Carousel Component
export const ImageCarousel = ({ items }: { items: CarouselItem[] }) => {
	const { theme } = useTheme();
	const [activeIndex, setActiveIndex] = useState(0);
	const carouselRef = useRef<HTMLDivElement | null>(null);
	const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
	const paginationRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		gsap.to(slidesRef.current, {
			xPercent: -100 * activeIndex,
			duration: 0.5,
			ease: "power2.inOut",
		});
	}, [activeIndex, items.length]);

	return (
		<Box
			sx={{
				mt: 4,
				mb: 2,
				position: "relative",
				overflow: "hidden",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<ToggleButtonGroup
				size="small"
				sx={{ pb: 2.5 }}
				// sx={{ paddingRight: 1, position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)" }}
			>
				<ToggleButton
					disableFocusRipple
					value
					sx={{
						width: 30,
						height: 34,
						borderRadius: "10px",
						color: theme.palette.text.primary,
						"&:disabled": {
							color: theme.palette.text.primary + "50",
						},
						"&:focus-visible": {
							backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
						},
					}}
					disabled={activeIndex <= 0}
					onClick={() => {
						if (activeIndex > 0) {
							setActiveIndex(activeIndex - 1);
						}
					}}
				>
					<Tooltip enterDelay={2000} title="Previous">
						<ArrowBackIosSharp
							sx={{
								height: 16,
								width: 16,
								color: "inherit",
							}}
						/>
					</Tooltip>
				</ToggleButton>
				<ToggleButton
					disableFocusRipple
					value
					sx={{
						width: 60,
						height: 34,
						borderRadius: "10px",
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
					}}
					disabled
				>
					<Typography variant="subtitle2" color="textPrimary" fontFamily={theme.typography.fontFamily}>
						{activeIndex + 1} / {items.length}
					</Typography>
				</ToggleButton>
				<ToggleButton
					disableFocusRipple
					value
					sx={{
						width: 30,
						height: 34,
						borderRadius: "10px",
						color: theme.palette.text.primary,
						"&:disabled": {
							color: theme.palette.text.primary + "50",
						},
						"&:focus-visible": {
							backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50],
						},
					}}
					disabled={activeIndex >= items.length - 1}
					onClick={() => {
						if (activeIndex < items.length - 1) {
							setActiveIndex(activeIndex + 1);
						}
					}}
				>
					<Tooltip enterDelay={2000} title="Next">
						<ArrowForwardIosSharp
							sx={{
								height: 16,
								width: 16,
								color: "inherit",
							}}
						/>
					</Tooltip>
				</ToggleButton>
			</ToggleButtonGroup>
			<Box ref={carouselRef} sx={{ display: "flex", width: "100%", position: "relative" }}>
				{items.map((item, index) => (
					<Box
						key={index}
						//@ts-ignore
						ref={(el) => (slidesRef.current[index] = el)}
						sx={{
							minWidth: "100%",
							transition: "transform 0.5s ease",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<img
							src={item.url}
							alt={item.caption}
							style={{
								maxWidth: "100%",
								maxHeight: "500px",
								objectFit: "contain",
								borderRadius: "5px",
								padding: "0px 5px",
							}}
						/>
						<Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.primary }}>
							{item.caption}
						</Typography>
					</Box>
				))}
			</Box>
			{/* Dots for navigation */}
			{/* <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
				{items.map((_, index) => (
					<Box
						key={index}
						//@ts-ignore
						ref={(el) => (paginationRef.current[index] = el)}
						onClick={() => setActiveIndex(index)}
						sx={{
							width: "10px",
							height: "10px",
							borderRadius: "50%",
							backgroundColor: activeIndex === index ? theme.palette.primary.main : theme.palette.grey[400],
							margin: "0 5px",
							cursor: "pointer",
						}}
					/>
				))}
			</Box> */}
		</Box>
	);
};

export default CustomImageCarousel;
