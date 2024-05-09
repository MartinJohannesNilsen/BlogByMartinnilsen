"use server";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import { Metadata } from "next";
import { Session } from "next-auth";
import { getCachedAllDescendingPostsOverview, getCachedPublishedDescendingPostsOverview } from "../../data/cache";
import AboutPage from "./clientPage";

export async function generateMetadata({ params, searchParams }) {
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
