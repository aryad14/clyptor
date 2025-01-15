import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendPasswordResetMail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/resetPassword?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Resend your Password",
        text: `Your link to reset your password: ${resetLink}`
    })
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/verify?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email",
        text: `Click this link to verify your email: ${confirmLink}`,
    })
}