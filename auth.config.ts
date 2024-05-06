export const authConfig = {
	providers: [],
};

// const authOptions = {
// providers: [
// GoogleProvider({
// 	clientId: process.env.GOOGLE_CLIENT_ID!,
// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
// 	profile(profile) {
// 		return {
// 			...profile,
// 			id: "google_" + profile.sub, // The unique ID of the user's Google Account, according to https://developers.google.com/assistant/identity/google-sign-in-oauth#validate_and_decode_the_jwt_assertion
// 			role: profile.email === process.env.ADMIN_EMAIL ? "admin" : "user",
// 			image: profile.picture,
// 			// firstName: profile.given_name,
// 			// lastName: profile.family_name,
// 		};
// 	},
// }),
// GitHubProvider({
// 	clientId: process.env.GITHUB_CLIENT_ID!,
// 	clientSecret: process.env.GITHUB_CLIENT_SECRET!,
// 	profile(profile) {
// 		return {
// 			...profile,
// 			id: "github_" + `${profile.id}`,
// 			role: profile.email === process.env.ADMIN_EMAIL ? "admin" : "user",
// 			image: profile.avatar_url,
// 		};
// 	},
// }),
// 	],
// 	callbacks: {
// 		async jwt({ token, user }) {
// 			if (user) token.role = user.role;
// 			return token;
// 		},
// 		async session({ session, token }) {
// 			if (session?.user) session.user.role = token.role;
// 			return session;
// 		},
// 	},
// 	secret: process.env.NEXTAUTH_SECRET,
// };
