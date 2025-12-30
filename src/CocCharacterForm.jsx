//UNUSED FILE
import { useState } from "react";

function CocCharacterForm({ player, onCancel }) {
  const [characterData, setCharacterData] = useState(player || {});

  const handleInputChange = (field, value) => {
    setCharacterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('characterData', JSON.stringify(characterData));
    alert('Character data saved!');
  };

  const styles = {
    pageWrapper: {
      background: "#f3f3f3",
      minHeight: "100vh",
      padding: "14px",
      fontFamily: '"Georgia", "Times New Roman", serif',
      color: "#222",
    },
    page: {
      width: "210mm",
      minHeight: "297mm",
      margin: "0 auto",
      background: "#fff",
      boxShadow: "0 10px 30px rgba(0,0,0,.12)",
      padding: "12mm",
      boxSizing: "border-box",
      position: "relative",
    },
    titleWrap: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "2mm",
      marginBottom: "4mm",
      position: "relative",
      zIndex: 2,
    },
    title: {
      fontVariant: "small-caps",
      letterSpacing: ".8px",
      fontSize: "20px",
      border: "2px solid #9a9a9a",
      padding: "6px 14px",
      background: "#fff",
    },
    top: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
      position: "relative",
      zIndex: 2,
    },
    topLeft: {
      display: "grid",
      gap: "10px",
    },
    fields: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "10px 14px",
      alignContent: "start",
    },
    field: {
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      gap: "6px",
      alignItems: "end",
      fontSize: "13px",
    },
    fieldLabel: {
      fontSize: "13px",
      fontWeight: "500",
    },
    line: {
      borderBottom: "1.8px solid #9a9a9a",
      height: "18px",
    },
    input: {
      borderBottom: "1.8px solid #9a9a9a",
      height: "18px",
      border: "none",
      borderBottomWidth: "1.8px",
      borderBottomStyle: "solid",
      borderBottomColor: "#9a9a9a",
      fontSize: "13px",
      padding: "2px 0",
      boxSizing: "border-box",
      fontFamily: 'inherit',
    },
    topStats: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "10px 14px",
    },
    topStatItem: {
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      gap: "6px",
      alignItems: "end",
      fontSize: "13px",
    },
    statLabel: {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      fontWeight: "700",
      fontSize: "12px",
      whiteSpace: "nowrap",
    },
    statCells: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "4px",
    },
    cell: {
      border: "1.6px solid #9a9a9a",
      height: "16px",
      background: "#fff",
      padding: "2px",
      boxSizing: "border-box",
      fontSize: "11px",
    },
    portrait: {
      border: "2px solid #9a9a9a",
      height: "48mm",
      position: "relative",
      background: "#fff",
    },
    buttonBar: {
      display: "flex",
      gap: "10px",
      marginTop: "20px",
      justifyContent: "center",
    },
    button: {
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "600",
      border: "1px solid #9a9a9a",
      borderRadius: "4px",
      cursor: "pointer",
      background: "#fff",
    },
    saveButton: {
      background: "#4CAF50",
      color: "#fff",
      borderColor: "#4CAF50",
    },
    cancelButton: {
      background: "#f44336",
      color: "#fff",
      borderColor: "#f44336",
    },
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.page}>
        <div style={styles.titleWrap}>
          <div style={styles.title}>1920s Era Investigator</div>
        </div>

        {/* TOP SECTION */}
        <section style={styles.top}>
          <div style={styles.topLeft}>
            <div style={styles.fields}>
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Name</div>
                <input
                  type="text"
                  style={styles.input}
                  value={characterData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Character name"
                />
              </div>
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Birthplace</div>
                <input
                  type="text"
                  style={styles.input}
                  value={characterData.birthplace || ''}
                  onChange={(e) => handleInputChange('birthplace', e.target.value)}
                  placeholder="Birthplace"
                />
              </div>
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Pronoun</div>
                <input
                  type="text"
                  style={styles.input}
                  value={characterData.pronoun || ''}
                  onChange={(e) => handleInputChange('pronoun', e.target.value)}
                  placeholder="Pronoun"
                />
              </div>

              <div style={styles.field}>
                <div style={styles.fieldLabel}>Occupation</div>
                <input
                  type="text"
                  style={styles.input}
                  value={characterData.occupation || ''}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  placeholder="Occupation"
                />
              </div>
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Residence</div>
                <input
                  type="text"
                  style={styles.input}
                  value={characterData.residence || ''}
                  onChange={(e) => handleInputChange('residence', e.target.value)}
                  placeholder="Residence"
                />
              </div>
              <div style={styles.field}>
                <div style={styles.fieldLabel}>Age</div>
                <input
                  type="text"
                  style={styles.input}
                  value={characterData.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Age"
                />
              </div>
            </div>

            <div style={styles.topStats}>
              <div style={styles.topStatItem}>
                <div style={styles.statLabel}>STR</div>
                <input
                  type="text"
                  style={styles.input}
                  value={characterData.STR || ''}
                  onChange={(e) => handleInputChange('STR', e.target.value)}
                  placeholder="STR"
                />
              </div>
              <div style={styles.topStatItem}>
                <div style={styles.statLabel}>SIZ</div>
                <input
                  type="text"
                  style={styles.input}
                  value={characterData.SIZ || ''}
                  onChange={(e) => handleInputChange('SIZ', e.target.value)}
                  placeholder="SIZ"
                />
              </div>
              <div style={styles.topStatItem}>
                <div style={styles.statLabel}>Hit Points</div>
                <div style={styles.statCells}>
                  <div style={styles.cell}></div>
                  <div style={styles.cell}></div>
                </div>
              </div>

              <div style={styles.topStatItem}>
                <div style={styles.statLabel}>CON</div>
                <input
                  type="text"
                  style={styles.input}
                  value={characterData.CON || ''}
                  onChange={(e) => handleInputChange('CON', e.target.value)}
                  placeholder="CON"
                />
              </div>
              <div style={styles.topStatItem}>
                <div style={styles.statLabel}>POW</div>
                <input
                  type="text"
                  style={styles.input}
                  value={characterData.POW || ''}
                  onChange={(e) => handleInputChange('POW', e.target.value)}
                  placeholder="POW"
                />
              </div>
              <div style={styles.topStatItem}>
                <div style={styles.statLabel}>Magic Points</div>
                <div style={styles.statCells}>
                  <div style={styles.cell}></div>
                  <div style={styles.cell}></div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.portrait}>
            <div style={{ position: "absolute", right: 0, bottom: -2, fontFamily: "system-ui", fontWeight: 800, letterSpacing: ".6px", fontSize: "20px", opacity: .22, userSelect: "none", padding: "0 2px 2px 0" }}>
              CALL OF CTHULHU
            </div>
          </div>
        </section>

        {/* SAVE/CANCEL BUTTONS */}
        <div style={styles.buttonBar}>
          <button
            style={{ ...styles.button, ...styles.saveButton }}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CocCharacterForm;
