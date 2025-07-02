"use client";
import PostEditor from "@/components/PostEditor/PostEditor";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { ThemeEnum } from "@/styles/themes/themeMap";
import { FullPost } from "@/types";
import ErrorPage from "next/error";
import { useEffect, useState } from "react";

const CreateNewPostPage = ({ isAuthorized }: { isAuthorized: boolean }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setTheme(ThemeEnum.Light);
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [theme]);

  if (!isAuthorized)
    return (
      <ErrorPage
        statusCode={403}
        title="You are not permitted to enter here! Please return home"
      />
    );
  if (isLoading) return <></>;
  return <PostEditor />;
};
export default CreateNewPostPage;
