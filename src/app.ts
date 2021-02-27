import express from 'express'
import createConnection from './config/database/db'
import { router } from './routes'

createConnection()
const app = express()
app.use(express.json())
app.use(router)

export { app }