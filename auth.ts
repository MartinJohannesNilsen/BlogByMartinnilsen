import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

declare module "next-auth" {
	// interface Account {}
	interface User {
		role: string;
	}
	interface Session {
		user: {
			role: string;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role: string;
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({
			profile(profile) {
				return { role: profile.email === process.env.AUTH_ADMIN_EMAIL ? "admin" : "user" };
			},
		}),
		GitHub({
			profile(profile) {
				return { role: profile.email === process.env.AUTH_ADMIN_EMAIL ? "admin" : "user" };
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user) token.role = user.role;
			return token;
		},
		session({ session, token }) {
			session.user.role = token.role;
			return session;
		},
	},
});
