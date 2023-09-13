import { Router } from 'express'
import { TaskModel } from '../data/index.js'
export const router = Router()

router.get('/', async (_, res) => {
  const tasks = await TaskModel.getAll()
  res.status(200).json({
    error: false,
    data: tasks
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const task = await TaskModel.getById(id)

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
  const { pending } = req.query

  const updatedTask = await TaskModel.updateTask(id, task, pending)

  if (!updatedTask) return res.status(404).json({ error: true, message: `Task with ID: ${id} not found`, data: null })
  res.status(200).json({ error: false, message: null, data: updatedTask })
})

router.post('/', async (req, res) => {
  const { task } = req.body

  if (!task) {
    return res.status(400).json({
      error: true,
      message: 'La task es requerida',
      data: null
    })
  }

  try {
    const newTask = await TaskModel.addTask(task)
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
