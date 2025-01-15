import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    }),
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Invalid email address"
    }),
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
    name: z.string().min(1, {
        message: "Name is required",
    }),
});