import fs from 'node:fs'

export const getParseJson = (__dirname, filePath) => {
  const data = fs.readFileSync(filePath, 'utf8')
  const parseTask = JSON.parse(data)

  return parseTask
}
