# Secret Santa - Specifica Applicazione

## Panoramica
Applicazione React per gestire un Secret Santa tra amici.

## Tecnologie
- **Frontend**: React + Vite
- **Styling**: CSS Modules
- **State Management**: useState (stato locale) + Context API (stato globale) + useReducer (logica complessa)
- **Routing**: React Router (necessario per gestione multi-utente)
- **Backend**: Supabase (BaaS - Backend as a Service)
- **Database**: PostgreSQL (tramite Supabase)
- **Autenticazione**: 
  - **Admin**: Supabase Auth (username/password protetto)
  - **Partecipanti**: Codice evento + Codice partecipante (NOMECOGNOME)
- **API**: Auto-generate da Supabase (REST + real-time subscriptions)
- **Email**: Resend (per notifiche ripristino visualizzazione)
- **Deploy**: Vercel (hosting gratuito per siti pubblici)

## Funzionalità Principali

### 1. Gestione Partecipanti (Solo Admin)
- [x] **Pannello Admin** protetto da username/password
- [x] Aggiungere partecipanti (nome, cognome, email opzionale)
- [x] Rimuovere partecipanti
- [x] Modificare partecipanti
- [x] Visualizzare tutti gli abbinamenti (solo admin)
- [x] Numero minimo di partecipanti: 3

### 2. Configurazione Regole
- [x] **Pagina Regole/Info** visibile a tutti
- [x] Budget suggerito (modificabile da admin)
- [x] **Countdown** data apertura regali (modificabile da admin)
- [x] **Note/Istruzioni** personalizzabili da admin (es. "portare regalo incartato")
- [x] Editor admin per modificare regole e note
- [ ] Esclusioni/Restrizioni (es. coppie che non possono pescarsi) - feature futura
- [ ] Tema o categorie regalo (opzionale) - feature futura

### 3. Estrazione (Solo Admin)
- [x] **Pulsante estrazione** nel pannello admin
- [x] **Animazione natalizia** durante l'estrazione (fiocchi neve, effetti, suspense)
- [x] Algoritmo di assegnazione casuale
- [x] Rispetto delle esclusioni (feature futura)
- [x] **Visualizzazione abbinamenti admin**: toggle mostra/nascondi (default nascosto)
- [x] **Blur/Mascheramento** abbinamenti per proteggere admin da spoiler
- [x] Possibilità di ri-estrarre (conferma per sovrascrivere)

### 4. Notifiche/Condivisione
- [x] **Accesso con doppio codice**: Codice Evento + Codice Partecipante (NOMECOGNOME)
- [x] **Sito web interattivo** - interfaccia per inserire i codici e vedere l'abbinamento
- [x] **Visualizzazione una sola volta** - dopo aver visto, il partecipante non può più vedere (salvo reset admin)
- [x] **Warning chiaro** - messaggio "Potrai vedere l'abbinamento UNA SOLA VOLTA"
- [x] **Richiesta ripristino** - pulsante per inviare email notifica all'admin
- [x] **Admin riceve email** - notifica quando un partecipante chiede ripristino
- [x] **Admin può ripristinare** visualizzazioni dal pannello partecipanti
- [x] Condivisione codici da parte dell'organizzatore (copia/lista)
- [ ] QR Code per accesso rapido (opzionale)

### 5. Persistenza Dati
- [x] **Backend con database** - applicazione multi-utente accessibile sempre
- [ ] Cache locale per performance (opzionale)
- [ ] Esportazione/Importazione configurazione (JSON) - backup

## UI/UX

### Pagine/Sezioni

**LAYOUT GLOBALE:**
- **Pannello Regole** (collapsible/apribile) - sempre accessibile in tutte le pagine
  - Mostra: nome evento, budget, countdown, note/istruzioni
  - Visibile anche senza login

1. **Home Pubblica - Partecipanti**
   - Benvenuto al Secret Santa
   - **Campo 1**: Inserire codice evento
   - **Campo 2**: Inserire codice partecipante (NOMECOGNOME)
   - Link discreto per accesso admin in basso
   
2. **Dashboard Admin** (protetta - multi-pagina)
   
   **2.1 Selezione Evento** (prima schermata dopo login)
   - Lista eventi esistenti
   - Pulsante "Crea Nuovo Evento"
   - Selezione evento corrente su cui lavorare
   
   **2.2 Pagina Info & Regole** (dopo selezione evento)
   - Editor nome evento
   - Editor budget (min/max)
   - Editor countdown (data e ora apertura regali)
   - Editor regole/istruzioni (textarea)
   - **Codice evento** (generato automaticamente, visualizzato, copiabile)
   - Pulsante Salva modifiche
   
   **2.3 Pagina Partecipanti** (gestione completa)
   - Tabella partecipanti con colonne:
     - Nome
     - Cognome
     - Ruolo
     - Email
     - Codice (NOMECOGNOME) - editabile
     - Ha visualizzato? (Si/No + timestamp)
     - Azioni: Modifica / Elimina (con conferma) / Ripristina visualizzazione
   - Form aggiunta nuovo partecipante
   - Pulsante "Copia tutti i codici"
   
   **2.4 Pagina Estrazione**
   - Pulsante "Estrai Secret Santa" (disabilitato se < 3 partecipanti o già estratto)
   - Messaggio errore se condizioni non rispettate
   - Animazione natalizia durante estrazione
   - **Toggle "Mostra/Nascondi abbinamenti"** (default: nascosto)
   - Lista abbinamenti (se toggle attivo):
     - Chi → A chi
     - Blur/sfocatura attivabile per anti-spoiler
   
3. **Visualizzazione Partecipante** (dopo inserimento codici)
   
   **3.1 Prima della data apertura E prima visualizzazione**
   - Warning: "⚠️ Potrai vedere l'abbinamento UNA SOLA VOLTA!"
   - Pulsante "Rivela il mio Secret Santa"
   - Animazione reveal
   - Mostra: "Devi fare un regalo a: **NOME COGNOME**"
   
   **3.2 Prima della data apertura E già visualizzato**
   - Messaggio: "Hai già visualizzato il tuo abbinamento"
   - Pulsante "Richiedi Ripristino" → invia email all'admin
   - Conferma invio email
   
   **3.3 Dopo la data apertura** (per tutti)
   - **Lista completa di TUTTI gli abbinamenti**
   - Formato: Nome → Nome (per tutti i partecipanti)
   - Titolo: "🎄 Il Secret Santa è concluso! Ecco tutti gli abbinamenti:"

### Design
- [x] **Tema natalizio** - Classico rosso, verde, bianco, oro
- [x] **Animazioni**:
  - Fiocchi di neve in background
  - **Animazione speciale durante estrazione** (suspense, reveal drammatico)
  - Transizioni smooth tra pagine
- [x] **Elementi grafici**: Icone natalizie, illustrazioni babbo natale/regali
- [x] **Responsive**: Mobile-first design
- [x] **Tipografia**: Font festivi ma leggibili

## Flusso Utente

### Scenario 1: Admin/Organizzatore
1. Accede al pannello admin (username/password segreti)
2. **Seleziona evento esistente** o **crea nuovo evento**
3. Va su **Pagina Info & Regole**:
   - Imposta nome evento
   - Configura budget, data apertura regali, note/istruzioni
   - Copia **codice evento** (da condividere con partecipanti)
4. Va su **Pagina Partecipanti**:
   - Aggiunge partecipanti (nome, cognome, ruolo, email opzionale)
   - Sistema genera automaticamente codici NOMECOGNOME
   - Può modificare manualmente i codici se necessario
   - Copia lista codici
5. Va su **Pagina Estrazione**:
   - Clicca "Estrai Secret Santa" → **Animazione natalizia**
   - Può vedere abbinamenti attivando toggle (default nascosto)
   - Se vuole vedere, attiva "Mostra abbinamenti"
6. Condivide codice evento + codici partecipanti (WhatsApp, Telegram, etc.)
7. Riceve email se qualcuno richiede ripristino visualizzazione
8. Può ripristinare da **Pagina Partecipanti**

### Scenario 2: Partecipante (Prima della data apertura)
1. Riceve codice evento + codice personale dall'organizzatore
2. Va sul sito web dell'applicazione
3. **Apre pannello regole** (opzionale) - vede budget, countdown, istruzioni
4. Inserisce **codice evento**
5. Inserisce **codice partecipante** (NOMECOGNOME)
6. **WARNING CHIARO**: "⚠️ Potrai vedere il tuo Secret Santa UNA SOLA VOLTA! Assicurati di segnarti il nome."
7. Clicca "Rivela il mio Secret Santa"
8. **Animazione reveal** → vede a chi deve fare il regalo
9. **Sistema registra la visualizzazione** (`has_viewed = true`, `viewed_at = now()`)
10. Se torna dopo: vede "Hai già visualizzato" + pulsante "Richiedi Ripristino"
11. Se clicca ripristino: email inviata all'admin con notifica

### Scenario 3: Partecipante (Dopo la data apertura)
1. Inserisce codice evento + codice personale
2. Vede **lista completa di TUTTI gli abbinamenti**
3. Può vedere chi aveva pescato lui/lei
4. Pannello regole mostra "Evento concluso"

## Domande da Risolvere

### Tecnici
- [x] Serve backend: Sì (Supabase)
- [x] Privacy: 
  - Admin: autenticazione Supabase (username/password)
  - Partecipanti: doppio codice (evento + NOMECOGNOME)
  - **Abbinamenti mascherati nel DB** con hash/cifratura
- [x] Salvataggio dati: Persistente su database PostgreSQL
- [x] Generazione codici: 
  - **Codice evento**: slug da nome evento (es. FAMIGLIA2025)
  - **Codice partecipante**: NOMECOGNOME (uppercase, editabile)
- [x] Security: Row Level Security (RLS) su Supabase per proteggere dati
- [x] **Visualizzazione unica**: Flag `has_viewed` per tracciare chi ha visto l'abbinamento
- [x] **Admin anti-spoiler**: Toggle mostra/nascondi abbinamenti (default nascosto)
- [x] **Richieste ripristino**: Email all'admin tramite Resend
- [x] **Conferme eliminazione**: Dialog di conferma prima di eliminare (hard delete)
- [x] **Gestione post-evento**: Dopo data_apertura tutti vedono tutti gli abbinamenti

### Funzionali
- [ ] Lista desideri: i partecipanti possono inserire preferenze?
- [ ] Chat anonima tra regalatore e ricevente?
- [ ] Storia delle edizioni precedenti?
- [ ] Supporto multi-lingua?

### Design
- [ ] Stile minimalista o elaborato?
- [ ] Accessibilità (WCAG)?
- [ ] Stampa fisica dei risultati?

## MVP (Minimum Viable Product)
*Cosa includiamo nella prima versione?*

1. ✅ **Pannello Admin protetto**: login con username/password
2. ✅ **Gestione Eventi multipli**: 
   - Selezione evento da dashboard
   - Creazione nuovo evento
   - Generazione codice evento automatico
3. ✅ **Pagina Info & Regole** (Admin):
   - Nome evento
   - Codice evento (generato, visualizzato, copiabile)
   - Budget min/max
   - Data e ora apertura regali (countdown)
   - Note/istruzioni personalizzabili (textarea)
4. ✅ **Pagina Partecipanti** (Admin):
   - Tabella completa partecipanti
   - CRUD: aggiungere, modificare, eliminare (con conferma)
   - Codici NOMECOGNOME (auto-generati, editabili)
   - Visualizzazione stato: ha visto? quando?
   - Ripristina visualizzazione per singolo partecipante
   - Copia lista codici
5. ✅ **Pagina Estrazione** (Admin):
   - Pulsante estrazione (validazione >= 3 partecipanti)
   - Animazione natalizia
   - Toggle mostra/nascondi abbinamenti (default nascosto)
   - Lista abbinamenti con blur/sfocatura opzionale
6. ✅ **Accesso Partecipanti**:
   - Input codice evento
   - Input codice partecipante (NOMECOGNOME)
   - Validazione doppio codice
7. ✅ **Sistema visualizzazione controllata**:
   - **Prima data_apertura**:
     - Warning UNA SOLA VOLTA
     - Reveal animato abbinamento
     - Blocco dopo visualizzazione
     - Pulsante "Richiedi Ripristino" → email admin
   - **Dopo data_apertura**:
     - Visualizzazione TUTTI gli abbinamenti per tutti
8. ✅ **Pannello Regole globale**:
   - Apribile/collapsible in tutte le pagine
   - Mostra: nome evento, budget, countdown, note
   - Accessibile senza login
9. ✅ **Database Supabase**: 
    - Tabella events (con event_code, data_apertura)
    - Tabella participants (con has_viewed, viewed_at, access_code editabile)
    - Tabella assignments (abbinamenti mascherati)
    - Tabella reset_requests (richieste ripristino)
10. ✅ **Email Notifications**:
    - Resend per notifiche ripristino
    - Template email a admin
11. ✅ **Sicurezza e Validazioni**:
    - Abbinamenti cifrati nel database
    - RLS policies su Supabase
    - Conferme eliminazione (hard delete)
    - Gestione errori (codici sbagliati, < 3 partecipanti, etc.)
12. ✅ **Design natalizio**: tema rosso/verde/oro, fiocchi di neve, responsive
13. ✅ **Routing**: React Router per navigazione
14. ✅ **Deploy**: Vercel (sito pubblico gratuito)

## Funzionalità Future
*Da implementare dopo l'MVP*

- **Invio email automatico** con Resend (codici + notifiche)
- Gestione esclusioni/coppie (chi non può pescare chi)
- **Lista desideri** per ogni partecipante (visibile a chi lo pesca)
- Storico completo eventi passati con ricerca/filtri
- Budget tracking (quanto speso vs budget)
- Suggerimenti regalo AI-powered
- Chat anonima tra regalatore e ricevente
- Modalità dark mode
- Esportazione PDF dei codici/abbinamenti
- Statistiche (chi ha partecipato più volte, etc.)
- Multi-lingua (i18n)
- Temi personalizzabili (oltre natalizio: Halloween, compleanno, etc.)

## Note Tecniche

### Struttura Database (Supabase - PostgreSQL)

**Tabella `events` (Secret Santa multipli):**
```sql
- id (uuid, primary key, auto-generate)
- nome_evento (text, not null) - es. "Secret Santa Famiglia 2025"
- event_code (text, unique, not null) - codice evento (es. "FAMIGLIA2025")
- anno (integer, not null)
- budget_min (decimal, nullable)
- budget_max (decimal, nullable)
- data_apertura (timestamp, not null) - quando si aprono i regali e si vedono tutti gli abbinamenti
- regole_testo (text, nullable) - regole generali editabili
- note_admin (text, nullable) - note/istruzioni personalizzate
- is_active (boolean, default true) - evento attivo/archiviato
- extraction_done (boolean, default false) - estrazione completata
- created_at (timestamp, default now())
- updated_at (timestamp, default now())
```

**Tabella `participants`:**
```sql
- id (uuid, primary key, auto-generate)
- event_id (uuid, FK → events.id, ON DELETE CASCADE) - collega al Secret Santa
- nome (text, not null)
- cognome (text, not null)
- email (text, nullable)
- ruolo (text, nullable) - es. "amico", "famiglia", "collega", etc.
- access_code (text, not null) - NOMECOGNOME (editabile da admin)
- has_viewed (boolean, default false) - ha già visualizzato l'abbinamento
- viewed_at (timestamp, nullable) - quando ha visualizzato
- created_at (timestamp, default now())
- updated_at (timestamp, default now())
- UNIQUE(event_id, access_code) - codice unico per evento
```

**Note codici partecipanti:**
- Formato: **NOMECOGNOME** (tutto attaccato, uppercase)
- Esempio: Mario Rossi → `MARIOROSSI`
- Editabile dall'admin in caso di omonimi o preferenze


**Tabella `assignments`:**
```sql
- id (uuid, primary key, auto-generate)
- event_id (uuid, FK → events.id, ON DELETE CASCADE)
- giver_id (uuid, FK → participants.id) - chi fa il regalo
- receiver_id (uuid, FK → participants.id) - chi riceve
- receiver_name_hash (text, not null) - hash/cifratura del nome destinatario (sicurezza DB)
- created_at (timestamp, default now())
- UNIQUE(event_id, giver_id) - un partecipante fa un regalo per evento
```

**Tabella `reset_requests` (Richieste ripristino visualizzazione):**
```sql
- id (uuid, primary key, auto-generate)
- event_id (uuid, FK → events.id, ON DELETE CASCADE)
- participant_id (uuid, FK → participants.id, ON DELETE CASCADE)
- requested_at (timestamp, default now())
- is_resolved (boolean, default false) - admin ha gestito la richiesta
- resolved_at (timestamp, nullable)
```

**Note sicurezza:**
- Gli abbinamenti nel DB sono **mascherati con hash/cifratura**
- Solo quando necessario vengono decriptati client-side
- Admin vede abbinamenti **solo se attiva toggle "Mostra"**
- Partecipanti vedono abbinamento **UNA SOLA VOLTA** (flag `has_viewed`)
- **Dopo data_apertura**: tutti vedono TUTTI gli abbinamenti


**Autenticazione Admin:**
- Utilizzare Supabase Auth con email/password
- RLS (Row Level Security) per proteggere tabelle
- Policy: solo utenti autenticati possono modificare dati

**Email Notifications:**
- Servizio: Resend
- Template email per richieste ripristino visualizzazione
- Inviata a email admin configurata in Supabase

### Struttura Cartelle (proposta)
```
src/
  ├── components/
  │   ├── Admin/
  │   │   ├── AdminLogin/
  │   │   ├── EventSelector/
  │   │   ├── EventCreator/
  │   │   ├── InfoRulesEditor/
  │   │   ├── ParticipantsTable/
  │   │   ├── ParticipantForm/
  │   │   ├── ExtractionPage/
  │   │   ├── AssignmentsToggle/
  │   │   └── AssignmentsView/
  │   ├── Participant/
  │   │   ├── EventCodeInput/
  │   │   ├── ParticipantCodeInput/
  │   │   ├── ViewWarning/
  │   │   ├── ResultReveal/
  │   │   ├── AlreadyViewed/
  │   │   ├── ResetRequestButton/
  │   │   └── AllAssignmentsView/
  │   ├── Shared/
  │   │   ├── RulesPanel/
  │   │   ├── Countdown/
  │   │   ├── Snowflakes/
  │   │   ├── ChristmasAnimation/
  │   │   └── ConfirmDialog/
  ├── pages/
  │   ├── HomePage/
  │   ├── AdminDashboard/
  │   │   ├── EventSelectionPage/
  │   │   ├── InfoRulesPage/
  │   │   ├── ParticipantsPage/
  │   │   └── ExtractionPage/
  │   └── ParticipantView/
  ├── hooks/
  │   ├── useAuth.js
  │   ├── useSupabase.js
  │   ├── useCountdown.js
  │   └── useEventStatus.js
  ├── utils/
  │   ├── extractionAlgorithm.js
  │   ├── codeGenerator.js
  │   ├── encryption.js
  │   ├── emailService.js
  │   └── supabaseClient.js
  ├── context/
  │   ├── AuthContext.jsx
  │   └── EventContext.jsx
  ├── styles/
  │   └── globals.css
  ├── App.jsx
  └── main.jsx
```

### Algoritmo Estrazione
- **Fisher-Yates shuffle** per randomizzazione
- Validazione circolare (A→B→C→...→A) - nessuno fa regalo a se stesso
- **Controllo prerequisiti**:
  - Minimo 3 partecipanti
  - Estrazione non già effettuata (a meno di ri-estrazione con conferma)
- **Errori gestiti**:
  - < 3 partecipanti: pulsante disabilitato + tooltip "Servono almeno 3 partecipanti"
  - Estrazione già fatta: mostra conferma "Vuoi ri-estrarre? Gli abbinamenti precedenti saranno sovrascritti"
- Gestione casi impossibili (con esclusioni - feature futura)

### Gestione Date e Visualizzazioni
- **Prima di `data_apertura`**: 
  - Partecipanti vedono solo il proprio abbinamento (una volta)
  - Admin vede abbinamenti solo con toggle attivo
- **Dopo `data_apertura`**:
  - Tutti i partecipanti vedono TUTTI gli abbinamenti
  - Bypass del flag `has_viewed`
  - Messaggio "Evento concluso"

### Gestione Errori e Validazioni
- **Codice evento sbagliato**: "Codice evento non valido"
- **Codice partecipante sbagliato**: "Codice partecipante non trovato per questo evento"
- **Estrazione non ancora fatta**: "L'estrazione non è ancora avvenuta, contatta l'organizzatore"
- **Eliminazione partecipante/evento**: Dialog di conferma "Sei sicuro? Questa azione è irreversibile"
- **Codici duplicati**: Validazione su frontend + backend (constraint DB)

## Timeline
- **Setup progetto**: 1-2 ore (Vite + React + routing base)
- **Setup Supabase**: 2-3 ore (database, tabelle, RLS policies, auth)
- **Setup Resend**: 30 min - 1 ora (account, template email)
- **Sviluppo MVP**: 
  - Admin dashboard: 6-8 ore
  - Sistema autenticazione: 2-3 ore
  - Pagine partecipanti: 4-6 ore
  - Algoritmo estrazione: 2-3 ore
  - Animazioni e design: 4-6 ore
  - Testing e bug fixing: 3-4 ore
  - **Totale stimato**: 24-35 ore
- **Deploy**: 1 ora (Vercel setup + configurazione env variables)

**Totale progetto completo**: ~30-40 ore

---

## Modifiche e Decisioni
*Sezione per tracciare le decisioni prese durante la pianificazione*

### ✅ Decisioni Finali (22 Nov 2025)

1. **Autenticazione Partecipanti**: Doppio codice (evento + NOMECOGNOME)
2. **Codice Partecipante**: Formato NOMECOGNOME (uppercase, editabile da admin)
3. **Pannello Regole**: Globale, apribile, accessibile sempre (anche senza login)
4. **Dashboard Admin**: Multi-pagina (Selezione Eventi / Info & Regole / Partecipanti / Estrazione)
5. **Visualizzazione Post-Evento**: Dopo data_apertura TUTTI vedono TUTTI gli abbinamenti
6. **Richieste Ripristino**: Pulsante partecipante → email admin via Resend
7. **Eliminazione**: Hard delete con conferma (no soft delete, no esportazione)
8. **Estrazione Bloccata**: Se < 3 partecipanti → pulsante disabilitato + errore
9. **Deploy**: Vercel (hosting gratuito per sito pubblico)
10. **Codice Evento**: Generato automaticamente da nome evento (es. FAMIGLIA2025)
