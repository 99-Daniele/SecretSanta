# 📊 TopBar Component Documentation

## Overview

Il **TopBar** è un componente unificato che sostituisce i 3 componenti separati precedenti (ThemeToggle, CountdownBar, RulesPanel) con una barra di navigazione professionale sempre visibile in cima alla pagina.

## Struttura

```
┌──────────────────────────────────────────────────────────────┐
│ [Event Name] [🌙]  │  [⏱ Countdown]  │  [ℹ️ Info] [👤 User] │
│   (left section)    │ (center section) │   (right section)   │
└──────────────────────────────────────────────────────────────┘
```

### Sezioni

#### Left Section
- **Event Name**: Nome dell'evento in grassetto
- **Theme Toggle**: Pulsante sole/luna per switch light/dark mode

#### Center Section
- **Countdown**: Timer in tempo reale con giorni:ore:min:sec
- Integra `CountdownBar` con `showEventName={false}`

#### Right Section
- **Info Button**: Bottone bianco con bordo rosso per aprire RulesPanel
- **User Menu**: Avatar con iniziali + dropdown menu
  - Avatar circolare con gradient rosso
  - Dropdown con nome completo, email, logout

## Props

```jsx
<TopBar 
  eventName={string}      // Nome evento da mostrare
  targetDate={string}     // Data apertura per countdown
  event={object}          // Oggetto evento completo per RulesPanel
  participant={object}    // Oggetto partecipante per user menu
/>
```

## Utilizzo

```jsx
import TopBar from '../../components/Shared/TopBar';

// In ParticipantView
<TopBar 
  eventName={event.nome_evento} 
  targetDate={event.data_apertura} 
  event={event}
  participant={participant}
/>
```

## Responsive Design

### Desktop (>768px)
- 3 sezioni affiancate con `display: flex`
- Ogni sezione con `flex: 1` per distribuzione equa
- Info button e user menu side-by-side

### Mobile (≤768px)
- TopBar wraps a 3 righe:
  1. **Riga 1**: Left section (event name + theme toggle)
  2. **Riga 2**: Right section (info button + user menu)
  3. **Riga 3**: Center section (countdown full-width)
- Layout ottimizzato con `flex-wrap: wrap`
- Riordinamento con `order` CSS

## Stili Principali

### TopBar Container
```css
.topBar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-bottom: 2px solid var(--border-color);
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}
```

### Info Button (White with Red Border)
```css
.infoButton {
  background: #ffffff;
  color: #dc3545; /* var(--accent-red) */
  border: 2px solid #dc3545;
}

.infoButton:hover {
  background: #dc3545;
  color: #ffffff;
}
```

### User Avatar
```css
.userAvatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  /* Mostra iniziali (es. "MR") */
}
```

### Dropdown Menu
```css
.userDropdown {
  position: absolute;
  right: 0;
  top: 50px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  animation: slideDown 0.2s ease-out;
}
```

## Features

### Theme Switching
- Click sul bottone sole/luna
- Aggiorna `data-theme` attribute su `<html>`
- Salva preferenza in localStorage
- CSS variables si aggiornano automaticamente

### User Menu Dropdown
- Click su avatar apre/chiude dropdown
- Click fuori dal dropdown lo chiude (click-outside)
- Mostra nome completo, email, logout button
- Animazione slideDown

### RulesPanel Integration
- Click su Info button apre RulesPanel
- RulesPanel gestito in controlled mode con state locale
- Close button nel RulesPanel chiude il pannello

### Countdown Real-time
- Aggiornamento ogni secondo via `useCountdown` hook
- Formato: `XX giorni : XX ore : XX min : XX sec`
- Mostra "Evento concluso" se data passata

## Dipendenze

### Componenti
- `CountdownBar` (con prop `showEventName`)
- `RulesPanel` (con props `isOpen`, `onClose`)
- `ThemeContext` (per theme toggle)

### Hooks
- `useState` - per state management locale
- `useContext` - per ThemeContext
- `useCountdown` - per countdown timer (via CountdownBar)

## CSS Variables Utilizzate

```css
/* Colors */
--bg-primary
--text-primary
--text-secondary
--accent-red
--border-color

/* Spacing & Layout */
--border-radius-md
--shadow-sm
--transition-normal

/* Responsive */
@media (max-width: 768px)
```

## Migrazione da Componenti Separati

### Prima (v1.3)
```jsx
<ThemeToggle />
<CountdownBar targetDate={date} eventName={name} />
<RulesPanel event={event} />
```

### Dopo (v1.4)
```jsx
<TopBar 
  eventName={name}
  targetDate={date}
  event={event}
  participant={participant}
/>
```

### Benefici
- ✅ Codice più pulito e manutenibile
- ✅ UI più coerente e professionale
- ✅ Meno componenti da importare
- ✅ Layout responsivo già gestito
- ✅ User menu integrato

## Z-index Hierarchy

```
TopBar: 1000
RulesPanel: 999 (aperto dal TopBar)
CountdownBar: 900 (deprecato - ora inline in TopBar)
```

## Accessibility

- **Keyboard navigation**: Focus visibile su tutti i button
- **ARIA labels**: "Chiudi", "Theme toggle", etc.
- **Tap targets**: Minimo 44px per mobile
- **Contrast**: WCAG AA compliant
- **Screen readers**: Testi descrittivi

## Performance

- **Re-render**: Solo quando props cambiano
- **Countdown**: Optimized con useMemo in useCountdown hook
- **Dropdown**: Render condizionale (solo quando aperto)
- **CSS**: Hardware-accelerated animations

## Testing

### Test Cases
1. ✅ TopBar renders con tutti i props
2. ✅ Theme toggle funziona
3. ✅ Countdown si aggiorna ogni secondo
4. ✅ Info button apre RulesPanel
5. ✅ User menu dropdown apre/chiude
6. ✅ Click fuori dropdown lo chiude
7. ✅ Logout redirect funziona
8. ✅ Responsive su mobile (3 righe)
9. ✅ Avatar mostra iniziali corrette
10. ✅ Dark mode applica stili corretti

## Future Improvements

- [ ] Notifiche badge su avatar (es. richieste reset)
- [ ] Breadcrumb navigation in center section
- [ ] Multi-language support
- [ ] Admin variant con diverse opzioni menu
- [ ] Search bar integrata per admin
- [ ] Shortcuts keyboard (es. Ctrl+K per search)
