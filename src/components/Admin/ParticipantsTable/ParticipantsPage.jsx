import { useState, useEffect, useCallback } from 'react';
import { useEvent } from '../../../context/EventContext';
import { supabase } from '../../../utils/supabaseClient';
import { generateParticipantCode } from '../../../utils/codeGenerator';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import styles from './ParticipantsPage.module.css';

const ParticipantsPage = () => {
  const { currentEvent } = useEvent();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nome: '', cognome: '', email: '', ruolo: '' });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchParticipants = useCallback(async () => {
    if (!currentEvent) return;
    setLoading(true);
    const { data } = await supabase.from('participants').select('*').eq('event_id', currentEvent.id).order('created_at');
    setParticipants(data || []);
    setLoading(false);
  }, [currentEvent]);

  // fetchParticipants is stable via useCallback; run on mount/when currentEvent changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!currentEvent) return;
      // perform fetch with mounted guard to avoid setState on unmounted
      try {
        setLoading(true);
        const { data } = await supabase.from('participants').select('*').eq('event_id', currentEvent.id).order('created_at');
        if (!mounted) return;
        setParticipants(data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [currentEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = generateParticipantCode(formData.nome, formData.cognome);
    const data = { ...formData, event_id: currentEvent.id, access_code: code };
    
    if (editingId) {
      await supabase.from('participants').update(data).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('participants').insert([data]);
    }
    
    setFormData({ nome: '', cognome: '', email: '', ruolo: '' });
    fetchParticipants();
  };

  const handleEdit = (p) => {
    setFormData({ nome: p.nome, cognome: p.cognome, email: p.email || '', ruolo: p.ruolo || '' });
    setEditingId(p.id);
  };

  const handleDelete = async () => {
    await supabase.from('participants').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchParticipants();
  };

  const handleResetView = async (id) => {
    await supabase.from('participants').update({ has_viewed: false, viewed_at: null }).eq('id', id);
    fetchParticipants();
  };

  const copyAllCodes = () => {
    const codes = participants.map(p => `${p.nome} ${p.cognome}: ${p.access_code}`).join('\n');
    navigator.clipboard.writeText(`Codice Evento: ${currentEvent.event_code}\n\n${codes}`);
    alert('Codici copiati!');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>👥 Gestione Partecipanti</h1>

      <div className={styles.card}>
        <h2 className={styles.cardHeadingSpacer}>{editingId ? 'Modifica' : 'Aggiungi'} Partecipante</h2>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <input placeholder="Nome *" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required className={styles.input} />
          <input placeholder="Cognome *" value={formData.cognome} onChange={(e) => setFormData({...formData, cognome: e.target.value})} required className={styles.input} />
          <input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={styles.input} />
          <input placeholder="Ruolo" value={formData.ruolo} onChange={(e) => setFormData({...formData, ruolo: e.target.value})} className={styles.input} />
          <button type="submit" className={styles.submitPrimary}>
            {editingId ? 'Aggiorna' : '\u2795 Aggiungi'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({ nome: '', cognome: '', email: '', ruolo: '' }); }} className={styles.submitSecondary}>
              Annulla
            </button>
          )}
        </form>
      </div>

      <div className={styles.controlsRow}>
        <h2>Partecipanti ({participants.length})</h2>
        {participants.length > 0 && (
          <button onClick={copyAllCodes} className={styles.copyBtn}>
            \ud83d\udccb Copia Tutti i Codici
          </button>
        )}
      </div>

      {loading ? (
        <div>Caricamento...</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.theadRow}>
                <th className={styles.thCell}>Nome</th>
                <th className={styles.thCell}>Codice</th>
                <th className={styles.thCell}>Email</th>
                <th className={`${styles.thCell} ${styles.textCenter}`}>Visualizzato</th>
                <th className={`${styles.thCell} ${styles.textCenter}`}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(p => (
                <tr key={p.id} className={styles.trBorder}>
                  <td className={styles.tdCell}>{p.nome} {p.cognome}</td>
                  <td className={`${styles.tdCell} ${styles.mono}`}>{p.access_code}</td>
                  <td className={styles.tdCell}>{p.email || '-'}</td>
                  <td className={`${styles.tdCell} ${styles.textCenter}`}>
                    {p.has_viewed ? '\u2705' : '\u2b1c'}
                  </td>
                  <td className={`${styles.tdCell} ${styles.textCenter}`}>
                    <button onClick={() => handleEdit(p)} className={styles.actionBtn}>
                      \u270f\ufe0f
                    </button>
                    {p.has_viewed && (
                      <button onClick={() => handleResetView(p.id)} className={styles.warningBtn}>
                        \ud83d\udd04
                      </button>
                    )}
                    <button onClick={() => setDeleteId(p.id)} className={styles.dangerBtn}>
                      \ud83d\uddd1\ufe0f
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Elimina Partecipante"
        message="Sei sicuro di voler eliminare questo partecipante? Questa azione è irreversibile."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default ParticipantsPage;
