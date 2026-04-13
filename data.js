// ============================================================
//  KÖZLEMÉNYEK
//  Törlés: töröld ki az objektumot – mindenhol eltűnik.
//
//  Mezők:
//    id       – egyedi azonosító (kötelező)
//    tag      – kategóriacímke (pl. 'Esemény', 'Hirdetmény')
//    date     – dátum szövegként (pl. '2026. április 12.')
//    title    – cím
//    excerpt  – rövid kivonat (kártyákon jelenik meg)
//    content  – teljes HTML tartalom (modálban)
//
//    img      – egy kép (string) VAGY több kép (tömb)
//               pl. img: 'img/foto.jpg'
//               pl. img: ['img/foto1.jpg','img/foto2.jpg','img/foto3.jpg']
//
//    pdf      – PDF fájl elérési útja (modálban beágyazva jelenik meg)
//               pl. pdf: 'doc/hirdetes.pdf'
//
//    photoOnly – true → csak képes közlemény (nincs szövegtest a modálban)
//               Kötelező: img tömb vagy string
// ============================================================

const POSTS = [

  // // ── Normál közlemény – egy kép ───────────────────────────
  // {
  //   id: 'p1',
  //   tag: 'Esemény',
  //   date: '2026. április 12.',
  //   title: 'Cím',
  //   excerpt: 'Rövid leírás a közleményhez.',
  //   img: 'img/templom.jpg',
  //   content: `
  //     <p><strong>Szöveg</strong> – Szöveg</p>
  //     <p><strong>Szöveg</strong> – Szöveg</p>
  //     <p>Szöveg.</p>
  //   `
  // },

  // // ── Normál közlemény – több kép (lapozható) ──────────────
  // {
  //   id: 'p2',
  //   tag: 'Esemény',
  //   date: '2026. április 10.',
  //   title: 'Több képes közlemény',
  //   excerpt: 'Ez a közlemény több képet tartalmaz – a modálban lapozni lehet köztük.',
  //   img: ['img/templom.jpg', 'img/templom.jpg', 'img/templom.jpg'],
  //   content: `
  //     <p><strong>Szöveg</strong> – Szöveg</p>
  //     <p>Szöveg.</p>
  //   `
  // },

  // ── PDF közlemény ────────────────────────────────────────
  {
    id: 'p3',
    tag: 'PDF Dokumentum',
    date: '2026. április 2.',
    title: 'Iskolatej ajánlat.',
    excerpt: 'Iskolatej ajánlat.',
    pdf: 'doc/Iskolatej ajánlat.pdf',  
    content: `
     
    `
  },

  // // ── Csak képek – szöveg nélkül ───────────────────────────
  // {
  //   id: 'p4',
  //   tag: 'Galéria',
  //   date: '2026. április 5.',
  //   title: 'Képes összeállítás',
  //   excerpt: '',
  //   photoOnly: true,           // ← csak képes közlemény
  //   img: ['img/templom.jpg', 'img/templom.jpg', 'img/templom.jpg'],
  // },

];