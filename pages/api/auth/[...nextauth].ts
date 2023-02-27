import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

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
