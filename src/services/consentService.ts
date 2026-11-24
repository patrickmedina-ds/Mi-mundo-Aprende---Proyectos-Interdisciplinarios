import type { ConsentRecord } from '../types/domain';

const STORAGE_KEY = 'mundo-consent';

// Súbela cuando cambie el texto del consentimiento: obliga a pedirlo de nuevo.
export const CONSENT_VERSION = 1;

/** Devuelve el consentimiento vigente o null. Un valor antiguo (sin texto ni fecha) no cuenta. */
export function readConsent(): ConsentRecord | null {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return stored && stored.accepted === true && stored.version === CONSENT_VERSION ? stored : null;
  } catch {
    return null;
  }
}

export function createConsent(): ConsentRecord {
  return { accepted: true, at: new Date().toISOString(), version: CONSENT_VERSION };
}

export function saveConsent(consent: ConsentRecord | null): void {
  try {
    if (consent) localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* sin almacenamiento: el consentimiento solo dura la sesión */ }
}
