import React from "react";

interface LetrasUsadasProps {
  letras: string[];
}

const LetrasUsadas: React.FC<LetrasUsadasProps> = ({ letras }) => (
  <div className="mt-4">
    <p className="text-sm text-gray-500">Letras usadas:</p>
    <div className="flex flex-wrap gap-2 mt-1">
      {letras.map((letra, i) => (
        <span key={i} className="text-sm bg-gray-200 px-2 py-1 rounded">
          {letra.toUpperCase()}
        </span>
      ))}
    </div>
  </div>
);

export default LetrasUsadas;