import { getServerSession, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { getDb } from "@/lib/db";

const providers: NextAuthOptions["providers"] = [];
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? token.sub ?? "");
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.id) return;
      try {
        await getDb().userProfile.upsert({
          where: { id: user.id },
          update: {
            name: user.name ?? null,
            email: user.email ?? null,
            image: user.image ?? null,
          },
          create: {
            id: user.id,
            name: user.name ?? null,
            email: user.email ?? null,
            image: user.image ?? null,
          },
        });
      } catch (error) {
        // A profile-sync hiccup must not discard a valid OAuth login.
        console.error("[auth][profile-sync]", error);
      }
    },
  },
};

export function isAuthenticationRequired(): boolean {
  const configured = process.env.AUTH_REQUIRED;
  if (configured !== undefined) return configured === "true";
  return process.env.NODE_ENV === "production";
}

/** Authenticated identity, or the documented single-user local workspace. */
export async function getApiUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;
  return isAuthenticationRequired() ? null : "local";
}
