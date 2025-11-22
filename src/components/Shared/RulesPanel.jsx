import { useState } from 'react';
import styles from './RulesPanel.module.css';

const RulesPanel = ({ event, loading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // 'info', 'regole', 'istruzioni'

  if (!event && !loading) {
    return null;
  }

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  if (!isOpen) {
    return (
      <div className={styles.rulesPanel}>
        <button
          className={styles.collapsedButton}
          onClick={() => setIsOpen(true)}
        >
          Info & Regole
        </button>
      </div>
    );
  }

  return (
    <div className={styles.rulesPanel}>
      <div className={`${styles.expandedPanel} ${isOpen ? styles.panelVisible : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {event?.nome_evento || 'Secret Santa'}
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
              {/* INFO EVENTO */}
              <div className={styles.accordionItem}>
                <button
                  className={`${styles.accordionHeader} ${activeSection === 'info' ? styles.active : ''}`}
                  onClick={() => toggleSection('info')}
                >
                  <span>Informazioni Evento</span>
                  <span className={styles.accordionIcon}>{activeSection === 'info' ? '−' : '+'}</span>
                </button>
                <div className={`${styles.accordionContent} ${activeSection === 'info' ? styles.accordionOpen : ''}`}>
                  {event?.budget_min && event?.budget_max && (
                    <div className={styles.infoItem}>
                      <strong>Budget:</strong> €{event.budget_min} - €{event.budget_max}
                    </div>
                  )}
                  {event?.anno && (
                    <div className={styles.infoItem}>
                      <strong>Anno:</strong> {event.anno}
                    </div>
                  )}
                  {event?.data_apertura && (
                    <div className={styles.infoItem}>
                      <strong>Apertura regali:</strong>{' '}
                      {new Date(event.data_apertura).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* REGOLE */}
              {event?.regole_testo && (
                <div className={styles.accordionItem}>
                  <button
                    className={`${styles.accordionHeader} ${activeSection === 'regole' ? styles.active : ''}`}
                    onClick={() => toggleSection('regole')}
                  >
                    <span>Regole</span>
                    <span className={styles.accordionIcon}>{activeSection === 'regole' ? '−' : '+'}</span>
                  </button>
                  <div className={`${styles.accordionContent} ${activeSection === 'regole' ? styles.accordionOpen : ''}`}>
                    <div className={styles.textContent}>{event.regole_testo}</div>
                  </div>
                </div>
              )}

              {/* ISTRUZIONI */}
              {event?.note_admin && (
                <div className={styles.accordionItem}>
                  <button
                    className={`${styles.accordionHeader} ${activeSection === 'istruzioni' ? styles.active : ''}`}
                    onClick={() => toggleSection('istruzioni')}
                  >
                    <span>Istruzioni</span>
                    <span className={styles.accordionIcon}>{activeSection === 'istruzioni' ? '−' : '+'}</span>
                  </button>
                  <div className={`${styles.accordionContent} ${activeSection === 'istruzioni' ? styles.accordionOpen : ''}`}>
                    <div className={styles.textContent}>{event.note_admin}</div>
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
