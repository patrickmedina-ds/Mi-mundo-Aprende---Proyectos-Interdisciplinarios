import type { Universe } from '../types/domain';

/**
 * Universos temáticos propios (curva de valor: "Crear · Universo temático
 * propio"). Arte original, sin marcas registradas. Las claves del objeto son
 * las que se guardan en `ChildProfile.universe`; `id` es el que usan las
 * variantes narrativas de las preguntas y la tienda.
 */
export const UNIVERSES: Record<string, Universe> = {
  space: {
    id: 'space',
    name: 'Cosmos',
    tagline: 'Explora. Resuelve. Despega.',
    icon: '🚀',
    accent: '#6c63ff',
    accentSoft: '#eeedff',
    background: 'linear-gradient(135deg, #171535 0%, #27245a 54%, #514bb1 100%)',
    character: '🧑🏽‍🚀',
    stars: '✦  ·  ✧  ·  ⋆  ·  ✦',
    defaultPalette: 'galaxia', defaultBackground: 'estrellas', defaultPet: 'robot', defaultEmblem: 'cohete',
  },
  football: {
    id: 'super_league',
    name: 'Cancha',
    tagline: 'Entrena tu mente, juega en grande.',
    icon: '⚽',
    accent: '#159c76',
    accentSoft: '#dff7ee',
    background: 'linear-gradient(135deg, #073b32 0%, #08755b 58%, #26b183 100%)',
    character: '🧒🏽',
    stars: '╱  ╲  ╱  ╲  ╱  ╲',
    defaultPalette: 'bosque', defaultBackground: 'rayas', defaultPet: 'perrito', defaultEmblem: 'fuego',
  },
  jungle: {
    id: 'block_builders',
    name: 'Selva',
    tagline: 'Cada pregunta es un nuevo camino.',
    icon: '🌿',
    accent: '#cf6d2d',
    accentSoft: '#fff0e2',
    background: 'linear-gradient(135deg, #263d2b 0%, #4d7337 55%, #c2853f 100%)',
    character: '🧒🏻',
    stars: '✿  ·  ❋  ·  ✿  ·  ❋',
    defaultPalette: 'menta', defaultBackground: 'burbujas', defaultPet: 'panda', defaultEmblem: 'trebol',
  },
  ki: {
    id: 'ki_warriors',
    name: 'Guardianes Ki',
    tagline: 'Entrena tu mente. Desbloquea tu poder.',
    icon: '⚡',
    accent: '#f05b45',
    accentSoft: '#fff0e8',
    background: 'linear-gradient(135deg, #35165d 0%, #7531a8 52%, #ee754b 100%)',
    character: '🦸🏽',
    stars: '✦  ·  ◈  ·  ✦  ·  ◈',
    defaultPalette: 'atardecer', defaultBackground: 'estrellas', defaultPet: 'dragon', defaultEmblem: 'rayo',
  },
  dinos: {
    id: 'dinos',
    name: 'Valle Jurásico',
    tagline: 'Descubre, excava y aprende.',
    icon: '🦖',
    accent: '#d97706',
    accentSoft: '#fff4dc',
    background: 'linear-gradient(135deg, #3a2a08 0%, #7c5a12 55%, #e0a32b 100%)',
    character: '🧒🏽',
    stars: '🌿  ·  🦴  ·  🌿  ·  🦴',
    defaultPalette: 'sol', defaultBackground: 'colinas', defaultPet: 'dino', defaultEmblem: 'diamante',
  },
  kpop: {
    id: 'kpop',
    name: 'Escenario Pop',
    tagline: 'Tu ritmo, tus reglas, tu show.',
    icon: '🎤',
    accent: '#ec4899',
    accentSoft: '#fde7f3',
    background: 'linear-gradient(135deg, #3b0a2d 0%, #8a1d64 55%, #f472b6 100%)',
    character: '🧑🏻‍🎤',
    stars: '♪  ·  ✦  ·  ♫  ·  ✦',
    defaultPalette: 'caramelo', defaultBackground: 'confeti', defaultPet: 'unicornio', defaultEmblem: 'corazon',
  },
  // Estética de idols del K-pop en negro y rosa (inspirada en el estilo de
  // grupos como BLACKPINK), con nombre y arte propios: sin nombres, logos ni
  // imágenes de grupos reales (regla de propiedad intelectual del SPEC).
  nocherosa: {
    id: 'noche_rosa',
    name: 'Noche Rosa',
    tagline: 'Brilla en tu escenario y aprende con estilo.',
    icon: '💗',
    accent: '#ff4fa3',
    accentSoft: '#ffe3f1',
    background: 'linear-gradient(135deg, #07060b 0%, #2a0f22 55%, #e0287d 100%)',
    character: '🧑🏻‍🎤',
    stars: '✦  ♡  ✦  ♡  ✦',
    defaultPalette: 'rosanegro', defaultBackground: 'escenario', defaultPet: 'conejo', defaultEmblem: 'lazo',
  },
};
