import { createClient } from "@supabase/supabase-js";

/*
  ╔══════════════════════════════════════════════════╗
  ║  CONFIGURAZIONE SUPABASE                        ║
  ║                                                  ║
  ║  1. Vai su https://supabase.com e crea un        ║
  ║     progetto gratuito                            ║
  ║                                                  ║
  ║  2. Crea un file .env nella root del progetto:   ║
  ║     VITE_SUPABASE_URL=https://xxx.supabase.co    ║
  ║     VITE_SUPABASE_ANON_KEY=eyJ...                ║
  ║                                                  ║
  ║  3. Vai su SQL Editor in Supabase ed esegui      ║
  ║     lo schema qui sotto                          ║
  ╚══════════════════════════════════════════════════╝

  -- SCHEMA SQL da eseguire in Supabase SQL Editor:

  CREATE TABLE prenotazioni (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    pacchetto TEXT NOT NULL,        -- 'free', 'picnic', 'workshop', 'picnic_workshop'
    workshop_scelto TEXT,           -- 'ceramica', 'crochet', 'wine' (null se non applicabile)
    allergie TEXT,
    note TEXT,
    totale_stimato INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE partecipanti (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prenotazione_id UUID REFERENCES prenotazioni(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    pacchetto TEXT,                 -- può essere null se accompagnatore senza pacchetto
    workshop_scelto TEXT,
    allergie TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- Row Level Security (permetti insert da anon, select solo da auth)
  ALTER TABLE prenotazioni ENABLE ROW LEVEL SECURITY;
  ALTER TABLE partecipanti ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow anonymous inserts" ON prenotazioni
    FOR INSERT WITH CHECK (true);

  CREATE POLICY "Allow anonymous inserts" ON partecipanti
    FOR INSERT WITH CHECK (true);

  -- Per leggere i dati, usa la dashboard Supabase o un utente autenticato
*/

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Salva una prenotazione completa (referente + accompagnatori)
 */
export async function salvaPrenotazione({
  nome, email, telefono, pacchetto, workshop_scelto,
  allergie, note, totale_stimato, accompagnatori = [],
}) {
  if (!supabase) {
    console.warn("Supabase non configurato — prenotazione salvata solo localmente.");
    return { success: true, offline: true };
  }

  // 1. Inserisci la prenotazione principale
  const { data: pren, error: errPren } = await supabase
    .from("prenotazioni")
    .insert({
      nome, email, telefono, pacchetto, workshop_scelto,
      allergie: allergie || null,
      note: note || null,
      totale_stimato,
    })
    .select("id")
    .single();

  if (errPren) return { success: false, error: errPren };

  // 2. Inserisci gli accompagnatori
  if (accompagnatori.length > 0) {
    const rows = accompagnatori
      .filter(a => a.nome && a.nome.trim())
      .map(a => ({
        prenotazione_id: pren.id,
        nome: a.nome,
        pacchetto: a.pacchetto || null,
        workshop_scelto: a.workshop || null,
        allergie: a.allergie || null,
      }));

    if (rows.length > 0) {
      const { error: errAcc } = await supabase
        .from("partecipanti")
        .insert(rows);

      if (errAcc) return { success: false, error: errAcc };
    }
  }

  return { success: true, id: pren.id };
}
