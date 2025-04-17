import palabras from "../data/palabras5.json"

// Modificación para aceptar un parámetro de tipo booleano
export const getPalabraSecreta = (aleatoria: boolean = false): string => {
  if (aleatoria) {
    // Si aleatoria es true, seleccionamos una palabra aleatoria
    const index = Math.floor(Math.random() * palabras.length)
    return palabras[index].toLowerCase()
  } else {
    // Si aleatoria es false, seleccionamos la palabra del día basada en la fecha
    const hoy = new Date()
    const seed = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
    const index = seed % palabras.length
    return palabras[index].toLowerCase()
  }
}
