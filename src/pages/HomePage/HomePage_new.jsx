import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';

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
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: 'var(--border-radius-xl)', padding: '2.5rem', maxWidth: '480px', width: '100%', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, var(--accent-red) 0%, var(--accent-red-dark) 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem', boxShadow: 'var(--shadow-md)' }}>🎁</div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>Secret Santa</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Inserisci i tuoi codici per accedere</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              Codice Evento
            </label>
            <input
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value.toUpperCase())}
              placeholder="ES: FAMIGLIA2025"
              style={{ width: '100%', padding: '0.875rem', border: '2px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', fontSize: '1rem', fontFamily: 'monospace', fontWeight: 600, textTransform: 'uppercase', transition: 'border-color var(--transition-fast)', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-red)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              required
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              Codice Partecipante
            </label>
            <input
              value={participantCode}
              onChange={(e) => setParticipantCode(e.target.value.toUpperCase())}
              placeholder="ES: MARIOROSSI"
              style={{ width: '100%', padding: '0.875rem', border: '2px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', fontSize: '1rem', fontFamily: 'monospace', fontWeight: 600, textTransform: 'uppercase', transition: 'border-color var(--transition-fast)', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-green)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              required
            />
          </div>

          {error && (
            <div style={{ padding: '0.875rem', background: 'var(--error-light)', border: '1px solid var(--error)', borderRadius: 'var(--border-radius-md)', color: 'var(--error-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '1rem', background: loading ? 'var(--neutral-400)' : 'linear-gradient(135deg, var(--accent-red) 0%, var(--accent-red-dark) 100%)', color: 'white', border: 'none', borderRadius: 'var(--border-radius-md)', fontSize: '1.05rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all var(--transition-normal)', boxShadow: loading ? 'none' : 'var(--shadow-md)' }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = 'var(--shadow-lg)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'var(--shadow-md)')}
          >
            {loading ? 'Verifica in corso...' : 'Accedi'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <a href="/admin/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-red)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Accesso Admin →
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
