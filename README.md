# 🎅 Secret Santa Application

Un'applicazione web React per gestire un Secret Santa tra amici, con gestione amministrativa e accesso partecipanti tramite codici univoci.

## 📋 Panoramica

Questa applicazione permette di:
- **Organizzare** eventi Secret Santa multipli
- **Gestire** partecipanti e regole dell'evento
- **Estrarre** automaticamente gli abbinamenti con algoritmo casuale
- **Permettere ai partecipanti** di visualizzare il loro abbinamento in modo sicuro
- **Rivelare automaticamente** tutti gli abbinamenti dopo la data di apertura regali

## 🚀 Tecnologie Utilizzate

- **Frontend**: React + Vite
- **Styling**: CSS Modules
- **State Management**: useState + Context API + useReducer
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL)
- **Autenticazione**: 
  - Admin: Supabase Auth (username/password)
  - Partecipanti: Doppio codice (Codice Evento + Codice Partecipante)
- **Email**: Resend (notifiche ripristino)
- **Deploy**: Vercel

## ✨ Funzionalità Principali

### Per l'Amministratore
- ✅ Pannello admin protetto con autenticazione
- ✅ Gestione eventi multipli
- ✅ Configurazione regole, budget e countdown
- ✅ CRUD partecipanti (aggiungi, modifica, elimina)
- ✅ Estrazione automatica con animazione natalizia
- ✅ Visualizzazione abbinamenti (opzionale, con toggle)
- ✅ Ripristino visualizzazioni per partecipanti
- ✅ Ricezione email per richieste ripristino

### Per i Partecipanti
- ✅ Accesso tramite doppio codice (Evento + Partecipante)
- ✅ Visualizzazione abbinamento **UNA SOLA VOLTA** (prima dell'apertura)
- ✅ Richiesta ripristino via email all'admin
- ✅ Visualizzazione completa di tutti gli abbinamenti dopo la data di apertura
- ✅ Pannello regole globale sempre accessibile

### Design & UX
- 🎄 Tema natalizio (rosso, verde, bianco, oro)
- ❄️ Animazioni natalizie (fiocchi di neve, effetti reveal)
- 📱 Design responsive mobile-first
- ⏱️ Countdown dinamico per apertura regali

## 📂 Struttura Progetto

```
src/
  ├── components/          # Componenti React
  │   ├── Admin/          # Componenti pannello admin
  │   ├── Participant/    # Componenti vista partecipante
  │   └── Shared/         # Componenti condivisi
  ├── pages/              # Pagine principali
  ├── hooks/              # Custom React hooks
  ├── utils/              # Utilities (algoritmi, encryption, ecc.)
  ├── context/            # Context API providers
  └── styles/             # CSS globali e modules
```

## 🗄️ Database (Supabase)

### Tabelle Principali
- **events**: Eventi Secret Santa con configurazione
- **participants**: Partecipanti per ogni evento
- **assignments**: Abbinamenti cifrati
- **reset_requests**: Richieste di ripristino visualizzazione

## 🔐 Sicurezza

- Row Level Security (RLS) su Supabase
- Abbinamenti mascherati con hash/cifratura nel database
- Codici partecipante editabili e univoci per evento
- Conferme per operazioni distruttive (eliminazioni)

## 📅 MVP (Minimum Viable Product)

Il progetto è attualmente in fase di sviluppo. Le funzionalità dell'MVP includono:
- Gestione completa eventi e partecipanti
- Sistema di estrazione con validazioni
- Accesso sicuro per partecipanti
- Visualizzazione controllata (una volta)
- Sistema ripristino via email
- Design natalizio responsive

## 🚧 Funzionalità Future

- Invio email automatico con codici
- Gestione esclusioni/coppie
- Lista desideri per partecipanti
- Storico eventi passati
- Chat anonima tra regalatore e ricevente
- Multi-lingua (i18n)
- Temi personalizzabili

## 👨‍💻 Sviluppo

### Prerequisiti
- Node.js (v18+)
- Account Supabase
- Account Resend (per email)

### Setup Locale
```bash
# Installazione dipendenze
npm install

# Configurazione variabili d'ambiente
cp .env.example .env
# Modifica .env con le tue credenziali Supabase e Resend

# Avvio development server
npm run dev
```

### Build Produzione
```bash
npm run build
npm run preview
```

## 📦 Deploy

L'applicazione è configurata per il deploy su Vercel:
```bash
# Deploy automatico collegando il repository GitHub a Vercel
# oppure
vercel deploy
```

## 📄 Licenza

Questo progetto è stato creato per uso personale.

## 🎁 Contributi

Contributi, issues e feature requests sono benvenuti!

---

**Buon Secret Santa! 🎅🎄**
