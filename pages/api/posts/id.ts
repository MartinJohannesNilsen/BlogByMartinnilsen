import { doc, getDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { validateAuthAPIToken } from "..";
import { db } from "../../../lib/firebaseConfig";

/**
 * @swagger
 * /api/posts/id:
 *   get:
 *     summary: Get post ids
 *     description: Retrieve a dictionary of postIds with their title.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Optional. Filter by published status (true/false).
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *               "qyOqoHY6lzVcUIJW75jI": "Title of sample post"
 *       '400':
 *         description: Bad Request. Invalid query parameter provided.
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
		try {
			const data = await getDoc(doc(db, "administrative", "overview")).then((data) => data.data().values);

			// Return all ids if query param published not present
			let outputJson = {};
			if (req.query.published === undefined) {
				data.map((post) => (outputJson[post.id] = post.title));
			} else if (req.query.published) {
				if (req.query.published !== "true" && req.query.published !== "false") {
					return res.status(400).json({
						code: 400,
						reason: "Unvalid boolean value for query parameter 'published'",
					});
				}
				data
					.filter((post) => post.published === (req.query.published === "true"))
					.map((post) => (outputJson[post.id] = post.title));
			}
			return res.status(200).send(outputJson);
		} catch (error) {
			return res.status(500).json({ code: 500, reason: error });
		}
	} else {
		return res.status(501).json({ code: 501, reason: "Method not supported" });
	}
}
