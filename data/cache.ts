"use server";
import { getPostsOverview } from "@/data/db/overview";
import { getTags } from "@/data/db/tags";
import { unstable_cache } from "next/cache";

// Cache overview of posts with only published posts
export const getCachedPublishedDescendingPostsOverview = unstable_cache(
	async () => getPostsOverview("desc", true),
	[],
	{ tags: ["posts_overview_published"] }
);

// Cache overview of posts with all posts
export const getCachedAllDescendingPostsOverview = unstable_cache(async () => getPostsOverview("desc", false), [], {
	tags: ["posts_overview_all"],
});

// Cache postids
export const getCachedAllPostIds = unstable_cache(
	async () => getCachedAllDescendingPostsOverview().then((posts) => posts.map((post) => post.id)),
	[],
	{
		tags: ["posts_overview_all_ids"],
	}
);

// Cache tags
export const getCachedTags = unstable_cache(async () => getTags(), [], { tags: ["tags"] });
