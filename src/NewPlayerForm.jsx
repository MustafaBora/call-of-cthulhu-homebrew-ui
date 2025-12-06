import { useState } from "react";

const FIELD_DEFS = [
  // string alanlar
  { key: "player", label: "Player", type: "text" },
  { key: "name", label: "Name", type: "text" },
  { key: "occupation", label: "Occupation", type: "text" },
  { key: "age", label: "Age", type: "number" },
  { key: "sex", label: "Sex", type: "text" },
  { key: "birthPlace", label: "Birth Place", type: "text" },

  // meta XP alanları (base yok, mult yok)
  { key: "totalXP", label: "Total XP", type: "number" },
  { key: "usedXP", label: "Used XP", type: "number" },
  { key: "remainingXP", label: "Remaining XP", type: "number" },

  // ana nitelikler (base + mult)
  { key: "BUILD", label: "BUILD", type: "number" }, // CoC formülüyle hesaplayacaksın ya, şimdilik serbest
  { key: "damageBonus", label: "Damage Bonus", type: "text" },
  { key: "MP", label: "MP", type: "number" },
  { key: "HP", label: "HP", type: "number" },
  { key: "MOVE", label: "MOVE", type: "number" },

  { key: "APP", label: "APP", type: "number", base: 30, mult: 15 },
  { key: "BONUS", label: "BONUS", type: "number", base: 0, mult: 12 },
  { key: "BRV", label: "BRV", type: "number", base: 45, mult: 6 },
  { key: "CON", label: "CON", type: "number", base: 30, mult: 8 },
  { key: "DEX", label: "DEX", type: "number", base: 35, mult: 4 },
  { key: "EDU", label: "EDU", type: "number", base: 20, mult: 46 },
  { key: "INT", label: "INT", type: "number", base: 30, mult: 14 },
  { key: "LUCK", label: "LUCK", type: "number", base: 35, mult: 3 },
  { key: "PER", label: "PER", type: "number", base: 0, mult: 5 },
  { key: "POW", label: "POW", type: "number", base: 30, mult: 5 },
  { key: "REP", label: "REP", type: "number", base: 1, mult: 14 },
  { key: "SAN", label: "SAN", type: "number", base: 45, mult: 3 },
  { key: "SIZ", label: "SIZ", type: "number", base: 31, mult: 19 },
  { key: "STR", label: "STR", type: "number", base: 25, mult: 11 },

  // skill'ler – base + mult (CostService’deki tablodan)
  { key: "Accounting", label: "Accounting", type: "number", base: 7, mult: 50 },
  { key: "Anthropology", label: "Anthropology", type: "number", base: 6, mult: 50 },
  { key: "Appraise", label: "Appraise", type: "number", base: 8, mult: 50 },
  { key: "Archeology", label: "Archeology", type: "number", base: 3, mult: 50 },
  { key: "ArtCraft", label: "ArtCraft", type: "number", base: 15, mult: 46 },
  { key: "ArtCraft2", label: "ArtCraft2", type: "number", base: 14, mult: 46 },
  { key: "Charm", label: "Charm", type: "number", base: 20, mult: 10 },
  { key: "Climb", label: "Climb", type: "number", base: 20, mult: 20 },
  { key: "CreditRating", label: "CreditRating", type: "number", base: 5, mult: 11 },
  { key: "CthulhuMythos", label: "CthulhuMythos", type: "number", base: 0, mult: 6 },
  { key: "Disguise", label: "Disguise", type: "number", base: 5, mult: 27 },
  { key: "Dodge", label: "Dodge", type: "number", base: 20, mult: 6 },
  { key: "DriveAuto", label: "DriveAuto", type: "number", base: 10, mult: 16 },
  { key: "ElectricalRepair", label: "ElectricalRepair", type: "number", base: 15, mult: 25 },
  { key: "FastTalk", label: "FastTalk", type: "number", base: 14, mult: 10 },
  { key: "FightingBrawl", label: "FightingBrawl", type: "number", base: 30, mult: 7 },
  { key: "FightingOther", label: "FightingOther", type: "number", base: 30, mult: 8 },
  { key: "FirearmsHandgun", label: "FirearmsHandgun", type: "number", base: 30, mult: 8 },
  { key: "FirearmsOther", label: "FirearmsOther", type: "number", base: 30, mult: 5 },
  { key: "FirearmsOther2", label: "FirearmsOther2", type: "number", base: 30, mult: 5 },
  { key: "FirearmsRifleShotgun", label: "FirearmsRifleShotgun", type: "number", base: 30, mult: 5 },
  { key: "FirstAid", label: "FirstAid", type: "number", base: 20, mult: 12 },
  { key: "History", label: "History", type: "number", base: 10, mult: 22 },
  { key: "Intimidate", label: "Intimidate", type: "number", base: 15, mult: 12 },
  { key: "Jump", label: "Jump", type: "number", base: 20, mult: 15 },
  { key: "LanguageOther1", label: "LanguageOther1", type: "number", base: 20, mult: 40 },
  { key: "LanguageOther2", label: "LanguageOther2", type: "number", base: 0, mult: 60 },
  { key: "LanguageOther3", label: "LanguageOther3", type: "number", base: 0, mult: 80 },
  { key: "LanguageOwn", label: "LanguageOwn", type: "number", base: 50, mult: 60 },
  { key: "Law", label: "Law", type: "number", base: 5, mult: 29 },
  { key: "LibraryUse", label: "LibraryUse", type: "number", base: 20, mult: 7 },
  { key: "Listen", label: "Listen", type: "number", base: 30, mult: 5 },
  { key: "Locksmith", label: "Locksmith", type: "number", base: 10, mult: 12 },
  { key: "MechanicalRepair", label: "MechanicalRepair", type: "number", base: 15, mult: 25 },
  { key: "Medicine", label: "Medicine", type: "number", base: 4, mult: 28 },
  { key: "NaturalWorld", label: "NaturalWorld", type: "number", base: 15, mult: 21 },
  { key: "Navigate", label: "Navigate", type: "number", base: 15, mult: 30 },
  { key: "Occult", label: "Occult", type: "number", base: 4, mult: 20 },
  { key: "Persuade", label: "Persuade", type: "number", base: 15, mult: 7 },
  { key: "Pilot", label: "Pilot", type: "number", base: 1, mult: 50 },
  { key: "Psychoanalysis", label: "Psychoanalysis", type: "number", base: 2, mult: 50 },
  { key: "Psychology", label: "Psychology", type: "number", base: 10, mult: 9 },
  { key: "Ride", label: "Ride", type: "number", base: 10, mult: 16 },
  { key: "Science", label: "Science", type: "number", base: 10, mult: 30 },
  { key: "ScienceOther", label: "ScienceOther", type: "number", base: 21, mult: 44 },
  { key: "ScienceOther2", label: "ScienceOther2", type: "number", base: 20, mult: 44 },
  { key: "SleightOfHand", label: "SleightOfHand", type: "number", base: 10, mult: 13 },
  { key: "SpotHidden", label: "SpotHidden", type: "number", base: 15, mult: 5 },
  { key: "Stealth", label: "Stealth", type: "number", base: 20, mult: 9 },
  { key: "Survival", label: "Survival", type: "number", base: 11, mult: 50 },
  { key: "Swim", label: "Swim", type: "number", base: 22, mult: 45 },
  { key: "Throw", label: "Throw", type: "number", base: 20, mult: 12 },
  { key: "Track", label: "Track", type: "number", base: 10, mult: 27 },
];

function NewPlayerForm({ onCancel, onCreated, mode = "create", initialPlayer = null }) {
  // create'de base ile dolu başlasın, edit'te player'dan gelsin
  const initialForm = FIELD_DEFS.reduce((acc, def) => {
    const fromPlayer = initialPlayer ? initialPlayer[def.key] : undefined;

    if (fromPlayer != null) {
      // edit modu: player’dan
      acc[def.key] =
        def.type === "text" ? String(fromPlayer) : String(fromPlayer);
    } else {
      // create modu
      if (def.type === "text") {
        acc[def.key] = "";
      } else {
        // number
        if (typeof def.base === "number") {
          acc[def.key] = String(def.base);
        } else {
          acc[def.key] = "0";
        }
      }
    }
    return acc;
  }, {});

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const def = FIELD_DEFS.find((d) => d.key === name);

        if (def && def.type === "number") {
            // Yazarken boş bırakmasına izin ver (örn. backspace)
            if (value === "") {
            setForm((prev) => ({ ...prev, [name]: "" }));
            return;
            }

            // Sadece rakamları al
            const onlyDigits = value.replace(/[^0-9]/g, "");
            let num = Number(onlyDigits);

            if (Number.isNaN(num)) num = 0;

            // max 90
            if (num > 90) num = 90;

            // BURADA base clamp YAPMIYORUZ, onu submit'te yapacağız
            setForm((prev) => ({ ...prev, [name]: String(num) }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token bulunamadı. Lütfen tekrar giriş yap.");
        setIsSubmitting(false);
        return;
      }

      // Body'yi FIELD_DEFS'e göre otomatik oluştur
      const payload = {};
      FIELD_DEFS.forEach((def) => {
        if (def.type === "number") {
            let num = Number(form[def.key]);
            if (Number.isNaN(num)) num = 0;

            // önce base
            if (typeof def.base === "number") {
            num = Math.max(def.base, num);
            }

            // sonra üst limit 90
            num = Math.min(num, 90);

            payload[def.key] = num;
        } else {
            payload[def.key] = form[def.key] || "";
        }
      });


      let url = "http://localhost:8080/players";
      let method = "POST";

      if (mode === "edit" && initialPlayer && initialPlayer.id) {
        url = `http://localhost:8080/players/${initialPlayer.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Player oluşturulamadı / güncellenemedi.");
      }

      const createdOrUpdated = await response.json();
      onCreated(createdOrUpdated);
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
        <h2 style={styles.title}>
          {mode === "edit" ? "Player Güncelle" : "Yeni Player Oluştur"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            {FIELD_DEFS.map((def) => {
              const label =
                def.mult && def.mult > 0
                  ? `${def.label} (x${def.mult})`
                  : def.label;

              return (
                <label key={def.key} style={styles.field}>
                  <span style={styles.labelText}>{label}</span>
                  <input
                    type={def.type}
                    name={def.key}
                    value={form[def.key]}
                    onChange={handleChange}
                    style={styles.input}
                    min={
                      def.type === "number" && typeof def.base === "number"
                        ? def.base
                        : undefined
                    }
                    max={def.type === "number" ? 90 : undefined}
                  />
                </label>
              );
            })}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.buttons}>
            <button type="submit" style={styles.button} disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              type="button"
              style={{ ...styles.button, background: "#6b7280" }}
              onClick={onCancel}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "2rem",
    background: "#0f172a",
    color: "#e5e7eb",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    maxWidth: "1000px",
    margin: "0 auto",
    background: "#020617",
    borderRadius: "1rem",
    border: "1px solid #1e293b",
    padding: "1.5rem",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  },
  title: {
    marginTop: 0,
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "0.75rem 1rem",
    maxHeight: "70vh",
    overflowY: "auto",
    paddingRight: "0.5rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.8rem",
  },
  labelText: {
    marginBottom: "0.15rem",
    color: "#9ca3af",
  },
  input: {
    padding: "0.4rem 0.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: "0.85rem",
  },
  error: {
    background: "#7f1d1d",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    color: "#fecaca",
  },
  buttons: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  },
  button: {
    padding: "0.6rem 0.8rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "#22c55e",
    color: "#022c22",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default NewPlayerForm;
