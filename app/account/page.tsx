"use server";
import { auth } from "@/auth";
import { Metadata } from "next";
import { signIn } from "next-auth/react";
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
	const session: any = await auth();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.role === "admin";

	// Get postsOverview
	const postsOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	if (!isAuthorized && (!session || !session.user)) signIn();
	return <Account postsOverview={postsOverview} sessionUser={session?.user} isAuthorized={isAuthorized} />;
}
