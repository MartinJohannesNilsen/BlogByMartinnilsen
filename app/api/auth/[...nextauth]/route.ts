import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import RedditProvider from "next-auth/providers/reddit";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const authOptions = {
	// https://next-auth.js.org/providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID ?? "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
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
	secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
