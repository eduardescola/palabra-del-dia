import React from "react";

interface MensajeFinalProps {
  ganaste: boolean;
}

const MensajeFinal: React.FC<MensajeFinalProps> = ({ ganaste }) => (
  <div className="mt-6 text-center">
    {ganaste ? (
      <p className="text-green-600 text-xl font-bold">¡Correcto! 🎉</p>
    ) : (
      <p className="text-red-600 text-xl font-bold">¡Juego terminado! 😅</p>
    )}
  </div>
);

export default MensajeFinal;