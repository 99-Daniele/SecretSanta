# 📝 Changelog

## [1.2.0] - 2025-11-22

### 🐛 Bug Fixes Critici

#### Visualizzazione Partecipante
- **Fix**: Blocco accesso se estrazione non ancora effettuata
  - Controllo `extraction_done` flag prima di mostrare abbinamento
  - Messaggio chiaro: "Estrazione non ancora effettuata"
  - Link per tornare alla home

- **Fix**: Sistema conferma "Ho capito" dopo reveal
  - Nome visibile solo PRIMA del click su "Ho capito"
  - Dopo click: nome nascosto + `has_viewed=true` + `viewed_at=timestamp`
  - Schermata cambia mostrando "Hai già visualizzato"
  - Migliore controllo del flusso di visualizzazione

### ✨ Miglioramenti UX

#### Pannello Info/Regole/Istruzioni
- **Nuovo**: Sistema accordion con 3 sezioni distinte
  - **Info Evento**: Budget, anno, data apertura
  - **Regole**: Testo regole personalizzabile
  - **Istruzioni**: Note admin personalizzabili
- **Animazioni**: Pop-in/pop-out smooth per ogni sezione
- **UX**: Click per espandere/collassare, una sezione alla volta
- **Rimosso**: Countdown dal pannello (spostato in barra top)

#### CountdownBar Component
- **Nuovo**: Barra countdown sempre visibile
  - Fixed top, sempre presente
  - Mostra nome evento + countdown in tempo reale
  - Design elegante con sfondo navy
  - Responsive con layout adattivo mobile

### 🎨 Redesign Completo

#### Nuova Palette Colori Professionale
**Prima** (Christmas theme):
- Rosso: #c41e3a / Verde: #165b33
- **Problema**: Clash visivo rosso/verde, poco professionale

**Dopo** (Elegant theme):
- Primary: Navy (#2c3e50, #1a2332)
- Accent: Burgundy/Wine (#8b4049, #a85860)
- Neutral: Grigi eleganti
- **Risultato**: Contrasto migliore, più sofisticato

#### Emoji Ridotte
- HomePage: 1 icona regalo in cerchio (da 🎅 grande)
- EventSelector: Minimal (da ➕🎄🎁📅🎯✓○🎲⏳)
- Admin: Rimosso emoji superflue
- Focus su design pulito e professionale

#### Componenti Aggiornati
1. **globals.css**:
   - CSS variables con nuova palette
   - Shadows professionali (sm/md/lg/xl)
   - Transitions standardizzate
   - Scrollbar personalizzata burgundy

2. **HomePage**:
   - Icona regalo in cerchio burgundy
   - Background navy gradient
   - Pulsante "Accedi" senza emoji
   - Input con bordi neutral-light
   - Design più pulito e professionale

3. **EventSelector**:
   - Cards con bordo subtle
   - Hover con accent-rose
   - Chips colori semantici:
     * Verde: Attivo
     * Rosso: Archiviato
     * Blu: Estratto
     * Giallo: Da estrarre
   - Emoji ridotte drasticamente

4. **RulesPanel**:
   - Header navy gradient
   - Accordion headers con hover
   - Accent burgundy per sezione attiva
   - Border-left burgundy per contenuti

### 📝 Modifiche ai File

**Modificati:**
- `src/styles/globals.css` - Nuova palette CSS variables
- `src/pages/HomePage/HomePage.jsx` - Redesign con nuovi colori
- `src/pages/ParticipantView/ParticipantView.jsx` - Bug fixes + import CountdownBar
- `src/components/Shared/RulesPanel.jsx` - Sistema accordion
- `src/components/Shared/RulesPanel.module.css` - Stili accordion + nuovi colori
- `src/components/Admin/EventSelector/EventSelector.jsx` - Emoji ridotte
- `src/components/Admin/EventSelector/EventSelector.module.css` - Nuova palette

**Nuovi:**
- `src/components/Shared/CountdownBar.jsx` - Componente countdown top bar
- `src/components/Shared/CountdownBar.module.css` - Stili countdown bar

**Documentazione:**
- `SECRET_SANTA_SPEC.md` - Aggiornato con tutte le modifiche
- `CHANGELOG.md` - Questo file

### 🎯 Impatto

**Performance:**
- Emoji ridotte → bundle più leggero
- Animazioni ottimizzate con CSS

**Accessibilità:**
- Contrasti migliori (navy/burgundy vs rosso/verde)
- Focus outline più visibili
- Testi più leggibili

**UX:**
- Flusso partecipante più chiaro
- Informazioni meglio organizzate (accordion)
- Countdown sempre visibile
- Design più professionale

---

## [Unreleased]

### ✨ Miglioramenti UI

#### Chips di stato nella selezione eventi
- **EventSelector**: Aggiunte chips visibili per lo stato dell'evento
  - **Chip Attivo/Archiviato**: Verde per eventi attivi, rosso per archiviati
  - **Chip Estrazione**: Blu se già estratto, giallo se ancora da estrarre
  - Design migliorato con emoji e bordi colorati
  - Sempre visibile (non più condizionale)
- **Layout migliorato**: Chips in una sezione dedicata sopra i metadati
- **Colori distintivi**:
  - ✓ Attivo: verde (#d4edda)
  - ○ Archiviato: rosso (#f8d7da)
  - 🎲 Estrazione fatta: blu (#d1ecf1)
  - ⏳ Da estrarre: giallo (#fff3cd)

### 📝 Modifiche ai File

1. **src/components/Admin/EventSelector/EventSelector.jsx**
   - Creata sezione `.chips` dedicata
   - Chip "Estrazione" sempre visibile (prima solo se estratto)
   - Testo migliorato con emoji
   - Rimossi vecchi status dal `.eventMeta`

2. **src/components/Admin/EventSelector/EventSelector.module.css**
   - Aggiunte classi `.chips`, `.chip`, `.chipActive`, `.chipInactive`, `.chipExtracted`, `.chipNotExtracted`
   - Rimosse vecchie classi `.status*` non più utilizzate
   - Aggiunto separatore tra chips e metadati (border-top)
   - Design più moderno con bordi colorati

### 🎯 Obiettivo

Rendere immediatamente visibile lo stato dell'estrazione nella lista eventi, permettendo all'admin di sapere a colpo d'occhio quali eventi hanno già l'estrazione fatta.

---

## [1.1.0] - 2025-11-22

### ✨ Nuove Funzionalità

#### Regole e Note predefinite in Italiano
- **EventCreator**: Aggiunte regole e note di default in italiano quando si crea un nuovo evento
- **InfoRulesEditor**: Le regole e note esistono già precompilate in italiano quando si modifica un evento
- I testi predefiniti includono:
  - 🎁 Regole complete del Secret Santa (6 punti + note importanti)
  - 🎄 Istruzioni dettagliate per i partecipanti
- **Completamente personalizzabili**: l'admin può modificare liberamente i testi
- **Sempre presenti**: non ci sono più campi vuoti, garantendo una guida chiara per tutti

#### Testi Predefiniti

**Regole Default:**
```
🎁 REGOLE DEL SECRET SANTA

1. Ogni partecipante dovrà fare un regalo a una persona estratta casualmente
2. Il budget consigliato è indicato sopra - cerchiamo di rispettarlo!
3. Il regalo deve essere avvolto in carta natalizia
4. Non rivelare a nessuno chi hai pescato - mantieni il segreto!
5. Porta il regalo all'evento indicato nella data di apertura
6. Divertiti e sii creativo con il tuo regalo! 🎅

📝 NOTE IMPORTANTI:
- Dopo aver visto il tuo abbinamento, potrai visualizzarlo UNA SOLA VOLTA
- Se hai bisogno di rivederlo, usa il pulsante "Richiedi Ripristino"
- Dopo la data di apertura, tutti potranno vedere tutti gli abbinamenti
```

**Note Default:**
```
🎄 ISTRUZIONI PER I PARTECIPANTI

• Accedi con il codice evento e il tuo codice personale
• Leggi attentamente il nome della persona a cui farai il regalo
• Segnatelo subito - potrai vederlo solo una volta!
• Acquista un regalo pensato e creativo
• Incartalo con cura
• Portalo alla festa!

Ci vediamo alla festa! 🎅✨
```

### 📝 Modifiche ai File

1. **SECRET_SANTA_SPEC.md**
   - Aggiunta sezione con testi default
   - Documentato comportamento regole predefinite

2. **src/components/Admin/EventCreator/EventCreator.jsx**
   - Aggiunte costanti `DEFAULT_REGOLE` e `DEFAULT_NOTE`
   - State inizializzato con testi predefiniti
   - Aggiunti attributo `rows` ai textarea (10 e 8)
   - Aggiunti helper text sotto i campi

3. **src/components/Admin/InfoRulesEditor/InfoRulesEditor.jsx**
   - Aggiunte costanti `DEFAULT_REGOLE` e `DEFAULT_NOTE`
   - Fallback ai testi default se campi vuoti nel DB
   - Aumentate righe textarea (10 e 8)
   - Aggiunte label esplicative "(testo predefinito in italiano)"
   - Aggiunti helper text sotto i campi

4. **README.md**
   - Aggiunta feature nelle "Main Features"
   - Evidenziato supporto italiano predefinito

### 🎯 Obiettivo

Garantire che ogni nuovo evento Secret Santa abbia sempre:
- ✅ Regole chiare e complete in italiano
- ✅ Istruzioni dettagliate per i partecipanti
- ✅ Nessun campo vuoto che richieda di scrivere tutto da zero
- ✅ Flessibilità totale per personalizzare i testi

### 🔧 Impatto Tecnico

- Nessuna breaking change
- Backward compatible (eventi esistenti non modificati)
- Solo miglioramento UX per nuovi eventi
- Dimensione bundle: +~500 bytes (stringhe costanti)

---

## [1.0.0] - 2025-11-22

### 🎉 Release Iniziale

- Implementazione completa MVP Secret Santa
- Tutte le funzionalità da specifica implementate
- Pronto per il deployment

