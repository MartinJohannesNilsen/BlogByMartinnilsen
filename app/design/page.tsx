"use server";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import { Session } from "next-auth";
import { getCachedAllDescendingPostsOverview, getCachedPublishedDescendingPostsOverview } from "../../data/cache";
import DesignPage from "./clientPage";

export default async function Page() {
	// Check authentication
	const session: Session | null = process.env.NEXT_PUBLIC_LOCALHOST === "true" ? await getMockSession() : await auth();
	const isAuthorized = session?.user?.role === "admin";

	// Get postsOverview
	const postsOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	return <DesignPage postsOverview={postsOverview} sessionUser={session?.user} isAuthorized={isAuthorized} />;
}
