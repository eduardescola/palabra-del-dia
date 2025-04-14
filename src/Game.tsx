import type React from "react"
import { useEffect, useRef, useState } from "react"
import Grid from "./components/Grid"
import ResultMessage from "./components/ResultMessage"
import Keyboard from "./components/Keyboard"
import { evaluarIntento, type LetraEstado } from "./utils/getLetraEstado"
import { getPalabraSecreta } from "./utils/getPalabraSecreta"
import { palabrasValidas } from "./utils/palabrasValidas"

const MAX_INTENTOS = 6

const Game: React.FC = () => {
  const [palabraSecreta, setPalabraSecreta] = useState<string | null>(null)
  const [intentos, setIntentos] = useState<string[]>([])
  const [intentoActual, setIntentoActual] = useState<string>("")
  const [ganaste, setGanaste] = useState<boolean | null>(null)
  const [letrasEstado, setLetrasEstado] = useState<Record<string, LetraEstado>>({})
  const [mensajeError, setMensajeError] = useState<string>("")
  const [stats, setStats] = useState<{ ganadas: number; perdidas: number }>({ ganadas: 0, perdidas: 0 })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPalabraSecreta(getPalabraSecreta())
    const guardadas = localStorage.getItem("stats")
    if (guardadas) setStats(JSON.parse(guardadas))
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [intentoActual])

  const guardarStats = (resultado: "ganada" | "perdida") => {
    const nuevasStats =
      resultado === "ganada"
        ? { ...stats, ganadas: stats.ganadas + 1 }
        : { ...stats, perdidas: stats.perdidas + 1 }

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
      if (intentoActual.length !== palabraSecreta.length) return

      if (!palabrasValidas.has(intentoActual)) {
        setMensajeError("Palabra no válida")
        return
      }

      const nuevosIntentos = [...intentos, intentoActual]
      const resultado = evaluarIntento(intentoActual, palabraSecreta)
      actualizarEstados(intentoActual, resultado)

      setIntentos(nuevosIntentos)

      if (intentoActual === palabraSecreta) {
        setGanaste(true)
        guardarStats("ganada")
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
    return <div className="text-center mt-10 font-semibold">Cargando palabra...</div>
  }

  return (
    <div
      className="flex flex-col items-center w-full max-w-xs mx-auto"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">LA PALABRA DEL DÍA</h1>

      <Grid
        intentos={intentos}
        intentoActual={intentoActual}
        maxIntentos={MAX_INTENTOS}
        longitudPalabra={palabraSecreta.length}
        palabraSecreta={palabraSecreta}
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

      {mensajeError && <p className="text-red-600 text-sm mt-2">{mensajeError}</p>}

      {ganaste !== null && (
        <>
          <ResultMessage ganaste={ganaste} />
          {!ganaste && (
            <p className="mt-1 text-sm text-gray-600">La palabra era: <strong>{palabraSecreta}</strong></p>
          )}

          <button
            onClick={reiniciarJuego}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          >
            Jugar de nuevo
          </button>
        </>
      )}
    </div>
  )
}

export default Game
