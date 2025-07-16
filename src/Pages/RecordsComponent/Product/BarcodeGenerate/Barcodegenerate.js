import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MetaData from "../../../../MetaData"
import { Button } from "semantic-ui-react"
import Barcode from "react-barcode"
import ReactToPrint from "react-to-print"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import PrintIcon from "@mui/icons-material/Print"
import SettingsIcon from "@mui/icons-material/Settings"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import { useTranslation } from "react-i18next"
import { getProductLocationForBarcode } from "../../../../actions/productLocationAction"
import { toast } from "react-toastify"

const BarcodeGenerator = () => {
  const { t } = useTranslation()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [colorTheme, setColorTheme] = useState("theme-white")
  // Add showColor option to printSettings
  const [printSettings, setPrintSettings] = useState({
    showProductName: true,
    showCategory: true,
    showCompany: true,
    showPrice: true,
    showColor: true, // Add this new option
    copies: 1,
    size: "medium", // small, medium, large
  })
  const [showSettings, setShowSettings] = useState(false)

  const params = useParams()
  const navigate = useNavigate()
  const printRef = useRef()
  const barcodeRef = useRef()

  useEffect(() => {
    fetchProductDetails()
  }, [params.id])

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color")
    if (currentThemeColor) {
      setColorTheme(currentThemeColor)
    }
  }, [])

  const fetchProductDetails = async () => {
    setLoading(true)
    try {
      const response = await getProductLocationForBarcode(params.id)
      if (response && response.data) {
        setProduct(response.data)
      } else {
        setError("Product not found")
      }
    } catch (err) {
      setError("Failed to fetch product details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleSettingsChange = (setting, value) => {
    setPrintSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleCopyBarcode = () => {
    if (product?.barcode) {
      navigator.clipboard
        .writeText(product.barcode)
        .then(() => {
          toast.success("Barcode copied to clipboard!")
        })
        .catch((err) => {
          console.error("Failed to copy barcode: ", err)
        })
    }
  }

  // Replace the renderBarcodeLabels function with this improved version
  const renderBarcodeLabels = () => {
    const labels = []
    for (let i = 0; i < printSettings.copies; i++) {
      labels.push(
        <div key={i} className={`barcode-label ${printSettings.size}`}>
          <div className="barcode-content">
            {
              // Update the rendering of product name and color to respect the showColor setting
              printSettings.showProductName && (
                <div className="name-color">
                  <h3 className="product-name">
                    {product?.product?.productName}
                    {product?.product?.productName && product?.colorId?.colorName && printSettings.showColor && " - "}
                    {product?.colorId?.colorName && printSettings.showColor && (
                      <span className="color-name">{product?.colorId?.colorName}</span>
                    )}
                  </h3>
                </div>
              )
            }

            <div className="product-details">
              {printSettings.showCategory && product?.product?.productType?.productName && (
                <span className="product-category">{product?.product?.productType.productName}</span>
              )}

              {printSettings.showCompany && product?.product?.productCompany?.companyName && (
                <span className="product-company">{product?.product?.productCompany.companyName}</span>
              )}
            </div>

            <div className="barcode-container" ref={barcodeRef}>
              <Barcode
                value={product?.barcode || "0000000000000"}
                width={1.5}
                height={40}
                fontSize={14}
                margin={5}
                displayValue={true}
              />
            </div>

            {printSettings.showPrice && product?.product?.salesmanSalePrice && (
              <div className="product-price">
                <span className="price-label">{t("price")}:</span>
                <span className="price-value">{product.product?.salesmanSalePrice}</span>
              </div>
            )}
          </div>
        </div>,
      )
    }
    return labels
  }

  // Add a new function to handle the print layout
  const getPrintLayoutClass = () => {
    const count = printSettings.copies
    if (count <= 1) return "single-label"
    if (count <= 4) return "grid-2x2"
    if (count <= 9) return "grid-3x3"
    if (count <= 16) return "grid-4x4"
    return "grid-auto"
  }

  return (
    <>
      <MetaData title={`${t("barcode")} - ${product?.product?.productName || ""}`} />
      <div className={`barcode-generator-container ${colorTheme}`}>
        <div className="barcode-generator-content">
          <div className="barcode-header">
            <h2 className="page-title">{t("barcodeGenerator")}</h2>
            <div className="barcode-actions">
              <Button className="settings-button" onClick={() => setShowSettings(!showSettings)}>
                <SettingsIcon />
                <span>{t("settings")}</span>
              </Button>

              <Button className="copy-button" onClick={handleCopyBarcode} disabled={!product?.barcode}>
                <ContentCopyIcon />
                <span>{t("copyBarcode")}</span>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>{t("loadingProduct")}</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <Button onClick={handleBackClick} className="back-button">
                <ArrowBackIcon />
                <span>{t("back")}</span>
              </Button>
            </div>
          ) : (
            <div className="barcode-main-content">
              {showSettings && (
                <div className="barcode-settings">
                  <h3>{t("printSettings")}</h3>

                  <div className="settings-group">
                    <h4>{t("contentSettings")}</h4>
                    {
                      // Keep the product name checkbox and add a new checkbox for color
                    }
                    <div className="setting-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={printSettings.showProductName}
                          onChange={(e) => handleSettingsChange("showProductName", e.target.checked)}
                        />
                        {t("showProductName")}
                      </label>
                    </div>

                    {
                      // Add a new checkbox for showing/hiding color
                    }
                    <div className="setting-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={printSettings.showColor}
                          onChange={(e) => handleSettingsChange("showColor", e.target.checked)}
                        />
                        {t("showColor")}
                      </label>
                    </div>

                    {/* <div className="setting-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={printSettings.showCategory}
                          onChange={(e) => handleSettingsChange("showCategory", e.target.checked)}
                        />
                        {t("showCategory")}
                      </label>
                    </div> */}

                    <div className="setting-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={printSettings.showCompany}
                          onChange={(e) => handleSettingsChange("showCompany", e.target.checked)}
                        />
                        {t("showCompany")}
                      </label>
                    </div>

                    <div className="setting-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={printSettings.showPrice}
                          onChange={(e) => handleSettingsChange("showPrice", e.target.checked)}
                        />
                        {t("showPrice")}
                      </label>
                    </div>
                  </div>

                  <div className="settings-group">
                    <h4>{t("printOptions")}</h4>
                    <div className="setting-item">
                      <label>
                        {t("copies")}:
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={printSettings.copies}
                          onChange={(e) => handleSettingsChange("copies", Number.parseInt(e.target.value))}
                          className="copies-input"
                        />
                      </label>
                    </div>

                    <div className="setting-item">
                      <label>{t("size")}:</label>
                      <div className="size-options">
                        <label className={printSettings.size === "small" ? "selected" : ""}>
                          <input
                            type="radio"
                            name="size"
                            value="small"
                            checked={printSettings.size === "small"}
                            onChange={() => handleSettingsChange("size", "small")}
                          />
                          {t("small")}
                        </label>

                        <label className={printSettings.size === "medium" ? "selected" : ""}>
                          <input
                            type="radio"
                            name="size"
                            value="medium"
                            checked={printSettings.size === "medium"}
                            onChange={() => handleSettingsChange("size", "medium")}
                          />
                          {t("medium")}
                        </label>

                        <label className={printSettings.size === "large" ? "selected" : ""}>
                          <input
                            type="radio"
                            name="size"
                            value="large"
                            checked={printSettings.size === "large"}
                            onChange={() => handleSettingsChange("size", "large")}
                          />
                          {t("large")}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="barcode-preview-container">
                <h3 className="preview-title">{t("preview")}</h3>
                <div className="barcode-preview">
                  <div ref={printRef} className={`print-container ${getPrintLayoutClass()}`}>
                    {renderBarcodeLabels()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="barcode-footer">
            <Button onClick={handleBackClick} className="back-button">
              <ArrowBackIcon />
              <span>{t("back")}</span>
            </Button>

            <ReactToPrint
              trigger={() => (
                <Button className="print-button" disabled={loading || !product}>
                  <PrintIcon />
                  <span>{t("print")}</span>
                </Button>
              )}
              content={() => printRef.current}
              pageStyle={`
                @page {
                  size: auto;
                  margin: 10mm;
                }
                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                  }
                  .print-container {
                    display: grid !important;
                    grid-template-columns: repeat(auto-fill, minmax(48mm, 1fr)) !important;
                    grid-gap: 5mm !important;
                    width: 100% !important;
                  }
                  .barcode-label {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                    border: 1px solid #eee !important;
                  }
                  .barcode-content {
                    padding: 5mm !important;
                  }
                  .name-color .product-name {
                    font-size: 10pt !important;
                    margin-bottom: 2mm !important;
                  }
                  .product-details {
                    margin-bottom: 2mm !important;
                    font-size: 8pt !important;
                  }
                  .product-price {
                    font-size: 9pt !important;
                    margin-top: 2mm !important;
                  }
                }
              `}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default BarcodeGenerator
