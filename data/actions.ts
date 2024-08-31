"use server";

import { revalidatePath, revalidateTag } from "next/cache";

// Revalidation
export async function revalidatePostsOverview() {
	revalidateTag("posts_overview_all");
	revalidateTag("posts_overview_published");
	revalidateTag("posts_overview_all_ids");
}
export async function revalidatePost(postId: string) {
	revalidateTag(`post_${postId}`);
}
export async function revalidateTags() {
	revalidateTag("tags");
}
export async function revalidateAll() {
	revalidatePath("/", "layout");
}
