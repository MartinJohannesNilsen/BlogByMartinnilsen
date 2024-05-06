"use server";
import { auth } from "@/auth";
import { Metadata } from "next";
import { WebPageJsonLd } from "next-seo";
import {
	getCachedAllDescendingPostsOverview,
	getCachedPublishedDescendingPostsOverview,
	getCachedTags,
} from "../../data/cache";
import TagsPage from "./clientPage";

export async function generateMetadata({ params }: { params: { tag: string } }) {
	const metadata: Metadata = {
		title: "Tags",
		description: "Navigate the full collection of posts, filtering based on their associated tag(s).",
	};
	return metadata;
}

export default async function Page() {
	// Get tags
	const tags = await getCachedTags();

	// Check authentication
	const session: any = await auth();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.role === "admin";

	// Get postsOverview
	const postsOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	return (
		<>
			<WebPageJsonLd
				useAppDir={true}
				description="Navigate the full collection of posts, filtering based on their associated tag(s)."
				id={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/tags`}
				lastReviewed={new Date(
					Math.max(...postsOverview.map((post) => post.updatedAt || post.createdAt), 0)
				).toISOString()}
				reviewedBy={{
					type: "Person",
					name: "Martin Johannes Nilsen",
				}}
			/>
			<TagsPage posts={postsOverview} tags={tags} isAuthorized={isAuthorized} />
		</>
	);
}
