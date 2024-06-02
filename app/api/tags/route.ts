import { getTags } from "@/data/middleware/tags/tags";
import { validateAuthAPIToken } from "@/lib/tokenValidationAPI";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

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
export async function GET(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Get tags
	try {
		const data = await getTags();
		if (!data) return new Response("Tags not found!", { status: 404 });
		return new Response(JSON.stringify(data), { status: 200 });
	} catch (error) {
		return Response.json({ code: 400, reason: error }, { status: 400 });
	}
}
