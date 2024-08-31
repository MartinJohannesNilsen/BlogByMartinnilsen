"use client";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";

const ViewportMeta = () => {
	const { theme } = useTheme();

	useEffect(() => {
		const metaViewport = document.querySelector('meta[name="theme-color"]');
		if (metaViewport) {
			metaViewport.setAttribute("content", isMobile ? theme.palette.primary.main : theme.palette.primary.main + "EE");
		} else {
			const newMetaViewport = document.createElement("meta");
			newMetaViewport.name = "theme-color";
			newMetaViewport.content = isMobile ? theme.palette.primary.main : theme.palette.primary.main + "EE";
			document.head.appendChild(newMetaViewport);
		}
	}, [theme]);

	return null;
};

export default ViewportMeta;
