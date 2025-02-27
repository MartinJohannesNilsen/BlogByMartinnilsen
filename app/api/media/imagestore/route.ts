// "@/app/api/media/imagestore/route.ts"
import { deleteImage, uploadImage } from "@/data/middleware/media/imageStore/actions";
import { validateAuthAPIToken, validateImagedetailsAPIToken } from "@/data/middleware/tokenValidationAPI";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/media/imagestore:
 *   post:
 *     summary: Upload image
 *     description: Upload image to storage solution.
 *     tags:
 *       - Media
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
	const authValidation = await validateAuthAPIToken(request);
	const imagestoreValidation = await validateImagedetailsAPIToken(request);
	if (!authValidation.isValid && !imagestoreValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	const name = request.nextUrl.searchParams.get("name");
	const directory = request.nextUrl.searchParams.get("directory");

	if (!directory) {
		return Response.json({ code: 400, reason: "Missing directory, root should not be used!" }, { status: 400 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return Response.json({ code: 400, reason: "File is missing!" }, { status: 400 });
		}
		const result = await uploadImage(file, directory, name);
		return Response.json(result, { status: result.code });
	} catch (err) {
		console.log(err);
		return Response.json({ code: 500, reason: err.message }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/media/imagestore:
 *   delete:
 *     summary: Delete image
 *     description: Delete image from storage solution.
 *     tags:
 *       - Media
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
	const authValidation = await validateAuthAPIToken(request);
	const imagestoreValidation = await validateImagedetailsAPIToken(request);
	if (!authValidation.isValid && !imagestoreValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	const fileRef = request.nextUrl.searchParams.get("fileRef");
	if (!fileRef) {
		return Response.json({ code: 400, reason: "Missing fileRef to Firebase Storage!" }, { status: 400 });
	}

	try {
		const result = await deleteImage(fileRef);
		return Response.json(result, { status: result.code });
	} catch (err) {
		return Response.json({ code: 500, reason: err.message }, { status: 500 });
	}
}
