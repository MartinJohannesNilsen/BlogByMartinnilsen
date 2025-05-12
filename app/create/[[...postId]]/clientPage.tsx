"use client";
import PostEditor from "@/components/PostEditor/PostEditor";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { ThemeEnum } from "@/styles/themes/themeMap";
import { FullPost } from "@/types";
import ErrorPage from "next/error";
import { useEffect, useState } from "react";

const ManageArticlePage = ({
	post,
	postId,
	isAuthorized,
}: {
	post?: FullPost;
	postId?: string;
	isAuthorized: boolean;
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setTheme(ThemeEnum.Light);
	}, []);

	useEffect(() => {
		setIsLoading(false);
	}, [theme]);

	if (!isAuthorized) return <ErrorPage statusCode={403} title="You've taken the wrong path! Please return home" />;
	if (isLoading) return <></>;
	return !postId ? <PostEditor /> : post ? <PostEditor post={post} id={postId} /> : <></>;
};
export default ManageArticlePage;
