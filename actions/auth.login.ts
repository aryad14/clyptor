"use server"

import * as z from 'zod'
import { AuthError } from 'next-auth'

import { signIn } from '@/auth'
import { LoginSchema } from '@/schema'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { getUserByEmail } from '@/lib/getUser'
import { sendVerificationEmail, sendTwoFactorTokenMail } from '@/lib/mail'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'
import { getTwoFactorTokenByEmail } from '@/lib/twoFactorToken'
import { db } from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from '@/lib/twoFactorConfirmation'

export const login = async (
    values: z.infer<typeof LoginSchema>,
    callbackUrl?: string | null
) => {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) return {
        error: 'Invalid credentials',
    }

    const { email, password, code } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email not found" }
    }

    // this condition can be skipped as a fallback is already provided in auth.ts
    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email,
        );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Confirmation email sent!" };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {

        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            );

            if (!twoFactorToken) {
                return { error: "Invalid code!" };
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: "Code expired!" };
            }

            await db.twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(
                existingUser.id
            );

            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                });
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                }
            });
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorTokenMail(
                twoFactorToken.email,
                twoFactorToken.token,
            );

            return { twoFactor: true };
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
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