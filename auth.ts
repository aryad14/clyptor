import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "@/auth.config"
import { db } from "@/lib/db"
import { getUserById } from "@/lib/getUser"
import { UserRole } from "@prisma/client"

export const {
    auth,
    handlers: { GET, POST },
    signIn,
    signOut
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: {
                    id: user.id
                },
                data: {
                    emailVerified: new Date()
                }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            //This will only allow OAuth providers to sign in without email verification
            if (account?.provider !== "credentials") return true

            // if user is not found or email is not verified sign in is not allowed
            if (!user.id) {
                return false;
            }

            const existingUser = await getUserById(user.id);

            // if user is not found or email is not verified sign in is not allowed
            if (!existingUser || !existingUser.emailVerified) {
                return false;
            }

            return true;
        },
        async session({ session, token }) {
            // this is to access the user id from database in both client and server components
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }
            return session
        },
        async jwt({ token }) {
            // check if user is authenticated
            if (!token.sub) return token;

            // check if user is active
            const user = await getUserById(token.sub);
            if (!user) return token;

            // add role to token
            token.role = user.role

            return token
        }
    },
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },
    ...authConfig,
})