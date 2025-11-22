import { useState, useEffect } from 'react';
import { useEvent } from '../../../context/EventContext';
import { generateEventCode } from '../../../utils/codeGenerator';
import styles from './InfoRulesEditor.module.css';

const DEFAULT_REGOLE = `🎁 REGOLE DEL SECRET SANTA

1. Ogni partecipante dovrà fare un regalo a una persona estratta casualmente
2. Il budget consigliato è indicato sopra - cerchiamo di rispettarlo!
3. Il regalo deve essere avvolto in carta natalizia
4. Non rivelare a nessuno chi hai pescato - mantieni il segreto!
5. Porta il regalo all'evento indicato nella data di apertura
6. Divertiti e sii creativo con il tuo regalo! 🎅

📝 NOTE IMPORTANTI:
- Dopo aver visto il tuo abbinamento, potrai visualizzarlo UNA SOLA VOLTA
- Se hai bisogno di rivederlo, usa il pulsante "Richiedi Ripristino"
- Dopo la data di apertura, tutti potranno vedere tutti gli abbinamenti`;

const DEFAULT_NOTE = `🎄 ISTRUZIONI PER I PARTECIPANTI

• Accedi con il codice evento e il tuo codice personale
• Leggi attentamente il nome della persona a cui farai il regalo
• Segnatelo subito - potrai vederlo solo una volta!
• Acquista un regalo pensato e creativo
• Incartalo con cura
• Portalo alla festa!

Ci vediamo alla festa! 🎅✨`;

const InfoRulesEditor = () => {
  const { currentEvent, updateEvent } = useEvent();
  const [formData, setFormData] = useState({
    nome_evento: '',
    event_code: '',
    anno: new Date().getFullYear(),
    budget_min: '',
    budget_max: '',
    data_apertura: '',
    regole_testo: DEFAULT_REGOLE,
    note_admin: DEFAULT_NOTE,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!currentEvent) return;
    // defer state update to avoid calling setState synchronously in effect
    const t = setTimeout(() => {
      setFormData({
        nome_evento: currentEvent.nome_evento || '',
        event_code: currentEvent.event_code || '',
        anno: currentEvent.anno || new Date().getFullYear(),
        budget_min: currentEvent.budget_min || '',
        budget_max: currentEvent.budget_max || '',
        data_apertura: currentEvent.data_apertura ? new Date(currentEvent.data_apertura).toISOString().slice(0, 16) : '',
        regole_testo: currentEvent.regole_testo || DEFAULT_REGOLE,
        note_admin: currentEvent.note_admin || DEFAULT_NOTE,
      });
    }, 0);
    return () => clearTimeout(t);
  }, [currentEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'nome_evento' && !updated.event_code) {
        updated.event_code = generateEventCode(value);
      }
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const updates = {
      nome_evento: formData.nome_evento,
      event_code: formData.event_code,
      anno: parseInt(formData.anno),
      budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
      budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
      data_apertura: formData.data_apertura,
      regole_testo: formData.regole_testo || null,
      note_admin: formData.note_admin || null,
    };

    const { error } = await updateEvent(currentEvent.id, updates);

    if (error) {
      setMessage('❌ Errore durante il salvataggio');
    } else {
      setMessage('✅ Salvato con successo!');
      setTimeout(() => setMessage(''), 3000);
    }

    setIsSaving(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(formData.event_code);
    setMessage('📋 Codice copiato!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📋 Info & Regole Evento</h1>

      <form onSubmit={handleSave} className={styles.form}>
        <div>
          <label className={styles.fieldLabel}>
            Nome Evento *
          </label>
          <input
            name="nome_evento"
            value={formData.nome_evento}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div>
          <label className={styles.fieldLabel}>
            Codice Evento
          </label>
          <div className={styles.flexRow}>
            <input
              name="event_code"
              value={formData.event_code}
              onChange={handleChange}
              className={`${styles.input} ${styles.monoInput} ${styles.flexGrow}`}
            />
            <button type="button" onClick={copyCode} className={styles.copyBtn}>
              📋 Copia
            </button>
          </div>
          <small className={styles.smallNote}>
            I partecipanti useranno questo codice per accedere
          </small>
        </div>

        <div className={styles.grid3}>
          <div>
            <label className={styles.fieldLabel}>Anno</label>
            <input name="anno" type="number" value={formData.anno} onChange={handleChange} className={styles.input} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Budget Min (€)</label>
            <input name="budget_min" type="number" step="0.01" value={formData.budget_min} onChange={handleChange} className={styles.input} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Budget Max (€)</label>
            <input name="budget_max" type="number" step="0.01" value={formData.budget_max} onChange={handleChange} className={styles.input} />
          </div>
        </div>

        <div>
          <label className={styles.fieldLabel}>
            Data e Ora Apertura Regali *
          </label>
          <input
            name="data_apertura"
            type="datetime-local"
            value={formData.data_apertura}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div>
          <label className={styles.fieldLabel}>
            Regole
          </label>
          <textarea
            name="regole_testo"
            value={formData.regole_testo}
            onChange={handleChange}
            rows="10"
            className={styles.textarea}
          />
          <small className={styles.smallNote}>
            Puoi modificare liberamente il testo delle regole
          </small>
        </div>

        <div>
          <label className={styles.fieldLabel}>
            Note / Istruzioni
          </label>
          <textarea
            name="note_admin"
            value={formData.note_admin}
            onChange={handleChange}
            rows="8"
            className={styles.textarea}
          />
          <small className={styles.smallNote}>
            Puoi personalizzare le istruzioni per i partecipanti
          </small>
        </div>

        {message && (
          <div className={message.includes('\u2705') ? styles.messageSuccess : styles.messageError}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className={styles.saveBtn}
        >
          {isSaving ? 'Salvataggio...' : '💾 Salva Modifiche'}
        </button>
      </form>
    </div>
  );
};

export default InfoRulesEditor;
