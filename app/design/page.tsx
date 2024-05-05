"use server";
import { getServerSession } from "next-auth";
import { getCachedAllDescendingPostsOverview, getCachedPublishedDescendingPostsOverview } from "../../data/cache";
import DesignPage from "./clientPage";

export default async function Page() {
	// Check authentication
	const session: any = await getServerSession();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.role === "admin";

	// Get postsOverview
	const postsOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	return <DesignPage postsOverview={postsOverview} sessionUser={session?.user} isAuthorized={isAuthorized} />;
}
