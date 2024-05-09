"use server";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import { Metadata } from "next";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { ArticleJsonLd } from "next-seo";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { getCachedAllDescendingPostsOverview, getCachedPublishedDescendingPostsOverview } from "../../../data/cache";
import { getPost } from "../../../data/db/posts";
import { DATA_DEFAULTS, defaultMetadata, formatDate } from "../../../data/metadata";
import ReadArticleView from "./clientPage";

export async function generateMetadata({ params }: { params: { postId: string } }) {
	// Get post
	const getCachedPost = unstable_cache(async (postId: string) => getPost(postId), undefined, {
		tags: [`post_${params.postId}`],
	});
	const post = await getCachedPost(params.postId);

	if (!post) return defaultMetadata;
	const metadata: Metadata = {
		...defaultMetadata,
		title: post.title,
		description: post.description,
		creator: "MJNTech",
		keywords: post.tags,
		openGraph: {
			type: "article",
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${params.postId}`,
			title: post.title,
			description: post.description,
			siteName: "Tech Blog",
			images: [{ url: post.ogImage.src || DATA_DEFAULTS.images.openGraph }],
			publishedTime: formatDate(new Date(post.createdAt)),
			modifiedTime: post.updatedAt ? formatDate(new Date(post.updatedAt)) : undefined,
			section: post.type,
			tags: post.tags,
		},
	};
	return metadata;
}

export async function generateStaticParams() {
	const posts = await getCachedAllDescendingPostsOverview();
	return posts.map((post) => ({ postId: post.id }));
}

export default async function Page({ params }: { params: { postId: string } }) {
	// Check authentication
	const session: Session | null = process.env.NEXT_PUBLIC_LOCALHOST === "true" ? await getMockSession() : await auth();
	const isAuthorized = session?.user?.role === "admin";

	// Get post
	const getCachedPost = unstable_cache(async (postId: string) => getPost(postId), undefined, {
		tags: [`post_${params.postId}`],
	});
	const post = await getCachedPost(params.postId);

	// Get postsOverview
	const postsOverview = isAuthorized
		? await getCachedAllDescendingPostsOverview()
		: await getCachedPublishedDescendingPostsOverview();

	if (!post) return notFound();
	else if (!post.published && !isAuthorized) signIn();
	return (
		<>
			<ArticleJsonLd
				useAppDir={true}
				type="BlogPosting"
				url={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${params.postId}`}
				images={[post.ogImage.src]}
				datePublished={new Date(post.createdAt).toISOString()}
				dateModified={post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined}
				title={post.title}
				description={post.description}
				// authorName={post.author}
				authorName={{
					"@type": "Person",
					name: post.author,
					url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/yjdttN68e7V3E8SKIupT`,
				}}
			/>
			<ReadArticleView post={post} postId={params.postId} postsOverview={postsOverview} isAuthorized={isAuthorized} />
		</>
	);
}
