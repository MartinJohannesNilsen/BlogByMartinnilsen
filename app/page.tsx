"use server";
import { auth } from "@/auth";
import { getCachedAllDescendingPostsOverview, getCachedPublishedDescendingPostsOverview } from "../data/cache";
import LandingPage from "./clientPage";

export default async function Page() {
	// Check authentication
	const session: any = await auth();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.role === "admin";

	// Get postsOverview
	const postsOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	return <LandingPage postsOverview={postsOverview} sessionUser={session?.user} isAuthorized={isAuthorized} />;
}
