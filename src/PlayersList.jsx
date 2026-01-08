import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "./config";
import LanguageSwitcher from "./LanguageSwitcher";
import defaultAvatar from "./assets/default-avatar.png";
import { useConnectivity } from "./ConnectivityProvider";
/*
import avatarDetective from "./assets/characters/Detective.jpg";
import avatarDoctor from "./assets/characters/doctor.jpg";
import avatarProf from "./assets/characters/Proffesor.jpg";
import avatarEngineer from "./assets/characters/Criminal Girl.jpg";
import avatarAntiquarian from "./assets/characters/Eva.jpg";
import avatarExplorer from "./assets/characters/Seaman.jpg";
import avatarFemale3 from "./assets/characters/Journalist.png";
import avatarArthur from "./assets/characters/Arthur.jpg";
import avatarBilly from "./assets/characters/Billy.jpg";
import avatarBlond from "./assets/characters/blond.png";
import avatarCecilia from "./assets/characters/Cecilia.jpg";
import avatarDikkenek from "./assets/characters/Dikkenek.jpg";
import avatarDomenic from "./assets/characters/Domenic.jpg";
import avatarEleven from "./assets/characters/Eleven.png";
import avatarEvilPriest from "./assets/characters/evil-priest.jpg";
import avatarHughes from "./assets/characters/Hughes.jpg";
import avatarJason from "./assets/characters/Jason.jpg";
import avatarLottie from "./assets/characters/Lottie.jpg";
import avatarNavyOfficer from "./assets/characters/Navy Officer.jpg";
import avatarPaul from "./assets/characters/Paul.png";
import avatarPriest from "./assets/characters/Priest.jpg";
import avatarRosa from "./assets/characters/Rosa.jpg";
import avatarSteve from "./assets/characters/Steve.png";
import avatarThief from "./assets/characters/thief.png";*/
import dbCharacters from "./assets/DB.json";

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
  "avatarLink",
  "totalXP",
  "usedXP",
  "remainingXP",
  "LanguageOwn",
];

function getSampleOfflinePlayers() {
  const now = Date.now();
  
  // Use characters from DB.json with unique IDs
  const dbChars = dbCharacters.map((char, index) => ({
    ...char,
    id: now + index + 1000, // Offset to avoid ID collision
    avatarLink: char.avatarLink, // allow pre-generated avatars delivered via link
    // Map CON/DEX to STA/AGI for frontend consistency
    STA: char.CON || char.STA || 30,
    AGI: char.DEX || char.AGI || 35,
  }));


/*
    const make = (idOffset, data, avatarSrc) => ({
    id: now + idOffset,
    totalXP: 200000,
    usedXP: 151000 + idOffset * 3000,
    remainingXP: 200000 - (151000 + idOffset * 3000),
    level: 5,
    avatar: avatarSrc || "",
    ...data,
  });
  const sampleChars = [
    make(1, {
      player: "Keeper",
      name: "Sarah Mitchell",
      occupation: "Navy Officer",
      age: 28,
      residence: "Portsmouth",
      STA: 60,
      AGI: 55,
      EDU: 45,
      INT: 50,
      LUCK: 40,
      SIZ: 32,
      STR: 45,
      WILL: 50,
      STATUS: 15,
      "Firearms Handgun": 60,
      "Firearms Rifle Shotgun": 55,
      Navigate: 65,
      "Pilot Boat": 55,
      Persuade: 45,
      Command: 50,
      Listen: 48,
    }, avatarFemale3),
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
    }, avatarExplorer),
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
    }, avatarDetective),
    make(4, {
      player: "Keeper",
      name: "Dr. Eleanor Vance",
      occupation: "Medical Doctor",
      age: 42,
      residence: "New York",
      STA: 50,
      AGI: 40,
      EDU: 65,
      INT: 60,
      LUCK: 45,
      SIZ: 30,
      STR: 35,
      WILL: 55,
      STATUS: 18,
      Medicine: 70,
      Psychology: 55,
      "First Aid": 65,
      Persuade: 50,
      Listen: 45,
      CthulhuMythos: 35,
      Science: 40,
    }, avatarDoctor),
    make(5, {
      player: "Keeper",
      name: "Prof. James Whitmore",
      occupation: "Professor of Classics",
      age: 58,
      residence: "Cambridge",
      STA: 40,
      AGI: 35,
      EDU: 70,
      INT: 65,
      LUCK: 40,
      SIZ: 31,
      STR: 30,
      WILL: 50,
      STATUS: 22,
      LibraryUse: 70,
      History: 75,
      Occult: 60,
      Anthropology: 55,
      CthulhuMythos: 45,
      Listen: 40,
      SPOT: 35,
    }, avatarProf),
    make(6, {
      player: "Keeper",
      name: "Ivan Petrov",
      occupation: "Engineer",
      age: 31,
      residence: "Moscow",
      STA: 55,
      AGI: 50,
      EDU: 50,
      INT: 60,
      LUCK: 35,
      SIZ: 34,
      STR: 50,
      WILL: 45,
      STATUS: 10,
      "Mechanical Repair": 65,
      "Electrical Repair": 60,
      "Computer Use": 50,
      Navigate: 45,
      Demolitions: 40,
      "Firearms Other": 35,
      Listen: 42,
    }, avatarEngineer),
    make(7, {
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
    }, avatarAntiquarian),
  ];
*/
  // Return DB characters + sample characters
  return [...dbChars];//, ...sampleChars];
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

function resolveAvatarSrc(player) {
  const normalize = (src) => {
    if (!src) return null;
    if (typeof src === "string" && src.startsWith("data:")) return src;
    if (typeof src === "string" && src.length > 100) return `data:image/*;base64,${src}`;
    if (typeof src === "string") {
      const publicBase = process.env.PUBLIC_URL || "";
      if (src.startsWith("http://") || src.startsWith("https://")) return src;
      if (src.startsWith("/")) return `${publicBase}${src}`;
      return `${publicBase}/${src}`;
    }
    return src;
  };

  return normalize(player?.avatar) || normalize(player?.avatarLink) || defaultAvatar;
}

function PlayersList({ onEditPlayer, onNewPlayer, onCharacterForm }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const { t } = useTranslation();
  const { offlineMode, setOfflineMode, fetchWithTimeout } = useConnectivity();
  const initialFetchRef = useRef(false);

  useEffect(() => {
    if (initialFetchRef.current) return;
    initialFetchRef.current = true;
    const fetchPlayers = async () => {
      setLoading(true);
      setError("");

      const loadOffline = () => {
        console.log("[PlayersList] Changing to Offline mode");
        const stored = JSON.parse(localStorage.getItem("offlinePlayers") || "[]");
        
        // Migration: Mark offline-created players (timestamp IDs > 1000000000)
        const migrated = stored.map(p => {
          if (p.id > 1000000000 && !p._isOfflineCreated) {
            return { ...p, _isOfflineCreated: true };
          }
          return p;
        });
        
        const next = migrated.length ? migrated : getSampleOfflinePlayers();
        localStorage.setItem("offlinePlayers", JSON.stringify(next));
        setPlayers(sortByIdDesc(next));
        setOfflineMode(true);
      };

      try {
        // const token = localStorage.getItem("token");
        /*if (!token) {
          loadOffline();
          setLoading(false);
          return;
        }*/

        const response = await fetchWithTimeout(`${API_BASE_URL}/players`, {
          method: "GET",
          /*headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },*/
        });

        setLoading(false);
        console.log(`[PlayersList] Response status: ${response.status}`);
        if (!response.ok) {
          loadOffline();
          throw new Error("Player list could not be fetched.");
        }

        const data = await response.json();
        console.log("[PlayersList] Players successfully loaded:", data.length);
        setPlayers(sortByIdDesc(data));
        setOfflineMode(false);
      } catch (err) {
        console.error(err);
        setError("Could not reach the server, showing local data.");
        loadOffline();
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when offline mode changes (e.g., user clicks "Use Backend")
  useEffect(() => {
    if (!initialFetchRef.current) return; // Skip if not initialized yet
    console.log("[PlayersList] offlineMode changed to:", offlineMode);
    const doFetch = async () => {
      setLoading(true);
      setError("");

      const loadOffline = () => {
        console.log("[PlayersList] Changing to Offline mode");
        const stored = JSON.parse(localStorage.getItem("offlinePlayers") || "[]");
        
        // Migration: Mark offline-created players (timestamp IDs > 1000000000)
        const migrated = stored.map(p => {
          if (p.id > 1000000000 && !p._isOfflineCreated) {
            return { ...p, _isOfflineCreated: true };
          }
          return p;
        });
        
        const next = migrated.length ? migrated : getSampleOfflinePlayers();
        localStorage.setItem("offlinePlayers", JSON.stringify(next));
        setPlayers(sortByIdDesc(next));
        setOfflineMode(true);
      };

      try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/players`, {
          method: "GET",
        });

        setLoading(false);
        console.log(`[PlayersList] Refetch response status: ${response.status}`);
        if (!response.ok) {
          loadOffline();
          throw new Error("Player list could not be fetched.");
        }

        const data = await response.json();
        console.log("[PlayersList] Players refetch successful:", data.length);
        setPlayers(sortByIdDesc(data));
        setOfflineMode(false);
      } catch (err) {
        console.error("[PlayersList] Refetch error:", err);
        setError("Could not reach the server, showing local data.");
        loadOffline();
      } finally {
        setLoading(false);
      }
    };
    doFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offlineMode]);

  const handleImportJSON = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus(t("players.importing"));
    setError("");

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.players)
          ? parsed.players
          : [parsed];

      const cleaned = list
        .filter(Boolean)
        .map((p) => {
          const { id, ...rest } = p;
          return rest;
        });

      const token = localStorage.getItem("token");
      const useBackend = !offlineMode;

      if (!useBackend) {
        const stored = JSON.parse(localStorage.getItem("offlinePlayers") || "[]");
        const now = Date.now();
        const withIds = cleaned.map((p, idx) => ({ ...p, id: p.id ?? now + idx }));
        const next = sortByIdDesc([...stored, ...withIds]);
        localStorage.setItem("offlinePlayers", JSON.stringify(next));
        setPlayers(next);
      } else {
        const createdPlayers = [];
        for (const p of cleaned) {
          const response = await fetch(`${API_BASE_URL}/players`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(p),
          });

          if (!response.ok) {
            throw new Error(t("players.importFailed"));
          }

          const newPlayer = await response.json();
          createdPlayers.push(newPlayer);
        }

        setPlayers((prev) => sortByIdDesc([...prev, ...createdPlayers]));
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
    <>
      <style>{`
        @media (max-width: 640px) {
          .players-grid {
            grid-template-columns: repeat(1, 1fr);
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .players-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1025px) {
          .players-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
      <div style={styles.page}>
        <div style={styles.cardWrapper}>
        {offlineMode && (
          <div style={styles.offlineBanner}>
            {t("players.offlineMode")}
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
              {t("players.downloadJson")}
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

        <div style={styles.grid} className="players-grid">
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
                    src={resolveAvatarSrc(p)}
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
                      {p.level && (
                        <>
                          <span style={styles.dot}>•</span>
                          <span style={styles.level}>Level {p.level}</span>
                          <span style={styles.dot}>•</span>
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
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "2rem",
    background: "linear-gradient(135deg, #e8e4d0 0%, #dbdabd 50%, #d4d0b8 100%)",
    fontFamily: "'Georgia', 'Garamond', serif",
    color: "#3e3a2f",
  },
  cardWrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "rgba(250, 248, 240, 0.8)",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 0 30px rgba(62, 58, 47, 0.15), inset 0 0 60px rgba(0, 0, 0, 0.05)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#5a4a3a",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2), 0 0 10px rgba(218, 165, 32, 0.3)",
    letterSpacing: "0.05em",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.35rem",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  importButton: {
    padding: "0.4rem 0.7rem",
    borderRadius: "0.5rem",
    border: "2px solid #6d5d4b",
    background: "linear-gradient(135deg, #7a6a56 0%, #6d5d4b 100%)",
    color: "#f5f3e8",
    fontWeight: 700,
    fontSize: "0.8rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 15px rgba(218, 165, 32, 0.15)",
    display: "inline-block",
    flex: "0 1 auto",
    textAlign: "center",
    whiteSpace: "nowrap",
    transition: "all 0.3s ease",
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
    padding: "0.4rem 0.7rem",
    borderRadius: "0.5rem",
    border: "2px solid #b8860b",
    background: "linear-gradient(135deg, #daa520 0%, #b8860b 100%)",
    color: "#3e3a2f",
    fontWeight: 700,
    fontSize: "0.8rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 20px rgba(218, 165, 32, 0.3)",
    flex: "0 1 auto",
    textAlign: "center",
    whiteSpace: "nowrap",
    transition: "all 0.3s ease",
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
    gap: "0.5rem 0.75rem",
    padding: "0.5rem",
    background: "rgba(235, 230, 215, 0.6)",
    borderRadius: "0.75rem",
    border: "2px solid #8b7d6b",
    fontSize: "0.75rem",
    boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.08)",
  },
  card: {
    background: "linear-gradient(135deg, rgba(250, 248, 240, 0.95) 0%, rgba(245, 243, 230, 0.95) 100%)",
    borderRadius: "0.9rem",
    border: "2px solid #a89f8d",
    padding: "0.9rem 1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2), 0 0 20px rgba(218, 165, 32, 0.1)",
    transition: "all 0.3s ease",
  },
  cardRow: {
    display: "flex",
    alignItems: "stretch",
    gap: "0.9rem",
    flexWrap: "wrap",
  },
  contentCol: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    flex: 1,
    minWidth: 0,
  },
  avatarWrapper: {
    width: "180px",
    minWidth: "140px",
    maxWidth: "240px",
    minHeight: "140px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "3px solid #6d5d4b",
    background: "linear-gradient(135deg, #5a4a3a, #6d5d4b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 1 180px",
    alignSelf: "stretch",
    boxShadow: "0 0 15px rgba(218, 165, 32, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.3)",
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
    color: "#5a4a3a",
    textShadow: "0 0 8px rgba(218, 165, 32, 0.3)",
  },
  subLine: {
    fontSize: "0.8rem",
    color: "#6d6250",
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
  level: {
    fontWeight: 400,
    color: "#b8860b",
    fontSize: "1.4rem",
    textShadow: "0 0 10px rgba(218, 165, 32, 0.4)",
  },
  statsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem 0.6rem",
    fontSize: "0.75rem",
    color: "#7a6a56",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginTop: "0.25rem",
  },
  editButton: {
    padding: "0.45rem 0.9rem",
    borderRadius: "0.35rem",
    border: "2px solid #6d5d4b",
    background: "linear-gradient(135deg, #7a6a56, #6d5d4b)",
    color: "#f5f3e8",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3), 0 0 10px rgba(218, 165, 32, 0.15)",
    transition: "all 0.3s ease",
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
    background: "linear-gradient(135deg, #d4cfb8, #c9c4ad)",
    color: "#5a4a3a",
    padding: "0.6rem 0.9rem",
    borderRadius: "0.6rem",
    marginBottom: "0.9rem",
    fontWeight: 700,
    border: "2px solid #b8860b",
    boxShadow: "0 0 15px rgba(218, 165, 32, 0.2)",
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
