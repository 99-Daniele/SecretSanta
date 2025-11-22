import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { decrypt } from '../../utils/encryption';
import { sendResetRequestEmail } from '../../utils/emailService';
import RulesPanel from '../../components/Shared/RulesPanel';
import styles from './ParticipantView_new.module.css';

const ParticipantViewNew = () => {
  const { eventCode, participantCode } = useParams();
  const [event, setEvent] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [resetRequested, setResetRequested] = useState(false);
  

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data: eventData } = await supabase.from('events').select('*').eq('event_code', eventCode).eq('is_active', true).single();
        if (!mounted) return;
        if (!eventData) {
          setError('Evento non trovato');
          setLoading(false);
          return;
        }
        setEvent(eventData);

        const { data: partData } = await supabase.from('participants').select('*').eq('event_id', eventData.id).eq('access_code', participantCode).single();
        if (!mounted) return;
        if (!partData) {
          setError('Codice partecipante non valido');
          setLoading(false);
          return;
        }
        setParticipant(partData);

        if (!eventData.extraction_done) {
          setLoading(false);
          return;
        }

        const { data: assignData } = await supabase.from('assignments').select('*').eq('event_id', eventData.id).eq('giver_id', partData.id).single();
        if (assignData) setAssignment(assignData);

  // (optional) load all assignments when needed — currently not used in this view
      } catch (e) {
        console.error(e);
        setError('Errore nel caricamento dati');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [eventCode, participantCode]);

  const handleReveal = async () => {
    if (!participant || !assignment) return;

    await supabase.from('participants').update({
      has_viewed: true,
      viewed_at: new Date().toISOString(),
    }).eq('id', participant.id);

    setParticipant({ ...participant, has_viewed: true });
    setRevealed(true);
  };

  const handleResetRequest = async () => {
    if (!event || !participant) return;

    try {
      await supabase.from('reset_requests').insert([{
        event_id: event.id,
        participant_id: participant.id,
      }]);

      await sendResetRequestEmail({
        participantName: `${participant.nome} ${participant.cognome}`,
        eventName: event.nome_evento,
        participantEmail: participant.email,
      });

      setResetRequested(true);
    } catch (e) {
      console.error(e);
      setError('Errore durante la richiesta');
    }
  };

  const getReceiverName = () => {
    if (!assignment) return '';
    try { return decrypt(assignment.receiver_name_encrypted); }
    catch { return 'Errore decifratura'; }
  };

  if (loading) return <div className={styles.page}><div className={styles.loadingText}>Caricamento...</div></div>;

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.centerCard}>
          <div className={styles.bigIcon}>⚠️</div>
          <h1 className={styles.errorTitle}>Errore</h1>
          <p className={styles.errorText}>{error}</p>
          <a href="/" className={styles.primaryButton}>← Torna alla Home</a>
        </div>
      </div>
    );
  }

  if (!event?.extraction_done) {
    return (
      <div className={styles.page}>
        <RulesPanel event={event} />
        <div className={styles.warningCard}>
          <div className={styles.bigIcon}>⏳</div>
          <h1 className={styles.lockedTitle}>Estrazione non ancora effettuata</h1>
          <p className={styles.lockedText}>
            L'organizzatore non ha ancora effettuato l'estrazione del Secret Santa.<br/>
            Riprova più tardi!
          </p>
          <a href="/" className={styles.primaryButton}>← Torna alla Home</a>
        </div>
      </div>
    );
  }

  if (!participant?.has_viewed && !revealed) {
    if (showWarning) {
      return (
        <div className={styles.page}>
          <RulesPanel event={event} />
          <div className={styles.warningCard}>
            <div className={styles.centerHeader}>
              <div className={styles.bigIcon}>⚠️</div>
              <h1 className={styles.lockedTitle}>Attenzione!</h1>
              <div className={styles.warningText}>
                Potrai vedere il tuo abbinamento <strong className={styles.strongPrimary}>UNA SOLA VOLTA</strong>.<br/>
                Assicurati di segnarti il nome!
              </div>
            </div>
            <button onClick={() => setShowWarning(false)} className={styles.accentButton}>🎁 Rivela il mio Secret Santa</button>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.page}>
        <RulesPanel event={event} />
        <div className={styles.revealCard}>
          <div className={styles.revealedIcon}>🎁</div>
          <h1 className={styles.revealText}>Ciao <strong className={styles.strongPrimary}>{participant.nome}</strong>!<br/>Devi fare un regalo a:</h1>
          <div className={styles.receiverBox}>{getReceiverName()}</div>
          <button onClick={handleReveal} className={styles.confirmButton}>✅ Ho capito!</button>
          <p className={styles.smallNote}>Ricorda: non potrai più vedere questo abbinamento!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <RulesPanel event={event} />
      <div className={styles.lockedCard}>
        <div className={styles.lockedIcon}>🔒</div>
        <h1 className={styles.lockedTitle}>Hai già visualizzato</h1>
        <p className={styles.lockedText}>Hai già visto il tuo abbinamento. Se hai bisogno di rivederlo, richiedi il ripristino all'organizzatore.</p>

        {resetRequested ? (
          <div className={styles.successBox}>✅ Richiesta inviata! L'organizzatore riceverà una notifica.</div>
        ) : (
          <button onClick={handleResetRequest} className={styles.resetButton}>📧 Richiedi Ripristino</button>
        )}
      </div>
    </div>
  );
};

export default ParticipantViewNew;
