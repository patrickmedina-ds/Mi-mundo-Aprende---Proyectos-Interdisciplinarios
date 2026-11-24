import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowRight, BarChart3, BookOpen, Check, ChevronLeft, CircleHelp, Clock3,
  Flame, Gift, Gem, LockKeyhole, LogOut, Menu, Play, Plus, Rocket, Settings2,
  ShieldCheck, Sparkles, Star, Target, Trophy, UserRound, X, Zap, RotateCcw, FlaskConical
} from 'lucide-react';
import './styles.css';
import { calculateAdaptiveProgress } from './services/adaptiveEngine';
import { trackEvent } from './services/analyticsService';
import LayeredAvatar from './components/avatar/LayeredAvatar';
import MiniShopDrawer from './components/shop/MiniShopDrawer';
import { SHOP_ITEMS } from './data/shopItems';
import ComboMeter from './components/practice/ComboMeter';
import HintModal from './components/practice/HintModal';
import QuestionCard from './components/practice/QuestionCard';
import LevelUpModal from './components/practice/LevelUpModal';
import CelebrationOverlay from './components/practice/CelebrationOverlay';
import ConsentModal from './components/consent/ConsentModal';
import { createConsent, readConsent, saveConsent } from './services/consentService';
import ParentReportDashboard from './components/parent/ParentReportDashboard';
import FakeSubscriptionModal from './components/parent/FakeSubscriptionModal';
import CourseMap from './components/courses/CourseMap';
import CourseDetail from './components/courses/CourseDetail';
import Lesson from './components/courses/Lesson';
import ExperimentMode from './components/experiment/ExperimentMode';
import PersonalizationStudio from './components/customize/PersonalizationStudio';
import { CURRICULUM, ACTIVE_COURSES, getMissionQuestions } from './data/curriculum';
import { UNIVERSES } from './data/universes';
import {
  displayWorldName, emblemById, paletteVars, petById, resolvePersonalization, worldBackgroundStyle,
} from './data/personalization';

import type { ChildProfile, ConsentRecord, Course, Question, ShopItem, Topic, Universe } from './types/domain';

// Los universos temáticos viven en src/data/universes.ts.
const universes: Record<string, Universe> = UNIVERSES;

const shopItems = SHOP_ITEMS;
const PROFILE_DATA_VERSION = 2;

// El contenido vive ahora en src/data/curriculum.ts (cursos → temas → preguntas).
// La "misión rápida" del inicio usa todas las preguntas activas, mezcladas.
const quickMissionQuestions: Question[] = getMissionQuestions();

function shuffleQuestions(items: Question[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

const initialProfiles: ChildProfile[] = [
  { id: 'leo', name: 'Leo', grade: '4.° grado', avatar: '👦🏻', universe: 'ki', color: '#f05b45', pin: '1234', sessions: 0, minutes: 0, answered: 0, strengths: [], needs: [], streak: 0, level: 1, ab_group: 'A', coins: 0, current_streak: 0, max_streak: 0, inventory: [], equipped_items: { aura: null, hair: 'default', outfit: 'default', accessory: null, pet: null }, personalization: { worldName: 'Dojo de Leo', palette: 'atardecer', background: 'estrellas', pet: 'dragon', emblem: 'rayo', interests: ['anime', 'futbol'] } },
  { id: 'mateo', name: 'Mateo', grade: '4.° grado', avatar: '🧒🏻', universe: 'football', color: '#159c76', pin: '2468', sessions: 2, minutes: 17, answered: 18, strengths: ['Multiplicación'], needs: ['División'], streak: 1, level: 1, ab_group: 'B', coins: 0, current_streak: 0, max_streak: 1, inventory: [], equipped_items: { aura: null, hair: 'default', outfit: 'default', accessory: null, pet: null } },
  { id: 'ashley', name: 'Ashley', grade: '4.° grado', avatar: '🧑🏻‍🎤', universe: 'nocherosa', color: '#ff4fa3', pin: '1357', sessions: 0, minutes: 0, answered: 0, strengths: [], needs: [], streak: 0, level: 1, ab_group: 'A', coins: 0, current_streak: 0, max_streak: 0, inventory: [], equipped_items: { aura: null, hair: 'default', outfit: 'default', accessory: null, pet: null }, personalization: { worldName: 'El mundo de Ashley', palette: 'rosanegro', background: 'escenario', pet: 'conejo', emblem: 'lazo', interests: ['idols', 'musica'] } }
];

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

function readProfiles() {
  if (localStorage.getItem('mundo-profile-version') !== String(PROFILE_DATA_VERSION)) {
    localStorage.setItem('mundo-profile-version', String(PROFILE_DATA_VERSION));
    localStorage.setItem('mundo-profiles', JSON.stringify(initialProfiles));
    return initialProfiles;
  }
  const storedProfiles = readStorage('mundo-profiles', initialProfiles);
  const merged = storedProfiles.map((profile, index) => index === 0
    // No se fuerza el avatar: lo que el niño elige en "Mi guarida" debe persistir.
    ? { ...initialProfiles[0], ...profile, id: 'leo', name: 'Leo' }
    : profile);
  // Los perfiles de demostración nuevos (p. ej. Ashley) se agregan sin borrar el progreso guardado.
  const existing = new Set(merged.map((profile) => profile.id));
  return [...merged, ...initialProfiles.filter((profile) => !existing.has(profile.id))];
}

function App() {
  const [profiles, setProfiles] = useState(readProfiles);
  const [consent, setConsent] = useState<ConsentRecord | null>(readConsent);
  const [consentModal, setConsentModal] = useState<{ after: (() => void) | null } | null>(null);
  const [activeProfile, setActiveProfile] = useState(() => {
    const profId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('profile') : null;
    const found = readProfiles().find(p => p.id === profId);
    return found || readProfiles()[0];
  });
  const [screen, setScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('screen');
      if (q && readConsent()) return q;
    }
    return 'welcome';
  });
  const [parentMode, setParentMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [practicePool, setPracticePool] = useState<Question[] | null>(null);
  const [practiceOrigin, setPracticeOrigin] = useState<'home' | 'course'>('home');
  const [practiceTitle, setPracticeTitle] = useState<string>('');

  useEffect(() => localStorage.setItem('mundo-profiles', JSON.stringify(profiles)), [profiles]);
  useEffect(() => saveConsent(consent), [consent]);

  const universe = activeProfile ? universes[activeProfile.universe] : universes.space;
  const selectProfile = (profile) => {
    const inventory = (profile.inventory || []).filter(code => shopItems.some(item => item.code === code));
    const equipped = { ...initialProfiles[0].equipped_items, ...(profile.equipped_items || {}) };
    Object.keys(equipped).forEach(category => {
      if (equipped[category] !== 'default' && !inventory.includes(equipped[category])) equipped[category] = category === 'hair' || category === 'outfit' ? 'default' : null;
    });
    const normalized = { ...initialProfiles[0], ...profile, equipped_items: equipped, inventory };
    setActiveProfile(normalized);
    trackEvent('SESSION_START', normalized, { ab_group: normalized.ab_group });
    setParentMode(false);
    setScreen('home');
  };
  const updateProfile = (updates) => {
    setProfiles(current => current.map(profile => profile.id === activeProfile.id ? { ...profile, ...updates } : profile));
    setActiveProfile(current => ({ ...current, ...updates }));
  };
  const updateProfileById = (profileId: string, updates: Partial<ChildProfile>) => {
    setProfiles(current => current.map(profile => profile.id === profileId ? { ...profile, ...updates } : profile));
    setActiveProfile(current => current?.id === profileId ? { ...current, ...updates } : current);
  };
  const purchaseItemForProfile = (profile: ChildProfile, item: ShopItem) => {
    updateProfileById(profile.id, {
      coins: profile.coins - item.price,
      inventory: [...(profile.inventory || []), item.code],
      equipped_items: { ...profile.equipped_items, [item.category]: item.code },
    });
    trackEvent('ITEM_PURCHASED', profile, { item_code: item.code, price: item.price });
  };
  const equipItemForProfile = (profile: ChildProfile, item: ShopItem) => {
    updateProfileById(profile.id, {
      equipped_items: { ...profile.equipped_items, [item.category]: item.code },
    });
    trackEvent('ITEM_EQUIPPED', profile, { item_code: item.code, category: item.category });
  };
  const startQuickPractice = () => {
    // Sesión corta: una muestra aleatoria de las preguntas activas mezcladas.
    setPracticePool(shuffleQuestions(quickMissionQuestions).slice(0, 10));
    setPracticeOrigin('home');
    setPracticeTitle('Misión de hoy');
    setScreen('practice');
  };
  const openCourse = (course: Course) => {
    setSelectedCourse(course);
    setScreen('course');
    trackEvent('COURSE_OPENED', activeProfile, { course_id: course.id });
  };
  const startTopicPractice = (topic: Topic) => {
    setPracticePool(topic.questions);
    setPracticeOrigin('course');
    setPracticeTitle(topic.name);
    setScreen('practice');
    trackEvent('TOPIC_STARTED', activeProfile, { topic_id: topic.id, skill: topic.skill });
  };
  const openTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    if (topic.theory) {
      setScreen('lesson');
      trackEvent('TOPIC_OPENED', activeProfile, { topic_id: topic.id, skill: topic.skill });
    } else {
      startTopicPractice(topic);
    }
  };
  const leavePractice = () => setScreen(practiceOrigin === 'course' ? 'course' : 'home');
  const resetDemo = () => {
    const confirmed = window.confirm('¿Reiniciar la demo y borrar el progreso local de prueba?');
    if (!confirmed) return;
    localStorage.setItem('mundo-profiles', JSON.stringify(initialProfiles));
    localStorage.setItem('mundo-profile-version', String(PROFILE_DATA_VERSION));
    localStorage.removeItem('mundo-consent');
    localStorage.removeItem('mundo-events');
    setProfiles([...initialProfiles]);
    setConsent(null);
    setActiveProfile(null);
    setParentMode(false);
    setShowMenu(false);
    setScreen('welcome');
  };

  // Ningún perfil se abre ni se crea sin el consentimiento de un adulto.
  const requireConsent = (after: () => void) => (consent ? after() : setConsentModal({ after }));
  const acceptConsent = () => {
    const after = consentModal?.after;
    setConsent(createConsent());
    setConsentModal(null);
    after?.();
  };
  const revokeConsent = () => {
    localStorage.setItem('mundo-profiles', JSON.stringify(initialProfiles));
    localStorage.removeItem('mundo-events');
    setProfiles([...initialProfiles]);
    setConsent(null);
    setActiveProfile(null);
    setParentMode(false);
    setScreen('profiles');
  };

  if (screen === 'welcome') return <Welcome onStart={() => setScreen('profiles')} />;
  if (screen === 'profiles') return <><ProfilePicker profiles={profiles} consent={consent} onConsent={() => setConsentModal({ after: null })} onSelect={(profile) => requireConsent(() => selectProfile(profile))} onAdd={() => requireConsent(() => setScreen('new-profile'))} onParent={() => { setParentMode(true); setScreen('parent'); }} onExperiment={() => setScreen('experiment')} />{consentModal && <ConsentModal onAccept={acceptConsent} onCancel={() => setConsentModal(null)} />}</>;
  if (screen === 'new-profile') return <NewProfile onBack={() => setScreen('profiles')} onCreate={(profile) => { setProfiles([...profiles, profile]); setScreen('profiles'); }} />;
  if (screen === 'parent') return <ParentReportDashboard profiles={profiles} universes={universes} consent={consent} onRevoke={revokeConsent} onBack={() => setScreen('profiles')} onSubscription={() => setScreen('subscription')} />;
  if (screen === 'subscription') return <FakeSubscriptionModal onBack={() => setScreen('parent')} />;
  if (screen === 'experiment') return <ExperimentMode onExit={() => setScreen('profiles')} />;

  // Grupo A: la interfaz completa adopta la paleta que eligió el niño.
  const personalized = activeProfile.ab_group === 'A';
  const worldPz = resolvePersonalization(activeProfile, universe);
  const shellStyle = (personalized
    ? paletteVars(worldPz.palette)
    : { '--accent': universe.accent, '--accent-soft': universe.accentSoft }) as CSSProperties;

  return (
    <div className={`app-shell ${personalized ? 'personalized' : ''}`} style={shellStyle}>
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('home')} aria-label="Ir al inicio"><span className="brand-mark">✦</span><span>Mi Mundo <strong>Aprende</strong></span></button>
        <div className="topbar-actions">
          {activeProfile.ab_group === 'A' && <div className="streak"><Flame size={17} fill="currentColor" /> {activeProfile.streak} días</div>}
          <button className="profile-chip" onClick={() => setScreen('profiles')}><span>{activeProfile.avatar}</span>{activeProfile.name}<ChevronLeft size={16} className="rotate-270" /></button>
          <button className="icon-btn menu-trigger" onClick={() => setShowMenu(!showMenu)} aria-label="Abrir menú"><Menu size={21} /></button>
        </div>
        {showMenu && <div className="menu-popover"><button onClick={() => { setParentMode(true); setScreen('parent'); setShowMenu(false); }}><BarChart3 size={16} /> Reporte para mi familia</button><button onClick={() => { setScreen('experiment'); setShowMenu(false); }}><FlaskConical size={16} /> Modo experimento (Criterio B)</button><button onClick={() => { setScreen('profiles'); setShowMenu(false); }}><LogOut size={16} /> Cambiar de perfil</button><button className="reset-demo-btn" onClick={resetDemo}><RotateCcw size={16} /> Reiniciar demo</button></div>}
      </header>
      {screen === 'home' && <Home profile={activeProfile} universe={universe} onPractice={startQuickPractice} onCourses={() => setScreen('courses')} onOpenCourse={openCourse} onCustomize={() => setScreen('customize')} onReport={() => { setParentMode(true); setScreen('parent'); }} onPurchaseItem={purchaseItemForProfile} onEquipItem={equipItemForProfile} />}
      {screen === 'courses' && <CourseMap courses={CURRICULUM} onBack={() => setScreen('home')} onSelectCourse={openCourse} />}
      {screen === 'course' && selectedCourse && <CourseDetail course={selectedCourse} onBack={() => setScreen('courses')} onSelectTopic={openTopic} />}
      {screen === 'lesson' && selectedCourse && selectedTopic && <Lesson course={selectedCourse} topic={selectedTopic} onBack={() => setScreen('course')} onStart={() => startTopicPractice(selectedTopic)} />}
      {screen === 'customize' && <PersonalizationStudio profile={activeProfile} universes={universes} onBack={() => setScreen('home')} onSave={updateProfile} />}
      {screen === 'practice' && <Practice profile={activeProfile} universe={universe} questions={practicePool || quickMissionQuestions} title={practiceTitle} onBack={leavePractice} onUpdate={updateProfile} onDone={leavePractice} />}
    </div>
  );
}

function Welcome({ onStart }) {
  return <main className="welcome">
    <div className="welcome-orbit orbit-one" /><div className="welcome-orbit orbit-two" />
    <div className="welcome-copy"><div className="brand large"><span className="brand-mark">✦</span><span>Mi Mundo <strong>Aprende</strong></span></div><p className="welcome-kicker">Misiones cortas. Poderes enormes.</p><h1>Tu curiosidad<br /><em>sube de nivel.</em></h1><p className="welcome-text">Practica tus cursos de 3.° a 5.° grado, desbloquea recompensas y crea un universo que se parece a ti. Aprender también puede ser una aventura.</p><button className="primary-btn welcome-btn" onClick={onStart}>Entrar a mi mundo <ArrowRight size={18} /></button><div className="welcome-note"><ShieldCheck size={16} /> Un espacio seguro, sin publicidad</div></div>
    <div className="welcome-art"><div className="planet planet-large">⚡</div><div className="planet planet-small">✦</div><div className="astronaut">🦸🏽</div><div className="art-label"><Sparkles size={15} /> 3.° a 5.° grado</div></div>
  </main>;
}

function ProfilePicker({ profiles, consent, onConsent, onSelect, onAdd, onParent, onExperiment }) {
  return <main className="profile-page"><div className="profile-header"><div className="brand"><span className="brand-mark">✦</span><span>Mi Mundo <strong>Aprende</strong></span></div><span className="safe-label"><ShieldCheck size={15} /> Espacio seguro</span></div><section className="profile-content"><p className="eyebrow">¿Quién va a aprender hoy?</p><h1>Elige tu perfil</h1><p className="muted">Cada mundo guarda su propio avance.</p><div className="profile-grid">{profiles.map(profile => <button key={profile.id} className="profile-card" onClick={() => onSelect(profile)}><div className="avatar-ring" style={{ '--ring': profile.color } as CSSProperties}><span>{profile.avatar}</span></div><strong>{profile.name}</strong><span>{profile.grade}</span><div className="profile-progress"><span style={{ width: `${Math.min(profile.answered * 1.5, 100)}%`, background: profile.color }} /></div><small>{profile.answered} preguntas respondidas</small></button>)}<button className="profile-card add-card" onClick={onAdd}><span className="add-icon"><Plus /></span><strong>Agregar perfil</strong><span>Otro explorador</span></button></div><div className="profile-bottom"><div className="profile-bottom-left"><button className="text-btn" onClick={onParent}><BarChart3 size={17} /> Soy mamá, papá o tutor</button><button className="text-btn" onClick={onExperiment}><FlaskConical size={17} /> Modo experimento</button></div><div className="consent-line">{consent ? <><Check size={15} /> Consentimiento registrado</> : <><CircleHelp size={15} /> Un adulto debe dar su consentimiento antes de empezar</>} {!consent && <button className="link-btn" onClick={onConsent}>Dar consentimiento</button>}</div></div></section></main>;
}

function NewProfile({ onBack, onCreate }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧒🏽');
  const [universe, setUniverse] = useState('ki');
  const avatars = ['🧒🏽', '🧒🏻', '👧🏽', '👦🏾', '🦊', '🐼'];
  return <main className="onboarding"><button className="back-btn" onClick={onBack}><ChevronLeft size={18} /> Volver</button><div className="onboarding-inner"><p className="eyebrow">Nuevo explorador</p><h1>¿Cómo te llamamos?</h1><p className="muted">Puedes usar un apodo. Este es tu espacio.</p><label className="field-label">Nombre o apodo<input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Nico" /></label><p className="field-label">Elige tu avatar</p><div className="avatar-options">{avatars.map(item => <button className={avatar === item ? 'avatar-option selected' : 'avatar-option'} key={item} onClick={() => setAvatar(item)}>{item}</button>)}</div><p className="field-label">Tu primer universo</p><div className="universe-mini-grid">{Object.entries(universes).map(([key, item]) => <button key={key} className={universe === key ? 'universe-mini selected' : 'universe-mini'} onClick={() => setUniverse(key)}><span>{item.icon}</span>{item.name}</button>)}</div><button className="primary-btn full-btn" disabled={!name.trim()} onClick={() => onCreate({ id: name.toLowerCase().replace(/\s/g, '-'), name: name.trim(), grade: '4.° grado', avatar, universe, color: universes[universe].accent, pin: '1234', sessions: 0, minutes: 0, answered: 0, strengths: [], needs: [], streak: 0, level: 1, ab_group: 'B', coins: 0, current_streak: 0, max_streak: 0, inventory: [], equipped_items: { aura: null, hair: 'default', outfit: 'default', accessory: null, pet: null } })}>Crear mi perfil <ArrowRight size={18} /></button></div></main>;
}

function Home({ profile, universe, onPractice, onCourses, onOpenCourse, onCustomize, onReport, onPurchaseItem, onEquipItem }) {
  const [shopOpen, setShopOpen] = useState(false);
  const xp = (profile.answered * 12) % 100;
  const personalized = profile.ab_group === 'A';
  const pz = resolvePersonalization(profile, universe);
  const pet = petById(pz.pet);
  const emblem = emblemById(pz.emblem);
  return <main className="home-content"><section className="hero-panel" style={personalized ? worldBackgroundStyle(pz.palette, pz.background) : { background: 'linear-gradient(135deg, #475569, #64748b)' }}><div className="hero-stars">{personalized ? universe.stars : '•  •  •'}</div><div className="hero-text"><p className="hero-overline">{personalized ? `${emblem?.emoji || universe.icon} ${displayWorldName(pz, universe)}` : `Práctica · ${profile.grade}`}</p><h1>¡Hola, {profile.name}!</h1><p>{profile.ab_group === 'A' ? universe.tagline : 'Practica a tu ritmo y revisa tu avance.'}</p><button className="hero-btn" onClick={onPractice}><Play size={16} fill="currentColor" /> {profile.ab_group === 'A' ? 'Continuar misión' : 'Continuar práctica'}</button></div><div className="hero-character">{personalized ? <LayeredAvatar profile={profile} universe={universe} /> : '📚'}</div>{personalized && pet && <span className="hero-pet" title={pet.name} aria-label={`Tu compañero ${pet.name}`}>{pet.emoji}</span>}<div className="hero-orbit" /></section>{profile.ab_group === 'A' && <section className="power-bar"><div className="power-badge"><Gem size={18} fill="currentColor" /><span><small>Poder de aprendiz</small><strong>Nivel {profile.level}</strong></span></div><div className="xp-track"><div className="xp-label"><span>XP para el siguiente nivel</span><b>{xp}/100</b></div><div className="xp-line"><span style={{ width: `${xp}%` }} /></div></div><div className="reward-chip"><Gift size={18} /><span><b>3</b><small>premios</small></span></div></section>} {profile.ab_group === 'A' && <section className="child-shop-card"><div><span className="child-shop-icon">🛍️</span><div><p className="eyebrow">Colección de {profile.name}</p><h2>Tienda de poderes</h2><p>Usa tus monedas para comparar y equipar los 12 ítems.</p></div></div><strong>🪙 {profile.coins}</strong><button className="primary-btn" onClick={() => setShopOpen(true)}>Ver tienda</button></section>}<section className="courses-section"><div className="courses-head"><div><p className="eyebrow">Explora tu mundo</p><h2>Tus cursos</h2></div><button className="text-btn" onClick={onCourses}>Ver todos <ArrowRight size={14} /></button></div><div className="courses-strip">{ACTIVE_COURSES.slice(0, 4).map(course => <button key={course.id} className="course-chip" style={{ '--c': course.color } as CSSProperties} onClick={() => onOpenCourse(course)}><span className="course-chip-icon">{course.icon}</span><div><strong>{course.name}</strong><small>{course.topics.length} temas</small></div></button>)}</div></section><div className="home-grid"><section className="practice-card"><div className="section-heading"><div><p className="eyebrow">Misión de hoy</p><h2>{profile.ab_group === 'A' ? 'El entrenamiento de la torre' : 'Práctica de hoy'}</h2></div>{profile.ab_group === 'A' && <span className="level-pill"><Zap size={14} fill="currentColor" /> +60 XP</span>}</div><div className="mission-row"><div className="mission-icon"><Target /></div><div className="mission-copy"><strong>{profile.ab_group === 'A' ? 'Supera 5 desafíos' : 'Resuelve 5 preguntas'}</strong><span>{profile.ab_group === 'A' ? 'Gana una insignia al completar la misión' : 'Una mezcla de tus habilidades'}</span><div className="mission-progress"><span style={{ width: `${Math.min((profile.answered % 5) * 20, 80)}%` }} /></div></div><span className="mission-count">{profile.answered % 5}/5</span></div><button className="primary-btn" onClick={onPractice}>{profile.ab_group === 'A' ? 'Entrar a la torre' : 'Empezar práctica'} <ArrowRight size={17} /></button></section><section className="side-stack"><button className="customize-card" onClick={onCustomize}><div className="customize-icon"><Settings2 /></div><div><strong>{profile.ab_group === 'A' ? 'Mi guarida' : 'Personalizar'}</strong><span>{profile.ab_group === 'A' ? 'Colores, fondo, mascota y más' : 'Elige tu avatar'}</span></div><ArrowRight size={17} /></button><button className="report-card" onClick={onReport}><div className="report-top"><BarChart3 size={19} /><span>Para tu familia</span></div><strong>Tu avance está creciendo</strong><span>{Math.round(profile.minutes)} minutos de práctica</span></button></section></div>{profile.ab_group === 'A' && <section className="badges-card"><div className="badges-heading"><div><p className="eyebrow">Colección</p><h2>Insignias desbloqueadas</h2></div><button className="text-btn">Ver todas <ArrowRight size={14} /></button></div><div className="badge-list"><div className="badge-item earned"><span>🔥</span><strong>Racha de fuego</strong><small>3 días seguidos</small></div><div className="badge-item earned"><span>⚡</span><strong>Primer poder</strong><small>Completaste una misión</small></div><div className="badge-item locked"><span>🏆</span><strong>Gran campeón</strong><small>Resuelve 50 preguntas</small><LockKeyhole size={13} /></div><div className="badge-item locked"><span>🌟</span><strong>Mente brillante</strong><small>Sube al nivel 3</small><LockKeyhole size={13} /></div></div></section>}<div className="stats-strip"><div><Clock3 size={18} /><span><b>{Math.round(profile.minutes)}</b> min de práctica</span></div><div><BookOpen size={18} /><span><b>{profile.answered}</b> preguntas resueltas</span></div><div><Trophy size={18} /><span><b>{profile.strengths[0] || 'Tu próxima habilidad'}</b></span></div></div>{shopOpen && <MiniShopDrawer profile={profile} universe={universe} showAllItems onClose={() => setShopOpen(false)} onPurchase={(item) => onPurchaseItem(profile, item)} onEquip={(item) => onEquipItem(profile, item)} />}</main>;
}

function Practice({ profile, universe, questions: sessionPool, title, onBack, onUpdate, onDone }) {
  const [index, setIndex] = useState(0);
  const sessionQuestions = useMemo(() => shuffleQuestions(sessionPool), [sessionPool]);
  const count = sessionQuestions.length;
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [shopOpen, setShopOpen] = useState(false);
  const [shopClosedAt, setShopClosedAt] = useState(null);
  const [rewardMessage, setRewardMessage] = useState('');
  const [hintVisible, setHintVisible] = useState(false);
  const [levelUp, setLevelUp] = useState<{ level: number; finish: boolean } | null>(null);
  const [celebration, setCelebration] = useState<{ title: string; subtitle: string; finish: boolean } | null>(null);
  const lastAnswerAt = useRef(Date.now());
  const question = sessionQuestions[index % sessionQuestions.length];
  const progress = ((index) / count) * 100;
  const answer = (option) => {
    if (result === 'correct') return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setSelected(option);
    const isCorrect = option === question.answer;
    setResult(isCorrect ? 'correct' : 'wrong');
    setHintVisible(!isCorrect);
  };
  const next = () => {
    const correct = result === 'correct';
    const now = Date.now();
    // Tiempo desde la respuesta anterior; se limita a 3 min para no contar pausas largas.
    const elapsedMinutes = Math.min(now - lastAnswerAt.current, 180000) / 60000;
    lastAnswerAt.current = now;
    const skillStreaks = profile.skill_streaks || {};
    const progress = calculateAdaptiveProgress({
      abGroup: profile.ab_group,
      isCorrect: correct,
      attemptNumber: attempts,
      currentStreak: profile.current_streak || 0,
      maxStreak: profile.max_streak || 0,
      skillStreak: skillStreaks[question.skill] || 0,
      level: profile.level,
    });
    const nextProfile = { answered: profile.answered + 1, minutes: Number((profile.minutes + elapsedMinutes).toFixed(2)), strengths: correct && !profile.strengths.includes(question.skill) ? [...profile.strengths, question.skill] : profile.strengths, needs: !correct && !profile.needs.includes(question.skill) ? [...profile.needs, question.skill] : profile.needs, level: progress.level, current_streak: progress.currentStreak, max_streak: progress.maxStreak, coins: (profile.coins || 0) + progress.coinsEarned, skill_streaks: { ...skillStreaks, [question.skill]: progress.skillStreak } };
    onUpdate(nextProfile);
    trackEvent('ANSWER_SUBMITTED', profile, { question_id: question.id, is_correct: correct, attempt_number: attempts, coins_earned: progress.coinsEarned });
    if (shopClosedAt && Date.now() - shopClosedAt <= 60000) trackEvent('PRACTICE_RESUMED_FROM_SHOP', profile, { question_id: question.id });
    const isLastQuestion = index >= count - 1;
    const goNext = () => {
      if (isLastQuestion) onDone();
      else { setIndex(index + 1); setSelected(null); setResult(null); }
    };
    if (progress.comboMilestone) {
      setRewardMessage(`¡ATAQUE CRÍTICO! +${progress.coinsEarned} monedas y subiste de poder`);
      trackEvent('COMBO_3_REACHED', profile, { coins_earned: progress.coinsEarned });
      setCelebration({ title: '¡ATAQUE CRÍTICO!', subtitle: `+${progress.coinsEarned} monedas · Nivel ${progress.level}`, finish: isLastQuestion });
    } else if (progress.levelUp) {
      setLevelUp({ level: progress.level, finish: isLastQuestion });
    } else {
      goNext();
    }
    setAttempts(0);
  };
  const equipItem = item => {
    onUpdate({ equipped_items: { ...profile.equipped_items, [item.category]: item.code } });
    trackEvent('ITEM_EQUIPPED', profile, { item_code: item.code, category: item.category });
  };
  const purchaseItem = item => {
    onUpdate({
      coins: profile.coins - item.price,
      inventory: [...(profile.inventory || []), item.code],
      equipped_items: { ...profile.equipped_items, [item.category]: item.code },
    });
    trackEvent('ITEM_PURCHASED', profile, { item_code: item.code, price: item.price });
  };
  const continueAfterLevelUp = () => {
    const shouldFinish = levelUp?.finish;
    setLevelUp(null);
    if (shouldFinish) onDone();
    else {
      setIndex(index + 1);
      setSelected(null);
      setResult(null);
    }
  };
  const continueAfterCelebration = () => {
    const shouldFinish = celebration?.finish;
    setCelebration(null);
    if (shouldFinish) onDone();
    else {
      setIndex(index + 1);
      setSelected(null);
      setResult(null);
    }
  };
  return <main className="practice-page"><div className="practice-top"><button className="back-btn" onClick={onBack}><X size={18} /> Salir</button><div className="practice-progress"><span style={{ width: `${progress}%` }} /></div><span className="question-count">{index + 1} de {count}</span>{profile.ab_group === 'A' && <button className="coin-button" onClick={() => { setShopOpen(true); trackEvent('SHOP_OPENED', profile); }}>🪙 {profile.coins}</button>}</div><div className="question-wrap">{title && <p className="practice-title">{title}</p>}{profile.ab_group === 'A' && <ComboMeter streak={profile.current_streak || 0} lastReward={rewardMessage || '¡Transformación lista!'}/>}<div className="practice-avatar-row">{profile.ab_group === 'A' ? <LayeredAvatar profile={profile} universe={universe} compact /> : <span className="control-avatar">📚</span>}<span>{profile.ab_group === 'A' ? 'Tu guardián te acompaña' : 'Modo práctica'}</span></div><QuestionCard question={question} universeId={universe.id} abGroup={profile.ab_group} selected={selected} result={result} onAnswer={answer} onNext={next} isLast={index >= count - 1} />{result === 'wrong' && hintVisible && <HintModal hint={question.narrative_hints?.[universe.id] || question.hint} universeId={universe.id} onClose={() => setHintVisible(false)} />}</div>{shopOpen && profile.ab_group === 'A' && <MiniShopDrawer profile={profile} universe={universe} onClose={() => { setShopOpen(false); setShopClosedAt(Date.now()); }} onPurchase={purchaseItem} onEquip={equipItem} />}{levelUp && <LevelUpModal level={levelUp.level} onContinue={continueAfterLevelUp} />}{celebration && <CelebrationOverlay title={celebration.title} subtitle={celebration.subtitle} profile={profile} universe={universe} onDone={continueAfterCelebration} />}</main>;
}

export default App;
