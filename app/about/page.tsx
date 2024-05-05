"use server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getCachedAllDescendingPostsOverview, getCachedPublishedDescendingPostsOverview } from "../../data/cache";
import AboutPage from "./clientPage";
import { Metadata } from "next";

export async function generateMetadata({ params, searchParams }) {
	const metadata: Metadata = {
		title: "About",
	};
	return metadata;
}

export default async function Page() {
	// Check authentication
	const session: any = await getServerSession();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.role === "admin";

	// Get postsOverview
	const postsOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	return <AboutPage postsOverview={postsOverview} sessionUser={session?.user} isAuthorized={isAuthorized} />;
}
