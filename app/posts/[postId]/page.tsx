"use server";
import { unstable_cache } from "next/cache";
import { getCachedAllDescendingPostsOverview } from "../../../data/cache";
import ReadArticleView from "./clientPage";
import { getPost } from "../../../data/db/firebase/posts";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
	const posts = await getCachedAllDescendingPostsOverview();
	return posts.map((post) => ({ postId: post.id })); //TODO Fallback blocking?
}

export default async function Page({ params }: { params: { postId: string } }) {
	// const post = await getPost(params.postId);
	const getCachedPost = unstable_cache(async (postId: string) => getPost(postId), undefined, {
		tags: [`post_${params.postId}`],
	});
	const post = await getCachedPost(params.postId);

	return post ? <ReadArticleView post={post} postId={params.postId} /> : notFound();
}
