import { getImageBlurhash, isImageUrl } from "@/data/middleware/media/imageBlurhash/actions";
import { validateAuthAPIToken } from "@/data/middleware/tokenValidationAPI";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/media/imageblurhash:
 *   get:
 *     summary: Generate blurhash
 *     description: Generate blurhash and return encoded string, in addition to height and width of the image.
 *     tags:
 *       - Media
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL to encode using the blurhash algorithm.
 *       - in: query
 *         name: size
 *         required: false
 *         schema:
 *           type: integer
 *           default: 32
 *         description: The size to use for blurhash generation.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     encoded:
 *                       type: string
 *                       example: "UCBnNqOEACxGNgn%Sday1GwcbHNt}YbIr]W;"
 *                     width:
 *                       type: integer
 *                       example: 1200
 *                     height:
 *                       type: integer
 *                       example: 700
 *       '400':
 *         description: Bad request. URL parameter is missing or invalid.
 *       '500':
 *         description: Internal server error.
 */
export async function GET(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Get URL from query parameters
	const url = request.nextUrl.searchParams.get("url");
	if (!url) {
		return Response.json({ code: 400, reason: "Missing url parameter" }, { status: 400 });
	}

	// Get optional size parameter
	const sizeParam = request.nextUrl.searchParams.get("size");
	const size = sizeParam ? parseInt(sizeParam, 10) : 32;

	try {
		// Check that URL links to an image
		const isImage = await isImageUrl(url);
		if (!isImage) {
			return Response.json({ code: 400, reason: "Invalid URL, ensure that URL links to an image!" }, { status: 400 });
		}

		// Generate blurhash using middleware function
		const result = await getImageBlurhash(url, size);

		if (result.code !== 200) {
			return Response.json({ code: result.code, reason: result.reason }, { status: result.code });
		}

		// Return the blurhash data as JSON
		return Response.json({ code: 200, data: result.data }, { status: 200 });
	} catch (error) {
		console.error("Error processing blurhash request:", error);
		return Response.json(
			{ code: 500, reason: `Failed to process request: ${error.message || "Unknown error"}` },
			{ status: 500 }
		);
	}
}
