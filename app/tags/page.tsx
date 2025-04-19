"use server";
import TagsPage from "@/app/tags/clientPage";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import {
	getCachedAllDescendingPostsOverview,
	getCachedPublishedDescendingPostsOverview,
	getCachedTags,
} from "@/data/cache";
import { Metadata } from "next";
import { Session } from "next-auth";
import { WebPageJsonLd } from "next-seo";

export async function generateMetadata() {
	const metadata: Metadata = {
		title: "Tags",
		description: "Navigate the full collection of posts, filtering based on their associated tag(s).",
	};
	return metadata;
}

export default async function Page() {
	// Check authentication
	const session: Session | null = process.env.NEXT_PUBLIC_LOCALHOST === "true" ? await getMockSession() : await auth();
	const isAuthorized = session?.user?.role === "admin";

	// Get tags
	const tags = await getCachedTags();

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
			<TagsPage posts={postsOverview} tags={tags} isAuthorized={isAuthorized} sessionUser={session?.user} />
		</>
	);
}
