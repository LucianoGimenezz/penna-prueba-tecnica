export const calculateTotal = (startDate, finishedDate) => {
  const start = new Date(startDate)
  const finished = new Date(finishedDate)

  // Calculo la diferencia en milisegundos

  const differences = start - finished

  const seconds = Math.abs(Math.floor(differences / 1000) % 60) - 1
  const minutes = Math.abs(Math.floor(differences / 60000) % 60) - 1
  const hour = Math.abs(Math.floor(differences / 3600000)) - 1

  const parseMinutes = minutes < 10 ? `0${minutes}` : minutes
  const parseSeconds = seconds < 10 ? `0${seconds}` : seconds
  const parseHour = hour < 10 ? `0${hour}` : hour

  return `${parseHour}:${parseMinutes}:${parseSeconds}`
}
