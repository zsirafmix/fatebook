# 📖 FateBook

> **„Az életedből folyamatosan könyv lesz.”**  
> *„Te mesélsz. A FateBook emlékezik, rendszerez és könyvet készít.”*  
> *English: „Every life is a story. Your life continuously becomes a book.”*

[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/zsirafmix/fatebook)

---

## 🌟 Mi a FateBook?

A **FateBook** egy modern, reszponzív, AI-alapú személyes életrajzíró, digitális emlékarchívum, napló és anonim történetközösség. 

A felhasználó rendszeresen beszélget egy személyre szabott AI-asszisztenssel a jelenéről, múltjáról, családjáról, munkájáról, utazásairól, fontos emberekről, fényképekről és emlékekről. Az AI a beszélgetéseket nemcsak tárolja, hanem strukturálja, összekapcsolja és olvasmányos fejezetekké alakítja, amelyekből folyamatosan épül az **élet könyve**.

```
BESZÉLGETÉS → EMLÉK → STRUKTURÁLT ADAT → FEJEZET → ÉLETKÖNYV
```

A rendszer évtizedes skálájú használatra készült: a felhasználó feladata a felhőtlen mesélés, míg a rendszerezést, az ellentmondások feloldását és a szerkesztést az AI végzi el.

---

## ✨ Fő Funkciók (A 27 Rendszerkövetelmény alapján)

### 1. 🎨 Vizuális Stílus (Modern Metro & Organikus Könyvárkád)
- **Windows 8 / Modern UI (Metro)** ihletésű tiszta rácsrendszer, lapos felületek, tiszta geometria, 3D benyomódási mikro-interakciók.
- **Funkciónkénti színkódok**:
  - 🟦 **Beszélgetés (FateAI)**: Mélykék (`#1E3A8A`)
  - 🍷 **Könyvem (My FateBook)**: Bordó (`#881337`)
  - 🩵 **Mai kérdés**: Türkiz (`#0D9488`)
  - 🟧 **FateBoard**: Meleg Narancs (`#EA580C`)
  - 🟪 **Idővonalam**: Mélylila (`#6B21A8`)
  - 🟩 **Szereplők**: Smaragd / Erdőzöld (`#047857`)
  - 🟨 **Fotók & Média**: Meleg Mustár (`#B45309`)
  - 🟥 **FateFamily**: Karmazsinvörös (`#B91C1C`)
- **Analóg hangulat**: Papír és antik tintahatás, Polaroid fotókeretek, kézzel írt betűk, réz rajzszögek, parafatábla háttér.

### 2. 📱 Reszponzív Rendszer (12-Col Desktop + Mobil Keret)
- Desktopon és tableten teljes értékű 12 egységes CSS grid.
- Mobilon 1–2 oszlopos csempeelrendezés és fix alsó navigáció:
  `[ Kezdőlap | AI | Könyvem | FateBoard | Profil ]`
- Beépített eszközváltó kapcsoló az azonnali mobil keret teszteléséhez.

### 3. 🔲 Főoldal és Live Tile-ok
- Dinamikus, finom 3D Live Tile átfordulás (a *Könyvem* csempe automatikusan vagy gombra átfordul a statisztikákról a borítóra).
- 10 funkcionális csempe: Beszélgessünk, Könyvem, Mai kérdés, FateBoard, Idővonal, Szereplők, Emlékek/Fotók, Legutóbb, Történetem statisztikák, FateFamily.

### 4. 🤖 FateAI Személyes Életrajzíró
- 6 választható karakter egyedi hangvétellel:
  - **Életrajzíró**: Precíz, krónikás, elegáns.
  - **Barát**: Melegszívű, közvetlen, empatikus.
  - **Riporter**: Mélyreható kérdések, belső okok kutatása.
  - **Emlékvadász**: Illatok, ízek, elfeledett érzékek felidézése.
  - **Humorista**: Könnyed, derűs, anekdotikus.
  - **Író**: Irodalmi metaforák, regényes atmoszféra.
- Messenger-szerű modern csevegő és gyors indító módok.

### 5. 🎙️ Hangalapú Mesélés (Mesélj Mód)
- Teljes képernyős, zavartalan hangstúdió:
  - Mikrofon aktivitás és animált hanghullámok (Waveform).
  - Élő számláló és streaming Speech-to-Text átirat.
  - VAD (Voice Activity Detection): nem szakítja félbe a mesélőt minden szónál.

### 6. 📝 Beszélgetésből Fejezet
- *„Elkészítsem ebből a mai fejezetet?”* szintetizáló folyamat.
- Háromfázisú jóváhagyási státusz: **AI-vázlat → Ellenőrizve → Végleges (Kánon)**.
- Választható írásmódok: Életrajz, Napló, Humoros memoár, Irodalmi, Dokumentarista.
- A nyers beszélgetési napló soha nem vész el!

### 7. 🧠 FateMemory Strukturált Tudásgráf
- Entitástípusok: Személyek, Családi viszonyok, Helyszínek, Időszakok, Tárgyak, Események.
- **Megbízhatósági szintek**:
  - `Megerősített tény`
  - `[?] Feltételezés` (AI hypothesis) 1-kattintásos megerősítéssel.
- **„Ezt rosszul értetted”** azonnali korrekciós funkció. Hallucinációmentes kánon.

### 8. ⚠️ Ellentmondás- és Hiánykereső Motor
- Észleli az ütközéseket: *„Korábban 1997-et mondtál, most 1998-at. Melyik helyes?”*
- Opciók: `1997` | `1998` | `Nem emlékszem` | `Két külön esemény`.
- Térképezi az életkorszakok lefedettségét, és jelzi az elfeledett éveket (pl. *1976–1983 gimnáziumi évek hiánya*).

### 9. 📖 My FateBook (A Valódi Könyvolvasó)
- Kétoldalas kinyitott könyv nézet (*double-page spread*), könyvgerinc árnyékolással, papír textúrával, elegáns Playfair Display antikva tipográfiával és beágyazott Polaroid fotókkal.
- Dinamikus Tartalomjegyzék, lapszámozás és fejezetátrendezési lehetőség.

### 10. 📌 FateBoard – Anonim Parafatábla Közösség
- Természetes parafa háttér, enyhén elforgatott (-2°...+2°), rajzszöggel feltűzött cetlik és Polaroid képek.
- Anonim jeligék (pl. `ÖregRóka72`, `BalatoniCápa`).
- 8 érzelmi reakció: `🥹 Megható`, `😂 Vicces`, `😲 Hihetetlen`, `🤔 Elgondolkodtató`, `❤️ Szerelem`, `🎒 Kaland`, `🕯️ Hátborzongató`, `🦉 Életbölcsesség`.
- **Smart Ranking**: Reakciók × Frissesség × Reakcióminőség × Végigolvasási arány.

### 11. 🛡️ Privacy Guard és Automatikus Anonimizálás
- Szigorú elválasztás a privát FateBook és a nyilvános FateBoard között.
- Automatikus entitás-detektor publikálás előtt: kiszűri a neveket, pontos helyszíneket, évszámokat.
- 1-kattintásos anonimizáló motor.

### 12. 👨‍👩‍👧 FateFamily és Változó Nézőpont
- Több nézőpont egyetlen eseménynél: *1989 – Családi nyaralás* (Apa emlékei vs. Anya emlékei vs. Anna emlékei).
- **„Kérdezz egy családtagtól”**: Aszinkron kérdésküldés, amit a családtag saját FateAI-ja tesz fel neki a következő beszélgetéskor.
- **Változó Nézőpont**: Időbeli reflexió (hogyan láttad ugyanazt az eseményt 2026-ban és hogyan ma).

### 13. 🖨️ Könyvkiadás Wizard (FateBook Print)
- Keménytáblás vászonkötés aranypréseléssel, archív minőségű könyvpapírral és 300 DPI fotóellenőrzéssel.
- Export formátumok: Nyomdakész PDF/X-1a, EPUB, DOCX.

---

## 🛠️ Rendszerarchitektúra és Technológiák

```
fatebook/
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   ├── ChapterWizardModal.tsx  # Beszélgetésből fejezetkészítő wizard
│   │   │   ├── FateAiChat.tsx          # Messenger-szerű AI csevegő & személyiségek
│   │   │   └── VoiceStudioModal.tsx    # Teljes képernyős VAD hangstúdió
│   │   ├── board/
│   │   │   ├── FateBoard.tsx           # Parafatábla, kitűzött cetlik & reakciók
│   │   │   └── PrivacyCheckModal.tsx   # PII szűrő és anonimizáló motor
│   │   ├── book/
│   │   │   ├── BookReader.tsx          # Valósághű kétoldalas digitális könyvolvasó
│   │   │   └── PrintWizardModal.tsx    # Nyomtatási és export wizard
│   │   ├── dashboard/
│   │   │   └── LiveTileDashboard.tsx   # Windows 8 / Metro stílusú Live Tile rács
│   │   ├── family/
│   │   │   └── FateFamilyView.tsx      # Többgenerációs archívum & több nézőpont
│   │   ├── memory/
│   │   │   ├── ContradictionModal.tsx  # Ellentmondás-feloldó párbeszéd
│   │   │   └── FateMemoryGraph.tsx     # Személyes tudásbázis & [?] feltételezések
│   │   ├── Header.tsx                  # Fejléc és nézetváltó (Desktop/Mobil)
│   │   └── MobileBottomNav.tsx         # Mobil alsó fix navigációs sáv
│   ├── data/
│   │   └── initialData.ts              # Kezdő állapot, fejezetek, entitások
│   ├── types/
│   │   └── index.ts                    # TypeScript interfészek és modellek
│   ├── App.tsx                         # Fő alkalmazás konténer és állapotkezelés
│   ├── main.tsx                        # React belépési pont
│   └── index.css                       # Tailwind CSS & egyedi stílusok
├── index.html                          # HTML5 váz Google betűkészletekkel
├── vite.config.ts                      # Vite + Tailwind plugin konfiguráció
├── tsconfig.json                       # TypeScript konfiguráció
└── package.json                        # Projekt függőségek és scriptek
```

---

## 🚀 Telepítés és Helyi Futtatás

### Előfeltételek
- **Node.js** (v18 vagy újabb ajánlott)
- **npm** vagy **yarn** / **pnpm**

### Lépések

1. **Klónozd a tárolót vagy lépj a projekt könyvtárába**:
   ```bash
   cd fatebook
   ```

2. **Telepítsd a függőségeket**:
   ```bash
   npm install
   ```

3. **Indítsd el a fejlesztői szervert**:
   ```bash
   npm run dev
   ```
   Ezután nyisd meg a böngésződben a megjelenő címet (általában: `http://localhost:5173/`).

4. **Termelési build fordítása**:
   ```bash
   npm run build
   ```
   A lefordított, optimalizált fájlok a `dist/` mappába kerülnek.

---

## 📤 Feltöltés a GitHub-ra (Útmutató)

Kövesd az alábbi egyszerű lépéseket a projekt GitHub-ra való feltöltéséhez:

### 1. Hozz létre egy új tárolót (repository) a GitHub-on
- Menj a [github.com/new](https://github.com/new) oldalra.
- Adj nevet a tárolónak (pl. `fatebook`).
- Válaszd a **Public** vagy **Private** láthatóságot.
- **NE** pipáld be a „Initialize with README” vagy „.gitignore” opciót (mivel a projekt már tartalmazza ezeket).
- Kattints a **Create repository** gombra.

### 2. Távoli tároló hozzáadása és feltöltés

Nyisd meg a terminált a `fatebook` mappában, majd futtasd:

```bash
# Ha még nincs git inicializálva:
git init
git add .
git commit -m "feat: Initial release of FateBook application"

# Állítsd be a fő ágat main-re:
git branch -M main

# Add hozzá a GitHub tároló URL-jét (cseréld le a saját felhasználónevedre!):
git remote add origin https://github.com/FELHASZNALONEV/fatebook.git

# Töltsd fel a kódot a GitHub-ra:
git push -u origin main
```

---

## 🌐 Telepítés Render.com-ra (1-Kattintásos Üzembehelyezés)

A FateBook azonnal, díjmentesen publikálható a **[Render.com](https://render.com)** platformon az előre konfigurált `render.yaml` Blueprint segítségével:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/zsirafmix/fatebook)

### Kézi beállítás (Render Dashboard):
1. Lépj be a [dashboard.render.com](https://dashboard.render.com) oldalra.
2. Kattints a **New +** → **Static Site** gombra.
3. Csatlakoztasd a `zsirafmix/fatebook` GitHub tárolót.
4. Add meg a beállításokat:
   - **Name**: `fatebook`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Kattints a **Create Static Site** gombra.
6. A **Redirects/Rewrites** menüpontban adj hozzá egy SPA átirányítási szabályt:
   - `/*` → `/index.html` (Rewrite)
7. A Render lefordítja a kódot, és egy nyilvános, biztonságos HTTPS URL-en elindítja az alkalmazást (pl. `https://fatebook.onrender.com`).

---

## 📄 Licenc

Ez a projekt az **MIT Licenc** alatt érhető el – lásd a [LICENSE](LICENSE) fájlt a részletekért.

---

> **FateBook**: *„Minden ember élete egy megíratlan könyv. Mi segítünk megírni.”*
