import { Metadata } from "next";
import { defaultMetadata } from "../../data/metadata";
import Account from "./clientPage";

export const metadata: Metadata = {
	...defaultMetadata,
	title: "Account",
};

export default async function Page() {
	return <Account />;
}
