"use server"

import * as z from 'zod'
import { AuthError } from 'next-auth'

import { signIn } from '@/auth'
import { LoginSchema } from '@/schema'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { getUserByEmail } from '@/lib/getUser'
import { sendVerificationEmail, sendTwoFactorTokenMail } from '@/lib/mail'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) return {
        error: 'Invalid credentials',
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email not found" }
    }

    // this condition can be skipped as a fallback is already provided in auth.ts
    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )

        return { success: "Verification email is already sent. Please check your email." }
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenMail(twoFactorToken.email, twoFactorToken.token);
        return {
            twoFactor: true
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
        return { success: "Logged in successfully" }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" }
                default:
                    return { error: "An error occurred" }
            }
        }

        throw error;
    }
}