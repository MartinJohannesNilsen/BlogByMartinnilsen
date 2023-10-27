import useSWR from "swr";
import { FC } from "react";
import { Skeleton } from "@mui/material";

interface PostViewsProps {
  postId: string;
  sx?: {};
}

const fetcher = async (input: RequestInfo) => {
  const res: Response = await fetch(input);
  return await res.json();
};

const PostViews: FC<PostViewsProps> = ({ postId, sx }) => {
  const { data } = useSWR(`/api/views/${postId}`, fetcher);

  return (
    <>
      {data?.view_count ? (
        `${data.view_count} view` + (data.view_count !== 1 ? "s" : "")
      ) : (
        <Skeleton variant="text" sx={sx} width={60} />
      )}
    </>
  );
};

export default PostViews;
