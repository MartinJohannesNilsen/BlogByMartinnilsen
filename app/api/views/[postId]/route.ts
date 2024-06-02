import { SupabaseAdmin } from "@/lib/supabaseAdmin";
import { validateAuthAPIToken } from "@/lib/tokenValidationAPI";
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
 *            viewCount: 1
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

	// Query the pages table in the database where slug equals the request params slug.
	const { data } = await SupabaseAdmin.from("views").select("viewCount").filter("postId", "eq", params.postId);
	// Return
	// if (!data) return res.status(404).json({ code: 500, reason: "View count not found" });
	if (!data) return Response.json({ code: 500, reason: "View count not found" }, { status: 500 });
	return data.length === 1
		? Response.json(
				{
					viewCount: data[0]?.viewCount || null,
				},
				{ status: 200 }
		  )
		: Response.json({ code: 500, reason: "Multiple view counts found, should be unique" }, { status: 500 });
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
	if (
		!params.postId ||
		params.postId == "{postId}" ||
		params.postId == "," ||
		params.postId === "" ||
		typeof params.postId !== "string"
	) {
		return Response.json({ code: 400, reason: "Missing postId" }, { status: 400 });
	}

	// Call our stored procedure with the postId set by the request params slug
	const db_res = await SupabaseAdmin.rpc("increment_post_view_count", {
		input_id: params.postId,
	});

	// Return response
	if (db_res.status === 204) return new Response("Success", { status: 200 }); // 204 not supported
	return Response.json({ code: db_res.status, reason: db_res.statusText }, { status: db_res.status });
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
 *       '204':
 *         description: Successful response.
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
	if (
		!params.postId ||
		params.postId == "{postId}" ||
		params.postId == "," ||
		params.postId === "" ||
		typeof params.postId !== "string"
	) {
		return Response.json({ code: 400, reason: "Missing postId" }, { status: 400 });
	}

	// Check if viewCount is provided as query param
	const viewCount = request.nextUrl.searchParams.get("viewCount");
	if (!viewCount) {
		return Response.json({ code: 400, reason: "Missing view count" }, { status: 400 });
	}
	// Update view count for post with postId
	const { error } = await SupabaseAdmin.from("views")
		.update({ viewCount: viewCount })
		.eq("postId", params.postId)
		.single();
	return error
		? Response.json(
				{
					code: 400,
					reason: `Could not update view count for post '${params.postId}'`,
				},
				{ status: 400 }
		  )
		: Response.json(
				{
					code: 200,
					reason: `Updated view count of post '${params.postId}' to ${viewCount}`,
				},
				{ status: 200 }
		  );
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
 *       '204':
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
	if (
		!params.postId ||
		params.postId == "{postId}" ||
		params.postId == "," ||
		params.postId === "" ||
		typeof params.postId !== "string"
	) {
		return Response.json({ code: 400, reason: "Missing postId" }, { status: 400 });
	}

	// Delete row where postId equal query parameter postId
	const { error } = await SupabaseAdmin.from("views").delete().eq("postId", params.postId).single();
	return error
		? Response.json(
				{
					code: 400,
					reason: `Could not delete view count of post '${params.postId}'`,
				},
				{ status: 400 }
		  )
		: Response.json(
				{
					code: 200,
					reason: `Deleted view count of post '${params.postId}'`,
				},
				{ status: 200 }
		  );
}
