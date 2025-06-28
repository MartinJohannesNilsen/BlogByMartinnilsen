"use server";
import AboutPage from "@/app/about/clientPage";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import { getCachedAllDescendingPostsOverview, getCachedPublishedDescendingPostsOverview } from "@/data/cache";
import { Metadata } from "next";
import { Session } from "next-auth";

export async function generateMetadata() {
	const metadata: Metadata = {
		title: "About",
	};
	return metadata;
}

export default async function Page() {
	// Check authentication
	const session: Session | null = process.env.NEXT_PUBLIC_LOCALHOST === "true" ? await getMockSession() : await auth();
	const isAuthorized = session?.user?.role === "admin";

	// Get postsOverview
	const postsOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	return <AboutPage postsOverview={postsOverview} sessionUser={session?.user} isAuthorized={isAuthorized} />;
}
