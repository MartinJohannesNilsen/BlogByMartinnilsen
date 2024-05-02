"use server";
import { getServerSession } from "next-auth";
import {
	getCachedAllDescendingPostsOverview,
	getCachedPublishedDescendingPostsOverview,
	getCachedTags,
} from "../../data/cache";
import TagsPage from "./clientPage";

export default async function Page() {
	// Get tags
	const tags = await getCachedTags();

	// Check authentication
	const session = await getServerSession();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.email === process.env.ADMIN_EMAIL;

	// Get postOverview
	const postOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	return <TagsPage posts={postOverview} tags={tags} isAuthorized={isAuthorized} />;
}
