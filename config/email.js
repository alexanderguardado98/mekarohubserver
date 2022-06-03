import path from 'path'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'

export const getTransport = () => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    })

    transport.use('compile', hbs({
      viewEngine: {
        extname: ".handlebars",
        partialsDir: path.resolve('./layouts'),
        defaultLayout: false
      },
      viewPath: path.resolve('./layouts'),
      extname: ".handlebars",
    }))

    return transport
}