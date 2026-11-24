import { CURRICULUM } from '../data/curriculum';
import { readEvents } from './analyticsService';

export interface SkillStat {
  skill: string;
  total: number;
  firstTry: number;
  pct: number;
}

export interface DayActivity {
  label: string;
  count: number;
  isToday: boolean;
}

const DAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

const SKILL_BY_QUESTION = new Map<string, string>(
  CURRICULUM.flatMap((course) => course.topics.flatMap((topic) => topic.questions))
    .map((question) => [String(question.id), question.skill]),
);

function answersOf(childId: string) {
  return readEvents().filter((event) => event.type === 'ANSWER_SUBMITTED' && event.child_id === childId);
}

/** Acierto al primer intento por habilidad, calculado con las respuestas reales registradas. */
export function getSkillStats(childId: string): SkillStat[] {
  const bySkill = new Map<string, { total: number; firstTry: number }>();
  answersOf(childId).forEach((event) => {
    const skill = SKILL_BY_QUESTION.get(String(event.metadata.question_id));
    if (!skill) return;
    const entry = bySkill.get(skill) || { total: 0, firstTry: 0 };
    entry.total += 1;
    if (event.metadata.is_correct && event.metadata.attempt_number === 1) entry.firstTry += 1;
    bySkill.set(skill, entry);
  });
  return [...bySkill].map(([skill, { total, firstTry }]) => ({
    skill, total, firstTry, pct: Math.round((firstTry / total) * 100),
  }));
}

/** Preguntas respondidas por día en los últimos 7 días (el último elemento es hoy). */
export function getWeekActivity(childId: string): DayActivity[] {
  const days = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - offset));
    return date;
  });
  const counts = days.map(() => 0);
  answersOf(childId).forEach((event) => {
    const when = new Date(event.created_at);
    when.setHours(0, 0, 0, 0);
    const slot = days.findIndex((day) => day.getTime() === when.getTime());
    if (slot >= 0) counts[slot] += 1;
  });
  return days.map((day, index) => ({ label: DAY_LABELS[day.getDay()], count: counts[index], isToday: index === 6 }));
}
