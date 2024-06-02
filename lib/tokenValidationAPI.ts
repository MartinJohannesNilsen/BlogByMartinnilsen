"use server";
import { NextRequest } from "next/server";

export async function validateAuthAPIToken(request: NextRequest) {
	// Extract the Authorization header
	const authorizationHeader = request.headers.get("apikey");
	// Check
	if (!authorizationHeader) {
		return {
			isValid: false,
			code: 401,
			reason: "Unauthorized - Authorization token 'apikey' missing in header",
		};
	} else if (authorizationHeader !== process.env.API_AUTHORIZATION_TOKEN) {
		return {
			isValid: false,
			code: 401,
			reason: "Unauthorized - Invalid Authorization token",
		};
	} else {
		return {
			isValid: true,
			code: 200,
			reason: "Authorized - Successfully validated Authorization token",
		};
	}
}

export async function validateImagestoreAPIToken(request: NextRequest) {
	// Extract the Authorization header
	const authorizationHeader = request.headers.get("apikey");
	// Check
	if (!authorizationHeader) {
		return {
			isValid: false,
			code: 401,
			reason: "Unauthorized - Authorization token 'apikey' missing in header",
		};
	} else if (authorizationHeader !== process.env.NEXT_PUBLIC_API_IMAGESTORE_TOKEN) {
		return {
			isValid: false,
			code: 401,
			reason: "Unauthorized - Invalid Authorization token",
		};
	} else {
		return {
			isValid: true,
			code: 200,
			reason: "Authorized - Successfully validated Authorization token",
		};
	}
}
