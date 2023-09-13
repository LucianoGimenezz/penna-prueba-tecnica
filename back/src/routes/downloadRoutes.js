import { Router } from 'express'
import { createObjectCsvWriter } from 'csv-writer'
import { TaskModel } from '../data/index.js'

export const router = Router()

router.get('/', async (req, res) => {
  const { tasks } = await TaskModel.getAll()

  const csvWriter = createObjectCsvWriter({
    path: 'reporte.csv',
    header: [
      { id: 'title', title: 'Tarea' },
      { id: 'startTime', title: 'Hora de inicio' },
      { id: 'endTime', title: 'Hora de finalizacion' },
      { id: 'total', title: 'Tiempo total' }
    ]
  })

  csvWriter.writeRecords(tasks)
    .then(() => {
    // Envíar el archivo CSV como respuesta
      res.download('reporte.csv', 'reporte.csv', (error) => {
        if (error) {
          console.error(error)
          res.status(500).json({ error: 'Error al descargar el archivo CSV' })
        }
      })
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ error: 'Error al escribir el archivo CSV' })
    })
})
