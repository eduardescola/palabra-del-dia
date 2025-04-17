import type React from "react"
import { useEffect, useRef, useState } from "react"
import Grid from "./components/Grid"
import ResultMessage from "./components/ResultMessage"
import Keyboard from "./components/Keyboard"
import { evaluarIntento, type LetraEstado } from "./utils/getLetraEstado"
import { getPalabraSecreta } from "./utils/getPalabraSecreta"
import { palabrasValidas } from "./utils/palabrasValidas"
import DarkModeToggle from "./components/DarkModeToggle"
import StatsModal from "./components/StatsModal"

const MAX_INTENTOS = 6

const Game: React.FC = () => {
  const [palabraSecreta, setPalabraSecreta] = useState<string | null>(null)
  const [intentos, setIntentos] = useState<string[]>([])
  const [intentoActual, setIntentoActual] = useState<string>("")
  const [ganaste, setGanaste] = useState<boolean | null>(null)
  const [letrasEstado, setLetrasEstado] = useState<Record<string, LetraEstado>>({})
  const [mensajeError, setMensajeError] = useState<string>("")
  const [animacionError, setAnimacionError] = useState(false)
  const [puntajeFinal, setPuntajeFinal] = useState<{ correctas: number; presentes: number } | null>(null)
  const [mostrarResultado, setMostrarResultado] = useState<boolean>(false)
  const [stats, setStats] = useState<{
    ganadas: number
    perdidas: number
    distribucion: Record<number, number>
    puntajes: number[]
  }>({
    ganadas: 0,
    perdidas: 0,
    distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    puntajes: [],
  })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPalabraSecreta(getPalabraSecreta())
    const guardadas = localStorage.getItem("stats")
    if (guardadas) {
      try {
        const parsedStats = JSON.parse(guardadas)
        if (!parsedStats.distribucion) {
          parsedStats.distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
        }
        if (!parsedStats.puntajes) {
          parsedStats.puntajes = []
        }
        setStats(parsedStats)
      } catch (e) {
        console.error("Error al cargar estadísticas:", e)
      }
    }
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [intentoActual, palabraSecreta])

  const calcularPuntajeFinal = (intento: string, palabraSecreta: string) => {
    const resultado = evaluarIntento(intento, palabraSecreta)
    let correctas = 0
    let presentes = 0

    resultado.forEach((estado) => {
      if (estado === "correcta") correctas += 1
      if (estado === "presente") presentes += 1
    })

    return { correctas, presentes }
  }

  const guardarStats = (resultado: "ganada" | "perdida", intentosUsados?: number, intento?: string) => {
    const nuevasStats = { ...stats }

    if (resultado === "ganada") {
      nuevasStats.ganadas += 1
      if (intentosUsados && intentosUsados <= MAX_INTENTOS) {
        nuevasStats.distribucion[intentosUsados] = (nuevasStats.distribucion[intentosUsados] || 0) + 1
        const { correctas, presentes } =
          intento && palabraSecreta ? calcularPuntajeFinal(intento, palabraSecreta) : { correctas: 0, presentes: 0 }
        const puntaje = correctas * 2 + presentes
        nuevasStats.puntajes.push(puntaje)
      }
    } else {
      nuevasStats.perdidas += 1
      nuevasStats.puntajes.push(0)
    }

    setStats(nuevasStats)
    localStorage.setItem("stats", JSON.stringify(nuevasStats))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key.toLowerCase()
    handleKeyInput(key)
  }

  const handleKeyInput = (letra: string) => {
    if (!palabraSecreta || ganaste !== null) return

    setMensajeError("")

    if (letra === "enter") {
      if (intentoActual.length !== palabraSecreta.length) {
        mostrarError("La palabra debe tener 5 letras")
        return
      }

      if (!palabrasValidas.has(intentoActual)) {
        mostrarError("Palabra no válida")
        return
      }

      const nuevosIntentos = [...intentos, intentoActual]
      const resultado = evaluarIntento(intentoActual, palabraSecreta)
      actualizarEstados(intentoActual, resultado)

      const puntaje = calcularPuntajeFinal(intentoActual, palabraSecreta)
      setPuntajeFinal(puntaje)

      setIntentos(nuevosIntentos)

      if (intentoActual === palabraSecreta) {
        setGanaste(true)
        guardarStats("ganada", nuevosIntentos.length, intentoActual)
        setMostrarResultado(true)
      } else if (nuevosIntentos.length >= MAX_INTENTOS) {
        setGanaste(false)
        guardarStats("perdida")
        setMostrarResultado(true)
      }

      setIntentoActual("")
    } else if (letra === "backspace") {
      setIntentoActual((prev) => prev.slice(0, -1))
    } else if (/^[a-zñ]$/.test(letra) && intentoActual.length < palabraSecreta.length) {
      setIntentoActual((prev) => prev + letra)
    }
  }

  const mostrarError = (mensaje: string) => {
    setMensajeError(mensaje)
    setAnimacionError(true)
    setTimeout(() => setAnimacionError(false), 500)
  }

  const actualizarEstados = (intento: string, resultado: LetraEstado[]) => {
    const nuevoEstado = { ...letrasEstado }

    intento.split("").forEach((letra, i) => {
      const estadoActual = nuevoEstado[letra]
      const nuevo = resultado[i]

      if (
        estadoActual === undefined ||
        (estadoActual === "incorrecta" && nuevo !== "incorrecta") ||
        (estadoActual === "presente" && nuevo === "correcta")
      ) {
        nuevoEstado[letra] = nuevo
      }
    })

    setLetrasEstado(nuevoEstado)
  }

  const reiniciarJuego = () => {
    setPalabraSecreta(getPalabraSecreta(true))  // Usamos "true" para seleccionar una palabra aleatoria
    setIntentos([])  // Reiniciar intentos
    setIntentoActual("")  // Limpiar el intento actual
    setGanaste(null)  // Restablecer estado de victoria
    setLetrasEstado({})  // Limpiar estado de letras
    setMensajeError("")  // Limpiar mensaje de error
    setPuntajeFinal(null)  // Restablecer puntaje final
    setMostrarResultado(false)  // No mostrar resultado
  
    // Focus en el input después de actualizar el estado
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }  

  if (!palabraSecreta) {
    return <div className="text-center mt-10 font-semibold dark:text-white">Cargando palabra...</div>
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto relative" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="absolute right-0 top-0">
        <DarkModeToggle />
      </div>

      <h1 className="text-xl sm:text-2xl font-bold mb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center">
        LA PALABRA DEL DÍA
      </h1>

      <div className="mb-4">
        <StatsModal stats={stats} />
      </div>

      <Grid
        intentos={intentos}
        intentoActual={intentoActual}
        maxIntentos={MAX_INTENTOS}
        longitudPalabra={palabraSecreta.length}
        palabraSecreta={palabraSecreta}
        animacionError={animacionError}
      />

      <input
        ref={inputRef}
        className="opacity-0 absolute"
        autoFocus
        type="text"
        value={intentoActual}
        onChange={() => {}}
      />

      <Keyboard letrasEstado={letrasEstado} onKeyClick={handleKeyInput} />

      {mensajeError && <p className="text-red-600 dark:text-red-400 text-sm mt-2 animate-fadeIn">{mensajeError}</p>}

      {ganaste !== null && puntajeFinal && mostrarResultado && (
        <ResultMessage
          ganaste={ganaste}
          palabraSecreta={!ganaste ? palabraSecreta : undefined}
          puntaje={puntajeFinal}
          onClose={() => setMostrarResultado(false)}
        />
      )}

      {ganaste !== null && (
        <button
          onClick={reiniciarJuego}
          className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-2xl font-semibold shadow-md hover:shadow-xl transition-all duration-300 active:scale-95"
        >
          🎮 Jugar de nuevo
        </button>
      )}
    </div>
  )
}

export default Game
