import React, { useEffect, useRef, useState } from "react";
import Grid from "./components/Grid";
import ResultMessage from "./components/ResultMessage";
import Keyboard from "./components/Keyboard";
import { evaluarIntento, LetraEstado } from "./utils/getLetraEstado";

const PALABRA_SECRETA = "react";
const MAX_INTENTOS = 6;

const Game: React.FC = () => {
  const [intentos, setIntentos] = useState<string[]>([]);
  const [intentoActual, setIntentoActual] = useState<string>("");
  const [ganaste, setGanaste] = useState<boolean | null>(null);
  const [letrasEstado, setLetrasEstado] = useState<Record<string, LetraEstado>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [intentoActual]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key.toLowerCase();
    handleKeyInput(key);
  };

  const handleKeyInput = (letra: string) => {
    if (ganaste !== null) return;

    if (letra === "enter") {
      if (intentoActual.length === PALABRA_SECRETA.length) {
        const nuevosIntentos = [...intentos, intentoActual];
        const resultado = evaluarIntento(intentoActual, PALABRA_SECRETA);
        actualizarEstados(intentoActual, resultado);

        setIntentos(nuevosIntentos);

        if (intentoActual === PALABRA_SECRETA) {
          setGanaste(true);
        } else if (nuevosIntentos.length >= MAX_INTENTOS) {
          setGanaste(false);
        }

        setIntentoActual("");
      }
    } else if (letra === "backspace") {
      setIntentoActual((prev) => prev.slice(0, -1));
    } else if (/^[a-zñ]$/.test(letra) && intentoActual.length < PALABRA_SECRETA.length) {
      setIntentoActual((prev) => prev + letra);
    }
  };

  const actualizarEstados = (intento: string, resultado: LetraEstado[]) => {
    const nuevoEstado = { ...letrasEstado };

    intento.split("").forEach((letra, i) => {
      const estadoActual = nuevoEstado[letra];
      const nuevo = resultado[i];

      if (
        estadoActual === undefined ||
        (estadoActual === "incorrecta" && nuevo !== "incorrecta") ||
        (estadoActual === "presente" && nuevo === "correcta")
      ) {
        nuevoEstado[letra] = nuevo;
      }
    });

    setLetrasEstado(nuevoEstado);
  };

  const reiniciarJuego = () => {
    setIntentos([]);
    setIntentoActual("");
    setGanaste(null);
    setLetrasEstado({});
  };

  return (
    <div
      className="flex flex-col items-center mt-10"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h1 className="text-2xl font-bold mb-6">LA PALABRA DEL DÍA</h1>

      <Grid
        intentos={intentos}
        intentoActual={intentoActual}
        maxIntentos={MAX_INTENTOS}
        longitudPalabra={PALABRA_SECRETA.length}
        palabraSecreta={PALABRA_SECRETA}
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

      {ganaste !== null && <ResultMessage ganaste={ganaste} />}

      {ganaste !== null && (
        <button
          onClick={reiniciarJuego}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Jugar de nuevo
        </button>
      )}
    </div>
  );
};

export default Game;
