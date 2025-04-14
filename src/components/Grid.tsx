import React from "react";

interface GridProps {
  intentos: string[];
  intentoActual: string;
  maxIntentos: number;
  longitudPalabra: number;
}

const Grid: React.FC<GridProps> = ({ intentos, intentoActual, maxIntentos, longitudPalabra }) => {
  const filas = [];

  for (let i = 0; i < maxIntentos; i++) {
    const intento = intentos[i] || (i === intentos.length ? intentoActual : "");
    const letras = intento.padEnd(longitudPalabra).split("");

    filas.push(
      <div key={i} className="flex gap-1 mb-1 justify-center">
        {letras.map((letra, j) => (
          <div
            key={j}
            className="w-12 h-12 border-2 border-gray-300 rounded flex items-center justify-center text-xl font-bold uppercase bg-white"
          >
            {letra}
          </div>
        ))}
      </div>
    );
  }

  return <div className="mb-4">{filas}</div>;
};

export default Grid;
