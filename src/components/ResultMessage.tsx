import { useEffect } from "react"
import confetti from "canvas-confetti"

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
    if (ganaste) {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
      })
    } else {
      // Animación de "sacudida" al perder
      const body = document.body
      body.classList.add("shake")

      setTimeout(() => {
        body.classList.remove("shake")
      }, 1000)
    }

    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [ganaste, onClose])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-2xl px-6 py-4 animate-fadeInUp border dark:border-zinc-700">
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
    </div>
  )
}

export default ResultMessage
