import type React from "react"
import type { LetraEstado } from "../utils/getLetraEstado"

interface KeyboardProps {
  letrasEstado: Record<string, LetraEstado>
  onKeyClick: (letra: string) => void
}

const filas = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
]

const getColor = (estado: LetraEstado | undefined) => {
  switch (estado) {
    case "correcta":
      return "bg-green-500 text-white shadow-sm"
    case "presente":
      return "bg-yellow-400 text-white shadow-sm"
    case "incorrecta":
      return "bg-gray-400 text-white shadow-sm"
    default:
      return "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm"
  }
}

const Keyboard: React.FC<KeyboardProps> = ({ letrasEstado, onKeyClick }) => {
  return (
    <div className="flex flex-col items-center gap-1.5 mt-2 w-full">
      {filas.map((fila, idx) => (
        <div key={idx} className="flex gap-1 w-full justify-center">
          {fila.map((letra) => {
            const estado = letrasEstado[letra.toLowerCase()]
            const colorClass = getColor(estado)
            return (
              <button
                key={letra}
                onClick={() => onKeyClick(letra.toLowerCase())}
                className={`w-8 h-10 sm:w-9 sm:h-11 rounded-md font-bold text-sm ${colorClass} transition-all duration-200 hover:opacity-90 active:scale-95 transform hover:-translate-y-0.5`}
              >
                {letra}
              </button>
            )
          })}
        </div>
      ))}
      <div className="flex gap-2 mt-2 w-full justify-center">
        <button
          onClick={() => onKeyClick("enter")}
          className="px-3 h-10 sm:h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-bold text-xs hover:opacity-90 active:scale-95 transform hover:-translate-y-0.5 shadow-sm"
        >
          ENTER
        </button>
        <button
          onClick={() => onKeyClick("backspace")}
          className="px-3 h-10 sm:h-11 bg-red-500 hover:bg-red-600 text-white rounded-md font-bold text-xs hover:opacity-90 active:scale-95 transform hover:-translate-y-0.5 shadow-sm"
        >
          ⌫
        </button>
      </div>
    </div>
  )
}

export default Keyboard
