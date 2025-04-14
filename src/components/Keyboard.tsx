import React from "react";
import { LetraEstado } from "../utils/getLetraEstado";

interface KeyboardProps {
  letrasEstado: Record<string, LetraEstado>;
  onKeyClick: (letra: string) => void;
}

const filas = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const getColor = (estado: LetraEstado | undefined) => {
  switch (estado) {
    case "correcta":
      return "bg-green-500 text-white";
    case "presente":
      return "bg-yellow-400 text-white";
    case "incorrecta":
      return "bg-gray-400 text-white";
    default:
      return "bg-gray-200 text-black";
  }
};

const Keyboard: React.FC<KeyboardProps> = ({ letrasEstado, onKeyClick }) => {
  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      {filas.map((fila, idx) => (
        <div key={idx} className="flex gap-1">
          {fila.map((letra) => {
            const estado = letrasEstado[letra.toLowerCase()];
            const colorClass = getColor(estado);
            return (
              <button
                key={letra}
                onClick={() => onKeyClick(letra.toLowerCase())}
                className={`w-10 h-12 rounded font-bold text-sm ${colorClass} transition-colors duration-300`}
              >
                {letra}
              </button>
            );
          })}
        </div>
      ))}
      <div className="flex gap-1 mt-2">
        <button
          onClick={() => onKeyClick("enter")}
          className="px-4 h-12 bg-blue-500 text-white rounded font-bold text-sm"
        >
          ENTER
        </button>
        <button
          onClick={() => onKeyClick("backspace")}
          className="px-4 h-12 bg-red-500 text-white rounded font-bold text-sm"
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default Keyboard;