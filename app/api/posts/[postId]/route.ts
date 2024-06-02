import { revalidatePost, revalidatePostsOverview, revalidateTags } from "@/data/actions";
import { deletePostsOverview, updatePostsOverview } from "@/data/middleware/overview/overview";
import { deletePost, getPost, updatePost } from "@/data/middleware/posts/posts";
import { validateAuthAPIToken } from "@/lib/tokenValidationAPI";
import { FullPost } from "@/types";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get post with postId
 *     description: Retrieve details for post with id equal to provided postId.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *       - in: query
 *         name: parseData
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Whether to parse data field of post.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                  type string
 *                 description:
 *                  type string
 *                 createdAt:
 *                  type number
 *                 type:
 *                  type string
 *                 data:
 *                  type string
 *                 tags:
 *                  type list
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: string
 *                 author:
 *                  type string
 *                 published:
 *                  type boolean
 *                 updatedAt:
 *                  type number
 *                 readTime:
 *                  type string
 *                 ogImage:
 *                   type: object
 *                   properties:
 *                     src:
 *                       type: string
 *                     blurhash:
 *                       type: string
 *                     height:
 *                       type: number
 *                     width:
 *                       type: number
 *               example:
 *                 title: "Post title"
 *                 description: "Post description"
 *                 createdAt: 1701103064042
 *                 type: "Tutorial"
 *                 data: "{\"time\":1701472725450,\"blocks\":[],\"version\":\"2.28.2\"}"
 *                 tags: ["Development","Python"]
 *                 keywords: ["Keyword"]
 *                 author: "Martin Johannes Nilsen"
 *                 published: false
 *                 updatedAt: 1701472730348
 *                 readTime: "2 min read"
 *                 ogImage:
 *                   src: "https://example.com/og-image.png"
 *                   blurhash: "L35O{g_4s9xu~qRkofayx^ayofay"
 *                   height: 600
 *                   width: 800
 *       '404':
 *         description: Post not found.
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

	// Check if route parameter postId is provided
	const postId = params.postId;
	if (!postId || postId == "{postId}" || postId === "" || typeof postId !== "string") {
		return Response.json({ code: 400, reason: "Missing postId" }, { status: 400 });
	}

	// Get query parameters if present
	const parseData = request.nextUrl.searchParams.get("parseData");

	// Get post by id
	try {
		const post = await getPost(String(postId));
		if (!post) {
			return Response.json({ code: 404, reason: "Post not found" }, { status: 404 });
		}
		if (parseData && typeof parseData === "string" && parseData.toLowerCase() === "true") {
			return Response.json({ ...post, data: post.data }, { status: 200 });
		}
		return Response.json({ ...post, data: JSON.stringify(post.data) }, { status: 200 });
	} catch (error) {
		return Response.json({ error: error }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Update post with postId
 *     description: Update document of post with id equal to provided postId.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                type string
 *               description:
 *                type string
 *               createdAt:
 *                type number
 *               type:
 *                type string
 *               data:
 *                type string
 *               tags:
 *                type list
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *               author:
 *                type string
 *               published:
 *                type boolean
 *               updatedAt:
 *                type number
 *               readTime:
 *                type string
 *               ogImage:
 *                 type: object
 *                 properties:
 *                   src:
 *                     type: string
 *                   blurhash:
 *                     type: string
 *                   height:
 *                     type: number
 *                   width:
 *                     type: number
 *             example:
 *               title: "Post title"
 *               description: "Post description"
 *               createdAt: 1701103064042
 *               type: "Tutorial"
 *               data: "{\"time\":1701472725450,\"blocks\":[],\"version\":\"2.28.2\"}"
 *               tags: ["Development","Python"]
 *               keywords: ["Keyword"]
 *               author: "Martin Johannes Nilsen"
 *               published: false
 *               updatedAt: 1701472730348
 *               readTime: "2 min read"
 *               ogImage:
 *                 src: "https://example.com/og-image.png"
 *                 blurhash: "L35O{g_4s9xu~qRkofayx^ayofay"
 *                 height: 600
 *                 width: 800
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                  type string
 *                 description:
 *                  type string
 *                 createdAt:
 *                  type number
 *                 type:
 *                  type string
 *                 data:
 *                  type string
 *                 tags:
 *                  type list
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: string
 *                 author:
 *                  type string
 *                 published:
 *                  type boolean
 *                 updatedAt:
 *                  type number
 *                 readTime:
 *                  type string
 *                 ogImage:
 *                   type: object
 *                   properties:
 *                     src:
 *                       type: string
 *                     blurhash:
 *                       type: string
 *                     height:
 *                       type: number
 *                     width:
 *                       type: number
 *               example:
 *                 title: "Post title"
 *                 description: "Post description"
 *                 createdAt: 1701103064042
 *                 type: "Tutorial"
 *                 data: "{\"time\":1701472725450,\"blocks\":[],\"version\":\"2.28.2\"}"
 *                 tags: ["Development","Python"]
 *                 keywords: ["Keyword"]
 *                 author: "Martin Johannes Nilsen"
 *                 published: false
 *                 updatedAt: 1701472730348
 *                 readTime: "2 min read"
 *                 ogImage:
 *                   src: "https://example.com/og-image.png"
 *                   blurhash: "L35O{g_4s9xu~qRkofayx^ayofay"
 *                   height: 600
 *                   width: 800
 *       '404':
 *         description: Post not found.
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

	// Check if route parameter postId is provided
	const postId = params.postId;
	if (!postId || postId == "{postId}" || postId === "" || typeof postId !== "string") {
		return Response.json({ code: 400, reason: "Missing postId" }, { status: 400 });
	}

	// Decide which fields to change
	const { data, ...fields } = await request.json();
	if (!data && Object.keys(fields).length === 0) {
		return Response.json({ code: 400, reason: "Missing fields to update" }, { status: 200 });
	}

	// Fetch post
	const post = await getPost(String(postId));
	if (!post) {
		return Response.json({ code: 404, reason: "Post not found" }, { status: 404 });
	}

	// Check if 'data' is set to be updated and not already a string, then stringify it
	if (data !== undefined && typeof data !== "string") {
		fields.data = JSON.stringify(data);
	} else {
		fields.data = data;
	}

	// Alter post
	const updatedPost = { ...post };
	// const { image, ...updatedPost } = post;
	Object.keys(fields).map((key) => {
		if (post.hasOwnProperty(key)) {
			updatedPost[key] = fields[key];
		} else {
			return Response.json(
				{
					code: 400,
					reason: `Field '${key}' does not exist in stored post`,
				},
				{ status: 400 }
			);
		}
		updatedPost[key] = fields[key];
	});

	// Update post
	const postWasUpdated = await updatePost(postId, updatedPost, false);
	if (postWasUpdated) {
		// Create post without data
		const { data, ...postsOverviewPost } = updatedPost;
		// Update postsOverview
		const overviewWasUpdated = await updatePostsOverview({
			...postsOverviewPost,
			id: postId,
		});
		// Return the updated post
		if (overviewWasUpdated) {
			const updatedPost = await getPost(String(postId))
				.then((data) => {
					return { ...data, data: JSON.stringify(data?.data) };
				})
				.catch(() => {
					return Response.json({ code: 500, reason: "Retrieval of updated post failed" }, { status: 500 });
				});
			return Response.json(updatedPost, { status: 200 });
		} else {
			return Response.json({ code: 500, reason: "Update of overview failed" }, { status: 500 });
		}
	} else {
		return Response.json({ code: 500, reason: "Update of post failed" }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete post with postId
 *     description: Delete specific post with id equal to provided postId.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *       - in: query
 *         name: revalidateCache
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Whether to revalidate cache upon deletion.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/plain:
 *             example:
 *              "Successfully deleted post '7FPz85Fkv8sHN3aAIx0r' without revalidating pages"
 *       '404':
 *         description: Post not found.
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

	// Check if route parameter postId is provided
	const postId = params.postId;
	if (!postId || postId == "{postId}" || postId === "" || typeof postId !== "string") {
		return Response.json({ code: 400, reason: "Missing postId" }, { status: 400 });
	}

	// Get query parameters if present
	const revalidateCacheAfterDeleting = request.nextUrl.searchParams.get("revalidateCache");

	// Fetch post
	const post = await getPost(String(postId));
	if (!post) {
		return Response.json({ code: 404, reason: "Post not found" }, { status: 404 });
	}

	// Delete post
	const postWasDeleted = await deletePost(postId);
	if (postWasDeleted) {
		const overviewWasUpdated = await deletePostsOverview(postId);
		if (overviewWasUpdated) {
			if (
				revalidateCacheAfterDeleting &&
				typeof revalidateCacheAfterDeleting === "string" &&
				revalidateCacheAfterDeleting.toLowerCase() === "true"
			) {
				try {
					await revalidatePost(postId);
					await revalidatePostsOverview();
					await revalidateTags();
					return Response.json(
						{
							code: 200,
							reason: "Successfully deleted post '" + postId + "' and revalidated the cache",
						},
						{ status: 200 }
					);
				} catch (err) {
					// If there was an error, Next.js will continue to show the last successfully generated page
					return Response.json({ code: 500, reason: "Error during revalidation" }, { status: 500 });
				}
			} else {
				return Response.json(
					{
						code: 200,
						reason: "Successfully deleted post '" + postId + "' without cache revalidation",
					},
					{ status: 200 }
				);
			}
		} else {
			return Response.json(
				{
					code: 500,
					reason: "Did not manage to delete from overview",
				},
				{ status: 500 }
			);
		}
	} else {
		return Response.json(
			{
				code: 500,
				reason: "Did not manage to delete from posts",
			},
			{ status: 500 }
		);
	}
}
