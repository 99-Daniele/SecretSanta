import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import CountdownBar from './CountdownBar';
import RulesPanel from './RulesPanel';
import styles from './TopBar.module.css';

const TopBar = ({ eventName, targetDate, event, participant }) => {
  const { theme, toggleTheme } = useTheme();
  const [showRules, setShowRules] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getInitials = () => {
    if (!participant) return '?';
    const firstInitial = participant.nome?.charAt(0) || '';
    const lastInitial = participant.cognome?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleLogout = () => {
    // Redirect to home
    window.location.href = '/';
  };

  return (
    <>
      <div className={styles.topBar}>
        {/* Left section: Event name + Theme toggle */}
        <div className={styles.leftSection}>
          <span className={styles.eventName}>{eventName}</span>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Passa a tema ${theme === 'light' ? 'scuro' : 'chiaro'}`}
            title={`Tema ${theme === 'light' ? 'chiaro' : 'scuro'} attivo`}
          >
            <span className={styles.themeIcon}>
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
          </button>
        </div>

        {/* Center section: Countdown */}
        <div className={styles.centerSection}>
          <CountdownBar targetDate={targetDate} eventName={eventName} showEventName={false} />
        </div>

        {/* Right section: Rules button + User menu */}
        <div className={styles.rightSection}>
          <button
            onClick={() => setShowRules(!showRules)}
            className={styles.rulesButton}
          >
            <span className={styles.rulesIcon}>ℹ️</span>
            <span className={styles.rulesText}>Info</span>
          </button>

          {participant && (
            <div className={styles.userMenuContainer}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={styles.userAvatar}
                aria-label="Menu utente"
              >
                {getInitials()}
              </button>

              {showUserMenu && (
                <div className={styles.userDropdown}>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>
                      {participant.nome} {participant.cognome}
                    </div>
                    <div className={styles.userEmail}>{participant.email}</div>
                  </div>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rules Panel - now controlled by button */}
      {showRules && event && (
        <RulesPanel event={event} isOpen={showRules} onClose={() => setShowRules(false)} />
      )}
    </>
  );
};

export default TopBar;
