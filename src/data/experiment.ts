/**
 * Datos del EXPERIMENTO DE VALIDACIÓN (Criterio B).
 *
 * Alineado al documento del curso: se comparan DOS versiones de un mismo módulo
 * (Matemática) con el MISMO objetivo, la MISMA dificultad y la MISMA cantidad de
 * preguntas. La única diferencia entre versiones es la TEMÁTICA + GAMIFICACIÓN
 * (personalizada) frente a una interfaz neutra (genérica). NO hay adaptación de
 * dificultad: esa es la corrección central pedida por el docente.
 *
 * Para evitar el efecto de memoria, cada versión usa un FORMULARIO PARALELO
 * distinto (Form 1 / Form 2) con la misma estructura y dificultad. El orden de
 * versiones y la asignación de formularios se contrabalancean por participante.
 */

export type ExperimentThemeId = 'futbol' | 'animales' | 'espacio';

export interface ExperimentTheme {
  id: ExperimentThemeId;
  name: string;
  icon: string;
  companion: string;
  accent: string;
  background: string;
  coin: string;
  reward: string;
  // Decoraciones tematizadas (se vuelven tocables para medir distracción).
  decor: string[];
}

export const EXPERIMENT_THEMES: Record<ExperimentThemeId, ExperimentTheme> = {
  futbol: {
    id: 'futbol', name: 'Fútbol', icon: '⚽', companion: '🧒🏽', accent: '#159c76',
    background: 'linear-gradient(135deg, #073b32 0%, #08755b 58%, #26b183 100%)',
    coin: '🏅', reward: '🏆', decor: ['⚽', '🥅', '🏟️', '👟'],
  },
  animales: {
    id: 'animales', name: 'Animales', icon: '🦊', companion: '🐼', accent: '#cf6d2d',
    background: 'linear-gradient(135deg, #263d2b 0%, #4d7337 55%, #c2853f 100%)',
    coin: '🦴', reward: '🏵️', decor: ['🦊', '🐼', '🦁', '🐸'],
  },
  espacio: {
    id: 'espacio', name: 'Espacio', icon: '🚀', companion: '🧑🏽‍🚀', accent: '#6c63ff',
    background: 'linear-gradient(135deg, #171535 0%, #27245a 54%, #514bb1 100%)',
    coin: '⭐', reward: '🪐', decor: ['🚀', '🪐', '👽', '☄️'],
  },
};

export interface ExperimentQuestion {
  id: string;
  prompt: string;
  // Enunciado tematizado por interés (solo cambia el contexto, no los números).
  themed?: Partial<Record<ExperimentThemeId, string>>;
  options: string[];
  answer: string;
}

export interface ExperimentForm {
  id: 'F1' | 'F2';
  questions: ExperimentQuestion[];
}

// Dos formularios paralelos: MISMA estructura y dificultad, distintos números.
export const EXPERIMENT_FORMS: ExperimentForm[] = [
  {
    id: 'F1',
    questions: [
      { id: 'f1q1', prompt: '¿Cuánto es 6 × 3?', options: ['15', '18', '21', '24'], answer: '18' },
      { id: 'f1q2', prompt: '¿Cuánto es 24 ÷ 4?', options: ['5', '6', '7', '8'], answer: '6' },
      { id: 'f1q3', prompt: '¿Cuánto es 15 + 27?', options: ['32', '42', '43', '52'], answer: '42' },
      { id: 'f1q4', prompt: '¿Cuánto es 50 − 18?', options: ['28', '32', '38', '42'], answer: '32' },
      { id: 'f1q5', prompt: '¿Cuánto es 7 × 4?', options: ['21', '24', '28', '32'], answer: '28' },
      { id: 'f1q6', prompt: '¿Qué número sigue? 2, 4, 6, 8, …', options: ['9', '10', '11', '12'], answer: '10' },
      {
        id: 'f1q7', prompt: 'Hay 3 grupos con 5 elementos cada uno. ¿Cuántos hay en total?',
        themed: {
          futbol: 'Hay 3 equipos con 5 jugadores cada uno. ¿Cuántos jugadores hay en total?',
          animales: 'Hay 3 jaulas con 5 conejos cada una. ¿Cuántos conejos hay en total?',
          espacio: 'Hay 3 cohetes con 5 astronautas cada uno. ¿Cuántos astronautas hay en total?',
        },
        options: ['10', '12', '15', '18'], answer: '15',
      },
      { id: 'f1q8', prompt: '¿Cuánto es 36 ÷ 6?', options: ['5', '6', '7', '8'], answer: '6' },
      { id: 'f1q9', prompt: '¿Cuánto es 9 × 2?', options: ['16', '18', '20', '22'], answer: '18' },
      { id: 'f1q10', prompt: '¿Cuánto es 35 ÷ 5?', options: ['6', '7', '8', '9'], answer: '7' },
      { id: 'f1q11', prompt: '¿Cuánto es 46 + 18?', options: ['54', '62', '64', '66'], answer: '64' },
      { id: 'f1q12', prompt: '¿Cuánto es 72 − 35?', options: ['33', '37', '43', '47'], answer: '37' },
      { id: 'f1q13', prompt: '¿Cuánto es 8 × 3?', options: ['21', '24', '27', '32'], answer: '24' },
      { id: 'f1q14', prompt: '¿Qué número sigue? 5, 10, 15, 20, …', options: ['22', '24', '25', '30'], answer: '25' },
      {
        id: 'f1q15', prompt: 'Hay 2 grupos con 6 elementos cada uno. ¿Cuántos hay en total?',
        themed: {
          futbol: 'Hay 2 equipos con 6 jugadores cada uno. ¿Cuántos jugadores hay en total?',
          animales: 'Hay 2 nidos con 6 pajaritos cada uno. ¿Cuántos pajaritos hay en total?',
          espacio: 'Hay 2 naves con 6 marcianos cada una. ¿Cuántos marcianos hay en total?',
        },
        options: ['8', '10', '12', '14'], answer: '12',
      },
      { id: 'f1q16', prompt: '¿Cuánto es 40 ÷ 8?', options: ['4', '5', '6', '8'], answer: '5' },
    ],
  },
  {
    id: 'F2',
    questions: [
      { id: 'f2q1', prompt: '¿Cuánto es 7 × 3?', options: ['18', '21', '24', '27'], answer: '21' },
      { id: 'f2q2', prompt: '¿Cuánto es 28 ÷ 4?', options: ['6', '7', '8', '9'], answer: '7' },
      { id: 'f2q3', prompt: '¿Cuánto es 18 + 25?', options: ['33', '42', '43', '53'], answer: '43' },
      { id: 'f2q4', prompt: '¿Cuánto es 60 − 24?', options: ['34', '36', '44', '46'], answer: '36' },
      { id: 'f2q5', prompt: '¿Cuánto es 6 × 4?', options: ['18', '20', '24', '28'], answer: '24' },
      { id: 'f2q6', prompt: '¿Qué número sigue? 3, 6, 9, 12, …', options: ['13', '14', '15', '16'], answer: '15' },
      {
        id: 'f2q7', prompt: 'Hay 4 grupos con 5 elementos cada uno. ¿Cuántos hay en total?',
        themed: {
          futbol: 'Hay 4 equipos con 5 jugadores cada uno. ¿Cuántos jugadores hay en total?',
          animales: 'Hay 4 jaulas con 5 conejos cada una. ¿Cuántos conejos hay en total?',
          espacio: 'Hay 4 cohetes con 5 astronautas cada uno. ¿Cuántos astronautas hay en total?',
        },
        options: ['15', '18', '20', '25'], answer: '20',
      },
      { id: 'f2q8', prompt: '¿Cuánto es 42 ÷ 6?', options: ['6', '7', '8', '9'], answer: '7' },
      { id: 'f2q9', prompt: '¿Cuánto es 8 × 2?', options: ['14', '16', '18', '20'], answer: '16' },
      { id: 'f2q10', prompt: '¿Cuánto es 45 ÷ 5?', options: ['7', '8', '9', '10'], answer: '9' },
      { id: 'f2q11', prompt: '¿Cuánto es 37 + 26?', options: ['53', '61', '63', '73'], answer: '63' },
      { id: 'f2q12', prompt: '¿Cuánto es 81 − 46?', options: ['25', '35', '37', '45'], answer: '35' },
      { id: 'f2q13', prompt: '¿Cuánto es 9 × 3?', options: ['24', '27', '28', '30'], answer: '27' },
      { id: 'f2q14', prompt: '¿Qué número sigue? 4, 8, 12, 16, …', options: ['18', '20', '22', '24'], answer: '20' },
      {
        id: 'f2q15', prompt: 'Hay 3 grupos con 4 elementos cada uno. ¿Cuántos hay en total?',
        themed: {
          futbol: 'Hay 3 equipos con 4 jugadores cada uno. ¿Cuántos jugadores hay en total?',
          animales: 'Hay 3 nidos con 4 pajaritos cada uno. ¿Cuántos pajaritos hay en total?',
          espacio: 'Hay 3 naves con 4 marcianos cada una. ¿Cuántos marcianos hay en total?',
        },
        options: ['7', '10', '12', '14'], answer: '12',
      },
      { id: 'f2q16', prompt: '¿Cuánto es 48 ÷ 8?', options: ['5', '6', '7', '8'], answer: '6' },
    ],
  },
];

export const EXPERIMENT_CONFIG = {
  // Segundos de inactividad que cuentan como un "evento de distracción" (idle).
  idleSeconds: 20,
  module: 'Matemática',
  // El documento fija actividades de 10 a 12 minutos. El tiempo NO se muestra
  // al niño (el docente pidió no generar presión); al agotarse, la actividad
  // termina con amabilidad. Con 16 preguntas se evita el efecto techo en la
  // tasa de finalización (si todos terminan todo, la métrica no discrimina).
  durationOptions: [10, 12] as const,
  defaultDuration: 10,
  // "Varios niños no reconocen la personalización" → umbral operacional.
  minRecognitionRate: 70,
};

/** Definiciones operacionales (respuesta a la devolución del docente). */
export const OPERATIONAL_DEFINITIONS: { term: string; definition: string }[] = [
  { term: 'Finalización', definition: 'Preguntas completadas ÷ preguntas propuestas × 100, dentro del tiempo de la actividad.' },
  { term: 'Precisión', definition: 'Respuestas correctas ÷ preguntas respondidas × 100.' },
  { term: 'Distracción', definition: `Cada toque a un elemento decorativo que no sirve para responder, o cada ${EXPERIMENT_CONFIG.idleSeconds} s sin interactuar. Lo registra la app automáticamente (mismo criterio para todos).` },
  { term: 'Abandono', definition: 'El niño pide terminar (botón "Terminar") antes de completar la actividad o de que se acabe el tiempo.' },
  { term: 'Decisión de continuar', definition: 'Al final de cada actividad se pregunta "¿Quieres seguir jugando?"; se registra Sí/No.' },
  { term: 'Reconocimiento', definition: 'Tras la versión personalizada se pregunta "¿Este mundo tiene cosas que te gustan?"; se registra Sí/No.' },
];

/** Decisión concreta, definida de antemano, para cada zona de resultados. */
export const ZONE_DECISIONS: Record<'exitoso' | 'ambiguo' | 'rechazar', { title: string; decision: string }> = {
  exitoso: {
    title: 'Alentador',
    decision: 'Pasar a un piloto de varias semanas con más actividades y temáticas, sesiones repetidas y medición de aprendizaje y permanencia del interés.',
  },
  ambiguo: {
    title: 'Ambiguo',
    decision: 'Comprobar la equivalencia de los formularios, el efecto del orden y la configuración de preferencias; corregir y REPETIR la prueba antes de decidir.',
  },
  rechazar: {
    title: 'Modificar la hipótesis',
    decision: 'Simplificar los elementos visuales, ajustar la gamificación y dejar que el niño confirme sus gustos antes de repetir la comparación.',
  },
};
