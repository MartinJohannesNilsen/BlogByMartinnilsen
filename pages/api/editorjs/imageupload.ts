// TODO Fix image uploading and deletion
import type { NextApiRequest, NextApiResponse } from "next";
// import type { NextRequest, NextResponse } from "next/server";
import { validateAuthAPIToken } from "..";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { cloudStorage } from "../../../lib/firebaseConfig";
import { fileTypeFromBuffer, fileTypeFromFile } from "file-type";
import { join } from "path";
import { writeFile } from "fs/promises";
import formidable from "formidable";

const generateName = (postId: string, extension: string) => {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	const second = String(date.getSeconds()).padStart(2, "0");
	return `images/${postId}/${year}-${month}-${day}.${hour}${minute}${second}` + "." + extension;
};

export const config = {
	api: {
		bodyParser: false,
	},
};

/**
 * @swagger
 * /api/editorjs/imageupload:
 *   post:
 *     summary: Upload image
 *     description: Upload image to storage solution.
 *     tags:
 *       - EditorJS
 *     parameters:
 *       - in: query
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the post the image belongs to.
 *     requestBody:
 *       description: MIME file
 *       required: true
 *       content:
 *         image/jpeg:
 *           schema:
 *             type: string
 *             format: binary
 *         image/png:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: Successfully uploaded the image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Public URL of the uploaded image.
 *       '400':
 *         description: Bad request. URL parameter is missing or invalid.
 *       '500':
 *         description: Internal server error.
 *       '501':
 *         description: Method not supported.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Validate authorized access based on header field 'apikey'
	// const authValidation = validateAuthAPIToken(req);
	// if (!authValidation.isValid) {
	// 	return res.status(authValidation.code).json({ code: authValidation.code, reason: authValidation.reason });
	// }

	if (!req.query.postId) {
		return res.status(400).json({ code: 400, reason: "Missing postId" });
	}

	if (req.method === "POST") {
		try {
			const file = req.body as unknown as File;

			if (!file) {
				return res.status(400).json({ code: 400, reason: "File is not supported!" });
			}

			// Generate buffer
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);
			return res.status(200).json({ ye: "yah" });

			// Extract type and name
			const type = await fileTypeFromBuffer(buffer);
			const filename = generateName(req.query.postId as string, type.ext);

			// Write to file system
			const path = join("/", "tmp", filename);
			await writeFile(path, buffer);

			return res.status(200).json({ type: type.mime, ext: type.ext, url: path });
			// let imageRef = ref(cloudStorage, );
			// let metadata = {
			// 	contentType: type.ext,
			// };
			// let uploadTask = await uploadBytes(imageRef, file, metadata);
			// const downloadURL = await getDownloadURL(uploadTask.ref);
		} catch (err) {
			return res.status(500).json({ code: 500, reason: err });
		}
	} else {
		return res.status(501).json({ code: 501, reason: "Method not supported" });
	}
}