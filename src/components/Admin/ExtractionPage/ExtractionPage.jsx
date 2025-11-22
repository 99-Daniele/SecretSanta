import { useState, useEffect } from 'react';
import { useEvent } from '../../../context/EventContext';
import { supabase } from '../../../utils/supabaseClient';
import { createAssignments, validateExtraction } from '../../../utils/extractionAlgorithm';
import { encrypt } from '../../../utils/encryption';
import ChristmasAnimation from '../../Shared/ChristmasAnimation';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import styles from './ExtractionPage.module.css';

const ExtractionPage = () => {
  const { currentEvent, updateEvent } = useEvent();
  const [participants, setParticipants] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignments, setShowAssignments] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!currentEvent) return;
    setLoading(true);

    const { data: partData } = await supabase.from('participants').select('*').eq('event_id', currentEvent.id);
    setParticipants(partData || []);

    const { data: assignData } = await supabase.from('assignments').select('*').eq('event_id', currentEvent.id);
    setAssignments(assignData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvent]);

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
      } catch (e) {
        console.error(e);
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
    <div className={styles.container}>
      <h1 className={styles.title}>🎁 Estrazione Secret Santa</h1>

      {error && (
        <div className={styles.errorBox}>⚠️ {error}</div>
      )}

      <div className={styles.card}>
  <h2 className={styles.cardTitle}>Stato Estrazione</h2>
  <div className={styles.grid}>
          <div>
            <div className={styles.muted}>Partecipanti</div>
            <div className={styles.count}>{participants.length}</div>
          </div>
          <div>
            <div className={styles.muted}>Stato</div>
            <div className={`${styles.status} ${assignments.length > 0 ? styles.statusSuccess : styles.statusError}`}>
              {assignments.length > 0 ? '✅ Estratto' : '⬜ Non estratto'}
            </div>
          </div>
        </div>

  <button
          onClick={handleExtraction}
          disabled={loading || participants.length < 3}
          className={`${styles.primaryBtn} ${participants.length < 3 ? styles.disabled : styles.extract}`}
        >
          {assignments.length > 0 ? '🔄 Ri-estrai Secret Santa' : '🎁 Estrai Secret Santa'}
        </button>

        {participants.length < 3 && (
          <div className={styles.placeholder}>Servono almeno 3 partecipanti per l'estrazione</div>
        )}
      </div>

      {assignments.length > 0 && (
        <div className={styles.assignmentsCard}>
          <div className={styles.assignmentsHeader}>
            <h2>Abbinamenti</h2>
            <button
              onClick={() => setShowAssignments(!showAssignments)}
              className={`${styles.toggleBtn} ${showAssignments ? styles.show : styles.hide}`}
            >
              {showAssignments ? '👁️ Nascondi' : '👁️‍🗨️ Mostra'}
            </button>
          </div>

          {showAssignments && (
            <div className={styles.assignmentsList}>
              {assignmentDetails.map((a, i) => (
                <div key={i} className={styles.assignRow}>
                  <div className={styles.assignGiver}>{a.giver}</div>
                  <div className={styles.arrow}>→</div>
                  <div className={styles.assignReceiver}>{a.receiver}</div>
                </div>
              ))}
            </div>
          )}

          {!showAssignments && (
            <div className={styles.placeholder}>Clicca "Mostra" per vedere gli abbinamenti</div>
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
