import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/passwords";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parolă", type: "password" },
      },
      async authorize(credentials) {
        console.log("LOGIN ATTEMPT START");

        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          console.log("LOGIN PARSE FAILED");
          return null;
        }

        const { email, password } = parsed.data;
        console.log("LOGIN EMAIL:", email);

        const user = await prisma.user.findUnique({
          where: { email },
        });

        console.log("USER FOUND:", !!user);

        if (!user) return null;

        const isValid = await verifyPassword(password, user.password);
        console.log("PASSWORD VALID:", isValid);

        if (!isValid) return null;

        console.log("LOGIN SUCCESS");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "MEMBER";
      }
      return session;
    },
  },
};
