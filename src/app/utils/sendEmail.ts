import nodemailer from "nodemailer"
import env from "../../config/env"

export const sendVerificationEmail = async (to: string, code: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: `Rimi server <${env.EMAIL_USER}>`,
        to: to,
        subject: "Email verification",
        text: `Your verification code is: ${code}`
    }

    await transporter.sendMail(mailOptions)
}