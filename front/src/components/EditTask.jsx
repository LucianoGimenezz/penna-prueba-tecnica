import { useContext, useEffect, useState } from 'react'
import Modal from './Modal'
import { ModalContext } from '../context'

export default function EditTask () {
  const { closeEditModal, taskToEdit } = useContext(ModalContext)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (taskToEdit?.title) {
      setInputValue(taskToEdit?.title)
    }
  }, [taskToEdit])

  return (
    <Modal>
      <form className='w-1/2 p-4  flex flex-col gap-y-2'>
        <input
          type='text'
          value={inputValue}
          autoFocus
          onChange={event => setInputValue(event.targe.value)} className='py-2 p-3'
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
