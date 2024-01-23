import { blurhashFromURL } from "blurhash-from-url";
import type { NextApiRequest, NextApiResponse } from "next";
import { validateAuthAPIToken } from "..";

async function getBlurhash(url: string) {
	// Default 32x32 size
	// const output = await blurhashFromURL(url);
	// Set size
	const output = await blurhashFromURL(url, {
		size: 64,
	});
	return output;
}

/**
 * @swagger
 * /api/editorjs/imageblurhash:
 *   get:
 *     summary: Generate blurhash
 *     description: Generate blurhash and return encoded string, in addition to heigth and width of image.
 *     tags:
 *       - EditorJS
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL to encode using the blurhash algorithm.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *              encoded: "UCBnNqOEACxGNgn%Sday1GwcbHNt}YbIr]W;"
 *              width: 1200
 *              height: 700
 *
 *       '400':
 *         description: Bad request. URL parameter is missing or invalid.
 *       '500':
 *         description: Internal server error.
 *       '501':
 *         description: Method not supported.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = validateAuthAPIToken(req);
	if (!authValidation.isValid) {
		return res.status(authValidation.code).json({ code: authValidation.code, reason: authValidation.reason });
	}

	if (!req.query.url) {
		return res.status(400).json({ code: 400, reason: "Missing url" });
	}

	if (req.method === "GET") {
		try {
			// Get blurhash
			getBlurhash(req.query.url as string).then((output) => {
				return res.status(200).json(output);
			});
		} catch (err) {
			return res.status(500).json({ code: 500, reason: err });
		}
	} else {
		return res.status(501).json({ code: 501, reason: "Method not supported" });
	}
}