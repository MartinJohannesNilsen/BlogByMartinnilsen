import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import useAuthorized from "../../components/AuthorizationHook/useAuthorized";
import CreatePost from "../../components/PostManagement/PostManagement";
import { getPost } from "../../database/posts";
import { FullPost } from "../../types";

const ManageArticleView: FC = (props) => {
	const { isAuthorized, status } =
		process.env.NEXT_PUBLIC_LOCALHOST === "true"
			? {
					isAuthorized: true,
					status: "authenticated",
			  }
			: useAuthorized(true);
	const [post, setPost] = useState<FullPost>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const { postId } = router.query;

	// https://github.com/vercel/next.js/discussions/13729#discussioncomment-22270
	useEffect(() => {
		if (!postId) {
			return setIsLoading(false);
		}
		const id = router.query.postId[0];
		getPost(id)
			.then((data) => {
				setPost(data);
			})
			.catch((error) => console.log(error));
		return () => {};
	}, [postId]);

	if (status === "authenticated" && !isAuthorized) {
		return <ErrorPage statusCode={403} title="You've taken the wrong path! Please return home" />;
	}
	if (isLoading || status === "loading") {
		return <></>;
	} else {
		return <>{!postId ? <CreatePost /> : post ? <CreatePost post={post} /> : null}</>;
	}
};
export default ManageArticleView;
