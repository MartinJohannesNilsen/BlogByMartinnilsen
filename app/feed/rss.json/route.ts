import { getCachedPublishedDescendingPostsOverview } from "../../../data/cache";
import { generateFeed } from "../../../utils/generateFeed";

export async function GET() {
	const posts = await getCachedPublishedDescendingPostsOverview();
	return new Response(generateFeed(posts).json1(), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
	});
}
