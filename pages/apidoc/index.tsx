import ErrorPage from "next/error";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import "swagger-ui-react/swagger-ui.css";
import { createdApiDocSpec } from "../../lib/swagger";
import useAuthorized from "../../components/AuthorizationHook/useAuthorized";
import SwaggerUI from "swagger-ui-react";

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createdApiDocSpec;
  return {
    props: {
      spec,
    },
  };
};

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isAuthorized, status } =
    process.env.NEXT_PUBLIC_LOCALHOST === "true"
      ? {
          isAuthorized: true,
          status: "authenticated",
        }
      : useAuthorized(true);

  if (status === "authenticated" && !isAuthorized) {
    return (
      <ErrorPage
        statusCode={403}
        title="You've taken the wrong path! Please return home"
      />
    );
  }
  if (status === "loading") {
    return <></>;
  } else {
    return <SwaggerUI spec={spec} persistAuthorization={true} />;
  }
}
export default ApiDoc;
