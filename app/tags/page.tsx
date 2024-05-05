"use server";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import {
	getCachedAllDescendingPostsOverview,
	getCachedPublishedDescendingPostsOverview,
	getCachedTags,
} from "../../data/cache";
import TagsPage from "./clientPage";

export async function generateMetadata({ params }: { params: { tag: string } }) {
	const metadata: Metadata = {
		title: "Tags",
		description: "Navigate the full collection of posts, filtering based on their associated tag(s).",
	};
	return metadata;
}

export default async function Page() {
	// Get tags
	const tags = await getCachedTags();

	// Check authentication
	const session: any = await getServerSession();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.role === "admin";

	// Get postsOverview
	const postsOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	return <TagsPage posts={postsOverview} tags={tags} isAuthorized={isAuthorized} />;
}
