export interface Archetype {
  id: string;
  title: string;
  description: string;
  genre: string;
  vibe: string;
  energy: "bassa" | "media" | "alta";
  setting: "indoor" | "outdoor";
  tags: string[];
}

export const archetypes: Archetype[] = [
  {
    id: "jazz-club",
    title: "Jazz in un club intimo",
    description: "Luci soffuse, cocktail e un trio che improvvisa fino a tardi",
    genre: "musica",
    vibe: "romantico",
    energy: "bassa",
    setting: "indoor",
    tags: ["jazz", "romantico", "intimo", "serale"],
  },
  {
    id: "rock-piazza",
    title: "Concerto rock in piazza",
    description:
      "Palco grande, folla, birra e la band che spacca sotto le stelle",
    genre: "musica",
    vibe: "festoso",
    energy: "alta",
    setting: "outdoor",
    tags: ["rock", "festoso", "energia", "sociale"],
  },
  {
    id: "aperitivo-mare",
    title: "Aperitivo vista mare",
    description: "Spritz al tramonto con musica lounge e brezza marina",
    genre: "aperitivo",
    vibe: "tranquillo",
    energy: "bassa",
    setting: "outdoor",
    tags: ["aperitivo", "tranquillo", "mare", "romantico"],
  },
  {
    id: "mostra-arte",
    title: "Mostra d'arte contemporanea",
    description: "Installazioni, luci e riflessioni in un palazzo storico",
    genre: "mostra",
    vibe: "culturale",
    energy: "bassa",
    setting: "indoor",
    tags: ["arte", "culturale", "intimo", "intellettuale"],
  },
  {
    id: "sagra-entroterra",
    title: "Sagra nell'entroterra",
    description: "Focaccia, vino locale, musica dal vivo e tavolate all'aperto",
    genre: "food",
    vibe: "sociale",
    energy: "media",
    setting: "outdoor",
    tags: ["food", "sociale", "tradizionale", "conviviale"],
  },
  {
    id: "dj-set-porto",
    title: "DJ set al Porto Antico",
    description: "Elettronica, luci colorate e gente che balla sul molo",
    genre: "nightlife",
    vibe: "movimentato",
    energy: "alta",
    setting: "outdoor",
    tags: ["elettronica", "nightlife", "energia", "ballo"],
  },
  {
    id: "teatro-dialettale",
    title: "Spettacolo teatrale in genovese",
    description: "Comicità locale, risate e tradizione in un teatro storico",
    genre: "teatro",
    vibe: "sociale",
    energy: "media",
    setting: "indoor",
    tags: ["teatro", "comicità", "tradizionale", "sociale"],
  },
  {
    id: "escursione-forti",
    title: "Escursione ai forti al tramonto",
    description: "Camminata panoramica con vista sulla città e pic-nic in cima",
    genre: "escursione",
    vibe: "tranquillo",
    energy: "media",
    setting: "outdoor",
    tags: ["natura", "tranquillo", "sport", "panorama"],
  },
  {
    id: "indie-caruggi",
    title: "Live indie nei caruggi",
    description: "Band emergente in un locale piccolo nel centro storico",
    genre: "musica",
    vibe: "alternativo",
    energy: "media",
    setting: "indoor",
    tags: ["indie", "alternativo", "intimo", "scoperta"],
  },
  {
    id: "festival-multigenere",
    title: "Festival multigenere all'aperto",
    description:
      "Musica, street food, artigianato e spettacoli per tutta la sera",
    genre: "festival",
    vibe: "festoso",
    energy: "alta",
    setting: "outdoor",
    tags: ["festival", "festoso", "varietà", "sociale"],
  },
];
