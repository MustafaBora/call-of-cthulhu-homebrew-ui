import { useEffect, useState } from "react";
import NewPlayerForm from "./NewPlayerForm";

function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);


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
            "Authorization": `Bearer ${token}`,
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

  if (loading) return <div style={styles.page}>Yükleniyor...</div>;
  if (error) return <div style={styles.page}>Hata: {error}</div>;
  if (isCreating) {
    return (
      <div style={styles.page}>
        <NewPlayerForm
          mode="create"
          onCancel={() => setIsCreating(false)}
          onCreated={(newPlayer) => {
            setPlayers((prev) => [...prev, newPlayer]);
            setIsCreating(false);
          }}
        />
      </div>
    );
  }

  if (editingPlayer) {
    return (
      <div style={styles.page}>
        <NewPlayerForm
          mode="edit"
          initialPlayer={editingPlayer}
          onCancel={() => setEditingPlayer(null)}
          onCreated={(updated) => {
            setPlayers((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            setEditingPlayer(null);
          }}
        />
      </div>
    );
  }

  return (
  <div style={styles.page}>
    <div style={styles.headerRow}>
      <h2 style={styles.title}>Oyuncu Listesi</h2>
      <button style={styles.newButton} onClick={() => setIsCreating(true)}>
        Yeni Player
      </button>
    </div>


    <div style={styles.grid}>
        {players.map((p) => {
          // Player objesindeki tüm alanları otomatik al
          // Gerekiyorsa bazılarını filtreleyebilirsin (ör: id, password vs.)
          const entries = Object.entries(p).filter(([key]) =>
            !["password", "hashedPassword"].includes(key)
          );

          return (
            <div key={p.id} style={styles.card}>
              <h3 style={styles.cardTitle}>
                Player #{p.id} {p.username ? `- ${p.username}` : ""}
              </h3>

              <div style={styles.attributesGrid}>
                {entries.map(([key, value]) => (
                  <div key={key} style={styles.attrItem}>
                    <div style={styles.attrKey}>{formatKey(key)}</div>
                    <div style={styles.attrValue}>
                      {value === null || value === undefined ? "—" : String(value)}
                    </div>
                  </div>
                ))}
              </div>
              <li key={p.id} style={styles.listItem}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>ID:</strong> {p.id} <br />
                  <strong>Name:</strong> {p.name || "-"} <br />
                  <strong>Player:</strong> {p.player || "-"}
                </div>
                <button
                  style={styles.editButton}
                  onClick={() => setEditingPlayer(p)}
                >
                  Düzenle
                </button>
              </div>
            </li>

            </div>
          );
        })}
      </div>
    </div>
  );
}

// key'leri daha okunur hale getirmek için ufak helper
function formatKey(key) {
  // örn: "remainingXP" → "Remaining XP"
  //      "app" → "APP"
  //      "firearmsHandgun" → "Firearms Handgun"
  if (!key) return "";

  // tamamen büyük harf ise (APP, STR vs.) olduğu gibi bırak
  if (key === key.toUpperCase()) return key;

  // camelCase'i boşluklu hale getir
  const withSpaces = key.replace(/([a-z])([A-Z])/g, "$1 $2");

  // İlk harfini büyüt
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "2rem",
    background: "#0f172a",
    color: "#e5e7eb",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  // Dış grid: her player için bir kart, 3 sütunlu layout (responsive)
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#020617",
    padding: "1rem",
    borderRadius: "0.75rem",
    border: "1px solid #1f2937",
    boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
  },
  cardTitle: {
    margin: "0 0 0.75rem 0",
    fontSize: "1.1rem",
    fontWeight: 600,
    borderBottom: "1px solid #1f2937",
    paddingBottom: "0.5rem",
  },
  // Kart içi grid: 3 sütunlu attribute layout
  attributesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))", // 🔥 her kartta 3 kolon
    gap: "0.5rem 1rem",
    marginTop: "0.75rem",
  },
  attrItem: {
    padding: "0.3rem 0.4rem",
    borderRadius: "0.5rem",
    background: "#020617",
    border: "1px solid #111827",
  },
  attrKey: {
    fontSize: "0.7rem",
    color: "#9ca3af",
    marginBottom: "0.1rem",
  },
  attrValue: {
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  newButton: {
    padding: "0.5rem 0.9rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "#22c55e",
    color: "#022c22",
    fontWeight: 600,
    cursor: "pointer",
  },
  editButton: {
    padding: "0.3rem 0.7rem",
    borderRadius: "0.4rem",
    border: "none",
    background: "#3b82f6",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 500,
  },
  editButton: {
    padding: "0.3rem 0.7rem",
    borderRadius: "0.4rem",
    border: "none",
    background: "#3b82f6",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 500,
  },

};

export default PlayersList;
