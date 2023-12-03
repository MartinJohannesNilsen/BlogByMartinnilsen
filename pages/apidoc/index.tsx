import ErrorPage from "next/error";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { createdApiDocSpec } from "../../lib/swagger";
import useAuthorized from "../../components/AuthorizationHook/useAuthorized";
import SwaggerUI from "swagger-ui-react";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { ThemeContext, useTheme } from "../../styles/themes/ThemeProvider";

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createdApiDocSpec;
  return {
    props: {
      spec,
    },
  };
};

// const SwaggerUI = dynamic<{
//   spec: any;
//   url?: string;
//   layout?: string;
//   plugins?: any;
//   persistAuthorization?: boolean;
// }>(import("swagger-ui-react"), { ssr: false });

// function ApiDoc() {
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
    // return <SwaggerUI spec={spec} persistAuthorization={true} />;
    const { theme } = useTheme();
    return (
      <Box
        sx={{ height: "100vh", width: "100vw" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        textAlign="center"
      >
        <Typography
          variant="h1"
          fontWeight={800}
          color={theme.palette.text.primary}
          fontFamily={theme.typography.fontFamily}
        >
          What?
        </Typography>
        <Typography
          variant="h2"
          fontWeight={800}
          color={theme.palette.text.primary}
          fontFamily={theme.typography.fontFamily}
        >
          API documentation in the making
        </Typography>
      </Box>
    );
  }
}
export default ApiDoc;
