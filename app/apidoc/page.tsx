import { auth } from "@/auth";
import getMockSession from "@/components/Auth/MockSession";
import { Metadata } from "next";
import { Session } from "next-auth";
import { createdApiDocSpec } from "../../lib/swagger";
import ApiDoc from "./clientPage";

export async function generateMetadata({ params, searchParams }) {
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
	const spec: Record<string, any> = createdApiDocSpec;

	return <ApiDoc spec={spec} isAuthorized={isAuthorized} />;
}
