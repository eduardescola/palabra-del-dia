import React from "react";
import { evaluarIntento, LetraEstado } from "../utils/getLetraEstado";

interface GridProps {
  intentos: string[];
  intentoActual: string;
  maxIntentos: number;
  longitudPalabra: number;
  palabraSecreta: string;
}

const getColor = (estado: LetraEstado) => {
  switch (estado) {
    case "correcta":
      return "bg-green-500 text-white border-green-500";
    case "presente":
      return "bg-yellow-400 text-white border-yellow-400";
    default:
      return "bg-gray-200 border-gray-300 text-black";
  }
};

const Grid: React.FC<GridProps> = ({ intentos, intentoActual, maxIntentos, longitudPalabra, palabraSecreta }) => {
  const filas = [];

  for (let i = 0; i < maxIntentos; i++) {
    const intento = intentos[i] || (i === intentos.length ? intentoActual : "");
    const letras = intento.padEnd(longitudPalabra).split("");

    let estados: LetraEstado[] = Array(longitudPalabra).fill("incorrecta");
    if (i < intentos.length) {
      estados = evaluarIntento(intento, palabraSecreta);
    }

    filas.push(
      <div key={i} className="flex gap-1 mb-1 justify-center">
        {letras.map((letra, j) => {
          const animacion = i < intentos.length ? "animate-flipIn" : "";
          return (
            <div
              key={j}
              className={`w-12 h-12 border-2 rounded flex items-center justify-center text-xl font-bold uppercase transition-all duration-300 ${i < intentos.length ? getColor(estados[j]) : "bg-white border-gray-300"} ${animacion}`}
            >
              {letra}
            </div>
          );
        })}
      </div>
    );
  }

  return <div className="mb-4">{filas}</div>;
};

export default Grid;