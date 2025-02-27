import { deleteFile, uploadFile } from "@/data/middleware/media/fileStore/actions";
import { validateAuthAPIToken } from "@/data/middleware/tokenValidationAPI";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/media/filestore:
 *   post:
 *     summary: Upload file
 *     description: Upload file to storage.
 *     tags:
 *       - Media
 *     parameters:
 *       - in: query
 *         name: directory
 *         required: true
 *         schema:
 *           type: string
 *         description: The directory to store the file in (e.g., postId for posts).
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: New file name (without extension, will be inferred).
 *     requestBody:
 *       description: File upload
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to be uploaded.
 *     responses:
 *       200:
 *         description: Successfully uploaded the file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The file metadata.
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: uri
 *                       description: URL for accessing the file.
 *                       example: https://example.com/files/sample.pdf
 *                     fileRef:
 *                       type: string
 *                       description: Storage reference path for the file.
 *                       example: files/[ID]/2024-02-02.133624.pdf
 *                 file:
 *                   type: object
 *                   description: Metadata about the file.
 *                   properties:
 *                     size:
 *                       type: integer
 *                       description: File size in bytes.
 *                       example: 204800
 *                     path:
 *                       type: string
 *                       description: Temporary file path.
 *                       example: /tmp/upload_12345.pdf
 *                     name:
 *                       type: string
 *                       description: Original file name.
 *                       example: sample.pdf
 *                     type:
 *                       type: string
 *                       description: MIME type.
 *                       example: application/pdf
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
export async function POST(request: NextRequest) {
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	const name = request.nextUrl.searchParams.get("name");
	const directory = request.nextUrl.searchParams.get("directory");

	if (!directory) {
		return Response.json({ code: 400, reason: "Missing directory!" }, { status: 400 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return Response.json({ code: 400, reason: "File is missing!" }, { status: 400 });
		}
		const result = await uploadFile(file, directory, name);
		return Response.json(result, { status: result.code });
	} catch (err) {
		console.log(err);
		return Response.json({ code: 500, reason: err.message }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/media/filestore:
 *   delete:
 *     summary: Delete file
 *     description: Delete file from storage.
 *     tags:
 *       - Media
 *     parameters:
 *       - in: query
 *         name: fileRef
 *         required: true
 *         schema:
 *           type: string
 *         description: File reference path inside storage.
 *     responses:
 *       200:
 *         description: Successfully deleted the file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 200
 *                 response:
 *                   type: string
 *                   description: Deletion message.
 *                   example: "File successfully deleted."
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
export async function DELETE(request: NextRequest) {
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	const fileRef = request.nextUrl.searchParams.get("fileRef");
	if (!fileRef) {
		return Response.json({ code: 400, reason: "Missing fileRef!" }, { status: 400 });
	}

	try {
		const result = await deleteFile(fileRef);
		return Response.json(result, { status: result.code });
	} catch (err) {
		return Response.json({ code: 500, reason: err.message }, { status: 500 });
	}
}
