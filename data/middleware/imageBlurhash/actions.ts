"use server";
import { blurhashFromURL } from "blurhash-from-url";

export async function getImageBlurhash(url: string) {
	// Default 32x32 size
	// const output = await blurhashFromURL(url);
	// Set size
	const output = await blurhashFromURL(url, {
		size: 64,
	});
	return output;
}
