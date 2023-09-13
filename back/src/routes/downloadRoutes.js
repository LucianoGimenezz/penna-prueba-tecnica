import { Router } from 'express'
import { createObjectCsvWriter } from 'csv-writer'
import { TaskModel } from '../data/index.js'

export const router = Router()

router.get('/', async (req, res) => {
  const { target } = req.query
  const { tasks } = await TaskModel.getAll()
  const nameFile = `reporte_${target}.csv`

  const csvWriter = createObjectCsvWriter({
    path: nameFile,
    header: [
      { id: 'title', title: 'Tarea' },
      { id: 'startTime', title: 'Hora de inicio' },
      { id: 'endTime', title: 'Hora de finalizacion' },
      { id: 'total', title: 'Tiempo total' }
    ]
  })

  const data = target === 'history' ? tasks.history : tasks.all
  csvWriter.writeRecords(data)
    .then(() => {
    // Envíar el archivo CSV como respuesta
      res.download(nameFile, nameFile, (error) => {
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
