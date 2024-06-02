import { SupabaseAdmin } from "@/lib/supabaseAdmin";
import { validateAuthAPIToken } from "@/lib/tokenValidationAPI";
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
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Query the pages table in the database where slug equals the request params slug.
	const { data, error } = await SupabaseAdmin.from("views").select("postId, viewCount");

	if (data) {
		let viewCounts = {};
		data.map((row) => (viewCounts[row.postId] = row.viewCount));
		return Response.json(viewCounts || null, { status: 200 });
	} else if (error) {
		return Response.json({ code: 500, reason: error }, { status: 500 });
	}
}
