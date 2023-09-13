import { useContext, useEffect, useState } from 'react'
import Modal from './Modal'
import { ModalContext } from '../context'
import { API_URL } from '../consts'

export default function EditTask ({ setTask }) {
  const { closeEditModal, taskToEdit } = useContext(ModalContext)
  const [inputValue, setInputValue] = useState('')

  const onEditTask = (event) => {
    event.preventDefault()
    const cleanInput = inputValue.trim()

    if (!cleanInput) return

    const isPending = !taskToEdit?.endTime

    fetch(`${API_URL}/task/${taskToEdit?.id}?pending=${isPending}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task: inputValue })
    })
      .then(res => {
        if (!res.ok) throw new Error('Unexpected error')
        return res.json()
      })
      .then(({ data: { tasks } }) => setTask(tasks))
      .catch(err => console.error(err))
      .finally(() => closeEditModal())
  }

  useEffect(() => {
    if (taskToEdit?.title) {
      setInputValue(taskToEdit?.title)
    }
  }, [taskToEdit])

  return (
    <Modal>
      <form onSubmit={onEditTask} className='w-1/2 p-4  flex flex-col gap-y-2'>
        <input
          type='text'
          value={inputValue}
          autoFocus
          onChange={event => setInputValue(event.target.value)} className='py-2 p-3'
        />
        <div className='w-1/2 m-auto flex items-center justify-center gap-x-2'>
          <button
            type='button'
            className='bg-[#333]'
            onClick={closeEditModal}
          >
            Cancelar
          </button>
          <button className='bg-blue-600'>Editar</button>
        </div>
      </form>
    </Modal>
  )
}
