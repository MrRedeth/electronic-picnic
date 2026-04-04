import { useState, useEffect, useRef, createContext, useContext } from "react";
import { MapPin, Clock, Music, Palette, Wine, ShoppingBag, Bus, Car, ChevronDown, Instagram, Mail, Phone, Users, Check, X, Globe } from "lucide-react";
import { salvaPrenotazione } from "./supabase.js";

/* ─── Language Context ─── */
const LangContext = createContext();
const useLang = () => useContext(LangContext);

const texts = {
  nav: {
    concetto: { it: "Il concetto", en: "The concept" },
    programma: { it: "Programma", en: "Schedule" },
    mercatini: { it: "Mercatini", en: "Markets" },
    workshop: { it: "Workshop", en: "Workshops" },
    come_arrivare: { it: "Come arrivare", en: "Getting there" },
    menu: { it: "Menù", en: "Menu" },
    musica: { it: "Musica", en: "Music" },
    prenota: { it: "Prenota", en: "Book now" },
  },
  hero: {
    title: { it: "Electronic Picnic", en: "Electronic Picnic" },
    subtitle: { it: "Dal picnic al dancefloor. Una giornata che evolve con te.", en: "From picnic to dancefloor. A day that evolves with you." },
    info: { it: "1 Maggio 2026 — Avalon Wellness Spa, Carso — Trieste", en: "May 1, 2026 — Avalon Wellness Spa, Karst — Trieste" },
    infoMobile: { it: "1 Maggio 2026 — Avalon Wellness Spa — Trieste", en: "May 1, 2026 — Avalon Wellness Spa — Trieste" },
    cta: { it: "Partecipa all'evento", en: "Join the event" },
  },
  concetto: {
    title: { it: "Un'esperienza che evolve", en: "An experience that evolves" },
    text: {
      it: "C'è un posto sul Carso triestino dove, ogni anno il Primo Maggio, il tempo rallenta.\nElectronic Pic Nic è un evento collettivo e itinerante nello spirito: un grande pic nic condiviso all'aperto, con musica elettronica live, workshop creativi, mercatini di artigianato selezionato e un'atmosfera che mescola natura, cultura e comunità.\n\nUn'esperienza ormai consolidata che ogni edizione porta con sé nuovi artisti, nuovi artigiani e nuove persone — ma sempre lo stesso filo: stare insieme, fuori, bene.\n\nOrganizzato da ON CIRCLE presso l'Avalon Wellness Spa immersa nel verde del Carso, Electronic Pic Nic è il festival di primavera che Trieste aspetta.",
      en: "There's a place on the Karst plateau near Trieste where, every year on May Day, time slows down.\nElectronic Pic Nic is a collective, free-spirited event: a big shared outdoor picnic with live electronic music, creative workshops, curated artisan markets, and an atmosphere that blends nature, culture, and community.\n\nA well-established experience that each edition brings new artists, new artisans, and new people — but always the same thread: being together, outdoors, feeling good.\n\nOrganized by ON CIRCLE at Avalon Wellness Spa, nestled in the green Karst hills, Electronic Pic Nic is the spring festival Trieste looks forward to."
    },
  },
  programma: {
    title: { it: "Programma della giornata", en: "Daily schedule" },
    items: [
      { time: "11:00", it: "Corsa con Cavana Run Club", en: "Run with Cavana Run Club" },
      { time: "12:00", it: "Apertura ufficiale + inizio musica", en: "Official opening + music starts" },
      { time: "11:00 – 13:30", it: "Area picnic riservata (prenotati)", en: "Reserved picnic area (booked)" },
      { time: "12:00 – 15:00", it: "Workshop (3 sessioni a rotazione)", en: "Workshops (3 rotating sessions)" },
      { time: "12:00 – 16:00", it: "Mercatini aperti (~30 espositori)", en: "Markets open (~30 vendors)" },
      { time: "12:00 → ∞", it: "DJ Set live continuo", en: "Continuous live DJ Set" },
    ],
  },
  mercatini: {
    title: { it: "Mercatini artigianali", en: "Artisan markets" },
    text: {
      it: "L'area mercatini è uno dei cuori pulsanti di Electronic Pic Nic. Ogni anno, circa 30 tra artigiani, artisti e brand selezionati portano il meglio della loro produzione in uno spazio curato, conviviale e completamente immerso nella natura.\n\nNon un semplice mercato — una piccola comunità creativa temporanea, dove ogni banchetto racconta una storia e ogni oggetto è fatto con intenzione.",
      en: "The market area is one of the beating hearts of Electronic Pic Nic. Every year, around 30 selected artisans, artists, and brands bring the best of their work to a curated, convivial space fully immersed in nature.\n\nNot just a market — a small temporary creative community, where every stall tells a story and every object is made with intention."
    },
    vendors: [
      { name: "Relisa", cat: { it: "Cartomante", en: "Cartomancer" }, desc: { it: "Lasciati guidare dalle carte. Relisa porta con sé l'arte della cartomanzia e una lettura del futuro capace di stupire.", en: "Let yourself be guided by the cards. Relisa brings the art of cartomancy and a reading of the future capable of amazing you." } },
      { name: "Chicca Mutti", cat: { it: "Borsette Crochet", en: "Crochet Bags" }, desc: { it: "Creazioni handmade all'uncinetto nate a Trieste, dove la semplicità diventa eleganza. Ogni borsa è un pezzo unico fatto con le mani, con cura e intenzione.", en: "Handmade crochet creations born in Trieste, where simplicity becomes elegance. Each bag is a unique piece made by hand, with care and intention." }, instagram: "https://www.instagram.com/chicca.mutti/" },
      { name: "Aperitas Art", cat: { it: "Artista", en: "Artist" }, desc: { it: "Opere d'arte originali con un'estetica contemporanea e personale. Un linguaggio visivo che racconta storie attraverso colori e forme.", en: "Original artworks with a contemporary and personal aesthetic. A visual language that tells stories through colors and shapes." }, instagram: "https://www.instagram.com/asperitas.art?igsh=MXMyaTg5M2xlZDg3ZQ==" },
      { name: "Little Battle", cat: { it: "Pittura su Ceramica", en: "Ceramic Painting" }, desc: { it: "Un laboratorio dove chiunque può dipingere su ceramica, esprimendo il proprio lato creativo in un ambiente accogliente e rilassante. Creato da te, per te.", en: "A workshop where anyone can paint on ceramics, expressing their creative side in a welcoming and relaxing environment. Made by you, for you." }, sito: "https://www.hotellots.space/2022/12/22/little-beetle/" },
      { name: "Bronzinska", cat: { it: "Upcycling", en: "Upcycling" }, desc: { it: "Vestiti e accessori che nascono da una seconda vita — moda consapevole e unica, perché ogni capo ha una storia da raccontare.", en: "Clothes and accessories born from a second life — conscious and unique fashion, because every garment has a story to tell." }, instagram: "https://www.instagram.com/bronzinska_handmade?igsh=MWZjZTUyNHpvbmIzcg==" },
      { name: "Enneart", cat: { it: "Disegni digitali su stoffe", en: "Digital prints on fabric" }, desc: { it: "Irene Antonini trasforma disegni digitali in accessori unici stampati su stoffe, dal suo laboratorio aperto nel cuore di Trieste.", en: "Irene Antonini transforms digital drawings into unique accessories printed on fabrics, from her studio in the heart of Trieste." }, instagram: "https://www.instagram.com/enne.art/" },
      { name: "Raffaella De Santis", cat: { it: "Bijoux", en: "Jewellery" }, desc: { it: "Gioielli artigianali pensati per chi ama portare con sé un pezzo d'arte — pezzi unici con carattere e cura nei dettagli.", en: "Handcrafted jewelry for those who love to carry a piece of art — unique pieces with character and attention to detail." } },
      { name: "Galleria Battisti 14", cat: { it: "Design d'interni", en: "Interior Design" }, desc: { it: "Nel cuore di Trieste, in un edificio storico dell'Ottocento, Galleria Battisti 14 porta il meglio del design italiano, affiancando marchi riconosciuti a livello internazionale.", en: "In the heart of Trieste, in a historic 19th-century building, Galleria Battisti 14 brings the best of Italian design alongside internationally recognized brands." }, sito: "https://friulishopping.it/attivita/galleria-battisti-14-design-interni-trieste/", instagram: "https://www.instagram.com/galleriabattisti14?igsh=azl0cnJhZ3Nqa3Q=" },
      { name: "Laura Theuretzbacher", cat: { it: "Prodotti veg", en: "Veg products" }, desc: { it: "Una selezione curata di prodotti vegetali e naturali, pensati per chi sceglie di vivere e mangiare in modo più consapevole.", en: "A curated selection of plant-based and natural products, designed for those who choose to live and eat more consciously." }, instagram: "https://www.instagram.com/vegan.wirtin.wien?igsh=Z2xvY3hoejJjZ3Vw" },
      { name: "Profumeria Essenze Trieste", cat: { it: "Profumeria", en: "Perfumery" }, desc: { it: "Una profumeria di nicchia nel cuore di Trieste, con una selezione di fragranze ricercate e di lusso per chi cerca qualcosa fuori dall'ordinario.", en: "A niche perfumery in the heart of Trieste, with a selection of refined and luxurious fragrances for those seeking something out of the ordinary." }, instagram: "https://www.instagram.com/profumeria_essenze_trieste?igsh=MWNpbjZ5OGprbmRydg==" },
      { name: "Alessia Canta Storie", cat: { it: "Wine Experience", en: "Wine Experience" }, desc: { it: "Alessia trasforma la degustazione del vino in un racconto: un'esperienza sensoriale e narrativa che ti porta a scoprire ogni calice come fosse una storia da ascoltare.", en: "Alessia transforms wine tasting into a story: a sensory and narrative experience that leads you to discover each glass as if it were a story to listen to." }, instagram: "https://www.instagram.com/michiamanocantastorie?igsh=MXdpMmdlc3RkZW1ibA==" },
      { name: "RoadRunners", cat: { it: "Esplorazioni organizzate", en: "Organised explorations" }, desc: { it: "Una community che trasforma ogni giornata in un'avventura: escursioni, attività outdoor e momenti di gruppo per scoprire il territorio, conoscere persone e creare connessioni reali.", en: "A community that turns every day into an adventure: hikes, outdoor activities and group moments to explore the area, meet people and build real connections." }, instagram: "https://www.instagram.com/roadrunners_esplorazioni" },
    ],
  },
  workshop: {
    title: { it: "Workshop creativi", en: "Creative workshops" },
    subtitle: { it: "3 sessioni a rotazione: 12–13 / 13–14 / 14–15 — 10€ a sessione", en: "3 rotating sessions: 12–13 / 13–14 / 14–15 — €10 per session" },
    cards: [
      {
        title: { it: "Ceramica libera", en: "Free ceramics" },
        by: "Little Battle",
        desc: { it: "Decorazione e personalizzazione di ceramiche. Esprimi la tua creatività plasmando e dipingendo pezzi unici.", en: "Ceramic decoration and customization. Express your creativity by shaping and painting unique pieces." },
        icon: "palette",
      },
      {
        title: { it: "Borsa Crochet", en: "Crochet bag" },
        by: "Chicca Mutti",
        desc: { it: "Creazione guidata di una borsa all'uncinetto. Un workshop hands-on per portarti a casa la tua creazione.", en: "Guided crochet bag creation. A hands-on workshop to take home your own creation." },
        icon: "shopping",
      },
      {
        title: { it: "Wine Experience", en: "Wine Experience" },
        by: { it: "Sommelier (TBD)", en: "Sommelier (TBD)" },
        desc: { it: "Degustazione guidata con lettura sensoriale del vino. Un viaggio tra i sapori del territorio.", en: "Guided tasting with sensory wine reading. A journey through local flavors." },
        icon: "wine",
      },
    ],
  },
  comeArrivare: {
    title: { it: "Come arrivare", en: "Getting there" },
    bus: {
      title: { it: "Bus navetta", en: "Shuttle bus" },
      info: {
        it: "Navetta diretta da Piazza Oberdan (Trieste) all'Avalon e ritorno.",
        en: "Direct shuttle from Piazza Oberdan (Trieste) to Avalon and back.",
      },
      toAvalon: {
        label: { it: "Oberdan → Avalon", en: "Oberdan → Avalon" },
        times: ["11:00", "11:45", "12:30", "13:15", "15:00", "16:00", "18:00", "19:30", "20:30"],
      },
      toOberdan: {
        label: { it: "Avalon → Oberdan", en: "Avalon → Oberdan" },
        times: ["14:30", "15:30", "18:30", "20:00", "21:00", "22:30", "23:00"],
      },
    },
    auto: {
      title: { it: "In auto", en: "By car" },
      address: "Borgo Grotta Gigante, 42/B — Trieste",
      parking: { it: "C'è un grande parcheggio adiacente all'Avalon", en: "There is a large parking lot adjacent to the Avalon." },
    },
  },
  menu: {
    title: { it: "Il Menù del Picnic", en: "The Picnic Menu" },
    subtitle: { it: "Un assaggio di quello che troverai nella tua picnic box", en: "A taste of what you'll find in your picnic box" },
    items: [
      { emoji: "🥩", name: { it: "Tartare di manzo", en: "Beef tartare" }, desc: { it: "Con giardiniera di verdure", en: "With pickled vegetables" } },
      { emoji: "🌾", name: { it: "Farro al pesto genovese", en: "Spelt with pesto" }, desc: { it: "Feta e pomodori semisecchi", en: "Feta and semi-dried tomatoes" } },
      { emoji: "🍖", name: { it: "Polpettine di manzo all'amatriciana", en: "Beef meatballs amatriciana" }, desc: { it: "", en: "" } },
      { emoji: "🥧", name: { it: "Crostatina alle mele", en: "Apple tartlet" }, desc: { it: "", en: "" } },
    ],
  },
  musica: {
    title: { it: "I DJ che ci accompagneranno durante la giornata.", en: "The DJs joining us throughout the day." },
    desc: {
      it: "La musica elettronica è l'anima di Electronic Pic Nic. Dal mezzogiorno fino a fine giornata, il suono accompagna ogni momento — dal primo boccone del picnic all'ultima visita ai mercatini. Un sound curato, coerente con l'atmosfera outdoor e con l'energia del Carso.",
      en: "Electronic music is the soul of Electronic Pic Nic. From noon until the end of the day, the sound accompanies every moment — from the first bite of the picnic to the last visit to the markets. A curated sound, in harmony with the outdoor atmosphere and the energy of the Karst."
    },
    comingSoon: { it: "Lineup completa in arrivo...", en: "Full lineup coming soon..." },
    specialGuest: { it: "Special Guest Internazionale", en: "International Special Guest" },
    specialGuestSub: { it: "", en: "" },
  },
  form: {
    title: { it: "Partecipa a Electronic Pic Nic", en: "Join Electronic Pic Nic" },
    subtitle: { it: "Scegli la tua esperienza e registrati in pochi passi.", en: "Choose your experience and sign up in a few steps." },
    step1Title: { it: "Cosa ti interessa?", en: "What are you interested in?" },
    packages: [
      { id: "picnic", name: { it: "Picnic", en: "Picnic" }, price: "25€", desc: { it: "Area riservata 11:00–13:30, picnic box incluso", en: "Reserved area 11:00–13:30, picnic box included" }, emoji: "🧺" },
      { id: "picnic_workshop", name: { it: "Picnic + Workshop", en: "Picnic + Workshop" }, price: "30€", desc: { it: "Formula combinata — il meglio della giornata", en: "Combined package — the best of the day" }, emoji: "✨" },
      { id: "workshop", name: { it: "Workshop", en: "Workshop" }, price: "10€", desc: { it: "Una sessione a scelta tra ceramica, crochet e wine", en: "One session: ceramics, crochet, or wine" }, emoji: "🎨" },
      { id: "free", name: { it: "Ingresso libero", en: "Free entry" }, price: { it: "Gratuito", en: "Free" }, desc: { it: "Dalle 13:30 — mercatini, musica e menu Avalon", en: "From 13:30 — markets, music, and Avalon menu" }, emoji: "🎶" },
    ],
    workshops: [
      { id: "ceramica", name: { it: "Ceramica libera", en: "Free ceramics" }, by: "Little Battle" },
      { id: "crochet", name: { it: "Borsa Crochet", en: "Crochet bag" }, by: "Chicca Mutti" },
      { id: "wine", name: { it: "Wine Experience", en: "Wine Experience" }, by: { it: "Sommelier", en: "Sommelier" } },
    ],
    step2Title: { it: "I tuoi dati", en: "Your details" },
    name: { it: "Nome e Cognome", en: "Full Name" },
    email: { it: "Email", en: "Email" },
    phone: { it: "Telefono", en: "Phone" },
    allergies: { it: "Allergie o intolleranze", en: "Allergies or intolerances" },
    allergiesPlaceholder: { it: "Es. glutine, lattosio... (opzionale)", en: "E.g. gluten, lactose... (optional)" },
    workshopLabel: { it: "Quale workshop?", en: "Which workshop?" },
    step3Title: { it: "Verrai con altre persone?", en: "Coming with others?" },
    companionsYes: { it: "Sì", en: "Yes" },
    companionsNo: { it: "No, solo io", en: "No, just me" },
    companionsCount: { it: "Quante persone ti accompagnano?", en: "How many people are joining you?" },
    companionName: { it: "Nome e cognome accompagnatore", en: "Companion full name" },
    companionPackage: { it: "Esperienza", en: "Experience" },
    step4Title: { it: "Riepilogo", en: "Summary" },
    notes: { it: "Note o richieste particolari", en: "Notes or special requests" },
    notesPlaceholder: { it: "Opzionale", en: "Optional" },
    total: { it: "Totale stimato", en: "Estimated total" },
    submit: { it: "Conferma prenotazione", en: "Confirm booking" },
    back: { it: "Indietro", en: "Back" },
    next: { it: "Avanti", en: "Next" },
    success: { it: "Prenotazione ricevuta!", en: "Booking received!" },
    successSub: { it: "Ti contatteremo per confermare e organizzare il pagamento.", en: "We'll contact you to confirm and arrange payment." },
    followUs: { it: "Seguici su Instagram", en: "Follow us on Instagram" },
    followUsSub: { it: "Per aggiornamenti in tempo reale sull'evento", en: "For real-time event updates" },
    errors: {
      name: { it: "Inserisci nome e cognome", en: "Please enter your full name" },
      email: { it: "Inserisci un'email valida", en: "Please enter a valid email" },
      phone: { it: "Inserisci un numero di telefono", en: "Please enter a phone number" },
      package: { it: "Seleziona un'esperienza", en: "Please select an experience" },
      workshop: { it: "Seleziona un workshop", en: "Please select a workshop" },
      companionName: { it: "Inserisci nome e cognome", en: "Please enter full name" },
    },
  },
  footer: {
    social: "@electronic_picnic",
    partners: { it: "Partner", en: "Partners" },
    partnerList: "ON CIRCLE Music, Avalon Wellness & Medical",
    contact: { it: "Contatti", en: "Contact" },
    contactSoon: { it: "In arrivo", en: "Coming soon" },
  },
};

/* ─── Fonts & Colors ─── */
const fontLink = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700&display=swap";

const COLORS = {
  cyan: "#87CEEB",
  green: "#368a1b",
  siteBg: "#FFFFFF",
  orange: "#F28C28",
  teal: "#2AABB3",
  nightBlue: "#2D2B6B",
  white: "#FFFFFF",
  textLight: "#333333",
  textDark: "#F0F0F0",
};

/* ─── Global Styles & Animations ─── */
const globalStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes floatSlow {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-6px) translateX(4px); }
  }
  @keyframes noteFloat {
    0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
    50% { transform: translateY(-15px) rotate(10deg); opacity: 1; }
    100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .float-anim { animation: float 4s ease-in-out infinite; }
  .float-slow { animation: floatSlow 6s ease-in-out infinite; }
  .note-float { animation: noteFloat 3s ease-in-out infinite; }
  .pulse-anim { animation: pulse 2s ease-in-out infinite; }
  .cta-btn {
    background: ${COLORS.orange};
    color: white;
    border: none;
    padding: 16px 36px;
    border-radius: 50px;
    font-family: 'Fredoka One', cursive;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(242, 140, 40, 0.4);
    text-decoration: none;
    display: inline-block;
    text-align: center;
  }
  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(242, 140, 40, 0.5);
    filter: brightness(1.08);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', sans-serif; color: ${COLORS.textLight}; overflow-x: hidden; background-color: ${COLORS.siteBg}; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #f1f1f1; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.teal}; border-radius: 4px; }
  .dj-carousel {
    display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
    gap: 16px; padding: 0 16px 16px;
    -webkit-overflow-scrolling: touch; scrollbar-width: none;
  }
  .dj-carousel::-webkit-scrollbar { display: none; }
  .dj-carousel > div { scroll-snap-align: start; flex-shrink: 0; }
  @media (max-width: 767px) {
    .desktop-only { display: none !important; }
  }
  @media (min-width: 768px) {
    .mobile-only { display: none !important; }
  }
`;

/* ─── Hook: IntersectionObserver ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Hook: isMobile ─── */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

/* ─── Language Toggle Button ─── */
function LangToggleBtn({ scrolled }) {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "it" ? "en" : "it")}
      style={{
        background: "rgba(42,171,179,0.12)",
        border: `2px solid ${COLORS.teal}`,
        borderRadius: 20, padding: "6px 14px",
        color: COLORS.teal,
        cursor: "pointer", fontFamily: "'Nunito', sans-serif",
        fontWeight: 700, fontSize: 14,
        display: "flex", alignItems: "center", gap: 6,
      }}
    >
      <Globe size={14} />
      {lang === "it" ? "EN" : "IT"}
    </button>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════ */
function Navbar() {
  const { lang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const t = texts.nav;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#concetto", label: t.concetto[lang] },
    { href: "#programma", label: t.programma[lang] },
    { href: "#mercatini", label: t.mercatini[lang] },
    { href: "#workshop", label: t.workshop[lang] },
    { href: "#menu", label: t.menu[lang] },
    { href: "#musica", label: t.musica[lang] },
  ];

  const linkColor = COLORS.textLight;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
      padding: "12px 24px",
      display: "flex", alignItems: "center", justifyContent: isMobile ? "flex-end" : "space-between",
      boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.1)" : "none",
    }}>
      <a href="#hero" style={{ textDecoration: "none", display: isMobile ? "none" : "flex", alignItems: "center" }}>
        <img src="assets/logo.svg" alt="Electronic Picnic" style={{ height: 44 }} />
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Desktop nav links */}
        <div className="desktop-only" style={{ display: "flex", gap: 18 }}>
          {links.map(l => (
            <a key={l.href} href={l.href} style={{ color: linkColor, textDecoration: "none", fontWeight: 600, fontSize: 14, transition: "color 0.3s" }}>
              {l.label}
            </a>
          ))}
        </div>
        <LangToggleBtn scrolled={scrolled} />
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   SECTION 1 — HERO
   ═══════════════════════════════════════════ */
function Hero() {
  const { lang } = useLang();
  const t = texts.hero;
  const isMobile = useIsMobile();

  /* Mobile: transparent-bg illustration positioned at bottom, text on green bg at top
     Desktop: full-cover illustration as before */
  const mobileStyle = {
    position: "relative", minHeight: "100vh",
    display: "flex", flexDirection: "column",
    justifyContent: "flex-start", alignItems: "center",
    paddingTop: "12vh",
    backgroundImage: "url('assets/mobile/hero.webp')",
    backgroundSize: "contain",
    backgroundPosition: "bottom center",
    backgroundRepeat: "no-repeat",
    backgroundColor: COLORS.siteBg,
  };

  const desktopStyle = {
    position: "relative", minHeight: "100vh",
    display: "flex", flexDirection: "column",
    justifyContent: "flex-start", alignItems: "center",
    paddingTop: "12vh",
    overflow: "hidden",
    margin: "0 24px",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  };

  if (!isMobile) {
    return (
      <section id="hero" style={desktopStyle}>
        <img src="assets/desktop/hero.webp" alt="" style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%", objectFit: "cover", zIndex: 0,
        }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 700 }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 72, color: COLORS.green, textShadow: "0 2px 12px rgba(255,255,255,0.6)", marginBottom: 16, lineHeight: 1.1 }}>
            {t.title[lang]}
          </h1>
          <p style={{ fontSize: 22, color: "white", textShadow: "0 2px 10px rgba(0,0,0,0.3)", marginBottom: 16, fontWeight: 600, lineHeight: 1.4 }}>
            {t.subtitle[lang]}
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(54,138,27,0.25)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(54,138,27,0.4)", borderRadius: 50,
            padding: "10px 22px", marginBottom: 32,
          }}>
            <span className="pulse-anim" style={{
              width: 10, height: 10, borderRadius: "50%", background: COLORS.green,
              boxShadow: `0 0 8px ${COLORS.green}`, display: "inline-block",
            }} />
            <span style={{ fontSize: 15, color: "white", fontWeight: 700, letterSpacing: 0.5 }}>
              {t.info[lang]}
            </span>
          </div>
          <a href="#form" className="cta-btn pulse-anim" style={{ fontSize: 20 }}>{t.cta[lang]}</a>
        </div>
        <div className="note-float" style={{ position: "absolute", zIndex: 1, top: "22%", left: "8%", fontSize: 28, color: "white", opacity: 0.5 }}>♪</div>
        <div className="note-float" style={{ position: "absolute", zIndex: 1, top: "16%", right: "10%", fontSize: 22, color: "white", opacity: 0.4, animationDelay: "1s" }}>♫</div>
        <div style={{ position: "absolute", bottom: 30, zIndex: 2 }}>
          <ChevronDown size={28} color="white" style={{ opacity: 0.7 }} className="float-anim" />
        </div>
      </section>
    );
  }

  /* Mobile version */
  return (
    <section id="hero" style={mobileStyle}>
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 700 }}>
        <h1 style={{ margin: "0 0 14px" }}>
          <img src="assets/logo.svg" alt="Electronic Picnic" style={{ height: 128, display: "block", margin: "0 auto" }} />
        </h1>
        <p style={{ fontSize: 17, color: COLORS.textLight, marginBottom: 14, fontWeight: 600, lineHeight: 1.4 }}>
          {t.subtitle[lang]}
        </p>
        <p style={{ fontSize: 14, color: COLORS.textLight, fontWeight: 600, marginBottom: 28, opacity: 0.8 }}>
          {t.infoMobile[lang]}
        </p>
        <a href="#form" className="cta-btn pulse-anim" style={{ fontSize: 16 }}>{t.cta[lang]}</a>
      </div>
      <div style={{ position: "absolute", bottom: 30, zIndex: 2 }}>
        <ChevronDown size={28} color={COLORS.teal} style={{ opacity: 0.7 }} className="float-anim" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 2 — IL CONCETTO
   ═══════════════════════════════════════════ */
function Concetto() {
  const { lang } = useLang();
  const t = texts.concetto;
  const [ref, inView] = useInView();

  return (
    <section id="concetto" ref={ref} style={{ background: COLORS.white, padding: "80px 24px", display: "flex", justifyContent: "center" }}>
      <div style={{
        maxWidth: 700, textAlign: "center",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s ease",
      }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: COLORS.green, marginBottom: 32 }}>
          {t.title[lang]}
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: COLORS.textLight, whiteSpace: "pre-line" }}>
          {t.text[lang]}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 3 — PROGRAMMA
   ═══════════════════════════════════════════ */
function Programma() {
  const { lang } = useLang();
  const t = texts.programma;
  const [ref, inView] = useInView();

  return (
    <section id="programma" ref={ref} style={{ background: COLORS.white, padding: "80px 24px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: COLORS.green, textAlign: "center", marginBottom: 48 }}>
          {t.title[lang]}
        </h2>
        <div style={{ position: "relative", paddingLeft: 44 }}>
          {/* Vertical timeline line */}
          <div style={{
            position: "absolute", left: 14, top: 4, bottom: 4,
            width: 3, borderRadius: 2,
            background: COLORS.green,
          }} />

          {t.items.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", marginBottom: 28,
              position: "relative",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-20px)",
              transition: `all 0.5s ease ${i * 0.1}s`,
            }}>
              {/* Dot on the line */}
              <div style={{
                position: "absolute", left: -37,
                width: 18, height: 18, borderRadius: "50%",
                background: COLORS.green,
                border: "3px solid white",
                boxShadow: `0 0 0 2px ${COLORS.green}`,
                marginTop: 3,
              }} />
              <div>
                <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: COLORS.nightBlue, display: "block", marginBottom: 2 }}>
                  {item.time}
                </span>
                <span style={{ fontSize: 16, color: COLORS.textLight }}>
                  {item[lang]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 4 — MERCATINI
   ═══════════════════════════════════════════ */
function VendorCard({ vendor, i, inView, lang }) {
  return (
    <div style={{
      background: "white", borderRadius: 20, padding: 28,
      boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      border: "2px solid rgba(42,171,179,0.12)",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `all 0.6s ease ${i * 0.08}s`,
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {/* Categoria tag */}
      <span style={{
        display: "inline-block", alignSelf: "flex-start",
        background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.green})`,
        color: "white", fontSize: 11, fontWeight: 700,
        padding: "3px 10px", borderRadius: 50, letterSpacing: 0.4,
        textTransform: "uppercase",
      }}>
        {vendor.cat[lang]}
      </span>
      {/* Titolo */}
      <h4 style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.nightBlue, fontSize: 20, lineHeight: 1.2, margin: 0 }}>
        {vendor.name}
      </h4>
      {/* Descrizione */}
      <p style={{ fontSize: 14, color: COLORS.textLight, lineHeight: 1.6, margin: 0, flex: 1 }}>
        {vendor.desc[lang]}
      </p>
      {/* Link Instagram / Sito */}
      {(vendor.instagram || vendor.sito) && (
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          {vendor.instagram && (
            <a href={vendor.instagram} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 5, color: COLORS.teal, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <Instagram size={15} />
              Instagram
            </a>
          )}
          {vendor.sito && (
            <a href={vendor.sito} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 5, color: COLORS.teal, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <Globe size={15} />
              Sito web
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function Mercatini() {
  const { lang } = useLang();
  const t = texts.mercatini;
  const [ref, inView] = useInView();
  const isMobile = useIsMobile();
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollTo = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[idx];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
    setActiveIdx(idx);
  };

  return (
    <section id="mercatini" ref={ref} style={{ background: COLORS.white, padding: "80px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: COLORS.green, textAlign: "center", marginBottom: 12 }}>
          {t.title[lang]}
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: COLORS.textLight, marginBottom: 48, textAlign: "center", maxWidth: 700, marginLeft: "auto", marginRight: "auto", whiteSpace: "pre-line" }}>
          {t.text[lang]}
        </p>
      </div>

      {isMobile ? (
        /* ── MOBILE: carousel ── */
        <div>
          {/* Scroll container */}
          <div ref={scrollRef} style={{
            display: "flex", overflowX: "auto", gap: 16,
            padding: "8px 48px 16px",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none", msOverflowStyle: "none",
          }}
            onScroll={(e) => {
              const el = e.currentTarget;
              const cardWidth = el.children[0]?.offsetWidth || 1;
              setActiveIdx(Math.round(el.scrollLeft / (cardWidth + 16)));
            }}>
            {t.vendors.map((v, i) => (
              <div key={i} style={{ flex: "0 0 78vw", maxWidth: 320, scrollSnapAlign: "center" }}>
                <VendorCard vendor={v} i={i} inView={inView} lang={lang} />
              </div>
            ))}
          </div>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
            {t.vendors.map((_, i) => (
              <div key={i} onClick={() => scrollTo(i)} style={{
                width: i === activeIdx ? 20 : 7, height: 7, borderRadius: 4,
                background: i === activeIdx ? COLORS.teal : "rgba(42,171,179,0.25)",
                transition: "all .3s ease", cursor: "pointer",
              }} />
            ))}
          </div>
        </div>
      ) : (
        /* ── DESKTOP: griglia 3 colonne ── */
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {t.vendors.map((v, i) => (
              <VendorCard key={i} vendor={v} i={i} inView={inView} lang={lang} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 5 — WORKSHOP
   ═══════════════════════════════════════════ */
function Workshop() {
  const { lang } = useLang();
  const t = texts.workshop;
  const [ref, inView] = useInView();
  const isMobile = useIsMobile();
  const workshopScrollRef = useRef(null);
  const [workshopActiveIdx, setWorkshopActiveIdx] = useState(0);

  const icons = { palette: Palette, shopping: ShoppingBag, wine: Wine };

  const workshopCard = (card, i) => {
    const Icon = icons[card.icon];
    return (
      <div key={i} style={{
        flex: isMobile ? "0 0 78vw" : 1,
        maxWidth: isMobile ? 320 : undefined,
        scrollSnapAlign: isMobile ? "center" : undefined,
        background: "white", borderRadius: 20, padding: 32,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        border: "2px solid rgba(42,171,179,0.15)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s ease ${i * 0.15}s`,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.orange})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <Icon size={28} color="white" />
        </div>
        <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: COLORS.nightBlue, marginBottom: 4 }}>
          {typeof card.title === "object" ? card.title[lang] : card.title}
        </h3>
        <p style={{ fontSize: 13, color: COLORS.teal, fontWeight: 700, marginBottom: 12 }}>
          {typeof card.by === "object" ? card.by[lang] : card.by}
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: COLORS.textLight }}>
          {card.desc[lang]}
        </p>
        <div style={{ marginTop: 16, fontFamily: "'Fredoka One', cursive", fontSize: 20, color: COLORS.orange }}>
          10€
        </div>
      </div>
    );
  };

  return (
    <section id="workshop" ref={ref} style={{ background: COLORS.white, padding: "80px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: COLORS.green, marginBottom: 8 }}>
          {t.title[lang]}
        </h2>
        <p style={{ fontSize: 15, color: COLORS.teal, fontWeight: 700, marginBottom: 48 }}>
          {t.subtitle[lang]}
        </p>

        {isMobile ? (
          <div>
            <div
              ref={workshopScrollRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                const cardWidth = el.children[0]?.offsetWidth || 1;
                setWorkshopActiveIdx(Math.round(el.scrollLeft / (cardWidth + 16)));
              }}
              style={{
                display: "flex", overflowX: "auto", gap: 16,
                padding: "8px 24px 16px",
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {t.cards.map((card, i) => workshopCard(card, i))}
            </div>
            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
              {t.cards.map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const el = workshopScrollRef.current;
                    if (!el) return;
                    const cardWidth = el.children[0]?.offsetWidth || 0;
                    el.scrollTo({ left: i * (cardWidth + 16), behavior: "smooth" });
                  }}
                  style={{
                    width: i === workshopActiveIdx ? 20 : 7,
                    height: 7, borderRadius: 4,
                    background: i === workshopActiveIdx ? COLORS.teal : "rgba(42,171,179,0.25)",
                    transition: "all .3s ease", cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "row", gap: 24 }}>
            {t.cards.map((card, i) => workshopCard(card, i))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 6 — COME ARRIVARE
   ═══════════════════════════════════════════ */
function ComeArrivare() {
  const { lang } = useLang();
  const t = texts.comeArrivare;
  const [ref, inView] = useInView();
  const isMobile = useIsMobile();

  return (
    <section id="come-arrivare" ref={ref} style={{ background: COLORS.white, padding: "80px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: COLORS.green, textAlign: "center", marginBottom: 48 }}>
          {t.title[lang]}
        </h2>

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 24, marginBottom: 40 }}>
          {/* Bus card */}
          <div style={{
            flex: 1, background: "white", borderRadius: 20, padding: 32,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "2px solid rgba(42,171,179,0.15)",
            textAlign: "center",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease",
          }}>
            <img src="assets/bus.webp" alt="Bus navetta" className="float-slow"
              style={{ width: 140, height: 140, objectFit: "contain", margin: "0 auto 20px", display: "block" }} />
            <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: COLORS.nightBlue, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Bus size={20} color={COLORS.teal} />
              {t.bus.title[lang]}
            </h3>
            <p style={{ fontSize: 14, color: COLORS.textLight, lineHeight: 1.6, marginBottom: 20 }}>
              {t.bus.info[lang]}
            </p>
            {/* Orari andata */}
            <div style={{ marginBottom: 16, textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.teal, marginBottom: 8, textAlign: "center" }}>
                {t.bus.toAvalon.label[lang]}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {t.bus.toAvalon.times.map((time) => (
                  <span key={time} style={{
                    background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.green})`,
                    color: "white", fontSize: 12, fontWeight: 700,
                    padding: "4px 10px", borderRadius: 50,
                  }}>{time}</span>
                ))}
              </div>
            </div>
            {/* Orari ritorno */}
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.orange, marginBottom: 8, textAlign: "center" }}>
                {t.bus.toOberdan.label[lang]}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {t.bus.toOberdan.times.map((time) => (
                  <span key={time} style={{
                    background: `linear-gradient(135deg, ${COLORS.orange}, #e8a000)`,
                    color: "white", fontSize: 12, fontWeight: 700,
                    padding: "4px 10px", borderRadius: 50,
                  }}>{time}</span>
                ))}
              </div>
            </div>
            {/* Nota */}
            <p style={{ marginTop: 20, fontSize: 12, color: "rgba(51,51,51,0.45)", fontStyle: "italic" }}>
              Servizio offerto a cura di Road Runners, maggiori info nella serzione Mercatini
            </p>
          </div>

          {/* Auto card */}
          <div style={{
            flex: 1, background: "white", borderRadius: 20, padding: 32,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "2px solid rgba(42,171,179,0.15)",
            textAlign: "center",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease 0.15s",
          }}>
            <img src="assets/car.webp" alt="In auto" className="float-slow"
              style={{ width: 160, height: 160, objectFit: "contain", margin: "0 auto 20px", display: "block" }} />
            <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: COLORS.nightBlue, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Car size={20} color={COLORS.teal} />
              {t.auto.title[lang]}
            </h3>
            <p style={{ fontSize: 15, color: COLORS.textLight, fontWeight: 700, marginBottom: 4 }}>
              {t.auto.address}
            </p>
            <p style={{ fontSize: 14, color: COLORS.teal }}>
              {t.auto.parking[lang]}
            </p>
          </div>
        </div>

        {/* Google Maps embed */}
        <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2782.5!2d13.7638!3d45.7097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477b1bc14e0db5ed%3A0x8e1eea1bfa2f8e1b!2sAvalon%20Wellness%20%26%20Spa!5e0!3m2!1sit!2sit!4v1700000000000"
            width="100%"
            height={isMobile ? 250 : 300}
            style={{ border: 0, display: "block" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Avalon Wellness Spa"
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 7 — MENÙ DEL PICNIC
   ═══════════════════════════════════════════ */
function MenuPicnic() {
  const { lang } = useLang();
  const t = texts.menu;
  const [ref, inView] = useInView();
  const isMobile = useIsMobile();

  return (
    <section id="menu" ref={ref} style={{
      background: COLORS.white,
      padding: "80px 24px 100px",
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: COLORS.green, marginBottom: 12 }}>
          {t.title[lang]}
        </h2>
        <p style={{ fontSize: 16, color: "rgba(51,51,51,0.6)", marginBottom: 48, lineHeight: 1.6 }}>
          {t.subtitle[lang]}
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 16,
        }}>
          {t.items.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 16,
              background: "rgba(54,138,27,0.04)",
              borderRadius: 16, padding: 20,
              border: "1px solid rgba(54,138,27,0.12)",
              textAlign: "left",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(15px)",
              transition: `all 0.5s ease ${i * 0.08}s`,
            }}>
              <span style={{ fontSize: 32, lineHeight: 1 }}>{item.emoji}</span>
              <div>
                <h4 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 16, color: COLORS.nightBlue, marginBottom: 4 }}>
                  {item.name[lang]}
                </h4>
                <p style={{ fontSize: 13, color: "rgba(51,51,51,0.6)", lineHeight: 1.5 }}>
                  {item.desc[lang]}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 8 — MUSICA
   ═══════════════════════════════════════════ */
function DJCard({ dj, i, inView }) {
  return (
    <div style={{
      width: 180, minWidth: 180,
      background: "white", borderRadius: 20, padding: "24px 16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      border: "2px solid rgba(42,171,179,0.12)",
      textAlign: "center",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `all 0.5s ease ${i * 0.1}s`,
    }}>
      <div style={{
        width: 100, height: 100, borderRadius: "50%",
        overflow: "hidden", margin: "0 auto 16px",
        border: `3px solid ${COLORS.teal}`,
        boxShadow: "0 4px 16px rgba(42,171,179,0.2)",
        background: "rgba(42,171,179,0.06)",
      }}>
        <img src={`assets/dj/${dj.photo}`} alt={dj.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <h4 style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.nightBlue, fontSize: 17, margin: 0, lineHeight: 1.2 }}>
        {dj.name}
      </h4>
    </div>
  );
}

function SpecialGuestCard({ lang, inView, t }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      marginBottom: 32,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.6s ease",
    }}>
      <div style={{
        width: 120, height: 120, borderRadius: "50%",
        overflow: "hidden", marginBottom: 16,
        border: `3px solid ${COLORS.orange}`,
        boxShadow: "0 4px 20px rgba(242,140,40,0.3)",
      }}>
        <img src="assets/special_guest.webp" alt="Special Guest"
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <h4 style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.orange, fontSize: 18, marginBottom: 4, lineHeight: 1.3, textAlign: "center" }}>
        {t.specialGuest[lang]}
      </h4>
      <p style={{ color: "rgba(51,51,51,0.5)", fontSize: 13, lineHeight: 1.4, textAlign: "center" }}>
        {t.specialGuestSub[lang]}
      </p>
    </div>
  );
}

function Musica() {
  const { lang } = useLang();
  const t = texts.musica;
  const [ref, inView] = useInView();
  const isMobile = useIsMobile();
  const djScrollRef = useRef(null);
  const [djActiveIdx, setDjActiveIdx] = useState(0);

  const djs = [
    { name: "Simon Adams", photo: "Simon_Adams.webp" },
    { name: "Dado", photo: "Dado.webp" },
    { name: "Lorenzo Perissinotto", photo: "Lorenzo_Perissinotto.webp" },
    { name: "Siria", photo: "Siria.webp" },
    { name: "Lorenzo Gessi", photo: "Lorenzo_Gessi.webp" },
    { name: "Lucas", photo: "Lucas.webp" },
  ];

  const djCards = (
    <>
      {djs.map((dj, i) => (
        <DJCard key={i} dj={dj} i={i} inView={inView} />
      ))}
    </>
  );

  const bgImage = isMobile ? "assets/mobile/music.webp" : "assets/desktop/musica_desktop.webp";

  return (
    <section id="musica" ref={ref} style={{
      position: "relative",
      backgroundImage: isMobile ? `url('${bgImage}')` : "none",
      backgroundSize: isMobile ? "contain" : "auto",
      backgroundPosition: "bottom center",
      backgroundRepeat: "no-repeat",
      backgroundColor: COLORS.white,
      minHeight: isMobile ? "100vh" : "auto",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: isMobile ? "60px 24px 420px" : "80px 24px 40px",
    }}>
      <div style={{ maxWidth: 1000, width: "100%", position: "relative", zIndex: 2 }}>
        <h2 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: isMobile ? 26 : 36, color: COLORS.green,
          textAlign: "center", marginBottom: 16,
          maxWidth: 600, marginLeft: "auto", marginRight: "auto",
          lineHeight: 1.3,
        }}>
          {t.title[lang]}
        </h2>
        <p style={{
          fontSize: 16, lineHeight: 1.7, color: COLORS.textLight,
          textAlign: "center", maxWidth: 600,
          margin: "0 auto 48px", whiteSpace: "pre-line",
        }}>
          {t.desc[lang]}
        </p>

        {/* Special Guest — isolated above */}
        <SpecialGuestCard lang={lang} inView={inView} t={t} />

        {/* DJ cards — carousel on mobile, grid on desktop */}
        {isMobile ? (
          <div>
            <div ref={djScrollRef} className="dj-carousel"
              onScroll={(e) => {
                const el = e.currentTarget;
                const cardWidth = el.children[0]?.offsetWidth || 1;
                setDjActiveIdx(Math.round(el.scrollLeft / (cardWidth + 16)));
              }}>
              {djCards}
            </div>
            {/* Dots */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 6,
              marginTop: 16, padding: "10px 20px", borderRadius: 50,
              background: "rgba(255,255,255,0.85)", alignSelf: "center",
              width: "fit-content", margin: "16px auto 0",
            }}>
              {djs.map((_, i) => (
                <div key={i} onClick={() => {
                  const el = djScrollRef.current;
                  if (!el) return;
                  el.scrollTo({ left: el.children[i]?.offsetLeft - 16, behavior: "smooth" });
                  setDjActiveIdx(i);
                }} style={{
                  width: i === djActiveIdx ? 20 : 7, height: 7, borderRadius: 4,
                  background: i === djActiveIdx ? COLORS.teal : "rgba(42,171,179,0.25)",
                  transition: "all .3s ease", cursor: "pointer",
                }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {djCards}
          </div>
        )}

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 9 — FORM
   ═══════════════════════════════════════════ */
/* ─── Helper: price value from package id ─── */
function pkgPrice(id) {
  const map = { free: 0, picnic: 25, workshop: 10, picnic_workshop: 30 };
  return map[id] || 0;
}
function needsWorkshop(id) { return id === "workshop" || id === "picnic_workshop"; }
function needsAllergies(id) { return id === "picnic" || id === "picnic_workshop"; }

function FormSection() {
  const { lang } = useLang();
  const t = texts.form;
  const [ref, inView] = useInView();
  const isMobile = useIsMobile();

  const [step, setStep] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState("");
  const [workshopChoice, setWorkshopChoice] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [allergies, setAllergies] = useState("");
  const [hasCompanions, setHasCompanions] = useState(null);
  const [companions, setCompanions] = useState([]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ── Meta Pixel helpers ── */
  const fbTrack = (event, params = {}) => {
    if (typeof window.fbq === "function") window.fbq("track", event, params);
  };

  /* ViewContent: quando la sezione form diventa visibile */
  useEffect(() => {
    if (inView) {
      fbTrack("ViewContent", { content_name: "Prenotazione Electronic Picnic", content_category: "event_booking" });
    }
  }, [inView]);

  const inputStyle = {
    width: "100%", padding: "14px 18px", borderRadius: 12,
    border: "2px solid rgba(0,0,0,0.15)", background: "rgba(255,255,255,0.85)",
    color: COLORS.textLight, fontFamily: "'Nunito', sans-serif",
    fontSize: 16, outline: "none", transition: "border-color 0.3s",
  };
  const labelStyle = { color: COLORS.textLight, fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" };
  const errStyle = { color: "#ff6b6b", fontSize: 12, marginTop: 4, display: "block" };

  const updateCompanion = (idx, field, value) => {
    const c = [...companions];
    c[idx] = { ...c[idx], [field]: value };
    /* reset workshop if package changes to one that doesn't need it */
    if (field === "pkg" && !needsWorkshop(value)) c[idx].workshop = "";
    if (field === "pkg" && !needsAllergies(value)) c[idx].allergies = "";
    setCompanions(c);
  };

  const setCompanionCount = (n) => {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(companions[i] || { name: "", pkg: "", workshop: "", allergies: "" });
    }
    setCompanions(arr);
  };

  /* Validation per step */
  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!selectedPkg) e.package = t.errors.package[lang];
    } else if (step === 2) {
      if (!name.trim()) e.name = t.errors.name[lang];
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = t.errors.email[lang];
      if (selectedPkg !== "free" && !phone.trim()) e.phone = t.errors.phone[lang];
      if (needsWorkshop(selectedPkg) && !workshopChoice) e.workshop = t.errors.workshop[lang];
    } else if (step === 3 && hasCompanions) {
      companions.forEach((c, i) => {
        if (!c.name.trim()) e[`comp_name_${i}`] = t.errors.companionName[lang];
        if (needsWorkshop(c.pkg) && !c.workshop) e[`comp_ws_${i}`] = t.errors.workshop[lang];
      });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (validateStep()) {
      /* InitiateCheckout: quando l'utente completa step 1 (scelta pacchetto) e va ai dati personali */
      if (step === 1 && selectedPkg) {
        fbTrack("InitiateCheckout", {
          content_name: selectedPkg,
          content_category: "event_package",
          value: pkgPrice(selectedPkg),
          currency: "EUR",
          num_items: 1,
        });
      }
      setStep(step + 1);
    }
  };
  const goBack = () => { setErrors({}); setStep(step - 1); };

  /* Totale stimato */
  const totalPrice = () => {
    let tot = pkgPrice(selectedPkg);
    companions.forEach(c => { if (c.pkg) tot += pkgPrice(c.pkg); });
    return tot;
  };

  /* Submit */
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await salvaPrenotazione({
        nome: name, email, telefono: phone,
        pacchetto: selectedPkg,
        workshop_scelto: needsWorkshop(selectedPkg) ? workshopChoice : null,
        allergie: needsAllergies(selectedPkg) ? allergies : null,
        note: notes || null,
        totale_stimato: totalPrice(),
        accompagnatori: companions.filter(c => c.name.trim()).map(c => ({
          nome: c.name, pacchetto: c.pkg || null,
          workshop: needsWorkshop(c.pkg) ? c.workshop : null,
          allergie: needsAllergies(c.pkg) ? c.allergies : null,
        })),
      });
      if (!result.success) console.error("Errore salvataggio:", result.error);
      /* GA4 event */
      if (typeof window.gtag === "function") {
        window.gtag("event", "form_submit", {
          event_category: "booking",
          package_type: selectedPkg,
          total_people: 1 + companions.filter(c => c.name.trim()).length,
          total_price: totalPrice(),
        });
      }
      /* Meta Pixel — Purchase */
      fbTrack("Purchase", {
        value: totalPrice(),
        currency: "EUR",
        content_name: selectedPkg,
        content_category: "event_booking",
        num_items: 1 + companions.filter(c => c.name.trim()).length,
      });
    } catch (err) {
      console.error("Errore:", err);
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  const pkgName = (id) => {
    const p = t.packages.find(p => p.id === id);
    return p ? (typeof p.name === "object" ? p.name[lang] : p.name) : "";
  };
  const wsName = (id) => {
    const w = t.workshops.find(w => w.id === id);
    return w ? (typeof w.name === "object" ? w.name[lang] : w.name) : "";
  };

  /* ─── Step progress indicator ─── */
  const StepIndicator = () => (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
      {[1, 2, 3, 4].map(s => (
        <div key={s} style={{
          width: s === step ? 32 : 10, height: 10, borderRadius: 5,
          background: s <= step ? COLORS.green : "rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );

  /* ─── Navigation buttons ─── */
  const NavButtons = ({ showBack = true, showNext = true, nextLabel, onNext }) => (
    <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
      {showBack && (
        <button type="button" onClick={goBack} style={{
          flex: 1, padding: "14px 24px", borderRadius: 50, border: `2px solid ${COLORS.green}`,
          background: "transparent", color: COLORS.green, fontFamily: "'Fredoka One', cursive",
          fontSize: 16, cursor: "pointer", transition: "all 0.3s",
        }}>{t.back[lang]}</button>
      )}
      {showNext && (
        <button type="button" onClick={onNext || goNext} className="cta-btn"
          style={{ flex: 1, fontSize: 16, padding: "14px 24px" }}>
          {nextLabel || t.next[lang]}
        </button>
      )}
    </div>
  );

  return (
    <section id="form" ref={ref} style={{
      backgroundImage: isMobile ? "url('assets/mobile/form.webp')" : "none",
      backgroundSize: isMobile ? "contain" : "auto",
      backgroundPosition: "bottom center",
      backgroundRepeat: "no-repeat",
      backgroundColor: COLORS.white,
      padding: isMobile ? "80px 24px 360px" : "80px 24px",
      minHeight: isMobile ? "100vh" : "auto",
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>

        {/* ═══ SUCCESS STATE ═══ */}
        {submitted ? (
          <div style={{ opacity: inView ? 1 : 0, transition: "opacity 0.5s" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%", background: COLORS.teal,
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
            }}>
              <Check size={40} color="white" />
            </div>
            <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: COLORS.green, marginBottom: 8 }}>
              {t.success[lang]}
            </h3>
            <p style={{ color: COLORS.textLight, fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
              {t.successSub[lang]}
            </p>
            <div style={{
              background: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)",
              borderRadius: 16, padding: 28, color: "white",
            }}>
              <Instagram size={32} color="white" style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, marginBottom: 4 }}>
                {t.followUs[lang]}
              </p>
              <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 16 }}>
                {t.followUsSub[lang]}
              </p>
              <a href="https://instagram.com/electronic_picnic" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-block", background: "white", color: "#333",
                  padding: "10px 28px", borderRadius: 50, fontFamily: "'Fredoka One', cursive",
                  fontSize: 15, textDecoration: "none", transition: "transform 0.3s",
                }}>
                @electronic_picnic
              </a>
            </div>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 30, color: COLORS.green, marginBottom: 8 }}>
              {t.title[lang]}
            </h2>
            <p style={{ color: "rgba(51,51,51,0.7)", fontSize: 15, marginBottom: 32, lineHeight: 1.5 }}>
              {t.subtitle[lang]}
            </p>
            <StepIndicator />

            {/* ═══ STEP 1 — Package choice ═══ */}
            {step === 1 && (
              <div>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: COLORS.nightBlue, marginBottom: 20 }}>
                  {t.step1Title[lang]}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
                  {t.packages.map(pkg => {
                    const sel = selectedPkg === pkg.id;
                    const pName = typeof pkg.name === "object" ? pkg.name[lang] : pkg.name;
                    const pPrice = typeof pkg.price === "object" ? pkg.price[lang] : pkg.price;
                    return (
                      <div key={pkg.id} onClick={() => { setSelectedPkg(pkg.id); setErrors({}); }}
                        style={{
                          padding: 20, borderRadius: 16, cursor: "pointer",
                          border: sel ? `3px solid ${COLORS.green}` : "2px solid rgba(0,0,0,0.1)",
                          background: sel ? "rgba(54,138,27,0.06)" : "white",
                          transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: 16,
                        }}>
                        <span style={{ fontSize: 28 }}>{pkg.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 17, color: COLORS.nightBlue }}>
                            {pName}
                          </div>
                          <div style={{ fontSize: 13, color: "rgba(51,51,51,0.6)", marginTop: 2 }}>
                            {pkg.desc[lang]}
                          </div>
                        </div>
                        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: COLORS.orange }}>
                          {pPrice}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.package && <span style={errStyle}>{errors.package}</span>}
                <NavButtons showBack={false} />
              </div>
            )}

            {/* ═══ STEP 2 — Personal details ═══ */}
            {step === 2 && (
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: COLORS.nightBlue, marginBottom: 20, textAlign: "center" }}>
                  {t.step2Title[lang]}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>{t.name[lang]} *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder={t.name[lang]}
                      style={{ ...inputStyle, borderColor: errors.name ? "#ff6b6b" : undefined }} />
                    {errors.name && <span style={errStyle}>{errors.name}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>{t.email[lang]} *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder={t.email[lang]}
                      style={{ ...inputStyle, borderColor: errors.email ? "#ff6b6b" : undefined }} />
                    {errors.email && <span style={errStyle}>{errors.email}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>
                      {t.phone[lang]}{selectedPkg !== "free" && " *"}
                    </label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder={selectedPkg === "free"
                        ? `${t.phone[lang]} (${lang === "it" ? "opzionale" : "optional"})`
                        : t.phone[lang]}
                      style={{ ...inputStyle, borderColor: errors.phone ? "#ff6b6b" : undefined }} />
                    {errors.phone && <span style={errStyle}>{errors.phone}</span>}
                  </div>
                  {needsWorkshop(selectedPkg) && (
                    <div>
                      <label style={labelStyle}>{t.workshopLabel[lang]} *</label>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {t.workshops.map(ws => {
                          const sel = workshopChoice === ws.id;
                          return (
                            <div key={ws.id} onClick={() => { setWorkshopChoice(ws.id); setErrors(prev => { const n = { ...prev }; delete n.workshop; return n; }); }}
                              style={{
                                flex: "1 1 calc(33% - 8px)", padding: "12px 8px", borderRadius: 12,
                                border: sel ? `2px solid ${COLORS.teal}` : "2px solid rgba(0,0,0,0.1)",
                                background: sel ? "rgba(42,171,179,0.08)" : "white",
                                cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                              }}>
                              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.nightBlue }}>
                                {typeof ws.name === "object" ? ws.name[lang] : ws.name}
                              </div>
                              <div style={{ fontSize: 11, color: COLORS.teal, marginTop: 2 }}>
                                {typeof ws.by === "object" ? ws.by[lang] : ws.by}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {errors.workshop && <span style={errStyle}>{errors.workshop}</span>}
                    </div>
                  )}
                  {needsAllergies(selectedPkg) && (
                    <div>
                      <label style={labelStyle}>{t.allergies[lang]}</label>
                      <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)}
                        placeholder={t.allergiesPlaceholder[lang]} style={inputStyle} />
                    </div>
                  )}
                </div>
                <NavButtons />
              </div>
            )}

            {/* ═══ STEP 3 — Companions ═══ */}
            {step === 3 && (
              <div>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: COLORS.nightBlue, marginBottom: 20 }}>
                  {t.step3Title[lang]}
                </h3>
                {hasCompanions === null && (
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
                    <button type="button" onClick={() => { setHasCompanions(true); setCompanions([{ name: "", pkg: "", workshop: "", allergies: "" }]); }}
                      style={{
                        flex: 1, padding: "16px", borderRadius: 16,
                        border: "2px solid rgba(0,0,0,0.1)", background: "white",
                        fontFamily: "'Fredoka One', cursive", fontSize: 16, color: COLORS.textLight,
                        cursor: "pointer",
                      }}>{t.companionsYes[lang]}</button>
                    <button type="button" onClick={() => { setHasCompanions(false); setCompanions([]); }}
                      style={{
                        flex: 1, padding: "16px", borderRadius: 16,
                        border: "2px solid rgba(0,0,0,0.1)", background: "white",
                        fontFamily: "'Fredoka One', cursive", fontSize: 16, color: COLORS.textLight,
                        cursor: "pointer",
                      }}>{t.companionsNo[lang]}</button>
                  </div>
                )}
                {hasCompanions === false && (
                  <div>
                    <div style={{ textAlign: "center", marginBottom: 8 }}>
                      <button type="button" onClick={() => setHasCompanions(null)}
                        style={{ background: "none", border: "none", color: COLORS.teal, fontSize: 13, cursor: "pointer" }}>
                        {lang === "it" ? "← Cambia scelta" : "← Change choice"}
                      </button>
                    </div>
                    <NavButtons />
                  </div>
                )}
                {hasCompanions === true && (
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, justifyContent: "center" }}>
                      <label style={{ fontSize: 14, fontWeight: 600, color: COLORS.textLight }}>{t.companionsCount[lang]}</label>
                      <select value={companions.length} onChange={e => setCompanionCount(Number(e.target.value))}
                        style={{ ...inputStyle, width: 70, padding: "8px 12px", textAlign: "center" }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    {companions.map((c, i) => (
                      <div key={i} style={{
                        background: "rgba(42,171,179,0.04)", borderRadius: 16, padding: 16, marginBottom: 12,
                        border: "1px solid rgba(42,171,179,0.1)",
                      }}>
                        <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: 14, color: COLORS.teal, marginBottom: 10 }}>
                          {lang === "it" ? `Accompagnatore ${i + 1}` : `Companion ${i + 1}`}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <input type="text" value={c.name} onChange={e => updateCompanion(i, "name", e.target.value)}
                            placeholder={t.companionName[lang]}
                            style={{ ...inputStyle, padding: "10px 14px", fontSize: 14, borderColor: errors[`comp_name_${i}`] ? "#ff6b6b" : undefined }} />
                          {errors[`comp_name_${i}`] && <span style={errStyle}>{errors[`comp_name_${i}`]}</span>}
                          <select value={c.pkg} onChange={e => updateCompanion(i, "pkg", e.target.value)}
                            style={{ ...inputStyle, padding: "10px 14px", fontSize: 14, cursor: "pointer" }}>
                            <option value="">{t.companionPackage[lang]}...</option>
                            {t.packages.map(p => (
                              <option key={p.id} value={p.id}>
                                {(typeof p.name === "object" ? p.name[lang] : p.name) + " — " + (typeof p.price === "object" ? p.price[lang] : p.price)}
                              </option>
                            ))}
                          </select>
                          {needsWorkshop(c.pkg) && (
                            <div>
                              <select value={c.workshop} onChange={e => updateCompanion(i, "workshop", e.target.value)}
                                style={{ ...inputStyle, padding: "10px 14px", fontSize: 14, cursor: "pointer", borderColor: errors[`comp_ws_${i}`] ? "#ff6b6b" : undefined }}>
                                <option value="">{t.workshopLabel[lang]}...</option>
                                {t.workshops.map(ws => (
                                  <option key={ws.id} value={ws.id}>{typeof ws.name === "object" ? ws.name[lang] : ws.name}</option>
                                ))}
                              </select>
                              {errors[`comp_ws_${i}`] && <span style={errStyle}>{errors[`comp_ws_${i}`]}</span>}
                            </div>
                          )}
                          {needsAllergies(c.pkg) && (
                            <input type="text" value={c.allergies || ""} onChange={e => updateCompanion(i, "allergies", e.target.value)}
                              placeholder={t.allergiesPlaceholder[lang]}
                              style={{ ...inputStyle, padding: "10px 14px", fontSize: 14 }} />
                          )}
                        </div>
                      </div>
                    ))}
                    <div style={{ textAlign: "center" }}>
                      <button type="button" onClick={() => { setHasCompanions(null); setCompanions([]); }}
                        style={{ background: "none", border: "none", color: COLORS.teal, fontSize: 13, cursor: "pointer", marginBottom: 8 }}>
                        {lang === "it" ? "← Cambia scelta" : "← Change choice"}
                      </button>
                    </div>
                    <NavButtons />
                  </div>
                )}
              </div>
            )}

            {/* ═══ STEP 4 — Summary ═══ */}
            {step === 4 && (
              <div>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: COLORS.nightBlue, marginBottom: 20 }}>
                  {t.step4Title[lang]}
                </h3>
                <div style={{
                  background: "rgba(42,171,179,0.04)", borderRadius: 16, padding: 20,
                  border: "1px solid rgba(42,171,179,0.1)", textAlign: "left", marginBottom: 16,
                }}>
                  {/* Referente */}
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontWeight: 700, color: COLORS.nightBlue, fontSize: 15 }}>{name}</p>
                    <p style={{ fontSize: 13, color: "rgba(51,51,51,0.6)" }}>{email} · {phone}</p>
                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      <span style={{ background: COLORS.green, color: "white", fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
                        {pkgName(selectedPkg)}
                      </span>
                      {needsWorkshop(selectedPkg) && workshopChoice && (
                        <span style={{ background: COLORS.teal, color: "white", fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
                          {wsName(workshopChoice)}
                        </span>
                      )}
                    </div>
                    {needsAllergies(selectedPkg) && allergies && (
                      <p style={{ fontSize: 12, color: "rgba(51,51,51,0.5)", marginTop: 4 }}>
                        {lang === "it" ? "Allergie:" : "Allergies:"} {allergies}
                      </p>
                    )}
                  </div>
                  {/* Companions */}
                  {companions.filter(c => c.name).map((c, i) => (
                    <div key={i} style={{ paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      <p style={{ fontWeight: 700, color: COLORS.nightBlue, fontSize: 14 }}>{c.name}</p>
                      <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                        {c.pkg && (
                          <span style={{ background: "rgba(54,138,27,0.15)", color: COLORS.green, fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
                            {pkgName(c.pkg)}
                          </span>
                        )}
                        {needsWorkshop(c.pkg) && c.workshop && (
                          <span style={{ background: "rgba(42,171,179,0.15)", color: COLORS.teal, fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
                            {wsName(c.workshop)}
                          </span>
                        )}
                      </div>
                      {needsAllergies(c.pkg) && c.allergies && (
                        <p style={{ fontSize: 11, color: "rgba(51,51,51,0.5)", marginTop: 2 }}>
                          {lang === "it" ? "Allergie:" : "Allergies:"} {c.allergies}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {/* Total */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px", borderRadius: 12,
                  background: "rgba(54,138,27,0.08)", marginBottom: 16,
                }}>
                  <span style={{ fontWeight: 700, color: COLORS.textLight }}>{t.total[lang]}</span>
                  <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: COLORS.orange }}>
                    {totalPrice() === 0 ? (lang === "it" ? "Gratuito" : "Free") : `${totalPrice()}€`}
                  </span>
                </div>
                {/* Notes */}
                <div style={{ textAlign: "left", marginBottom: 8 }}>
                  <label style={labelStyle}>{t.notes[lang]}</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder={t.notesPlaceholder[lang]} rows={3}
                    style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <NavButtons
                  nextLabel={submitting ? "..." : t.submit[lang]}
                  onNext={handleSubmit}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 10 — FOOTER
   ═══════════════════════════════════════════ */
function Footer() {
  const { lang } = useLang();
  const t = texts.footer;
  const isMobile = useIsMobile();

  return (
    <footer style={{
      background: COLORS.white, padding: "48px 24px 24px",
      borderTop: `1px solid rgba(0,0,0,0.1)`,
    }}>
      <div style={{
        maxWidth: 1000, margin: "0 auto",
        display: "flex", flexDirection: isMobile ? "column" : "row",
        gap: 40, alignItems: isMobile ? "center" : "flex-start",
        textAlign: isMobile ? "center" : "left",
      }}>
        {/* Logo */}
        <div style={{ flex: 1 }}>
          <img src="assets/logo.svg" alt="Electronic Picnic" style={{ height: 56, marginBottom: 12 }} />
          <p style={{ color: "rgba(51,51,51,0.5)", fontSize: 14 }}>
            1 Maggio 2026 — Carso, Trieste
          </p>
        </div>
        {/* Social */}
        <div style={{ flex: 1 }}>
          <h4 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 16, color: COLORS.nightBlue, marginBottom: 12 }}>Social</h4>
          <a href="https://instagram.com/electronic_picnic" target="_blank" rel="noopener noreferrer"
            style={{ color: COLORS.teal, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, justifyContent: isMobile ? "center" : "flex-start" }}>
            <Instagram size={18} />
            {t.social}
          </a>
        </div>
        {/* Partners */}
        <div style={{ flex: 1 }}>
          <h4 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 16, color: COLORS.nightBlue, marginBottom: 12 }}>
            {t.partners[lang]}
          </h4>
          <p style={{ color: "rgba(51,51,51,0.5)", fontSize: 14 }}>{t.partnerList}</p>
        </div>
      </div>

      <div style={{
        maxWidth: 1000, margin: "32px auto 0", paddingTop: 24,
        borderTop: "1px solid rgba(0,0,0,0.1)", textAlign: "center",
      }}>
        <p style={{ color: "rgba(51,51,51,0.3)", fontSize: 12 }}>
          © 2026 Electronic Picnic — ON CIRCLE Music
        </p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function ElectronicPicnic() {
  const [lang, setLang] = useState("it");

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <link href={fontLink} rel="stylesheet" />
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh" }}>
        <Navbar />
        <Hero />
        <Concetto />
        <Programma />
        <Mercatini />
        <Workshop />
        <ComeArrivare />
        <MenuPicnic />
        <Musica />
        <FormSection />
        <Footer />
      </div>
    </LangContext.Provider>
  );
}
