import type React from "react"
import { useEffect } from "react"

interface ResultMessageProps {
  ganaste: boolean
  palabraSecreta?: string
  puntaje: {
    correctas: number
    presentes: number
  }
  onClose: () => void
}

const ResultMessage: React.FC<ResultMessageProps> = ({ ganaste, palabraSecreta, puntaje, onClose }) => {
  const { correctas, presentes } = puntaje
  const puntajeTotal = correctas * 2 + presentes

  useEffect(() => {
    const timer = setTimeout(onClose, 4000) // se cierra a los 4 segundos
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-800 shadow-lg rounded-2xl px-6 py-4 z-50 animate-fadeInUp border dark:border-zinc-700">
      <h2
        className={`text-lg font-bold text-center ${
          ganaste ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        }`}
      >
        {ganaste ? "¡Felicidades! 🎉" : "¡Lo siento! 😔"}
      </h2>

      {!ganaste && palabraSecreta && (
        <p className="text-center mt-1 text-gray-700 dark:text-gray-300">
          La palabra era: <strong>{palabraSecreta}</strong>
        </p>
      )}

      <div className="mt-3 text-sm text-gray-800 dark:text-gray-200 text-center">
        <p>
          Letras correctas (🟩): <strong>{correctas}</strong>
        </p>
        <p>
          Letras presentes (🟨): <strong>{presentes}</strong>
        </p>
        <p className="mt-1 font-medium">
          Puntuación total: <span className="text-blue-600 dark:text-blue-400">{puntajeTotal}</span>
        </p>
      </div>
    </div>
  )
}

export default ResultMessage
