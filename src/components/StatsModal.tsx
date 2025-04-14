import type React from "react"
import { useState } from "react"

interface StatsModalProps {
  stats: {
    ganadas: number
    perdidas: number
    distribucion?: Record<number, number>
  }
}

const StatsModal: React.FC<StatsModalProps> = ({ stats }) => {
  const [isOpen, setIsOpen] = useState(false)

  const totalJuegos = stats.ganadas + stats.perdidas
  const porcentajeVictorias = totalJuegos > 0 ? Math.round((stats.ganadas / totalJuegos) * 100) : 0

  // Distribución de intentos (simulada si no existe)
  const distribucion = stats.distribucion || {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  }

  const maxValue = Math.max(...Object.values(distribucion), 1)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
      >
        Estadísticas
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">Estadísticas</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold dark:text-white">{totalJuegos}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Jugadas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold dark:text-white">{porcentajeVictorias}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Victorias</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold dark:text-white">{stats.ganadas}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ganadas</p>
              </div>
            </div>

            <h3 className="font-semibold mb-2 dark:text-white">Distribución de intentos</h3>
            <div className="space-y-1">
              {Object.entries(distribucion).map(([intento, cantidad]) => (
                <div key={intento} className="flex items-center gap-2">
                  <span className="w-4 text-xs dark:text-white">{intento}</span>
                  <div
                    className="bg-green-500 h-5 rounded text-xs text-white flex items-center px-1"
                    style={{ width: `${(cantidad / maxValue) * 100}%`, minWidth: cantidad > 0 ? "20px" : "0" }}
                  >
                    {cantidad > 0 && cantidad}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StatsModal
