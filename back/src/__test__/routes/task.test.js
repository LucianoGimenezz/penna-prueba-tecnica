import request from 'supertest'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import { app } from '../../index.js'
import { getFilePath } from '../../data/dirname.js'

const require = createRequire(import.meta.url)
const db = require('../../data/db-test.json')
const agent = request(app)

describe('Route GET /task', () => {
  const taskMock = {
    id: 'xxx-xxx-x231',
    title: 'Mock title',
    startTime: '12:11:26',
    date: '2023-09-14T15:11:26.045Z'
  }

  beforeEach(async () => {
    await agent.get('/test/clean')

    const parseJson = db
    parseJson.tasks.all.push(taskMock)

    const updatedData = JSON.stringify(parseJson)
    fs.writeFileSync(getFilePath('db-test.json'), updatedData)
  })

  test('Should return an object with error in false', async () => {
    const res = await agent.get('/task?test=true')
    expect(res.statusCode).toBe(200)
    expect(res.body.error).toBe(false)
  })

  test('Should return a task by its id', async () => {
    const res = await agent.get(`/task/${taskMock.id}?test=true`)
    expect(res.statusCode).toBe(200)
    const title = res.body.data.title
    expect(title).toContain(taskMock.title)
  })
})

describe('Route POST /task', () => {
  test('Should create a new task', async () => {
    const title = 'Mock title'
    const res = await agent.post('/task?test=true').send({ task: title })
    expect(res.statusCode).toBe(201)
    expect(res.body.data.title).toEqual(title)
  })

  test('Should return an error if the title dont be send', async () => {
    const res = await agent.post('/task?test=true')
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toEqual(true)
  })
})

describe('Route PUT /task', () => {
  const taskMock = {
    id: 'xxx-xxx-x231',
    title: 'Mock title',
    startTime: '12:11:26',
    date: '2023-09-14T15:11:26.045Z'
  }

  beforeEach(async () => {
    await agent.get('/test/clean')

    const parseJson = db
    parseJson.tasks.all.push(taskMock)

    const updatedData = JSON.stringify(parseJson)
    fs.writeFileSync(getFilePath('db-test.json'), updatedData)
  })
  test('Should modify only the title of a task', async () => {
    const newTitle = 'Mock title modify'
    const resPut = await agent.put(`/task/${taskMock.id}?pending=true&test=true`).send({ task: newTitle })
    const res = await agent.get(`/task/${taskMock.id}?test=true`)

    expect(resPut.statusCode).toBe(200)
    expect(res.body.data.title).not.toEqual(taskMock.title)
    expect(res.body.data.title).toEqual(newTitle)
  })
})
