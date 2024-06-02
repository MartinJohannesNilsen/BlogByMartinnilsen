import { getPostsOverview } from "@/data/middleware/overview/overview";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

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
export async function GET(request: NextRequest) {
	// Get query param
	const published = request.nextUrl.searchParams.get("published");

	try {
		// Fetch postsOverview
		const data = await getPostsOverview();

		// Return all ids if query param published not present
		let outputJson = {};
		if (published === undefined || published === null || (published !== "true" && published !== "false")) {
			data.map((post) => (outputJson[post.id] = post.title));
		} else if (published) {
			if (published !== "true" && published !== "false") {
				return Response.json(
					{
						code: 400,
						reason: "Unvalid boolean value for query parameter 'published'",
					},
					{ status: 400 }
				);
			}
			data
				.filter((post) => post.published === (published === "true"))
				.map((post) => (outputJson[post.id] = post.title));
		}
		return Response.json(outputJson, { status: 200 });
	} catch (error) {
		return Response.json({ code: 500, reason: error }, { status: 500 });
	}
}
