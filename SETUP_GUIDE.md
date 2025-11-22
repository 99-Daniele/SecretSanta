# 🎅 Secret Santa Application - Setup & Deployment Guide

## 📋 Overview

Applicazione React completa per gestire Secret Santa tra amici e famiglia.

## 🚀 Quick Start

### 1. Prerequisiti

- Node.js v18+
- Account Supabase (gratuito)
- Account Resend (gratuito per 100 email/giorno)
- Account Vercel (opzionale, per deploy)

### 2. Installazione

```bash
# Clone repository
git clone https://github.com/your-username/SecretSanta.git
cd SecretSanta

# Installa dipendenze
npm install

# Copia file ambiente
cp .env.example .env
```

### 3. Configurazione Supabase

1. **Crea progetto su Supabase**
   - Vai su https://supabase.com
   - Crea nuovo progetto
   - Copia URL e Anon Key

2. **Esegui SQL Setup**
   - Apri SQL Editor in Supabase Dashboard
   - Copia e incolla tutto il contenuto di `SUPABASE_SETUP.md`
   - Esegui

3. **Crea utente Admin**
   - Dashboard > Authentication > Users
   - "Add User" > inserisci email e password admin
   - Salva

4. **Aggiorna .env**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Configurazione Resend (Email)

1. **Crea account su Resend**
   - Vai su https://resend.com
   - Crea account gratuito
   - Genera API Key

2. **Aggiorna .env**
   ```
   VITE_RESEND_API_KEY=re_your_api_key
   VITE_ADMIN_EMAIL=your-admin@email.com
   ```

### 5. Configura Encryption Key

```bash
# Genera chiave casuale di 32 caratteri
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Aggiungi a `.env`:
```
VITE_ENCRYPTION_KEY=your-32-char-key
```

### 6. Avvia in locale

```bash
npm run dev
```

Apri http://localhost:5173

## 🌐 Deploy su Vercel

### Metodo 1: Automatic (Consigliato)

1. Pusha codice su GitHub
2. Vai su https://vercel.com
3. "Import Project" > seleziona repo
4. Configura variabili ambiente (vedi sotto)
5. Deploy!

### Metodo 2: CLI

```bash
# Installa Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy in produzione
vercel --prod
```

### Variabili Ambiente Vercel

Nel dashboard Vercel > Settings > Environment Variables, aggiungi:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_RESEND_API_KEY=your-resend-api-key
VITE_ADMIN_EMAIL=admin@example.com
VITE_ENCRYPTION_KEY=your-32-char-encryption-key
```

## 📚 Utilizzo

### Admin Flow

1. **Login Admin**
   - Vai su `/admin/login`
   - Inserisci credenziali Supabase

2. **Crea Evento**
   - Dashboard > "Crea Nuovo Evento"
   - Compila form (nome, budget, data apertura, regole)
   - Codice evento generato automaticamente

3. **Aggiungi Partecipanti**
   - Tab "Partecipanti"
   - Aggiungi nome, cognome, email (opzionale)
   - Codici generati automaticamente (NOMECOGNOME)
   - Copia tutti i codici

4. **Estrazione**
   - Tab "Estrazione"
   - Click "Estrai Secret Santa"
   - Animazione natalizia
   - Opzionale: mostra abbinamenti

5. **Condividi Codici**
   - Condividi codice evento + codici partecipanti
   - Via WhatsApp, email, etc.

### Participant Flow

1. **Accesso**
   - Home page
   - Inserisci codice evento + codice personale

2. **Visualizzazione**
   - **Prima data apertura**: vede UNA SOLA VOLTA il suo abbinamento
   - **Dopo data apertura**: vede TUTTI gli abbinamenti

3. **Ripristino (opzionale)**
   - Se già visualizzato, può richiedere ripristino
   - Admin riceve email
   - Admin ripristina da dashboard

## 🛠️ Struttura Progetto

```
src/
├── components/
│   ├── Admin/           # Componenti admin
│   ├── Participant/     # Componenti partecipanti (inline)
│   └── Shared/          # Componenti condivisi
├── pages/
│   ├── HomePage/        # Landing page partecipanti
│   ├── AdminDashboard/  # Layout dashboard admin
│   └── ParticipantView/ # Vista partecipante
├── context/
│   ├── AuthContext.jsx  # Autenticazione
│   └── EventContext.jsx # Gestione eventi
├── hooks/               # Custom React hooks
├── utils/               # Utilities (encryption, email, etc.)
├── styles/              # CSS globali
└── App.jsx              # Router principale
```

## 🔐 Sicurezza

- **RLS (Row Level Security)** su Supabase
- **Abbinamenti cifrati** nel database
- **Codici unici** per evento e partecipante
- **Autenticazione** Supabase per admin
- **Validazioni** lato client e server

## 🐛 Troubleshooting

### Errore "Supabase URL missing"
- Verifica `.env` configurato correttamente
- Riavvia dev server dopo modifiche `.env`

### Errore autenticazione admin
- Verifica utente creato in Supabase Dashboard
- Controlla email/password corrette

### Estrazione non funziona
- Verifica minimo 3 partecipanti
- Controlla console per errori SQL
- Verifica RLS policies attive

### Email non arrivano
- Verifica RESEND_API_KEY corretto
- Controlla ADMIN_EMAIL configurato
- Piano gratuito: max 100 email/giorno

## 📄 License

MIT - Progetto personale

## 🎁 Credits

Creato con:
- React + Vite
- Supabase (Database + Auth)
- React Router
- Resend (Email)
- Vercel (Deploy)

---

**Buon Secret Santa! 🎅🎄**
