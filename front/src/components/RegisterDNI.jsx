import { API_URL } from '../consts'
import Modal from './Modal'

export default function RegisterDNI ({ setIsUserRegistered }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const fomrmData = new FormData(event.target)
    const dni = Number(fomrmData.get('dni'))

    if (dni === 0) return

    fetch(`${API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dni })
    })
      .then(res => {
        if (!res.ok) throw new Error('Unexpected error')
        return res.json()
      })
      .then(data => console.log({ data }))
      .catch(err => console.error(err))
      .finally(() => {
        setIsUserRegistered(false)
      })
  }

  return (
    <Modal>
      <form onSubmit={handleSubmit} className='w-1/2 bg-[#333] flex flex-col p-4 gap-y-2'>
        <h2 className='text-center'>Por favor ingrese su DNI</h2>
        <input type='number' name='dni' className='py-2 p-2' autoFocus min={0} />
        <button className='bg-blue-600'>Agregar</button>
      </form>
    </Modal>
  )
}
