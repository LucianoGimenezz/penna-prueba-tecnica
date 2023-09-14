import { randomUUID } from 'crypto'
import { getFullHour, getParseJson, calculateTotal } from '../utils/index.js'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const filePath = path.join(__dirname, 'db.json')

export class UserModel {
  static saveDni = async (dni) => {
    const parseJson = getParseJson(__dirname, filePath)
    parseJson.currentUser = dni

    try {
      const updatedData = JSON.stringify(parseJson)
      fs.writeFileSync(filePath, updatedData)
      return parseJson
    } catch (err) {
      throw new Error(err)
    }
  }
}

export class TaskModel {
  static getAll = async (isTestMode) => {
    const file = isTestMode ? 'db-test.json' : 'db.json'
    const filePath = path.join(__dirname, file)
    const parseTask = getParseJson(__dirname, filePath)
    return parseTask
  }

  static getById = async (id, isTestMode) => {
    const file = isTestMode ? 'db-test.json' : 'db.json'
    const filePath = path.join(__dirname, file)
    const data = getParseJson(__dirname, filePath)
    const { tasks } = data

    // Concateno los dos array para poder realizar la busqueda
    const task = [...tasks.all, ...tasks.history].find(task => task.id === id)
    return task
  }

  static completedTask = async (id) => {
    const data = getParseJson(__dirname, filePath)
    const indexTask = data?.tasks.all.findIndex(task => task.id === id)
    if (indexTask < 0) return null

    // Si el indexTask es mayor a cero entonces la tarea existe, la guardamos en una variable para poder agregar
    // los atributos `endTiem` y `total`.
    let currentTask = data.tasks.all[indexTask]

    // Traemos la fecha y la hora en la que se finalizo la tarea
    const { fullHour, date } = getFullHour()

    // Calculamos el tiempo total que se tardo en terminar la tarea
    const totalTime = calculateTotal(currentTask?.date, date)

    currentTask = {
      ...currentTask,
      endTime: fullHour,
      total: totalTime
    }

    data.tasks.history.push(currentTask)

    // Eliminamos la tarea que se completo del array de tareas pendientes

    const filteredTasks = data.tasks.all.filter(task => task.id !== id)
    data.tasks.all = filteredTasks

    const updatedData = JSON.stringify(data)
    fs.writeFileSync(filePath, updatedData)
    return data
  }

  static addTask = async (task, isTestMode) => {
    try {
      const file = isTestMode ? 'db-test.json' : 'db.json'
      const filePath = path.join(__dirname, file)
      const parseTask = getParseJson(__dirname, filePath)
      const { fullHour, date } = getFullHour()

      const newTask = {
        id: randomUUID(),
        title: task,
        startTime: fullHour,
        date
      }

      parseTask?.tasks.all.push(newTask)

      const updatedData = JSON.stringify(parseTask)
      fs.writeFileSync(filePath, updatedData)
      return newTask
    } catch (err) {
      throw new Error(err)
    }
  }

  static updateTask = async (id, task, isPending, isTestMode) => {
    const file = isTestMode ? 'db-test.json' : 'db.json'
    const filePath = path.join(__dirname, file)
    const parseTask = getParseJson(__dirname, filePath)
    let indexTaskToUpdate

    // Verificamos en donde tenemos que  buscar la tarea a modificar
    if (isPending === 'true') {
      indexTaskToUpdate = parseTask.tasks.all.findIndex(task => task.id === id)

      if (indexTaskToUpdate < 0) return null
      parseTask.tasks.all[indexTaskToUpdate].title = task
    } else {
      indexTaskToUpdate = parseTask.tasks.history.findIndex(task => task.id === id)

      if (indexTaskToUpdate < 0) return null
      parseTask.tasks.history[indexTaskToUpdate].title = task
    }

    const updatedData = JSON.stringify(parseTask)
    fs.writeFileSync(filePath, updatedData)
    return parseTask
  }
}
