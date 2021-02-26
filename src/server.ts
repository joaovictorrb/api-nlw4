import express from 'express'
import './config/database/db'
import { router } from './routes'


const app = express()
app.use(express.json())
app.use(router)
app.listen(3333, () => console.log('Im online!'))