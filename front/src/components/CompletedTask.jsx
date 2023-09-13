import { API_URL } from '../consts'
import { ModalContext } from '../context'
import { useContext } from 'react'
import Modal from './Modal'

export default function CompletedTask ({ setTask }) {
  const { handleOpenModal, currentTaskId } = useContext(ModalContext)

  const onFinishedTask = (event) => {
    event.preventDefault()
    fetch(`${API_URL}/task/${currentTaskId}`, {
      method: 'PATCH'
    })
      .then(res => {
        if (!res.ok) throw new Error('Unexpected error')
        return res.json()
      })
      .then(({ data }) => {
        setTask(data.tasks)
      })
      .catch(err => console.error(err))
      .finally(() => {
        handleOpenModal()
      })
  }

  return (
    <Modal>
      <form onSubmit={onFinishedTask} className='w-1/2 bg-[#555]  rounded-sm p-8  flex flex-col gap-y-2'>
        <h2 className='text-center text-xl'>Deseas finalizar la tarea?</h2>
        <div className='w-1/2 mt-8 m-auto flex items-center justify-center gap-x-2'>
          <button
            type='button'
            className='bg-[#333]'
            onClick={handleOpenModal}
          >
            Cancelar
          </button>
          <button className='bg-blue-600'>Finalizar</button>
        </div>
      </form>
    </Modal>
  )
}
