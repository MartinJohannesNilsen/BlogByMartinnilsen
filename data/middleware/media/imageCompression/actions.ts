"use server";
import sharp from "sharp";

// Output format to MIME type mapping
const contentTypeMap: Record<string, string> = {
	jpeg: "image/jpeg",
	jpg: "image/jpeg",
	png: "image/png",
	webp: "image/webp",
	avif: "image/avif",
	tiff: "image/tiff",
	tif: "image/tiff",
};

// Checks if the format is supported
export async function isSupportedFormat(format: string): Promise<boolean> {
	return format in contentTypeMap || format === "auto";
}

// Compress image function
export async function compressImage(
	imageBuffer: Buffer | Uint8Array,
	originalFilename: string,
	quality: number = 80,
	format: string = "auto",
	customFilename: string | null = null
) {
	try {
		// Create sharp instance
		let sharpInstance = sharp(imageBuffer);

		// Get image metadata
		const metadata = await sharpInstance.metadata();
		const inputFormat = metadata.format;

		// Determine output format
		let outputFormat = format.toLowerCase();
		if (outputFormat === "auto") {
			outputFormat = inputFormat || "jpeg";
		}

		// Validate format
		if (!(await isSupportedFormat(outputFormat))) {
			return {
				code: 400,
				reason: `Unsupported output format: ${outputFormat}`,
			};
		}

		// Configure compression based on format
		let processedImage;
		switch (outputFormat) {
			case "jpeg":
			case "jpg":
				processedImage = await sharpInstance.jpeg({ quality, mozjpeg: true }).toBuffer();
				break;
			case "png":
				// For PNG, we optimize with different parameters
				processedImage = await sharpInstance
					.png({
						quality,
						compressionLevel: 9,
						adaptiveFiltering: true,
						palette: false,
					})
					.toBuffer();
				break;
			case "webp":
				processedImage = await sharpInstance.webp({ quality, lossless: quality > 95 }).toBuffer();
				break;
			case "avif":
				processedImage = await sharpInstance.avif({ quality }).toBuffer();
				break;
			case "tiff":
			case "tif":
				processedImage = await sharpInstance
					.tiff({
						quality,
						compression: "jpeg", // Can be 'jpeg', 'lzw', 'packbits', or 'deflate'
						predictor: "horizontal", // Improves compression ratio
					})
					.toBuffer();
				break;
			default:
				// Default to JPEG if format not recognized
				processedImage = await sharpInstance.jpeg({ quality, mozjpeg: true }).toBuffer();
				outputFormat = "jpeg";
		}

		// Handle filename
		let outputFilename = "";
		if (customFilename) {
			// If custom filename is provided, use it but ensure correct extension
			const filenameBase = customFilename.split(".")[0]; // Remove any existing extension
			outputFilename = `${filenameBase}.${outputFormat}`;
		} else {
			// Use original filename but with new extension if format changed
			const originalNameWithoutExt =
				originalFilename.substring(0, originalFilename.lastIndexOf(".")) || originalFilename;
			outputFilename = `${originalNameWithoutExt}.${outputFormat}`;
		}

		// Return the compressed image data with metadata
		return {
			code: 200,
			data: {
				buffer: processedImage,
				filename: outputFilename,
				contentType: contentTypeMap[outputFormat] || "application/octet-stream",
				format: outputFormat,
				originalSize: imageBuffer.length,
				compressedSize: processedImage.length,
				compressionRatio: imageBuffer.length > 0 ? (processedImage.length / imageBuffer.length) * 100 : 0,
				reduction: 100 - (processedImage.length / imageBuffer.length) * 100,
			},
		};
	} catch (error) {
		console.error("Image compression error:", error);
		return {
			code: 500,
			reason: `Failed to process image: ${error.message || "Unknown error"}`,
		};
	}
}
