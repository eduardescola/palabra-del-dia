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

  // Verifica presentes (amarillas)
  for (let i = 0; i < palabra.length; i++) {
    if (estados[i] !== "correcta" && palabraArray.includes(intentoArray[i])) {
      estados[i] = "presente";
      palabraArray[palabraArray.indexOf(intentoArray[i])] = ""; // Elimina la letra ya usada
    }
  }

  return estados;
};
