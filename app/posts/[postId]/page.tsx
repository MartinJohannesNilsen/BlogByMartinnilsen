"use server";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { getCachedAllDescendingPostsOverview, getCachedPublishedDescendingPostsOverview } from "../../../data/cache";
import { getPost } from "../../../data/db/firebase/posts";
import ReadArticleView from "./clientPage";

export async function generateStaticParams() {
	const posts = await getCachedAllDescendingPostsOverview();
	return posts.map((post) => ({ postId: post.id }));
}

export default async function Page({ params }: { params: { postId: string } }) {
	// Get post
	const getCachedPost = unstable_cache(async (postId: string) => getPost(postId), undefined, {
		tags: [`post_${params.postId}`],
	});
	const post = await getCachedPost(params.postId);

	// Check authentication
	const session = await getServerSession();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.email === process.env.ADMIN_EMAIL;

	// Get postOverview
	const postOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	if (!post) return notFound();
	else if (!post.published && !isAuthorized) redirect("/api/auth/signin");
	return <ReadArticleView post={post} postId={params.postId} postOverview={postOverview} isAuthorized={isAuthorized} />;
}
