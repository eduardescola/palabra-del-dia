import React from "react";

interface LetterBoxProps {
  intento: string;
  palabraSecreta: string;
}

const LetterBox: React.FC<LetterBoxProps> = ({ intento, palabraSecreta }) => {
  return (
    <div className="flex mb-2">
      {intento.split("").map((letra, j) => {
        let color = "bg-gray-400"; // Letra incorrecta
        if (palabraSecreta[j] === letra) color = "bg-green-500"; // Correcta y en lugar correcto
        else if (palabraSecreta.includes(letra)) color = "bg-yellow-500"; // Letra correcta pero en lugar incorrecto
        return (
          <div
            key={j}
            className={`w-10 h-10 flex items-center justify-center mx-1 rounded-lg ${color}`}
          >
            <span className="text-white">{letra.toUpperCase()}</span>
          </div>
        );
      })}
    </div>
  );
};

export default LetterBox;
