import type { NextApiRequest, NextApiResponse } from "next";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import formidable from "formidable-serverless";
import * as fs from "fs";
import { validateAuthAPIToken } from "../tags";
import { cloudStorage } from "../../../lib/firebaseConfig";

export function validateImagestoreAPIToken(req: NextApiRequest) {
	// Extract the Authorization header
	const apikey = req.headers.apikey;
	// Check
	if (!apikey) {
		return {
			isValid: false,
			code: 401,
			reason: "Unauthorized - Imagestore token 'apikey' missing in header",
		};
	} else if (apikey !== process.env.NEXT_PUBLIC_API_IMAGESTORE_TOKEN) {
		return {
			isValid: false,
			code: 401,
			reason: "Unauthorized - Invalid imagestore token",
		};
	} else {
		return {
			isValid: true,
			code: 200,
			reason: "Authorized - Successfully validated imagestore token",
		};
	}
}

const srcToFile = async (src: string) => await fs.readFileSync(src);

const supportedMimeTypes = {
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	gif: "image/gif",
	bmp: "image/bmp",
	webp: "image/webp",
	tiff: "image/tiff",
	svg: "image/svg+xml",
	mp4: "video/mp4",
	webm: "video/webm",
	mpeg: "video/mpeg",
	avi: "video/avi",
	mov: "video/quicktime",
	wmv: "video/x-ms-wmv",
	flv: "video/x-flv",
	mkv: "video/x-matroska",
};

const generateName = (extension: string) => {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	const second = String(date.getSeconds()).padStart(2, "0");
	return `${year}-${month}-${day}.${hour}${minute}${second}.${extension}`;
};

export const config = {
	api: {
		bodyParser: false,
	},
};

/**
 * @swagger
 * /api/editorjs/imagestore:
 *   post:
 *     summary: Upload image
 *     description: Upload image to storage solution.
 *     tags:
 *       - EditorJS
 *     parameters:
 *       - in: query
 *         name: directory
 *         required: true
 *         schema:
 *           type: string
 *         description: The directory to store the image in (postId for posts).
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: New name (without extension, will be inferred).
 *     requestBody:
 *       description: MIME file
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File of type image or video to be uploaded.
 *     responses:
 *       200:
 *         description: Successfully uploaded the image/video.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The payload containing the file URL and reference.
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: uri
 *                       description: The URL to access the uploaded file.
 *                       example: https://firebasestorage.googleapis.com/v0/b/blogbymartinnilsen.appspot.com/o/image
 *                     fileRef:
 *                       type: string
 *                       description: The storage reference path of the file.
 *                       example: images/[ID]/2024-02-02.133624.png
 *                 file:
 *                   type: object
 *                   description: Metadata about the uploaded file.
 *                   properties:
 *                     size:
 *                       type: integer
 *                       description: The size of the file in bytes.
 *                       example: 185491
 *                     path:
 *                       type: string
 *                       description: The temporary path to the uploaded file.
 *                       example: /var/folders/r9/5r0c_f5s0/T/upload_932324.png
 *                     name:
 *                       type: string
 *                       description: The original name of the uploaded file.
 *                       example: tree-736885_1280.jpg
 *                     type:
 *                       type: string
 *                       description: The MIME type of the uploaded file.
 *                       example: image/jpeg
 *                     mtime:
 *                       type: string
 *                       format: date-time
 *                       description: The last modification time of the file.
 *                       example: 2024-02-02T12:36:24.981Z
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 *       501:
 *         description: Method not supported.
 *   delete:
 *     summary: Delete image
 *     description: Delete image from storage solution.
 *     tags:
 *       - EditorJS
 *     parameters:
 *       - in: query
 *         name: fileRef
 *         required: true
 *         schema:
 *           type: string
 *         description: Reference, that is, relative path inside Firebase Storage bucket.
 *     responses:
 *       200:
 *         description: Successfully deleted the image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: The HTTP status code of the response.
 *                   example: 200
 *                 response:
 *                   type: string
 *                   description: The response after deletion.
 *                   example: "Successfully deleted"
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 *       501:
 *         description: Method not supported.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = validateAuthAPIToken(req);
	const imagestoreValidation = validateImagestoreAPIToken(req);
	if (!authValidation.isValid && !imagestoreValidation.isValid) {
		return res.status(authValidation.code).json({ code: authValidation.code, reason: authValidation.reason });
	}

	if (req.method === "POST") {
		if (!req.query.directory) {
			return res.status(400).json({ code: 400, reason: "Missing directory, root should not be used!" });
		}

		try {
			const form = new formidable.IncomingForm();
			form.multiples = false;
			form.keepExtensions = true;

			form.parse(req, async (err, fields, files) => {
				if (err) {
					res.status(500).json({ success: false, error: err });
				} else {
					const file = files.file;

					// Get extension from file name
					const extensionMatch = file.name.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
					const extension = extensionMatch && extensionMatch[1].toLowerCase();
					if (!extension) return res.status(400).json({ code: 400, reason: "File missing extension!" });

					// Check for file support
					const mimeType = supportedMimeTypes[extension];
					if (!mimeType)
						// Not in supported hashmap
						res.status(400).json({ code: 400, reason: `File with extension '.${extension}' not supported!` });
					// if (mimeType !== file.type)
					// 	// Check for content type and extension match
					// 	res.status(400).json({
					// 		code: 400,
					// 		reason: `File extension '.${extension}' and content type '${file.type}' does not match!`,
					// 	});

					// Rename file, timestamp as default if not given new name
					const fileRef =
						`images/${req.query.directory}${req.query.directory && "/"}` +
						(req.query.name ? `${req.query.name}.${extension}` : generateName(extension));

					// Upload to Firestore
					let cloudStorageFileRef = ref(cloudStorage, fileRef);
					let metadata = {
						contentType: file.type,
					};
					let fileBytes = await srcToFile(file.path);
					let uploadTask = await uploadBytes(cloudStorageFileRef, fileBytes, metadata);
					const downloadURL = await getDownloadURL(uploadTask.ref);

					res.status(200).json({ data: { url: downloadURL, fileRef: fileRef }, file: file });
				}
			});
		} catch (err) {
			return res.status(500).json({ code: 500, reason: err });
		}
	} else if (req.method === "DELETE") {
		if (!req.query.fileRef) {
			return res.status(400).json({ code: 400, reason: "Missing fileRef to Firebase Storage!" });
		}

		const fileRef = ref(cloudStorage, req.query.fileRef as string);
		await deleteObject(fileRef)
			.then(() => {
				return res.status(200).json({ code: 200, response: "File successfully deleted!" });
			})
			.catch((error) => {
				return res.status(500).json({ code: 500, reason: error });
			});
	} else {
		return res.status(501).json({ code: 501, reason: "Method not supported" });
	}
}
