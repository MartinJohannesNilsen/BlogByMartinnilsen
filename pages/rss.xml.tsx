import { Feed } from "feed";
import { StoredPost } from "../types";
import { DATA_DEFAULTS } from "../components/SEO/SEO";

function generateRSSFeed(posts: StoredPost[]) {
	// Create feed
	const feed = new Feed({
		title: `${DATA_DEFAULTS.title} | RSS`,
		author: DATA_DEFAULTS.author,
		description: DATA_DEFAULTS.description,
		id: DATA_DEFAULTS.url,
		link: DATA_DEFAULTS.url,
		image: DATA_DEFAULTS.ogImage,
		favicon: DATA_DEFAULTS.icon, // `${DATA_DEFAULTS.url}/favicon.ico`
		copyright: DATA_DEFAULTS.copyright,
		language: "en",
		generator: "Feed for Node.js",
		feedLinks: {
			rss2: `${DATA_DEFAULTS.url}/rss.xml`,
			// json: "https://example.com/rss.json",
			// atom: "https://example.com/atom"
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
			date: new Date(post.updatedAt),
			published: new Date(post.createdAt),
			image: `${encodeURI(post.ogImage.src).replace("&", "&amp;")}`,
			// content: ` • ${post.readTime}`,
		});
	});

	return feed.rss2();
}

function RSSFeed() {
	// getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
	// We make an API call to gather the URLs for our site
	const request = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/overview", {
		method: "GET",
		headers: {
			apikey: process.env.NEXT_PUBLIC_API_AUTHORIZATION_TOKEN,
		},
	});
	const posts: StoredPost[] = await request.json();

	// We generate the XML rss feed with the posts data
	const rss = generateRSSFeed(posts.filter((post) => post.published).sort((a, b) => b.createdAt - a.createdAt)); // Sorted reverse chronologically, newest first

	res.setHeader("Content-Type", "text/xml");
	res.write(rss);
	res.end();

	return {
		props: {},
	};
}

export default RSSFeed;
