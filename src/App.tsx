import React, { useState } from "react";
import InputBox from "./components/InputBox";
import LetterBox from "./components/LetterBox";
import ResultMessage from "./components/ResultMessage";

const PALABRA_SECRETA = "react";
const MAX_INTENTOS = 6;

const App: React.FC = () => {
  const [intentos, setIntentos] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [ganaste, setGanaste] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (input.length !== PALABRA_SECRETA.length || ganaste !== null) return;

    const nuevoIntento = input.toLowerCase();
    const nuevosIntentos = [...intentos, nuevoIntento];

    setIntentos(nuevosIntentos);
    setInput("");

    if (nuevoIntento === PALABRA_SECRETA) {
      setGanaste(true);
    } else if (nuevosIntentos.length >= MAX_INTENTOS) {
      setGanaste(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[320px]">
        <h1 className="text-xl font-bold mb-4 text-center">Palabra del Día</h1>

        {/* Mostrar los intentos anteriores */}
        {intentos.map((intento, i) => (
          <LetterBox key={i} intento={intento} palabraSecreta={PALABRA_SECRETA} />
        ))}

        {/* Mostrar input solo si el juego no ha terminado */}
        {ganaste === null && (
          <InputBox input={input} setInput={setInput} handleSubmit={handleSubmit} />
        )}

        {/* Mostrar mensaje de resultado */}
        {ganaste !== null && <ResultMessage ganaste={ganaste} />}
      </div>
    </div>
  );
};

export default App;
