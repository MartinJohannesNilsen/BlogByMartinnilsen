import type { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

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

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     description: Get all available tags.
 *     tags:
 *       - Default
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *              ["Tag1"]
 *       '404':
 *         description: Database entry 'tags' not found.
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = validateAuthAPIToken(req);
	if (!authValidation.isValid) {
		return res.status(authValidation.code).json({ code: authValidation.code, reason: authValidation.reason });
	}

	if (req.method === "GET") {
		// Get tags
		try {
			const data = await getDoc(doc(db, "administrative", "tags")).then((data) => data.data()!.values);
			if (!data) return res.status(404).send("Tags not found!");
			return res.status(200).send(data);
		} catch (error) {
			return res.status(500).json({ code: 400, reason: error });
		}
	} else {
		return res.status(501).json({ code: 501, reason: "Method not supported" });
	}
}
