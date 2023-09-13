import { Router } from 'express'
import { UserModel } from '../data/index.js'

export const router = Router()

router.post('/', async (req, res) => {
  const { dni } = req.body
  try {
    const result = await UserModel.saveDni(dni)
    res.status(201).json({ error: false, message: null, data: result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: true, message: 'Unexpected error', data: null })
  }
})
