export type ABGroup = 'A' | 'B';

export type UniverseId =
  | 'ki_warriors'
  | 'super_league'
  | 'block_builders'
  | 'space'
  | 'dinos'
  | 'kpop'
  | 'noche_rosa';

export type ShopCategory = 'aura' | 'hair' | 'outfit' | 'accessory' | 'pet';

export interface EquippedItems {
  aura: string | null;
  hair: string;
  outfit: string;
  accessory: string | null;
  pet: string | null;
}

export interface ChildProfile {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  universe: string;
  color: string;
  pin: string;
  sessions: number;
  minutes: number;
  answered: number;
  strengths: string[];
  needs: string[];
  streak: number;
  level: number;
  ab_group: ABGroup;
  coins: number;
  current_streak: number;
  max_streak: number;
  inventory: string[];
  equipped_items: EquippedItems;
  skill_streaks?: Record<string, number>;
  personalization?: Personalization;
}

/**
 * Preferencias visuales del mundo del niño (curva de valor: "colores, fondos,
 * avatar e íconos" + universo temático propio). Las elige el propio niño en
 * "Mi guarida"; los ids apuntan a los catálogos de src/data/personalization.ts.
 */
export interface Personalization {
  worldName: string;
  palette: string;
  background: string;
  pet: string;
  emblem: string;
  interests: string[];
}

export interface Universe {
  id?: UniverseId;
  name: string;
  tagline: string;
  icon: string;
  accent: string;
  accentSoft: string;
  background: string;
  character: string;
  stars: string;
  // Estilo sugerido al elegir el universo (el niño luego puede ajustarlo).
  defaultPalette?: string;
  defaultBackground?: string;
  defaultPet?: string;
  defaultEmblem?: string;
}

export interface QuestionNarrativeVariants {
  neutral?: string;
  ki_warriors?: string;
  super_league?: string;
  block_builders?: string;
}

export interface QuestionNarrativeHints {
  neutral?: string;
  ki_warriors?: string;
  super_league?: string;
  block_builders?: string;
}

export interface Question {
  id: number | string;
  skill: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  options: string[];
  answer: string;
  hint: string;
  visual?: string;
  narrative_variants?: QuestionNarrativeVariants;
  narrative_hints?: QuestionNarrativeHints;
}

export type CourseStatus = 'active' | 'soon';

export type GradeLevel = 3 | 4 | 5;

export interface TheoryBlock {
  heading: string;
  text: string;
}

export interface TheoryExample {
  problem: string;
  solution: string;
}

/**
 * Parte teórica introductoria de un tema (lenguaje de niño, poco texto, RNF-03).
 * Se muestra en la pantalla "Aprende" antes de practicar.
 */
export interface Theory {
  intro: string;
  blocks: TheoryBlock[];
  example?: TheoryExample;
  keyIdea: string;
}

export interface Topic {
  id: string;
  name: string;
  // Debe coincidir con Question.skill para que el motor adaptativo y las
  // estadísticas de fortalezas/debilidades sigan funcionando por habilidad.
  skill: string;
  description: string;
  // Grado sugerido (3.°, 4.° o 5.°) en que se introduce el tema.
  grade: GradeLevel;
  // Teoría introductoria; si falta, el tema va directo a práctica.
  theory?: Theory;
  questions: Question[];
}

export interface Course {
  id: string;
  name: string;
  area: string;
  grade: string;
  icon: string;
  color: string;
  status: CourseStatus;
  description: string;
  topics: Topic[];
}

export interface ShopItem {
  code: string;
  name: string;
  category: ShopCategory;
  price: number;
  icon: string;
  universe_id: UniverseId;
  asset_url?: string;
  z_index?: number;
  min_level_required?: number;
}

export interface AnswerSubmission {
  child_id: string;
  question_id: number | string;
  answer: string;
  is_correct: boolean;
  attempt_number: number;
  elapsed_ms?: number;
  difficulty_level?: number;
}

export interface ConsentRecord {
  accepted: true;
  at: string;
  version: number;
}

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  child_id: string | null;
  metadata: Record<string, string | number | boolean | null>;
  created_at: string;
}

export type AnalyticsEventType =
  | 'SESSION_START'
  | 'ANSWER_SUBMITTED'
  | 'COMBO_3_REACHED'
  | 'SHOP_OPENED'
  | 'ITEM_PURCHASED'
  | 'ITEM_EQUIPPED'
  | 'PRACTICE_RESUMED_FROM_SHOP'
  | 'SUBSCRIPTION_CLICKED'
  | 'COURSE_OPENED'
  | 'TOPIC_OPENED'
  | 'TOPIC_STARTED'
  | 'PERSONALIZATION_SAVED'
  | 'MAGIC_WORLD_USED';

export interface AdaptiveProgressInput {
  abGroup: ABGroup;
  isCorrect: boolean;
  attemptNumber: number;
  currentStreak: number;
  maxStreak: number;
  skillStreak: number;
  level: number;
}

export interface AdaptiveProgressResult {
  coinsEarned: number;
  currentStreak: number;
  maxStreak: number;
  skillStreak: number;
  level: number;
  levelUp: boolean;
  comboMilestone: boolean;
  animationTrigger: 'SUPER_PHASE_UP' | null;
}
