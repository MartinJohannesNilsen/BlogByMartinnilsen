"use server";
import sharp from "sharp";
import { encode, isBlurhashValid } from "blurhash";

/**
 * Check if a URL points to an image by attempting to download and process a small portion
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} Whether the URL points to an image
 */
export async function isImageUrl(url: string): Promise<boolean> {
	try {
		// Skip HEAD requests and content-type checks as they're unreliable
		// Instead, just try to download the first few bytes and process with Sharp
		const response = await fetch(url, {
			headers: {
				// Request only a small amount of data to check if it's an image
				Range: "bytes=0-4096",
			},
		});

		if (!response.ok) return false;

		// Even if the server doesn't honor our Range request, we'll get enough data to check
		const buffer = Buffer.from(await response.arrayBuffer());

		try {
			// If Sharp can get metadata, it's likely an image
			await sharp(buffer).metadata();
			return true;
		} catch (e) {
			return false;
		}
	} catch (error) {
		console.error("Error checking if URL is an image:", error);
		return false;
	}
}

/**
 * Check if a string is a valid blurhash
 * @param {string} hash - The blurhash string to validate
 * @returns {Promise<Object>} Object with result (boolean) and error message if invalid
 */
export async function isValidBlurhash(hash: string): Promise<{
	result: boolean;
	errorReason?: string;
}> {
	if (!hash || typeof hash !== "string") {
		return {
			result: false,
			errorReason: "Blurhash must be a non-empty string",
		};
	}

	try {
		// isBlurhashValid itself is synchronous, but we're wrapping it in an async function
		const result = isBlurhashValid(hash);

		// Return the validation result
		return typeof result === "object" ? result : { result };
	} catch (error) {
		return {
			result: false,
			errorReason: error.message || "Invalid blurhash format",
		};
	}
}

/**
 * Generate blurhash from an image URL
 * @param {string} url - The image URL
 * @param {number} size - The size to use for blurhash generation (default: 32)
 * @returns {Promise<Object>} An object containing status code and either the blurhash data or error reason
 */
export async function getImageBlurhash(url: string, size: number = 32) {
	try {
		// Fetch the image
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
		}
		const arrayBuffer = await response.arrayBuffer();
		const imageBuffer = Buffer.from(arrayBuffer);

		// Get original image metadata for return values
		const metadata = await sharp(imageBuffer).metadata();
		const originalWidth = metadata.width || 0;
		const originalHeight = metadata.height || 0;

		// Process image using the optimized approach
		// This matches the pattern from the provided example
		const { data, info } = await sharp(imageBuffer)
			.raw()
			.ensureAlpha()
			.resize(size, size, { fit: "inside" })
			.toBuffer({ resolveWithObject: true });

		// Generate the blurhash
		const encoded = encode(
			new Uint8ClampedArray(data),
			info.width,
			info.height,
			4, // x components (4 is the default, higher values increase quality on horizontal axis)
			3 // y components (3 is the default, higher values increase quality on vertical axis)
		);

		// Return success
		return {
			code: 200,
			data: {
				encoded,
				width: originalWidth,
				height: originalHeight,
			},
		};
	} catch (error) {
		console.error("Error generating blurhash:", error);
		return {
			code: 500,
			reason: `Failed to generate blurhash: ${error.message || "Unknown error"}`,
		};
	}
}
