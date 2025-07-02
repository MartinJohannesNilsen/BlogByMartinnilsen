"use server";
import CreateNewPostPage from "@/app/cms/create/clientPage";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import { defaultMetadata } from "@/data/metadata";
import { Session } from "next-auth";

export async function generateMetadata() {
  return {
    ...defaultMetadata,
    title: "Create new post",
    description: "CMS route for creating a new post",
  };
}

export default async function Page(props: {
  params: Promise<{ postId?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Check authentication
  const session: Session | null =
    process.env.NEXT_PUBLIC_LOCALHOST === "true"
      ? await getMockSession()
      : await auth();
  const isAuthorized = session?.user?.role === "admin";

  return <CreateNewPostPage isAuthorized={isAuthorized} />;
}
