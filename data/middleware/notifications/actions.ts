"use server";

// Get all notifications
export async function getAllNotifications() {
	// Add apikey header
	const headers = new Headers();
	headers.append("apikey", process.env.API_AUTHORIZATION_TOKEN!);

	// Fetch and return
	const res: Response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/notifications`, {
		method: "GET", // or 'POST', 'PUT', etc.
		headers: headers,
	});
	return await res.json();
}
