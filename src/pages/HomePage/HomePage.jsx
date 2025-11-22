import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import { supabase } from '../../utils/supabaseClient';
import ThemeToggle from '../../components/Shared/ThemeToggle';
import styles from './HomePage.module.css';

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

    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .select('*')
      .eq('event_id', event.id)
      .eq('access_code', participantCode.toUpperCase())
      .single();

    if (participantError || !participant) {
      setError('Codice partecipante non valido');
      setLoading(false);
      return;
    }

    navigate(`/participant/${eventCode}/${participantCode.toUpperCase()}`);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <ThemeToggle />
      <div className={styles.card}>
        <div className={styles.centerHeader}>
          <div className={styles.gift}>🎁</div>
          <h1 className={styles.title}>Secret Santa</h1>
          <p className={styles.subtitle}>Inserisci i tuoi codici per accedere</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {error && (
            <div className={styles.error}>
              <span>⚠</span> {error}
            </div>
          )}
          <div>
            <label className={styles.label}>
              Codice Evento
            </label>
            <input
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value.toUpperCase())}
              className={`${styles.input} ${styles.inputAccentRed}`}
              required
            />
          </div>

          <div>
            <label className={styles.label}>
              Codice Partecipante
            </label>
            <input
              value={participantCode}
              onChange={(e) => setParticipantCode(e.target.value.toUpperCase())}
              className={`${styles.input} ${styles.inputAccentGreen}`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submit} ${loading ? styles.submitLoading : ''}`}
          >
            {loading ? 'Verifica in corso...' : 'Accedi'}
          </button>
        </form>

        <div className={styles.footer}>
          <a href="/admin/login" className={styles.adminLink}>
            Accesso Admin
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
