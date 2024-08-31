export function getBackgroundColorLightOrDark(color: string, threshold?: number) {
	// Convert hex color to RGB
	let r, g, b;
	if (color.startsWith("#")) {
		color = color.slice(1);
		r = parseInt(color.substr(0, 2), 16);
		g = parseInt(color.substr(2, 2), 16);
		b = parseInt(color.substr(4, 2), 16);
	} else {
		// Assume it's an RGB color in format "rgb(x, y, z)"
		const rgba = color.match(/\d+/g);
		if (rgba && Array.isArray(rgba) && [3, 4].includes(rgba.length)) {
			r = parseInt(rgba[0]);
			g = parseInt(rgba[1]);
			b = parseInt(rgba[2]);
		}
	}

	// Calculate luminance using the formula for relative luminance
	// https://stackoverflow.com/a/596241/13858741
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255; // Digital ITU BT.601 (gives more weight to the R and B components)
	// const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; // Photometric/digital ITU BT.709

	// Return "light" or "dark" based on luminance
	if (threshold) return luminance > threshold ? "light" : "dark";
	return luminance > 0.5 ? "light" : "dark";
}
