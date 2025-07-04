"use server";
import Account from "@/app/account/clientPage";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import { getCachedAllDescendingPostsOverview, getCachedPublishedDescendingPostsOverview } from "@/data/cache";
import { Metadata } from "next";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";

export async function generateMetadata() {
	const metadata: Metadata = {
		title: "Account",
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

	if (!isAuthorized && (!session || !session.user)) signIn();
	return <Account postsOverview={postsOverview} sessionUser={session?.user} isAuthorized={isAuthorized} />;
}
