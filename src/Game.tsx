import React, { useState } from "react";
import Grid from "./components/Grid";
import ResultMessage from "./components/ResultMessage";

const PALABRA_SECRETA = "react";
const MAX_INTENTOS = 6;

const Game: React.FC = () => {
  const [intentos, setIntentos] = useState<string[]>([]);
  const [intentoActual, setIntentoActual] = useState<string>("");
  const [ganaste, setGanaste] = useState<boolean | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const letra = e.key.toLowerCase();

    if (ganaste !== null) return;

    if (letra === "enter") {
      if (intentoActual.length === PALABRA_SECRETA.length) {
        const nuevosIntentos = [...intentos, intentoActual];
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
      />

      <input
        className="opacity-0 absolute"
        autoFocus
        type="text"
        value={intentoActual}
        onChange={() => {}}
      />

      {ganaste !== null && <ResultMessage ganaste={ganaste} />}
    </div>
  );
};

export default Game;
