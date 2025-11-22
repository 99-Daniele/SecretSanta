import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import Snowflakes from '../../components/Shared/Snowflakes';

const HomePage = () => {
  const [eventCode, setEventCode] = useState('');
  const [participantCode, setParticipantCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchEventByCode } = useEvent();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!eventCode || !participantCode) {
      setError('Inserisci entrambi i codici');
      return;
    }

    setLoading(true);

    const { data: event, error: eventError } = await fetchEventByCode(eventCode);

    if (eventError || !event) {
      setError('Codice evento non valido');
      setLoading(false);
      return;
    }

    navigate(`/participant/${eventCode}/${participantCode.toUpperCase()}`);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #c41e3a 0%, #165b33 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <Snowflakes count={50} />
      
      <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', maxWidth: '500px', width: '100%', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎅</div>
          <h1 style={{ fontSize: '2.5rem', color: '#c41e3a', marginBottom: '0.5rem' }}>Secret Santa</h1>
          <p style={{ color: '#666' }}>Scopri a chi devi fare il regalo!</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Codice Evento
            </label>
            <input
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value.toUpperCase())}
              placeholder="ES: FAMIGLIA2025"
              style={{ width: '100%', padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 'bold', textTransform: 'uppercase' }}
              required
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Codice Partecipante
            </label>
            <input
              value={participantCode}
              onChange={(e) => setParticipantCode(e.target.value.toUpperCase())}
              placeholder="ES: MARIOROSSI"
              style={{ width: '100%', padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 'bold', textTransform: 'uppercase' }}
              required
            />
          </div>

          {error && (
            <div style={{ padding: '1rem', background: '#fee', border: '1px solid #fcc', borderRadius: '8px', color: '#c00' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #165b33 0%, #0d3d23 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.25rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Verifica...' : '🎁 Accedi'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
          <a href="/admin/login" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
            Accesso Admin →
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
