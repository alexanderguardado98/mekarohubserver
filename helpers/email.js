import { getTransport } from "../config/email.js";

export const sendEmailSignUp = async (data) => {
    const { firstName, lastName, email, token } = data;

    const transport = getTransport()
    const FRONTEND_URL = process.env.FRONTEND_URL;

    const url = `${FRONTEND_URL}/confirm/${token}`

    await transport.sendMail({
        from: '"Moonnuit Studio" <moonnuitstudio@gmail.com>',
        to: email,
        subject: "Moonnuit Studio - Confirm Account",
        text: "Your account is almost ready, it only remains to verify your account using the following link",
        template: 'signupEmail',
        context: {
            url,
            email,
            name: `${firstName} ${lastName}`
        }
    })
}

export const sendEmailRequestNewPassword = async (data) => {
    const { email, token } = data;

    const transport = getTransport()
    const FRONTEND_URL = process.env.FRONTEND_URL;

    const url = `${FRONTEND_URL}/new-password/${token}`

    await transport.sendMail({
        from: '"Mekaro Hub" <admin@mekarohub.com>',
        to: email,
        subject: "Mekaro Hub - Reset Password",
        text: "If you have lost your password, us e the link below",
        template: 'requestNewPassword',
        context: {
            url
        }
    })
}