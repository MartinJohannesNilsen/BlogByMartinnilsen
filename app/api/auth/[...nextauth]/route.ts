import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const authOptions = {
	// https://next-auth.js.org/providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
			profile(profile) {
				return {
					...profile,
					id: "google_" + profile.sub, // The unique ID of the user's Google Account, according to https://developers.google.com/assistant/identity/google-sign-in-oauth#validate_and_decode_the_jwt_assertion
					role: profile.email === process.env.ADMIN_EMAIL ? "admin" : "user",
					// firstName: profile.given_name,
					// lastName: profile.family_name,
				};
			},
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID ?? "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
			profile(profile) {
				return {
					...profile,
					id: "github_" + `${profile.id}`,
					role: profile.email === process.env.ADMIN_EMAIL ? "admin" : "user",
				};
			},
		}),
		// FacebookProvider({
		//   clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
		//   clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
		// }),
		// TwitterProvider({
		//   clientId: process.env.TWITTER_CLIENT_ID ?? "",
		//   clientSecret: process.env.TWITTER_CLIENT_SECRET ?? "",
		//   version: "2.0", // opt-in to Twitter OAuth 2.0
		// }),
		// RedditProvider({
		//   clientId: process.env.REDDIT_CLIENT_ID ?? "",
		//   clientSecret: process.env.REDDIT_CLIENT_SECRET ?? "",
		// }),
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
	secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
