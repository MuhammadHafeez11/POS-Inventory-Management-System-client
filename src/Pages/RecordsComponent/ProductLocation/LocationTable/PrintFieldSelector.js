import { useState, useEffect } from "react"
import { Modal } from "semantic-ui-react"
import { useTranslation } from "react-i18next"

const PrintFieldSelector = ({ open, onClose, columns, onApply, initialSelectedFields = [] }) => {
  const { t } = useTranslation()
  const [selectedFields, setSelectedFields] = useState(initialSelectedFields)

  useEffect(() => {
    // Initialize with all fields selected if no initial fields provided
    if (initialSelectedFields.length === 0 && columns.length > 0) {
      setSelectedFields(columns.map((col) => col.field))
    } else {
      setSelectedFields(initialSelectedFields)
    }
  }, [columns, initialSelectedFields])

  const handleToggleField = (field) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field))
    } else {
      setSelectedFields([...selectedFields, field])
    }
  }

  const handleSelectAll = () => {
    setSelectedFields(columns.map((col) => col.field))
  }

  const handleDeselectAll = () => {
    setSelectedFields([])
  }

  const handleApply = () => {
    onApply(selectedFields)
    onClose()
  }

  // Custom styles
  const styles = {
    modal: {
      borderRadius: "12px",
      overflow: "hidden",
      marginLeft: "270px",
      maxHeight: "90vh",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    },
    header: {
      background: "linear-gradient(135deg, #2185d0, #1678c2)",
      color: "white",
      padding: "16px 24px",
      fontSize: "20px",
      fontWeight: "600",
      borderBottom: "none",
    },
    content: {
      padding: "24px",
      background: "#f8f9fa",
    },
    description: {
      fontSize: "15px",
      color: "#333",
      marginBottom: "20px",
      fontWeight: "500",
    },
    buttonContainer: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    selectAllBtn: {
      background: "#2185d0",
      color: "white",
      fontWeight: "500",
      padding: "10px 16px",
      borderRadius: "6px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    deselectAllBtn: {
      background: "#333",
      color: "white",
      fontWeight: "500",
      padding: "10px 16px",
      borderRadius: "6px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    fieldsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "16px",
      marginTop: "10px",
      background: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    },
    fieldItem: {
      marginBottom: "12px",
    },
    checkbox: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    },
    checkboxInput: {
      marginRight: "10px",
      width: "18px",
      height: "18px",
      accentColor: "#2185d0",
    },
    checkboxLabel: {
      fontSize: "15px",
      fontWeight: "500",
      color: "#333",
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "16px 24px",
      background: "#f8f9fa",
      borderTop: "1px solid #e9ecef",
      gap: "12px",
    },
    cancelBtn: {
      background: "#e9ecef",
      color: "#495057",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    applyBtn: {
      background: "#2185d0",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      opacity: selectedFields.length === 0 ? "0.6" : "1",
      pointerEvents: selectedFields.length === 0 ? "none" : "auto",
    },
  }

  return (
    <Modal open={open} onClose={onClose} size="small" style={styles.modal}>
      <div style={styles.header}>{t("Select Fields to Print")}</div>
      <div style={styles.content}>
        <div style={styles.description}>{t("Select the fields you want to include in the printed table")}</div>

        <div style={styles.buttonContainer}>
          <button
            onClick={handleSelectAll}
            style={styles.selectAllBtn}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1a6fb9")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#2185d0")}
          >
            {t("Select All")}
          </button>
          <button
            onClick={handleDeselectAll}
            style={styles.deselectAllBtn}
            onMouseOver={(e) => (e.currentTarget.style.background = "#222")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#333")}
          >
            {t("Deselect All")}
          </button>
        </div>

        <div style={styles.fieldsGrid}>
          {columns.map((column) => (
            <div key={column.field} style={styles.fieldItem}>
              <label style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={selectedFields.includes(column.field)}
                  onChange={() => handleToggleField(column.field)}
                  style={styles.checkboxInput}
                />
                <span style={styles.checkboxLabel}>{column.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.actions}>
        <button
          onClick={onClose}
          style={styles.cancelBtn}
          onMouseOver={(e) => (e.currentTarget.style.background = "#dee2e6")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#e9ecef")}
        >
          {t("Cancel")}
        </button>
        <button
          onClick={handleApply}
          disabled={selectedFields.length === 0}
          style={styles.applyBtn}
          onMouseOver={(e) => {
            if (selectedFields.length > 0) {
              e.currentTarget.style.background = "#1a6fb9"
            }
          }}
          onMouseOut={(e) => {
            if (selectedFields.length > 0) {
              e.currentTarget.style.background = "#2185d0"
            }
          }}
        >
          {t("Apply")}
        </button>
      </div>
    </Modal>
  )
}

export default PrintFieldSelector
