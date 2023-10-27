import useSWR from "swr";
import { FC } from "react";
import { Skeleton } from "@mui/material";

interface PostViewsProps {
  postId: string;
  fontSize?: number;
}

const fetcher = async (input: RequestInfo) => {
  const res: Response = await fetch(input);
  return await res.json();
};

const PageViews: FC<PostViewsProps> = ({ postId, fontSize }) => {
  const { data } = useSWR(`/api/views/${postId}`, fetcher);

  return (
    <>
      {data?.view_count ? (
        `${data.view_count} view` + (data.view_count !== 1 ? "s" : "")
      ) : (
        <Skeleton
          variant="text"
          sx={{ fontSize: fontSize && "1rem" }}
          width={60}
        />
      )}
    </>
  );
};

export default PageViews;
