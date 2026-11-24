import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowRight, BarChart3, Check, ChevronLeft, Download, FlaskConical, Info, PlayCircle,
  ShieldCheck, Trash2, X,
} from 'lucide-react';
import {
  EXPERIMENT_THEMES, EXPERIMENT_FORMS, EXPERIMENT_CONFIG, OPERATIONAL_DEFINITIONS, ZONE_DECISIONS,
  type ExperimentForm, type ExperimentTheme, type ExperimentThemeId,
} from '../../data/experiment';
import {
  loadResults, saveResult, clearResults, aggregate, finalizationRate, precisionRate, downloadCSV,
  type ActivityResult, type ActivityVersion, type ParticipantResult,
} from '../../services/experimentService';

type Phase = 'intro' | 'setup' | 'ready' | 'activity' | 'results' | 'dashboard';

interface ExperimentModeProps {
  onExit: () => void;
}

export default function ExperimentMode({ onExit }: ExperimentModeProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [results, setResults] = useState<ParticipantResult[]>(() => loadResults());
  const [lastParticipant, setLastParticipant] = useState<ParticipantResult | null>(null);

  // --- Configuración del participante ---
  const [code, setCode] = useState('');
  const [grade, setGrade] = useState<3 | 4 | 5>(4);
  const [themeId, setThemeId] = useState<ExperimentThemeId>('futbol');
  const [firstVersion, setFirstVersion] = useState<ActivityVersion>('generic');
  const [durationMin, setDurationMin] = useState<number>(EXPERIMENT_CONFIG.defaultDuration);
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [childConfirmed, setChildConfirmed] = useState(false);

  // --- Estado de la corrida ---
  const [step, setStep] = useState(0); // 0 = primera actividad, 1 = segunda
  const [activityResults, setActivityResults] = useState<Partial<Record<ActivityVersion, ActivityResult>>>({});

  const theme = EXPERIMENT_THEMES[themeId];
  const versionOrder: ActivityVersion[] = firstVersion === 'generic'
    ? ['generic', 'personalized']
    : ['personalized', 'generic'];
  // La 1.ª actividad usa F1 y la 2.ª usa F2 (formularios paralelos de igual dificultad).
  const formOrder: ExperimentForm[] = [EXPERIMENT_FORMS[0], EXPERIMENT_FORMS[1]];

  const startSession = () => {
    // Contrabalanceo: alterna el orden según cuántos participantes ya hay.
    setFirstVersion(results.length % 2 === 0 ? 'generic' : 'personalized');
    setCode('');
    setGuardianConsent(false);
    setChildConfirmed(false);
    setStep(0);
    setActivityResults({});
    setPhase('setup');
  };

  const onActivityFinish = (version: ActivityVersion, result: ActivityResult) => {
    const merged = { ...activityResults, [version]: result };
    setActivityResults(merged);
    if (step === 0) { setStep(1); setPhase('ready'); return; }
    const participant: ParticipantResult = {
      id: `p-${Date.now()}`,
      code: code.trim() || `Participante ${results.length + 1}`,
      grade, themeId, firstVersion, durationMin,
      guardianConsent, childConfirmedTheme: childConfirmed,
      generic: merged.generic!, personalized: merged.personalized!,
      createdAt: new Date().toISOString(),
    };
    setResults(saveResult(participant));
    setLastParticipant(participant);
    setPhase('results');
  };

  if (phase === 'activity') {
    const version = versionOrder[step];
    const form = formOrder[step];
    return (
      <ExperimentActivity
        key={`${version}-${form.id}`}
        version={version}
        theme={theme}
        form={form}
        durationMs={durationMin * 60 * 1000}
        onFinish={(r) => onActivityFinish(version, r)}
      />
    );
  }

  return (
    <main className="exp-page">
      <div className="exp-topbar">
        <button className="back-btn" onClick={onExit}><ChevronLeft size={18} /> Salir del laboratorio</button>
        <span className="exp-tag"><FlaskConical size={15} /> Modo experimento</span>
      </div>
      <div className="exp-inner">
        {phase === 'intro' && (
          <section className="exp-card">
            <p className="eyebrow">Criterio B · Validación</p>
            <h1>Laboratorio de validación</h1>
            <p className="muted">
              Cada niño realiza <strong>dos actividades del mismo módulo de Matemática</strong> con la misma dificultad,
              la misma cantidad de preguntas y el mismo tiempo ({EXPERIMENT_CONFIG.durationOptions.join(' o ')} min): una
              <strong> genérica</strong> y una <strong>personalizada</strong>. Se mide si la personalización mejora la
              finalización sin reducir la precisión ni aumentar las distracciones.
            </p>
            <div className="exp-note">
              <strong>Importante:</strong> ambas versiones tienen la <strong>misma dificultad</strong>; solo cambian la
              temática y la gamificación. El orden se contrabalancea automáticamente. El niño <strong>no ve un reloj</strong> ni
              una nota: no es una evaluación académica.
            </div>
            <div className="exp-actions">
              <button className="primary-btn" onClick={startSession}><PlayCircle size={18} /> Nueva sesión</button>
              <button className="exp-ghost" onClick={() => setPhase('dashboard')}><BarChart3 size={17} /> Ver resultados ({results.length})</button>
            </div>
          </section>
        )}

        {phase === 'setup' && (
          <section className="exp-card">
            <p className="eyebrow">Antes de empezar</p>
            <h1>Configurar participante</h1>
            <label className="exp-field">Código del niño (no uses su nombre completo)
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={`Participante ${results.length + 1}`} autoFocus />
            </label>
            <p className="exp-label">Grado</p>
            <div className="exp-choices">
              {[3, 4, 5].map((g) => (
                <button key={g} className={grade === g ? 'exp-choice selected' : 'exp-choice'} onClick={() => setGrade(g as 3 | 4 | 5)}>{g}.° grado</button>
              ))}
            </div>
            <p className="exp-label">Tema preferido (lo configura el apoderado)</p>
            <div className="exp-choices">
              {Object.values(EXPERIMENT_THEMES).map((t) => (
                <button key={t.id} className={themeId === t.id ? 'exp-choice selected' : 'exp-choice'} onClick={() => { setThemeId(t.id); setChildConfirmed(false); }}>{t.icon} {t.name}</button>
              ))}
            </div>
            <p className="exp-label">Duración de cada actividad</p>
            <div className="exp-choices">
              {EXPERIMENT_CONFIG.durationOptions.map((m) => (
                <button key={m} className={durationMin === m ? 'exp-choice selected' : 'exp-choice'} onClick={() => setDurationMin(m)}>{m} minutos</button>
              ))}
            </div>
            <div className="exp-checks">
              <label className={`exp-check ${childConfirmed ? 'on' : ''}`}>
                <input type="checkbox" checked={childConfirmed} onChange={(e) => setChildConfirmed(e.target.checked)} />
                <span><strong>El niño confirmó que le gusta el tema {theme.icon} {theme.name}.</strong> Si no, elijan otro tema juntos.</span>
              </label>
              <label className={`exp-check required ${guardianConsent ? 'on' : ''}`}>
                <input type="checkbox" checked={guardianConsent} onChange={(e) => setGuardianConsent(e.target.checked)} />
                <span><ShieldCheck size={15} /> <strong>El apoderado autorizó la participación</strong> y sabe que no es una evaluación académica.</span>
              </label>
            </div>
            <div className="exp-note">
              Orden asignado (contrabalanceo): empieza con la versión <strong>{firstVersion === 'generic' ? 'genérica' : 'personalizada'}</strong>.
            </div>
            <div className="exp-actions">
              <button className="primary-btn" disabled={!guardianConsent} onClick={() => { setStep(0); setActivityResults({}); setPhase('ready'); }}>Comenzar actividades <ArrowRight size={17} /></button>
              <button className="exp-ghost" onClick={() => setPhase('intro')}>Cancelar</button>
              {!guardianConsent && <span className="exp-hint">Se necesita la autorización del apoderado para comenzar.</span>}
            </div>
          </section>
        )}

        {phase === 'ready' && (
          <section className="exp-card exp-ready">
            <span className="exp-big-number">{step + 1}<small>/2</small></span>
            <h1>Actividad {step + 1} de 2</h1>
            <p className="muted">
              Versión <strong>{versionOrder[step] === 'generic' ? 'genérica (neutra)' : `personalizada (${theme.name})`}</strong> ·
              {' '}{formOrder[step].questions.length} preguntas de {EXPERIMENT_CONFIG.module} · hasta {durationMin} min.
            </p>
            <p className="exp-hint">El facilitador controla el tiempo; el niño no ve el reloj.</p>
            <button className="primary-btn" onClick={() => setPhase('activity')}><PlayCircle size={18} /> Empezar actividad</button>
          </section>
        )}

        {phase === 'results' && lastParticipant && (
          <ResultsView participant={lastParticipant} onNew={startSession} onDashboard={() => setPhase('dashboard')} />
        )}

        {phase === 'dashboard' && (
          <DashboardView
            results={results}
            onBack={() => setPhase('intro')}
            onNew={startSession}
            onClear={() => { clearResults(); setResults([]); }}
          />
        )}
      </div>
    </main>
  );
}

// ============================= ACTIVIDAD =============================
type Stage = 'play' | 'continue' | 'recognize';

interface PlayEnd {
  completed: number;
  abandoned: boolean;
  timedOut: boolean;
  continued: boolean;
}

function ExperimentActivity({
  version, theme, form, durationMs, onFinish,
}: {
  version: ActivityVersion;
  theme: ExperimentTheme;
  form: ExperimentForm;
  durationMs: number;
  onFinish: (result: ActivityResult) => void;
}) {
  const personalized = version === 'personalized';
  const proposed = form.questions.length;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [coins, setCoins] = useState(0);
  const [stage, setStage] = useState<Stage>('play');
  // Refs: el temporizador y la detección de inactividad leen valores actuales.
  const answeredRef = useRef(0);
  const correctRef = useRef(0);
  const distractionRef = useRef(0);
  const startRef = useRef(Date.now());
  const lastActivityRef = useRef(Date.now());
  const endRef = useRef<PlayEnd | null>(null);
  const playTimeRef = useRef(0);

  const q = form.questions[index];
  const prompt = personalized ? (q.themed?.[theme.id] || q.prompt) : q.prompt;

  const bump = () => { lastActivityRef.current = Date.now(); };

  const endPlay = (info: Omit<PlayEnd, 'continued'>) => {
    if (endRef.current) return;
    endRef.current = { ...info, continued: false };
    playTimeRef.current = Date.now() - startRef.current;
  };

  const finish = (recognized: boolean | null) => {
    const end = endRef.current!;
    onFinish({
      version, formId: form.id, proposed,
      answered: answeredRef.current, completed: end.completed, correct: correctRef.current,
      abandoned: end.abandoned, timedOut: end.timedOut,
      distractionEvents: distractionRef.current, timeMs: playTimeRef.current,
      continued: end.continued, recognizedTheme: personalized ? recognized : null,
    });
  };

  // Tiempo máximo de la actividad (oculto al niño).
  useEffect(() => {
    const timer = setTimeout(() => {
      if (endRef.current) return;
      endPlay({ completed: answeredRef.current, abandoned: false, timedOut: true });
      setStage('continue');
    }, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs]);

  // Inactividad prolongada = evento de distracción (solo mientras juega).
  useEffect(() => {
    const t = setInterval(() => {
      if (endRef.current) return;
      if (Date.now() - lastActivityRef.current > EXPERIMENT_CONFIG.idleSeconds * 1000) {
        distractionRef.current += 1;
        lastActivityRef.current = Date.now();
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const answer = (option: string) => {
    bump();
    if (result) return; // una respuesta por pregunta: métricas limpias
    const ok = option === q.answer;
    setSelected(option);
    setResult(ok ? 'correct' : 'wrong');
    answeredRef.current += 1;
    if (ok) {
      correctRef.current += 1;
      if (personalized) setCoins((c) => c + 10);
    }
  };

  const next = () => {
    bump();
    if (index >= proposed - 1) {
      endPlay({ completed: answeredRef.current, abandoned: false, timedOut: false });
      setStage('continue');
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setResult(null);
  };

  const abandon = () => {
    endPlay({ completed: answeredRef.current, abandoned: true, timedOut: false });
    if (personalized) setStage('recognize');
    else finish(null);
  };

  const chooseContinue = (value: boolean) => {
    endRef.current!.continued = value;
    if (personalized) setStage('recognize');
    else finish(null);
  };

  const shellClass = `exp-activity ${personalized ? 'exp-personalized' : 'exp-generic'}`;
  const shellStyle = personalized ? ({ background: theme.background } as CSSProperties) : undefined;

  if (stage === 'continue') {
    const timedOut = endRef.current?.timedOut;
    return (
      <main className={shellClass} style={shellStyle}>
        <div className="exp-continue">
          <span className="exp-continue-icon">{personalized ? theme.reward : '✅'}</span>
          <h2>{timedOut ? '¡Se acabó el tiempo de esta actividad!' : '¡Terminaste la actividad!'}</h2>
          <p>¿Quieres seguir jugando?</p>
          <div className="exp-continue-actions">
            <button className="primary-btn" onClick={() => chooseContinue(true)}>Sí, quiero seguir</button>
            <button className={`exp-ghost ${personalized ? 'light' : ''}`} onClick={() => chooseContinue(false)}>No, ya terminé</button>
          </div>
        </div>
      </main>
    );
  }

  if (stage === 'recognize') {
    return (
      <main className={shellClass} style={shellStyle}>
        <div className="exp-continue">
          <span className="exp-continue-icon">{theme.icon}</span>
          <h2>Una última pregunta 😊</h2>
          <p>¿Este mundo tiene cosas que te gustan?</p>
          <div className="exp-continue-actions">
            <button className="primary-btn" onClick={() => finish(true)}>👍 Sí, me gusta</button>
            <button className="exp-ghost light" onClick={() => finish(false)}>👎 No mucho</button>
          </div>
        </div>
      </main>
    );
  }

  const accent = personalized ? theme.accent : '#64748b';
  return (
    <main className={shellClass} style={shellStyle} onClick={bump}>
      <div className="exp-activity-top">
        <button className="exp-exit" onClick={abandon}><X size={18} /> Terminar</button>
        <div className="exp-progress"><span style={{ width: `${(index / proposed) * 100}%`, background: personalized ? '#fff' : accent }} /></div>
        <span className="exp-count">{index + 1} / {proposed}</span>
        {personalized && <span className="exp-coin">{theme.coin} {coins}</span>}
      </div>

      <div className="exp-activity-body">
        {personalized && (
          <div className="exp-theme-row">
            <span className="exp-companion">{theme.companion}</span>
            <span className="exp-theme-name">Mundo {theme.name}</span>
          </div>
        )}

        <div className={`exp-question-card ${personalized ? 'themed' : ''}`} style={personalized ? ({ '--acc': accent } as CSSProperties) : undefined}>
          <h1>{prompt}</h1>
          <div className="exp-options">
            {q.options.map((opt) => (
              <button
                key={opt}
                disabled={Boolean(result) && selected !== opt && opt !== q.answer}
                className={`exp-option ${selected === opt ? (result === 'correct' ? 'correct' : 'wrong') : ''} ${result && opt === q.answer ? 'reveal' : ''}`}
                onClick={() => answer(opt)}
              >
                {opt}{result && opt === q.answer && <Check size={18} />}
              </button>
            ))}
          </div>
          {result && (
            <div className={`exp-feedback ${result}`}>
              {result === 'correct'
                ? (personalized ? `${theme.icon} ¡Muy bien! ${theme.coin}+10` : '¡Correcto!')
                : `Casi. La respuesta correcta es ${q.answer}.`}
            </div>
          )}
          <button className="primary-btn exp-next" disabled={!result} onClick={next}>
            {index >= proposed - 1 ? 'Terminar' : 'Siguiente'} <ArrowRight size={17} />
          </button>
        </div>

        {personalized && (
          <div className="exp-decor">
            <span className="exp-decor-hint">Toca para jugar:</span>
            {theme.decor.map((d, i) => (
              <button
                key={i}
                className="exp-decor-item"
                aria-label="Decoración"
                onClick={() => { distractionRef.current += 1; bump(); }}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ============================= RESULTADOS (participante) =============================
function ResultsView({ participant, onNew, onDashboard }: {
  participant: ParticipantResult;
  onNew: () => void;
  onDashboard: () => void;
}) {
  const g = participant.generic;
  const p = participant.personalized;
  const delta = Math.round((finalizationRate(p) - finalizationRate(g)) * 10) / 10;
  return (
    <section className="exp-card">
      <p className="eyebrow">Resultado guardado</p>
      <h1>{participant.code} · {participant.grade}.° grado</h1>
      <p className="exp-hint">
        Tema {EXPERIMENT_THEMES[participant.themeId].icon} {EXPERIMENT_THEMES[participant.themeId].name}
        {' '}· {participant.childConfirmedTheme ? 'confirmado por el niño' : 'no confirmado por el niño'} · {participant.durationMin} min por actividad
      </p>
      <div className="exp-compare">
        <MetricCol title="Genérica" a={g} />
        <MetricCol title={`Personalizada (${EXPERIMENT_THEMES[participant.themeId].name})`} a={p} highlight />
      </div>
      <div className={`exp-delta ${delta >= 15 ? 'good' : delta < 5 ? 'bad' : 'mid'}`}>
        Diferencia en finalización: <strong>{delta >= 0 ? '+' : ''}{delta} pp</strong> (personalizada − genérica)
      </div>
      <div className="exp-actions">
        <button className="primary-btn" onClick={onNew}>Siguiente participante <ArrowRight size={17} /></button>
        <button className="exp-ghost" onClick={onDashboard}><BarChart3 size={17} /> Ver panel de resultados</button>
      </div>
    </section>
  );
}

function MetricCol({ title, a, highlight }: { title: string; a: ActivityResult; highlight?: boolean }) {
  return (
    <div className={`exp-metric-col ${highlight ? 'hl' : ''}`}>
      <h3>{title}</h3>
      <div className="exp-metric"><b>{finalizationRate(a)}%</b><span>finalización ({a.completed}/{a.proposed})</span></div>
      <div className="exp-metric"><b>{precisionRate(a)}%</b><span>precisión ({a.correct}/{a.answered})</span></div>
      <div className="exp-metric"><b>{a.distractionEvents}</b><span>distracciones</span></div>
      <div className="exp-metric"><b>{Math.round(a.timeMs / 1000)}s</b><span>tiempo{a.timedOut ? ' (se agotó)' : ''}</span></div>
      <div className="exp-metric"><b>{a.abandoned ? 'Sí' : 'No'}</b><span>abandonó</span></div>
      <div className="exp-metric"><b>{a.continued ? 'Sí' : 'No'}</b><span>quiso seguir</span></div>
      {a.recognizedTheme !== null && (
        <div className="exp-metric"><b>{a.recognizedTheme ? 'Sí' : 'No'}</b><span>reconoce el tema como suyo</span></div>
      )}
    </div>
  );
}

// ============================= PANEL (facilitador) =============================
function DashboardView({ results, onBack, onNew, onClear }: {
  results: ParticipantResult[];
  onBack: () => void;
  onNew: () => void;
  onClear: () => void;
}) {
  const agg = useMemo(() => aggregate(results), [results]);
  const byGrade = useMemo(() => {
    const groups: Record<number, ParticipantResult[]> = {};
    results.forEach((r) => { (groups[r.grade] ||= []).push(r); });
    return groups;
  }, [results]);
  const zone = ZONE_DECISIONS[agg.zone];
  const zoneIcon = { exitoso: '✅', ambiguo: '🟡', rechazar: '🔴' }[agg.zone];

  return (
    <section className="exp-card wide">
      <div className="exp-dash-head">
        <div>
          <p className="eyebrow">Panel del facilitador</p>
          <h1>Resultados del experimento</h1>
        </div>
        <div className="exp-dash-actions">
          <button className="exp-ghost" onClick={onNew}><PlayCircle size={16} /> Nueva sesión</button>
          <button className="exp-ghost" disabled={results.length === 0} onClick={() => downloadCSV(results)}><Download size={16} /> Exportar CSV</button>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="muted">Aún no hay participantes. Inicia una sesión para registrar el primero.</p>
      ) : (
        <>
          <div className="exp-summary">
            <div className="exp-sum"><small>Participantes</small><b>{agg.n}</b></div>
            <div className="exp-sum"><small>Finalización genérica</small><b>{agg.genericFinalization}%</b></div>
            <div className="exp-sum"><small>Finalización personalizada</small><b>{agg.personalizedFinalization}%</b></div>
            <div className={`exp-sum big ${agg.zone}`}><small>Δ finalización</small><b>{agg.finalizationDelta >= 0 ? '+' : ''}{agg.finalizationDelta} pp</b></div>
          </div>
          <div className="exp-summary secondary">
            <div className="exp-sum"><small>Precisión gen. → pers.</small><b>{agg.genericPrecision}% → {agg.personalizedPrecision}%</b></div>
            <div className="exp-sum"><small>Quiso seguir gen. → pers.</small><b>{agg.genericContinue}% → {agg.personalizedContinue}%</b></div>
            <div className="exp-sum"><small>Distracciones (prom.)</small><b>{agg.genericDistraction} → {agg.personalizedDistraction}</b></div>
            <div className="exp-sum"><small>Reconoce su tema</small><b>{agg.recognitionRate === null ? '—' : `${agg.recognitionRate}%`}</b></div>
          </div>

          <div className={`exp-verdict ${agg.zone}`}>
            <strong>{zoneIcon} {zone.title}</strong>
            <span>Decisión acordada de antemano: {zone.decision}</span>
          </div>

          <div className="exp-criteria">
            <span className={agg.checks.finalization ? 'ok' : 'no'}>Finalización +15 pp: {agg.finalizationDelta} pp</span>
            <span className={agg.checks.precision ? 'ok' : 'no'}>Precisión no baja más de 5 pp: {agg.precisionDelta} pp</span>
            <span className={agg.checks.distraction ? 'ok' : 'no'}>Distracciones no suben: {agg.genericDistraction} → {agg.personalizedDistraction}</span>
            <span className={agg.checks.abandon ? 'ok' : 'no'}>Abandonos no suben: {agg.genericAbandon}% → {agg.personalizedAbandon}%</span>
            <span className={agg.checks.recognition ? 'ok' : 'no'}>Reconocen su tema (≥{EXPERIMENT_CONFIG.minRecognitionRate}%): {agg.recognitionRate === null ? 'sin datos' : `${agg.recognitionRate}%`}</span>
          </div>

          {Object.entries(byGrade).sort().map(([gradeKey, rows]) => {
            const gAgg = aggregate(rows);
            return (
              <div key={gradeKey} className="exp-grade-block">
                <h3>{gradeKey}.° grado · {rows.length} participante(s) · Δ {gAgg.finalizationDelta >= 0 ? '+' : ''}{gAgg.finalizationDelta} pp</h3>
                <div className="exp-table-wrap">
                  <table className="exp-table">
                    <thead><tr><th>Código</th><th>Tema</th><th>Final. gen.</th><th>Final. pers.</th><th>Δ pp</th><th>Prec. gen.</th><th>Prec. pers.</th><th>Distr. g/p</th><th>Reconoce</th></tr></thead>
                    <tbody>
                      {rows.map((r) => {
                        const d = Math.round((finalizationRate(r.personalized) - finalizationRate(r.generic)) * 10) / 10;
                        return (
                          <tr key={r.id}>
                            <td>{r.code}</td>
                            <td>{EXPERIMENT_THEMES[r.themeId].icon}</td>
                            <td>{finalizationRate(r.generic)}%</td>
                            <td>{finalizationRate(r.personalized)}%</td>
                            <td className={d >= 15 ? 'pos' : d < 5 ? 'neg' : ''}>{d >= 0 ? '+' : ''}{d}</td>
                            <td>{precisionRate(r.generic)}%</td>
                            <td>{precisionRate(r.personalized)}%</td>
                            <td>{r.generic.distractionEvents}/{r.personalized.distractionEvents}</td>
                            <td>{r.personalized.recognizedTheme === null ? '—' : r.personalized.recognizedTheme ? 'Sí' : 'No'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          <p className="exp-caveat">Muestra exploratoria (12–18 parejas): los resultados orientan la siguiente decisión, no prueban por sí solos la eficacia educativa.</p>
        </>
      )}

      <details className="exp-defs">
        <summary><Info size={15} /> Definiciones operacionales y zonas de decisión</summary>
        <dl>
          {OPERATIONAL_DEFINITIONS.map((item) => (
            <div key={item.term}><dt>{item.term}</dt><dd>{item.definition}</dd></div>
          ))}
        </dl>
        <ul className="exp-zone-list">
          <li><strong>✅ +15 pp o más</strong> sin bajar precisión más de 5 pp ni subir distracciones/abandonos: {ZONE_DECISIONS.exitoso.decision}</li>
          <li><strong>🟡 Entre 5 y menos de 15 pp</strong> sin efectos negativos: {ZONE_DECISIONS.ambiguo.decision}</li>
          <li><strong>🔴 Menos de 5 pp, o cualquier efecto negativo</strong> (precisión, distracciones, abandonos o menos del {EXPERIMENT_CONFIG.minRecognitionRate}% reconoce su tema): {ZONE_DECISIONS.rechazar.decision}</li>
        </ul>
      </details>

      <div className="exp-actions">
        <button className="exp-ghost" onClick={onBack}><ChevronLeft size={16} /> Volver</button>
        {results.length > 0 && (
          <button className="exp-ghost danger" onClick={() => { if (window.confirm('¿Borrar todos los resultados del experimento?')) onClear(); }}>
            <Trash2 size={16} /> Borrar datos
          </button>
        )}
      </div>
    </section>
  );
}
