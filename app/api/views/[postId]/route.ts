import { deleteViewCount, getViewCount, incrementViewCount, setViewCount } from "@/data/middleware/views/actions";
import { validateAuthAPIToken } from "@/data/middleware/tokenValidationAPI";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/views/{postId}:
 *   get:
 *     summary: Get view counts of post
 *     description: Fetches view counts of post with id equal to parameter 'postId'.
 *     tags:
 *       - Views
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *          application/json:
 *           example:
 *            [postId]: 1
 *       '404':
 *         description: View count not found.
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 */
export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Check if postId is provided
	const postId = params.postId;
	if (!postId || postId == "{postId}" || postId == "," || postId === "" || typeof postId !== "string") {
		return Response.json({ code: 400, reason: "Missing postId" }, { status: 400 });
	}

	// Get the view count from the database
	try {
		const viewCount = await getViewCount(postId);
		if (viewCount === 0) {
			return Response.json({ code: 404, reason: "View count not found" }, { status: 404 });
		}
		return Response.json({ [postId]: viewCount }, { status: 200 });
	} catch (error) {
		return Response.json({ code: 500, reason: error.message }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/views/{postId}:
 *   post:
 *     summary: Increment or insert view count of post
 *     description: Registers a new visitor on post with id equal to parameter 'postId'.
 *     tags:
 *       - Views
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *          application/json:
 *           example:
 *            [postId]: 1
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 */
export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Check if postId is provided
	const postId = params.postId;
	if (!postId || postId == "{postId}" || postId == "," || postId === "" || typeof postId !== "string") {
		return Response.json({ code: 400, reason: "Missing postId" }, { status: 400 });
	}

	// Increment the view count
	try {
		await incrementViewCount(postId);
		const viewCount = await getViewCount(postId);
		return Response.json({ [postId]: viewCount }, { status: 200 });
	} catch (error) {
		return Response.json({ code: 500, reason: error.message }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/views/{postId}:
 *   put:
 *     summary: Update view count of post
 *     description: Set new view count on post with id equal to parameter 'postId'.
 *     tags:
 *       - Views
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *       - name: viewCount
 *         in: query
 *         description: The new view count value.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *          application/json:
 *           example:
 *            [postId]: 1
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 */
export async function PUT(request: NextRequest, { params }: { params: { postId: string } }) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Check if postId is provided
	const postId = params.postId;
	if (!postId || postId == "{postId}" || postId == "," || postId === "" || typeof postId !== "string") {
		return Response.json({ code: 400, reason: "Missing postId" }, { status: 400 });
	}

	// Check if viewCount is provided as query param
	const viewCount = request.nextUrl.searchParams.get("viewCount");
	if (!viewCount) {
		return Response.json({ code: 400, reason: "Missing view count" }, { status: 400 });
	}

	// Update view count for post with postId
	try {
		await setViewCount(postId, parseInt(viewCount, 10));
		const newViewCount = await getViewCount(postId);
		return Response.json({ [postId]: newViewCount }, { status: 200 });
	} catch (error) {
		return Response.json({ code: 500, reason: error.message }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/views/{postId}:
 *   delete:
 *     summary: Delete view count of post
 *     description: Delete view count for post with id equal to parameter 'postId'.
 *     tags:
 *       - Views
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *     responses:
 *       '200':
 *         description: Successful response.
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 */
export async function DELETE(request: NextRequest, { params }: { params: { postId: string } }) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Check if postId is provided
	const postId = params.postId;
	if (!postId || postId == "{postId}" || postId == "," || postId === "" || typeof postId !== "string") {
		return Response.json({ code: 400, reason: "Missing postId" }, { status: 400 });
	}

	// Delete view count for post with postId
	try {
		const result = await deleteViewCount(postId);
		if (!result) {
			return Response.json({ code: 500, reason: "View count not found" }, { status: 500 });
		}
		return new Response("Success", { status: 200 });
	} catch (error) {
		return Response.json({ code: 500, reason: error.message }, { status: 500 });
	}
}
