import palabras from "../data/palabras5.json"

export const getPalabraSecreta = (): string => {
  const hoy = new Date()
  const seed = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
  const index = seed % palabras.length
  return palabras[index].toLowerCase()
}
