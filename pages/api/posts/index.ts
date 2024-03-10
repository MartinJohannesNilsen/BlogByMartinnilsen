import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { validateAuthAPIToken } from "..";
import { db } from "../../../lib/firebaseConfig";

// TODO
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get posts
 *     description: Retrieve details for all posts.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: parseData
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Whether to parse data field of post.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *              posts:
 *               - id: "7FPz65Fkv8sHM3aDIx0r"
 *                 data:
 *                 - title: "Post title"
 *                   description: "Post description"
 *                   createdAt: 1701103064042
 *                   type: "Tutorial"
 *                   data: "{\"time\":1701472725450,\"blocks\":[],\"version\":\"2.28.2\"}"
 *                   tags: ["Development","Python"]
 *                   keywords: ["Keyword"]
 *                   author: "Martin Johannes Nilsen"
 *                   published: false
 *                   updatedAt: 1701472730348
 *                   readTime: "2 min read"
 *                   ogImage:
 *                     src: "https://example.com/og-image.png"
 *                     blurhash: "L35O{g_4s9xu~qRkofayx^ayofay"
 *                     height: 600
 *                     width: 800
 *              overview:
 *               - id: "7FPz65Fkv8sHM3aDIx0r"
 *                 title: "Post title"
 *                 description: "Post description"
 *                 createdAt: 1701103064042
 *                 type: "Tutorial"
 *                 tags: ["Development","Python"]
 *                 keywords: ["Keyword"]
 *                 author: "Martin Johannes Nilsen"
 *                 published: false
 *                 updatedAt: 1701472730348
 *                 readTime: "2 min read"
 *                 ogImage:
 *                   src: "https://example.com/og-image.png"
 *                   blurhash: "L35O{g_4s9xu~qRkofayx^ayofay"
 *                   height: 600
 *                   width: 800
 *       '404':
 *         description: Post not found.
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

	// Get query parameter if present
	const parseData = req.query.parseData;

	if (req.method === "GET") {
		// Get all posts
		try {
			const response = {
				posts: [],
				overview: [],
			};
			const querySnapshot = await getDocs(collection(db, "posts"));
			querySnapshot.forEach((doc) => {
				// Get doc data object
				const docData = doc.data();
				// Get datafield, parse if parseData is present
				const dataField =
					parseData && typeof parseData === "string" && parseData.toLowerCase() === "true"
						? JSON.parse(docData.data)
						: docData.data;
				// Push response
				response.posts.push({
					id: doc.id,
					data: { ...docData, data: dataField },
				});
			});
			const postOverviewSnapshot = await getDoc(doc(db, "administrative", "overview"));
			response.overview = postOverviewSnapshot.data().values;
			return res.status(200).json(response);
		} catch (error) {
			return res.status(500).json({ code: 500, reason: error });
		}
	} else {
		return res.status(501).json({ code: 501, reason: "Method not supported" });
	}
}
