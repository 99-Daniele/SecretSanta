# 📝 Changelog

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

