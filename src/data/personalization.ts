import type { CSSProperties } from 'react';
import type { ChildProfile, Personalization, Universe } from '../types/domain';

/**
 * Catálogos de personalización del mundo del niño.
 *
 * Curva de valor (Evaluación Continua 2): "Aumentar · Personalización visual:
 * colores, fondos, avatar e íconos según los gustos de cada niño" y "Crear ·
 * Universo temático propio". Todo es CSS/emoji: sin imágenes pesadas (RNF-02).
 *
 * La "sugerencia mágica" (recommendFromInterests) arma el mundo a partir de los
 * gustos del niño con REGLAS predefinidas. El laboratorio de validación lo
 * permite explícitamente mientras la IA no esté desarrollada, siempre que se
 * registre con transparencia (evento MAGIC_WORLD_USED).
 */

export interface Palette {
  id: string;
  name: string;
  accent: string;   // acentos, barras, etiquetas
  soft: string;     // fondos suaves
  deep: string;     // botones (contraste AA con texto blanco)
  light: string;    // inicio de degradados
  hero: [string, string, string];
}

export const PALETTES: Palette[] = [
  { id: 'atardecer', name: 'Atardecer', accent: '#f05b45', soft: '#fff0e8', deep: '#c84938', light: '#ffc94a', hero: ['#3b1462', '#8a2f8f', '#f0704a'] },
  { id: 'oceano', name: 'Océano', accent: '#0ea5e9', soft: '#e0f4fd', deep: '#0369a1', light: '#7dd3fc', hero: ['#082f49', '#0c5a8a', '#22b8e6'] },
  { id: 'bosque', name: 'Bosque', accent: '#16a34a', soft: '#e3f7e9', deep: '#15803d', light: '#86efac', hero: ['#052e1c', '#14663d', '#3fbf6f'] },
  { id: 'galaxia', name: 'Galaxia', accent: '#7c3aed', soft: '#efe8ff', deep: '#5b21b6', light: '#c4b5fd', hero: ['#130b33', '#3b1b8a', '#8b5cf6'] },
  { id: 'caramelo', name: 'Caramelo', accent: '#ec4899', soft: '#fde7f3', deep: '#be185d', light: '#f9a8d4', hero: ['#4a0d2e', '#a3245f', '#f472b6'] },
  { id: 'sol', name: 'Sol', accent: '#f59e0b', soft: '#fff4dc', deep: '#b45309', light: '#fde68a', hero: ['#4a2604', '#a8580a', '#fbbf24'] },
  { id: 'menta', name: 'Menta', accent: '#14b8a6', soft: '#dcf7f3', deep: '#0f766e', light: '#99f6e4', hero: ['#042f2c', '#0f6b62', '#2dd4bf'] },
  { id: 'noche', name: 'Noche', accent: '#4f46e5', soft: '#e8e7fd', deep: '#3730a3', light: '#a5b4fc', hero: ['#0b0b26', '#252270', '#6366f1'] },
  { id: 'rosanegro', name: 'Rosa y negro', accent: '#ff4fa3', soft: '#ffe3f1', deep: '#c2185b', light: '#ffb3d6', hero: ['#07060b', '#2a0f22', '#e0287d'] },
];

export interface WorldBackground {
  id: string;
  name: string;
  icon: string;
  layers: string[];
  sizes?: string[];
  positions?: string[];
}

// Patrones translúcidos que se superponen al degradado de la paleta elegida.
export const BACKGROUNDS: WorldBackground[] = [
  {
    id: 'estrellas', name: 'Estrellas', icon: '✨',
    layers: [
      'radial-gradient(1.6px 1.6px at 12% 22%, rgba(255,255,255,.95) 50%, transparent 52%)',
      'radial-gradient(1.2px 1.2px at 64% 70%, rgba(255,255,255,.8) 50%, transparent 52%)',
      'radial-gradient(2px 2px at 40% 40%, rgba(255,255,255,.9) 50%, transparent 52%)',
      'radial-gradient(1.3px 1.3px at 86% 18%, rgba(255,255,255,.85) 50%, transparent 52%)',
    ],
    sizes: ['170px 130px', '230px 170px', '310px 210px', '140px 160px'],
  },
  {
    id: 'burbujas', name: 'Burbujas', icon: '🫧',
    layers: [
      'radial-gradient(circle at 10% 88%, rgba(255,255,255,.16) 0 48px, transparent 49px)',
      'radial-gradient(circle at 90% 18%, rgba(255,255,255,.12) 0 74px, transparent 75px)',
      'radial-gradient(circle at 60% 116%, rgba(255,255,255,.10) 0 96px, transparent 97px)',
      'radial-gradient(circle at 36% 12%, rgba(255,255,255,.12) 0 22px, transparent 23px)',
    ],
  },
  {
    id: 'rayas', name: 'Rayas', icon: '🏁',
    layers: ['repeating-linear-gradient(-45deg, rgba(255,255,255,.08) 0 16px, transparent 16px 34px)'],
  },
  {
    id: 'cuadricula', name: 'Bloques', icon: '🧱',
    layers: [
      'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px)',
      'linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
    ],
    sizes: ['26px 26px', '26px 26px'],
  },
  {
    id: 'colinas', name: 'Colinas', icon: '⛰️',
    layers: [
      'radial-gradient(circle at 84% 24%, rgba(255,240,180,.6) 0 22px, transparent 23px)',
      'radial-gradient(ellipse 55% 38% at 18% 112%, rgba(255,255,255,.2) 98%, transparent 100%)',
      'radial-gradient(ellipse 65% 44% at 80% 120%, rgba(255,255,255,.14) 98%, transparent 100%)',
    ],
  },
  {
    id: 'confeti', name: 'Confeti', icon: '🎉',
    layers: [
      'radial-gradient(circle, #ffd166 0 3px, transparent 3.5px)',
      'radial-gradient(circle, #06d6a0 0 2.5px, transparent 3px)',
      'radial-gradient(circle, #ffffff 0 2px, transparent 2.5px)',
      'radial-gradient(circle, #ff8fab 0 3px, transparent 3.5px)',
    ],
    sizes: ['90px 70px', '110px 90px', '70px 60px', '130px 100px'],
    positions: ['0 0', '30px 20px', '15px 45px', '60px 10px'],
  },
  {
    id: 'brillo', name: 'Brillo suave', icon: '🌟',
    layers: ['radial-gradient(circle at 78% 22%, rgba(255,255,255,.28), transparent 46%)'],
  },
  {
    // Escenario de concierto: brillos, dos haces de luz y resplandor del piso.
    id: 'escenario', name: 'Luces de escenario', icon: '🎇',
    layers: [
      'radial-gradient(1.6px 1.6px at 20% 30%, rgba(255,255,255,.95) 50%, transparent 52%)',
      'radial-gradient(1.4px 1.4px at 70% 60%, rgba(255,182,214,.95) 50%, transparent 52%)',
      'linear-gradient(112deg, transparent 36%, rgba(255,79,163,.24) 46%, transparent 56%)',
      'linear-gradient(68deg, transparent 42%, rgba(255,255,255,.12) 50%, transparent 58%)',
      'radial-gradient(ellipse 75% 32% at 50% 112%, rgba(255,79,163,.55), transparent 70%)',
    ],
    sizes: ['150px 110px', '210px 160px'],
  },
];

export interface CatalogItem {
  id: string;
  name: string;
  emoji: string;
}

export const PETS: CatalogItem[] = [
  { id: 'perrito', name: 'Perrito', emoji: '🐶' },
  { id: 'gatito', name: 'Gatito', emoji: '🐱' },
  { id: 'dino', name: 'Dino', emoji: '🦖' },
  { id: 'dragon', name: 'Dragoncito', emoji: '🐲' },
  { id: 'unicornio', name: 'Unicornio', emoji: '🦄' },
  { id: 'panda', name: 'Panda', emoji: '🐼' },
  { id: 'zorro', name: 'Zorrito', emoji: '🦊' },
  { id: 'pinguino', name: 'Pingüino', emoji: '🐧' },
  { id: 'robot', name: 'Robotín', emoji: '🤖' },
  { id: 'pulpo', name: 'Pulpito', emoji: '🐙' },
  { id: 'buho', name: 'Búho', emoji: '🦉' },
  { id: 'tortuga', name: 'Tortuga', emoji: '🐢' },
  { id: 'conejo', name: 'Conejito', emoji: '🐰' },
  { id: 'mariposa', name: 'Mariposa', emoji: '🦋' },
];

export const EMBLEMS: CatalogItem[] = [
  { id: 'estrella', name: 'Estrella', emoji: '⭐' },
  { id: 'rayo', name: 'Rayo', emoji: '⚡' },
  { id: 'corazon', name: 'Corazón', emoji: '💖' },
  { id: 'fuego', name: 'Fuego', emoji: '🔥' },
  { id: 'diamante', name: 'Diamante', emoji: '💎' },
  { id: 'luna', name: 'Luna', emoji: '🌙' },
  { id: 'arcoiris', name: 'Arcoíris', emoji: '🌈' },
  { id: 'corona', name: 'Corona', emoji: '👑' },
  { id: 'cohete', name: 'Cohete', emoji: '🚀' },
  { id: 'trebol', name: 'Trébol', emoji: '🍀' },
  { id: 'lazo', name: 'Lazo', emoji: '🎀' },
  { id: 'corazon-negro', name: 'Corazón negro', emoji: '🖤' },
];

export const AVATARS: string[] = [
  '🧒🏽', '🧒🏻', '👧🏽', '👦🏾', '👧🏻', '👦🏼', '🧑🏾', '👩🏽‍🦱',
  '👦🏻', '🦸🏽', '🧙🏽', '🧑🏻‍🎤', '🦊', '🐼', '🐯', '🤖',
];

export interface Interest extends CatalogItem {
  universe: string;   // clave en UNIVERSES
  palette: string;
  background: string;
  pet: string;
  emblem: string;
  worldName: (childName: string) => string;
}

export const INTERESTS: Interest[] = [
  { id: 'futbol', name: 'Fútbol', emoji: '⚽', universe: 'football', palette: 'bosque', background: 'rayas', pet: 'perrito', emblem: 'fuego', worldName: (n) => `Estadio de ${n}` },
  { id: 'dinos', name: 'Dinosaurios', emoji: '🦖', universe: 'dinos', palette: 'sol', background: 'colinas', pet: 'dino', emblem: 'diamante', worldName: (n) => `Valle Jurásico de ${n}` },
  { id: 'espacio', name: 'Espacio', emoji: '🚀', universe: 'space', palette: 'galaxia', background: 'estrellas', pet: 'robot', emblem: 'cohete', worldName: (n) => `Galaxia de ${n}` },
  { id: 'musica', name: 'Música y baile', emoji: '🎤', universe: 'kpop', palette: 'caramelo', background: 'confeti', pet: 'unicornio', emblem: 'corazon', worldName: (n) => `Escenario de ${n}` },
  { id: 'animales', name: 'Animales', emoji: '🐾', universe: 'jungle', palette: 'menta', background: 'burbujas', pet: 'panda', emblem: 'trebol', worldName: (n) => `Selva de ${n}` },
  { id: 'anime', name: 'Artes marciales', emoji: '🥋', universe: 'ki', palette: 'atardecer', background: 'estrellas', pet: 'dragon', emblem: 'rayo', worldName: (n) => `Dojo de ${n}` },
  { id: 'construir', name: 'Construir', emoji: '🧱', universe: 'jungle', palette: 'oceano', background: 'cuadricula', pet: 'robot', emblem: 'diamante', worldName: (n) => `Ciudad Bloque de ${n}` },
  { id: 'arte', name: 'Dibujar y pintar', emoji: '🎨', universe: 'kpop', palette: 'caramelo', background: 'brillo', pet: 'pulpo', emblem: 'arcoiris', worldName: (n) => `Taller de ${n}` },
  { id: 'idols', name: 'Idols y moda', emoji: '💗', universe: 'nocherosa', palette: 'rosanegro', background: 'escenario', pet: 'conejo', emblem: 'lazo', worldName: (n) => `Noche Rosa de ${n}` },
];

export const MAX_INTERESTS = 3;

export const paletteById = (id?: string) => PALETTES.find((p) => p.id === id);
export const backgroundById = (id?: string) => BACKGROUNDS.find((b) => b.id === id);
export const petById = (id?: string) => PETS.find((p) => p.id === id);
export const emblemById = (id?: string) => EMBLEMS.find((e) => e.id === id);
export const interestById = (id?: string) => INTERESTS.find((i) => i.id === id);

export function defaultPersonalization(universe: Universe): Personalization {
  return {
    worldName: '',
    palette: universe.defaultPalette || 'atardecer',
    background: universe.defaultBackground || 'estrellas',
    pet: universe.defaultPet || 'perrito',
    emblem: universe.defaultEmblem || 'estrella',
    interests: [],
  };
}

/** Combina lo guardado con los valores por defecto del universo y descarta ids inválidos. */
export function resolvePersonalization(
  profile: Pick<ChildProfile, 'personalization'>,
  universe: Universe,
): Personalization {
  const base = defaultPersonalization(universe);
  const stored: Partial<Personalization> = profile.personalization || {};
  return {
    worldName: typeof stored.worldName === 'string' ? stored.worldName : '',
    palette: paletteById(stored.palette) ? stored.palette! : base.palette,
    background: backgroundById(stored.background) ? stored.background! : base.background,
    pet: petById(stored.pet) ? stored.pet! : base.pet,
    emblem: emblemById(stored.emblem) ? stored.emblem! : base.emblem,
    interests: Array.isArray(stored.interests)
      ? stored.interests.filter((id) => interestById(id)).slice(0, MAX_INTERESTS)
      : [],
  };
}

export function displayWorldName(personalization: Personalization, universe: Universe): string {
  return personalization.worldName.trim() || `Mundo ${universe.name}`;
}

/** Fondo del mundo: patrón elegido sobre el degradado de la paleta. */
export function worldBackgroundStyle(paletteId: string, backgroundId: string): CSSProperties {
  const palette = paletteById(paletteId) || PALETTES[0];
  const bg = backgroundById(backgroundId) || BACKGROUNDS[0];
  const gradient = `linear-gradient(135deg, ${palette.hero[0]} 0%, ${palette.hero[1]} 55%, ${palette.hero[2]} 100%)`;
  return {
    backgroundColor: palette.hero[1],
    backgroundImage: [...bg.layers, gradient].join(', '),
    backgroundSize: [...bg.layers.map((_, i) => bg.sizes?.[i] || 'auto'), '100% 100%'].join(', '),
    backgroundPosition: [...bg.layers.map((_, i) => bg.positions?.[i] || '0 0'), '0 0'].join(', '),
    backgroundRepeat: [...bg.layers.map(() => 'repeat'), 'no-repeat'].join(', '),
  };
}

/** Variables CSS de la paleta para recolorear la interfaz del niño. */
export function paletteVars(paletteId: string): CSSProperties {
  const p = paletteById(paletteId) || PALETTES[0];
  return {
    '--accent': p.accent,
    '--accent-soft': p.soft,
    '--accent-deep': p.deep,
    '--accent-light': p.light,
  } as CSSProperties;
}

export interface MagicWorld {
  universeKey: string;
  personalization: Personalization;
  reason: string;
}

/**
 * "Sugerencia mágica": arma el mundo desde los gustos del niño con reglas.
 * El primer gusto define universo, colores, fondo y emblema; el segundo (si
 * existe) aporta la mascota, para que el resultado combine ambos intereses.
 */
export function recommendFromInterests(
  interestIds: string[],
  childName: string,
  current: Personalization,
  universes: Record<string, Universe>,
): MagicWorld | null {
  const picked = interestIds.map(interestById).filter(Boolean) as Interest[];
  if (picked.length === 0) return null;
  const [primary, secondary] = picked;
  const petSource = secondary || primary;
  const universe = universes[primary.universe];
  const palette = paletteById(primary.palette)!;
  const pet = petById(petSource.pet)!;
  const likes = picked.map((i) => `${i.emoji} ${i.name}`).join(' y ');
  // Un nombre vacío o generado automáticamente se reemplaza; uno escrito por el
  // niño se respeta.
  const currentName = current.worldName.trim();
  const autoName = !currentName || INTERESTS.some((i) => i.worldName(childName) === currentName);
  return {
    universeKey: primary.universe,
    personalization: {
      ...current,
      palette: primary.palette,
      background: primary.background,
      pet: petSource.pet,
      emblem: primary.emblem,
      worldName: autoName ? primary.worldName(childName) : current.worldName,
      interests: interestIds,
    },
    reason: `Como te gusta ${likes}, armamos tu mundo: ${universe.icon} ${universe.name}, colores ${palette.name} y tu compañero ${pet.emoji} ${pet.name}.`,
  };
}

export function worldNameSuggestions(childName: string, universe: Universe, interestIds: string[]): string[] {
  const fromInterests = interestIds.map(interestById).filter(Boolean).map((i) => (i as Interest).worldName(childName));
  const all = [...fromInterests, `${childName}landia`, `${universe.name} de ${childName}`, `Base secreta de ${childName}`, `Mundo de ${childName}`];
  return [...new Set(all)].slice(0, 5);
}
