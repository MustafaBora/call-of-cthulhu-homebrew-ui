import { useState } from "react";

// XP hesaplama sabitleri (backend CostService ile uyumlu)
const FIRST_THRESHOLD = 50;
const SECOND_THRESHOLD = 75;

// Alan tanımları
const FIELD_DEFS = [
  // string alanlar
  { key: "player", label: "Player", type: "text" },
  { key: "name", label: "Name", type: "text" },
  { key: "occupation", label: "Occupation", type: "text" },
  { key: "age", label: "Age", type: "number" },
  { key: "sex", label: "Sex", type: "text" },
  { key: "birthPlace", label: "Birth Place", type: "text" },

  // XP meta alanları
  {
    key: "totalXP",
    label: "Total XP",
    type: "number",
    readOnly: true, // kullanıcı değiştiremesin
    submit: false,  // backend'e yollamıyoruz (istersen true yaparsın)
  },
  {
    key: "usedXP",
    label: "Used XP",
    type: "number",
    readOnly: true,
    submit: true,
  },
  {
    key: "remainingXP",
    label: "Remaining XP",
    type: "number",
    readOnly: true,
    submit: true,
  },

  // Ana nitelikler (Build/DB/HP/MP/MOVE read-only)
  { key: "BUILD", label: "BUILD", type: "number", readOnly: true },
  { key: "damageBonus", label: "Damage Bonus", type: "text", readOnly: true },
  { key: "MP", label: "MP", type: "number", readOnly: true },
  { key: "HP", label: "HP", type: "number", readOnly: true },
  { key: "MOVE", label: "MOVE", type: "number", readOnly: true },

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

  // skill'ler
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
  {
    key: "ElectricalRepair",
    label: "ElectricalRepair",
    type: "number",
    base: 15,
    mult: 25,
  },
  { key: "FastTalk", label: "FastTalk", type: "number", base: 14, mult: 10 },
  { key: "FightingBrawl", label: "FightingBrawl", type: "number", base: 30, mult: 7 },
  { key: "FightingOther", label: "FightingOther", type: "number", base: 30, mult: 8 },
  {
    key: "FirearmsHandgun",
    label: "FirearmsHandgun",
    type: "number",
    base: 30,
    mult: 8,
  },
  { key: "FirearmsOther", label: "FirearmsOther", type: "number", base: 30, mult: 5 },
  {
    key: "FirearmsOther2",
    label: "FirearmsOther2",
    type: "number",
    base: 30,
    mult: 5,
  },
  {
    key: "FirearmsRifleShotgun",
    label: "FirearmsRifleShotgun",
    type: "number",
    base: 30,
    mult: 5,
  },
  { key: "FirstAid", label: "FirstAid", type: "number", base: 20, mult: 12 },
  { key: "History", label: "History", type: "number", base: 10, mult: 22 },
  { key: "Intimidate", label: "Intimidate", type: "number", base: 15, mult: 12 },
  { key: "Jump", label: "Jump", type: "number", base: 20, mult: 15 },
  {
    key: "LanguageOther1",
    label: "LanguageOther1",
    type: "number",
    base: 20,
    mult: 40,
  },
  {
    key: "LanguageOther2",
    label: "LanguageOther2",
    type: "number",
    base: 0,
    mult: 60,
  },
  {
    key: "LanguageOther3",
    label: "LanguageOther3",
    type: "number",
    base: 0,
    mult: 80,
  },
  {
    key: "LanguageOwn",
    label: "LanguageOwn",
    type: "number",
    base: 50,
    mult: 60,
  },
  { key: "Law", label: "Law", type: "number", base: 5, mult: 29 },
  { key: "LibraryUse", label: "LibraryUse", type: "number", base: 20, mult: 7 },
  { key: "Listen", label: "Listen", type: "number", base: 30, mult: 5 },
  { key: "Locksmith", label: "Locksmith", type: "number", base: 10, mult: 12 },
  {
    key: "MechanicalRepair",
    label: "MechanicalRepair",
    type: "number",
    base: 15,
    mult: 25,
  },
  { key: "Medicine", label: "Medicine", type: "number", base: 4, mult: 28 },
  {
    key: "NaturalWorld",
    label: "NaturalWorld",
    type: "number",
    base: 15,
    mult: 21,
  },
  { key: "Navigate", label: "Navigate", type: "number", base: 15, mult: 30 },
  { key: "Occult", label: "Occult", type: "number", base: 4, mult: 20 },
  { key: "Persuade", label: "Persuade", type: "number", base: 15, mult: 7 },
  { key: "Pilot", label: "Pilot", type: "number", base: 1, mult: 50 },
  {
    key: "Psychoanalysis",
    label: "Psychoanalysis",
    type: "number",
    base: 2,
    mult: 50,
  },
  { key: "Psychology", label: "Psychology", type: "number", base: 10, mult: 9 },
  { key: "Ride", label: "Ride", type: "number", base: 10, mult: 16 },
  { key: "Science", label: "Science", type: "number", base: 10, mult: 30 },
  {
    key: "ScienceOther",
    label: "ScienceOther",
    type: "number",
    base: 21,
    mult: 44,
  },
  {
    key: "ScienceOther2",
    label: "ScienceOther2",
    type: "number",
    base: 20,
    mult: 44,
  },
  {
    key: "SleightOfHand",
    label: "SleightOfHand",
    type: "number",
    base: 10,
    mult: 13,
  },
  { key: "SpotHidden", label: "SpotHidden", type: "number", base: 15, mult: 5 },
  { key: "Stealth", label: "Stealth", type: "number", base: 20, mult: 9 },
  { key: "Survival", label: "Survival", type: "number", base: 11, mult: 50 },
  { key: "Swim", label: "Swim", type: "number", base: 22, mult: 45 },
  { key: "Throw", label: "Throw", type: "number", base: 20, mult: 12 },
  { key: "Track", label: "Track", type: "number", base: 10, mult: 27 },
];

// Backend CostService.getCostFromBase ile aynı mantık
function getCostFromBaseJs(base, mult, targetValue) {
  let currentValue = 0;
  if (targetValue <= currentValue) return 0;

  if (currentValue < base) {
    currentValue = base;
  }

  let totalCost = 0;
  let end, diff;

  // 1) base → 50
  if (currentValue <= FIRST_THRESHOLD) {
    end = Math.min(targetValue, FIRST_THRESHOLD);
    diff = end - currentValue;
    if (diff > 0) {
      totalCost += Math.ceil(diff / mult);
      currentValue = end;
    }
  }

  // 2) 50 → 75 (daha pahalı) – backend'le bire bir
  if (currentValue < SECOND_THRESHOLD && currentValue > FIRST_THRESHOLD) {
    end = Math.min(targetValue, SECOND_THRESHOLD);
    diff = targetValue - currentValue;
    if (diff > 0) {
      totalCost += Math.ceil(diff / mult) * 2;
      currentValue = end;
    }
  }

  // 3) 75 → target (en pahalı)
  if (currentValue < targetValue) {
    diff = targetValue - currentValue;
    if (diff > 0) {
      totalCost += Math.ceil(diff / mult) * 4;
    }
  }

  return totalCost;
}

// Tüm skiller için usedXP & remainingXP hesaplayan yardımcı
function computeXp(form) {
  let used = 0;

  FIELD_DEFS.forEach((def) => {
    if (
      def.type === "number" &&
      typeof def.base === "number" &&
      typeof def.mult === "number"
    ) {
      const val = Number(form[def.key]) || 0;
      used += getCostFromBaseJs(def.base, def.mult, val);
    }
  });

  const total = Number(form.totalXP) || 0;
  const remaining = Math.max(total - used, 0);

  return { usedXP: used, remainingXP: remaining };
}

// Backend'deki calculateMPAndHP + calculateBuildAndDB'nin JS versiyonu
function computeDerivedStats(form) {
  const con = Number(form.CON) || 0;
  const siz = Number(form.SIZ) || 0;
  const pow = Number(form.POW) || 0;
  const str = Number(form.STR) || 0;

  const hp = Math.floor((con + siz) / 10);
  const mp = Math.floor(pow / 5);

  const sum = siz + str;
  let build = 0;
  let db = "0";

  if (sum > 164) {
    build = 2;
    db = "+1D6";
  } else if (sum > 124 && sum < 165) {
    build = 1;
    db = "+1D3";
  } else if (sum > 84 && sum < 125) {
    build = 0;
    db = "0";
  } else if (sum > 64 && sum < 85) {
    build = -1;
    db = "-1";
  } else if (sum > 2 && sum < 65) {
    build = -2;
    db = "-2";
  }

  return { HP: hp, MP: mp, BUILD: build, damageBonus: db };
}

function NewPlayerForm({ onCancel, onCreated, mode = "create", initialPlayer = null }) {
  const [avatar, setAvatar] = useState(initialPlayer?.avatar || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // form başlangıç state'i
  const [form, setForm] = useState(() => {
    const baseForm = FIELD_DEFS.reduce((acc, def) => {
      const fromPlayer = initialPlayer ? initialPlayer[def.key] : undefined;

      if (fromPlayer != null) {
        acc[def.key] =
          def.type === "text" ? String(fromPlayer) : String(fromPlayer);
      } else {
        if (def.type === "text") {
          acc[def.key] = "";
        } else {
          // number
          if (def.key === "totalXP") {
            acc[def.key] = "0"; // istersen 1500 vs yaparsın
          } else if (typeof def.base === "number") {
            acc[def.key] = String(def.base);
          } else {
            acc[def.key] = "0";
          }
        }
      }
      return acc;
    }, {});

    const xp = computeXp(baseForm);
    const derived = computeDerivedStats(baseForm);

    return {
      ...baseForm,
      usedXP: String(xp.usedXP),
      remainingXP: String(xp.remainingXP),
      HP: String(derived.HP),
      MP: String(derived.MP),
      BUILD: String(derived.BUILD),
      damageBonus: derived.damageBonus,
    };
  });

  // Form + XP + Derived birlikte güncellensin
  const updateFormAndRecalc = (updater) => {
    setForm((prev) => {
      const next =
        typeof updater === "function" ? updater(prev) : { ...prev, ...updater };

      const xp = computeXp(next);
      const derived = computeDerivedStats(next);

      return {
        ...next,
        usedXP: String(xp.usedXP),
        remainingXP: String(xp.remainingXP),
        HP: String(derived.HP),
        MP: String(derived.MP),
        BUILD: String(derived.BUILD),
        damageBonus: derived.damageBonus,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const def = FIELD_DEFS.find((d) => d.key === name);
    if (!def) return;

    if (def.readOnly) {
      // BUILD / DB / MP / HP / MOVE / XP alanları değiştirilemesin
      return;
    }

    if (def.type === "number") {
      updateFormAndRecalc((prev) => {
        if (value === "") {
          return { ...prev, [name]: "" };
        }

        const onlyDigits = value.replace(/[^0-9]/g, "");
        let num = Number(onlyDigits);
        if (Number.isNaN(num)) num = 0;

        // max 90
        if (num > 90) num = 90;

        // base altına düşmesin
        if (typeof def.base === "number") {
          num = Math.max(def.base, num);
        }

        return { ...prev, [name]: String(num) };
      });
    } else {
      updateFormAndRecalc((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // +5 / -5 butonları
  const bump = (key, delta) => {
    const def = FIELD_DEFS.find((d) => d.key === key);
    if (!def || def.readOnly || def.type !== "number") return;

    updateFormAndRecalc((prev) => {
      let num = Number(prev[key] || 0);
      if (Number.isNaN(num)) num = 0;

      num += delta;

      if (typeof def.base === "number") {
        num = Math.max(def.base, num);
      }

      num = Math.min(num, 90);

      return { ...prev, [key]: String(num) };
    });
  };

  // Avatar seçimi – 1MB limit
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError("Avatar en fazla 1MB olabilir.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        const base64 = result.split(",")[1];
        setAvatar(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e, action = "back") => {
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

      const payload = {};

      FIELD_DEFS.forEach((def) => {
        if (def.type === "number") {
          if (def.submit === false) return;

          let num = Number(form[def.key]);
          if (Number.isNaN(num)) num = 0;

          if (!def.readOnly && typeof def.base === "number") {
            num = Math.max(def.base, num);
          }
          if (!def.readOnly) {
            num = Math.min(num, 90);
          }

          payload[def.key] = num;
        } else {
          payload[def.key] = form[def.key] || "";
        }
      });

      payload.avatar = avatar || null;

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
      onCreated(createdOrUpdated, { stay: action === "stay" });
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
        {/* Avatar sağ üst, biraz büyük */}
        <div style={styles.avatarWrapper}>
          {avatar ? (
            <img
              src={`data:image/*;base64,${avatar}`}
              alt="Avatar"
              style={styles.avatarImage}
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div style={styles.avatarPlaceholder}>IMG</div>
          )}
        </div>

        <h2 style={styles.title}>
          {mode === "edit" ? "Player Güncelle" : "Yeni Player Oluştur"}
        </h2>

        {/* Avatar input */}
        <div style={styles.avatarInputRow}>
          <label style={styles.avatarLabel}>
            <span style={styles.labelText}>Avatar (max 1MB)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={styles.fileInput}
            />
          </label>
        </div>

        <form onSubmit={(e) => handleSubmit(e, "back")} style={styles.form}>
          <div style={styles.grid}>
            {FIELD_DEFS.map((def) => {
              const label =
                def.mult && def.mult > 0
                  ? `${def.label} (x${def.mult})`
                  : def.label;

              const commonInputProps = {
                name: def.key,
                value: form[def.key],
                onChange: handleChange,
                style: {
                  ...styles.input,
                  ...(def.readOnly ? styles.readOnlyInput : {}),
                },
                readOnly: !!def.readOnly,
              };

              return (
                <label key={def.key} style={styles.field}>
                  <span style={styles.labelText}>{label}</span>
                  {def.type === "number" ? (
                    <div style={styles.numberWrapper}>
                      <input
                        type="number"
                        {...commonInputProps}
                        min={
                          !def.readOnly && typeof def.base === "number"
                            ? def.base
                            : undefined
                        }
                        max={def.readOnly ? undefined : 90}
                      />
                      {!def.readOnly && (
                        <div style={styles.stepButtons}>
                          <button
                            type="button"
                            style={styles.stepButton}
                            onClick={() => bump(def.key, +5)}
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            style={styles.stepButton}
                            onClick={() => bump(def.key, -5)}
                          >
                            −5
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      {...commonInputProps}
                    />
                  )}
                </label>
              );
            })}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {/* Dock'lu buton barı */}
          <div style={styles.buttonsBar}>
            <div style={styles.buttons}>
              <button
                type="submit"
                style={styles.buttonPrimary}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Kaydediliyor..." : "Kaydet ve Geri Dön"}
              </button>
              <button
                type="button"
                style={styles.buttonSecondary}
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, "stay")}
              >
                {isSubmitting ? "Kaydediliyor..." : "Kaydet ve Sayfada Kal"}
              </button>
              <button
                type="button"
                style={styles.buttonCancel}
                onClick={onCancel}
                disabled={isSubmitting}
              >
                İptal
              </button>
            </div>
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
    background: "#fef9c3", // sarımsı
    color: "#111827",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    position: "relative",
    maxWidth: "1000px",
    margin: "0 auto",
    background: "#fffbeb",
    borderRadius: "1rem",
    border: "1px solid #fbbf24",
    padding: "1.5rem",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
  },
  avatarWrapper: {
    position: "absolute",
    top: "1.5rem",
    right: "1.5rem",
    width: "120px",   // büyüttüm
    height: "120px",  // büyüttüm
    borderRadius: "999px",
    overflow: "hidden",
    border: "2px solid #facc15",
    background: "#fefce8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    fontSize: "0.75rem",
    color: "#9ca3af",
  },
  avatarInputRow: {
    marginBottom: "0.75rem",
    marginTop: "0.5rem",
  },
  avatarLabel: {
    fontSize: "0.8rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    maxWidth: "250px",
  },
  fileInput: {
    fontSize: "0.75rem",
  },
  title: {
    marginTop: 0,
    marginBottom: "0.25rem",
    paddingRight: "140px", // avatar alanına çarpmasın
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
    color: "#6b7280",
  },
  numberWrapper: {
    display: "flex",
    gap: "0.25rem",
    alignItems: "stretch",
  },
  input: {
    flex: 1,
    padding: "0.4rem 0.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    background: "#fefce8",
    color: "#111827",
    fontSize: "0.85rem",
  },
  readOnlyInput: {
    background: "#e5e7eb",
    cursor: "not-allowed",
  },
  stepButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "0.15rem",
  },
  stepButton: {
    padding: "0.1rem 0.4rem",
    borderRadius: "0.35rem",
    border: "1px solid #d1d5db",
    background: "#fef3c7",
    fontSize: "0.7rem",
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    color: "#b91c1c",
  },
  buttonsBar: {
    position: "sticky",
    bottom: 0,
    background: "#fffbeb",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    marginTop: "0.5rem",
    borderTop: "1px solid #e5e7eb",
  },
  buttons: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  buttonPrimary: {
    padding: "0.6rem 0.8rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "#22c55e",
    color: "#022c22",
    cursor: "pointer",
    fontWeight: 600,
  },
  buttonSecondary: {
    padding: "0.6rem 0.8rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "#3b82f6",
    color: "#eff6ff",
    cursor: "pointer",
    fontWeight: 600,
  },
  buttonCancel: {
    padding: "0.6rem 0.8rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "#9ca3af",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default NewPlayerForm;
