import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "./config";
import LanguageSwitcher from "./LanguageSwitcher";
import defaultAvatar from "./assets/default-avatar.png";

// Meta alanları ve listede göstermeyeceğimiz alanlar
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

function getSampleOfflinePlayers() {
  const now = Date.now();
  const make = (idOffset, data) => ({
    id: now + idOffset,
    totalXP: 200000,
    usedXP: 151000 + idOffset * 3000,
    remainingXP: 200000 - (151000 + idOffset * 3000),
    level: 5,
    avatar: "",
    ...data,
  });

  return [
    make(1, {
      player: "Keeper",
      name: "Ada Blackwood",
      occupation: "Antiquarian",
      age: 32,
      residence: "Arkham",
      STA: 40,
      AGI: 45,
      EDU: 55,
      INT: 60,
      LUCK: 45,
      SIZ: 31,
      STR: 35,
      WILL: 50,
      STATUS: 15,
      LibraryUse: 60,
      History: 55,
      Occult: 40,
      Anthropology: 35,
      Listen: 50,
      Spot: 45,
      SPOT: 45,
    }),
    make(2, {
      player: "Keeper",
      name: "Malik Farouq",
      occupation: "Explorer",
      age: 29,
      residence: "Cairo",
      STA: 50,
      AGI: 55,
      EDU: 40,
      INT: 45,
      LUCK: 35,
      SIZ: 33,
      STR: 45,
      WILL: 40,
      STATUS: 8,
      Climb: 55,
      Navigate: 50,
      Survival: 45,
      "Firearms Rifle Shotgun": 50,
      "Drive Auto": 45,
      Listen: 40,
      SPOT: 42,
    }),
    make(3, {
      player: "Keeper",
      name: "Lena Torres",
      occupation: "Detective",
      age: 34,
      residence: "Boston",
      STA: 45,
      AGI: 55,
      EDU: 50,
      INT: 55,
      LUCK: 40,
      SIZ: 32,
      STR: 38,
      WILL: 55,
      STATUS: 12,
      Persuade: 55,
      Psychology: 50,
      Stealth: 45,
      "Firearms Handgun": 55,
      FastTalk: 45,
      Listen: 48,
      SPOT: 50,
    }),
  ];
}

function formatLabel(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

function getTopSkills(playerData, count = 6) {
  if (!playerData) return [];
  const entries = Object.entries(playerData).filter(([key, value]) => (
    !IGNORED_KEYS.includes(key) && typeof value === "number" && value > 0
  ));
  entries.sort((a, b) => b[1] - a[1]);
  return entries.slice(0, count);
}

function sortByIdDesc(arr) {
  return [...arr].sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0));
}

function PlayersList({ onEditPlayer, onNewPlayer, onCharacterForm }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [offlineMode, setOfflineMode] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      setError("");

      const loadOffline = () => {
        console.log("[PlayersList] Offline mode'a geçiliyor");
        const stored = JSON.parse(localStorage.getItem("offlinePlayers") || "[]");
        const next = stored.length ? stored : getSampleOfflinePlayers();
        localStorage.setItem("offlinePlayers", JSON.stringify(next));
        setPlayers(sortByIdDesc(next));
        setOfflineMode(true);
      };

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          loadOffline();
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/players`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(`[PlayersList] Response status: ${response.status}`);
        if (!response.ok) {
          throw new Error("Oyuncu listesi alınamadı.");
        }

        const data = await response.json();
        console.log("[PlayersList] Players başarıyla yüklendi:", data.length);
        setPlayers(sortByIdDesc(data));
        setOfflineMode(false);
      } catch (err) {
        console.error(err);
        setError("Sunucuya ulaşılamadı, yerel veriler gösteriliyor.");
        loadOffline();
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleImportJSON = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus(t("players.importing"));
    setError("");

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const token = localStorage.getItem("token");
      const useBackend = !!token && !offlineMode;

      if (!useBackend) {
        const withId = { ...data, id: data?.id ?? Date.now() };
        const stored = JSON.parse(localStorage.getItem("offlinePlayers") || "[]");
        const next = sortByIdDesc([...stored, withId]);
        localStorage.setItem("offlinePlayers", JSON.stringify(next));
        setPlayers(next);
      } else {
        const response = await fetch(`${API_BASE_URL}/players`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(t("players.importFailed"));
        }

        const newPlayer = await response.json();
        setPlayers((prev) => sortByIdDesc([...prev, newPlayer]));
      }
      setImportStatus(t("players.importSuccess"));
      setTimeout(() => setImportStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "JSON dosyası okunamadı.");
      setImportStatus("");
    }

    // Reset input
    event.target.value = "";
  };

  if (loading) {
    return <div style={styles.page}>{t("players.loading")}</div>;
  }

  if (error && !offlineMode) {
    return <div style={styles.page}>{t("players.errorPrefix")}: {error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.cardWrapper}>
        {offlineMode && (
          <div style={styles.offlineBanner}>
            Offline mod: Sunucuya ulaşılamadı, veriler tarayıcıda saklanıyor.
          </div>
        )}
        <div style={styles.headerRow}>
          <h2 style={styles.title}>{t("players.title")}</h2>
          <div style={styles.buttonGroup}>
            <LanguageSwitcher variant="compact" />
            <label style={styles.importButton}>
              {t("players.importJson")}
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportJSON}
                style={styles.fileInput}
              />
            </label>
            <button
              type="button"
              style={styles.importButton}
              onClick={() => {
                const json = JSON.stringify(players, null, 2);
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `coc-players-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Listeyi İndir (JSON)
            </button>
            {onNewPlayer && (
              <button
                type="button"
                style={styles.newPlayerButton}
                onClick={onNewPlayer}
              >
                + {t("players.newPlayer")}
              </button>
            )}
          </div>
        </div>
        {importStatus && (
          <div style={styles.importStatus}>{importStatus}</div>
        )}

        <div style={styles.grid}>
          {onNewPlayer && (
            <button
              type="button"
              style={styles.addCard}
              onClick={onNewPlayer}
              aria-label={t("players.newPlayer")}
            >
              <div style={styles.addCardIcon}>+</div>
              <div style={styles.addCardText}>{t("players.addNew")}</div>
            </button>
          )}
          {players.map((p) => (
            <div key={p.id} style={styles.card}>
              <div style={styles.cardRow}>
                <div
                  style={{ ...styles.avatarWrapper, cursor: onEditPlayer ? "pointer" : styles.avatarWrapper.cursor }}
                  onClick={() => onEditPlayer && onEditPlayer(p)}
                  role={onEditPlayer ? "button" : undefined}
                  tabIndex={onEditPlayer ? 0 : undefined}
                >
                  <img
                    src={p.avatar ? `data:image/*;base64,${p.avatar}` : defaultAvatar}
                    alt={p.name || p.player || "Avatar"}
                    style={styles.avatarImg}
                  />
                </div>
                <div style={styles.contentCol}>
                  <div style={styles.headerText}>
                    <div style={styles.nameLine}>
                      {p.name || t("players.unnamed")}
                    </div>
                    <div style={styles.subLine}>
                      <span style={styles.playerName}>
                        {p.player || t("players.unknownPlayer")}
                      </span>
                      {p.occupation && (
                        <>
                          <span style={styles.dot}>•</span>
                          <span style={styles.occupation}>{p.occupation}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={styles.statsRow}>
                    {getTopSkills(p, 6).map(([key, value]) => (
                      <span key={key}>
                        {formatLabel(key)}: {value}
                      </span>
                    ))}
                  </div>

                  <div style={styles.cardFooter}>
                    <button
                      type="button"
                      style={styles.editButton}
                      onClick={() => onEditPlayer && onEditPlayer(p)}
                    >
                      {t("players.edit")}
                    </button>
                    {/*}
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
                    */}
                  </div>
                  {/*}
                  <a
                    href={`${API_BASE_URL}/players/${p.id}/sheet.html`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...styles.printButton, alignSelf: 'flex-start' }}
                  >
                    Çıktı (HTML)
                  </a>
                  */}
                </div>
              </div>
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
  buttonGroup: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  importButton: {
    padding: "0.5rem 0.9rem",
    borderRadius: "0.5rem",
    border: "1px solid #7c2d12",
    background: "#8b5cf6",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
    display: "inline-block",
  },
  fileInput: {
    display: "none",
  },
  importStatus: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    background: "#22c55e",
    color: "#fff",
    fontSize: "0.9rem",
    marginBottom: "1rem",
    textAlign: "center",
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
  addCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.35rem",
    width: "100%",
    background: "#fff7ed",
    borderRadius: "0.9rem",
    border: "2px dashed #f59e0b",
    color: "#7c2d12",
    padding: "1rem",
    minHeight: "140px",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
    transition: "transform 120ms ease, box-shadow 120ms ease",
  },
  addCardIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #f59e0b",
    fontSize: "1.5rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #fbbf24, #c97316)",
  },
  addCardText: {
    fontWeight: 700,
    fontSize: "0.95rem",
  },
      grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "0.5rem 0.75rem",
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
  },
  cardRow: {
    display: "flex",
    alignItems: "stretch",
    gap: "1rem",
  },
  contentCol: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    flex: 1,
    minWidth: 0,
  },
  avatarWrapper: {
    width: "200px",
    minHeight: "140px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "3px solid #c97316",
    background: "linear-gradient(135deg, #c97316, #e11d48)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    alignSelf: "stretch",
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
    background: "linear-gradient(135deg, #c97316, #db2777)",
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
  offlineBanner: {
    background: "#7c2d12",
    color: "#fecdd3",
    padding: "0.6rem 0.9rem",
    borderRadius: "0.6rem",
    marginBottom: "0.9rem",
    fontWeight: 700,
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
