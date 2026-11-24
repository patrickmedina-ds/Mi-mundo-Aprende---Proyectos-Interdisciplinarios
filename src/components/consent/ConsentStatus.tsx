import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import type { ConsentRecord } from '../../types/domain';

interface ConsentStatusProps {
  consent: ConsentRecord | null;
  onRevoke: () => void;
}

export default function ConsentStatus({ consent, onRevoke }: ConsentStatusProps) {
  const [confirming, setConfirming] = useState(false);
  if (!consent) {
    return <div className="consent-footer"><LockKeyhole size={15} /> Consentimiento de datos del menor: <strong className="pending">pendiente</strong></div>;
  }
  const date = new Date(consent.at).toLocaleDateString('es-PE');
  return (
    <div className="consent-footer">
      <LockKeyhole size={15} /> Consentimiento de datos del menor: <strong>registrado el {date}</strong>
      {!confirming && <button className="link-btn" onClick={() => setConfirming(true)}>Retirar consentimiento</button>}
      {confirming && (
        <span className="consent-confirm">
          Se borrarán los perfiles, el progreso y los eventos de este dispositivo.
          <button className="link-btn danger" onClick={onRevoke}>Sí, borrar y retirar</button>
          <button className="link-btn" onClick={() => setConfirming(false)}>Cancelar</button>
        </span>
      )}
    </div>
  );
}
