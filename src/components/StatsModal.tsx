import type React from "react"
import { useState, useEffect, useRef } from "react"

interface StatsModalProps {
  stats: {
    ganadas: number
    perdidas: number
    distribucion?: Record<number, number>
    puntajes: number[]
  }
}

const StatsModal: React.FC<StatsModalProps> = ({ stats }) => {
  const [isOpen, setIsOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const totalJuegos = stats.ganadas + stats.perdidas
  const porcentajeVictorias = totalJuegos > 0 ? Math.round((stats.ganadas / totalJuegos) * 100) : 0
  const distribucion = stats.distribucion || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  const maxValue = Math.max(...Object.values(distribucion), 1)

  const puntajePromedio =
    stats.puntajes.length > 0
      ? Math.round(stats.puntajes.reduce((a, b) => a + b, 0) / stats.puntajes.length)
      : 0

  const maxPuntaje = Math.max(...stats.puntajes, 10)
  const ultimosPuntajes = stats.puntajes.slice(-10)

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas dimensions
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      ctx.scale(dpr, dpr)
      
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Draw background grid
      ctx.beginPath()
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      for (let i = 0; i <= 5; i++) {
        const y = rect.height - (i * rect.height) / 5
        ctx.moveTo(0, y)
        ctx.lineTo(rect.width, y)
      }
      ctx.stroke()

      if (ultimosPuntajes.length === 0) {
        ctx.fillStyle = '#6b7280'
        ctx.font = '12px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText('No hay datos suficientes', rect.width / 2, rect.height / 2)
        return
      }

      // Draw line graph
      ctx.beginPath()
      ctx.strokeStyle = '#818cf8'
      ctx.lineWidth = 2

      ultimosPuntajes.forEach((puntaje, index) => {
        const x = (index * rect.width) / Math.max(ultimosPuntajes.length - 1, 1)
        const y = rect.height - (puntaje * rect.height) / maxPuntaje
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Draw points
      ultimosPuntajes.forEach((puntaje, index) => {
        const x = (index * rect.width) / Math.max(ultimosPuntajes.length - 1, 1)
        const y = rect.height - (puntaje * rect.height) / maxPuntaje
        
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#818cf8'
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.stroke()
      })

      // Add score labels
      ctx.fillStyle = '#6b7280'
      ctx.font = '10px system-ui'
      ctx.textAlign = 'left'
      
      ultimosPuntajes.forEach((puntaje, index) => {
        const x = (index * rect.width) / Math.max(ultimosPuntajes.length - 1, 1)
        const y = rect.height - (puntaje * rect.height) / maxPuntaje
        ctx.fillText(puntaje.toString(), x - 6, y - 8)
      })
    }
  }, [isOpen, stats.puntajes, maxPuntaje])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
      >
        📈 Estadísticas
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 max-w-sm w-full">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold dark:text-white">Estadísticas</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✖
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-xl font-bold dark:text-white">{totalJuegos}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Jugadas</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold dark:text-white">{porcentajeVictorias}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Victorias</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold dark:text-white">{puntajePromedio}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Puntaje prom.</p>
              </div>
            </div>

            <h3 className="font-semibold mb-1.5 text-sm dark:text-white">Distribución de intentos</h3>
            <div className="space-y-1 mb-3">
              {Object.entries(distribucion).map(([intento, cantidad]) => (
                <div key={intento} className="flex items-center gap-2">
                  <span className="w-4 text-xs dark:text-white">{intento}</span>
                  <div
                    className="bg-green-500 h-4 rounded text-xs text-white flex items-center px-1"
                    style={{ width: `${(cantidad / maxValue) * 100}%`, minWidth: cantidad > 0 ? "20px" : "0" }}
                  >
                    {cantidad > 0 && cantidad}
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-semibold mb-1.5 text-sm dark:text-white">Gráfico de puntajes</h3>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-2 mb-3">
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '120px' }}
                className="w-full"
              />
            </div>

            <h3 className="font-semibold mb-1.5 text-sm dark:text-white">Últimos puntajes</h3>
            <div className="flex gap-1 flex-wrap">
              {ultimosPuntajes.map((puntaje, idx) => (
                <div
                  key={idx}
                  className={`text-white px-2 py-0.5 rounded text-xs font-bold ${
                    puntaje === 0 ? 'bg-red-500' : 'bg-indigo-500'
                  }`}
                >
                  {puntaje}
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