"use server";
import { getCachedAllDescendingPostsOverview, getCachedTags } from "../../data/cache";
import { Metadata } from "next";
import { defaultMetadata } from "../../data/metadata";
import TagsPage from "./clientPage";

// export const metadata: Metadata = {
// 	...defaultMetadata,
// 	title: "Tags",
// };

export default async function Page() {
	const posts = await getCachedAllDescendingPostsOverview();
	const tags = await getCachedTags();

	return <TagsPage posts={posts} tags={tags} />;
}
