import type React from "react"
import { evaluarIntento, type LetraEstado } from "../utils/getLetraEstado"

interface GridProps {
  intentos: string[]
  intentoActual: string
  maxIntentos: number
  longitudPalabra: number
  palabraSecreta: string
  animacionError?: boolean
}

const getColor = (estado: LetraEstado) => {
  switch (estado) {
    case "correcta":
      return "bg-green-500 text-white border-green-500"
    case "presente":
      return "bg-yellow-400 text-white border-yellow-400"
    default:
      return "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white"
  }
}

const Grid: React.FC<GridProps> = ({
  intentos,
  intentoActual,
  maxIntentos,
  longitudPalabra,
  palabraSecreta,
  animacionError = false,
}) => {
  const filas = []

  for (let i = 0; i < maxIntentos; i++) {
    const intento = intentos[i] || (i === intentos.length ? intentoActual : "")
    const letras = intento.padEnd(longitudPalabra).split("")

    let estados: LetraEstado[] = Array(longitudPalabra).fill("incorrecta")
    if (i < intentos.length) {
      estados = evaluarIntento(intento, palabraSecreta)
    }

    const esFilaActual = i === intentos.length
    const animacionClase = esFilaActual && animacionError ? "animate-shake" : ""

    filas.push(
      <div key={i} className={`flex gap-1 mb-1 justify-center ${animacionClase}`}>
        {letras.map((letra, j) => {
          const animacion = i < intentos.length ? "animate-flipIn" : ""
          const esLetraActual = esFilaActual && j === intentoActual.length - 1
          const pulsoClase = esLetraActual ? "animate-pulse" : ""

          return (
            <div
              key={j}
              className={`w-9 h-9 border-2 rounded flex items-center justify-center text-base font-bold uppercase transition-all duration-300 ${
                i < intentos.length
                  ? getColor(estados[j])
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              } ${animacion} ${pulsoClase}`}
            >
              {letra !== " " ? letra : ""}
            </div>
          )
        })}
      </div>,
    )
  }

  return <div className="mb-2 w-full flex flex-col items-center">{filas}</div>
}

export default Grid
