import { createContext, useState } from 'react'
import { API_URL } from '../consts'
const ModalContext = createContext()

const ModalProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [currentTaskId, setCurrentTaskId] = useState()

  const closeEditModal = () => setOpenEditModal(false)

  const handleOpenEditModal = (taskId) => {
    fetch(`${API_URL}/${taskId}`)
      .then(res => {
        if (!res.ok) throw new Error('Unexpected error')
        return res.json()
      })
      .then(({ data }) => setTaskToEdit(data))
      .catch(err => { throw new Error(err) })

    setOpenEditModal(true)
  }
  const handleOpenModal = (taskId) => {
    setCurrentTaskId(taskId)
    setOpenModal(!openModal)
  }

  return (
    <ModalContext.Provider value={
      {
        openModal,
        handleOpenModal,
        openEditModal,
        handleOpenEditModal,
        closeEditModal,
        taskToEdit,
        currentTaskId
      }
}
    >
      {children}
    </ModalContext.Provider>
  )
}

export { ModalContext, ModalProvider }
