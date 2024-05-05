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
	const session: any = await getServerSession();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.role === "admin";

	// Get postsOverview
	const postsOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	if (!isAuthorized && (!session || !session.user)) redirect("/api/auth/signin");
	return (
		<>
			<h1>{session}</h1>
			<Account postsOverview={postsOverview} sessionUser={session?.user} isAuthorized={isAuthorized} />
		</>
	);
}
