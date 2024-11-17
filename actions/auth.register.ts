"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

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

    return {
        status: "200",
        data: user,
        message: "User Created Successfully"
    }
}