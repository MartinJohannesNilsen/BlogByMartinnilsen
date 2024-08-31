import { blurhashFromURL } from "blurhash-from-url";

/**
 * Get image details.
 * @param {string} url - The image url.
 * @returns
 * @returns {object} An object containing the encoded string, width, and height.
 */
export async function getImageBlurhash(url: string) {
	const output = await blurhashFromURL(url, {
		size: 64,
	});
	return output;
}
