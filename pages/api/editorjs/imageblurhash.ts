import { blurhashFromURL } from "blurhash-from-url";
import type { NextApiRequest, NextApiResponse } from "next";
import { validateAuthAPIToken } from "../tags";

async function getBlurhash(url: string) {
	// Default 32x32 size
	// const output = await blurhashFromURL(url);
	// Set size
	const output = await blurhashFromURL(url, {
		size: 64,
	});
	return output;
}

function isImgUrl(url) {
	return fetch(url, { method: "HEAD" }).then((res) => {
		return res.headers.get("Content-Type")!.startsWith("image");
	});
}

/**
 * @swagger
 * /api/editorjs/imageblurhash:
 *   get:
 *     summary: Generate blurhash
 *     description: Generate blurhash and return encoded string, in addition to height and width of the image.
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
 *             schema:
 *               type: object
 *               properties:
 *                 encoded:
 *                   type: string
 *                   example: "UCBnNqOEACxGNgn%Sday1GwcbHNt}YbIr]W;"
 *                 width:
 *                   type: integer
 *                   example: 1200
 *                 height:
 *                   type: integer
 *                   example: 700
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
			// Check that url links to image
			let isImage = await isImgUrl(req.query.url as string);
			if (isImage) {
				// Get blurhash
				await getBlurhash(req.query.url as string).then((output) => {
					return res.status(200).json(output);
				});
			} else {
				return res.status(400).json({ code: 400, reason: "Invalid url, ensure that url links to an image!" });
			}
		} catch (err) {
			return res.status(500).json({ code: 500, reason: err });
		}
	} else {
		return res.status(501).json({ code: 501, reason: "Method not supported" });
	}
}
