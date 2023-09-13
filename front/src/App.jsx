import { useState, useContext, useEffect } from 'react'
import { ModalContext } from './context'
import TaskTable from './components/TaskTable'
import EditTask from './components/EditTask'
import { API_URL, LOCALSTORAGE_KEY } from './consts'
import CompletedTask from './components/CompletedTask'
import RegisterDNI from './components/RegisterDNI'

function App () {
  const { openModal, openEditModal } = useContext(ModalContext)
  const [tasks, setTask] = useState()
  const [isUserRegisterd, setIsUserRegistered] = useState(false)
  const [currentPath, setCurrentPath] = useState('')

  const checkIfUserIsRegistered = () => {
    const isRegistered = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY))

    if (isRegistered) return true

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(true))
    setIsUserRegistered(true)
    return false
  }

  const handleTap = (pathname) => {
    window.history.pushState(null, '', pathname)
    setCurrentPath(pathname)
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

    if (!checkIfUserIsRegistered()) return

    fetch(`${API_URL}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task })
    })
      .then(res => {
        if (!res.ok) throw new Error('Unexpected error')
        return res.json()
      })
      .then(({ data }) => {
        const prevValues = tasks
        prevValues?.all.push(data)
        setTask({ ...prevValues })
      })
      .catch(err => console.error(err))
    even.target.reset()
  }

  useEffect(() => {
    const pathname = window.location.pathname

    if (pathname === '/task' || pathname === '/history') setCurrentPath(pathname.split('/')[1])

    fetch(`${API_URL}/task`)
      .then(res => {
        if (!res.ok) throw new Error('Unexpected error')
        return res.json()
      })
      .then(({ data: { tasks } }) => setTask(tasks))
      .catch(err => console.error(err))
  }, [])

  return (
    <main className='w-screen min-h-screen flex flex-col '>
      {isUserRegisterd && <RegisterDNI setIsUserRegistered={setIsUserRegistered} />}
      {openModal && <CompletedTask setTask={setTask} />}
      {openEditModal && <EditTask setTask={setTask} />}
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

        <ul className='flex  w-40 items-center justify-center mt-6'>
          <div
            onClick={() => handleTap('task')}
            className={`w-1/2 border-b flex justify-center transition-colors  p-2 ${currentPath !== 'history' ? 'border-b-white' : 'border-b-transparent'}`}
          >
            <li className='text-xl  mr-3 cursor-pointer'>Tareas</li>
          </div>
          <div
            onClick={() => handleTap('history')}
            className={`w-1/2 flex border-b  transition-colors justify-center p-2 ${currentPath === 'history' ? 'border-b-white' : 'border-b-transparent'}`}
          >
            <li className='text-xl cursor-pointer'>Historial</li>
          </div>

        </ul>
        {currentPath !== 'history' && tasks?.all?.length > 0 && (
          <>
            <section className='w-full mt-4'>
              <TaskTable tasks={tasks?.all} />
            </section>

            <footer className='w-full mt-12'>
              <a download href='http://localhost:3001/download?target=pending' className='bg-green-600 text-white px-4 py-4 rounded-lg cursor-pointer'>Descargar CSV</a>
            </footer>
          </>
        )}

        {currentPath === 'history' && tasks?.history?.length > 0 && (
          <>
            <section className='w-full mt-4'>
              <TaskTable tasks={tasks?.history} />
            </section>

            <footer className='w-full mt-12'>
              <a download href='http://localhost:3001/download?target=history' className='bg-green-600 text-white px-4 py-4 rounded-lg cursor-pointer'>Descargar CSV</a>
            </footer>
          </>
        )}
      </section>

    </main>
  )
}

export default App
