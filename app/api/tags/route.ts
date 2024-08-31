import { getTags, addTag, renameTag, deleteTag } from "@/data/middleware/tags/actions";
import { validateAuthAPIToken } from "@/data/middleware/tokenValidationAPI";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     description: Get all available tags.
 *     tags:
 *       - Tags
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
		return Response.json({ code: 500, reason: error }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Add a new tag
 *     description: Add a new tag.
 *     tags:
 *       - Tags
 *     parameters:
 *       - name: tag
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tag added successfully.
 *       '400':
 *         description: Bad request.
 *       '500':
 *         description: Internal Server Error.
 */
export async function POST(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Add a new tag
	try {
		const { searchParams } = new URL(request.url);
		const tag = searchParams.get("tag");
		if (!tag) return new Response("Tag is required", { status: 400 });
		const result = await addTag(tag);
		if (!result) return new Response("Tag already exists or could not be added", { status: 400 });
		return new Response("Tag added successfully", { status: 200 });
	} catch (error) {
		return Response.json({ code: 500, reason: error }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/tags:
 *   put:
 *     summary: Rename an existing tag
 *     description: Rename an existing tag.
 *     tags:
 *       - Tags
 *     parameters:
 *       - name: oldTag
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: newTag
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tag renamed successfully.
 *       '400':
 *         description: Bad request.
 *       '500':
 *         description: Internal Server Error.
 */
export async function PUT(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Rename a tag
	try {
		const { searchParams } = new URL(request.url);
		const oldTag = searchParams.get("oldTag");
		const newTag = searchParams.get("newTag");
		if (!oldTag || !newTag) return new Response("Old tag and new tag are required", { status: 400 });
		const result = await renameTag(oldTag, newTag);
		if (!result) return new Response("Tag could not be renamed", { status: 400 });
		return new Response("Tag renamed successfully", { status: 200 });
	} catch (error) {
		return Response.json({ code: 500, reason: error }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/tags:
 *   delete:
 *     summary: Delete an existing tag
 *     description: Delete an existing tag.
 *     tags:
 *       - Tags
 *     parameters:
 *       - name: tag
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tag deleted successfully.
 *       '400':
 *         description: Bad request.
 *       '500':
 *         description: Internal Server Error.
 */
export async function DELETE(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Delete a tag
	try {
		const { searchParams } = new URL(request.url);
		const tag = searchParams.get("tag");
		if (!tag) return new Response("Tag is required", { status: 400 });
		const result = await deleteTag(tag);
		if (!result) return new Response("Tag could not be deleted", { status: 400 });
		return new Response("Tag deleted successfully", { status: 200 });
	} catch (error) {
		return Response.json({ code: 500, reason: error }, { status: 500 });
	}
}
