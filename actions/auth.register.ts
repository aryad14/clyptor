"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

interface RegisterArgs {
    name: string
    email: string
    password: string
}

export const register = async ({ name, email, password }: RegisterArgs) => {

    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    })

    if (existingUser) {
        return {
            status: "405",
            error: "User Already Exists"
        }
    }

    const hashedpassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedpassword,
        },
    })

    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(
        verificationToken.email, 
        verificationToken.token
    )

    return {
        status: "200",
        data: user,
        message: "Confirmation Email is Sent",
    }
}