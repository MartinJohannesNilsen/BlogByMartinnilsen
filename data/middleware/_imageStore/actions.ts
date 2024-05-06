"use server";

// Upload an image to firebase storage
export async function uploadImage(file, postId, name) {
	// Prepare FormData
	const formData = new FormData();
	formData.append("file", file); // 'file' is the name expected by the server for the file

	// Add apikey header
	const headers = new Headers();
	headers.append("apikey", process.env.NEXT_PUBLIC_API_IMAGESTORE_TOKEN!);

	// Options for the fetch request
	const fetchOptions = {
		method: "POST",
		body: formData, // Attach the FormData object
		headers: headers,
		// Don't set Content-Type header manually, so the browser can set the boundary parameter automatically
	};

	try {
		// Make the HTTP request
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/editorjs/imagestore?directory=${postId}${name ? "&name=" + name : ""}`,
			fetchOptions
		);

		if (!response.ok) {
			return { code: response.status, reason: response.statusText };
		}

		// Process the response (assuming JSON response)
		const data = await response.json();
		return data;
	} catch (error) {
		return { error: error };
	}
}

// Delete an image from firebase storage
export async function deleteImage(fileRef) {
	// Add apikey header
	const headers = new Headers();
	headers.append("apikey", process.env.NEXT_PUBLIC_API_IMAGESTORE_TOKEN!);

	// Options for the fetch request
	const fetchOptions = {
		method: "DELETE",
		headers: headers,
		// Don't set Content-Type header manually, so the browser can set the boundary parameter automatically
	};

	try {
		// Make the HTTP request
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/editorjs/imagestore?fileRef=${fileRef}`,
			fetchOptions
		);

		if (!response.ok) {
			return { code: response.status, reason: response.statusText };
		}

		// Process the response (assuming JSON response)
		const data = await response.json();
		return data;
	} catch (error) {
		return { error: error };
	}
}

// Get image details such as height, width and encoded blurhash
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
