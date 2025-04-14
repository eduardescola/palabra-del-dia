import React from "react";

interface ResultMessageProps {
  ganaste: boolean;
}

const ResultMessage: React.FC<ResultMessageProps> = ({ ganaste }) => {
  return (
    <div className={`mt-4 text-center ${ganaste ? "text-green-500" : "text-red-500"}`}>
      {ganaste ? "¡Ganaste!" : "Perdiste. La palabra era: react"}
    </div>
  );
};

export default ResultMessage;
