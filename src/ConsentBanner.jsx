import { useEffect, useState } from "react";
import { getConsent, saveConsent } from "./consent.js";

/*
 * Banner consenso cookie — Electronic Picnic
 *
 * Mostrato al primo accesso (se manca il cookie ep_consent) o su evento
 * "ep:open-consent-preferences" (link "Preferenze cookie" nel footer).
 *
 * Conformità: Provvedimento Garante 10 giugno 2021 ("Linee guida cookie")
 *  - tre pulsanti con pari enfasi (Accetta / Rifiuta / Personalizza)
 *  - nessuna pre-spunta
 *  - link a privacy e cookie policy
 *  - "X" = equivalente a rifiuto (chiusura senza scelta attiva)
 */

const COLORS = {
  green: "#368a1b",
  greenDark: "#2a6e14",
  teal: "#2AABB3",
  dark: "#1a1a1a",
  gray: "#6b7280",
  grayLight: "#e5e7eb",
  bg: "#ffffff",
  overlay: "rgba(0,0,0,0.45)",
};

const TEXTS = {
  it: {
    title: "Consenso cookie",
    body:
      "Usiamo cookie tecnici (necessari) e, previo tuo consenso, cookie statistici e di marketing per analizzare l'uso del sito e misurare le conversioni. Puoi scegliere quali categorie accettare. Il rifiuto non pregiudica la navigazione.",
    links: { privacy: "Privacy Policy", cookie: "Cookie Policy" },
    btnAcceptAll: "Accetta tutti",
    btnRejectAll: "Rifiuta tutti",
    btnCustomize: "Personalizza",
    btnSave: "Salva preferenze",
    btnBack: "Indietro",
    close: "Chiudi (equivale a rifiutare)",
    cats: {
      necessary: {
        title: "Cookie tecnici",
        desc: "Necessari al funzionamento del sito (es. memorizzazione delle tue preferenze di consenso). Non richiedono consenso.",
        locked: "Sempre attivi",
      },
      statistics: {
        title: "Cookie statistici",
        desc: "Google Analytics 4 — misurano in forma aggregata l'uso del sito (pagine visitate, tempo di permanenza).",
      },
      marketing: {
        title: "Cookie di marketing",
        desc: "Meta Pixel — misurano le conversioni del form e permettono remarketing sulle piattaforme Meta (Facebook, Instagram).",
      },
    },
  },
};

function Toggle({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      aria-pressed={checked}
      aria-label={label}
      disabled={disabled}
      style={{
        position: "relative",
        width: 44,
        height: 24,
        borderRadius: 999,
        border: "none",
        background: disabled
          ? COLORS.grayLight
          : checked
          ? COLORS.green
          : "#cbd5e1",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "white",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("compact"); // 'compact' | 'customize'
  const [prefStats, setPrefStats] = useState(false);
  const [prefMarketing, setPrefMarketing] = useState(false);

  const t = TEXTS.it;

  // Mount: mostra se non c'è consenso salvato
  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setPrefStats(existing.statistics);
      setPrefMarketing(existing.marketing);
    }
    // Riapri su evento dal footer
    const reopen = () => {
      const cur = getConsent();
      if (cur) {
        setPrefStats(cur.statistics);
        setPrefMarketing(cur.marketing);
      }
      setMode("customize");
      setVisible(true);
    };
    window.addEventListener("ep:open-consent-preferences", reopen);
    return () =>
      window.removeEventListener("ep:open-consent-preferences", reopen);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent({ statistics: true, marketing: true });
    setVisible(false);
  };
  const rejectAll = () => {
    saveConsent({ statistics: false, marketing: false });
    setVisible(false);
  };
  const saveCustom = () => {
    saveConsent({ statistics: prefStats, marketing: prefMarketing });
    setVisible(false);
  };

  const baseBtn = {
    padding: "12px 20px",
    borderRadius: 10,
    fontFamily: "'Nunito', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    minWidth: 120,
    transition: "filter 0.15s, transform 0.1s",
  };
  const primaryBtn = {
    ...baseBtn,
    background: COLORS.green,
    color: "white",
  };
  const secondaryBtn = {
    ...baseBtn,
    background: "white",
    color: COLORS.dark,
    border: `2px solid ${COLORS.grayLight}`,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ep-consent-title"
      style={{
        position: "fixed",
        inset: 0,
        background: COLORS.overlay,
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: 16,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: COLORS.bg,
          borderRadius: 16,
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          padding: "24px 24px 20px",
          maxHeight: "85vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Close button (= rifiuto) */}
        <button
          type="button"
          aria-label={t.close}
          onClick={rejectAll}
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            color: COLORS.gray,
            fontSize: 22,
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <h2
          id="ep-consent-title"
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 22,
            color: COLORS.dark,
            margin: "0 0 10px",
          }}
        >
          {t.title}
        </h2>

        {mode === "compact" && (
          <>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: COLORS.dark,
                margin: "0 0 10px",
              }}
            >
              {t.body}
            </p>
            <p
              style={{
                fontSize: 13,
                color: COLORS.gray,
                margin: "0 0 20px",
              }}
            >
              <a
                href="/privacy.html"
                style={{ color: COLORS.teal, textDecoration: "underline" }}
              >
                {t.links.privacy}
              </a>
              {" · "}
              <a
                href="/cookie-policy.html"
                style={{ color: COLORS.teal, textDecoration: "underline" }}
              >
                {t.links.cookie}
              </a>
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setMode("customize")}
                style={secondaryBtn}
              >
                {t.btnCustomize}
              </button>
              <button type="button" onClick={rejectAll} style={secondaryBtn}>
                {t.btnRejectAll}
              </button>
              <button type="button" onClick={acceptAll} style={primaryBtn}>
                {t.btnAcceptAll}
              </button>
            </div>
          </>
        )}

        {mode === "customize" && (
          <>
            <p
              style={{
                fontSize: 13,
                color: COLORS.gray,
                margin: "0 0 16px",
              }}
            >
              {t.body}
            </p>

            {/* Necessari */}
            <div
              style={{
                border: `1px solid ${COLORS.grayLight}`,
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: COLORS.dark,
                    marginBottom: 4,
                  }}
                >
                  {t.cats.necessary.title}
                </div>
                <div style={{ fontSize: 12, color: COLORS.gray, lineHeight: 1.5 }}>
                  {t.cats.necessary.desc}
                </div>
              </div>
              <Toggle
                checked={true}
                onChange={() => {}}
                disabled
                label={t.cats.necessary.locked}
              />
            </div>

            {/* Statistiche */}
            <div
              style={{
                border: `1px solid ${COLORS.grayLight}`,
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: COLORS.dark,
                    marginBottom: 4,
                  }}
                >
                  {t.cats.statistics.title}
                </div>
                <div style={{ fontSize: 12, color: COLORS.gray, lineHeight: 1.5 }}>
                  {t.cats.statistics.desc}
                </div>
              </div>
              <Toggle
                checked={prefStats}
                onChange={setPrefStats}
                label={t.cats.statistics.title}
              />
            </div>

            {/* Marketing */}
            <div
              style={{
                border: `1px solid ${COLORS.grayLight}`,
                borderRadius: 12,
                padding: 14,
                marginBottom: 16,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: COLORS.dark,
                    marginBottom: 4,
                  }}
                >
                  {t.cats.marketing.title}
                </div>
                <div style={{ fontSize: 12, color: COLORS.gray, lineHeight: 1.5 }}>
                  {t.cats.marketing.desc}
                </div>
              </div>
              <Toggle
                checked={prefMarketing}
                onChange={setPrefMarketing}
                label={t.cats.marketing.title}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => setMode("compact")}
                style={secondaryBtn}
              >
                ← {t.btnBack}
              </button>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="button" onClick={rejectAll} style={secondaryBtn}>
                  {t.btnRejectAll}
                </button>
                <button type="button" onClick={saveCustom} style={primaryBtn}>
                  {t.btnSave}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
