import { useContext } from "react"
import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PrintFieldSelector from "./PrintFieldSelector"
import { refreshTokken } from "../../../../actions/userAction"
import { getPermissionForRoles } from "../../../user/rolesAssigned/RolesPermissionValidation"
import { tableState } from "../../../../Components/tableComponent/tableContext"
import { getStorage } from "../../../../actions/storageAction"
import { getShop } from "../../../../actions/shopAction"
import { useGetProductsQuery } from "../../../../actionHooks/AvailableProductHook"
import { useDebounce } from "../../../../actionHooks/Debounse"
import MetaData from "../../../../MetaData"
import InventoryTable from "../../../../Components/GlobalTablePageDesign/InventoryTable"
import PrintContent from "./PrintContent.js"
// import "./print-styles.css"

let selecteddShop = []
let selecteddGodown = []
let isCalled = "false"

const OtherRolesLocTable = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const linkk = "updateLoc"
  const [data, setData] = useState()
  const [adminData, setAdminData] = useState()
  const [selectedShop, setSelectedShop] = useState()
  const [selectedGodown, setSelectedGodown] = useState()
  const [selectedAdminShop, setSelectedAdminShop] = useState()
  const [selectedAdminGodown, setSelectedAdminGodown] = useState()
  const [productCode, setProductCode] = useState()
  const [shopAdmin, setShopAdmin] = useState(false)
  const [productType, setProductType] = useState()
  const [productCompany, setProductCompany] = useState()
  const [isGodownOpen, setIsGodownOpen] = useState(false)
  const [godownValue, setGodownValue] = useState()
  const { t, i18n } = useTranslation()
  const actionUpdate = "Update"
  const printAction = "availableProducts"
  const printActionShop = "availableProductsOnlyShop"
  const action1 = "View Barcode"
  const link2 = "generate"
  const action3 = "Delete"
  const [colorTheme, setColorTheme] = useState("theme-white")
  const [downloadXLS, setDownloadXLS] = useState(false)
  const [loadingPrintData, setLoadingPrintData] = useState(false)
  const [havePermissionToPrintAvailableProducts, setHavePermissionToPrintAvailableProducts] = useState(false)

  // State for print field selection
  const [printFieldSelectorOpen, setPrintFieldSelectorOpen] = useState(false)
  const [selectedPrintFields, setSelectedPrintFields] = useState([])
  const [printColumns, setPrintColumns] = useState([])
  const [isPrinting, setIsPrinting] = useState(false)

  // New state for multi-select functionality
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showMultiSelectUI, setShowMultiSelectUI] = useState(false)

  const [viewProductLocationPermission, setViewProductLocationPermission] = useState(false)
  const [loadingState, setLoadingState] = useState(true)

  const { user, loading } = useSelector((state) => state.user)

  const componentRef = useRef()
  const [shopType, setShopType] = useState("")
  const [godownType, setGodownType] = useState("")
  const [shopId, setShopId] = useState(user?.user?.shopNo?._id)
  const [godownId, setGodownId] = useState("")
  const [code, setCode] = useState("")
  const [type, setType] = useState("")
  const [company, setCompany] = useState("")

  const debouncedCode = useDebounce(code, 500)
  const debouncedProductType = useDebounce(type, 500)
  const debouncedCompany = useDebounce(company, 500)

  const shopAsArray = [selecteddShop]
  const shopCodes = shopAsArray?.map((shop) => shop)
  const godownCodes = selecteddGodown.map((godown) => godown)
  const combinedOptions = [...shopCodes, ...godownCodes]
  const {
    data: locData,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery(shopType, godownType, shopId, godownId, debouncedCode, debouncedProductType, debouncedCompany)

  const [filters, setFilters] = useState({
    productCode: "",
    productType: "",
    productCompany: "",
    shopType: "",
    godownType: "",
  })

  const [actionLinks, setActionLinks] = useState({
    action1: "updateLoc",
    action2: "Update",
    action3: "Delete",
    action4: "generate",
    action5: "View Barcode",
  })

  const filterFields = [
    {
      name: "shopType",
      placeholder: "selectBranch/WareHouse",
      type: "select",
      options: combinedOptions, // Add more product types as needed
    },
    { name: "productCode", placeholder: "Enter Product Code", type: "text" },
    { name: "productType", placeholder: "Enter Product Type", type: "text" },
    {
      name: "productCompany",
      placeholder: "Enter Product Company",
      type: "text",
    },
  ]

  const { rowCount, setRowCount } = useContext(tableState)
  const { productLocationOnShopType } = useSelector((state) => state.productLocationOnShopType)
  const { storage } = useSelector((state) => state.storage)
  const { shop } = useSelector((state) => state.shop)

  useEffect(() => {
    refetch()
  }, [shopId, godownId, code, company, type])

  // Create a separate print window/iframe for printing
  const createPrintFrame = (content) => {
    // Remove any existing print frames
    const oldFrame = document.getElementById("print-frame")
    if (oldFrame) {
      document.body.removeChild(oldFrame)
    }

    // Create a new iframe
    const printFrame = document.createElement("iframe")
    printFrame.id = "print-frame"
    printFrame.name = "print-frame"
    printFrame.style.position = "fixed"
    printFrame.style.left = "-9999px"
    printFrame.style.top = "-9999px"
    printFrame.style.width = "0"
    printFrame.style.height = "0"
    printFrame.style.border = "0"
    document.body.appendChild(printFrame)

    // Write content to the iframe
    const frameDoc = printFrame.contentWindow.document
    frameDoc.open()
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print</title>
          <style>
            body { margin: 0; padding: 0; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            th, td { border: 1px solid black; padding: 4px; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            th:first-child, td:first-child { width: 45px; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            tr { page-break-inside: avoid; }
            @page { size: landscape; margin: 0.5cm; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `)
    frameDoc.close()

    return printFrame
  }

  const handleAfterPrint = () => {
    // Clean up after printing
    setIsPrinting(false)
    setLoadingPrintData(false)

    // Remove the print frame if it exists
    const printFrame = document.getElementById("print-frame")
    if (printFrame) {
      document.body.removeChild(printFrame)
    }
  }

  const handleBeforePrint = () => {
    setPrintFieldSelectorOpen(true)
    return false // Prevent immediate printing
  }

  // Handle applying selected print fields
  const handleApplyPrintFields = (selectedFields) => {
    setSelectedPrintFields(selectedFields)

    // Get the appropriate columns based on current selection
    let allColumns
    if (selectedGodown) {
      allColumns = columns4
    } else if (selectedShop) {
      allColumns = columns3
    } else {
      allColumns = columns3
    }

    // Filter columns based on selected fields
    const filteredColumns = allColumns.filter((col) => selectedFields.includes(col.field))
    setPrintColumns(filteredColumns)

    // Set printing state to true
    setIsPrinting(true)

    // Render the print content to a string
    const printContent = renderPrintContent(filteredColumns)

    // Create a print frame with the content
    const printFrame = createPrintFrame(printContent)

    // Trigger print after a short delay to ensure frame is loaded
    setTimeout(() => {
      printFrame.contentWindow.focus()
      printFrame.contentWindow.print()

      // Add event listener for afterprint
      printFrame.contentWindow.addEventListener("afterprint", handleAfterPrint, { once: true })
    }, 500)
  }

  const renderPrintContent = (columns) => {
      const processedData = locData?.data?.productLocations
      return PrintContent({
        columns,
        data: processedData,
        t,
        user,
        selectedShop,
        selectedGodown,
        shop,
      })
    }

  // Render the print content as HTML string
  // const renderPrintContent = (columns) => {
  //   const headerHtml = `
  //     <div style="text-align: center; margin-bottom: 20px;">
  //       <h2>${shop?.[0]?.companyName || "Company Name"}</h2>
  //       <p>${shop?.[0]?.address || "Company Address"}</p>
  //       <h3>${selectedShop || selectedGodown ? t("Shop Products Report") : t("Available Products Report")}</h3>
  //       <p>${t("Date")}: ${new Date().toLocaleDateString()} | ${t("Time")}: ${new Date().toLocaleTimeString()}</p>
  //       <p>${t("Generated By")}: ${user?.name || "User"}</p>
  //     </div>
  //   `

  //   // Calculate totals
  //   let quantity = 0
  //   let price = 0
  //   const processedData = locData?.data?.productLocations?.filter((item) => item.productQuantity > 0) || []

  //   processedData.forEach((item) => {
  //     const qty = Number.parseInt(item.productQuantity, 10)
  //     const itemPrice = Number.parseInt(item.totalInvoicePrice, 10)

  //     if (!isNaN(qty)) quantity += qty
  //     if (!isNaN(itemPrice)) price += itemPrice
  //   })

  //   // Generate table HTML
  //   let tableHtml = `
  //     <table>
  //       <thead>
  //         <tr>
  //           <th>${t("sNo")}</th>
  //           ${columns.map((col) => `<th>${col.label}</th>`).join("")}
  //         </tr>
  //       </thead>
  //       <tbody>
  //   `

  //   // Add rows
  //   processedData.forEach((item, index) => {
  //     tableHtml += `
  //       <tr>
  //         <td>${index + 1}</td>
  //         ${columns
  //           .map((col) => {
  //             let value = ""
  //             if (col.format === "date" || col.format === "time" || col.format === "bool") {
  //               const rawValue = getNestedValue(item, col.field)
  //               if (col.format === "date") {
  //                 value = rawValue ? new Date(rawValue).toLocaleDateString("en-GB") : ""
  //               } else if (col.format === "time") {
  //                 value = rawValue ? new Date(rawValue).toLocaleTimeString() : ""
  //               } else if (col.format === "bool") {
  //                 value = rawValue ? rawValue.toLocaleString() : ""
  //               }
  //             } else if (col.field === "updatedAt") {
  //               const date = new Date(getNestedValue(item, col.field))
  //               value = !isNaN(date)
  //                 ? new Intl.DateTimeFormat("en-PK", {
  //                     year: "numeric",
  //                     month: "long",
  //                     day: "numeric",
  //                     hour: "2-digit",
  //                     minute: "2-digit",
  //                     second: "2-digit",
  //                     hour12: true,
  //                     timeZone: "Asia/Karachi",
  //                   }).format(date)
  //                 : "Invalid Date"
  //             } else {
  //               value = getNestedValue(item, col.field)
  //             }
  //             return `<td>${value}</td>`
  //           })
  //           .join("")}
  //       </tr>
  //     `
  //   })

  //   // Add footer with totals
  //   tableHtml += `
  //       </tbody>
  //       <tfoot>
  //         <tr>
  //           <td></td>
  //           ${columns
  //             .map((col, index) => {
  //               if (col.field === "productQuantity") {
  //                 return `<td>${quantity}</td>`
  //               } else if (col.field === "totalInvoicePrice") {
  //                 return `<td>${price}</td>`
  //               } else {
  //                 return `<td></td>`
  //               }
  //             })
  //             .join("")}
  //         </tr>
  //       </tfoot>
  //     </table>
  //   `

  //   return headerHtml + tableHtml
  // }

  // Helper function to get nested property value
  const getNestedValue = (obj, path) => {
    if (!obj || !path) return ""
    const properties = path.split(".")
    return properties.reduce((prev, curr) => (prev && prev[curr] ? prev[curr] : ""), obj)
  }

  useEffect(() => {
    dispatch(getStorage())
    dispatch(getShop())
    setDownloadXLS(false)
    setViewProductLocationPermission(false)
    getPermission()
  }, [])

  async function getPermission() {
    try {
      const permissionForPrint = await getPermissionForRoles("printAvailableRecords")
      const permissionForAdd = await getPermissionForRoles("View Product Location")
      setViewProductLocationPermission(permissionForAdd)
      setHavePermissionToPrintAvailableProducts(permissionForPrint)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color")
    if (currentThemeColor) {
      setColorTheme(currentThemeColor)
      document.body.className = currentThemeColor
    }
  }, [colorTheme])

  useEffect(() => {
    isCalled = "false"
  }, [productLocationOnShopType, productCode, productCompany])

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true"
      getToken()
    }
  }, [isCalled])

  const getToken = async () => {
    const token = await refreshTokken()
    if (token?.data === "Please login to acces this resource") {
      navigate("/login")
    }
  }

  useEffect(() => {
    selecteddShop = JSON.parse(localStorage.getItem("shopId"))
    selecteddGodown = JSON.parse(localStorage.getItem("godownId"))
  }, [])

  const handleSelectTransferFromChange = async (e, { value }) => {
    setLoadingState(true)
    if (value.startsWith("G_")) {
      setSelectedGodown(value)
      setSelectedShop("")
      storage?.map(async (store) => {
        if (store?.storageCode === value) {
          setGodownId(store._id)
          setShopId("")
        }
      })
    } else {
      setSelectedGodown("")
      setSelectedShop(value)
      shop?.map(async (shopp) => {
        if (shopp?.shopCode === value) {
          setShopId(shopp._id)
          setGodownId("")
        }
      })
    }
  }

  const handleFilterChange = (e) => {
    if (e.target.name === "productCode") {
      setCode(e.target.value)
    } else if (e.target.name === "productType") {
      setType(e.target.value)
    } else if (e.target.name === "productCompany") {
      setCompany(e.target.value)
    } else if (e.target.name === "shopType") {
      setLoadingState(true)
      if (e.target.value.startsWith("G_")) {
        setSelectedGodown(e.target.value)
        setSelectedShop("")
        storage?.map(async (store) => {
          if (store?.storageCode === e.target.value) {
            setGodownId(store._id)
            setShopId("")
          }
        })
      } else {
        setSelectedGodown("")
        setSelectedShop(e.target.value)
        shop?.map(async (shopp) => {
          if (shopp?.shopCode === e.target.value) {
            setShopId(shopp._id)
            setGodownId("")
          }
        })
      }
    }
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const handleClear = (e) => {
    setFilters({
      productCode: "",
      productType: "",
      productCompany: "",
      shopType: "",
      godownType: "",
    })
    setRowCount(0)
    setCompany("")
    setCode("")
    setType("")
    setShopId(user?.user?.shopNo?._id)
    setSelectedGodown("")
    setSelectedShop("")
    setGodownId("")
    handleAfterPrint()
  }
  
  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedProducts.length === (locData?.data?.productLocations?.length || 0)) {
      setSelectedProducts([])
    } else {
      if (locData?.data?.productLocations) {
        const allProductIds = locData.data.productLocations.map((item) => item._id)
        setSelectedProducts(allProductIds)
      }
    }
  }
  // Toggle multi-select mode
  const toggleMultiSelectMode = () => {
    setShowMultiSelectUI(!showMultiSelectUI)
    if (showMultiSelectUI) {
      setSelectedProducts([])
    }
  }

   // Navigate to multi-barcode generator with selected products
  const handleGenerateMultipleBarcodes = () => {
    if (selectedProducts.length > 0) {
      // Filter the selected products from the data
      const selectedProductsData =
        locData?.data?.productLocations?.filter((product) => selectedProducts.includes(product._id)) || []

      // Navigate to the barcode generator with the selected products data
      navigate("/generate-multiple", {
        state: {
          selectedProductsData,
        },
      })
    }
  }
  
  // Handle selecting/deselecting a product
  const handleProductSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const columns1 = [
    { field: "product.avatar", label: "Avatar" },
    { field: "product.productCode", label: t("productCode") },
    { field: "product.productName", label: t("productName") },
    { field: "product.productTypeName.productName", label: t("type") },
    { field: "product.productCompany.companyName", label: t("company") },
    { field: "colorId.colorName", label: t("productColor") },
    { field: "shopAvalibility.shopCode", label: t("branch") },
    { field: "productQuantity", label: "Qty" },
    { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
    {
      field: "updatedAt",
      label: t("Date & Time"),
      format: (value) =>
        new Intl.DateTimeFormat("en-PK", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Karachi",
        }).format(new Date(value)),
    },
  ]

  const columns2 = [
    { field: "product.avatar", label: t("Avatar") },
    { field: "product.productCode", label: t("productCode") },
    { field: "product.productName", label: t("productName") },
    { field: "product.productTypeName.productName", label: t("type") },
    { field: "product.productCompany.companyName", label: t("company") },
    { field: "colorId.colorName", label: t("productColor") },
    { field: "godownAvalibility.storageCode", label: t("stockLocation") },
    { field: "productQuantity", label: "Qty" },
    { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
    {
      field: "updatedAt",
      label: t("Date & Time"),
      format: (value) =>
        new Intl.DateTimeFormat("en-PK", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Karachi",
        }).format(new Date(value)),
    },
  ]

  const columns3 = [
    { field: "product.productCode", label: t("productCode") },
    { field: "product.productName", label: t("productName") },
    { field: "product.productTypeName.productName", label: t("type") },
    { field: "product.productCompany.companyName", label: t("company") },
    { field: "colorId.colorName", label: t("productColor") },
    { field: "shopAvalibility.shopCode", label: t("branch") },
    { field: "productQuantity", label: "Qty" },
    { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
  ]

  const columns4 = [
    { field: "product.productCode", label: t("productCode") },
    { field: "product.productName", label: t("productName") },
    { field: "product.productTypeName.productName", label: t("type") },
    { field: "product.productCompany.companyName", label: t("company") },
    { field: "colorId.colorName", label: t("productColor") },
    { field: "godownAvalibility.storageCode", label: t("stockLocation") },
    { field: "productQuantity", label: "Qty" },
    { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
  ]

  const [currentColumns, setCurrentColumns] = useState(columns1)

  useEffect(() => {
    if (shopId) {
      setCurrentColumns(columns1)
    } else if (godownId) {
      setCurrentColumns(columns2)
    } else {
      setCurrentColumns(columns1)
    }
  }, [shopId, godownId])

  const link = "updateLoc"
  const actions = [
    {
      label: "View Barcode",
      color: "green",
      handler: null,
      url: (itemId) => `/generate/${itemId}`,
      from: "/admin/recordLocation",
    },
  ]

  return (
    <>
      <MetaData title="QE ~~ProductLocation" />
      <div className={`GlobalDesignPage ${colorTheme}`}>
        {
          <InventoryTable
            title="Product Location"
            recordCount={locData?.data?.productLocations?.length}
            isLoading={isLoading}
            data={locData?.data?.productLocations}
            actions={actions}
            tableColumns={currentColumns}
            actionLinks={actionLinks}
            onFilterChange={handleFilterChange}
            filters={filters}
            filterFields={filterFields}
            printPermissions={havePermissionToPrintAvailableProducts}
            handleBeforePrint={handleBeforePrint}
            handleAfterPrint={handleAfterPrint}
            componentRef={componentRef}
            handleClear={handleClear}
            clearButton={true}
            // New props for multi-barcode selection
  enableMultiSelectFeature={true}
            toggleMultiSelectMode= {toggleMultiSelectMode}
            handleSelectAll={handleSelectAll}
            showMultiSelectUI={showMultiSelectUI}
            selectedProducts={selectedProducts}
            handleProductSelect={handleProductSelect}
            handleGenerateMultipleBarcodes={handleGenerateMultipleBarcodes}
          />
        }
      </div>

      {/* Field Selector Modal */}
      <PrintFieldSelector
        open={printFieldSelectorOpen}
        onClose={() => setPrintFieldSelectorOpen(false)}
        columns={selectedGodown ? columns4 : selectedShop ? columns3 : columns3}
        onApply={handleApplyPrintFields}
        initialSelectedFields={selectedPrintFields}
      />
    </>
  )
}

export default OtherRolesLocTable