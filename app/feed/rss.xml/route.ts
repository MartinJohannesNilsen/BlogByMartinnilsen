import { getCachedPublishedDescendingPostsOverview } from "../../../data/cache";
import { generateFeed } from "../../../utils/generateFeed";

export async function GET() {
	const posts = await getCachedPublishedDescendingPostsOverview();
	return new Response(generateFeed(posts).rss2(), {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
		},
	});
}
