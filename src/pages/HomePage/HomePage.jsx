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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--primary-navy) 0%, var(--primary-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <Snowflakes count={30} />
      
      <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', maxWidth: '500px', width: '100%', boxShadow: 'var(--shadow-xl)', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--accent-burgundy) 0%, var(--accent-wine) 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem' }}>�</div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', fontWeight: 700 }}>Secret Santa</h1>
          <p style={{ color: 'var(--neutral-dark)', fontSize: '1.05rem' }}>Inserisci i tuoi codici per accedere</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--neutral-charcoal)' }}>
              Codice Evento
            </label>
            <input
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value.toUpperCase())}
              placeholder="ES: FAMIGLIA2025"
              style={{ width: '100%', padding: '1rem', border: '2px solid var(--neutral-light)', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 'bold', textTransform: 'uppercase', transition: 'border var(--transition-fast)' }}
              required
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--neutral-charcoal)' }}>
              Codice Partecipante
            </label>
            <input
              value={participantCode}
              onChange={(e) => setParticipantCode(e.target.value.toUpperCase())}
              placeholder="ES: MARIOROSSI"
              style={{ width: '100%', padding: '1rem', border: '2px solid var(--neutral-light)', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 'bold', textTransform: 'uppercase', transition: 'border var(--transition-fast)' }}
              required
            />
          </div>

          {error && (
            <div style={{ padding: '1rem', background: 'var(--error-light)', border: '1px solid var(--error)', borderRadius: '8px', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '1.25rem', background: 'linear-gradient(135deg, var(--accent-burgundy) 0%, var(--accent-wine) 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition-normal)', boxShadow: 'var(--shadow-md)' }}
          >
            {loading ? 'Verifica in corso...' : 'Accedi'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--neutral-light)' }}>
          <a href="/admin/login" style={{ color: 'var(--neutral-dark)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }}>
            Accesso Admin →
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
