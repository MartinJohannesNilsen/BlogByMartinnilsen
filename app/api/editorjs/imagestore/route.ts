import { cloudStorage } from "@/lib/firebaseConfig";
import { validateAuthAPIToken, validateImagestoreAPIToken } from "@/data/middleware/tokenValidationAPI";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Helper functions and list of supported types
const srcToBuffer = async (file: File) => Buffer.from(await file.arrayBuffer());
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
 */
export async function POST(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	const imagestoreValidation = await validateImagestoreAPIToken(request);
	if (!authValidation.isValid && !imagestoreValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Get query parameters
	const name = request.nextUrl.searchParams.get("name");
	const directory = request.nextUrl.searchParams.get("directory");

	// Check if directory is missing
	if (!directory) {
		return Response.json({ code: 400, reason: "Missing directory, root should not be used!" }, { status: 400 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return Response.json({ code: 400, reason: "File is missing!" }, { status: 400 });
		}

		// Get extension from file name
		const extensionMatch = file.name.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
		const extension = extensionMatch && extensionMatch[1].toLowerCase();
		if (!extension) return Response.json({ code: 400, reason: "File missing extension!" }, { status: 400 });

		// Check for file support
		const mimeType = supportedMimeTypes[extension];
		if (!mimeType) {
			return Response.json(
				{ code: 400, reason: `File with extension '.${extension}' not supported!` },
				{ status: 400 }
			);
		}

		// Rename file, timestamp as default if not given new name
		const fileRef =
			`images/${directory}${directory && "/"}` + (name ? `${name}.${extension}` : generateName(extension));

		// Upload to Firestore
		const cloudStorageFileRef = ref(cloudStorage, fileRef);
		const metadata = {
			contentType: file.type,
		};
		const fileBuffer = await srcToBuffer(file);
		const uploadTask = await uploadBytes(cloudStorageFileRef, fileBuffer, metadata);
		const downloadURL = await getDownloadURL(uploadTask.ref);

		return Response.json(
			{ data: { url: downloadURL, fileRef: fileRef }, file: { size: file.size, name: file.name, type: file.type } },
			{ status: 200 }
		);
	} catch (err) {
		console.log(err);
		return Response.json({ code: 500, reason: err }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/editorjs/imagestore:
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
export async function DELETE(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	const imagestoreValidation = await validateImagestoreAPIToken(request);
	if (!authValidation.isValid && !imagestoreValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Get query parameters
	const fileRef = request.nextUrl.searchParams.get("fileRef");
	if (!fileRef) {
		return Response.json({ code: 400, reason: "Missing fileRef to Firebase Storage!" }, { status: 400 });
	}

	const db_fileRef = ref(cloudStorage, fileRef as string);
	await deleteObject(db_fileRef)
		.then(() => {
			return Response.json({ code: 200, response: "File successfully deleted!" }, { status: 200 });
		})
		.catch((error) => {
			return Response.json({ code: 500, reason: error }, { status: 500 });
		});
}
