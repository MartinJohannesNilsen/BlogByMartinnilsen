"use client";
import { Skeleton } from "@mui/material";
import { PostViewsProps } from "../../types";

const PostViews = ({ viewCount, sx }: PostViewsProps) => {
	return viewCount ? (
		<>{`${viewCount} view` + (viewCount !== 1 ? "s" : "")}</>
	) : (
		<Skeleton variant="text" sx={sx} width={60} />
	);
};

export default PostViews;
