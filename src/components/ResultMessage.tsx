import type React from "react"

interface ResultMessageProps {
  ganaste: boolean
  palabraSecreta?: string
  puntaje: {
    correctas: number
    presentes: number
  }
}

const ResultMessage: React.FC<ResultMessageProps> = ({ ganaste, palabraSecreta, puntaje }) => {
  const { correctas, presentes } = puntaje
  const puntajeTotal = correctas * 2 + presentes

  return (
    <div className="text-center">
      <h2
        className={`text-lg font-bold ${
          ganaste ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
        }`}
      >
        {ganaste ? "¡Felicidades! 🎉" : "¡Lo siento! 😔"}
      </h2>

      {!ganaste && palabraSecreta && (
        <p className="mt-1 text-gray-700 dark:text-gray-300">
          La palabra era: <strong>{palabraSecreta}</strong>
        </p>
      )}

      {/* Puntuación */}
      <div className="mt-3 text-sm text-gray-800 dark:text-gray-200">
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