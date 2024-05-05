import { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateAuthAPIToken } from "../../../lib/tokenValidationAPI";

/**
 * @swagger
 * /api/revalidate:
 *   get:
 *     summary: Revalidate NextJS page
 *     description: Revalidates a Next.js page.
 *     tags:
 *       - Default
 *     parameters:
 *       - name: path
 *         in: query
 *         description: The path of a page to revalidate. Will revalidate all subpages of this path.
 *         required: false
 *         schema:
 *           type: string
 *       - name: tag
 *         in: query
 *         description: The tag of a cache to revalidate.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *              revalidated: true
 *       '400':
 *         description: Bad request. URL parameter is missing or invalid.
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

	// If path or tag is set, revalidate
	const path = request.nextUrl.searchParams.get("path");
	const tag = request.nextUrl.searchParams.get("tag");
	if (path || tag) {
		try {
			path && revalidatePath(path, "layout");
			tag && revalidateTag(tag);
			return Response.json({ revalidated: true, path: path, tag: tag, now: Date.now() });
		} catch (err) {
			return Response.json({ code: 500, reason: "Error during revalidation" }, { status: 500 });
		}
	}

	return Response.json(
		{
			revalidated: false,
			now: Date.now(),
			message: "Missing path or tag to revalidate",
		},
		{ status: 400 }
	);
}
