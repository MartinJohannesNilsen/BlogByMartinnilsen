import { Feed } from "feed";
import { DATA_DEFAULTS } from "../data/metadata";
import { StoredPost } from "../types";

export function generateFeed(posts: StoredPost[]) {
	// Create feed
	const feed = new Feed({
		title: `${DATA_DEFAULTS.title} | RSS`,
		author: DATA_DEFAULTS.author,
		description: DATA_DEFAULTS.description,
		id: DATA_DEFAULTS.url,
		link: DATA_DEFAULTS.url,
		image: DATA_DEFAULTS.images.openGraph,
		favicon: DATA_DEFAULTS.images.favicon, // `${DATA_DEFAULTS.url}/favicon.ico`
		copyright: `All rights reserved ${new Date().getFullYear()}, Martin Johannes Nilsen`,
		language: "en",
		generator: "Feed for Node.js",
		feedLinks: {
			rss: `${DATA_DEFAULTS.url}/feed/rss.xml`,
			json: `${DATA_DEFAULTS.url}/feed/rss.json`,
			atom: `${DATA_DEFAULTS.url}/feed/atom.xml`,
		},
		updated: new Date(Math.max(...posts.map((post) => post.updatedAt || post.createdAt), 0)),
	});

	posts.forEach((post) => {
		feed.addItem({
			title: post.title,
			id: post.id,
			link: `${DATA_DEFAULTS.url}/posts/${post.id}`,
			description: post.description,
			author: [DATA_DEFAULTS.author],
			date: post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt),
			published: new Date(post.createdAt),
			image: `${encodeURI(post.ogImage.src).replace("&", "&amp;")}`,
			// content: ` • ${post.readTime}`,
		});
	});

	return feed;
}
