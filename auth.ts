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
    callbacks: {
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