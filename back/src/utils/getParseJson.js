import path from 'node:path'
import fs from 'node:fs'

export const getParseJson = (__dirname) => {
  const filePath = path.join(__dirname, 'db.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const parseTask = JSON.parse(data)

  return parseTask
}
