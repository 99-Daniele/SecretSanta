import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { decrypt } from '../../utils/encryption';
import { useEventStatus } from '../../hooks/useEventStatus';
import { sendResetRequestEmail } from '../../utils/emailService';
import RulesPanel from '../../components/Shared/RulesPanel';
import CountdownBar from '../../components/Shared/CountdownBar';

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

  useEffect(() => {
    fetchData();
  }, []);

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
    return <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Caricamento...</div>;
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: 'var(--border-radius-xl)', padding: '2.5rem', textAlign: 'center', maxWidth: '480px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '1.75rem' }}>Errore</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <a href="/" style={{ display: 'inline-block', padding: '0.875rem 1.75rem', background: 'var(--accent-green)', color: 'white', textDecoration: 'none', borderRadius: 'var(--border-radius-md)', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
            ← Torna alla Home
          </a>
        </div>
      </div>
    );
  }

  // DOPO DATA APERTURA
  if (isEventOpen) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', padding: '1.5rem' }}>
        <RulesPanel event={event} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: 'var(--border-radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green-dark) 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem', boxShadow: 'var(--shadow-md)' }}>🎄</div>
              <h1 style={{ fontSize: '1.75rem', color: 'var(--accent-green)', marginBottom: '0.5rem' }}>Il Secret Santa è concluso!</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Ecco tutti gli abbinamenti:</p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-lg)', padding: '1.5rem' }}>
              {allAssignments.map((a, i) => (
                <div key={i} style={{ padding: '1rem', background: 'white', borderRadius: 'var(--border-radius-md)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ flex: 1, fontWeight: 600, color: 'var(--text-primary)' }}>{a.giver}</div>
                  <div style={{ fontSize: '1.5rem', color: 'var(--accent-red)' }}>→</div>
                  <div style={{ flex: 1, fontWeight: 600, color: 'var(--accent-red)' }}>{a.receiver}</div>
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
      <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <RulesPanel event={event} />
        
        <div style={{ background: 'white', borderRadius: 'var(--border-radius-xl)', padding: '2.5rem', maxWidth: '580px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
          <h1 style={{ color: 'var(--accent-red)', fontSize: '1.75rem', marginBottom: '1rem' }}>Estrazione non ancora effettuata</h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: '1.6' }}>
            L'organizzatore non ha ancora effettuato l'estrazione del Secret Santa.<br/>
            Riprova più tardi!
          </p>
          <a href="/" style={{ display: 'inline-block', padding: '0.875rem 1.75rem', background: 'var(--accent-green)', color: 'white', textDecoration: 'none', borderRadius: 'var(--border-radius-md)', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
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
        <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <RulesPanel event={event} />
          
          <div style={{ background: 'white', borderRadius: 'var(--border-radius-xl)', padding: '2.5rem', maxWidth: '580px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
              <h1 style={{ color: 'var(--accent-red)', fontSize: '1.75rem', marginBottom: '1rem' }}>Attenzione!</h1>
              <div style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1.75rem', color: 'var(--text-secondary)' }}>
                Potrai vedere il tuo abbinamento <strong style={{ color: 'var(--text-primary)' }}>UNA SOLA VOLTA</strong>.<br/>
                Assicurati di segnarti il nome!
              </div>
            </div>

            <button
              onClick={() => setShowWarning(false)}
              style={{ width: '100%', padding: '1.25rem', background: 'linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green-dark) 100%)', color: 'white', border: 'none', borderRadius: 'var(--border-radius-md)', fontSize: '1.15rem', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-md)', transition: 'all var(--transition-normal)' }}
              onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = 'var(--shadow-lg)')}
              onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'var(--shadow-md)')}
            >
              🎁 Rivela il mio Secret Santa
            </button>
          </div>
        </div>
      );
    }

    // REVEAL - Mostra il nome
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <RulesPanel event={event} />
        
        <div style={{ background: 'white', borderRadius: 'var(--border-radius-xl)', padding: '3rem', maxWidth: '680px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎁</div>
          
          <h1 style={{ fontSize: '1.35rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', fontWeight: 400 }}>
            Ciao <strong style={{ color: 'var(--text-primary)' }}>{participant.nome}</strong>!<br/>
            Devi fare un regalo a:
          </h1>
          
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent-red)', marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)', borderRadius: 'var(--border-radius-lg)', border: '2px solid var(--accent-red-light)' }}>
            {getReceiverName()}
          </div>

          <button
            onClick={handleReveal}
            style={{ padding: '1.25rem 2.5rem', background: 'linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green-dark) 100%)', color: 'white', border: 'none', borderRadius: 'var(--border-radius-md)', fontSize: '1.15rem', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-md)', transition: 'all var(--transition-normal)' }}
            onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = 'var(--shadow-lg)')}
            onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'var(--shadow-md)')}
          >
            ✅ Ho capito!
          </button>

          <p style={{ marginTop: '1.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Ricorda: non potrai più vedere questo abbinamento!
          </p>
        </div>
      </div>
    );
  }

  // PRIMA DATA APERTURA - HA GIÀ VISTO (o ha premuto "Ho capito")
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <RulesPanel event={event} />
      
      <div style={{ background: 'white', borderRadius: 'var(--border-radius-xl)', padding: '2.5rem', maxWidth: '580px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h1 style={{ color: 'var(--accent-red)', fontSize: '1.75rem', marginBottom: '1rem' }}>Hai già visualizzato</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: '1.6' }}>
          Hai già visto il tuo abbinamento. Se hai bisogno di rivederlo, richiedi il ripristino all'organizzatore.
        </p>

        {resetRequested ? (
          <div style={{ padding: '1.25rem', background: 'var(--success-light)', borderRadius: 'var(--border-radius-md)', color: 'var(--success-dark)', border: '1px solid var(--success)' }}>
            ✅ Richiesta inviata! L'organizzatore riceverà una notifica.
          </div>
        ) : (
          <button
            onClick={handleResetRequest}
            style={{ padding: '1.125rem 1.75rem', background: 'linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green-dark) 100%)', color: 'white', border: 'none', borderRadius: 'var(--border-radius-md)', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-md)', transition: 'all var(--transition-normal)' }}
            onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = 'var(--shadow-lg)')}
            onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'var(--shadow-md)')}
          >
            📧 Richiedi Ripristino
          </button>
        )}
      </div>
    </div>
  );
};

export default ParticipantView;
