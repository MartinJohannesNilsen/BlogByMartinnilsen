import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/media/linkpreview:
 *   get:
 *     summary: Fetch link preview attributes
 *     description: Fetches link preview attributes for a given URL.
 *     tags:
 *       - Media
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL for which link preview attributes are to be fetched.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: integer
 *                   example: 1
 *                 meta:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Sample Link"
 *                     description:
 *                       type: string
 *                       example: "This is a sample link."
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: "https://example.com/sample.jpg"
 *                     url:
 *                       type: string
 *                       format: uri
 *                       example: "https://example.com"
 *
 *       '400':
 *         description: Bad request. URL parameter is missing or invalid.
 *       '500':
 *         description: Internal server error.
 *       '501':
 *         description: Method not supported.
 */
export async function GET(request: NextRequest) {
	// Removed due to editorjs component not supporting additional parameters
	// Check for secret to confirm this is a valid request
	// const secret = request.nextUrl.searchParams.get("secret");
	// if (!secret) {
	// 	return Response.json({ code: 400, reason: "Missing token" }, { status: 400 });
	// } else if (secret !== process.env.LINKPREVIEW_API_KEY) {
	// 	return Response.json({ code: 400, reason: "Invalid token" }, { status: 400 });
	// }

	// Get query param
	const url = request.nextUrl.searchParams.get("url");

	// Check if url is set
	if (!url) {
		return Response.json({ code: 400, reason: "Missing url" }, { status: 400 });
	}

	try {
		const api = await fetch(`http://api.linkpreview.net/?key=${process.env.LINKPREVIEW_API_KEY}&q=${url}`).then(
			(data) => data.json()
		);
		if (api.error === undefined) {
			return Response.json({ success: 1, meta: api }, { status: 200 });
		} else {
			return Response.json({ code: 400, reason: "Invalid url" }, { status: 400 });
		}
	} catch (err) {
		return Response.json({ code: 401, reason: err }, { status: 401 });
	}
}
