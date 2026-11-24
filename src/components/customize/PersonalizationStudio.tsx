import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowRight, Check, ChevronLeft, Globe, Heart, Image as ImageIcon, Palette as PaletteIcon,
  PawPrint, Play, Smile, Sparkles, Tag, WandSparkles,
} from 'lucide-react';
import type { ChildProfile, Personalization, Universe } from '../../types/domain';
import {
  AVATARS, BACKGROUNDS, EMBLEMS, INTERESTS, MAX_INTERESTS, PALETTES, PETS,
  backgroundById, displayWorldName, emblemById, paletteById, paletteVars, petById,
  recommendFromInterests, resolvePersonalization, worldBackgroundStyle, worldNameSuggestions,
} from '../../data/personalization';
import { trackEvent } from '../../services/analyticsService';

type TabId = 'gustos' | 'universo' | 'colores' | 'fondo' | 'avatar' | 'mascota' | 'nombre';

const TABS: { id: TabId; label: string; icon: typeof Heart }[] = [
  { id: 'gustos', label: 'Mis gustos', icon: Heart },
  { id: 'universo', label: 'Universo', icon: Globe },
  { id: 'colores', label: 'Colores', icon: PaletteIcon },
  { id: 'fondo', label: 'Fondo', icon: ImageIcon },
  { id: 'avatar', label: 'Avatar', icon: Smile },
  { id: 'mascota', label: 'Mascota', icon: PawPrint },
  { id: 'nombre', label: 'Nombre y emblema', icon: Tag },
];

const MAX_NAME = 26;

interface PersonalizationStudioProps {
  profile: ChildProfile;
  universes: Record<string, Universe>;
  onBack: () => void;
  onSave: (updates: Partial<ChildProfile>) => void;
}

function PickCheck() {
  return <span className="pick-check" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>;
}

export default function PersonalizationStudio({ profile, universes, onBack, onSave }: PersonalizationStudioProps) {
  // Grupo B (control del A/B del producto): interfaz estándar, solo avatar.
  const limited = profile.ab_group === 'B';
  const initialUniverse = profile.universe in universes ? profile.universe : 'space';

  const [tab, setTab] = useState<TabId>(limited ? 'avatar' : 'gustos');
  const [universeKey, setUniverseKey] = useState(initialUniverse);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [pz, setPz] = useState<Personalization>(() => resolvePersonalization(profile, universes[initialUniverse]));
  const [magicReason, setMagicReason] = useState<string | null>(null);
  const [magicUsed, setMagicUsed] = useState(false);

  const universe = universes[universeKey];
  const palette = paletteById(pz.palette) || PALETTES[0];
  const bg = backgroundById(pz.background) || BACKGROUNDS[0];
  const pet = petById(pz.pet) || PETS[0];
  const emblem = emblemById(pz.emblem) || EMBLEMS[0];
  const worldName = displayWorldName(pz, universe);
  const suggestions = useMemo(
    () => worldNameSuggestions(profile.name, universe, pz.interests),
    [profile.name, universe, pz.interests],
  );

  const tabs = limited ? TABS.filter((t) => t.id === 'avatar') : TABS;
  const tabIndex = tabs.findIndex((t) => t.id === tab);
  const nextTab = tabs[tabIndex + 1];

  const update = (patch: Partial<Personalization>) => setPz((current) => ({ ...current, ...patch }));

  const toggleInterest = (id: string) => {
    setMagicReason(null);
    setPz((current) => {
      const has = current.interests.includes(id);
      if (has) return { ...current, interests: current.interests.filter((x) => x !== id) };
      if (current.interests.length >= MAX_INTERESTS) return current;
      return { ...current, interests: [...current.interests, id] };
    });
  };

  const applyMagic = () => {
    const magic = recommendFromInterests(pz.interests, profile.name, pz, universes);
    if (!magic) return;
    setUniverseKey(magic.universeKey);
    setPz(magic.personalization);
    setMagicReason(magic.reason);
    setMagicUsed(true);
    trackEvent('MAGIC_WORLD_USED', profile, { interests: pz.interests.join('|'), universe: magic.universeKey });
  };

  const chooseUniverse = (key: string) => {
    const u = universes[key];
    setUniverseKey(key);
    // Al cambiar de universo sugerimos su estilo; el niño puede ajustarlo después.
    update({
      palette: u.defaultPalette || pz.palette,
      background: u.defaultBackground || pz.background,
      pet: u.defaultPet || pz.pet,
      emblem: u.defaultEmblem || pz.emblem,
    });
  };

  const save = () => {
    onSave({ universe: universeKey, avatar, color: palette.accent, personalization: pz });
    trackEvent('PERSONALIZATION_SAVED', profile, {
      universe: universeKey, palette: pz.palette, background: pz.background, pet: pz.pet,
      emblem: pz.emblem, interests: pz.interests.length, custom_name: Boolean(pz.worldName.trim()), magic_used: magicUsed,
    });
    onBack();
  };

  const pageStyle = limited ? undefined : paletteVars(pz.palette);
  const worldStyle: CSSProperties = limited
    ? { background: 'linear-gradient(135deg, #475569, #64748b)' }
    : worldBackgroundStyle(pz.palette, pz.background);

  return (
    <main className={`studio-page ${limited ? 'limited' : ''}`} style={pageStyle}>
      <div className="studio-top">
        <button className="back-btn" onClick={onBack}><ChevronLeft size={18} /> Volver a mi mundo</button>
      </div>

      <div className="studio-layout">
        <section className="studio-main">
          <p className="eyebrow">{limited ? 'Personalizar' : 'Mi guarida'}</p>
          <h1>{limited ? 'Elige tu avatar' : 'Diseña tu mundo'}</h1>
          <p className="muted">
            {limited
              ? 'Escoge cómo te ves en la plataforma.'
              : 'Aquí todo lo eliges tú: tu universo, tus colores, tu fondo, tu compañero y el nombre de tu mundo.'}
          </p>

          {!limited && tab !== 'gustos' && pz.interests.length === 0 && (
            <button className="studio-magic" onClick={() => setTab('gustos')}>
              <span className="studio-magic-icon">✨</span>
              <span className="studio-magic-copy">
                <strong>¿No sabes por dónde empezar?</strong>
                <span>Cuéntanos qué te gusta y armamos tu mundo en un toque.</span>
              </span>
              <ArrowRight size={18} />
            </button>
          )}

          {tabs.length > 1 && (
            <nav className="studio-tabs" role="tablist" aria-label="Secciones de personalización">
              {tabs.map((t, i) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    className={`studio-tab ${tab === t.id ? 'active' : ''}`}
                    onClick={() => setTab(t.id)}
                  >
                    <span className="studio-tab-step">{i + 1}</span>
                    <Icon size={16} /> {t.label}
                  </button>
                );
              })}
            </nav>
          )}

          <div className="studio-panel" role="tabpanel">
            {tab === 'gustos' && (
              <>
                <div className="studio-panel-head">
                  <h3>¿Qué te gusta?</h3>
                  <span className="studio-hint">Elige hasta {MAX_INTERESTS}. El primero manda 😉 · {pz.interests.length}/{MAX_INTERESTS}</span>
                </div>
                <div className="interest-grid">
                  {INTERESTS.map((interest) => {
                    const order = pz.interests.indexOf(interest.id);
                    const selected = order >= 0;
                    const full = !selected && pz.interests.length >= MAX_INTERESTS;
                    return (
                      <button
                        key={interest.id}
                        className={`interest-chip ${selected ? 'selected' : ''} ${full ? 'full' : ''}`}
                        onClick={() => toggleInterest(interest.id)}
                        aria-pressed={selected}
                      >
                        {selected && <span className="interest-order">{order + 1}</span>}
                        <span className="interest-emoji">{interest.emoji}</span>
                        <span>{interest.name}</span>
                      </button>
                    );
                  })}
                </div>
                <button className="studio-magic-btn" disabled={pz.interests.length === 0} onClick={applyMagic}>
                  <WandSparkles size={19} /> Armar mi mundo con mis gustos
                </button>
                {magicReason && (
                  <div className="studio-magic-result" role="status">
                    <Sparkles size={18} />
                    <div>
                      <p>{magicReason}</p>
                      <span>¡Mira la vista previa! Puedes cambiar lo que quieras en las otras secciones.</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {tab === 'universo' && (
              <>
                <div className="studio-panel-head">
                  <h3>Elige tu universo</h3>
                  <span className="studio-hint">Cada universo trae su estilo; luego lo ajustas a tu gusto.</span>
                </div>
                <div className="universe-pick-grid">
                  {Object.entries(universes).map(([key, u]) => (
                    <button key={key} className={`universe-pick ${universeKey === key ? 'selected' : ''}`} onClick={() => chooseUniverse(key)}>
                      <span className="universe-pick-visual" style={worldBackgroundStyle(u.defaultPalette || 'atardecer', u.defaultBackground || 'estrellas')}>
                        <span>{u.icon}</span>
                      </span>
                      <strong>{u.name}</strong>
                      <small>{u.tagline}</small>
                      {universeKey === key && <PickCheck />}
                    </button>
                  ))}
                </div>
              </>
            )}

            {tab === 'colores' && (
              <>
                <div className="studio-panel-head">
                  <h3>Tus colores</h3>
                  <span className="studio-hint">Cambian tu mundo, tus botones y tus barras de progreso.</span>
                </div>
                <div className="palette-grid">
                  {PALETTES.map((p) => (
                    <button key={p.id} className={`palette-swatch ${pz.palette === p.id ? 'selected' : ''}`} onClick={() => update({ palette: p.id })}>
                      <span className="palette-swatch-visual" style={{ background: `linear-gradient(135deg, ${p.hero[0]}, ${p.hero[1]} 55%, ${p.hero[2]})` }}>
                        <span className="palette-dots"><i style={{ background: p.light }} /><i style={{ background: p.accent }} /><i style={{ background: p.deep }} /></span>
                      </span>
                      <strong>{p.name}</strong>
                      {pz.palette === p.id && <PickCheck />}
                    </button>
                  ))}
                </div>
              </>
            )}

            {tab === 'fondo' && (
              <>
                <div className="studio-panel-head">
                  <h3>Fondo de tu mundo</h3>
                  <span className="studio-hint">Así se ven con tus colores {palette.name}.</span>
                </div>
                <div className="bg-grid">
                  {BACKGROUNDS.map((b) => (
                    <button key={b.id} className={`bg-tile ${pz.background === b.id ? 'selected' : ''}`} onClick={() => update({ background: b.id })}>
                      <span className="bg-tile-visual" style={worldBackgroundStyle(pz.palette, b.id)}><span>{b.icon}</span></span>
                      <strong>{b.name}</strong>
                      {pz.background === b.id && <PickCheck />}
                    </button>
                  ))}
                </div>
              </>
            )}

            {tab === 'avatar' && (
              <>
                <div className="studio-panel-head">
                  <h3>Tu avatar</h3>
                  <span className="studio-hint">Así te verán en tu perfil.</span>
                </div>
                <div className="avatar-pick-grid">
                  {AVATARS.map((a) => (
                    <button key={a} className={`avatar-pick ${avatar === a ? 'selected' : ''}`} onClick={() => setAvatar(a)} aria-pressed={avatar === a}>
                      {a}
                    </button>
                  ))}
                </div>
                {!limited && (
                  <p className="studio-note">🛍️ ¿Quieres cabello, aura o traje especial? Gánalos con tus monedas en la <strong>Tienda de poderes</strong>.</p>
                )}
              </>
            )}

            {tab === 'mascota' && (
              <>
                <div className="studio-panel-head">
                  <h3>Tu compañero</h3>
                  <span className="studio-hint">Te acompaña en tus misiones.</span>
                </div>
                <div className="pet-grid">
                  {PETS.map((p) => (
                    <button key={p.id} className={`pet-card ${pz.pet === p.id ? 'selected' : ''}`} onClick={() => update({ pet: p.id })}>
                      <span className="pet-emoji">{p.emoji}</span>
                      <strong>{p.name}</strong>
                      {pz.pet === p.id && <PickCheck />}
                    </button>
                  ))}
                </div>
              </>
            )}

            {tab === 'nombre' && (
              <>
                <div className="studio-panel-head">
                  <h3>Ponle nombre a tu mundo</h3>
                  <span className="studio-hint">Aparece en tu inicio.</span>
                </div>
                <label className="name-field">
                  <input
                    value={pz.worldName}
                    maxLength={MAX_NAME}
                    onChange={(e) => update({ worldName: e.target.value })}
                    placeholder={`Mundo ${universe.name}`}
                  />
                  <span className="name-counter">{pz.worldName.length}/{MAX_NAME}</span>
                </label>
                <div className="suggestion-chips">
                  {suggestions.map((s) => (
                    <button key={s} className={`suggestion-chip ${pz.worldName === s ? 'selected' : ''}`} onClick={() => update({ worldName: s })}>{s}</button>
                  ))}
                </div>
                <div className="studio-panel-head second">
                  <h3>Tu emblema</h3>
                  <span className="studio-hint">El ícono que representa tu mundo.</span>
                </div>
                <div className="emblem-grid">
                  {EMBLEMS.map((e) => (
                    <button key={e.id} className={`emblem-pick ${pz.emblem === e.id ? 'selected' : ''}`} onClick={() => update({ emblem: e.id })} title={e.name}>
                      {e.emoji}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="studio-panel-foot">
              {nextTab ? (
                <button className="studio-next" onClick={() => setTab(nextTab.id)}>Siguiente: {nextTab.label} <ArrowRight size={16} /></button>
              ) : (
                <button className="primary-btn" onClick={save}>{limited ? 'Guardar cambios' : 'Guardar mi mundo'} <Check size={17} /></button>
              )}
            </div>
          </div>
        </section>

        <aside className="studio-preview" aria-label="Vista previa de tu mundo">
          <p className="eyebrow">Vista previa en vivo</p>
          <div className="studio-world" style={worldStyle}>
            {!limited && <span className="studio-world-stars">{universe.stars}</span>}
            <div className="studio-world-copy">
              <span className="studio-world-overline">{limited ? 'Matemática · 4.° grado' : `${emblem.emoji} ${worldName}`}</span>
              <strong>¡Hola, {profile.name}!</strong>
              <span className="studio-world-cta"><Play size={12} fill="currentColor" /> Continuar misión</span>
            </div>
            <div className="studio-world-avatar">
              <span className="studio-avatar">{avatar}</span>
              {!limited && <span className="studio-pet" title={pet.name}>{pet.emoji}</span>}
            </div>
          </div>

          {!limited && (
            <>
              <div className="studio-sample" aria-hidden="true">
                <span className="studio-sample-btn">Entrar a la torre</span>
                <span className="studio-sample-bar"><i /></span>
              </div>
              <ul className="studio-summary">
                <li><span>Universo</span><b>{universe.icon} {universe.name}</b></li>
                <li><span>Colores</span><b><i className="summary-dot" style={{ background: palette.accent }} /> {palette.name}</b></li>
                <li><span>Fondo</span><b>{bg.icon} {bg.name}</b></li>
                <li><span>Compañero</span><b>{pet.emoji} {pet.name}</b></li>
                <li><span>Emblema</span><b>{emblem.emoji} {emblem.name}</b></li>
              </ul>
            </>
          )}
          <button className="primary-btn studio-save" onClick={save}>{limited ? 'Guardar cambios' : 'Guardar mi mundo'} <Check size={17} /></button>
        </aside>
      </div>
    </main>
  );
}
