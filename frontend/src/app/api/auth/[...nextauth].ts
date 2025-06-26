import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Use a random admin Gmail and username
        if (credentials?.email === "tanzadmin@gmail.com" && credentials?.password === "England123") {
          return { id: 1, name: "TanzAdmin", email: "tanzadmin@gmail.com", role: "admin" };
        }
        if (credentials?.email === "user@example.com" && credentials?.password === "user") {
          return { id: 2, name: "User", email: "user@example.com", role: "user" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Attach role to session
      if (token?.role) session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    }
  },
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
