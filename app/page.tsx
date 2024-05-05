"use server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getCachedAllDescendingPostsOverview, getCachedPublishedDescendingPostsOverview } from "../data/cache";
import LandingPage from "./clientPage";

export default async function Page() {
	// Check authentication
	const session = await getServerSession();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.email === process.env.ADMIN_EMAIL;

	// Get postsOverview
	const postsOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	if (!isAuthorized && (!session || !session.user)) redirect("/api/auth/signin");
	return <LandingPage postsOverview={postsOverview} sessionUser={session?.user} isAuthorized={isAuthorized} />;
}
