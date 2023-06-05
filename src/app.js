import express, { json, urlencoded } from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.PORT

import { user_router } from './routes/users.js'
import { auth_router } from './routes/auth.js'
import { management } from './routes/management.js'

app.use(json())

app.use(urlencoded({ extended: true }))

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})

app.use('/users', user_router)

app.use('/auth', auth_router)

app.use('/management', management)
