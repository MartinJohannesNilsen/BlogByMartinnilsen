import { doc, getDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/firebaseConfig";
import { validateAuthAPIToken } from ".";

/**
 * @swagger
 * /api/overview:
 *   get:
 *     summary: Get overview of posts
 *     description: Get all posts without data.
 *     tags:
 *       - Default
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the post.
 *                     example: yjdttN68e7V3E8SKIupT
 *                   published:
 *                     type: boolean
 *                     description: Indicates if the post is publicly accessible.
 *                     example: true
 *                   author:
 *                     type: string
 *                     description: The name of the author who created the post.
 *                     example: Martin Johannes Nilsen
 *                   title:
 *                     type: string
 *                     description: The title of the post.
 *                     example: "Hello, I'm Martin"
 *                   description:
 *                     type: string
 *                     description: A brief summary or introduction to the post.
 *                     example: "Allow me to introduce myself"
 *                   type:
 *                     type: string
 *                     description: The category or type of content the post represents.
 *                     example: "About me"
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Tags associated with the post for categorization and search.
 *                     example: ["Personal", "Introduction"]
 *                   keywords:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Keywords relevant to the post content.
 *                     example: ["Me", "Author", "Personal", "Engineer", "Developer"]
 *                   readTime:
 *                     type: string
 *                     description: An estimate of how long it will take to read the post.
 *                     example: "5 min read"
 *                   createdAt:
 *                     type: number
 *                     description: The timestamp of when the post was created.
 *                     example: 1674860419907
 *                   updatedAt:
 *                     type: number
 *                     description: The timestamp of the last update to the post.
 *                     example: 1699721335587
 *                   ogImage:
 *                     type: object
 *                     description: An object representing the Open Graph image of the post for sharing purposes.
 *                     properties:
 *                       src:
 *                         type: string
 *                         description: The URL of the image.
 *                         example: "https://firebasestorage.googleapis.com/v0/b/blogbymartinnilsen.appspot.com/o/image"
 *                       height:
 *                         type: integer
 *                         description: The height of the image in pixels.
 *                         example: 630
 *                       width:
 *                         type: integer
 *                         description: The width of the image in pixels.
 *                         example: 1200
 *                       blurhash:
 *                         type: string
 *                         description: A compact representation of a placeholder for the image.
 *                         example: "U45=LxTM8^wIt:X9rps=00nL.8TLivivR%XT"
 *
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
		try {
			const data = await getDoc(doc(db, "administrative", "overview")).then((data) => data.data()!.values);
			if (!data) return res.status(404).send("Overview not found!");
			return res.status(200).send(data);
		} catch (error) {
			return res.status(500).json({ error: error });
		}
	} else {
		return res.status(501).json({ code: 501, reason: "Method not supported" });
	}
}
