import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { decrypt } from '../../utils/encryption';
import { useEventStatus } from '../../hooks/useEventStatus';
import { sendResetRequestEmail } from '../../utils/emailService';
import Snowflakes from '../../components/Shared/Snowflakes';
import RulesPanel from '../../components/Shared/RulesPanel';

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

    setRevealed(true);
    
    if (!participant.has_viewed) {
      await supabase.from('participants').update({ has_viewed: true, viewed_at: new Date().toISOString() }).eq('id', participant.id);
    }
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
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>Caricamento...</div>;
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #c41e3a 0%, #165b33 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ color: '#c41e3a', marginBottom: '1rem' }}>Errore</h1>
          <p style={{ fontSize: '1.2rem' }}>{error}</p>
          <a href="/" style={{ display: 'inline-block', marginTop: '2rem', padding: '1rem 2rem', background: '#165b33', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
            ← Torna alla Home
          </a>
        </div>
      </div>
    );
  }

  // DOPO DATA APERTURA
  if (isEventOpen) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #c41e3a 0%, #165b33 100%)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <Snowflakes count={50} />
        <RulesPanel event={event} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎄</div>
              <h1 style={{ fontSize: '2rem', color: '#165b33', marginBottom: '0.5rem' }}>Il Secret Santa è concluso!</h1>
              <p style={{ color: '#666' }}>Ecco tutti gli abbinamenti:</p>
            </div>

            <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '2rem' }}>
              {allAssignments.map((a, i) => (
                <div key={i} style={{ padding: '1rem', background: 'white', borderRadius: '8px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, fontWeight: 'bold', color: '#333' }}>{a.giver}</div>
                  <div style={{ fontSize: '1.5rem' }}>→</div>
                  <div style={{ flex: 1, fontWeight: 'bold', color: '#c41e3a' }}>{a.receiver}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PRIMA DATA APERTURA - NON HA ANCORA VISTO
  if (!participant.has_viewed && !revealed) {
    if (showWarning) {
      return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #c41e3a 0%, #165b33 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <Snowflakes count={50} />
          <RulesPanel event={event} />
          
          <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', maxWidth: '600px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>⚠️</div>
              <h1 style={{ color: '#c41e3a', fontSize: '2rem', marginBottom: '1rem' }}>Attenzione!</h1>
              <div style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Potrai vedere il tuo abbinamento <strong>UNA SOLA VOLTA</strong>.<br/>
                Assicurati di segnarti il nome!
              </div>
            </div>

            <button
              onClick={() => setShowWarning(false)}
              style={{ width: '100%', padding: '1.5rem', background: 'linear-gradient(135deg, #165b33 0%, #0d3d23 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.25rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🎁 Rivela il mio Secret Santa
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #165b33 0%, #c41e3a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <Snowflakes count={100} />
        <RulesPanel event={event} />
        
        <div style={{ background: 'white', borderRadius: '16px', padding: '4rem', maxWidth: '700px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div style={{ fontSize: '6rem', marginBottom: '2rem', animation: 'bounce 1s infinite' }}>🎁</div>
          
          <h1 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '1rem' }}>
            Ciao <strong>{participant.nome}</strong>!<br/>
            Devi fare un regalo a:
          </h1>
          
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#c41e3a', marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)', borderRadius: '12px' }}>
            {getReceiverName()}
          </div>

          <button
            onClick={handleReveal}
            style={{ padding: '1.5rem 3rem', background: 'linear-gradient(135deg, #165b33 0%, #0d3d23 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.25rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ✅ Ho capito!
          </button>

          <p style={{ marginTop: '2rem', color: '#666', fontSize: '0.9rem' }}>
            Ricorda: non potrai più vedere questo abbinamento!
          </p>
        </div>
      </div>
    );
  }

  // PRIMA DATA APERTURA - HA GIÀ VISTO
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #c41e3a 0%, #165b33 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <Snowflakes count={50} />
      <RulesPanel event={event} />
      
      <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', maxWidth: '600px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔒</div>
        <h1 style={{ color: '#c41e3a', fontSize: '2rem', marginBottom: '1rem' }}>Hai già visualizzato</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
          Hai già visto il tuo abbinamento. Se hai bisogno di rivederlo, richiedi il ripristino all'organizzatore.
        </p>

        {resetRequested ? (
          <div style={{ padding: '1.5rem', background: '#d4edda', borderRadius: '8px', color: '#155724' }}>
            ✅ Richiesta inviata! L'organizzatore riceverà una notifica.
          </div>
        ) : (
          <button
            onClick={handleResetRequest}
            style={{ padding: '1.25rem 2rem', background: 'linear-gradient(135deg, #165b33 0%, #0d3d23 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📧 Richiedi Ripristino
          </button>
        )}
      </div>
    </div>
  );
};

export default ParticipantView;
