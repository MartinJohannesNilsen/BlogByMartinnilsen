"use server";
import { Session } from "next-auth";

export default async function getMockSession() {
	const mockSession: Session = {
		user: { name: "Dev", email: "dev@mjntech.dev", image: null, role: "admin", provider: "Google" },
		expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
	};
	return mockSession;
}
