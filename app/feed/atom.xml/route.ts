import { getCachedPublishedDescendingPostsOverview } from "../../../data/cache";
import { generateFeed } from "../rss.xml/route";

export async function GET() {
	const posts = await getCachedPublishedDescendingPostsOverview();
	return new Response(generateFeed(posts).json1(), {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
		},
	});
}
