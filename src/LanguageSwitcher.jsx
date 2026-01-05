import { useTranslation } from "react-i18next";

function LanguageSwitcher({ variant = "default" }) {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "EN", flag: "EN" },
    { code: "de", label: "DE", flag: "DE" },
    { code: "fr", label: "FR", flag: "FR" },
    { code: "nl", label: "NL", flag: "NL" },
    { code: "tr", label: "TR", flag: "TR" },
  ];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  if (variant === "compact") {
    return (
      <div style={styles.compactContainer}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            style={{
              ...styles.compactButton,
              ...(i18n.language === lang.code ? styles.compactButtonActive : {}),
            }}
            title={lang.label}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          style={{
            ...styles.button,
            ...(i18n.language === lang.code ? styles.buttonActive : {}),
          }}
        >
          <span style={styles.flag}>{lang.flag}</span>
          <span style={styles.label}>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  button: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.4rem 0.7rem",
    borderRadius: "0.5rem",
    border: "2px solid #8b7d6b",
    background: "rgba(245, 243, 230, 0.7)",
    color: "#3e3a2f",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    transition: "all 0.2s ease",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  buttonActive: {
    background: "linear-gradient(135deg, #daa520, #b8860b)",
    color: "#f5f3e8",
    borderColor: "#b8860b",
    boxShadow: "0 4px 10px rgba(218, 165, 32, 0.3), 0 0 15px rgba(218, 165, 32, 0.2)",
  },
  flag: {
    fontSize: "1.1rem",
  },
  label: {
    fontSize: "0.8rem",
  },
  compactContainer: {
    display: "flex",
    gap: "0.25rem",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  compactButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "0.4rem",
    border: "2px solid #8b7d6b",
    background: "rgba(245, 243, 230, 0.7)",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  compactButtonActive: {
    background: "linear-gradient(135deg, #daa520, #b8860b)",
    borderColor: "#b8860b",
    transform: "scale(1.1)",
    boxShadow: "0 4px 10px rgba(218, 165, 32, 0.3), 0 0 15px rgba(218, 165, 32, 0.2)",
  },
};

export default LanguageSwitcher;
