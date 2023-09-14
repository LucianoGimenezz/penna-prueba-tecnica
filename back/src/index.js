import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { taskRouter, downloadRouter, userRouter, testRouter } from './routes/index.js'

export const app = express()

app.use(morgan('dev'))
app.use(cors({
  origin: 'http://localhost:5173'
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/task', taskRouter)
app.use('/user', userRouter)
app.use('/download', downloadRouter)
app.use('/test', testRouter)
