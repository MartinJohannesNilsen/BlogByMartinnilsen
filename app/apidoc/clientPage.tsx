"use client";
import { Box } from "@mui/material";
import ErrorPage from "next/error";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export function ApiDoc({
  spec,
  isAuthorized,
}: {
  spec: any;
  isAuthorized: boolean;
}) {
  if (!isAuthorized) {
    return (
      <ErrorPage
        statusCode={403}
        title="You are not permitted to enter here! Please return home"
      />
    );
  } else {
    return (
      <Box
        sx={{
          backgroundColor: "white",
          mt: -10,
          pt: 10,
          pb: 10,
          minHeight: "100%",
          width: "100%",
        }}
      >
        <SwaggerUI spec={spec} persistAuthorization={true} />
      </Box>
    );
  }
}

export default ApiDoc;
