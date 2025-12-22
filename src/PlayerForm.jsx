import { useEffect, useState } from "react";

// BASE / MULT – tüm form modları için
const BASE = {
  APP: 30,
  BONUS: 0,
  BRV: 45,
  CON: 30,
  DEX: 35,
  EDU: 20,
  INT: 30,
  LUCK: 35,
  PER: 0,
  POW: 30,
  REP: 1,
  SAN: 45,
  SIZ: 31,
  STR: 25,

  Accounting: 7,
  Anthropology: 6,
  Appraise: 8,
  Archeology: 3,
  ArtCraft: 15,
  ArtCraft2: 14,
  Charm: 20,
  Climb: 20,
  CreditRating: 5,
  CthulhuMythos: 0,
  Disguise: 5,
  Dodge: 20,
  DriveAuto: 10,
  ElectricalRepair: 15,
  FastTalk: 14,
  FightingBrawl: 30,
  FightingOther: 30,
  FirearmsHandgun: 30,
  FirearmsOther: 30,
  FirearmsOther2: 30,
  FirearmsRifleShotgun: 30,
  FirstAid: 20,
  History: 10,
  Intimidate: 15,
  Jump: 20,
  LanguageOther1: 20,
  LanguageOther2: 0,
  LanguageOther3: 0,
  LanguageOwn: 50,
  Law: 5,
  LibraryUse: 20,
  Listen: 30,
  Locksmith: 10,
  MechanicalRepair: 15,
  Medicine: 4,
  NaturalWorld: 15,
  Navigate: 15,
  Occult: 4,
  Persuade: 15,
  Pilot: 1,
  Psychoanalysis: 2,
  Psychology: 10,
  Ride: 10,
  Science: 10,
  ScienceOther: 21,
  ScienceOther2: 20,
  SleightOfHand: 10,
  SpotHidden: 15,
  Stealth: 20,
  Survival: 11,
  Swim: 22,
  Throw: 20,
  Track: 10,
};

const MULT = {
  APP: 15,
  BONUS: 12,
  BRV: 6,
  CON: 8,
  DEX: 4,
  EDU: 46,
  INT: 14,
  LUCK: 3,
  PER: 5,
  POW: 5,
  REP: 14,
  SAN: 3,
  SIZ: 19,
  STR: 11,

  Accounting: 50,
  Anthropology: 50,
  Appraise: 50,
  Archeology: 50,
  ArtCraft: 46,
  ArtCraft2: 46,
  Charm: 10,
  Climb: 20,
  CreditRating: 11,
  CthulhuMythos: 6,
  Disguise: 27,
  Dodge: 6,
  DriveAuto: 16,
  ElectricalRepair: 25,
  FastTalk: 10,
  FightingBrawl: 7,
  FightingOther: 8,
  FirearmsHandgun: 8,
  FirearmsOther: 5,
  FirearmsOther2: 5,
  FirearmsRifleShotgun: 5,
  FirstAid: 12,
  History: 22,
  Intimidate: 12,
  Jump: 15,
  LanguageOther1: 40,
  LanguageOther2: 60,
  LanguageOther3: 80,
  LanguageOwn: 60,
  Law: 29,
  LibraryUse: 7,
  Listen: 5,
  Locksmith: 12,
  MechanicalRepair: 25,
  Medicine: 28,
  NaturalWorld: 21,
  Navigate: 30,
  Occult: 20,
  Persuade: 7,
  Pilot: 50,
  Psychoanalysis: 50,
  Psychology: 9,
  Ride: 16,
  Science: 30,
  ScienceOther: 44,
  ScienceOther2: 44,
  SleightOfHand: 13,
  SpotHidden: 5,
  Stealth: 9,
  Survival: 50,
  Swim: 45,
  Throw: 12,
  Track: 27,
};

const XP_KEYS = Object.keys(BASE);

const FIELD_DEFS = [
  { key: "Accounting", label: "Accounting", type: "number" },
  { key: "Anthropology", label: "Anthropology", type: "number" },
  { key: "Appraise", label: "Appraise", type: "number" },
  { key: "Archeology", label: "Archeology", type: "number" },
  { key: "ArtCraft", label: "ArtCraft", type: "number" },
  { key: "ArtCraft2", label: "ArtCraft2", type: "number" },
  { key: "Charm", label: "Charm", type: "number" },
  { key: "Climb", label: "Climb", type: "number" },
  { key: "CreditRating", label: "CreditRating", type: "number" },
  { key: "CthulhuMythos", label: "CthulhuMythos", type: "number" },
  { key: "Disguise", label: "Disguise", type: "number" },
  { key: "Dodge", label: "Dodge", type: "number" },
  { key: "DriveAuto", label: "DriveAuto", type: "number" },
  { key: "ElectricalRepair", label: "ElectricalRepair", type: "number" },
  { key: "FastTalk", label: "FastTalk", type: "number" },
  { key: "FightingBrawl", label: "FightingBrawl", type: "number" },
  { key: "FightingOther", label: "FightingOther", type: "number" },
  { key: "FirearmsHandgun", label: "FirearmsHandgun", type: "number" },
  { key: "FirearmsOther", label: "FirearmsOther", type: "number" },
  { key: "FirearmsOther2", label: "FirearmsOther2", type: "number" },
  { key: "FirearmsRifleShotgun", label: "FirearmsRifleShotgun", type: "number" },
  { key: "FirstAid", label: "FirstAid", type: "number" },
  { key: "History", label: "History", type: "number" },
  { key: "Intimidate", label: "Intimidate", type: "number" },
  { key: "Jump", label: "Jump", type: "number" },
  { key: "LanguageOther1", label: "LanguageOther1", type: "number" },
  { key: "LanguageOther2", label: "LanguageOther2", type: "number" },
  { key: "LanguageOther3", label: "LanguageOther3", type: "number" },
  { key: "LanguageOwn", label: "LanguageOwn", type: "number" },
  { key: "Law", label: "Law", type: "number" },
  { key: "LibraryUse", label: "LibraryUse", type: "number" },
  { key: "Listen", label: "Listen", type: "number" },
  { key: "Locksmith", label: "Locksmith", type: "number" },
  { key: "MechanicalRepair", label: "MechanicalRepair", type: "number" },
  { key: "Medicine", label: "Medicine", type: "number" },
  { key: "NaturalWorld", label: "NaturalWorld", type: "number" },
  { key: "Navigate", label: "Navigate", type: "number" },
  { key: "Occult", label: "Occult", type: "number" },
  { key: "Persuade", label: "Persuade", type: "number" },
  { key: "Pilot", label: "Pilot", type: "number" },
  { key: "Psychoanalysis", label: "Psychoanalysis", type: "number" },
  { key: "Psychology", label: "Psychology", type: "number" },
  { key: "Ride", label: "Ride", type: "number" },
  { key: "Science", label: "Science", type: "number" },
  { key: "ScienceOther", label: "ScienceOther", type: "number" },
  { key: "ScienceOther2", label: "ScienceOther2", type: "number" },
  { key: "SleightOfHand", label: "SleightOfHand", type: "number" },
  { key: "SpotHidden", label: "SpotHidden", type: "number" },
  { key: "Stealth", label: "Stealth", type: "number" },
  { key: "Survival", label: "Survival", type: "number" },
  { key: "Swim", label: "Swim", type: "number" },
  { key: "Throw", label: "Throw", type: "number" },
  { key: "Track", label: "Track", type: "number" },
];

const FIRST_THRESHOLD = 50;
const SECOND_THRESHOLD = 75;

function getCostFromBase(skill, value) {
  const base = BASE[skill] ?? 0;
  const mult = MULT[skill] ?? 10;

  let current = 0;
  const target = Math.max(0, Number(value) || 0);

  if (target <= current) return 0;

  let total = 0;

  if (current < base) {
    current = base;
  }

  if (current <= FIRST_THRESHOLD) {
    const end = Math.min(target, FIRST_THRESHOLD);
    const diff = end - current;
    if (diff > 0) {
      total += Math.ceil(diff / mult);
      current = end;
    }
  }

  if (current > FIRST_THRESHOLD && current < SECOND_THRESHOLD) {
    const end = Math.min(target, SECOND_THRESHOLD);
    const diff = end - current;
    if (diff > 0) {
      total += Math.ceil(diff / mult) * 2;
      current = end;
    }
  }

  if (current < target) {
    const diff = target - current;
    if (diff > 0) {
      total += Math.ceil(diff / mult) * 4;
    }
  }

  return total;
}

function computeUsedXP(values) {
  let sum = 0;
  for (const key of XP_KEYS) {
    const v = Number(values[key]) || 0;
    sum += getCostFromBase(key, v);
  }
  return sum;
}

function applyDerived(values) {
  const v = (k) => Number(values[k]) || 0;
  const updated = { ...values };

  updated.HP = Math.floor((v("CON") + v("SIZ")) / 10);
  updated.MP = Math.floor(v("POW") / 5);

  const sum = v("SIZ") + v("STR");
  if (sum > 164) {
    updated.BUILD = 2;
    updated.damageBonus = "+1D6";
  } else if (sum > 124 && sum < 165) {
    updated.BUILD = 1;
    updated.damageBonus = "+1D3";
  } else if (sum > 84 && sum < 125) {
    updated.BUILD = 0;
    updated.damageBonus = "0";
  } else if (sum > 64 && sum < 85) {
    updated.BUILD = -1;
    updated.damageBonus = "-1";
  } else if (sum > 2 && sum < 65) {
    updated.BUILD = -2;
    updated.damageBonus = "-2";
  } else {
    updated.BUILD = 0;
    updated.damageBonus = "0";
  }

  const dex = v("DEX");
  const siz = v("SIZ");
  const str = v("STR");
  let move = 8;
  if (dex > siz && dex > str) move = 9;
  else if (dex < siz && dex < str) move = 7;
  updated.MOVE = move;

  const usedXP = computeUsedXP(updated);
  const totalXP = v("totalXP");
  updated.usedXP = usedXP;
  updated.remainingXP = totalXP - usedXP;

  return updated;
}

function clampStat(num) {
  let n = Number(num) || 0;
  if (n < 0) n = 0;
  if (n > 90) n = 90;
  return n;
}

function getInitialForm(mode, player) {
  if (mode === "create") {
    // Yeni oyuncu oluşturma
    const obj = {
      player: "",
      name: "",
      occupation: "",
      pronoun: "",
      residence: "",
      age: 25,
      sex: "",
      birthPlace: "",
      totalXP: 1500,
      usedXP: 0,
      remainingXP: 1500,
      BUILD: 0,
      damageBonus: "0",
      MP: 0,
      HP: 0,
      MOVE: 8,
      avatar: "",
    };

    for (const def of FIELD_DEFS) {
      if (def.type === "number") {
        obj[def.key] = BASE[def.key] ?? 0;
      } else {
        obj[def.key] = "";
      }
    }

    return applyDerived(obj);
  } else {
    // Edit modu
    return applyDerived({
      ...player,
      avatar: player.avatar || "",
    });
  }
}
function StatCell({ label, value, onChange, readOnly = false }) {
  const handleChange = readOnly
    ? undefined
    : (e) => onChange && onChange(e.target.value);

  return (
    <div style={styles.cell}>
      <div style={styles.statRow}>
        <div style={styles.statLabel}>{label}</div>
        <input
          type="number"
          min={0}
          max={90}
          value={Number(value) || 0}
          onChange={handleChange}
          readOnly={readOnly}
          style={styles.statBox}
        />
      </div>
    </div>
  );
}

function ReadSmall({ label, value }) {
  return (
    <div style={styles.cell}>
      <div style={styles.statRow}>
        <div style={styles.statLabel}>{label}</div>
        <input readOnly value={value} style={styles.statBox} />
      </div>
    </div>
  );
}

function ReadCell1({ label, subLabel, value }) {
  return (
    <div style={styles.cell}>
      <div style={styles.vitalLabel}>{label}</div>
      <div style={styles.vitalRow}>
        {subLabel ? <span style={styles.vitalMini}>{subLabel}</span> : null}
        <input readOnly value={value} style={styles.vitalBox} />
      </div>
    </div>
  );
}

function ReadCell2({ label, leftLabel, leftValue, rightLabel, rightValue }) {
  return (
    <div style={styles.cell}>
      <div style={styles.vitalLabel}>{label}</div>
      <div style={styles.vitalRow}>
        {leftLabel ? <span style={styles.vitalMini}>{leftLabel}</span> : null}
        <input readOnly value={leftValue} style={styles.vitalBox} />
        {rightLabel ? <span style={styles.vitalMini}>{rightLabel}</span> : null}
        <input readOnly value={rightValue} style={styles.vitalBox} />
      </div>
    </div>
  );
}

function ReadCell3({ label, aLabel, aValue, bLabel, bValue, cLabel, cValue }) {
  return (
    <div style={styles.cell}>
      <div style={styles.vitalLabel}>{label}</div>
      <div style={styles.vitalThree}>
        <div style={styles.vitalCol}>
          <span style={styles.vitalMini}>{aLabel}</span>
          <input readOnly value={aValue} style={styles.vitalBox} />
        </div>
        <div style={styles.vitalCol}>
          <span style={styles.vitalMini}>{bLabel}</span>
          <input readOnly value={bValue} style={styles.vitalBox} />
        </div>
        <div style={styles.vitalCol}>
          <span style={styles.vitalMini}>{cLabel}</span>
          <input readOnly value={cValue} style={styles.vitalBox} />
        </div>
      </div>
    </div>
  );
}

function PlayerForm({ mode = "create", player = null, onCancel, onCreated, onUpdated }) {
  const [form, setForm] = useState(() => getInitialForm(mode, player));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && player) {
      setForm(getInitialForm("edit", player));
    }
  }, [mode, player]);

  const handleNumericChange = (name, rawValue) => {
    const clamped = clampStat(rawValue);
    setForm((prev) => {
      const updated = { ...prev, [name]: clamped };
      return applyDerived(updated);
    });
  };

  const handleTextChange = (name, value) => {
    setForm((prev) => applyDerived({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError("Avatar en fazla 1MB olabilir.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result || "";
      const base64 = String(result).split(",")[1] || "";
      setForm((prev) => ({ ...prev, avatar: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleDelta = (field, delta) => {
    setForm((prev) => {
      const current = Number(prev[field]) || 0;
      const next = clampStat(current + delta);
      return applyDerived({ ...prev, [field]: next });
    });
  };

  const handleSubmit = async (e, stayOnPage = false) => {
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

      const payload = { ...form };

      // Sayısal alanları clamp'le
      Object.keys(payload).forEach((k) => {
        if (FIELD_DEFS.find((d) => d.key === k && d.type === "number")) {
          let n = Number(payload[k]) || 0;
          if (n < 0) n = 0;
          if (n > 90) n = 90;
          payload[k] = n;
        }
      });

      let response;

      if (mode === "create") {
        response = await fetch("http://localhost:8080/players", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Player oluşturulamadı.");
        }

        const created = await response.json();
        onCreated && onCreated(created);
      } else {
        // Edit mode
        response = await fetch(`http://localhost:8080/players/${player.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Player güncellenemedi.");
        }

        const updated = await response.json();
        onUpdated && onUpdated(updated);
      }

      if (!stayOnPage && onCancel) {
        onCancel();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === "create" ? "Yeni Oyuncu Oluştur" : "Oyuncuyu Düzenle";

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @media print {
          .xp-buttons { display: none !important; }
          .no-print { display: none !important; }
          .label-extra { display: none !important; }
        }
      `}</style>

      {/* Main Layout Container */}
      <div style={styles.mainContainer}>

      {/* Main Content */}
      <div className="sheet-page" style={styles.page}>
      {/* ===== CoC Header Grid (form hariç üst kısım) ===== */}
      <div style={styles.headerGrid}>
        {/* Row 1 */}
        <div style={styles.cell}>
          <div style={styles.cellLabel}>Name</div>
          <input
            type="text"
            value={form.name || ""}
            onChange={(e) => handleTextChange("name", e.target.value)}
            style={styles.lineInput}
          />
        </div>

        <div style={styles.cell}>
          <div style={styles.cellLabel}>Birthplace</div>
          <input
            type="text"
            value={form.birthPlace || ""}
            onChange={(e) => handleTextChange("birthPlace", e.target.value)}
            style={styles.lineInput}
          />
        </div>

        <div style={styles.cell}>
          <div style={styles.cellLabel}>Pronoun</div>
          <input
            type="text"
            value={form.pronoun || ""}
            onChange={(e) => handleTextChange("pronoun", e.target.value)}
            style={styles.lineInput}
          />
        </div>

        {/* Avatar/Icon column (spans all rows) */}
        <div style={styles.avatarCol}>
          <div style={styles.avatarBox}>
            {form.avatar ? (
              <img
                src={`data:image/*;base64,${form.avatar}`}
                alt={form.name || "avatar"}
                style={styles.avatarImg}
              />
            ) : (
              <div style={styles.avatarPlaceholder} />
            )}
          </div>

          <input
            className="no-print"
            style={styles.avatarInput}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />

          <img
            src={require("./assets/coc-icon.png")}
            alt="Call of Cthulhu"
            style={styles.cocIcon}
          />
        </div>

        {/* Row 2 */}
        <div style={styles.cell}>
          <div style={styles.cellLabel}>Occupation</div>
          <input
            type="text"
            value={form.occupation || ""}
            onChange={(e) => handleTextChange("occupation", e.target.value)}
            style={styles.lineInput}
          />
        </div>

        <div style={styles.cell}>
          <div style={styles.cellLabel}>Residence</div>
          <input
            type="text"
            value={form.residence || ""}
            onChange={(e) => handleTextChange("residence", e.target.value)}
            style={styles.lineInput}
          />
        </div>

        <div style={styles.cell}>
          <div style={styles.cellLabel}>Age</div>
          <input
            type="number"
            min={0}
            max={120}
            value={form.age || 0}
            onChange={(e) => handleNumericChange("age", e.target.value)}
            style={styles.lineInput}
          />
        </div>

        {/* Row 3 */}
        <StatCell label="STR" value={form.STR} onChange={(v) => handleNumericChange("STR", v)} />
        <StatCell label="SIZ" value={form.SIZ} onChange={(v) => handleNumericChange("SIZ", v)} />
        <StatCell label="Hit Points" value={form.HP ?? 0} readOnly />

        {/* Row 4 */}
        <StatCell label="CON" value={form.CON} onChange={(v) => handleNumericChange("CON", v)} />
        <StatCell label="POW" value={form.POW} onChange={(v) => handleNumericChange("POW", v)} />
        <StatCell label="Magic Points" value={form.MP ?? 0} readOnly />

        {/* Row 5 */}
        <StatCell label="DEX" value={form.DEX} onChange={(v) => handleNumericChange("DEX", v)} />
        <StatCell label="BRV" value={form.BRV} onChange={(v) => handleNumericChange("APP", v)} />
        <StatCell label="Luck" value={form.LUCK ?? 0} readOnly />

        {/* Row 6 */}
        <StatCell label="INT" value={form.INT} onChange={(v) => handleNumericChange("INT", v)} />
        <StatCell label="APP" value={form.APP} onChange={(v) => handleNumericChange("APP", v)} />
        <StatCell label="Bonus" value={form.BONUS ?? 0} readOnly />
        
        {/* Row 7 */}
        <StatCell label="PER" value={form.PER} onChange={(v) => handleNumericChange("PER", v)} />
        <StatCell label="EDU" value={form.EDU} onChange={(v) => handleNumericChange("EDU", v)} />
        <StatCell label="Sanity" value={form.SAN ?? 0} readOnly />
        <div style={{ ...styles.cell, ...styles.emptyCell }} />

        {/* Row 8 */}
        <ReadSmall label="Total XP" value={form.totalXP ?? 0} />
        <ReadSmall label="Used XP" value={form.usedXP ?? 0} />
        <div style={{ ...styles.cell, ...styles.emptyCell }} />
      </div>

      <form
        onSubmit={(e) => handleSubmit(e, false)}
        style={styles.form}
      >
        <div className="sheet-grid" style={styles.grid}>
          {FIELD_DEFS.map((def) => {
            const value = form[def.key] ?? "";
            const base = BASE[def.key];
            const mult = MULT[def.key];
            const isNumber = def.type === "number";

            const labelExtra =
              isNumber && mult
                ? ` (Base: ${base ?? 0}, x${mult})`
                : isNumber && base !== undefined
                ? ` (Base: ${base})`
                : "";

            return (
              <div key={def.key} style={styles.field}>
                <div style={styles.fieldHeader}> 
                  <span style={styles.labelText}>
                    {def.label}
                    {labelExtra && (
                      <span className="label-extra" style={styles.labelExtra}>{labelExtra}</span>
                    )}
                  </span>

                  <input
                    type={def.type}
                    name={def.key}
                    value={value}
                    onChange={(e) =>
                      def.type === "number"
                        ? handleNumericChange(def.key, e.target.value)
                        : handleTextChange(def.key, e.target.value)
                    }
                    min={def.type === "number" ? 0 : undefined}
                    max={def.type === "number" ? 90 : undefined}
                    style={styles.inputInline}
                  />

                  {isNumber && (
                    <div className="xp-buttons" style={styles.stepButtons}>
                      <button
                        type="button"
                        style={styles.stepButton}
                        onClick={() => handleDelta(def.key, +5)}
                      >
                        +5
                      </button>
                      <button
                        type="button"
                        style={styles.stepButton}
                        onClick={() => handleDelta(def.key, -5)}
                      >
                        -5
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div className="update-buttons no-print" style={styles.buttonsBar}>
          <button
            type="button"
            style={{ ...styles.button, background: "#9ca3af" }}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Geri dön
          </button>

          <button
            type="submit"
            style={{ ...styles.button, background: "#fbbf24" }}
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e, false)}
          >
            Kaydet ve geri dön
          </button>

          <button
            type="button"
            style={{ ...styles.button, background: "#22c55e" }}
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e, true)}
          >
            Kaydet ve sayfada kal
          </button>

          {mode === "create" && (
            <button
              type="button"
              style={{ ...styles.button, background: "#0ea5e9" }}
              onClick={() => window.print()}
            >
              Yazdır
            </button>
          )}
        </div>
      </form>
        </div>

        {/* right vertical line removed */}
      </div>

      {/* bottom banner removed */}
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  topBanner: {
    display: "none",
  },
  bannerImg: {
    display: "none",
  },
  mainContainer: {
    display: "flex",
    flex: 1,
    position: "relative",
    gap: 0,
    margin: "0 auto",
    width: "100%",
    maxWidth: "100%",
    alignItems: "stretch",
  },
  /* vertical decorations removed */
  bottomLine: {
    display: "none",
  },
  bottomLineImg: {
    display: "none",
  },
  page: {
    flex: 1,
    padding: "1.5rem",
    background: "#ffffff",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#111827",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  topRow: {
    display: "flex",
    flexDirection: "row-reverse",
    gap: "1.5rem",
    marginBottom: "1rem",
  },
  avatarBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },
  avatarPreviewWrapper: {
    width: "140px",
    height: "140px",
    borderRadius: "0.75rem",
    overflow: "hidden",
    border: "2px solid #f97316",
    background: "#fefce8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    fontSize: "0.85rem",
    color: "#9ca3af",
  },
  avatarInput: {
    fontSize: "0.8rem",
  },
  cocIconContainer: {
    marginTop: "0.5rem",
    display: "flex",
    justifyContent: "center",
  },
  cocIcon: {
    width: "100px",
    height: "auto",
    objectFit: "contain",
  },
  metaBlock: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  metaRow: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-end",
  },
  metaRowXP: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginTop: "0.5rem",
  },
  metaXPBox: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.8rem",
    minWidth: "110px",
  },
  form: {
    marginTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "0.75rem 1rem",
    background: "#ffffffff",
    borderRadius: "0.75rem",
    border: "1px solid #000000ff",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.15rem",
    fontSize: "0.8rem",
    position: "relative",
  },
  fieldHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.4rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    fontSize: "0.8rem",
  },
  labelSmall: {
    display: "flex",
    flexDirection: "column",
    flex: 0.4,
    fontSize: "0.8rem",
  },
  labelText: {
    color: "#4b5563",
  },
  labelExtra: {
    paddingLeft: "4px",
    color: "#6b7280",
    fontSize: "0.8rem",
  },
  input: {
    padding: "0.35rem 0.45rem",
    borderRadius: "0.5rem",
    border: "1px solid #000000ff",
    background: "#ffffffff",
    color: "#111827",
    fontSize: "0.85rem",
    boxSizing: "border-box",
  },
  inputInline: {
    padding: "0.25rem 0.35rem",
    borderRadius: "0.4rem",
    border: "1px solid #000000ff",
    background: "#ffffffff",
    color: "#111827",
    fontSize: "0.85rem",
    boxSizing: "border-box",
    width: "90px",
    minWidth: "80px",
  },
  inputReadOnly: {
    padding: "0.35rem 0.45rem",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    color: "#111827",
    fontSize: "0.85rem",
  },
  stepButtons: {
    display: "flex",
    flexDirection: "row",
    gap: "0.25rem",
  },
  stepButton: {
    padding: "0.1rem 0.35rem",
    borderRadius: "0.35rem",
    border: "1px solid #78350f",
    background: "#facc15",
    color: "#451a03",
    fontSize: "0.65rem",
    cursor: "pointer",
  },
  error: {
    background: "#7f1d1d",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    color: "#fecaca",
    fontSize: "0.8rem",
  },
  buttonsBar: {
    position: "sticky",
    bottom: 0,
    marginTop: "0.5rem",
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.15), rgba(0,0,0,0))",
    paddingTop: "0.5rem",
    paddingBottom: "0.25rem",
  },
  button: {
    padding: "0.45rem 0.8rem",
    borderRadius: "0.5rem",
    border: "none",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    color: "#111827",
  },
    headerGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 2fr 2fr 3fr",
      gridAutoRows: "minmax(25px, auto)",
      gap: "4px 6px",
      border: "1px solid #111",
      borderRadius: "8px",
      padding: "8px",
      marginBottom: "8px",
      alignItems: "stretch",
    },
  cell: {
    border: "1px solid rgba(0,0,0,0.18)",
    borderRadius: "4px",
    padding: "3px 4px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
    background: "#fff",
  },
  emptyCell: {
    border: "1px solid transparent",
    background: "transparent",
  },
  cellLabel: {
    fontSize: "10px",
    marginBottom: "2px",
    color: "#111",
  },
  lineInput: {
    width: "100%",
    border: "none",
    borderBottom: "1px solid #111",
    outline: "none",
    padding: "2px 2px",
    fontSize: "12px",
    background: "transparent",
    boxSizing: "border-box",
  },

  avatarCol: {
    gridColumn: 4,
    gridRow: "1 / span 6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    border: "1px solid rgba(0,0,0,0.18)",
    borderRadius: "8px",
    padding: "8px",
    background: "#fff",
  },
  avatarBox: {
    width: "260px",
    height: "340px",
    border: "2px solid #111",
    borderRadius: "4px",
    overflow: "hidden",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
  },
  avatarInput: {
    fontSize: "12px",
  },
  cocIcon: {
    width: "220px",
    height: "auto",
    objectFit: "contain",
  },

  statRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  statLabel: {
    fontWeight: 800,
    letterSpacing: "0.3px",
    fontSize: "11px",
  },
  statBox: {
    width: "70px",
    height: "24px",
    border: "1px solid #111",
    borderRadius: "3px",
    textAlign: "center",
    fontSize: "12px",
    background: "#fff",
  },

  vitalLabel: {
    fontWeight: 800,
    fontSize: "11px",
    marginBottom: "3px",
  },
  vitalMini: {
    fontSize: "9px",
    opacity: 0.9,
    marginBottom: 0,
  },
  vitalRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "nowrap",
    minWidth: 0,
  },
  vitalBox: {
    width: "64px",
    minWidth: "64px",
    minHeight: "26px",
    padding: "3px 5px",
    border: "1px solid #111",
    borderRadius: "6px",
    textAlign: "left",
    fontSize: "11px",
    background: "#fff",
    boxSizing: "border-box",
  },
  vitalCol: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4px",
    flexWrap: "nowrap",
    minWidth: 0,
  },
  vitalOne: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
    flexWrap: "nowrap",
  },
  vitalTwo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
    flexWrap: "nowrap",
  },
  vitalThree: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
    flexWrap: "nowrap",
  },

};

export default PlayerForm;
