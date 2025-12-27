import { useEffect, useState } from "react";

/**
 * USAGE: 1 yükseltme için kaç puan harcaması gerektiğini gösterir.
 * Örneğin: APP = 60 demek, APP'yi 1 yükseltmek için 60 puan harcamanız gerekir.
 */
const USAGE = {
  totalXP: 0,
  usedXP: 0,
  remainingXP: 0,

  // Karakteristikler (Characteristics)
  APP: 60,
  BONUS: 120,
  BRV: 120,
  STA: 120,
  AGI: 220,
  EDU: 20,
  INT: 60,
  LUCK: 180,
  PER: 320,
  POW: 140,
  REP: 100,
  SAN: 160,
  SIZ: 40,
  ARMOR: 15000,
  RES: 15000,
  SPOT: 260,
  STR: 100,

  // Beceriler (Skills)
  Accounting: 20,
  Anthropology: 20,
  Appraise: 20,
  Archeology: 20,
  ArtCraft: 20,
  ArtCraft2: 20,
  Charm: 120,
  Climb: 60,
  CreditRating: 120,
  CthulhuMythos: 160,
  Disguise: 40,
  Dodge: 180,
  DriveAuto: 80,
  ElectricalRepair: 40,
  FastTalk: 120,
  FightingBrawl: 160,
  FightingOther: 160,
  FirearmsHandgun: 160,
  FirearmsOther: 140,
  FirearmsRifleShotgun: 140,
  FirstAid: 100,
  History: 60,
  Intimidate: 100,
  Jump: 80,
  LanguageOther1: 40,
  LanguageOther2: 20,
  LanguageOther3: 20,
  LanguageOwn: 20,
  Law: 40,
  LibraryUse: 160,
  Listen: 160,
  Locksmith: 120,
  MechanicalRepair: 40,
  Medicine: 40,
  NaturalWorld: 60,
  Navigate: 40,
  Occult: 60,
  Persuade: 180,
  Pilot: 20,
  Psychoanalysis: 20,
  Psychology: 120,
  Ride: 80,
  Science: 40,
  ScienceOther: 20,
  ScienceOther2: 20,
  SleightOfHand: 100,
  SpotHidden: 260,
  Stealth: 140,
  Survival: 20,
  Swim: 20,
  Throw: 100,
  Track: 40,
};

// BASE değerleri (başlangıç değerleri)
const BASE = {
  APP: 30,
  BONUS: 0,
  BRV: 45,
  STA: 30,
  AGI: 35,
  EDU: 20,
  INT: 30,
  LUCK: 35,
  PER: 0,
  POW: 30,
  REP: 1,
  SAN: 45,
  SIZ: 31,
  ARMOR: 0,
  RES: 0,
  SPOT: 15,
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

const FIELD_DEFS = [
  { key: "Accounting", label: "Accounting", type: "number" },
  { key: "Anthropology", label: "Anthropology", type: "number" },
  { key: "Appraise", label: "Appraise", type: "number" },
  { key: "Archeology", label: "Archeology", type: "number" },
  { key: "ArtCraft", label: "Art/Craft", type: "number" },
  { key: "ArtCraft2", label: "Art/Craft 2", type: "number" },
  { key: "Charm", label: "Charm", type: "number" },
  { key: "Climb", label: "Climb", type: "number" },
  { key: "CreditRating", label: "Credit Rating", type: "number" },
  { key: "CthulhuMythos", label: "Cthulhu Mythos", type: "number" },
  { key: "Disguise", label: "Disguise", type: "number" },
  { key: "Dodge", label: "Dodge", type: "number" },
  { key: "DriveAuto", label: "Drive (Auto)", type: "number" },
  { key: "ElectricalRepair", label: "Electrical Repair", type: "number" },
  { key: "FastTalk", label: "Fast Talk", type: "number" },
  { key: "FightingBrawl", label: "Fighting (Brawl)", type: "number" },
  { key: "FightingOther", label: "Fighting (Other)", type: "number" },
  { key: "FirearmsHandgun", label: "Firearms (Handgun)", type: "number" },
  { key: "FirearmsOther", label: "Firearms (Other)", type: "number" },
  { key: "FirearmsRifleShotgun", label: "Firearms (Shotgun)", type: "number" },
  { key: "FirstAid", label: "First Aid", type: "number" },
  { key: "History", label: "History", type: "number" },
  { key: "Intimidate", label: "Intimidate", type: "number" },
  { key: "Jump", label: "Jump", type: "number" },
  { key: "LanguageOther1", label: "Language (Other 1)", type: "number" },
  { key: "LanguageOther2", label: "Language (Other 2)", type: "number" },
  { key: "LanguageOther3", label: "Language (Other 3)", type: "number" },
  { key: "LanguageOwn", label: "Language (Own)", type: "number" },
  { key: "Law", label: "Law", type: "number" },
  { key: "LibraryUse", label: "Library Use", type: "number" },
  { key: "Listen", label: "Listen", type: "number" },
  { key: "Locksmith", label: "Locksmith", type: "number" },
  { key: "MechanicalRepair", label: "Mechanical Repair", type: "number" },
  { key: "Medicine", label: "Medicine", type: "number" },
  { key: "NaturalWorld", label: "Natural World", type: "number" },
  { key: "Navigate", label: "Navigate", type: "number" },
  { key: "Occult", label: "Occult", type: "number" },
  { key: "Persuade", label: "Persuade", type: "number" },
  { key: "Pilot", label: "Pilot", type: "number" },
  { key: "Psychoanalysis", label: "Psychoanalysis", type: "number" },
  { key: "Psychology", label: "Psychology", type: "number" },
  { key: "Ride", label: "Ride", type: "number" },
  { key: "Science", label: "Science", type: "number" },
  { key: "ScienceOther", label: "Science (Other)", type: "number" },
  { key: "ScienceOther2", label: "Science (Other 2)", type: "number" },
  { key: "SleightOfHand", label: "Sleight of Hand", type: "number" },
  { key: "Stealth", label: "Stealth", type: "number" },
  { key: "Survival", label: "Survival", type: "number" },
  { key: "Swim", label: "Swim", type: "number" },
  { key: "Throw", label: "Throw", type: "number" },
  { key: "Track", label: "Track", type: "number" },
];

const FIRST_THRESHOLD = 50;
const SECOND_THRESHOLD = 75;
const FIRST_PENALTY_MULT = 2;
const SECOND_PENALTY_MULT = 3;

// Belirli bir değerde 1 puan artırmanın maliyeti (threshold penaltileriyle)
function getCurrentCostPerPoint(usage, value) {
  if (usage === undefined || usage === null) return 0;
  if (value < FIRST_THRESHOLD) return usage;
  if (value < SECOND_THRESHOLD) return usage * FIRST_PENALTY_MULT;
  return usage * SECOND_PENALTY_MULT;
}

// Cost değerine göre renk döndürür
function getCostColor(cost) {
  if (cost < 100) return "#22c55e";      // yeşil
  if (cost < 200) return "#c97316ff";      // turuncu
  if (cost < 300) return "#ef4444";      // kırmızı
  return "#a855f7";                      // mor
}

/**
 * Belirli bir seviyeye ulaşmak için gereken toplam puanı hesaplar.
 * currentValue'dan targetValue'ye gitmek için kaç puan harcaması gerekir.
 * Backend'deki getCostBetween metodunun JavaScript implementasyonu.
 */
function getCostBetween(skill, currentValue, targetValue) {
  const usage = USAGE[skill] ?? 0;

  // Hiç iyileştirme yoksa maliyet sıfır
  if (targetValue <= currentValue || usage === 0) {
    return 0;
  }

  let totalCost = 0;
  let current = currentValue;

  // Parça 1: Mevcut seviye → 50 arası
  if (current < FIRST_THRESHOLD) {
    const end = Math.min(targetValue, FIRST_THRESHOLD);
    const diff = end - current;
    totalCost += diff * usage;
    current = end;
  }

  // Parça 2: 50 → 75 arası (2x daha pahalı)
  if (current < SECOND_THRESHOLD && current >= FIRST_THRESHOLD) {
    const end = Math.min(targetValue, SECOND_THRESHOLD);
    const diff = end - current;
    totalCost += diff * usage * FIRST_PENALTY_MULT;
    current = end;
  }

  // Parça 3: 75+ arası (3x daha pahalı)
  if (current < targetValue) {
    const diff = targetValue - current;
    totalCost += diff * usage * SECOND_PENALTY_MULT;
  }

  return totalCost;
}

/**
 * Player'ın tüm özellik ve becerilerini iyileştirmek için gereken toplam XP'yi hesaplar.
 * Backend'deki calculateXP metodunun JavaScript implementasyonu.
 */
function computeUsedXP(values) {
  console.log("=== XP Calculation Debug ===");
  let sum = 0;
  
  // Characteristics
  const characteristics = ["APP", "BONUS", "BRV", "STA", "AGI", "EDU", "INT", "LUCK", "PER", "SPOT", "POW", "REP", "SAN", "SIZ", "ARMOR", "RES", "STR"];
  console.log("--- Characteristics ---");
  for (const key of characteristics) {
    const v = Number(values[key]) || 0;
    const baseValue = BASE[key] ?? 0;
    const cost = getCostBetween(key, baseValue, v);
    if (v > 0 || cost > 0) {
      console.log(`${key}: base=${baseValue}, value=${v}, cost=${cost}`);
    }
    sum += cost;
  }
  
  // Skills
  const skills = [
    "Accounting", "Anthropology", "Appraise", "Archeology", "ArtCraft", "ArtCraft2",
    "Charm", "Climb", "CreditRating", "CthulhuMythos", "Disguise", "Dodge",
    "DriveAuto", "ElectricalRepair", "FastTalk", "FightingBrawl", "FightingOther",
    "FirearmsHandgun", "FirearmsOther", "FirearmsRifleShotgun",
    "FirstAid", "History", "Intimidate", "Jump", "LanguageOther1", "LanguageOther2",
    "LanguageOther3", "LanguageOwn", "Law", "LibraryUse", "Listen", "Locksmith",
    "MechanicalRepair", "Medicine", "NaturalWorld", "Navigate", "Occult", "Persuade",
    "Pilot", "Psychoanalysis", "Psychology", "Ride", "Science", "ScienceOther",
    "ScienceOther2", "SleightOfHand", "Stealth", "Survival", "Swim", "Throw", "Track"
  ];
  console.log("--- Skills ---");
  for (const key of skills) {
    const v = Number(values[key]) || 0;
    const baseValue = BASE[key] ?? 0;
    const cost = getCostBetween(key, baseValue, v);
    if (v > 0 || cost > 0) {
      console.log(`${key}: base=${baseValue}, value=${v}, cost=${cost}`);
    }
    sum += cost;
  }
  
  console.log(`--- Total Used XP: ${sum} ---`);
  return sum;
}

function applyDerived(values) {
  const v = (k) => Number(values[k]) || 0;
  const updated = { ...values };

  updated.HP = Math.floor((v("STA") + v("SIZ")) / 10);
  updated.MP = Math.floor(v("POW") / 5);

  const sum = v("SIZ") + v("STR");
  if (sum > 164) {
    updated.Build = 2;
    updated.damageBonus = "+1D6";
  } else if (sum > 124 && sum < 165) {
    updated.Build = 1;
    updated.damageBonus = "+1D3";
  } else if (sum > 84 && sum < 125) {
    updated.Build = 0;
    updated.damageBonus = "0";
  } else if (sum > 64 && sum < 85) {
    updated.Build = -1;
    updated.damageBonus = "-1";
  } else if (sum > 2 && sum < 65) {
    updated.Build = -2;
    updated.damageBonus = "-2";
  } else {
    updated.Build = 0;
    updated.damageBonus = "0";
  }

  const agi = v("AGI");
  const siz = v("SIZ");
  const str = v("STR");
  let move = 8;
  if (agi > siz && agi > str) move = 9;
  else if (agi < siz && agi < str) move = 7;
  updated.MOVE = move;

  const usedXP = computeUsedXP(updated);
  const totalXP = v("totalXP");
  updated.usedXP = usedXP;
  updated.remainingXP = totalXP - usedXP;

  return updated;
}

function clampStat(num, fieldName) {
  let n = Number(num) || 0;
  const minValue = (fieldName && BASE[fieldName]) ? BASE[fieldName] : 0;
  if (n < minValue) n = minValue;
  // ARMOR ve RES için max 1, diğerleri için max 90
  const maxValue = (fieldName === 'ARMOR' || fieldName === 'RES') ? 1 : 90;
  if (n > maxValue) n = maxValue;
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
      totalXP: 200000,
      usedXP: 0,
      remainingXP: 200000,
      Build: 0,
      damageBonus: "0",
      MP: 0,
      HP: 0,
      MOVE: 8,
      ARMOR: 0,
      RES: 0,
      avatar: "",
    };

    // Karakteristikler ve beceriler için BASE değerlerini başlangıç olarak ayarla
    for (const key of Object.keys(BASE)) {
      obj[key] = BASE[key] ?? obj[key];
    }

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
      ARMOR: player?.ARMOR ?? player?.armor ?? 0,
      RES: player?.RES ?? player?.res ?? 0,
      avatar: player.avatar || "",
    });
  }
}
function StatCell({ label, value, onChange, onBlur, onDelta, base, usage, readOnly = false, isSmallStep = false }) {
  const handleChange = readOnly
    ? undefined
    : (e) => onChange && onChange(e.target.value);

  const handleBlur = readOnly
    ? undefined
    : () => onBlur && onBlur();

  const numericValue = Number(value) || 0;
  const costNow = getCurrentCostPerPoint(usage, numericValue);
  const costColor = getCostColor(costNow);
  const stepAmount = isSmallStep ? 1 : 5;
  const tooltipText = `${costNow * stepAmount} XP`;

  return (
    <div style={styles.cell} className="stat-cell">
      <div style={styles.statRow}>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.labelExtra}>
          {base !== undefined && <strong className="no-print">{base}</strong>}
          {!readOnly && (costNow || costNow === 0) ? (
            <span className="no-print" style={{ color: costColor, fontWeight: "bold" }}> Cost {costNow}</span>
          ) : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {!readOnly && onDelta && (
            <div className="xp-buttons" style={styles.stepButtons}>
              <button
                type="button"
                style={{ ...styles.stepButton, background: costColor, color: "#fff" }}
                title={tooltipText}
                onClick={() => onDelta(-stepAmount)}
              >
                -{stepAmount}
              </button>
              <button
                type="button"
                style={{ ...styles.stepButton, background: costColor, color: "#fff" }}
                title={tooltipText}
                onClick={() => onDelta(+stepAmount)}
              >
                +{stepAmount}
              </button>
            </div>
          )}
          <input
            type="number"
            min={0}
            max={90}
            value={Number(value) || 0}
            onChange={handleChange}
            onBlur={handleBlur}
            readOnly={readOnly}
            className="stat-box-input"
            style={styles.statBox}
          />
        </div>
      </div>
    </div>
  );
}

function ReadSmall({ label, value }) {
  return (
    <div style={styles.cell} className="read-small">
      <div style={styles.statRow}>
        <div style={styles.statLabel}>{label}</div>
        <input readOnly value={value} className="stat-box-input" style={styles.statBox} />
      </div>
    </div>
  );
}

function TextCell({ label, value, onChange }) {
  return (
    <div style={styles.cell} className="text-cell">
      <div style={styles.cellLabel}>{label}</div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="text-input"
        style={styles.lineInput}
      />
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
    // Allow free typing; no clamp here
    setForm((prev) => ({ ...prev, [name]: rawValue }));
  };

  const handleNumericBlur = (name) => {
    setForm((prev) => {
      const clamped = clampStat(prev[name], name);
      return applyDerived({ ...prev, [name]: clamped });
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
      let next;
      
      if (delta > 0) {
        // +5: round up to next multiple of 5
        next = (Math.floor(current / 5) + 1) * 5;
      } else {
        // -5: round down to previous multiple of 5
        next = Math.max(0, (Math.floor(current / 5) - 1) * 5);
      }
      
      const clamped = clampStat(next, field);
      return applyDerived({ ...prev, [field]: clamped });
    });
  };

  const handleExportJSON = () => {
    const { avatar, id, ...exportData } = form;
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.name || "character"}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        /* Hide number spinners but keep numeric input */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }

        .print-bg-image {
          display: none;
        }

        @media print {
          @page { size: A4; margin: 8mm; }
          .sheet-page { padding: 0.75rem !important; position: relative !important; }
          .print-bg-image {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            opacity: 0.15 !important;
            z-index: 0 !important;
            filter: grayscale(100%) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .sheet-header, .sheet-grid, form {
            position: relative !important;
            z-index: 1 !important;
          }
          .sheet-header { gap: 3px 4px !important; background: transparent !important; border: none !important; }
          .sheet-header .cell { padding: 2px 3px !important; background: transparent !important; border: 1px solid rgba(0,0,0,0.18) !important; }
          .sheet-header input { padding: 2px 3px !important; font-size: 10px !important; background: transparent !important; }
          .sheet-grid { gap: 0.5rem 0.9rem !important; background: transparent !important; border: none !important; }
          .sheet-grid .field-header > span:first-child { padding-left: 5px !important; }
          .sheet-grid .field-header { gap: 0.28rem !important; }
          .sheet-grid .value-row { gap: 3px !important; }
          .xp-buttons { display: none !important; }
          .no-print { display: none !important; }
          .label-extra { display: none !important; }
          .label-extra-hide-print { display: none !important; }
          strong { font-weight: normal !important; }
          .sheet-header .statRow { gap: 4px !important; }
          .sheet-header .statLabel { font-size: 9px !important; }
          .avatarImg { filter: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .sheet-header input[type="number"],
          .sheet-header input[readOnly] {
            width: 48px !important;
            min-width: 42px !important;
            max-width: 52px !important;
            font-size: 9px !important;
            text-align: right !important;
            padding: 2px 3px !important;
            background: transparent !important;
          }
          .sheet-header .cell { padding: 2px 3px !important; }
          .sheet-header .statRow { justify-content: space-between !important; }
          .value-row { flex-wrap: wrap !important; max-width: 100% !important; justify-content: flex-start !important; gap: 3px !important; }
          .value-row input { width: 22px !important; min-width: 18px !important; text-align: right !important; font-size: 9px !important; padding: 2px 3px !important; background: transparent !important; }
          /* StatCell and ReadSmall transparency */
          .stat-cell { background: transparent !important; }
          .read-small { background: transparent !important; }
          .stat-box-input { background: transparent !important; }
          /* TextCell transparency */
          .text-cell { background: transparent !important; }
          .text-input { background: transparent !important; }
          .age-cell { background: transparent !important; }
          .age-input { background: transparent !important; }
          .cell { background: transparent !important; }
          input[type="number"] { background: transparent !important; }
          input[readOnly] { background: transparent !important; }
        }
      `}</style>

      {/* Main Layout Container */}
      <div style={styles.mainContainer}>

      {/* Main Content */}
      <div className="sheet-page" style={styles.page}>
      {form.avatar && (
        <img
          src={`data:image/*;base64,${form.avatar}`}
          alt=""
          className="print-bg-image"
          aria-hidden="true"
        />
      )}
      {/* ===== CoC Header Grid (form hariç üst kısım) ===== */}
      <div className="sheet-header" style={styles.headerGrid}>
        {/* Row 1 */}
        <TextCell label="Name" value={form.name} onChange={(v) => handleTextChange("name", v)} />
        <TextCell label="Birthplace" value={form.birthPlace} onChange={(v) => handleTextChange("birthPlace", v)} />
        <TextCell label="Pronoun" value={form.pronoun} onChange={(v) => handleTextChange("pronoun", v)} />

        {/* Avatar/Icon column (spans all rows) */}
        <div style={styles.avatarCol}>
          <div style={styles.avatarBox} onClick={() => document.getElementById('avatar-upload').click()}>
            {form.avatar ? (
              <img
                src={`data:image/*;base64,${form.avatar}`}
                alt={form.name || "avatar"}
                style={styles.avatarImg}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>Resim Yükle</div>
            )}
          </div>

          <input
            id="avatar-upload"
            className="no-print"
            style={styles.avatarInput}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />

        </div>

        {/* Row 2 */}
        <TextCell label="Occupation" value={form.occupation} onChange={(v) => handleTextChange("occupation", v)} />
        <TextCell label="Residence" value={form.residence} onChange={(v) => handleTextChange("residence", v)} />
        <div style={styles.cell} className="age-cell">
          <div style={styles.cellLabel}>Age</div>
          <input
            type="number"
            min={0}
            max={120}
            value={form.age || 0}
            onChange={(e) => handleNumericChange("age", e.target.value)}
            className="age-input"
            style={styles.lineInput}
          />
        </div>

        {/* Row 3 */}
        <StatCell label="Strength" value={form.STR} base={BASE.STR} usage={USAGE.STR} onChange={(v) => handleNumericChange("STR", v)} onBlur={() => handleNumericBlur("STR")} onDelta={(d) => handleDelta("STR", d)} />
        <StatCell label="SIZE" value={form.SIZ} base={BASE.SIZ} usage={USAGE.SIZ} onChange={(v) => handleNumericChange("SIZ", v)} onBlur={() => handleNumericBlur("SIZ")} onDelta={(d) => handleDelta("SIZ", d)} />
        <StatCell label="Hit Points" value={form.HP ?? 0} readOnly />

        {/* Row 4 */}
        <StatCell label="Stamina" value={form.STA} base={BASE.STA} usage={USAGE.STA} onChange={(v) => handleNumericChange("STA", v)} onBlur={() => handleNumericBlur("STA")} onDelta={(d) => handleDelta("STA", d)} />
        <StatCell label="POW" value={form.POW} base={BASE.POW} usage={USAGE.POW} onChange={(v) => handleNumericChange("POW", v)} onBlur={() => handleNumericBlur("POW")} onDelta={(d) => handleDelta("POW", d)} />
        <StatCell label="Magic Points" value={form.MP ?? 0} readOnly />

        {/* Row 5 */}
        <StatCell label="Agility" value={form.AGI} base={BASE.AGI} usage={USAGE.AGI} onChange={(v) => handleNumericChange("AGI", v)} onBlur={() => handleNumericBlur("AGI")} onDelta={(d) => handleDelta("AGI", d)} />
        <StatCell label="Education" value={form.EDU} base={BASE.EDU} usage={USAGE.EDU} onChange={(v) => handleNumericChange("EDU", v)} onBlur={() => handleNumericBlur("EDU")} onDelta={(d) => handleDelta("EDU", d)} />
        <StatCell label="Luck" value={form.LUCK} base={BASE.LUCK} usage={USAGE.LUCK} onChange={(v) => handleNumericChange("LUCK", v)} onBlur={() => handleNumericBlur("LUCK")} onDelta={(d) => handleDelta("LUCK", d)} />

        {/* Row 6 */}
        <StatCell label="Intellect" value={form.INT} base={BASE.INT} usage={USAGE.INT} onChange={(v) => handleNumericChange("INT", v)} onBlur={() => handleNumericBlur("INT")} onDelta={(d) => handleDelta("INT", d)} />
        <StatCell label="Appeal" value={form.APP} base={BASE.APP} usage={USAGE.APP} onChange={(v) => handleNumericChange("APP", v)} onBlur={() => handleNumericBlur("APP")} onDelta={(d) => handleDelta("APP", d)} />
        <StatCell label="Bonus" value={form.BONUS} base={BASE.BONUS} usage={USAGE.BONUS} onChange={(v) => handleNumericChange("BONUS", v)} onBlur={() => handleNumericBlur("BONUS")} onDelta={(d) => handleDelta("BONUS", d)} />
        
        {/* Row 7 */}
        <StatCell label="Spot" value={form.SPOT} base={BASE.SPOT} usage={USAGE.SPOT} onChange={(v) => handleNumericChange("SPOT", v)} onBlur={() => handleNumericBlur("SPOT")} onDelta={(d) => handleDelta("SPOT", d)} />
        <StatCell label="Perception" value={form.PER} base={BASE.PER} usage={USAGE.PER} onChange={(v) => handleNumericChange("PER", v)} onBlur={() => handleNumericBlur("PER")} onDelta={(d) => handleDelta("PER", d)} />
        <StatCell label="Sanity" value={form.SAN}  base={BASE.SAN} usage={USAGE.SAN} onChange={(v) => handleNumericChange("SAN", v)} onBlur={() => handleNumericBlur("SAN")} onDelta={(d) => handleDelta("SAN", d)} />
        <ReadSmall label="Build" value={form.Build ?? 0} />

        {/* Row 8 */}
        <ReadSmall label="Reputation" value={form.REP ?? 0} />
        <StatCell label="Bravery" value={form.BRV} base={BASE.BRV} usage={USAGE.BRV} onChange={(v) => handleNumericChange("BRV", v)} onBlur={() => handleNumericBlur("BRV")} onDelta={(d) => handleDelta("BRV", d)} />
        <ReadSmall label="Move" value={form.MOVE ?? 8} />
        <ReadSmall label="Damage Bonus" value={form.damageBonus ?? "0"} />
        <StatCell label="Armor" value={form.ARMOR} base={BASE.ARMOR} usage={USAGE.ARMOR} onChange={(v) => handleNumericChange("ARMOR", v)} onBlur={() => handleNumericBlur("ARMOR")} onDelta={(d) => handleDelta("ARMOR", d)} isSmallStep={true} />
        <StatCell label="Resiliance" value={form.RES} base={BASE.RES} usage={USAGE.RES} onChange={(v) => handleNumericChange("RES", v)} onBlur={() => handleNumericBlur("RES")} onDelta={(d) => handleDelta("RES", d)} isSmallStep={true} />
        <ReadSmall label="Total XP" value={form.totalXP ?? 0} />
        <ReadSmall label="Used XP" value={form.usedXP ?? 0} />
      </div>

      <form
        onSubmit={(e) => handleSubmit(e, false)}
        style={styles.form}
      >
        <div className="sheet-grid" style={styles.grid}>
          {FIELD_DEFS.map((def) => {
            const value = form[def.key] ?? "";
            const base = BASE[def.key];
            const usage = USAGE[def.key];
            const isNumber = def.type === "number";
            const labelWithBase = base !== undefined ? `${def.label} ${base}` : def.label;

            const numericValue = Number(value) || 0;
            const currentCost = getCurrentCostPerPoint(usage, numericValue);
            const totalCost = isNumber && usage !== undefined ? getCostBetween(def.key, base ?? 0, numericValue) : 0;
            const costColor = getCostColor(currentCost);
            const tooltipText = isNumber && usage !== undefined ? `Spent: ${totalCost}` : "";
            const deltaTooltipText = `${currentCost * 5} XP`;

            const labelExtra =
              isNumber && (usage !== undefined)
                ? ` (Cost: ${currentCost})`
                : "";
            const halfValue = Math.floor(numericValue / 2);
            const fifthValue = Math.floor(numericValue / 5);

            return (
              <div key={def.key} style={styles.field}>
                <div className="field-header" style={styles.fieldHeader} title={tooltipText}> 
                  <span style={{ ...styles.labelText, flex: 1 }}>
                    {def.label} <strong className="no-print">{labelWithBase.split(" ").pop()}</strong>
                    {labelExtra && (
                      <span className="label-extra no-print" style={{ ...styles.labelExtra, color: costColor, fontWeight: "bold" }}>{labelExtra}</span>
                    )}
                  </span>

                  <div className="value-row" style={styles.valueRow}>
                    {isNumber && (
                      <div className="xp-buttons" style={styles.stepButtons}>
                        <button
                          type="button"
                          style={{ ...styles.stepButton, background: costColor, color: "#fff" }}
                          title={deltaTooltipText}
                          onClick={() => handleDelta(def.key, -5)}
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          style={{ ...styles.stepButton, background: costColor, color: "#fff" }}
                          title={deltaTooltipText}
                          onClick={() => handleDelta(def.key, +5)}
                        >
                          +5
                        </button>
                      </div>
                    )}

                    <input
                      type={def.type}
                      name={def.key}
                      value={def.type === "number" && numericValue === 0 ? "" : value}
                      onChange={(e) =>
                        def.type === "number"
                          ? handleNumericChange(def.key, e.target.value)
                          : handleTextChange(def.key, e.target.value)
                      }
                      onBlur={def.type === "number" ? () => handleNumericBlur(def.key) : undefined}
                      max={def.type === "number" ? 90 : undefined}
                      style={styles.inputInline}
                      placeholder={def.type === "number" && numericValue === 0 ? "0" : undefined}
                    />

                    <input
                      readOnly
                      value={halfValue}
                      style={styles.inputInlineReadOnly}
                      aria-label={`${def.label} half value`}
                    />

                    <input
                      readOnly
                      value={fifthValue}
                      style={styles.inputInlineReadOnlySmall}
                      aria-label={`${def.label} fifth value`}
                    />
                  </div>
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

          <button
            type="button"
            style={{ ...styles.button, background: "#8b5cf6" }}
            onClick={handleExportJSON}
          >
            JSON'a Aktar
          </button>
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
    border: "2px solid #c97316",
    background: "#fefce8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    cursor: "pointer",
  },
  avatarPlaceholder: {
    fontSize: "0.85rem",
    color: "#9ca3af",
    textAlign: "center",
  },
  avatarInput: {
    display: "none",
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
    gap: "0.6rem 1rem",
    background: "#ffffffff",
    borderRadius: "0.75rem",
    border: "1px solid #000000ff",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.12rem",
    fontSize: "0.75rem",
    position: "relative",
  },
  fieldHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.24rem",
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
    fontSize: "0.75rem",
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
    padding: "0.13rem 0.18rem",
    borderRadius: "0.28rem",
    border: "1px solid #000000ff",
    background: "#ffffffff",
    color: "#111827",
    fontSize: "0.76rem",
    boxSizing: "border-box",
    width: "32px",
    minWidth: "28px",
    maxWidth: "40px",
    textAlign: "right",
  },
  inputInlineReadOnly: {
    padding: "0.11rem 0.16rem",
    borderRadius: "0.28rem",
    border: "1px solid #d1d5db",
    background: "#f3f4f6",
    color: "#6b7280",
    fontSize: "0.74rem",
    boxSizing: "border-box",
    width: "24px",
    minWidth: "20px",
    maxWidth: "32px",
    textAlign: "right",
  },
  inputInlineReadOnlySmall: {
    padding: "0.10rem 0.14rem",
    borderRadius: "0.28rem",
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    color: "#6b7280",
    fontSize: "0.72rem",
    boxSizing: "border-box",
    width: "20px",
    minWidth: "18px",
    maxWidth: "28px",
    textAlign: "right",
  },
  valueRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.1rem",
    flexShrink: 0,
    justifyContent: "flex-end",
    minWidth: 0,
    flexBasis: "45%",
    maxWidth: "48%",
    flexWrap: "wrap",
    marginLeft: "auto",
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
    gap: "0.2rem",
  },
  stepButton: {
    padding: "0.08rem 0.3rem",
    borderRadius: "0.35rem",
    border: "1px solid #78350f",
    background: "#facc15",
    color: "#451a03",
    fontSize: "0.62rem",
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
      gap: "4px 5px",
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
    alignSelf: "start",
    gap: "6px",
    border: "1px solid rgba(0,0,0,0.18)",
    borderRadius: "8px",
    padding: "8px",
    background: "#fff",
  },
  avatarBox: {
    width: "182px",
    height: "238px",
    border: "2px solid #111",
    borderRadius: "4px",
    overflow: "hidden",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "border-color 0.2s",
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
