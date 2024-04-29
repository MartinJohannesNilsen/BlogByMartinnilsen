import { Metadata } from "next";
import { defaultMetadata } from "../../data/metadata";

export const metadata: Metadata = {
	...defaultMetadata,
	title: "About",
};

export default async function AboutLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
