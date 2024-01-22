import { GetStaticProps, InferGetStaticPropsType } from "next";
import ErrorPage from "next/error";
import { useEffect } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import useAuthorized from "../../components/AuthorizationHook/useAuthorized";
import { createdApiDocSpec } from "../../lib/swagger";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";

export const getStaticProps: GetStaticProps = async () => {
	const spec: Record<string, any> = createdApiDocSpec;
	return {
		props: {
			spec,
		},
	};
};

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
	const { setTheme } = useTheme();

	useEffect(() => {
		setTheme(ThemeEnum.Light);
	}, []);

	const { isAuthorized, status } =
		process.env.NEXT_PUBLIC_LOCALHOST === "true"
			? {
					isAuthorized: true,
					status: "authenticated",
			  }
			: useAuthorized(true);

	if (status === "authenticated" && !isAuthorized) {
		return <ErrorPage statusCode={403} title="You've taken the wrong path! Please return home" />;
	}
	if (status === "loading") {
		return <></>;
	} else {
		return <SwaggerUI spec={spec} persistAuthorization={true} />;
	}
}
export default ApiDoc;
