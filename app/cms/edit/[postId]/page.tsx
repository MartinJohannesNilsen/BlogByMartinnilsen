"use server";
import EditPostPage from "@/app/cms/edit/[postId]/clientPage";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import { getPost } from "@/data/middleware/posts/actions";
import { defaultMetadata } from "@/data/metadata";
import { Metadata } from "next";
import { Session } from "next-auth";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ postId: string }>;
}) {
  // Get params and postId from props
  const params = await props.params;
  const { postId } = params;

  // Get post
  const getCachedPost = unstable_cache(
    async (postId: string) => getPost(postId),
    undefined,
    {
      tags: [`post_${postId}`],
    }
  );
  const post = await getCachedPost(postId);

  if (!post)
    return {
      ...defaultMetadata,
      title: "Create new post",
      description: "CMS route for creating a new post",
    };
  const metadata: Metadata = {
    ...defaultMetadata,
    title: `Editing post "${post.title}"`,
    description: "CMS route for editing a new post",
  };
  return metadata;
}

export default async function Page(props: {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Check authentication
  const session: Session | null =
    process.env.NEXT_PUBLIC_LOCALHOST === "true"
      ? await getMockSession()
      : await auth();
  const isAuthorized = session?.user?.role === "admin";

  // Get post
  const { postId } = await props.params;
  const post = await getPost(postId);

  if (!post) return notFound();
  return (
    <EditPostPage post={post} postId={postId} isAuthorized={isAuthorized} />
  );
}
