import { getAllViewCounts } from "@/data/middleware/views/actions";
import { validateAuthAPIToken } from "@/data/middleware/tokenValidationAPI";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/views:
 *   get:
 *     summary: Get view counts of all posts
 *     description: Fetches view counts of all posts.
 *     tags:
 *       - Views
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *          application/json:
 *           example:
 *            2vl7PgaUvfwe3T9R4l3a: 1
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 */
export async function GET(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return new Response(JSON.stringify({ code: authValidation.code, reason: authValidation.reason }), {
			status: authValidation.code,
		});
	}

	try {
		const viewCounts = await getAllViewCounts();
		return new Response(JSON.stringify(viewCounts || null), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ code: 500, reason: error.message }), { status: 500 });
	}
}
