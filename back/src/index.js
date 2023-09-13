import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { router } from './routes/taskRoutes.js'

export const app = express()

app.use(morgan('dev'))
app.use(cors({
  origin: 'http://localhost:5173'
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/task', router)
