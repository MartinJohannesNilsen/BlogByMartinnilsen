"use server";

// Get all view counts
export async function getAllViewCounts() {
	const res: Response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/views/`, {
		method: "GET", // or 'POST', 'PUT', etc.
		headers: {
			apikey: process.env.API_AUTHORIZATION_TOKEN!,
		},
	});
	return await res.json();
}

export async function getViewCountsByPostId(postId: string) {
	const res: Response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/views/${postId}`, {
		method: "GET", // or 'POST', 'PUT', etc.
		headers: {
			apikey: process.env.API_AUTHORIZATION_TOKEN!,
		},
	});
	return await res.json();
}

// Increment post overviews
export async function incrementPostViews(postId: string) {
	const res: Response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/views/${postId}`, {
		method: "POST",
		headers: {
			apikey: process.env.API_AUTHORIZATION_TOKEN!,
		},
	});
	return res.json();
}
