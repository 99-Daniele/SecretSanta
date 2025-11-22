import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { decrypt } from '../../utils/encryption';
import { useEventStatus } from '../../hooks/useEventStatus';
import { sendResetRequestEmail } from '../../utils/emailService';
import Snowflakes from '../../components/Shared/Snowflakes';
import RulesPanel from '../../components/Shared/RulesPanel';
import CountdownBar from '../../components/Shared/CountdownBar';
import styles from './ParticipantView_old.module.css';

const ParticipantView = () => {
  const { eventCode, participantCode } = useParams();
  const [event, setEvent] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [resetRequested, setResetRequested] = useState(false);
  const isEventOpen = useEventStatus(event?.data_apertura);
  const [allAssignments, setAllAssignments] = useState([]);
  const fetchData = async () => {
    setLoading(true);

    const { data: eventData } = await supabase.from('events').select('*').eq('event_code', eventCode).eq('is_active', true).single();
    if (!eventData) {
      setError('Evento non trovato');
      setLoading(false);
      return;
    }
    setEvent(eventData);

    const { data: partData } = await supabase.from('participants').select('*').eq('event_id', eventData.id).eq('access_code', participantCode).single();
    if (!partData) {
      setError('Codice partecipante non valido');
      setLoading(false);
      return;
    }
    setParticipant(partData);

    // Controlla se estrazione è stata fatta
    if (!eventData.extraction_done) {
      // Non cercare assignment se non c'è stata estrazione
      setLoading(false);
      return;
    }

    const { data: assignData } = await supabase.from('assignments').select('*').eq('event_id', eventData.id).eq('giver_id', partData.id).single();
    if (assignData) {
      setAssignment(assignData);
    }

    if (isEventOpen) {
      const { data: allAssignData } = await supabase.from('assignments').select('*').eq('event_id', eventData.id);
      const { data: allParts } = await supabase.from('participants').select('*').eq('event_id', eventData.id);
      
      const details = allAssignData?.map(a => {
        const giver = allParts?.find(p => p.id === a.giver_id);
        const receiver = allParts?.find(p => p.id === a.receiver_id);
        return {
          giver: giver ? `${giver.nome} ${giver.cognome}` : '?',
          receiver: receiver ? `${receiver.nome} ${receiver.cognome}` : '?',
        };
      });
      setAllAssignments(details || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchData();
    })();
    return () => { mounted = false; };
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReveal = async () => {
    if (!participant || !assignment) return;

    // Setta has_viewed e nasconde il nome
    await supabase.from('participants').update({ 
      has_viewed: true, 
      viewed_at: new Date().toISOString() 
    }).eq('id', participant.id);

    // Aggiorna lo stato locale
    setParticipant({ ...participant, has_viewed: true });
    setRevealed(true);
  };

  const handleResetRequest = async () => {
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
  };

  const getReceiverName = () => {
    if (!assignment) return '';
    
    try {
      return decrypt(assignment.receiver_name_encrypted);
    } catch {
      return 'Errore decifratura';
    }
  };

  if (loading) {
    return <div className={styles.fullCenter}>Caricamento...</div>;
  }

  if (error) {
    return (
      <div className={styles.heroGradient}>
        <div className={styles.cardNoShadow}>
          <div className={styles.bigIcon}>⚠️</div>
          <h1 className={styles.titleError}>Errore</h1>
            <p className={styles.errorText}>{error}</p>
          <a href="/" className={styles.btnFull + ' ' + styles.btnGreenGradient + ' ' + styles.linkButton}>
            ← Torna alla Home
          </a>
        </div>
      </div>
    );
  }

  // DOPO DATA APERTURA
  if (isEventOpen) {
    return (
      <div className={styles.heroGradient}>
        <Snowflakes count={50} />
        <RulesPanel event={event} />
        
        <div className={styles.containerInner}>
          <div className={styles.cardShadow}>
            <div className={styles.centerText}>
              <div className={styles.bigIcon}>🎄</div>
              <h1 className={styles.titlePrimary}>Il Secret Santa è concluso!</h1>
              <p className={styles.muted}>Ecco tutti gli abbinamenti:</p>
            </div>

            <div className={styles.listBox}>
              {allAssignments.map((a, i) => (
                <div key={i} className={styles.assignRow}>
                  <div className={styles.assignGiver}>{a.giver}</div>
                  <div className={styles.arrow}>→</div>
                  <div className={styles.assignReceiver}>{a.receiver}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ESTRAZIONE NON ANCORA EFFETTUATA
  if (!event.extraction_done) {
    return (
      <div className={styles.heroGradient}>
        <Snowflakes count={50} />
        <RulesPanel event={event} />
        
        <div className={styles.cardNoShadow}>
          <div className={styles.bigIcon}>⏳</div>
          <h1 className={styles.titleError}>Estrazione non ancora effettuata</h1>
          <p className={styles.muted}>
            L'organizzatore non ha ancora effettuato l'estrazione del Secret Santa.<br/>
            Riprova più tardi!
          </p>
              <a href="/" className={styles.btnFull + ' ' + styles.btnGreenGradient + ' ' + styles.boldLink}>
            ← Torna alla Home
          </a>
        </div>
      </div>
    );
  }

  // PRIMA DATA APERTURA - NON HA ANCORA VISTO
  if (!participant.has_viewed && !revealed) {
    if (showWarning) {
      return (
        <div className={styles.heroGradient}>
          <Snowflakes count={50} />
          <RulesPanel event={event} />
          
          <div className={styles.cardShadow}>
            <div className={styles.centerText}>
              <div className={styles.bigIcon}>⚠️</div>
              <h1 className={styles.titleError}>Attenzione!</h1>
                <div className={styles.contentText}>
                Potrai vedere il tuo abbinamento <strong>UNA SOLA VOLTA</strong>.<br/>
                Assicurati di segnarti il nome!
              </div>
            </div>

            <button
              onClick={() => setShowWarning(false)}
              className={styles.btnFull + ' ' + styles.btnGreenGradient}
            >
              🎁 Rivela il mio Secret Santa
            </button>
          </div>
        </div>
      );
    }

    // REVEAL - Mostra il nome
    return (
      <div className={styles.heroGradient}>
        <Snowflakes count={100} />
        <RulesPanel event={event} />
        
        <div className={styles.cardShadow}>
          <div className={styles.hugeIcon}>🎁</div>
          
          <h1 className={styles.subtitle}>
            Ciao <strong>{participant.nome}</strong>!<br/>
            Devi fare un regalo a:
          </h1>
          
          <div className={styles.revealBox}>
            {getReceiverName()}
          </div>

          <button
            onClick={handleReveal}
            className={`${styles.btnFull} ${styles.btnGreenGradient}`}
          >
            ✅ Ho capito!
          </button>

          <p className={styles.smallNote}>
            Ricorda: non potrai più vedere questo abbinamento!
          </p>
        </div>
      </div>
    );
  }

  // PRIMA DATA APERTURA - HA GIÀ VISTO (o ha premuto "Ho capito")
  return (
    <div className={styles.heroGradient}>
      <Snowflakes count={50} />
      <RulesPanel event={event} />
      
      <div className={styles.cardShadow}>
        <div className={styles.bigIcon}>🔒</div>
        <h1 className={styles.titleError}>Hai già visualizzato</h1>
        <p className={`${styles.muted} ${styles.smallNote}`}>
          Hai già visto il tuo abbinamento. Se hai bisogno di rivederlo, richiedi il ripristino all'organizzatore.
        </p>

        {resetRequested ? (
          <div className={styles.lockedBox}>
            ✅ Richiesta inviata! L'organizzatore riceverà una notifica.
          </div>
        ) : (
          <button
            onClick={handleResetRequest}
            className={`${styles.btnFull} ${styles.btnGreenGradient}`}
          >
            📧 Richiedi Ripristino
          </button>
        )}
      </div>
    </div>
  );
};

export default ParticipantView;
