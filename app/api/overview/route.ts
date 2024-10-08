import { getPostsOverview } from "@/data/middleware/overview/actions";
import { validateAuthAPIToken } from "@/data/middleware/tokenValidationAPI";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

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
 *         description: Overview not found.
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
	try {
		const data = await getPostsOverview();
		if (!data) return new Response("Overview not found!", { status: 404 });
		return Response.json(data, { status: 200 });
	} catch (error) {
		return Response.json({ error: error }, { status: 500 });
	}
}
