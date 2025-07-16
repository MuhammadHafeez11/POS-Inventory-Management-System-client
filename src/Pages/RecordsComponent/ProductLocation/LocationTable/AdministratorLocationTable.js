"use client"

import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "semantic-ui-react"
import PrintFieldSelector from "./PrintFieldSelector"
import { refreshTokken } from "../../../../actions/userAction"
import { getPermissionForRoles } from "../../../user/rolesAssigned/RolesPermissionValidation"
import { useGetProductsQuery } from "../../../../actionHooks/AvailableProductHook"
import { useDebounce } from "../../../../actionHooks/Debounse"
import MetaData from "../../../../MetaData"
import InventoryTable from "../../../../Components/GlobalTablePageDesign/InventoryTable"
import PrintContent from "./PrintContent.js"

let selecteddShop = []
let selecteddGodown = []
let isCalled = "false"

const LocationTable = (props) => {
  const navigate = useNavigate()
  const linkk = "updateLoc"
  const [data, setData] = useState()
  const [selectedShop, setSelectedShop] = useState()
  const [selectedGodown, setSelectedGodown] = useState()

  const [shopType, setShopType] = useState("")
  const [godownType, setGodownType] = useState("")
  const [shopId, setShopId] = useState("")
  const [godownId, setGodownId] = useState("")
  const [code, setCode] = useState("")
  const [type, setType] = useState("")
  const [company, setCompany] = useState("")

  // State for print field selection
  const [printFieldSelectorOpen, setPrintFieldSelectorOpen] = useState(false)
  const [selectedPrintFields, setSelectedPrintFields] = useState([])
  const [printColumns, setPrintColumns] = useState([])
  const [isPrinting, setIsPrinting] = useState(false)

  // New state for multi-select functionality
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showMultiSelectUI, setShowMultiSelectUI] = useState(false)

  const debouncedCode = useDebounce(code, 500)
  const debouncedProductType = useDebounce(type, 500)
  const debouncedCompany = useDebounce(company, 500)

  const {
    data: locData,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery(shopType, godownType, shopId, godownId, debouncedCode, debouncedProductType, debouncedCompany)

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

  const [setLocationRecordPermissionForAdminsitrator] = useState(false)
  const [havePermissionToPrintAvailableProducts, setHavePermissionToPrintAvailableProducts] = useState(false)

  const { productLocationOnShopType } = useSelector((state) => state.productLocationOnShopType)
  const { productLocationOnGodownType } = useSelector((state) => state.productLocationOnGodownType)
  const { user, loading } = useSelector((state) => state.user)
  const { storage } = useSelector((state) => state.storage)
  const { shop } = useSelector((state) => state.shop)

  const printRef = useRef(null)
  const printContainerRef = useRef(null)

  const shopAsArray = [selecteddShop]
  const shopCodes = shopAsArray?.map((shop) => shop)
  const godownCodes = selecteddGodown.map((godown) => godown)
  const combinedOptions = [...shopCodes, ...godownCodes]

  const categoryOptions = [
    { key: "1", text: "shop", value: "shop" },
    { key: "2", text: "store", value: "store" },
  ]

  const [filters, setFilters] = useState({
    productCode: "",
    productType: "",
    productCompany: "",
    shopType: "",
    godownType: "",
    godown: "",
    shop: "",
  })

  const filterFields = [
    {
      name: "category",
      placeholder: "selectBranch/WareHouse",
      type: "categoryOptions",
      options: categoryOptions,
    },
    {
      name: "shop",
      placeholder: "selectBranch/WareHouse",
      type: "shopSelect",
      options: shop,
    },
    {
      name: "godown",
      placeholder: "selectBranch/WareHouse",
      type: "godownSelect",
      options: storage,
    },
    { name: "productCode", placeholder: "Enter Product Code", type: "text" },
    { name: "productType", placeholder: "Enter Product Type", type: "text" },
    {
      name: "productCompany",
      placeholder: "Enter Product Company",
      type: "text",
    },
  ]

  const [actionLinks, setActionLinks] = useState({
    action1: "updateLoc",
    action2: "Update",
    action3: "Delete",
    action4: "generate",
    action5: "View Barcode",
  })

  useEffect(() => {
    refetch()
  }, [shopType, godownType, shopId, godownId, code, company, type])

  // Handle selecting/deselecting a product
  const handleProductSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
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

  // Handle opening the field selector modal
  const handleBeforePrint = () => {
    setPrintFieldSelectorOpen(true)
    return false // Prevent immediate printing
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

  // Handle applying selected print fields
  const handleApplyPrintFields = (selectedFields) => {
    setSelectedPrintFields(selectedFields)

    // Get the appropriate columns based on current selection
    let allColumns
    if (selectedGodown) {
      allColumns = columns2
    } else if (selectedShop) {
      allColumns = columns1
    } else {
      allColumns = column3
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

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color")
    if (currentThemeColor) {
      setColorTheme(currentThemeColor)
      document.body.className = currentThemeColor
    }
  }, [colorTheme])

  useEffect(() => {
    isCalled = "false"
  }, [productLocationOnShopType, code, company])

  useEffect(() => {
    setDownloadXLS(false)
    getPermission()
  }, [])

  async function getPermission() {
    try {
      const permissionXLS = await getPermissionForRoles("download Record XLS")
      const permissionForAdministratorAndSuperAdmin = await getPermissionForRoles(
        "locationRecordOnlyForAdministratorAndSuperAdmin",
      )
      const permissionForPrint = await getPermissionForRoles("printAvailableRecords")
      setHavePermissionToPrintAvailableProducts(permissionForPrint)
      setLocationRecordPermissionForAdminsitrator(permissionForAdministratorAndSuperAdmin)
      setDownloadXLS(permissionXLS)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true"
      getToken()
    }
  }, [shopId, godownId, type, company, code])

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

  const handleCategoryChange = async (event, { value }) => {
    if (value.startsWith("st")) {
      setSelectedShop("")
      setShopType("")
      setShopId("")
      setGodownId("")
      setGodownType(true)
      setSelectedGodown(value)
      setData(productLocationOnGodownType)
    } else {
      setShopType(true)
      setGodownType("")
      setShopId("")
      setGodownId("")
      setData(productLocationOnShopType)
      setSelectedShop(value)
      setSelectedGodown("")
    }
  }

  const handleFilterChange = (e) => {
    const value = e.target.value
    if (e.target.name === "productCode") {
      setCode(e.target.value)
    } else if (e.target.name === "productType") {
      setType(e.target.value)
    } else if (e.target.name === "productCompany") {
      setCompany(e.target.value)
    } else if (e.target.name === "category") {
      if (value.startsWith("st")) {
        setSelectedShop("")
        setShopType("")
        setShopId("")
        setGodownId("")
        setGodownType(true)
        setSelectedGodown(value)
        setData(productLocationOnGodownType)
      } else {
        setShopType(true)
        setGodownType("")
        setShopId("")
        setGodownId("")
        setData(productLocationOnShopType)
        setSelectedShop(value)
        setSelectedGodown("")
      }
    } else if (e.target.name === "shop") {
      setShopId(e.target.value)
    } else if (e.target.name === "godown") {
      setGodownId(e.target.value)
    }
    if (e.target.name === "shopType") {
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
      godown: "",
      shop: "",
    })
    setShopType("")
    setGodownType("")
    setSelectedShop("")
    setSelectedGodown("")
    setShopId("")
    setGodownId("")
    setCode("")
    setType("")
    setCompany("")
    setSelectedProducts([])
    refetch()
    handleAfterPrint()
  }

  const columns4 = [
    { field: "product.avatar", label: t("Avatar") },
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
      format: (value) => {
        const date = new Date(value)
        if (isNaN(date)) return "Invalid Date"

        return new Intl.DateTimeFormat("en-PK", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Karachi",
        }).format(date)
      },
    },
  ]

  const columns7 = [
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
      format: (value) => {
        const date = new Date(value)
        if (isNaN(date)) return "Invalid Date"

        return new Intl.DateTimeFormat("en-PK", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Karachi",
        }).format(date)
      },
    },
  ]

  const column5 = [
    { field: "product.avatar", label: t("Avatar") },
    { field: "product.productCode", label: t("productCode") },
    { field: "product.productName", label: t("productName") },
    { field: "product.productTypeName.productName", label: t("type") },
    { field: "product.productCompany.companyName", label: t("company") },
    { field: "colorId.colorName", label: t("productColor") },
    { field: "shopAvalibility.shopCode", label: t("branch") },
    { field: "godownAvalibility.storageCode", label: t("stockLocation") },
    { field: "productQuantity", label: "Qty" },
    { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
    {
      field: "updatedAt",
      label: t("Date & Time"),
      format: (value) => {
        const date = new Date(value)
        if (isNaN(date)) return "Invalid Date"

        return new Intl.DateTimeFormat("en-PK", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Karachi",
        }).format(date)
      },
    },
  ]

  const columns1 = [
    { field: "product.productCode", label: t("productCode") },
    { field: "product.productName", label: t("productName") },
    { field: "product.productTypeName.productName", label: t("type") },
    { field: "product.productCompany.companyName", label: t("company") },
    { field: "colorId.colorName", label: t("productColor") },
    { field: "shopAvalibility.shopCode", label: t("branch") },
    { field: "productQuantity", label: "Qty" },
    { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
  ]

  const columns2 = [
    { field: "product.productCode", label: t("productCode") },
    { field: "product.productName", label: t("productName") },
    { field: "product.productTypeName.productName", label: t("type") },
    { field: "product.productCompany.companyName", label: t("company") },
    { field: "colorId.colorName", label: t("productColor") },
    { field: "godownAvalibility.storageCode", label: t("stockLocation") },
    { field: "productQuantity", label: "Qty" },
    { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
  ]

  const column3 = [
    { field: "product.productCode", label: t("productCode") },
    { field: "product.productName", label: t("productName") },
    { field: "product.productTypeName.productName", label: t("type") },
    { field: "product.productCompany.companyName", label: t("company") },
    { field: "colorId.colorName", label: t("productColor") },
    { field: "shopAvalibility.shopCode", label: t("branch") },
    { field: "godownAvalibility.storageCode", label: t("stockLocation") },
    { field: "productQuantity", label: "Qty" },
    { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
  ]

  const [currentColumns, setCurrentColumns] = useState(column5)

  useEffect(() => {
    if (shopType) {
      setCurrentColumns(columns4)
    } else if (godownType) {
      setCurrentColumns(columns7)
    } else {
      setCurrentColumns(column5)
    }
  }, [shopType, godownType])

  const link = "updateLoc"
  const actions = [
    {
      label: "View Barcode",
      color: "green",
      handler: null,
      url: (itemId) => `/generate/${itemId}`,
    },
  ]


  return (
    <>
      <MetaData title="QE ~~ProductLocation" />
      <div className={`GlobalDesignPage ${colorTheme}`}>
        {/* Multi-select toggle button */}
        {/* <div className="multi-select-controls">
          <Button onClick={toggleMultiSelectMode} className="buttonProductLocation">
            {showMultiSelectUI ? t("cancelMultiSelect") : t("enableMultiSelect")}
          </Button>
        </div> */}

        {
          <InventoryTable
            title="Product Location"
            recordCount={locData?.data?.productLocations?.length}
            isLoading={isLoading}
            data={locData?.data?.productLocations}
            actions={actions}
            tableColumns={currentColumns}
  enableMultiSelectFeature={true}
            actionLinks={actionLinks}
            onFilterChange={handleFilterChange}
            filters={filters}
            filterFields={filterFields}
            printPermissions={havePermissionToPrintAvailableProducts}
            handleBeforePrint={handleBeforePrint}
            handleAfterPrint={handleAfterPrint}
            componentRef={printRef}
            handleClear={handleClear}
            clearButton={true}
            selectedShop={selectedShop}
            selectedGodown={selectedGodown}
            // New props for multi-barcode selection
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
        columns={selectedGodown ? columns2 : selectedShop ? columns1 : column3}
        onApply={handleApplyPrintFields}
        initialSelectedFields={selectedPrintFields}
      />
    </>
  )
}

export default LocationTable

// import { useEffect, useState, useRef } from "react"
// import { useSelector } from "react-redux"
// import { useNavigate } from "react-router-dom"
// import { useTranslation } from "react-i18next"
// import PrintFieldSelector from "./PrintFieldSelector"
// import { refreshTokken } from "../../../../actions/userAction"
// import { getPermissionForRoles } from "../../../user/rolesAssigned/RolesPermissionValidation"
// import { useGetProductsQuery } from "../../../../actionHooks/AvailableProductHook"
// import { useDebounce } from "../../../../actionHooks/Debounse"
// import MetaData from "../../../../MetaData"
// import InventoryTable from "../../../../Components/GlobalTablePageDesign/InventoryTable"
// import { COMPANYHEADER } from "../../../../constants/companyNameContants"
// import PrintContent from "./PrintContent.js"

// let selecteddShop = []
// let selecteddGodown = []
// let isCalled = "false"

// const LocationTable = (props) => {
//   const navigate = useNavigate()
//   const linkk = "updateLoc"
//   const [data, setData] = useState()
//   const [selectedShop, setSelectedShop] = useState()
//   const [selectedGodown, setSelectedGodown] = useState()

//   const [shopType, setShopType] = useState("")
//   const [godownType, setGodownType] = useState("")
//   const [shopId, setShopId] = useState("")
//   const [godownId, setGodownId] = useState("")
//   const [code, setCode] = useState("")
//   const [type, setType] = useState("")
//   const [company, setCompany] = useState("")

//   // State for print field selection
//   const [printFieldSelectorOpen, setPrintFieldSelectorOpen] = useState(false)
//   const [selectedPrintFields, setSelectedPrintFields] = useState([])
//   const [printColumns, setPrintColumns] = useState([])
//   const [isPrinting, setIsPrinting] = useState(false)

//   const debouncedCode = useDebounce(code, 500)
//   const debouncedProductType = useDebounce(type, 500)
//   const debouncedCompany = useDebounce(company, 500)

//   const {
//     data: locData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetProductsQuery(shopType, godownType, shopId, godownId, debouncedCode, debouncedProductType, debouncedCompany)

//   const { t, i18n } = useTranslation()
//   const actionUpdate = "Update"
//   const printAction = "availableProducts"
//   const printActionShop = "availableProductsOnlyShop"
//   const action1 = "View Barcode"
//   const link2 = "generate"
//   const action3 = "Delete"
//   const [colorTheme, setColorTheme] = useState("theme-white")
//   const [downloadXLS, setDownloadXLS] = useState(false)
//   const [loadingPrintData, setLoadingPrintData] = useState(false)

//   const [setLocationRecordPermissionForAdminsitrator] = useState(false)
//   const [havePermissionToPrintAvailableProducts, setHavePermissionToPrintAvailableProducts] = useState(false)

//   const { productLocationOnShopType } = useSelector((state) => state.productLocationOnShopType)
//   const { productLocationOnGodownType } = useSelector((state) => state.productLocationOnGodownType)
//   const { user, loading } = useSelector((state) => state.user)
//   const { storage } = useSelector((state) => state.storage)
//   const { shop } = useSelector((state) => state.shop)

//   const printRef = useRef(null)
//   const printContainerRef = useRef(null)

//   const shopAsArray = [selecteddShop]
//   const shopCodes = shopAsArray?.map((shop) => shop)
//   const godownCodes = selecteddGodown.map((godown) => godown)
//   const combinedOptions = [...shopCodes, ...godownCodes]

//   const categoryOptions = [
//     { key: "1", text: "shop", value: "shop" },
//     { key: "2", text: "store", value: "store" },
//   ]

//   const [filters, setFilters] = useState({
//     productCode: "",
//     productType: "",
//     productCompany: "",
//     shopType: "",
//     godownType: "",
//     godown: "",
//     shop: "",
//   })

//   const filterFields = [
//     {
//       name: "category",
//       placeholder: "selectBranch/WareHouse",
//       type: "categoryOptions",
//       options: categoryOptions,
//     },
//     {
//       name: "shop",
//       placeholder: "selectBranch/WareHouse",
//       type: "shopSelect",
//       options: shop,
//     },
//     {
//       name: "godown",
//       placeholder: "selectBranch/WareHouse",
//       type: "godownSelect",
//       options: storage,
//     },
//     { name: "productCode", placeholder: "Enter Product Code", type: "text" },
//     { name: "productType", placeholder: "Enter Product Type", type: "text" },
//     {
//       name: "productCompany",
//       placeholder: "Enter Product Company",
//       type: "text",
//     },
//   ]

//   const [actionLinks, setActionLinks] = useState({
//     action1: "updateLoc",
//     action2: "Update",
//     action3: "Delete",
//     action4: "generate",
//     action5: "View Barcode",
//   })

//   useEffect(() => {
//     refetch()
//   }, [shopType, godownType, shopId, godownId, code, company, type])

//   // Create a separate print window/iframe for printing
//   const createPrintFrame = (content) => {
//     // Remove any existing print frames
//     const oldFrame = document.getElementById("print-frame")
//     if (oldFrame) {
//       document.body.removeChild(oldFrame)
//     }

//     // Create a new iframe
//     const printFrame = document.createElement("iframe")
//     printFrame.id = "print-frame"
//     printFrame.name = "print-frame"
//     printFrame.style.position = "fixed"
//     printFrame.style.left = "-9999px"
//     printFrame.style.top = "-9999px"
//     printFrame.style.width = "0"
//     printFrame.style.height = "0"
//     printFrame.style.border = "0"
//     document.body.appendChild(printFrame)

//     // Write content to the iframe
//     const frameDoc = printFrame.contentWindow.document
//     frameDoc.open()
//     frameDoc.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Print</title>
//           <style>
//             body { margin: 0; padding: 0; }
//             table { width: 100%; border-collapse: collapse; table-layout: fixed; }
//             th, td { border: 1px solid black; padding: 4px; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
//             th:first-child, td:first-child { width: 45px; }
//             thead { display: table-header-group; }
//             tfoot { display: table-footer-group; }
//             tr { page-break-inside: avoid; }
//             @page { size: landscape; margin: 0.5cm; }
//           </style>
//         </head>
//         <body>
//           ${content}
//         </body>
//       </html>
//     `)
//     frameDoc.close()

//     return printFrame
//   }

//   // Handle opening the field selector modal
//   const handleBeforePrint = () => {
//     setPrintFieldSelectorOpen(true)
//     return false // Prevent immediate printing
//   }

//   const handleAfterPrint = () => {
//     // Clean up after printing
//     setIsPrinting(false)
//     setLoadingPrintData(false)

//     // Remove the print frame if it exists
//     const printFrame = document.getElementById("print-frame")
//     if (printFrame) {
//       document.body.removeChild(printFrame)
//     }
//   }

//   // Handle applying selected print fields
//   const handleApplyPrintFields = (selectedFields) => {
//     setSelectedPrintFields(selectedFields)

//     // Get the appropriate columns based on current selection
//     let allColumns
//     if (selectedGodown) {
//       allColumns = columns2
//     } else if (selectedShop) {
//       allColumns = columns1
//     } else {
//       allColumns = column3
//     }

//     // Filter columns based on selected fields
//     const filteredColumns = allColumns.filter((col) => selectedFields.includes(col.field))
//     setPrintColumns(filteredColumns)

//     // Set printing state to true
//     setIsPrinting(true)

//     // Render the print content to a string
//     const printContent = renderPrintContent(filteredColumns)

//     // Create a print frame with the content
//     const printFrame = createPrintFrame(printContent)

//     // Trigger print after a short delay to ensure frame is loaded
//     setTimeout(() => {
//       printFrame.contentWindow.focus()
//       printFrame.contentWindow.print()

//       // Add event listener for afterprint
//       printFrame.contentWindow.addEventListener("afterprint", handleAfterPrint, { once: true })
//     }, 500)
//   }

//   const renderPrintContent = (columns) => {
//     const processedData = locData?.data?.productLocations
//     return PrintContent({
//       columns,
//       data: processedData,
//       t,
//       user,
//       selectedShop,
//       selectedGodown,
//       shop,
//     })
//   }
  

//   useEffect(() => {
//     const currentThemeColor = localStorage.getItem("theme-color")
//     if (currentThemeColor) {
//       setColorTheme(currentThemeColor)
//       document.body.className = currentThemeColor
//     }
//   }, [colorTheme])

//   useEffect(() => {
//     isCalled = "false"
//   }, [productLocationOnShopType, code, company])

//   useEffect(() => {
//     setDownloadXLS(false)
//     getPermission()
//   }, [])

//   async function getPermission() {
//     try {
//       const permissionXLS = await getPermissionForRoles("download Record XLS")
//       const permissionForAdministratorAndSuperAdmin = await getPermissionForRoles(
//         "locationRecordOnlyForAdministratorAndSuperAdmin",
//       )
//       const permissionForPrint = await getPermissionForRoles("printAvailableRecords")
//       setHavePermissionToPrintAvailableProducts(permissionForPrint)
//       setLocationRecordPermissionForAdminsitrator(permissionForAdministratorAndSuperAdmin)
//       setDownloadXLS(permissionXLS)
//     } catch (error) {
//       console.error("Error fetching data:", error)
//     }
//   }

//   useEffect(() => {
//     if (isCalled === "false") {
//       isCalled = "true"
//       getToken()
//     }
//   }, [shopId, godownId, type, company, code])

//   const getToken = async () => {
//     const token = await refreshTokken()
//     if (token?.data === "Please login to acces this resource") {
//       navigate("/login")
//     }
//   }

//   useEffect(() => {
//     selecteddShop = JSON.parse(localStorage.getItem("shopId"))
//     selecteddGodown = JSON.parse(localStorage.getItem("godownId"))
//   }, [])

//   const handleCategoryChange = async (event, { value }) => {
//     if (value.startsWith("st")) {
//       setSelectedShop("")
//       setShopType("")
//       setShopId("")
//       setGodownId("")
//       setGodownType(true)
//       setSelectedGodown(value)
//       setData(productLocationOnGodownType)
//     } else {
//       setShopType(true)
//       setGodownType("")
//       setShopId("")
//       setGodownId("")
//       setData(productLocationOnShopType)
//       setSelectedShop(value)
//       setSelectedGodown("")
//     }
//   }

//   const handleFilterChange = (e) => {
//     const value = e.target.value
//     if (e.target.name === "productCode") {
//       setCode(e.target.value)
//     } else if (e.target.name === "productType") {
//       setType(e.target.value)
//     } else if (e.target.name === "productCompany") {
//       setCompany(e.target.value)
//     } else if (e.target.name === "category") {
//       if (value.startsWith("st")) {
//         setSelectedShop("")
//         setShopType("")
//         setShopId("")
//         setGodownId("")
//         setGodownType(true)
//         setSelectedGodown(value)
//         setData(productLocationOnGodownType)
//       } else {
//         setShopType(true)
//         setGodownType("")
//         setShopId("")
//         setGodownId("")
//         setData(productLocationOnShopType)
//         setSelectedShop(value)
//         setSelectedGodown("")
//       }
//     } else if (e.target.name === "shop") {
//       setShopId(e.target.value)
//     } else if (e.target.name === "godown") {
//       setGodownId(e.target.value)
//     }
//     if (e.target.name === "shopType") {
//       if (e.target.value.startsWith("G_")) {
//         setSelectedGodown(e.target.value)
//         setSelectedShop("")
//         storage?.map(async (store) => {
//           if (store?.storageCode === e.target.value) {
//             setGodownId(store._id)
//             setShopId("")
//           }
//         })
//       } else {
//         setSelectedGodown("")
//         setSelectedShop(e.target.value)
//         shop?.map(async (shopp) => {
//           if (shopp?.shopCode === e.target.value) {
//             setShopId(shopp._id)
//             setGodownId("")
//           }
//         })
//       }
//     }
//     setFilters({
//       ...filters,
//       [e.target.name]: e.target.value,
//     })
//   }

//   const handleClear = (e) => {
//     setFilters({
//       productCode: "",
//       productType: "",
//       productCompany: "",
//       shopType: "",
//       godownType: "",
//       godown: "",
//       shop: "",
//     })
//     setShopType("")
//     setGodownType("")
//     setSelectedShop("")
//     setSelectedGodown("")
//     setShopId("")
//     setGodownId("")
//     setCode("")
//     setType("")
//     setCompany("")
//     refetch()
//     handleAfterPrint()
//   }

//   const columns4 = [
//     { field: "product.avatar", label: t("Avatar") },
//     { field: "product.productCode", label: t("productCode") },
//     { field: "product.productName", label: t("productName") },
//     { field: "product.productTypeName.productName", label: t("type") },
//     { field: "product.productCompany.companyName", label: t("company") },
//     { field: "colorId.colorName", label: t("productColor") },
//     { field: "shopAvalibility.shopCode", label: t("branch") },
//     { field: "productQuantity", label: "Qty" },
//     { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
//     {
//       field: "updatedAt",
//       label: t("Date & Time"),
//       format: (value) => {
//         const date = new Date(value)
//         if (isNaN(date)) return "Invalid Date"

//         return new Intl.DateTimeFormat("en-PK", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//           hour12: true,
//           timeZone: "Asia/Karachi",
//         }).format(date)
//       },
//     },
//   ]

//   const columns7 = [
//     { field: "product.avatar", label: t("Avatar") },
//     { field: "product.productCode", label: t("productCode") },
//     { field: "product.productName", label: t("productName") },
//     { field: "product.productTypeName.productName", label: t("type") },
//     { field: "product.productCompany.companyName", label: t("company") },
//     { field: "colorId.colorName", label: t("productColor") },
//     { field: "godownAvalibility.storageCode", label: t("stockLocation") },
//     { field: "productQuantity", label: "Qty" },
//     { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
//     {
//       field: "updatedAt",
//       label: t("Date & Time"),
//       format: (value) => {
//         const date = new Date(value)
//         if (isNaN(date)) return "Invalid Date"

//         return new Intl.DateTimeFormat("en-PK", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//           hour12: true,
//           timeZone: "Asia/Karachi",
//         }).format(date)
//       },
//     },
//   ]

//   const column5 = [
//     { field: "product.avatar", label: t("Avatar") },
//     { field: "product.productCode", label: t("productCode") },
//     { field: "product.productName", label: t("productName") },
//     { field: "product.productTypeName.productName", label: t("type") },
//     { field: "product.productCompany.companyName", label: t("company") },
//     { field: "colorId.colorName", label: t("productColor") },
//     { field: "shopAvalibility.shopCode", label: t("branch") },
//     { field: "godownAvalibility.storageCode", label: t("stockLocation") },
//     { field: "productQuantity", label: "Qty" },
//     { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
//     {
//       field: "updatedAt",
//       label: t("Date & Time"),
//       format: (value) => {
//         const date = new Date(value)
//         if (isNaN(date)) return "Invalid Date"

//         return new Intl.DateTimeFormat("en-PK", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//           hour12: true,
//           timeZone: "Asia/Karachi",
//         }).format(date)
//       },
//     },
//   ]

//   const columns1 = [
//     { field: "product.productCode", label: t("productCode") },
//     { field: "product.productName", label: t("productName") },
//     { field: "product.productTypeName.productName", label: t("type") },
//     { field: "product.productCompany.companyName", label: t("company") },
//     { field: "colorId.colorName", label: t("productColor") },
//     { field: "shopAvalibility.shopCode", label: t("branch") },
//     { field: "productQuantity", label: "Qty" },
//     { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
//   ]

//   const columns2 = [
//     { field: "product.productCode", label: t("productCode") },
//     { field: "product.productName", label: t("productName") },
//     { field: "product.productTypeName.productName", label: t("type") },
//     { field: "product.productCompany.companyName", label: t("company") },
//     { field: "colorId.colorName", label: t("productColor") },
//     { field: "godownAvalibility.storageCode", label: t("stockLocation") },
//     { field: "productQuantity", label: "Qty" },
//     { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
//   ]

//   const column3 = [
//     { field: "product.productCode", label: t("productCode") },
//     { field: "product.productName", label: t("productName") },
//     { field: "product.productTypeName.productName", label: t("type") },
//     { field: "product.productCompany.companyName", label: t("company") },
//     { field: "colorId.colorName", label: t("productColor") },
//     { field: "shopAvalibility.shopCode", label: t("branch") },
//     { field: "godownAvalibility.storageCode", label: t("stockLocation") },
//     { field: "productQuantity", label: "Qty" },
//     { field: "totalInvoicePrice", label: t("totalInvoicePrice") },
//   ]

//   const [currentColumns, setCurrentColumns] = useState(column5)

//   useEffect(() => {
//     if (shopType) {
//       setCurrentColumns(columns4)
//     } else if (godownType) {
//       setCurrentColumns(columns7)
//     } else {
//       setCurrentColumns(column5)
//     }
//   }, [shopType, godownType])

//   const link = "updateLoc"
//   const actions = [
//     {
//       label: "View Barcode",
//       color: "green",
//       handler: null,
//       url: (itemId) => `/generate/${itemId}`,
//     },
//   ]

//   return (
//     <>
//       <MetaData title="QE ~~ProductLocation" />
//       <div className={`GlobalDesignPage ${colorTheme}`}>
//         {
//           <InventoryTable
//             title="Product Location"
//             recordCount={locData?.data?.productLocations?.length}
//             isLoading={isLoading}
//             data={locData?.data?.productLocations}
//             actions={actions}
//             tableColumns={currentColumns}
//             actionLinks={actionLinks}
//             onFilterChange={handleFilterChange}
//             filters={filters}
//             filterFields={filterFields}
//             printPermissions={havePermissionToPrintAvailableProducts}
//             handleBeforePrint={handleBeforePrint}
//             handleAfterPrint={handleAfterPrint}
//             componentRef={printRef}
//             handleClear={handleClear}
//             clearButton={true}
//             selectedShop={selectedShop}
//             selectedGodown={selectedGodown}
//           />
//         }
//       </div>

//       {/* Field Selector Modal */}
//       <PrintFieldSelector
//         open={printFieldSelectorOpen}
//         onClose={() => setPrintFieldSelectorOpen(false)}
//         columns={selectedGodown ? columns2 : selectedShop ? columns1 : column3}
//         onApply={handleApplyPrintFields}
//         initialSelectedFields={selectedPrintFields}
//       />
//     </>
//   )
// }

// export default LocationTable