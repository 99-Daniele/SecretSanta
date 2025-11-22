import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvent } from '../../context/EventContext';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { currentEvent } = useEvent();
  const navigate = useNavigate();

  useEffect(() => {
    // If no event is selected, redirect to event selection
    if (!currentEvent) {
      navigate('/admin/dashboard');
    }
  }, [currentEvent, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleBackToEvents = () => {
    navigate('/admin/dashboard');
  };

  if (!currentEvent) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={styles.dashboard}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <div className={styles.logo}>
            🎅 Secret Santa Admin
            {currentEvent && (
              <span className={styles.eventName}>
                - {currentEvent.nome_evento}
              </span>
            )}
          </div>
          
          <div className={styles.navLinks}>
            <NavLink
              to="/admin/dashboard/info"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              📋 Info & Regole
            </NavLink>
            <NavLink
              to="/admin/dashboard/participants"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              👥 Partecipanti
            </NavLink>
            <NavLink
              to="/admin/dashboard/extraction"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              🎁 Estrazione
            </NavLink>
          </div>
        </div>

        <div className={styles.navRight}>
          <button className={styles.backButton} onClick={handleBackToEvents}>
            ← Eventi
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
