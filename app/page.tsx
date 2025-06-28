"use server";
import LandingPage from "@/app/clientPage";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import {
	getCachedAllDescendingPostsOverview,
	getCachedPublishedDescendingPostsOverview,
	getCachedTags,
} from "@/data/cache";
import { Session } from "next-auth";

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
		<LandingPage postsOverview={postsOverview} tags={tags} sessionUser={session?.user} isAuthorized={isAuthorized} />
	);
}
