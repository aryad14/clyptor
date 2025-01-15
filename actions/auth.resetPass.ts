"use server"

import { getUserByEmail } from "@/lib/getUser"
import { sendPasswordResetMail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetSchema } from "@/schema"
import * as z from "zod"

export const resetPass = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values)
    if(!validatedFields.success) {
        return {error: "Invalid Credentials"}
    }

    const {email} = validatedFields.data

    const existingUser = await getUserByEmail(email)
    if(!existingUser) {
        return {error: "Email not found!"}
    }

    const passResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetMail(
        passResetToken.email,
        passResetToken.token
    )

    return {success: "Reset email sent!"}
}