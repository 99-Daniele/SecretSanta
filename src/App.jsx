import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage/HomePage';
import ParticipantView from './pages/ParticipantView/ParticipantView';
import AdminLogin from './components/Admin/AdminLogin/AdminLogin';
import EventSelector from './components/Admin/EventSelector/EventSelector';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import InfoRulesEditor from './components/Admin/InfoRulesEditor/InfoRulesEditor';
import ParticipantsPage from './components/Admin/ParticipantsTable/ParticipantsPage';
import ExtractionPage from './components/Admin/ExtractionPage/ExtractionPage';

import './styles/globals.css';
import ThemeToggle from './components/Shared/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <Router>
          <ThemeToggle />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/participant/:eventCode/:participantCode" element={<ParticipantView />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <EventSelector />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="info" element={<InfoRulesEditor />} />
              <Route path="participants" element={<ParticipantsPage />} />
              <Route path="extraction" element={<ExtractionPage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard/info" replace />} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </EventProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
