import { Skeleton } from "@mui/material";
import { FC } from "react";
import useSWR from "swr";

interface PostViewsProps {
	postId: string;
	sx?: {};
}

const apiFetcher = async (url: RequestInfo) => {
	// Add apikey header
	const headers = new Headers();
	headers.append("apikey", process.env.NEXT_PUBLIC_API_AUTHORIZATION_TOKEN);

	// Fetch and return
	const res: Response = await fetch(url, {
		method: "GET", // or 'POST', 'PUT', etc.
		headers: headers,
	});
	return await res.json();
};

const PostViews: FC<PostViewsProps> = ({ postId, sx }) => {
	const { data } = useSWR(`/api/views/${postId}`, apiFetcher);

	return (
		<>
			{data?.viewCount ? (
				`${data.viewCount} view` + (data.viewCount !== 1 ? "s" : "")
			) : (
				<Skeleton variant="text" sx={sx} width={60} />
			)}
		</>
	);
};

export default PostViews;
