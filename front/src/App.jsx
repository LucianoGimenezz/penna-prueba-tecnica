import { useState, useContext, useEffect } from 'react'
import { ModalContext } from './context'
import TaskTable from './components/TaskTable'
import EditTask from './components/EditTask'
import { API_URL } from './consts'
import CompletedTask from './components/CompletedTask'

function App () {
  const { openModal, openEditModal } = useContext(ModalContext)
  const [tasks, setTask] = useState([])

  const getFullHour = () => {
    const fullDate = new Date()
    const hour = fullDate.getHours()
    const minutes = fullDate.getMinutes() < 10 ? `0${fullDate.getMinutes()}` : fullDate.getMinutes()
    const seconds = fullDate.getSeconds() < 10 ? `0${fullDate.getSeconds()}` : fullDate.getSeconds()

    return { fullHour: `${hour}:${minutes}:${seconds}`, date: fullDate }
  }

  const onSaveTask = (even) => {
    even.preventDefault()

    // Creo un formData para obtener el input por el atributo `name`
    const formData = new FormData(even.target)
    const task = formData.get('task').trim()

    if (!task) {
      even.target.reset()
      return
    }

    const { fullHour: currentDate, date } = getFullHour()

    const newTask = {
      title: task,
      date,
      startTime: currentDate
    }

    setTask([...tasks, newTask])
    even.target.reset()
  }

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Unexpected error')
        return res.json()
      })
      .then(({ data: { tasks } }) => setTask(tasks))
      .catch(err => console.error(err))
  }, [])

  return (
    <main className='w-screen min-h-screen flex flex-col '>
      {openModal && <CompletedTask />}
      {openEditModal && <EditTask />}
      <header className='w-full p-4 mt-10'>
        <img src='https://grupopenna.com.ar/images/logoi.png' alt='Logo del grupo penna' />
      </header>
      <section className='flex flex-col mt-10 w-full p-4'>
        <h1 className='font-semibold text-5xl'>Listado de tareas</h1>
        <form onSubmit={onSaveTask} className='w-full flex flex-col mt-4'>
          <label>Nombre de la tarea:</label>
          <input type='text' className='py- p-2' name='task' />
          <button className='mt-4 w-40 bg-blue-600'>Agregar Tarea</button>
        </form>

        <section className='w-full mt-4'>
          {tasks.length > 0 && <TaskTable tasks={tasks} />}
        </section>
      </section>

      <footer className='w-full mt-4 p-4'>
        {tasks.length > 0 && <button className='bg-green-600'>Descargar CSV</button>}
      </footer>
    </main>
  )
}

export default App
