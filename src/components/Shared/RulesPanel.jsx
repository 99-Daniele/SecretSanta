import { useState } from 'react';
import Countdown from './Countdown';
import styles from './RulesPanel.module.css';

const RulesPanel = ({ event, loading = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!event && !loading) {
    return null;
  }

  if (!isOpen) {
    return (
      <div className={styles.rulesPanel}>
        <button
          className={styles.collapsedButton}
          onClick={() => setIsOpen(true)}
        >
          📋 Info & Regole
        </button>
      </div>
    );
  }

  return (
    <div className={styles.rulesPanel}>
      <div className={styles.expandedPanel}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            🎅 {event?.nome_evento || 'Secret Santa'}
          </h2>
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>Caricamento...</div>
          ) : (
            <>
              {event?.budget_min && event?.budget_max && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    💰 Budget Suggerito
                  </div>
                  <div className={styles.sectionContent}>
                    <div className={styles.budget}>
                      €{event.budget_min} - €{event.budget_max}
                    </div>
                  </div>
                </div>
              )}

              {event?.data_apertura && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    ⏰ Apertura Regali
                  </div>
                  <div className={styles.sectionContent}>
                    <Countdown targetDate={event.data_apertura} />
                  </div>
                </div>
              )}

              {event?.regole_testo && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    📜 Regole
                  </div>
                  <div className={styles.sectionContent}>
                    <div className={styles.notes}>{event.regole_testo}</div>
                  </div>
                </div>
              )}

              {event?.note_admin && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    📝 Note Importanti
                  </div>
                  <div className={styles.sectionContent}>
                    <div className={styles.notes}>{event.note_admin}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RulesPanel;
