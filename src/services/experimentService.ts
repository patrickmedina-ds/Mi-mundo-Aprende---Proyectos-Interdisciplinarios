import { EXPERIMENT_CONFIG, type ExperimentThemeId } from '../data/experiment';

export type ActivityVersion = 'generic' | 'personalized';

/**
 * Resultado de UNA actividad (una versión) para un participante.
 * Definición operacional de "evento de distracción": cada vez que el niño toca
 * un elemento decorativo/temático que NO es parte de responder, o permanece
 * inactivo más de `idleSeconds`.
 */
export interface ActivityResult {
  version: ActivityVersion;
  formId: string;
  proposed: number;        // preguntas propuestas
  answered: number;        // preguntas respondidas
  completed: number;       // preguntas completadas
  correct: number;         // respuestas correctas
  abandoned: boolean;      // pidió terminar antes del final
  timedOut: boolean;       // se agotó el tiempo de la actividad
  distractionEvents: number;
  timeMs: number;
  continued: boolean;      // decisión voluntaria de continuar al final
  recognizedTheme: boolean | null; // solo versión personalizada
}

export interface ParticipantResult {
  id: string;
  code: string;            // código/alias del participante (sin datos personales)
  grade: 3 | 4 | 5;
  themeId: ExperimentThemeId;
  firstVersion: ActivityVersion; // orden (contrabalanceo)
  durationMin: number;
  guardianConsent: boolean;      // autorización del apoderado
  childConfirmedTheme: boolean;  // el niño confirmó que el tema le gusta
  generic: ActivityResult;
  personalized: ActivityResult;
  createdAt: string;
}

const STORAGE_KEY = 'mundo-experiment-results';

export function loadResults(): ParticipantResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ParticipantResult[]) : [];
  } catch {
    return [];
  }
}

export function saveResult(result: ParticipantResult): ParticipantResult[] {
  const all = [...loadResults(), result];
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch { /* ignore */ }
  return all;
}

export function clearResults(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

export function finalizationRate(a: ActivityResult): number {
  return a.proposed > 0 ? Math.round((a.completed / a.proposed) * 1000) / 10 : 0;
}

export function precisionRate(a: ActivityResult): number {
  return a.answered > 0 ? Math.round((a.correct / a.answered) * 1000) / 10 : 0;
}

export type DecisionZone = 'exitoso' | 'ambiguo' | 'rechazar';

export interface AggregateMetrics {
  n: number;
  genericFinalization: number;
  personalizedFinalization: number;
  finalizationDelta: number;   // puntos porcentuales (personalizada − genérica)
  genericPrecision: number;
  personalizedPrecision: number;
  precisionDelta: number;
  genericDistraction: number;
  personalizedDistraction: number;
  genericAbandon: number;      // % que abandonó
  personalizedAbandon: number;
  genericContinue: number;     // % que quiso seguir
  personalizedContinue: number;
  recognitionRate: number | null; // % que reconoce la temática como suya
  checks: {
    finalization: boolean;
    precision: boolean;
    distraction: boolean;
    abandon: boolean;
    recognition: boolean;
  };
  zone: DecisionZone;
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10;
}

const pct = (count: number, total: number) => (total ? Math.round((count / total) * 1000) / 10 : 0);

export function aggregate(results: ParticipantResult[]): AggregateMetrics {
  const n = results.length;
  const genericFinalization = mean(results.map((r) => finalizationRate(r.generic)));
  const personalizedFinalization = mean(results.map((r) => finalizationRate(r.personalized)));
  const finalizationDelta = Math.round((personalizedFinalization - genericFinalization) * 10) / 10;
  const genericPrecision = mean(results.map((r) => precisionRate(r.generic)));
  const personalizedPrecision = mean(results.map((r) => precisionRate(r.personalized)));
  const precisionDelta = Math.round((personalizedPrecision - genericPrecision) * 10) / 10;
  const genericDistraction = mean(results.map((r) => r.generic.distractionEvents));
  const personalizedDistraction = mean(results.map((r) => r.personalized.distractionEvents));
  const genericAbandon = pct(results.filter((r) => r.generic.abandoned).length, n);
  const personalizedAbandon = pct(results.filter((r) => r.personalized.abandoned).length, n);
  const recognitionAnswers = results.map((r) => r.personalized.recognizedTheme).filter((v) => v !== null && v !== undefined);
  const recognitionRate = recognitionAnswers.length
    ? pct(recognitionAnswers.filter(Boolean).length, recognitionAnswers.length)
    : null;

  // Criterios fijados de antemano en el documento (Criterio B, Fase 4).
  const checks = {
    finalization: finalizationDelta >= 15,
    precision: precisionDelta >= -5,
    distraction: personalizedDistraction <= genericDistraction,
    abandon: personalizedAbandon <= genericAbandon,
    recognition: recognitionRate === null || recognitionRate >= EXPERIMENT_CONFIG.minRecognitionRate,
  };
  // Cualquier daño (precisión, distracciones, abandonos o no reconocer la
  // temática) obliga a modificar la hipótesis aunque la finalización suba.
  const harm = !checks.precision || !checks.distraction || !checks.abandon || !checks.recognition;
  let zone: DecisionZone;
  if (finalizationDelta < 5 || harm) zone = 'rechazar';
  else if (finalizationDelta >= 15) zone = 'exitoso';
  else zone = 'ambiguo';

  return {
    n,
    genericFinalization, personalizedFinalization, finalizationDelta,
    genericPrecision, personalizedPrecision, precisionDelta,
    genericDistraction, personalizedDistraction,
    genericAbandon, personalizedAbandon,
    genericContinue: pct(results.filter((r) => r.generic.continued).length, n),
    personalizedContinue: pct(results.filter((r) => r.personalized.continued).length, n),
    recognitionRate,
    checks,
    zone,
  };
}

const yn = (value: boolean | null | undefined) => (value === null || value === undefined ? '' : value ? 'si' : 'no');

export function toCSV(results: ParticipantResult[]): string {
  const headers = [
    'codigo', 'grado', 'tema', 'primera_version', 'duracion_min', 'autorizacion_apoderado', 'nino_confirmo_tema',
    'gen_formulario', 'gen_finalizacion_%', 'gen_precision_%', 'gen_completadas', 'gen_respondidas', 'gen_correctas', 'gen_abandono', 'gen_tiempo_agotado', 'gen_distracciones', 'gen_tiempo_s', 'gen_continuar',
    'per_formulario', 'per_finalizacion_%', 'per_precision_%', 'per_completadas', 'per_respondidas', 'per_correctas', 'per_abandono', 'per_tiempo_agotado', 'per_distracciones', 'per_tiempo_s', 'per_continuar', 'per_reconoce_tema',
    'delta_finalizacion_pp', 'fecha',
  ];
  const activityCols = (a: ActivityResult) => [
    a.formId, finalizationRate(a), precisionRate(a), a.completed, a.answered, a.correct,
    yn(a.abandoned), yn(a.timedOut), a.distractionEvents, Math.round(a.timeMs / 1000), yn(a.continued),
  ];
  const rows = results.map((r) => {
    const delta = Math.round((finalizationRate(r.personalized) - finalizationRate(r.generic)) * 10) / 10;
    return [
      r.code, r.grade, r.themeId, r.firstVersion, r.durationMin, yn(r.guardianConsent), yn(r.childConfirmedTheme),
      ...activityCols(r.generic),
      ...activityCols(r.personalized), yn(r.personalized.recognizedTheme),
      delta, r.createdAt,
    ].map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',');
  });
  return [headers.join(','), ...rows].join('\n');
}

export function downloadCSV(results: ParticipantResult[]): void {
  // BOM para que Excel abra bien las tildes.
  const blob = new Blob(['﻿' + toCSV(results)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mi-mundo-aprende-experimento-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
