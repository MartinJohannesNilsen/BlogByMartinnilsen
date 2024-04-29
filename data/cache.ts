"use server";
import { unstable_cache } from "next/cache";
import { getAllPostIds, getPostsOverview } from "./db/firebase/overview";
import { getPost } from "./db/firebase/posts";
import { getTags } from "./db/firebase/tags";

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

// Cache post by id
export const getCachedPost = (postId: string) => {
	return unstable_cache(async () => getPost(postId), [], { tags: [postId] });
};

// Cache tags
export const getCachedTags = unstable_cache(async () => getTags(), [], { tags: ["tags"] });
