export type LetraEstado = "correcta" | "presente" | "incorrecta";

export const evaluarIntento = (intento: string, palabra: string): LetraEstado[] => {
  const estados: LetraEstado[] = Array(palabra.length).fill("incorrecta");
  const palabraArray = palabra.split("");
  const intentoArray = intento.split("");

  // Verifica las correctas
  for (let i = 0; i < palabra.length; i++) {
    if (intentoArray[i] === palabraArray[i]) {
      estados[i] = "correcta";
      palabraArray[i] = ""; // Evita duplicados
    }
  }

  // Verifica las presentes (amarillas)
  for (let i = 0; i < palabra.length; i++) {
    // Solo marca como "presente" si la letra no es "correcta" y está disponible en la palabra
    if (estados[i] !== "correcta" && palabraArray.includes(intentoArray[i])) {
      estados[i] = "presente";
      // Elimina la letra ya usada para evitar duplicados
      const index = palabraArray.indexOf(intentoArray[i]);
      if (index !== -1) {
        palabraArray[index] = ""; // Marca la letra como utilizada
      }
    }
  }

  return estados;
};
