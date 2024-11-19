import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import bcrypt from "bcryptjs"
import { LoginSchema } from "@/schema"
import { getUserByEmail } from "@/lib/getUser";

export default {
    providers: [
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