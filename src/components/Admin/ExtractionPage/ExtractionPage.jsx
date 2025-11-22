import { useState, useEffect } from 'react';
import { useEvent } from '../../../context/EventContext';
import { supabase } from '../../../utils/supabaseClient';
import { createAssignments, validateExtraction } from '../../../utils/extractionAlgorithm';
import { encrypt } from '../../../utils/encryption';
import ChristmasAnimation from '../../Shared/ChristmasAnimation';
import ConfirmDialog from '../../Shared/ConfirmDialog';

const ExtractionPage = () => {
  const { currentEvent, updateEvent } = useEvent();
  const [participants, setParticipants] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignments, setShowAssignments] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [currentEvent]);

  const fetchData = async () => {
    if (!currentEvent) return;
    setLoading(true);
    
    const { data: partData } = await supabase.from('participants').select('*').eq('event_id', currentEvent.id);
    setParticipants(partData || []);
    
    const { data: assignData } = await supabase.from('assignments').select('*').eq('event_id', currentEvent.id);
    setAssignments(assignData || []);
    
    setLoading(false);
  };

  const handleExtraction = async () => {
    setError('');
    const validation = validateExtraction(participants);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (assignments.length > 0) {
      setShowConfirm(true);
      return;
    }

    performExtraction();
  };

  const performExtraction = async () => {
    setShowConfirm(false);
    setShowAnimation(true);
    
    setTimeout(async () => {
      try {
        if (assignments.length > 0) {
          await supabase.from('assignments').delete().eq('event_id', currentEvent.id);
        }

        const newAssignments = createAssignments(participants);
        
        const assignmentsData = newAssignments.map(a => ({
          event_id: currentEvent.id,
          giver_id: a.giver_id,
          receiver_id: a.receiver_id,
          receiver_name_encrypted: encrypt(a.receiver_name),
        }));

        await supabase.from('assignments').insert(assignmentsData);
        await updateEvent(currentEvent.id, { extraction_done: true });
        
        await fetchData();
        setShowAnimation(false);
      } catch (err) {
        setError('Errore durante l\'estrazione');
        setShowAnimation(false);
      }
    }, 3000);
  };

  const getAssignmentDetails = () => {
    return assignments.map(a => {
      const giver = participants.find(p => p.id === a.giver_id);
      const receiver = participants.find(p => p.id === a.receiver_id);
      return {
        giver: giver ? `${giver.nome} ${giver.cognome}` : '?',
        receiver: receiver ? `${receiver.nome} ${receiver.cognome}` : '?',
      };
    });
  };

  const assignmentDetails = getAssignmentDetails();

  if (showAnimation) {
    return <ChristmasAnimation message="🎅 Estraendo i Secret Santa..." />;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#c41e3a' }}>🎁 Estrazione Secret Santa</h1>

      {error && (
        <div style={{ padding: '1rem', background: '#fee', border: '2px solid #fcc', borderRadius: '8px', marginBottom: '2rem', color: '#c00' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Stato Estrazione</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Partecipanti</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#165b33' }}>{participants.length}</div>
          </div>
          <div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>Stato</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: assignments.length > 0 ? '#165b33' : '#c41e3a' }}>
              {assignments.length > 0 ? '✅ Estratto' : '⬜ Non estratto'}
            </div>
          </div>
        </div>

        <button
          onClick={handleExtraction}
          disabled={loading || participants.length < 3}
          style={{
            width: '100%',
            padding: '1.5rem',
            background: participants.length < 3 ? '#ccc' : 'linear-gradient(135deg, #c41e3a 0%, #8b1429 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            cursor: participants.length < 3 ? 'not-allowed' : 'pointer',
          }}
        >
          {assignments.length > 0 ? '🔄 Ri-estrai Secret Santa' : '🎁 Estrai Secret Santa'}
        </button>

        {participants.length < 3 && (
          <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
            Servono almeno 3 partecipanti per l'estrazione
          </div>
        )}
      </div>

      {assignments.length > 0 && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Abbinamenti</h2>
            <button
              onClick={() => setShowAssignments(!showAssignments)}
              style={{ padding: '0.75rem 1.5rem', background: showAssignments ? '#c41e3a' : '#165b33', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              {showAssignments ? '👁️ Nascondi' : '👁️‍🗨️ Mostra'}
            </button>
          </div>

          {showAssignments && (
            <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '1.5rem' }}>
              {assignmentDetails.map((a, i) => (
                <div key={i} style={{ padding: '1rem', background: 'white', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, fontWeight: 'bold' }}>{a.giver}</div>
                  <div style={{ fontSize: '1.5rem' }}>→</div>
                  <div style={{ flex: 1, color: '#c41e3a', fontWeight: 'bold' }}>{a.receiver}</div>
                </div>
              ))}
            </div>
          )}

          {!showAssignments && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Clicca "Mostra" per vedere gli abbinamenti
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        title="Ri-estrai Secret Santa"
        message="Vuoi davvero ri-estrarre? Gli abbinamenti precedenti saranno sovrascritti e i partecipanti dovranno visualizzare nuovamente il loro abbinamento."
        confirmText="Sì, ri-estrai"
        onConfirm={performExtraction}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default ExtractionPage;
