import express from "express"
import dotenv from "dotenv"

import connect from "./config/db.js"

import userRoute from './routes/userRoute.js'

const app = express()

app.use(express.json())
dotenv.config()
connect()

app.use('/api/users', userRoute)

const PORT = process.env.PORT || 4000

const server = app.listen(PORT, _ => {
    console.log('Mekaro Hub is UP!')
    console.log('Listening on port', PORT)
    console.log(`http://localhost:${PORT}`)
})