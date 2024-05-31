import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import connect from "./config/db.js"

import userRoute from './routes/userRoute.js'
import conceptRoute from './routes/conceptRoute.js'

const app = express()
dotenv.config()

const whitelist = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.includes(origin)) {
            // Puede consultar la API
            callback(null, true)
        } else {
            console.log(whitelist)
            callback(new Error(`Cors Error ${origin}`))
        }
    }
}

app.use(express.json())
app.use(cors(corsOptions))
connect()

app.use('/api/users', userRoute)
app.use('/api/concepts', conceptRoute)

const PORT = process.env.PORT || 4000

const server = app.listen(PORT, _ => {
    console.log('Mekaro Hub is UP!')
    console.log('Listening on port', PORT)
    console.log(`http://localhost:${PORT}`)
})