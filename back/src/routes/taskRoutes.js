import { Router } from 'express'
import { TaskModel } from '../data/index.js'
export const router = Router()

router.get('/', async (req, res) => {
  const { test } = req.query
  const tasks = await TaskModel.getAll(test)
  res.status(200).json({
    error: false,
    data: tasks
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const { test } = req.query
  const task = await TaskModel.getById(id, test)

  if (!task) return res.status(404).json({ error: true, message: `Task with ID: ${id} not found`, data: null })

  res.status(200).json({ error: false, message: null, data: task })
})

router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const updatedTask = await TaskModel.completedTask(id)

  if (!updatedTask) return res.status(404).json({ error: true, message: `Task with ID: ${id} not found`, data: null })

  res.status(200).json({ error: false, message: null, data: updatedTask })
})

router.put('/:id', async (req, res) => {
  const { task } = req.body
  const { id } = req.params
  const { pending, test } = req.query

  const updatedTask = await TaskModel.updateTask(id, task, pending, test)

  if (!updatedTask) return res.status(404).json({ error: true, message: `Task with ID: ${id} not found`, data: null })
  res.status(200).json({ error: false, message: null, data: updatedTask })
})

router.post('/', async (req, res) => {
  const { task } = req.body
  const { test } = req.query

  if (!task) {
    return res.status(400).json({
      error: true,
      message: 'La task es requerida',
      data: null
    })
  }

  try {
    const newTask = await TaskModel.addTask(task, test)
    res.status(201).json({
      error: false,
      message: null,
      data: newTask
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: true,
      message: 'Unexpected error',
      data: null
    })
  }
})
