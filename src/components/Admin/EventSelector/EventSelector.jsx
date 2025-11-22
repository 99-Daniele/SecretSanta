import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useEvent } from '../../../context/EventContext';
import EventCreator from '../EventCreator/EventCreator';
import styles from './EventSelector.module.css';

const EventSelector = () => {
  const [showCreator, setShowCreator] = useState(false);
  const { signOut } = useAuth();
  const { events, loading, fetchEvents, setCurrentEvent } = useEvent();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSelectEvent = (event) => {
    setCurrentEvent(event);
    navigate('/admin/dashboard/info');
  };

  const handleEventCreated = (newEvent) => {
    setShowCreator(false);
    setCurrentEvent(newEvent);
    navigate('/admin/dashboard/info');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (showCreator) {
    return (
      <EventCreator
        onEventCreated={handleEventCreated}
        onCancel={() => setShowCreator(false)}
      />
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🎅 Secret Santa Admin</h1>
          <p className={styles.subtitle}>Seleziona un evento o creane uno nuovo</p>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.createButton}
            onClick={() => setShowCreator(true)}
          >
            ➕ Crea Nuovo Evento
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Caricamento eventi...</div>
        ) : events.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🎄</div>
            <div className={styles.emptyText}>
              Nessun evento creato ancora
            </div>
            <p>Clicca su "Crea Nuovo Evento" per iniziare</p>
          </div>
        ) : (
          <div className={styles.eventsList}>
            {events.map((event) => (
              <div
                key={event.id}
                className={styles.eventCard}
                onClick={() => handleSelectEvent(event)}
              >
                <div className={styles.eventIcon}>🎁</div>
                <h2 className={styles.eventName}>{event.nome_evento}</h2>
                <div className={styles.eventCode}>
                  Codice: {event.event_code}
                </div>
                <div className={styles.eventMeta}>
                  <div>
                    📅 Anno: {event.anno}
                  </div>
                  <div>
                    🎯 Apertura: {formatDate(event.data_apertura)}
                  </div>
                  <div>
                    <span className={`${styles.status} ${event.is_active ? styles.statusActive : styles.statusInactive}`}>
                      {event.is_active ? 'Attivo' : 'Archiviato'}
                    </span>
                    {event.extraction_done && (
                      <span className={`${styles.status} ${styles.statusExtracted}`}>
                        Estratto
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSelector;
