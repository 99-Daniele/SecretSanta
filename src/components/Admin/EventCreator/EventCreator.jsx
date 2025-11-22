import { useState, useEffect } from 'react';
import { useEvent } from '../../../context/EventContext';
import { generateEventCode } from '../../../utils/codeGenerator';
import styles from './EventCreator.module.css';

const EventCreator = ({ onEventCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    nome_evento: '',
    anno: new Date().getFullYear(),
    budget_min: '',
    budget_max: '',
    data_apertura: '',
    regole_testo: '',
    note_admin: '',
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { createEvent } = useEvent();

  useEffect(() => {
    if (formData.nome_evento) {
      setGeneratedCode(generateEventCode(formData.nome_evento));
    } else {
      setGeneratedCode('');
    }
  }, [formData.nome_evento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.nome_evento || !formData.data_apertura) {
      setError('Nome evento e data apertura sono obbligatori');
      return;
    }

    if (formData.budget_min && formData.budget_max) {
      if (parseFloat(formData.budget_min) > parseFloat(formData.budget_max)) {
        setError('Il budget minimo non può essere maggiore del massimo');
        return;
      }
    }

    setLoading(true);

    try {
      const eventData = {
        nome_evento: formData.nome_evento,
        event_code: generatedCode,
        anno: parseInt(formData.anno),
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        data_apertura: formData.data_apertura,
        regole_testo: formData.regole_testo || null,
        note_admin: formData.note_admin || null,
        is_active: true,
        extraction_done: false,
      };

      const { data, error: createError } = await createEvent(eventData);

      if (createError) {
        setError('Errore durante la creazione dell\'evento');
        return;
      }

      if (data) {
        onEventCreated(data);
      }
    } catch (err) {
      setError('Errore imprevisto durante la creazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.icon}>🎄</div>
          <h1 className={styles.title}>Crea Nuovo Evento</h1>
          <p className={styles.subtitle}>
            Configura un nuovo Secret Santa
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nome_evento" className={styles.label}>
              Nome Evento <span className={styles.required}>*</span>
            </label>
            <input
              id="nome_evento"
              name="nome_evento"
              type="text"
              className={styles.input}
              value={formData.nome_evento}
              onChange={handleChange}
              placeholder="Secret Santa Famiglia 2025"
              required
            />
            {generatedCode && (
              <div>
                <div className={styles.help}>Codice generato:</div>
                <div className={styles.codePreview}>{generatedCode}</div>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="anno" className={styles.label}>
              Anno
            </label>
            <input
              id="anno"
              name="anno"
              type="number"
              className={styles.input}
              value={formData.anno}
              onChange={handleChange}
              min="2024"
              max="2100"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="budget_min" className={styles.label}>
                Budget Min (€)
              </label>
              <input
                id="budget_min"
                name="budget_min"
                type="number"
                className={styles.input}
                value={formData.budget_min}
                onChange={handleChange}
                placeholder="10"
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="budget_max" className={styles.label}>
                Budget Max (€)
              </label>
              <input
                id="budget_max"
                name="budget_max"
                type="number"
                className={styles.input}
                value={formData.budget_max}
                onChange={handleChange}
                placeholder="30"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="data_apertura" className={styles.label}>
              Data e Ora Apertura Regali <span className={styles.required}>*</span>
            </label>
            <input
              id="data_apertura"
              name="data_apertura"
              type="datetime-local"
              className={styles.input}
              value={formData.data_apertura}
              onChange={handleChange}
              required
            />
            <div className={styles.help}>
              Dopo questa data, tutti vedranno tutti gli abbinamenti
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="regole_testo" className={styles.label}>
              Regole del Secret Santa
            </label>
            <textarea
              id="regole_testo"
              name="regole_testo"
              className={styles.textarea}
              value={formData.regole_testo}
              onChange={handleChange}
              placeholder="Es: I regali devono essere incartati..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="note_admin" className={styles.label}>
              Note / Istruzioni Speciali
            </label>
            <textarea
              id="note_admin"
              name="note_admin"
              className={styles.textarea}
              value={formData.note_admin}
              onChange={handleChange}
              placeholder="Es: Portare il regalo alla cena del 24 dicembre..."
            />
          </div>

          {error && (
            <div className={styles.error}>⚠️ {error}</div>
          )}

          <div className={styles.buttons}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onCancel}
              disabled={loading}
            >
              Annulla
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
              disabled={loading}
            >
              {loading ? 'Creazione...' : 'Crea Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreator;
