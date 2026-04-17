/*
 * Gestione del consenso cookie — Electronic Picnic
 *
 * - Cookie: ep_consent (durata 6 mesi)
 * - Integrazione con Google Consent Mode v2 (default denied in index.html)
 * - Caricamento dinamico GA4 e Meta Pixel solo dopo consenso esplicito
 *
 * Versione informativa: se aggiorni la privacy/cookie policy in modo
 * sostanziale, incrementa CONSENT_VERSION per richiedere di nuovo il
 * consenso agli utenti esistenti.
 */

export const CONSENT_VERSION = "1";
export const CONSENT_COOKIE_NAME = "ep_consent";
export const CONSENT_COOKIE_MAX_AGE_DAYS = 180; // 6 mesi

export const GA4_ID = "G-7LL13W3HVT";
export const META_PIXEL_ID = "1629600124851808";

/* ─── Cookie helpers ─────────────────────────────────────────────── */

function readCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

function writeCookie(name, value, maxAgeDays) {
  if (typeof document === "undefined") return;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${
    maxAgeDays * 24 * 60 * 60
  }; Path=/; SameSite=Lax${secure}`;
}

/* ─── Consent read/write ─────────────────────────────────────────── */

/**
 * Legge il consenso corrente. Ritorna null se l'utente non ha mai scelto.
 * Se la versione salvata è diversa da quella corrente, considera mancante
 * (serve nuova scelta).
 */
export function getConsent() {
  const raw = readCookie(CONSENT_COOKIE_NAME);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data.v !== CONSENT_VERSION) return null;
    return {
      version: data.v,
      timestamp: data.ts,
      statistics: !!data.statistics,
      marketing: !!data.marketing,
    };
  } catch {
    return null;
  }
}

/**
 * Salva il consenso, aggiorna Consent Mode, carica/disabilita i tracker.
 */
export function saveConsent({ statistics, marketing }) {
  const payload = {
    v: CONSENT_VERSION,
    ts: new Date().toISOString(),
    statistics: !!statistics,
    marketing: !!marketing,
  };
  writeCookie(
    CONSENT_COOKIE_NAME,
    JSON.stringify(payload),
    CONSENT_COOKIE_MAX_AGE_DAYS
  );
  applyConsent(payload);
  emit(payload);
  return payload;
}

export function hasConsent(category) {
  const c = getConsent();
  return !!(c && c[category]);
}

/* ─── Google Consent Mode v2 ─────────────────────────────────────── */

function updateGoogleConsentMode(consent) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.statistics ? "granted" : "denied",
  });
}

/* ─── Caricamento dinamico GA4 ───────────────────────────────────── */

let ga4Loaded = false;

function loadGA4() {
  if (ga4Loaded || typeof document === "undefined") return;
  ga4Loaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
  if (typeof window.gtag === "function") {
    window.gtag("config", GA4_ID, { anonymize_ip: true });
  }
}

/* ─── Caricamento dinamico Meta Pixel ────────────────────────────── */

let metaPixelLoaded = false;

function loadMetaPixel() {
  if (metaPixelLoaded || typeof window === "undefined") return;
  metaPixelLoaded = true;
  // Stub standard Meta Pixel (identico a quello ufficiale, ma iniettato solo ora)
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );
  /* eslint-enable */
  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
}

/* ─── Applica il consenso a tutto ────────────────────────────────── */

function applyConsent(consent) {
  updateGoogleConsentMode(consent);
  if (consent.statistics) loadGA4();
  if (consent.marketing) loadMetaPixel();
  // Se l'utente revoca dopo aver dato consenso, gli script già caricati
  // restano in memoria: Consent Mode v2 li neutralizza lato Google/Meta,
  // ma la rimozione totale richiede un reload del browser.
}

/**
 * Da chiamare all'avvio dell'app. Se esiste già un consenso salvato,
 * lo applica. Se no, non fa nulla (il banner verrà mostrato).
 */
export function initConsent() {
  const c = getConsent();
  if (c) applyConsent(c);
  return c;
}

/* ─── Pub/sub per la UI (footer link "Preferenze cookie") ────────── */

const listeners = new Set();

export function subscribeConsent(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function emit(consent) {
  listeners.forEach((cb) => {
    try {
      cb(consent);
    } catch (e) {
      console.error("consent listener error:", e);
    }
  });
}

/* ─── Evento globale per riaprire il banner ──────────────────────── */

/**
 * Richiede al banner di riaprirsi (chiamato dal link "Preferenze cookie"
 * nel footer). Il banner ascolta questo evento.
 */
export function openConsentPreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("ep:open-consent-preferences"));
}
