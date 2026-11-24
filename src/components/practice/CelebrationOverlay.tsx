import { useEffect, useRef } from 'react';
import LayeredAvatar from '../avatar/LayeredAvatar';
import type { ChildProfile, Universe } from '../../types/domain';

interface CelebrationOverlayProps {
  title: string;
  subtitle?: string;
  profile: ChildProfile;
  universe: Universe;
  onDone: () => void;
  duration?: number;
}

const CONFETTI_COUNT = 30;
const CONFETTI_COLORS = ['#ffc94a', '#f05b45', '#6c63ff', '#4bc5dd', '#55b88b', '#f7a4ec'];

export default function CelebrationOverlay({
  title,
  subtitle,
  profile,
  universe,
  onDone,
  duration = 2500,
}: CelebrationOverlayProps) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const timer = setTimeout(() => doneRef.current(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      className="celebration-overlay"
      role="alert"
      aria-live="assertive"
      onClick={() => doneRef.current()}
    >
      <div className="confetti-rain" aria-hidden="true">
        {Array.from({ length: CONFETTI_COUNT }).map((_, index) => (
          <span
            key={index}
            className="confetti-piece"
            style={{
              left: `${(index / CONFETTI_COUNT) * 100}%`,
              background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
              animationDelay: `${(index % 8) * 0.11}s`,
              animationDuration: `${1.5 + (index % 5) * 0.28}s`,
            }}
          />
        ))}
      </div>
      <div className="celebration-inner">
        <LayeredAvatar profile={profile} universe={universe} transforming />
        <span className="celebration-burst">{universe.icon || '⚡'}</span>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
