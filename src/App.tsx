import React, { useState } from "react";
import { Input } from "./components/ui/Input";
import { Button } from "./components/ui/Button";
import { Card, CardContent } from "./components/ui/Card";
import LetrasUsadas from "./components/LetrasUsadas";
import MensajeFinal from "./components/MensajeFInal";
import IntentoFila from "./components/IntentoFIla";

const PALABRA_SECRETA = "react";
const MAX_INTENTOS = 6;

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [intentos, setIntentos] = useState<string[]>([]);
  const [letrasUsadas, setLetrasUsadas] = useState<string[]>([]);
  const [ganaste, setGanaste] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (input.length !== PALABRA_SECRETA.length || ganaste !== null) return;

    const nuevoIntento = input.toLowerCase();
    const nuevosIntentos = [...intentos, nuevoIntento];
    const nuevasLetras = [...new Set([...letrasUsadas, ...nuevoIntento.split("")])];

    setIntentos(nuevosIntentos);
    setLetrasUsadas(nuevasLetras);
    setInput("");

    if (nuevoIntento === PALABRA_SECRETA) {
      setGanaste(true);
    } else if (nuevosIntentos.length >= MAX_INTENTOS) {
      setGanaste(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6">
        <CardContent>
          <h1 className="text-2xl font-bold text-center mb-4">Palabra del Día 🔤</h1>

          {intentos.map((intento, i) => (
            <IntentoFila key={i} intento={intento} palabraSecreta={PALABRA_SECRETA} />
          ))}

          {ganaste === null && (
            <>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={PALABRA_SECRETA.length}
                placeholder="Adivina la palabra..."
                className="mb-4"
              />

              <Button onClick={handleSubmit} className="w-full">
                Adivinar
              </Button>
            </>
          )}

          <LetrasUsadas letras={letrasUsadas} />

          {ganaste !== null && <MensajeFinal ganaste={ganaste} />}
        </CardContent>
      </Card>
    </main>
  );
};

export default App;