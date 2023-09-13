import { useContext } from 'react'
import { CheckIcon, EditIcon } from './Icons'
import './TaskTable.css'
import { ModalContext } from '../context'

export default function TaskTable ({ tasks }) {
  const { handleOpenModal, handleOpenEditModal } = useContext(ModalContext)
  return (
    <table width='100%'>
      <thead>
        <tr>
          <th className='left'>Tarea</th>
          <th>Hora de inicio</th>
          <th>Hora de finalizacion</th>
          <th>Tiempo total</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {tasks?.map((task) => (
          <tr key={task.id}>
            <td className='left'>{task?.title}</td>
            <td>{task?.startTime}</td>
            <td>{task?.endTime || '--'}</td>
            <td>{task?.total || '--'}</td>
            <td className='flex justify-center cursor-pointer gap-x-2'>
              <span onClick={() => handleOpenModal(task.id)}>
                <CheckIcon />
              </span>
              <span onClick={() => handleOpenEditModal(task.id)}>
                <EditIcon />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
