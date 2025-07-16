import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Dropdown, Checkbox, Pagination, Grid, Segment, Icon } from "semantic-ui-react"
import Barcode from "react-barcode"
import ReactToPrint from "react-to-print"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import PrintIcon from "@mui/icons-material/Print"
import SettingsIcon from "@mui/icons-material/Settings"
import DeleteIcon from "@mui/icons-material/Delete"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import MetaData from "../../../../MetaData"
// import './_MultipleBarcodeGenerator.scss'

const MultiBarcodeGenerator = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const printRef = useRef()

  // Get selected products data from location state
  const selectedProductsData = location.state?.selectedProductsData || []

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [colorTheme, setColorTheme] = useState("theme-white")

  // Global print settings
  const [printSettings, setPrintSettings] = useState({
    showProductName: true,
    showCategory: false,
    showCompany: true,
    showPrice: true,
    showColor: true,
    copies: 1,
    size: "medium", // small, medium, large
    paperSize: "a4", // a4, letter, custom
    orientation: "portrait", // portrait, landscape
    columns: 2, // Number of columns in the grid
    rows: 5, // Number of rows in the grid
    labelWidth: 100, // in mm
    labelHeight: 50, // in mm
    showBorder: true,
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // UI state
  const [showSettings, setShowSettings] = useState(false)
  const [selectedBarcodes, setSelectedBarcodes] = useState([])

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color")
    if (currentThemeColor) {
      setColorTheme(currentThemeColor)
      document.body.className = currentThemeColor
    }

    if (selectedProductsData.length > 0) {
      setProducts(selectedProductsData)
    } else {
      setError("No products selected")
    }
  }, [])

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleSettingsChange = (setting, value) => {
    setPrintSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage)
  }

  const toggleBarcodeSelection = (productId) => {
    if (selectedBarcodes.includes(productId)) {
      setSelectedBarcodes(selectedBarcodes.filter((id) => id !== productId))
    } else {
      setSelectedBarcodes([...selectedBarcodes, productId])
    }
  }

  const selectAllBarcodes = () => {
    if (selectedBarcodes.length === products.length) {
      setSelectedBarcodes([])
    } else {
      setSelectedBarcodes(products.map((product) => product._id))
    }
  }

  const removeSelectedBarcodes = () => {
    if (selectedBarcodes.length === 0) return

    setProducts(products.filter((product) => !selectedBarcodes.includes(product._id)))
    setSelectedBarcodes([])
    toast.success("Selected barcodes removed")
  }

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem)

  // Calculate grid layout based on settings
  const getGridTemplateColumns = () => {
    return `repeat(${printSettings.columns}, 1fr)`
  }

  // Render a single barcode label
  const renderBarcodeLabel = (product, index) => {
    return (
      <div
        key={`${product._id}-${index}`}
        className={`barcode-label ${printSettings.size} ${printSettings.showBorder ? "with-border" : ""}`}
        style={{
          width: `${printSettings.labelWidth}mm`,
          height: `${printSettings.labelHeight}mm`,
        }}
      >
        <div className="barcode-content">
          {printSettings.showProductName && (
            <div className="name-color">
              <h3 className="product-name">
                {product?.product?.productName}
                {product?.product?.productName && product?.colorId?.colorName && printSettings.showColor && " - "}
                {product?.colorId?.colorName && printSettings.showColor && (
                  <span className="color-name">{product?.colorId?.colorName}</span>
                )}
              </h3>
            </div>
          )}

          <div className="product-details">
            {printSettings.showCategory && product?.product?.productTypeName?.productName && (
              <span className="product-category">{product?.product?.productTypeName.productName}</span>
            )}

            {printSettings.showCompany && product?.product?.productCompany?.companyName && (
              <span className="product-company">{product?.product?.productCompany.companyName}</span>
            )}
          </div>

          <div className="barcode-container">
            <Barcode
              value={product?.barcode || "0000000000000"}
              width={1.2}
              height={30}
              fontSize={12}
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
      </div>
    )
  }

  // Render all barcode labels for printing
  const renderAllBarcodeLabels = () => {
    const allLabels = []

    products.forEach((product) => {
      for (let i = 0; i < printSettings.copies; i++) {
        allLabels.push(renderBarcodeLabel(product, i))
      }
    })

    return allLabels
  }

  // Render barcode grid for preview
  const renderBarcodeGrid = () => {
    return (
      <div
        className="barcode-grid"
        style={{
          display: "grid",
          gridTemplateColumns: getGridTemplateColumns(),
          gap: "10px",
        }}
      >
        {currentProducts.map((product, index) => (
          <div key={product._id} className="barcode-item">
            <div className="barcode-selection">
              <Checkbox
                checked={selectedBarcodes.includes(product._id)}
                onChange={() => toggleBarcodeSelection(product._id)}
              />
            </div>
            {renderBarcodeLabel(product, index)}
          </div>
        ))}
      </div>
    )
  }

  // Get print layout class based on settings
  const getPrintLayoutClass = () => {
    return `print-layout-${printSettings.columns}x${printSettings.rows}`
  }

  return (
    <>
      <MetaData title={t("multipleBarcodeGenerator")} />
      <div className={`multi-barcode-generator-container ${colorTheme}`}>
        <div className="multi-barcode-generator-content">
          <div className="barcode-header">
            <h2 className="page-title">{t("multipleBarcodeGenerator")}</h2>
            <div className="barcode-actions">
              <Button className="settings-button" onClick={() => setShowSettings(!showSettings)}>
                <SettingsIcon />
                <span>{t("settings")}</span>
              </Button>

              <Button
                className="delete-button"
                onClick={removeSelectedBarcodes}
                disabled={selectedBarcodes.length === 0}
              >
                <DeleteIcon />
                <span>{t("removeSelected")}</span>
              </Button>

              <Button className="select-all-button" onClick={selectAllBarcodes}>
                <Icon name={selectedBarcodes.length === products.length ? "square outline" : "check square outline"} />
                <span>{selectedBarcodes.length === products.length ? t("deselectAll") : t("selectAll")}</span>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>{t("loadingProducts")}</p>
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

                  <Grid columns={2}>
                    <Grid.Column>
                      <Segment>
                        <h4>{t("contentSettings")}</h4>
                        <div className="setting-item">
                          <Checkbox
                            label={t("showProductName")}
                            checked={printSettings.showProductName}
                            onChange={(e, data) => handleSettingsChange("showProductName", data.checked)}
                          />
                        </div>

                        <div className="setting-item">
                          <Checkbox
                            label={t("showColor")}
                            checked={printSettings.showColor}
                            onChange={(e, data) => handleSettingsChange("showColor", data.checked)}
                          />
                        </div>

                        <div className="setting-item">
                          <Checkbox
                            label={t("showCategory")}
                            checked={printSettings.showCategory}
                            onChange={(e, data) => handleSettingsChange("showCategory", data.checked)}
                          />
                        </div>

                        <div className="setting-item">
                          <Checkbox
                            label={t("showCompany")}
                            checked={printSettings.showCompany}
                            onChange={(e, data) => handleSettingsChange("showCompany", data.checked)}
                          />
                        </div>

                        <div className="setting-item">
                          <Checkbox
                            label={t("showPrice")}
                            checked={printSettings.showPrice}
                            onChange={(e, data) => handleSettingsChange("showPrice", data.checked)}
                          />
                        </div>

                        <div className="setting-item">
                          <Checkbox
                            label={t("showBorder")}
                            checked={printSettings.showBorder}
                            onChange={(e, data) => handleSettingsChange("showBorder", data.checked)}
                          />
                        </div>
                      </Segment>
                    </Grid.Column>

                    <Grid.Column>
                      <Segment>
                        <h4>{t("layoutSettings")}</h4>
                        <div className="setting-item">
                          <label>{t("paperSize")}:</label>
                          <Dropdown
                            selection
                            options={[
                              { key: "a4", text: "A4", value: "a4" },
                              { key: "letter", text: "Letter", value: "letter" },
                              { key: "custom", text: "Custom", value: "custom" },
                            ]}
                            value={printSettings.paperSize}
                            onChange={(e, { value }) => handleSettingsChange("paperSize", value)}
                          />
                        </div>

                        <div className="setting-item">
                          <label>{t("orientation")}:</label>
                          <Dropdown
                            selection
                            options={[
                              { key: "portrait", text: t("portrait"), value: "portrait" },
                              { key: "landscape", text: t("landscape"), value: "landscape" },
                            ]}
                            value={printSettings.orientation}
                            onChange={(e, { value }) => handleSettingsChange("orientation", value)}
                          />
                        </div>

                        <div className="setting-item">
                          <label>{t("columns")}:</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={printSettings.columns}
                            onChange={(e) => handleSettingsChange("columns", Number.parseInt(e.target.value))}
                          />
                        </div>

                        <div className="setting-item">
                          <label>{t("rows")}:</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={printSettings.rows}
                            onChange={(e) => handleSettingsChange("rows", Number.parseInt(e.target.value))}
                          />
                        </div>

                        <div className="setting-item">
                          <label>{t("copies")}:</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={printSettings.copies}
                            onChange={(e) => handleSettingsChange("copies", Number.parseInt(e.target.value))}
                          />
                        </div>

                        <div className="setting-item">
                          <label>{t("size")}:</label>
                          <div className="size-options">
                            <Checkbox
                              radio
                              label={t("small")}
                              name="sizeRadioGroup"
                              value="small"
                              checked={printSettings.size === "small"}
                              onChange={() => handleSettingsChange("size", "small")}
                            />
                            <Checkbox
                              radio
                              label={t("medium")}
                              name="sizeRadioGroup"
                              value="medium"
                              checked={printSettings.size === "medium"}
                              onChange={() => handleSettingsChange("size", "medium")}
                            />
                            <Checkbox
                              radio
                              label={t("large")}
                              name="sizeRadioGroup"
                              value="large"
                              checked={printSettings.size === "large"}
                              onChange={() => handleSettingsChange("size", "large")}
                            />
                          </div>
                        </div>
                      </Segment>
                    </Grid.Column>
                  </Grid>
                </div>
              )}

              <div className="barcode-preview-container">
                <h3 className="preview-title">
                  {t("preview")} ({products.length} {t("products")})
                </h3>

                <div className="barcode-preview">
                  {renderBarcodeGrid()}

                  {/* Hidden print container with all barcodes */}
                  <div style={{ display: "none" }}>
                    <div
                      ref={printRef}
                      className={`print-container ${getPrintLayoutClass()}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: getGridTemplateColumns(),
                        gap: "5mm",
                      }}
                    >
                      {renderAllBarcodeLabels()}
                    </div>
                  </div>
                </div>

                {products.length > itemsPerPage && (
                  <div className="pagination-container">
                    <Pagination
                      activePage={currentPage}
                      onPageChange={handlePageChange}
                      totalPages={Math.ceil(products.length / itemsPerPage)}
                      ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
                      firstItem={{ content: <Icon name="angle double left" />, icon: true }}
                      lastItem={{ content: <Icon name="angle double right" />, icon: true }}
                      prevItem={{ content: <Icon name="angle left" />, icon: true }}
                      nextItem={{ content: <Icon name="angle right" />, icon: true }}
                    />
                  </div>
                )}
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
                <Button className="print-button" disabled={loading || products.length === 0}>
                  <PrintIcon />
                  <span>{t("print")}</span>
                </Button>
              )}
              content={() => printRef.current}
              pageStyle={`
                @page {
                  size: ${printSettings.paperSize} ${printSettings.orientation};
                  margin: 10mm;
                }
                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                  }
                  .print-container {
                    display: grid !important;
                    grid-template-columns: repeat(${printSettings.columns}, 1fr) !important;
                    grid-gap: 5mm !important;
                    width: 100% !important;
                  }
                  .barcode-label {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                    ${printSettings.showBorder ? "border: 1px solid #eee !important;" : "border: none !important;"}
                    
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

export default MultiBarcodeGenerator
