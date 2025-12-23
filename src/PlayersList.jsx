import { useEffect, useState } from "react";

function getInitials(text) {
  if (!text) return "?";
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// Meta alanları ve diğer skill olmayan özellikler
const IGNORED_KEYS = [
  "id",
  "player",
  "name",
  "occupation",
  "age",
  "sex",
  "residence",
  "birthplace",
  "avatar",
  "totalXP",
  "usedXP",
  "remainingXP",
  "LanguageOwn",
];

function formatLabel(key) {
  // CamelCase'i ayır ve boşluk ekle
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')  // küçük+büyük: "gB" -> "g B"
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2'); // büyük+büyük+küçük: "FBr" -> "F Br"
}

function getTopSkills(playerData, count = 6) {
  if (!playerData) return [];
  
  const entries = Object.entries(playerData).filter(([key, value]) => {
    // Sadece sayısal değerleri ve ignored listesinde olmayanları al
    return (
      !IGNORED_KEYS.includes(key) &&
      typeof value === "number" &&
      value > 0
    );
  });
  
  // Değere göre sırala (büyükten küçüğe)
  entries.sort((a, b) => b[1] - a[1]);
  
  // İlk N tanesini al
  return entries.slice(0, count);
}

function PlayersList({ onEditPlayer, onNewPlayer, onCharacterForm }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token bulunamadı. Lütfen tekrar giriş yap.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8080/players", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Oyuncu listesi alınamadı.");
        }

        const data = await response.json();
        setPlayers(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Bilinmeyen bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return <div style={styles.page}>Yükleniyor...</div>;
  }

  if (error) {
    return <div style={styles.page}>Hata: {error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.cardWrapper}>
        {/* BAŞLIK + YENİ OYUNCU BUTONU */}
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Oyuncu Listesi</h2>
          {onNewPlayer && (
            <button
              type="button"
              style={styles.newPlayerButton}
              onClick={onNewPlayer}
            >
              + Yeni Oyuncu
            </button>
          )}
        </div>

        <div style={styles.grid}>
          {players.map((p) => (
            <div key={p.id} style={styles.card}>
              {/* Üst kısım: avatar + isimler */}
              <div style={styles.cardHeader}>
                <div style={styles.avatarWrapper}>
                  {p.avatar ? (
                    <img
                      src={`data:image/*;base64,${p.avatar}`}
                      alt={p.name || p.player || "Avatar"}
                      style={styles.avatarImg}
                    />
                  ) : (
                    <div style={styles.avatarFallback}>
                      {getInitials(p.name || p.player)}
                    </div>
                  )}
                </div>
                <div style={styles.headerText}>
                  <div style={styles.nameLine}>
                    {p.name || "İsimsiz karakter"}
                  </div>
                  <div style={styles.subLine}>
                    <span style={styles.playerName}>
                      {p.player || "Oyuncu adı yok"}
                    </span>
                    {p.occupation && (
                      <>
                        <span style={styles.dot}>•</span>
                        <span style={styles.occupation}>{p.occupation}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Küçük statlar */}
              <div style={styles.statsRow}>
                {getTopSkills(p, 6).map(([key, value]) => (
                  <span key={key}>
                    {key}: {value}
                  </span>
                ))}
              </div>

              {/* Alt kısım: butonlar */}
              <div style={styles.cardFooter}>
                <button
                  type="button"
                  style={styles.editButton}
                  onClick={() => onEditPlayer && onEditPlayer(p)}
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  style={styles.characterSheetButton}
                  onClick={(e) => {
                    e.preventDefault();
                    localStorage.setItem('characterData', JSON.stringify(p));
                    window.open('/CoCCharacter.html', '_blank');
                  }}
                >
                  CharacterSheet
                </button>
                <button
                  type="button"
                  style={styles.editCharacterButton}
                  onClick={() => onCharacterForm && onCharacterForm(p)}
                >
                  Edit
                </button>
              </div>

              <a
                href={`http://localhost:8080/players/${p.id}/sheet.html`}
                target="_blank"
                rel="noreferrer"
                style={styles.printButton}
              >
                Çıktı (HTML)
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "2rem",
    background: "#facc15", // sarımsı arka plan
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#111827",
  },
  cardWrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 700,
  },
  newPlayerButton: {
    padding: "0.5rem 0.9rem",
    borderRadius: "0.5rem",
    border: "1px solid #92400e",
    background: "#fbbf24",
    color: "#451a03",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "0.5rem 0.75rem",
    maxHeight: "60vh",
    overflowY: "auto",
    padding: "0.5rem",
    background: "#fefce8",
    borderRadius: "0.75rem",
    border: "1px solid #eab308",
    fontSize: "0.75rem", // biraz küçülttük
  },
  card: {
    background: "#fefce8",
    borderRadius: "0.9rem",
    border: "1px solid #eab308",
    padding: "0.9rem 1rem",
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "0.75rem",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatarWrapper: {
    width: "120px",
    height: "120px",
    borderRadius: "999px",
    overflow: "hidden",
    border: "3px solid #f97316",
    background: "linear-gradient(135deg, #f97316, #e11d48)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarFallback: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#fefce8",
  },
  headerText: {
    display: "flex",
    flexDirection: "column",
    gap: "0.1rem",
    overflow: "hidden",
  },
  nameLine: {
    fontWeight: 700,
    fontSize: "1rem",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  subLine: {
    fontSize: "0.8rem",
    color: "#4b5563",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    flexWrap: "wrap",
  },
  playerName: {
    fontWeight: 500,
  },
  dot: {
    fontSize: "0.7rem",
  },
  occupation: {
    fontStyle: "italic",
  },
  statsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem 0.6rem",
    fontSize: "0.75rem",
    color: "#4b5563",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "0.25rem",
  },
  editButton: {
    padding: "0.45rem 0.9rem",
    borderRadius: "0.35rem",
    border: "1px solid #7c2d12",
    background: "linear-gradient(135deg, #f97316, #db2777)",
    color: "#111827",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },
  characterSheetButton: {
    padding: "0.45rem 0.9rem",
    borderRadius: "0.35rem",
    border: "1px solid #7c2d12",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#111827",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },
  editCharacterButton: {
    padding: "0.45rem 0.9rem",
    borderRadius: "0.35rem",
    border: "1px solid #7c2d12",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "#111827",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },
  printButton: {
    display: "inline-block",
    marginTop: "0.5rem",
    padding: "0.4rem 0.7rem",
    borderRadius: "0.4rem",
    border: "1px solid #78350f",
    background: "#fbbf24",
    color: "#451a03",
    fontSize: "0.8rem",
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
  },
};

export default PlayersList;
