import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchUserByEmail } from "@/actions/user.action";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const user = await fetchUserByEmail(credentials?.email);

        console.log("credentials?.password", credentials?.password);

        const passwordCorrect = await compare(credentials?.password, user?.password);

        console.log("AAAAA", user);

        if (passwordCorrect) {
          return user;
        }

        console.log("credentials", credentials);
        return null;
      },
    }),
  ],
};
