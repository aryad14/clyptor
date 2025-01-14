"use server"

import { db } from "@/lib/db"
import { getUserByEmail } from "@/lib/getUser"
import { getVerificationTokenByToken } from "@/lib/verification-token"

export const Verify = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token)

    if (!existingToken) {
        return { error: "Invalid Token" }
    }

    const tokenHasExpired = new Date(existingToken.expires) < new Date();
    if (tokenHasExpired) {
        return { error: "Token has Expired!" }
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) {
        return { error: "User email does not exist" }
    }

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email //if user changes the email, then instead of just updating changed email in the DB, we will verify it and then update it in DB
        }
    })

    await db.verificationToken.delete({
        where: { id: existingToken.id }
    })

    return {success: "Email Verified!"}
}