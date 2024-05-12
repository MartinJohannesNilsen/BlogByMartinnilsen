import { getCachedPublishedDescendingPostsOverview } from "@/data/cache";
import { StoredPost } from "@/types";

function _getFormatedLastmodDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function generateSitemap(posts: StoredPost[]) {
	const date = new Date(Math.max(...posts.map((post) => post.updatedAt || post.createdAt), 0));
	const lastUpdated = _getFormatedLastmodDate(date);
	const now = _getFormatedLastmodDate(new Date(Date.now()));
	const links = [
		// Landing Page
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
			lastModified: lastUpdated,
		},
		// About Page
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/about`,
			lastModified: now,
		},
		// Account Page
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/account`,
			lastModified: now,
		},
		// API
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api`,
			lastModified: now,
		},
		// API Documentation Page
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/apidoc`,
			lastModified: now,
		},
		// Design Page
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/design`,
			lastModified: now,
		},
		// Tags Page
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/tags`,
			lastModified: lastUpdated,
		},
	];
	// Post Page for each specific post
	posts.forEach((post) => {
		links.push({
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${post.id}`,
			lastModified: _getFormatedLastmodDate(new Date(post.updatedAt || post.createdAt)),
			//   name: post.title
		});
	});

	// Sitemap as string
	const sitemap = `<?xml version="1.0" encoding="UTF-8" ?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${links
		.map((link) => `<url><loc>${link.url}</loc><lastmod>${link.lastModified}</lastmod></url>`)
		.join("")}</urlset>`;

	return sitemap;
}

export async function GET() {
	const posts = await getCachedPublishedDescendingPostsOverview();
	return new Response(generateSitemap(posts), {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
export const revalidate = 1;

// sitemap.ts
// Revalidation problems, as mentioned in https://github.com/vercel/next.js/discussions/50419

// import { MetadataRoute } from "next";
// import { getCachedPublishedDescendingPostsOverview } from "@/data/cache";

// function _getFormatedLastmodDate(date: Date) {
// 	const year = date.getFullYear();
// 	const month = String(date.getMonth() + 1).padStart(2, "0");
// 	const day = String(date.getDate()).padStart(2, "0");
// 	return `${year}-${month}-${day}`;
// }

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
// 	const posts = await getCachedPublishedDescendingPostsOverview();

// 	// Get largest value where you check each
// 	const date = new Date(Math.max(...posts.map((post) => post.updatedAt || post.createdAt), 0));
// 	const lastUpdated = _getFormatedLastmodDate(date);
// 	const now = _getFormatedLastmodDate(new Date(Date.now()));

// 	const links = [
// 		{
// 			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
// 			lastModified: lastUpdated,
// 		},
// 		{
// 			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/about`,
// 			lastModified: now,
// 		},
// 		{
// 			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/account`,
// 			lastModified: now,
// 		},
// 		{
// 			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api`,
// 			lastModified: now,
// 		},
// 		{
// 			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/apidoc`,
// 			lastModified: now,
// 		},
// 		{
// 			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/design`,
// 			lastModified: now,
// 		},
// 		{
// 			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/tags`,
// 			lastModified: lastUpdated,
// 		},
// 	];

// 	posts.forEach((post) => {
// 		links.push({
// 			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${post.id}`,
// 			lastModified: _getFormatedLastmodDate(new Date(post.updatedAt || post.createdAt)),
// 			//   name: post.title
// 		});
// 	});

// 	return links;
// }
