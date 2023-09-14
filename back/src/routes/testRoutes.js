import { Router } from 'express'
import { createRequire } from 'node:module'
import { getFilePath } from '../data/dirname.js'
import fs from 'node:fs'

const require = createRequire(import.meta.url)
const db = require('../data/db-test.json')

export const router = Router()

router.get('/clean', async (req, res) => {
  const parseJSON = db
  parseJSON.tasks.history = []
  parseJSON.tasks.all = []

  try {
    const updatedData = JSON.stringify(parseJSON)
    fs.writeFileSync(getFilePath('db-test.json'), updatedData)
    res.status(200).json({ message: 'ok' })
  } catch (err) {
    console.error(err)
    res.status(500).send()
  }
})
