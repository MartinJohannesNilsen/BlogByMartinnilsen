import { Metadata } from "next";
import { getServerSession } from "next-auth";
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
	const session = await getServerSession();
	const isAuthorized = process.env.NEXT_PUBLIC_LOCALHOST === "true" || session?.user?.email === process.env.ADMIN_EMAIL;

	// Generate spec
	const spec: Record<string, any> = createdApiDocSpec;

	return <ApiDoc spec={spec} isAuthorized={isAuthorized} />;
}
