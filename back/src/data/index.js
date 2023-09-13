import { randomUUID } from 'crypto'
import { getFullHour, getParseJson } from '../utils/index.js'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const filePath = path.join(__dirname, 'db.json')

const calculateTotal = (startDate, finishedDate) => {
  const start = new Date(startDate)
  const finished = new Date(finishedDate)

  // Calculo la diferencia en milisegundos

  const differences = start - finished

  const seconds = Math.abs(Math.floor(differences / 1000) % 60) - 1
  const minutes = Math.abs(Math.floor(differences / 60000) % 60) - 1
  const hour = Math.abs(Math.floor(differences / 3600000)) - 1

  const parseMinutes = minutes < 10 ? `0${minutes}` : minutes
  const parseSeconds = seconds < 10 ? `0${seconds}` : seconds
  const parseHour = hour < 10 ? `0${hour}` : hour

  return `${parseHour}:${parseMinutes}:${parseSeconds}`
}

export class TaskModel {
  static getAll = async () => {
    const parseTask = getParseJson(__dirname, filePath)
    return parseTask
  }

  static getById = async (id) => {
    const data = getParseJson(__dirname, filePath)
    const { tasks } = data

    const task = tasks?.find(task => task.id === id)
    return task
  }

  static completedTask = async (id) => {
    const data = getParseJson(__dirname, filePath)
    const indexTask = data?.tasks.findIndex(task => task.id === id)
    if (indexTask < 0) return null

    // Si el indexTask es mayor a cero entonces la tarea existe, la guardamos en una variable para poder agregar
    // los atributos `endTiem` y `total`.
    let currentTask = data.tasks[indexTask]

    if (currentTask?.endTime) return null

    // Traemos la fecha y la hora en la que se finalizo la tarea
    const { fullHour, date } = getFullHour()

    // Calculamos el tiempo total que se tardo en terminar la tarea
    const totalTime = calculateTotal(currentTask?.date, date)

    currentTask = {
      ...currentTask,
      endTime: fullHour,
      total: totalTime
    }

    data.tasks[indexTask] = currentTask
    const updatedData = JSON.stringify(data)
    fs.writeFileSync(filePath, updatedData)
    return data
  }

  static addTask = async (task) => {
    try {
      const parseTask = getParseJson(__dirname, filePath)
      const { fullHour, date } = getFullHour()

      const newTask = {
        id: randomUUID(),
        title: task,
        startTime: fullHour,
        date
      }

      parseTask?.tasks.push(newTask)

      const updatedData = JSON.stringify(parseTask)
      fs.writeFileSync(filePath, updatedData)
      return newTask
    } catch (err) {
      throw new Error(err)
    }
  }

  static updateTask = async (id, task) => {
    const parseTask = getParseJson(__dirname, filePath)
    const indexTaskToUpdate = parseTask.tasks.findIndex(task => task.id === id)

    if (indexTaskToUpdate < 0) return null

    parseTask.tasks[indexTaskToUpdate].title = task
    const updatedData = JSON.stringify(parseTask)
    fs.writeFileSync(filePath, updatedData)
    return parseTask
  }
}
