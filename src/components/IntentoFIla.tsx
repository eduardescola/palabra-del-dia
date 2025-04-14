import React from "react";

interface IntentoFilaProps {
  intento: string;
  palabraSecreta: string;
}

const getColor = (letra: string, index: number, palabra: string) => {
  if (palabra[index] === letra) return "bg-green-500";
  if (palabra.includes(letra)) return "bg-yellow-500";
  return "bg-gray-300";
};

const IntentoFila: React.FC<IntentoFilaProps> = ({ intento, palabraSecreta }) => (
  <div className="flex gap-2 justify-center mb-2">
    {Array.from(palabraSecreta).map((_, i) => (
      <div
        key={i}
        className={`w-10 h-10 flex items-center justify-center text-white font-bold rounded ${
          intento[i] ? getColor(intento[i], i, palabraSecreta) : "bg-white border"
        }`}
      >
        {intento[i]?.toUpperCase() || ""}
      </div>
    ))}
  </div>
);

export default IntentoFila;