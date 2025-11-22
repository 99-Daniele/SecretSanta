import { useState, useEffect } from 'react';
import { useEvent } from '../../../context/EventContext';
import { generateEventCode } from '../../../utils/codeGenerator';

const InfoRulesEditor = () => {
  const { currentEvent, updateEvent } = useEvent();
  const [formData, setFormData] = useState({
    nome_evento: '',
    event_code: '',
    anno: new Date().getFullYear(),
    budget_min: '',
    budget_max: '',
    data_apertura: '',
    regole_testo: '',
    note_admin: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentEvent) {
      setFormData({
        nome_evento: currentEvent.nome_evento || '',
        event_code: currentEvent.event_code || '',
        anno: currentEvent.anno || new Date().getFullYear(),
        budget_min: currentEvent.budget_min || '',
        budget_max: currentEvent.budget_max || '',
        data_apertura: currentEvent.data_apertura ?  new Date(currentEvent.data_apertura).toISOString().slice(0, 16) : '',
        regole_testo: currentEvent.regole_testo || '',
        note_admin: currentEvent.note_admin || '',
      });
    }
  }, [currentEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'nome_evento' && !prev.event_code) {
      setFormData(prev => ({  ...prev, event_code: generateEventCode(value) }));
    }
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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#c41e3a' }}>
        📋 Info & Regole Evento
      </h1>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            Nome Evento *
          </label>
          <input
            name="nome_evento"
            value={formData.nome_evento}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            Codice Evento
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              name="event_code"
              value={formData.event_code}
              onChange={handleChange}
              style={{ flex: 1, padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', fontFamily: 'monospace', fontWeight: 'bold' }}
            />
            <button type="button" onClick={copyCode} style={{ padding: '0.75rem 1.5rem', background: '#165b33', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              📋 Copia
            </button>
          </div>
          <small style={{ color: '#666', fontSize: '0.85rem' }}>
            I partecipanti useranno questo codice per accedere
          </small>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Anno</label>
            <input name="anno" type="number" value={formData.anno} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Budget Min (€)</label>
            <input name="budget_min" type="number" step="0.01" value={formData.budget_min} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Budget Max (€)</label>
            <input name="budget_max" type="number" step="0.01" value={formData.budget_max} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
          </div>
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            Data e Ora Apertura Regali *
          </label>
          <input
            name="data_apertura"
            type="datetime-local"
            value={formData.data_apertura}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Regole</label>
          <textarea
            name="regole_testo"
            value={formData.regole_testo}
            onChange={handleChange}
            rows="5"
            style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Note / Istruzioni</label>
          <textarea
            name="note_admin"
            value={formData.note_admin}
            onChange={handleChange}
            rows="5"
            style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        {message && (
          <div style={{ padding: '1rem', background: message.includes('✅') ? '#d4edda' : '#f8d7da', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          style={{ padding: '1rem 2rem', background: 'linear-gradient(135deg, #c41e3a 0%, #8b1429 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {isSaving ? 'Salvataggio...' : '💾 Salva Modifiche'}
        </button>
      </form>
    </div>
  );
};

export default InfoRulesEditor;
