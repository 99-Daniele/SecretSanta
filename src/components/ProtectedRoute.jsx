import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './ProtectedRoute.module.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className={styles.loadingWrapper}>Caricamento...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
