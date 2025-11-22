import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ThemeToggle from "../../Shared/ThemeToggle";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Inserisci email e password");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await signIn(email, password);

      if (signInError) {
        setError("Credenziali admin non valide");
        return;
      }

      if (data) {
        navigate("/admin/dashboard");
      }
    } catch {
      setError("Errore durante il login. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <ThemeToggle />
      <div className={styles.loginCard}>
        <div className={styles.logo}>🎅</div>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Accedi al pannello di gestione</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>

        <div className={styles.backLink}>
          <Link to="/">← Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
