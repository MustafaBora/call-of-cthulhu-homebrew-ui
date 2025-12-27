import { useTranslation } from "react-i18next";

function LanguageSwitcher({ variant = "default" }) {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "EN", flag: "EN" },
    { code: "de", label: "DE", flag: "DE" },
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
  },
  button: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.4rem 0.7rem",
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    background: "#020617",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
  buttonActive: {
    background: "#22c55e",
    color: "#022c22",
    borderColor: "#22c55e",
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
  },
  compactButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "0.4rem",
    border: "1px solid #374151",
    background: "#020617",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s ease",
  },
  compactButtonActive: {
    background: "#22c55e",
    borderColor: "#22c55e",
    transform: "scale(1.1)",
  },
};

export default LanguageSwitcher;
