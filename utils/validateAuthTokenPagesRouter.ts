"use server";
import { NextApiRequest } from "next";

export function validateAuthAPIToken(req: NextApiRequest) {
	// Extract the Authorization header
	const authorizationHeader = req.headers.apikey;
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

export function validateImagedetailsAPIToken(req: NextApiRequest) {
	// Extract the Authorization header
	const apikey = req.headers.apikey;
	// Check
	if (!apikey) {
		return {
			isValid: false,
			code: 401,
			reason: "Unauthorized - Imagestore token 'apikey' missing in header",
		};
	} else if (apikey !== process.env.NEXT_PUBLIC_API_IMAGEDETAILS_TOKEN) {
		return {
			isValid: false,
			code: 401,
			reason: "Unauthorized - Invalid imagestore token",
		};
	} else {
		return {
			isValid: true,
			code: 200,
			reason: "Authorized - Successfully validated imagestore token",
		};
	}
}
