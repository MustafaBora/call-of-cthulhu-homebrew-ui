import { useState } from "react";
import PlayersList from "./PlayersList";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  if (isLoggedIn) {
    return <PlayersList />;   // ✅ login olduysa direkt listeyi göster
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        // 400 / 401 / 500 vs
        throw new Error("Giriş başarısız. Kullanıcı adı veya şifre yanlış olabilir.");
      }

      const data = await response.json();
      // data = { token: "...", username: "aaa" }

      // Token'ı localStorage'a kaydet
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      alert("Hoş geldin " + data.username + "!");
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // DTO’ya göre ayarla:
          username: email.split("@")[0], // basit bir şey, istersen ayrı input da açarız
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Kayıt başarısız. Bilgileri kontrol edin.");
      }

      alert("Kayıt başarılı! Şimdi giriş yapabilirsin.");
      setIsRegistering(false); // formu tekrar login moduna al
    } catch (err) {
      console.error(err);
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>D100 Login</h2>
        <p style={styles.subtitle}>Devam etmek için giriş yap</p>

        <h2 style={styles.title}>D100 {isRegistering ? "Register" : "Login"}</h2>

        <form
          onSubmit={isRegistering ? handleRegister : handleSubmit}
          style={styles.form}
        >
          <label style={styles.label}>
            E-posta
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="bora@asd.com"
            />
          </label>

          <label style={styles.label}>
            Şifre
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••"
            />
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting
              ? (isRegistering ? "Kayıt olunuyor..." : "Giriş yapılıyor...")
              : (isRegistering ? "Kayıt ol" : "Giriş yap")}
          </button>

          <button
            type="button"
            style={{ ...styles.button, marginTop: "0.5rem", background: "#0ea5e9" }}
            onClick={() => {
              setError("");
              setIsRegistering(!isRegistering);
            }}
          >
            {isRegistering
              ? "Zaten hesabın var mı? Giriş yap"
              : "Hesabın yok mu? Kayıt ol"}
          </button>
        </form>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    background: "#020617",
    padding: "2rem 2.5rem",
    borderRadius: "1rem",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    width: "100%",
    maxWidth: "400px",
    color: "#e5e7eb",
    border: "1px solid #1e293b",
  },
  title: {
    margin: 0,
    marginBottom: "0.25rem",
    fontSize: "1.5rem",
    textAlign: "center",
  },
  subtitle: {
    margin: 0,
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
    color: "#9ca3af",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  label: {
    fontSize: "0.85rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
  },
  input: {
    padding: "0.55rem 0.7rem",
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    background: "#020617",
    color: "#e5e7eb",
    outline: "none",
  },
  error: {
    fontSize: "0.8rem",
    color: "#fecaca",
    background: "#7f1d1d",
    padding: "0.5rem 0.7rem",
    borderRadius: "0.5rem",
    marginTop: "0.25rem",
  },
  button: {
    marginTop: "0.75rem",
    padding: "0.6rem 0.7rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "#22c55e",
    color: "#022c22",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default LoginPage;
