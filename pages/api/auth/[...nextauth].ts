import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import RedditProvider from "next-auth/providers/reddit";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
    }),
    // FacebookProvider({
    //   clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET,
    // }),
    // TwitterProvider({
    //   clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
    //   clientSecret: process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET,
    //   version: "2.0", // opt-in to Twitter OAuth 2.0
    // }),
    // RedditProvider({
    //   clientId: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID,
    //   clientSecret: process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET,
    // }),
  ],
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  //   callbacks: {
  //     jwt: async ({ token, user }) => {
  //       user && (token.user = user);
  //       return token;
  //     },
  //     session: async ({ session, token }) => {
  //       session.user = token.user;
  //       return session;
  //     },
  //   },
});
