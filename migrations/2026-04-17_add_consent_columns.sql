-- ============================================================
-- Electronic Picnic — Migrazione consensi GDPR
-- Data: 2026-04-17
-- Scopo: aggiunge colonne per tracciare prova di consenso
--        (art. 7.1 GDPR) sulla tabella prenotazioni.
--
-- Come applicarla:
--   1. Apri Supabase Dashboard > SQL Editor
--   2. Incolla il contenuto e premi "Run"
--   3. Verifica che le colonne siano presenti in Table Editor
-- ============================================================

-- Privacy (consenso obbligatorio al momento dell'invio form)
ALTER TABLE public.prenotazioni
  ADD COLUMN IF NOT EXISTS consent_privacy_at TIMESTAMPTZ;

ALTER TABLE public.prenotazioni
  ADD COLUMN IF NOT EXISTS consent_privacy_version TEXT;

-- Marketing (consenso facoltativo — checkbox separato nel form)
ALTER TABLE public.prenotazioni
  ADD COLUMN IF NOT EXISTS consent_marketing_at TIMESTAMPTZ;

ALTER TABLE public.prenotazioni
  ADD COLUMN IF NOT EXISTS consent_marketing_version TEXT;

-- Commenti sulle colonne (si vedono in Table Editor > Definition)
COMMENT ON COLUMN public.prenotazioni.consent_privacy_at IS
  'Timestamp ISO del consenso privacy raccolto via checkbox nel form. Obbligatorio per inviare la prenotazione.';
COMMENT ON COLUMN public.prenotazioni.consent_privacy_version IS
  'Versione dell''informativa privacy accettata (vedi CONSENT_VERSION in src/consent.js).';
COMMENT ON COLUMN public.prenotazioni.consent_marketing_at IS
  'Timestamp ISO del consenso marketing (opzionale). NULL se l''utente non ha accettato.';
COMMENT ON COLUMN public.prenotazioni.consent_marketing_version IS
  'Versione dell''informativa accettata per il trattamento marketing. NULL se non accettato.';

-- ============================================================
-- Nota: la colonna "allergie" non è più popolata dal form dal
-- 2026-04 (rimossa per evitare trattamenti ex art. 9 GDPR —
-- dati sulla salute). La colonna resta in tabella per non
-- distruggere dati storici, ma non riceverà più valori dai
-- nuovi invii.
-- ============================================================
