"use client"

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
  const [stats, setStats] = useState<{
    ganadas: number
    perdidas: number
    distribucion: Record<number, number>
  }>({
    ganadas: 0,
    perdidas: 0,
    distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPalabraSecreta(getPalabraSecreta())
    const guardadas = localStorage.getItem("stats")
    if (guardadas) {
      try {
        const parsedStats = JSON.parse(guardadas)
        // Asegurarse de que tenga la estructura correcta
        if (!parsedStats.distribucion) {
          parsedStats.distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
        }
        setStats(parsedStats)
      } catch (e) {
        console.error("Error al cargar estadísticas:", e)
      }
    }
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [intentoActual])

  const guardarStats = (resultado: "ganada" | "perdida", intentosUsados?: number) => {
    const nuevasStats = { ...stats }

    if (resultado === "ganada") {
      nuevasStats.ganadas += 1
      if (intentosUsados && intentosUsados <= 6) {
        nuevasStats.distribucion[intentosUsados] = (nuevasStats.distribucion[intentosUsados] || 0) + 1
      }
    } else {
      nuevasStats.perdidas += 1
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

    setMensajeError("") // borrar errores anteriores

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

      setIntentos(nuevosIntentos)

      if (intentoActual === palabraSecreta) {
        setGanaste(true)
        guardarStats("ganada", nuevosIntentos.length)
      } else if (nuevosIntentos.length >= MAX_INTENTOS) {
        setGanaste(false)
        guardarStats("perdida")
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
    setPalabraSecreta(getPalabraSecreta())
    setIntentos([])
    setIntentoActual("")
    setGanaste(null)
    setLetrasEstado({})
    setMensajeError("")
  }

  if (!palabraSecreta) {
    return <div className="text-center mt-10 font-semibold dark:text-white">Cargando palabra...</div>
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center dark:text-white">LA PALABRA DEL DÍA</h1>
        <DarkModeToggle />
      </div>

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

      {ganaste !== null && (
        <>
          <ResultMessage ganaste={ganaste} palabraSecreta={!ganaste ? palabraSecreta : undefined} />

          <button
            onClick={reiniciarJuego}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm transition-colors duration-200 active:scale-95"
          >
            Jugar de nuevo
          </button>
        </>
      )}
    </div>
  )
}

export default Game
