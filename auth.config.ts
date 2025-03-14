import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Discord from "next-auth/providers/discord"

import bcrypt from "bcryptjs"
import { LoginSchema } from "@/schema"
import { getUserByEmail } from "@/lib/getUser";

export default {

    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials)

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email)
                    if (!user || !user.password) return null;

                    const passMatch = await bcrypt.compare(
                        password,
                        user.password
                    )

                    if (passMatch) return user
                }

                return null;
            }
        })
    ]
} satisfies NextAuthConfig