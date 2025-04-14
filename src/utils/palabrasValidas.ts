import palabras from "../data/palabras5.json"

export const palabrasValidas = new Set(palabras.map(p => p.toLowerCase()))
