"use server";
import ManageArticlePage from "@/app/create/[[...postId]]/clientPage";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import { getPost } from "@/data/middleware/posts/posts";
import { DATA_DEFAULTS, defaultMetadata } from "@/data/metadata";
import { Metadata } from "next";
import { Session } from "next-auth";
import { unstable_cache } from "next/cache";

export async function generateMetadata({ params }: { params: { postId?: string } }) {
	// Get postId
	const id = params.postId && params.postId.length > 0 ? params.postId[0] : undefined;

	// Get post
	const getCachedPost = unstable_cache(async (postId: string) => getPost(postId), undefined, {
		tags: [`post_${params.postId}`],
	});
	const post = id ? await getCachedPost(id) : undefined;

	if (!post) return { ...defaultMetadata, title: "Create new post" };
	const metadata: Metadata = {
		...defaultMetadata,
		title: `Editing post "${post.title}"`,
		description: post.description,
		creator: "MJNTech",
		openGraph: {
			type: "article",
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${params.postId}`,
			title: post.title,
			description: post.description,
			siteName: "Tech Blog",
			images: [{ url: post.ogImage.src || DATA_DEFAULTS.images.openGraph }],
			publishedTime: new Date(post.createdAt).toUTCString(),
			modifiedTime: post.updatedAt ? new Date(post.updatedAt).toUTCString() : undefined,
			section: post.type,
			tags: post.tags,
		},
	};
	return metadata;
}

export default async function Page({ params }: { params: { postId?: string[] } }) {
	// Check authentication
	const session: Session | null = process.env.NEXT_PUBLIC_LOCALHOST === "true" ? await getMockSession() : await auth();
	const isAuthorized = session?.user?.role === "admin";

	// Get postId
	const id = params.postId && params.postId.length > 0 ? params.postId[0] : undefined;

	// Get post
	const post = id ? await getPost(id) : undefined;

	return <ManageArticlePage post={post || undefined} postId={id} isAuthorized={isAuthorized} />;
}
