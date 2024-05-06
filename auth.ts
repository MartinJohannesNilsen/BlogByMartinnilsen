import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

declare module "next-auth" {
	// interface Account {}
	interface User {
		role: string;
		provider: string;
	}
	interface Session {
		user: {
			role: string;
			provider: string;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role: string;
		provider: string;
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({
			profile(profile) {
				return {
					id: `${profile.sub}`,
					name: profile.name,
					image: profile.picture,
					email: profile.email,
					role: profile.email === process.env.AUTH_ADMIN_EMAIL ? "admin" : "user",
					provider: "Google",
				};
			},
		}),
		GitHub({
			profile(profile) {
				return {
					id: `${profile.id}`,
					name: profile.name,
					image: profile.avatar_url,
					email: profile.email,
					role: profile.email === process.env.AUTH_ADMIN_EMAIL ? "admin" : "user",
					provider: "GitHub",
				};
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.provider = user.provider;
			}
			return token;
		},
		session({ session, token }) {
			session.user.role = token.role;
			session.user.provider = token.provider;
			return session;
		},
	},
});
