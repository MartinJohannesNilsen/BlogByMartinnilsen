import ApiDoc from "@/app/apidoc/clientPage";
import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import { apiDocSpec } from "@/lib/swagger";
import { Metadata } from "next";
import { Session } from "next-auth";

export async function generateMetadata() {
	const metadata: Metadata = {
		title: "APIDoc",
	};
	return metadata;
}

export default async function Page() {
	// Check authentication
	const session: Session | null = process.env.NEXT_PUBLIC_LOCALHOST === "true" ? await getMockSession() : await auth();
	const isAuthorized = session?.user?.role === "admin";

	// Generate spec
	const spec: Record<string, any> = apiDocSpec;

	return <ApiDoc spec={spec} isAuthorized={isAuthorized} />;
}
