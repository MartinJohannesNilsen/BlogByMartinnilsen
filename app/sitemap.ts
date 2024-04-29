import { MetadataRoute } from "next";
import { getCachedPublishedDescendingPostsOverview } from "../data/cache";

function _getFormatedLastmodDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getCachedPublishedDescendingPostsOverview();

	// Get largest value where you check each
	const date = new Date(Math.max(...posts.map((post) => post.updatedAt || post.createdAt), 0));
	const lastUpdated = _getFormatedLastmodDate(date);
	const now = _getFormatedLastmodDate(new Date(Date.now()));

	const links = [
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
			lastModified: lastUpdated,
		},
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/tags`,
			lastModified: lastUpdated,
		},
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/about`,
			lastModified: now,
		},
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/account`,
			lastModified: now,
		},
	];

	posts.forEach((post) => {
		links.push({
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${post.id}`,
			lastModified: _getFormatedLastmodDate(new Date(post.updatedAt || post.createdAt)),
			//   name: post.title
		});
	});

	return links;
}
