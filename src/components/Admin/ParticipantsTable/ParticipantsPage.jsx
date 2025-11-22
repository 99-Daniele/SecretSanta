import { useState, useEffect } from 'react';
import { useEvent } from '../../../context/EventContext';
import { supabase } from '../../../utils/supabaseClient';
import { generateParticipantCode } from '../../../utils/codeGenerator';
import ConfirmDialog from '../../Shared/ConfirmDialog';

const ParticipantsPage = () => {
  const { currentEvent } = useEvent();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nome: '', cognome: '', email: '', ruolo: '' });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchParticipants = async () => {
    if (!currentEvent) return;
    setLoading(true);
    const { data } = await supabase.from('participants').select('*').eq('event_id', currentEvent.id).order('created_at');
    setParticipants(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchParticipants();
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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#c41e3a' }}>👥 Gestione Partecipanti</h1>

      <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>{editingId ? 'Modifica' : 'Aggiungi'} Partecipante</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input placeholder="Nome *" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required style={{ padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
          <input placeholder="Cognome *" value={formData.cognome} onChange={(e) => setFormData({...formData, cognome: e.target.value})} required style={{ padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
          <input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
          <input placeholder="Ruolo" value={formData.ruolo} onChange={(e) => setFormData({...formData, ruolo: e.target.value})} style={{ padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
          <button type="submit" style={{ gridColumn: '1 / -1', padding: '1rem', background: '#165b33', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editingId ? 'Aggiorna' : '➕ Aggiungi'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({ nome: '', cognome: '', email: '', ruolo: '' }); }} style={{ gridColumn: '1 / -1', padding: '0.75rem', background: '#e0e0e0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Annulla
            </button>
          )}
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>Partecipanti ({participants.length})</h2>
        {participants.length > 0 && (
          <button onClick={copyAllCodes} style={{ padding: '0.75rem 1.5rem', background: '#165b33', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            📋 Copia Tutti i Codici
          </button>
        )}
      </div>

      {loading ? (
        <div>Caricamento...</div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Nome</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Codice</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Visualizzato</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '1rem' }}>{p.nome} {p.cognome}</td>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{p.access_code}</td>
                  <td style={{ padding: '1rem' }}>{p.email || '-'}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {p.has_viewed ? '✅' : '⬜'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button onClick={() => handleEdit(p)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', background: '#165b33', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                      ✏️
                    </button>
                    {p.has_viewed && (
                      <button onClick={() => handleResetView(p.id)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', background: '#ffd700', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        🔄
                      </button>
                    )}
                    <button onClick={() => setDeleteId(p.id)} style={{ padding: '0.5rem 1rem', background: '#c41e3a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                      🗑️
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
