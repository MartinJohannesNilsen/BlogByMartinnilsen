"use server";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import { defaultMetadata } from "@/data/metadata";
import { Metadata } from "next";
import { Session } from "next-auth";
import CMSPage from "@/app/cms/clientPage";
import { getCachedAllDescendingPostsOverview } from "@/data/cache";

export async function generateMetadata() {
  const metadata: Metadata = {
    ...defaultMetadata,
    title: "CMS Dashboard",
    description: "Content Management System",
    creator: "MJNTech",
  };
  return metadata;
}

export default async function Page() {
  // Check authentication
  const session: Session | null =
    process.env.NEXT_PUBLIC_LOCALHOST === "true"
      ? await getMockSession()
      : await auth();
  const isAuthorized = session?.user?.role === "admin";

  // Get postsOverview
  const postsOverview = await getCachedAllDescendingPostsOverview();

  return (
    <CMSPage
      postsOverview={postsOverview}
      isAuthorized={isAuthorized}
      sessionUser={session?.user}
    />
  );
}
