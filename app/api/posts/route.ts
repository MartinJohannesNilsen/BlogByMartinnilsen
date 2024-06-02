import { MongoClient, Db, Collection } from "mongodb";
import { validateAuthAPIToken } from "@/lib/tokenValidationAPI";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
const uri = `mongodb://${process.env.MONGODB_ROOT_USER}:${process.env.MONGODB_ROOT_PASSWORD}@localhost:27017/`;
const client = new MongoClient(uri);

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
export async function GET(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Get query parameter if present
	const parseData = request.nextUrl.searchParams.get("parseData");

	// Get all posts
	try {
		const response: any[] = [];
		await client.connect();
		const db: Db = client.db(process.env.NEXT_PUBLIC_DB);
		const postsCollection = db.collection("posts");
		const postsCursor = postsCollection.find({});
		const posts = await postsCursor.toArray();
		posts.forEach((doc) => {
			// Get doc data object
			const docData = doc;
			const dataField =
				parseData && typeof parseData === "string" && parseData.toLowerCase() === "true"
					? JSON.parse(doc.data)
					: doc.data;
			// Push response
			response.push({
				id: doc._id,
				data: { ...docData, data: dataField },
			});
		});

		return Response.json(response, { status: 200 });
	} catch (error) {
		return Response.json({ code: 500, error: error }, { status: 500 });
	} finally {
		await client.close();
	}
}
