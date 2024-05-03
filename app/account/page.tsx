"use server";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getCachedAllDescendingPostsOverview, getCachedPublishedDescendingPostsOverview } from "../../data/cache";
import Account from "./clientPage";

export async function generateMetadata({ params, searchParams }) {
	const metadata: Metadata = {
		title: "Account",
	};
	return metadata;
}

export default async function Page() {
	// Check authentication
	const session = await getServerSession();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.email === process.env.ADMIN_EMAIL;

	// Get postOverview
	const postOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	if (!isAuthorized && (!session || !session.user)) redirect("/api/auth/signin");
	return <Account postOverview={postOverview} sessionUser={session?.user} isAuthorized={isAuthorized} />;
}
