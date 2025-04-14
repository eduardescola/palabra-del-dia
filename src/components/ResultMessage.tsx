import type React from "react"

interface ResultMessageProps {
  ganaste: boolean
  palabraSecreta?: string
}

const ResultMessage: React.FC<ResultMessageProps> = ({ ganaste, palabraSecreta }) => {
  return (
    <div className="mt-2 text-center animate-fadeIn">
      <h2
        className={`text-lg font-bold ${
          ganaste ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        }`}
      >
        {ganaste ? "¡Felicidades! ¡Has ganado!" : "¡Lo siento! Has perdido."}
      </h2>

      {!ganaste && palabraSecreta && (
        <p className="mt-1 text-gray-700 dark:text-gray-300">
          La palabra era: <strong>{palabraSecreta}</strong>
        </p>
      )}
    </div>
  )
}

export default ResultMessage
