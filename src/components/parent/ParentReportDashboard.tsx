import { BookOpen, Clock3, Flame, Sparkles, Target } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { ChildProfile, ConsentRecord, Universe } from '../../types/domain';
import ConsentStatus from '../consent/ConsentStatus';
import { getSkillStats, getWeekActivity } from '../../services/reportService';
import {
  displayWorldName, emblemById, interestById, paletteById, petById, resolvePersonalization, worldBackgroundStyle,
  type Interest,
} from '../../data/personalization';

function ChildWorld({ profile, universe }: { profile: ChildProfile; universe: Universe }) {
  const pz = resolvePersonalization(profile, universe);
  const palette = paletteById(pz.palette);
  const pet = petById(pz.pet);
  const emblem = emblemById(pz.emblem);
  const likes = pz.interests.map(interestById).filter(Boolean) as Interest[];
  return (
    <section className="report-world">
      <div className="report-world-visual" style={worldBackgroundStyle(pz.palette, pz.background)}>
        <span className="report-world-avatar">{profile.avatar}</span>
        {pet && <span className="report-world-pet">{pet.emoji}</span>}
      </div>
      <div className="report-world-copy">
        <p className="eyebrow">El mundo que eligió {profile.name}</p>
        <h3>{emblem?.emoji} {displayWorldName(pz, universe)}</h3>
        <p>{universe.icon} {universe.name} · colores {palette?.name} · compañero {pet?.emoji} {pet?.name}</p>
        <div className="report-likes">
          <span className="report-likes-label">Le gusta:</span>
          {likes.length
            ? likes.map((interest) => <span className="like-chip" key={interest.id}>{interest.emoji} {interest.name}</span>)
            : <span className="like-empty">Aún no eligió sus gustos en "Mi guarida".</span>}
        </div>
      </div>
    </section>
  );
}

interface ParentReportDashboardProps {
  profiles: ChildProfile[];
  universes: Record<string, Universe>;
  consent: ConsentRecord | null;
  onRevoke: () => void;
  onBack: () => void;
  onSubscription: () => void;
}

function Metric({ icon, value, label, note }: { icon: ReactNode; value: ReactNode; label: string; note: string }) {
  return <div className="metric-card"><span className="metric-icon">{icon}</span><strong>{value}</strong><span>{label}</span><small>{note}</small></div>;
}

function SkillsBox({ profile }: { profile: ChildProfile }) {
  const stats = getSkillStats(profile.id);
  const skills = [...new Set([...profile.strengths, ...profile.needs, ...stats.map((item) => item.skill)])];
  return (
    <section className="report-box">
      <div className="box-heading"><h3>Habilidades</h3><span>Acierto al primer intento</span></div>
      {skills.length === 0 && <p className="report-empty">Aún no hay habilidades registradas. Aparecerán cuando responda sus primeras preguntas.</p>}
      {skills.map((skill) => {
        const stat = stats.find((item) => item.skill === skill);
        const needs = stat ? stat.pct < 70 : profile.needs.includes(skill);
        return (
          <div className="skill-row" key={skill}>
            <span className="skill-name"><span className={needs ? 'skill-dot needs' : 'skill-dot strong'} />{skill}</span>
            <div className="skill-bar">{stat && <span className={needs ? 'needs-bar' : ''} style={{ width: `${stat.pct}%` }} />}</div>
            <strong>{stat ? `${stat.pct}%` : needs ? 'En práctica' : 'Fuerte'}</strong>
          </div>
        );
      })}
    </section>
  );
}

function ActivityBox({ profile }: { profile: ChildProfile }) {
  const week = getWeekActivity(profile.id);
  const total = week.reduce((sum, day) => sum + day.count, 0);
  const peak = Math.max(1, ...week.map((day) => day.count));
  return (
    <section className="report-box activity-box">
      <div className="box-heading"><h3>Actividad reciente</h3><span>Últimos 7 días</span></div>
      <div className="week-bars">
        {week.map((day, index) => (
          <div className="day-bar" key={index}>
            <span className="bar-track"><i style={{ height: day.count ? `${Math.max(12, (day.count / peak) * 100)}%` : 0 }} /></span>
            <small>{day.label}</small>
          </div>
        ))}
      </div>
      <div className="activity-total"><span>{total ? 'preguntas respondidas' : 'Sin actividad en los últimos 7 días'}</span><strong>{total ? total : ''}</strong></div>
    </section>
  );
}

export default function ParentReportDashboard({ profiles, universes, consent, onRevoke, onBack, onSubscription }: ParentReportDashboardProps) {
  const [selected, setSelected] = useState(profiles[0]);
  const started = selected.answered > 0;
  const weekAnswers = getWeekActivity(selected.id).reduce((sum, day) => sum + day.count, 0);
  const practiced = new Set([...selected.strengths, ...selected.needs, ...getSkillStats(selected.id).map((item) => item.skill)]).size;

  return (
    <main className="parent-page">
      <header className="parent-header"><button className="back-btn" onClick={onBack}>‹ Vista de explorador</button><div className="parent-title"><span className="brand-mark">✦</span><span>Panel de familia</span></div><span className="safe-label">Datos protegidos</span></header>
      <div className="parent-body">
        <div className="parent-intro"><div><p className="eyebrow">Resumen semanal</p><h1>El aprendizaje crece cuando lo ves.</h1><p className="muted">Acompaña el avance sin interrumpir su aventura.</p></div><button className="subscription-cta" onClick={onSubscription}><Sparkles size={17} /> Continuar por S/ 10/mes</button></div>
        <div className="child-tabs">{profiles.map((profile) => <button className={selected.id === profile.id ? 'child-tab active' : 'child-tab'} key={profile.id} onClick={() => setSelected(profile)}><span>{profile.avatar}</span>{profile.name}<span className="tab-dot" style={{ background: profile.color }} /></button>)}</div>
        <section className="report-hero"><div><span className="report-avatar">{selected.avatar}</span><div><h2>{started ? `${selected.name} está avanzando` : `${selected.name} aún no empieza`}</h2><p>{started ? `Su mundo es ${universes[selected.universe].name}.` : 'Cuando practique, aquí verás su avance.'}</p></div></div><div className="report-streak"><Flame size={20} /><strong>{selected.streak}</strong><span>días seguidos</span></div></section>
        {selected.ab_group === 'A' && universes[selected.universe] && <ChildWorld profile={selected} universe={universes[selected.universe]} />}
        <div className="metrics-grid"><Metric icon={<Clock3 />} value={`${Math.round(selected.minutes)} min`} label="Tiempo de práctica" note={started ? 'Acumulado' : 'Aún sin práctica'} /><Metric icon={<BookOpen />} value={selected.answered} label="Preguntas resueltas" note={started ? `${weekAnswers} en los últimos 7 días` : 'Aún sin datos'} /><Metric icon={<Target />} value={practiced} label="Habilidades practicadas" note={practiced ? 'Con respuestas registradas' : 'Aún sin datos'} /></div>
        <div className="report-columns"><SkillsBox profile={selected} /><ActivityBox profile={selected} /></div>
        <ConsentStatus consent={consent} onRevoke={onRevoke} />
      </div>
    </main>
  );
}
