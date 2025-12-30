import { useState } from "react";
import { useTranslation } from "react-i18next";
import PlayersList from "./PlayersList";
import PlayerForm from "./PlayerForm";
import CocCharacterForm from "./CocCharacterForm";
import LanguageSwitcher from "./LanguageSwitcher";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { t } = useTranslation();

  // login sonrası görünüm
  const [mode, setMode] = useState("list"); // "list" | "new" | "edit" | "characterForm"
  const [editingPlayer, setEditingPlayer] = useState(null);

  // 🔹 LOGIN OLDUKTAN SONRA GÖRÜNEN KISIM
  if (isLoggedIn) {
    return (
      <>
        {mode === "list" && (
          <PlayersList
            onEditPlayer={(p) => {
              setEditingPlayer(p);
              setMode("edit");
            }}
            onNewPlayer={() => setMode("new")}
            onCharacterForm={(p) => {
              setEditingPlayer(p);
              setMode("characterForm");
            }}
          />
        )}

        {mode === "new" && (
          <PlayerForm
            mode="create"
            player={null}
            onCancel={() => setMode("list")}
            onCreated={() => {
              // create sonrası listeye dön
              setMode("list");
            }}
          />
        )}

        {mode === "edit" && editingPlayer && (
          <PlayerForm
            mode="edit"
            player={editingPlayer}
            onCancel={() => {
              setEditingPlayer(null);
              setMode("list");
            }}
            onUpdated={(_, { stay } = {}) => {
              if (!stay) {
                // "Kaydet ve Geri Dön" ise listeye dön
                setEditingPlayer(null);
                setMode("list");
              }
              // "Kaydet ve Sayfada Kal" ise form üzerinde kalmaya devam,
              // istersen burada state güncellemesi de yapabilirsin
            }}
          />
        )}

        {mode === "characterForm" && editingPlayer && (
          <CocCharacterForm
            player={editingPlayer}
            onCancel={() => {
              setEditingPlayer(null);
              setMode("list");
            }}
          />
        )}
      </>
    );
  }
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:2999/auth/login", {
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
        throw new Error(
          "Giriş başarısız. Kullanıcı adı veya şifre yanlış olabilir."
        );
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

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
      const response = await fetch("http://localhost:2999/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email.split("@")[0],
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Kayıt başarısız. Bilgileri kontrol edin.");
      }

      setIsRegistering(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      position: "relative",
    },
    languageSwitcherWrapper: {
      position: "absolute",
      top: "1rem",
      right: "1rem",
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

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.languageSwitcherWrapper}>
          <LanguageSwitcher variant="compact" />
        </div>
        <h2 style={styles.title}>
          {isRegistering ? t("login.titleRegister") : t("login.titleLogin")}
        </h2>
        <p style={styles.subtitle}>
          {isRegistering
            ? t("login.subtitleRegister")
            : t("login.subtitleLogin")}
        </p>

        <form
          onSubmit={isRegistering ? handleRegister : handleSubmit}
          style={styles.form}
        >
          <label style={styles.label}>
            {t("login.email")}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder={t("login.placeholderEmail")}
            />
          </label>

          <label style={styles.label}>
            {t("login.password")}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder={t("login.placeholderPassword")}
            />
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting
              ? isRegistering
                ? t("login.submittingRegister")
                : t("login.submittingLogin")
              : isRegistering
              ? t("login.submitRegister")
              : t("login.submitLogin")}
          </button>

          <button
            type="button"
            style={{
              ...styles.button,
              marginTop: "0.5rem",
              background: "#0ea5e9",
            }}
            onClick={() => {
              setError("");
              setIsRegistering(!isRegistering);
            }}
          >
            {isRegistering
              ? t("login.toggleToLogin")
              : t("login.toggleToRegister")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
