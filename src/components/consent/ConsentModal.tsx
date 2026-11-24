import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface ConsentModalProps {
  onAccept: () => void;
  onCancel: () => void;
}

export default function ConsentModal({ onAccept, onCancel }: ConsentModalProps) {
  const [agreed, setAgreed] = useState(false);
  return (
    <div className="consent-backdrop" role="presentation">
      <section className="consent-card" role="dialog" aria-modal="true" aria-labelledby="consent-title">
        <div className="consent-icon"><ShieldCheck size={28} /></div>
        <p className="eyebrow">Para un adulto</p>
        <h2 id="consent-title">Antes de empezar</h2>
        <p>
          Mi Mundo Aprende guarda el nombre o apodo del niño, su avatar, sus respuestas y su tiempo de práctica
          para mostrarle su avance y armar el reporte para la familia.
        </p>
        <ul>
          <li>Los datos se guardan solo en este dispositivo: no se envían ni se comparten.</li>
          <li>No pedimos DNI, contacto ni ubicación, y no hay publicidad.</li>
          <li>Puedes retirar el consentimiento cuando quieras desde el Panel de familia; se borrarán los datos del niño.</li>
        </ul>
        <label className="consent-check">
          <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
          <span>Soy madre, padre o tutor legal del niño y autorizo el uso de sus datos como se describe.</span>
        </label>
        <div className="consent-actions">
          <button className="text-btn" onClick={onCancel}>Ahora no</button>
          <button className="primary-btn" disabled={!agreed} onClick={onAccept}>Acepto y continuar</button>
        </div>
      </section>
    </div>
  );
}
