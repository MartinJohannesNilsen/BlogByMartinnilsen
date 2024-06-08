export async function getImageDetails(imageUrl) {
	// Add apikey header
	const headers = new Headers();
	headers.append("apikey", process.env.NEXT_PUBLIC_API_IMAGESTORE_TOKEN!);

	// Fetch and return
	const res: Response = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/editorjs/imageblurhash?url=${encodeURIComponent(imageUrl)}`,
		{
			method: "GET", // or 'POST', 'PUT', etc.
			headers: headers,
		}
	);
	return await res.json();
}
