export const getFullHour = () => {
  const fullDate = new Date()
  const hour = fullDate.getHours()
  const minutes = fullDate.getMinutes() < 10 ? `0${fullDate.getMinutes()}` : fullDate.getMinutes()
  const seconds = fullDate.getSeconds() < 10 ? `0${fullDate.getSeconds()}` : fullDate.getSeconds()

  return { fullHour: `${hour}:${minutes}:${seconds}`, date: fullDate }
}
