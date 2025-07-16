import { useContext, useEffect, useRef, useState } from "react"
import MetaData from "../../../MetaData"
import SaveAltIcon from "@mui/icons-material/SaveAlt"
import printJS from "print-js"
import { Loader, Button } from "semantic-ui-react"
import Inventory2Icon from "@mui/icons-material/Inventory2"
import TableForm from "./TableForm"
import { useNavigate, useLocation, Navigate } from "react-router-dom"
import { Statee } from "./context/stateContext"
import useScanDetection from "use-scan-detection"
import swal from "sweetalert2"

import MainInvoice from "../../../Components/Printer/MainPrinter"
import { useTranslation } from "react-i18next"
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation"
// import { getPermissionForRoles } from "../Pages/user/rolesAssigned/RolesPermissionValidation";
// import PageLoader from "../Components/Loader/PageLoader"
import PageLoader from "../../../Components/Loader/PageLoader"
import { useDispatch, useSelector } from "react-redux"
import {
  getProductLocation,
  getProductLocationOnBarcode,
  getProductLocationProductColorAndLocation,
} from "../../../actions/productLocationAction"
// } from "../actions/productLocationAction";
import { deleteTempSaleItem, getTemporarySale } from "../../../actions/tempSaleAction"
import { getCompany } from "../../../actions/companyAction"
import { getProductType } from "../../../actions/productTypeAction"
import { postFBRData } from "../../../actions/saleProductWithFiscalAction"
import { getProductLocationOnShopAndProductId, postSaleProductt } from "../../../actions/saleProductAction"
import { refreshTokken } from "../../../actions/userAction"
import { POST_TEMP_SALE_SUCCESS, TEMP_SALE_DETAILS_SUCCESS } from "../../../constants/tempSaleConstants"
import { gettShop } from "../../../actions/shopAction"
import ThermalPrinter from "../../../Components/Printer/ThermalPrinter"
import { COMPANYHEADER, QURESHI_ELECTRONICS } from "../../../constants/companyNameContants"
import PaymentModel from "./PaymentModel"
import { useAlert } from "react-alert"

const InvoiceNumber = ""
const USIN = "USINO"
let DateTime = ""
let pr = []
let barcodeProduct = ""
let bar = ""
let quantity = ""
let variableForPrint
let isCalled = "false"
const locItemsArray = []
let tempSaleProdData
let totalTaxAmount
let totalQuantity
let totalAmount
let totalPrice
let totalDiscount
function App() {
  const [locQuantityList, setLocQuantityList] = useState([])
  const [buttonClicked, setButtonClicked] = useState(false)
  const [productLoc, setProductLoc] = useState("")
  const [isInputFilled, setIsInputFilled] = useState(false)
  const [barcodeDisplay, setBarcodeDisplay] = useState("")
  const [variableForButtonLoader, setVariableForButtonLoader] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [saleProductPermission, setSaleProductPermission] = useState(false)
  const [isInputDisabled, setIsInputDisabled] = useState(false)
  const [phoneNumberCompleted, setPhoneNumberCompleted] = useState(false)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [loc, setLoc] = useState("Hello")
  const location = useLocation()
  const buttonRef = useRef(null)
  const isGetProductCalled = "false"
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const alert = useAlert()
  // Add state for printer selection
  const [selectedPrinter, setSelectedPrinter] = useState("")

  //////=====================================================/////////////////////////
  //////////// =====All UseContext Variables ==============///////////////////////////////
  /////////////============================================////////////////////
  const {
    setCode,
    setNamee,
    setCompany,
    setColor,
    setCurrentPrice,
    setExcludeTaxPrice,
    setTaxPercentage,
    setSellExpenses,
    setQuantitye,
    clientName,
    setClientName,
    serialNumber,
    setSerialNumber,
    clientAddress,
    setClientAddress,
    invoiceNumber,
    setInvoiceNumber,
    setBarcode,
    invoiceDate,
    setInvoiceDate,
    componentRef,
    list,
    total,
    setList,
    setQuantityidset,
    setLocationsetid,
    GrandQuantityTotal,
    GrandTotalExludeTex,
    GrandTotalTax,
    setFbrInvoiceNumber,
    GrandDiscount,
    setBarBack,
    barLoader,
    setBarLoader,
    setBarButtonDisable,
    setTempSaleMainId,
    tempSaleMainId,
    setShopIdForData,
    shopAddress,
    setShopAddress,
    MRP,
    setMRP,
    paymentStatus,
    setPaymentStatus,
    shopPhoneNo,
    remainingDuesDate,
    setRemainingDuesDate,
    payments,
    setShopPhoneNo,
    setPurchaseInvoicePrice,
    setSalesmanSalePrice,
    setMinimumSalePrice,
    setPurchasePrice,
    setProductColor,
    fbrInvoiceNumber,
    initialPayment,
    fbrAmount,
    setFbrAmount,
    fbrTotalAmount,
    setFbrTotalAmount,
    fbrTotalSaleAmount,
    setFbrTotalSaleAmount,
    fbrTotalBillAmount,
    setFbrTotalBillAmount,
  } = useContext(Statee)
  const [colorTheme, setColorTheme] = useState("theme-white")
  const { shop } = useSelector((state) => state.shop)
  const { user } = useSelector((state) => state.user)
  // Add check for "Choose on Print" printer type
  const isChooseOnPrint = user?.user?.printerId?.printerType === "Choose on Print"
  const { tempSaleDetails, tempSaleDetailsLoading } = useSelector((state) => state.tempSaleDetails)
  const invoiceNumberRef = useRef(invoiceNumber)
  const { postFBRSaleProduct, postFBRSaleProductLoading, postFBRSaleProductError } = useSelector(
    (state) => state.postFBRSaleProduct,
  )
  const { postSaleProduct, postSaleProductLoading, postSaleProductError } = useSelector(
    (state) => state.postSaleProduct,
  )
  const { tempSalePost } = useSelector((state) => state.tempSalePost)

  /**************************************************************************************/
  /**********************************************************************************/
  /************ Handle Paths**********/
  /**********************************************************************************/
  /**********************************************************************************/

  useEffect(() => {
    const previousPath = location.state ? location.state : null
    const isPreviousPathMatching = previousPath === "/saleproductpage" || previousPath === "/discountmodel"
    console.log("Is previous path matching:", isPreviousPathMatching)
    if (!isPreviousPathMatching) {
      setClientName("")
      setSerialNumber("")
      setClientAddress("")
      setList([])
    }
  }, [location.state])

  /**************************************************************************************/
  /**********************************************************************************/
  /************ Handle Permission For Sale **********/
  /**********************************************************************************/
  /**********************************************************************************/

  useEffect(() => {
    setSaleProductPermission(false)
    getPermission()
  }, [])

  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles("Can Sale Product")
      setSaleProductPermission(permissionForAdd)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleInputChange = (e) => {
    const inputValue = e.target.value

    // Use regex to allow only digits and limit to 11 characters
    const sanitizedValue = inputValue.replace(/[^0-9]/g, "").slice(0, 11)
    setIsInputDisabled(sanitizedValue.length === 11)
    setClientAddress(sanitizedValue)
    setPhoneNumberCompleted(true)
  }

  // Make sure serialNumber is properly handled separately
  const handleSerialNumberChange = (e) => {
    // Convert the input value to a number
    const numValue = e.target.value === "" ? "" : Number(e.target.value)
    setSerialNumber(numValue)
  }

  /////////==========================================////
  ///========== handle Language Selection =========/////////
  ///////========================================/////////

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color")
    if (currentColorTheme) {
      setColorTheme(currentColorTheme)
    }
  }, [colorTheme])

  useEffect(() => {
    isCalled = "false"
  }, [clientName, clientAddress])

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true"
      getToken()
    }
  }, [isCalled])

  const getToken = async () => {
    console.log(shop)

    if (shop?.length > 0) {
      shop?.map((shopForId) => {
        if (shopForId?.shopCode === JSON.parse(localStorage.getItem("shopId"))) {
          console.log(shopForId)
          setShopIdForData(shopForId?._id)
          setShopAddress(shopForId?.shopAddress)
          setShopPhoneNo(shopForId?.phoneNo)
        }
      })
    }
    const token = await refreshTokken()
    if (token?.data === "Please login to acces this resource") {
      ;<Navigate to="/login" />
    }
    console.log(token)
  }

  useEffect(() => {
    const currentLang = localStorage.getItem("lang")
    i18n.changeLanguage(currentLang)
  }, [])

  /////////==========================================////
  ///========== handle date format  Selection and getProducts =========/////////
  ///////========================================/////////
  useEffect(() => {
    dispatch(getProductType())
    dispatch(getCompany())
    setBarBack("false")
    setButtonClicked(false)
    variableForPrint = ""
    setVariableForButtonLoader(false)
    // getProduct();

    const today = new Date()
    const yyyy = today.getFullYear()
    let mm = today.getMonth() + 1 // Months start at 0!
    let dd = today.getDate()
    let hh = today.getHours()
    let min = today.getMinutes()
    let sec = today.getSeconds()

    if (dd < 10) dd = "0" + dd
    if (mm < 10) mm = "0" + mm
    if (hh < 10) hh = "0" + hh
    if (min < 10) min = "0" + min
    if (sec < 10) sec = "0" + sec
    DateTime = `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`
    setInvoiceDate(dd + "-" + mm + "-" + yyyy)
  }, [])

  const barFunc = () => {
    console.log("hooo")

    if (quantity === 0) {
      console.log("enter")
      swal.fire({
        icon: "error",
        title: t("titleAlert"),
        text: t("textProductOutOfStock"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      })
    } else {
      navigate("/discountmodel")
    }
  }

  /////////==========================================////
  ///========== start of barcode scanning work =========/////////
  ///////========================================/////////

  /////////==========================================////
  ///========== handle Barcode scanning value =========/////////
  ///////========================================/////////
  useEffect(() => {
    // Enable barcode scanning if both clientName and clientAddress are filled
    setIsInputFilled(!!clientName && !!clientAddress && !barLoader)
  }, [clientName, clientAddress, barLoader])

  /////////==========================================////
  ///========== handle barcode scanning value by device =========/////////
  ///////========================================/////////
  const handleScan = (barcodeValue) => {
    if (isInputFilled) {
      setBarcodeDisplay(barcodeValue)
    }
  }

  /////////==========================================////
  ///========== handle detection of barcode =========/////////
  ///////========================================/////////
  useScanDetection({
    onComplete: handleScan,
    minlength: 1,
  })

  /////////==========================================////
  ///========== set Different values on the basis of barcode scan =========/////////
  ///////========================================/////////
  useEffect(() => {
    setBarcodeDisplay("")
    console.log(barcodeDisplay)
    if (barcodeDisplay) {
      setBarButtonDisable(true)
      setBarLoader(true)
      getProductByBarcode(barcodeDisplay)
      bar = barcodeDisplay
    }
  }, [barcodeDisplay])

  useEffect(() => {
    setBarcodeDisplay("")
  }, [invoiceNumber])

  /////////==========================================////
  ///========== Get Products on barcode value =========/////////
  ///////========================================/////////
  async function getProductByBarcode(barcodeDisplay) {
    console.log(barcodeDisplay)
    console.log("hellooooooooooo")
    // const result = await getProductsOnBarcode(barcodeDisplay);
    const result = await getProductLocationOnBarcode(barcodeDisplay)
    barcodeProduct = result?.data
    console.log(barcodeProduct)
    getProductt()
    console.log(barcodeProduct)
  }

  /////////==========================================////
  ///========== gett Productt called for further work on the basis of barcode=========/////////
  ///////========================================/////////

  const getProductt = async () => {
    // pr = await getProductLoc();
    console.log("hijijfe")
    // const rest = await getProductLoc();
    const rest = await gettShop()
    console.log(rest)
    pr = rest
    console.log(pr)
    let proLocId = ""
    //to filter product for each storage location that a user login with account
    console.log(!JSON.parse(localStorage.getItem("isAdministrator")))
    if (!JSON.parse(localStorage.getItem("isAdministrator"))) {
      pr = pr?.reduce((filteredProducts, shops) => {
        if (shops?.shopCode === JSON.parse(localStorage.getItem("shopId"))) {
          filteredProducts.push(shops)
        }
        return filteredProducts
      }, [])
    }
    if (pr?.length > 0 && barcodeProduct) {
      console.log("ali")
      setProductLoc(pr[0]._id)
      proLocId = pr[0]._id
      console.log(proLocId)
      console.log(barcodeProduct)
      const result = await getProductLocationProductColorAndLocation(
        barcodeProduct?.product?._id,
        proLocId,
        barcodeProduct?.colorId?._id,
      )
      console.log(result)

      setNamee(result?.data?.product?.productTypeName?.productName)
      setCode(result?.data?.product?.productCode)
      setCompany(result?.data?.product?.productCompany?.companyName)
      setColor(result?.data?.colorId?.colorName)
      setProductColor(result?.data?.colorId?._id)
      setCurrentPrice(result?.data?.product?.productCurrentPrice)
      setExcludeTaxPrice(result?.data?.product?.productpriceExcludingTax)
      setMRP(result?.data?.product?.productpriceExcludingTax)
      setTaxPercentage(result?.data?.product?.productTaxPrice)
      setSellExpenses(result?.data?.product?.productExpenses)
      setPurchaseInvoicePrice(result?.data?.product?.invoicePrice)
      setSalesmanSalePrice(result?.data?.product?.salesmanSalePrice)
      setMinimumSalePrice(result?.data?.product?.minimumSalePrice)
      setPurchasePrice(result?.data?.product?.purchasePrice)
      setQuantitye(result?.data?.productQuantity)
      setQuantityidset(result?.data?.product?._id)
      setLocationsetid(result?.data?.shopAvalibility?._id)
      setShopIdForData(result?.data?.shopAvalibility?._id)
      quantity = result?.data?.productQuantity
      setBarcode(barcodeDisplay)
      setBarcodeDisplay("")
      setLoc("Hec this is new")
      setBarBack("true")
      console.log("hiiii")
      setBarLoader(false)
      barFunc()
    } else {
      setBarLoader(false)
    }
  }

  /////////==========================================////
  ///========== End of Barcode Scanning Logic =========/////////
  ///////========================================////////

  /////////==========================================////
  ///========== Handle Temporary Sale Table Data  =========/////////
  ///////========================================/////////

  useEffect(() => {
    console.log(tempSalePost)
    if (tempSalePost) {
      setTempSaleMainId(tempSalePost?._id)
    }
  }, [tempSalePost])

  useEffect(() => {
    if (isGetProductCalled === "false") {
      dispatch(getProductLocation())
    }
  }, [])

  useEffect(() => {
    console.log(tempSaleDetails)
    if (tempSaleDetails.length === 0) {
      console.log(tempSaleDetails)
    } else {
      console.log(tempSaleDetails)

      handleTempLocationData()
    }
  }, [tempSaleDetails])

  const handleTempLocationData = async () => {
    setClientName("")
    setSerialNumber("")
    setClientAddress("")
    setList([])
    for (let i = 0; i < tempSaleDetails?.products?.length; i++) {
      console.log(tempSaleDetails.products[i].shopIdForData)
      console.log(tempSaleDetails.products[i]._id)
      const resp = await getProductLocationOnShopAndProductId(
        tempSaleDetails.products[i].quantityidset,
        tempSaleDetails.products[i].productColor,
        tempSaleDetails.products[i].shopIdForData,
      )
      console.log(resp)
      const shopId = resp?.shopAvalibility
      const productId = resp?.product
      const colorId = resp?.colorId
      const quantity = resp?.productQuantity
      const locItems = {
        shopId,
        colorId,
        productId,
        quantity,
      }
      locItemsArray.push(locItems)
    }
    handleTempSaleData()
  }

  /**************************************************************************************/
  /**********************************************************************************/
  /************ Handle Temporary Data  **********/
  /**********************************************************************************/
  /**********************************************************************************/

  const handleTempSaleData = async () => {
    console.log(locItemsArray)
    const originalLength = tempSaleDetails?.products?.length
    tempSaleDetails.products = tempSaleDetails?.products?.filter((tempSale) => {
      return !locItemsArray.some((locItems) => {
        return (
          tempSale.quantityidset === locItems.productId &&
          tempSale.shopIdForData === locItems.shopId &&
          tempSale.productColor === locItems.colorId &&
          tempSale.PurchaseQuantity > locItems.quantity
        )
      })
    })
    const newLength = tempSaleDetails?.products?.length

    if (newLength < originalLength) {
      const removedItemsCount = originalLength - newLength
      swal.fire({
        icon: "warning",
        title: t("titleAlert"),
        text: `${removedItemsCount} items have been removed from the list.`,
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      })
      console.log(`${removedItemsCount} items have been removed.`)
    }
    setShopPhoneNo(tempSaleDetails.phoneNo)
    setShopAddress(tempSaleDetails.address)
    setClientName(tempSaleDetails.customerName)
    setSerialNumber(tempSaleDetails.serialNumber)
    console.log(tempSaleDetails.customerNumber.length)
    setClientAddress(tempSaleDetails.customerNumber)
    setPhoneNumberCompleted(true)
    setTempSaleMainId(tempSaleDetails._id)
    const productLength = tempSaleDetails.products?.length
    for (let j = 0; j < productLength; j++) {
      const Code = tempSaleDetails.products[j].Code
      const Company = tempSaleDetails.products[j].Company
      const Discount = Number.parseInt(tempSaleDetails.products[j].Discount)
      const Namee = tempSaleDetails.products[j].Namee
      const PurchaseQuantity = Number.parseInt(tempSaleDetails.products[j].PurchaseQuantity)
      const amount = Number.parseInt(tempSaleDetails.products[j].amount)
      const barcode = tempSaleDetails.products[j].barcode
      const color = tempSaleDetails.products[j].color
      const excludeTaxPrice = Number.parseInt(tempSaleDetails.products[j].excludeTaxPrice)
      const fbrAmount = Number.parseInt(
        (Number.parseInt(tempSaleDetails.products[j].excludeTaxPrice) / 1.18) *
          Number.parseInt(tempSaleDetails.products[j].PurchaseQuantity),
      )
      const fbrTotalAmount =
        Number.parseInt(tempSaleDetails.products[j].excludeTaxPrice) *
        Number.parseInt(tempSaleDetails.products[j].PurchaseQuantity)

      const taxAmount = Number.parseInt(tempSaleDetails.products[j].taxAmount)
      const taxPercentage = Number.parseInt(tempSaleDetails.products[j].taxPercentage)
      const totalAmounnt = Number.parseInt(tempSaleDetails.products[j].totalAmounnt)
      const productColor = tempSaleDetails.products[j].productColor
      const id = tempSaleDetails.products[j].id
      const quantityidset = tempSaleDetails.products[j].quantityidset
      const locationsetid = tempSaleDetails.products[j].locationsetid
      const shopIdForData = tempSaleDetails.products[j].shopIdForData
      const minimumSalePrice = tempSaleDetails.products[j].minimumSalePrice
      const salesmanSalePrice = tempSaleDetails.products[j].salesmanSalePrice
      const purchasePrice = tempSaleDetails.products[j].purchasePrice
      const purchaseInvoicePrice = tempSaleDetails.products[j].purchaseInvoicePrice
      const PCTCode = tempSaleDetails.products[j].PCTCode
      const newItems = {
        id,
        Namee,
        Discount,
        Code,
        PurchaseQuantity,
        amount,
        barcode,
        excludeTaxPrice,
        taxAmount,
        productColor,
        taxPercentage,
        totalAmounnt,
        color,
        Company,
        quantityidset,
        locationsetid,
        shopIdForData,
        minimumSalePrice,
        salesmanSalePrice,
        purchasePrice,
        purchaseInvoicePrice,
        PCTCode,
        fbrAmount,
        fbrTotalAmount,
      }
      setList((prevList) => [...prevList, newItems])
    }
    dispatch({
      type: TEMP_SALE_DETAILS_SUCCESS,
      payload: [],
    })
  }

  /////////==========================================////
  ///========== Updating the invoice Number =========/////////
  ///////========================================/////////

  const updateInvoiceNumber = (newInvoiceNumber) => {
    setInvoiceNumber(newInvoiceNumber)
    invoiceNumberRef.current = newInvoiceNumber
  }

  /////////==========================================////
  ///========== Handle Save Data to Database=========/////////
  ///////========================================/////////
  const handleSaveData = async () => {
    tempSaleProdData = await getTemporarySale()
    console.log(tempSaleProdData)

    if (!JSON.parse(localStorage.getItem("isAdministrator"))) {
      tempSaleProdData = tempSaleProdData?.reduce((filteredProducts, product) => {
        if (product?.shopNo === JSON.parse(localStorage.getItem("shopId")) && product?.customerName === clientName) {
          filteredProducts.push(product)
        }
        return filteredProducts
      }, [])
    }
    setIsGenerated(true)

    console.log("called")
    const PaymentMode = 1
    const RefUSIN = null
    const InvoiceType = 1
    const POSID = JSON.parse(localStorage.getItem("posId"))
    const TotalQuantity = GrandQuantityTotal
    const TotalTaxCharged = GrandTotalTax
    const TotalSaleValue = GrandTotalExludeTex
    const TotalBillAmount = total
    const Discount = GrandDiscount
    try {
      /////*********** Handle Fiscal Post Api ***********///////////
      console.log("heloo")
      console.log(TotalSaleValue)
      console.log(TotalTaxCharged)

      const tempLocQuantityList = []
      list.map((temp) => {
        const prodQuantity = Number.parseInt(temp?.PurchaseQuantity)
        const productQuantity = -prodQuantity
        const productId = temp?.quantityidset
        const locationsetid = temp?.locationsetid
        const colorId = temp?.productColor
        const shopId = temp?.shopIdForData
        const newItems = {
          productQuantity,
          productId,
          colorId,
          shopId,
          locationsetid,
        }
        tempLocQuantityList.push(newItems)
      })
      console.log(tempLocQuantityList)
      if (QURESHI_ELECTRONICS === "QURESHI_ELECTRONICS_WITH_FBR") {
        const shopNo = JSON.parse(localStorage.getItem("shopId"))
        const saledby = user?.user?.name
        const response = await postFBRData(
          // user?.user?.fbrAccessToken,
          InvoiceNumber,
          POSID,
          USIN,
          DateTime,
          TotalBillAmount,
          TotalQuantity,
          Discount,
          TotalSaleValue,
          TotalTaxCharged,
          PaymentMode,
          RefUSIN,
          InvoiceType,
          shopNo,
          clientName,
          clientAddress,
          serialNumber !== "" ? Number(serialNumber) : null,
          shopAddress,
          shopPhoneNo,
          saledby,
          payments,
          paymentStatus,
          remainingDuesDate,
          list,
          total,
          tempLocQuantityList,
          tempSaleMainId,
          fbrTotalSaleAmount,
          fbrTotalBillAmount,
        )
        console.log(response)
        if (response?.data?.message === "Sales Invoice created successfully") {
          const invoiceNumber = response?.data?.output?.InvoiceNumber
          setFbrInvoiceNumber(response?.data?.output?.InvoiceNumber)
          const updatedInvoiceNumber = response?.data?.invoiceNo
          // setSerialNumber(null)
          dispatch(deleteTempSaleItem(tempSaleMainId))
          console.log(response?.data?.invoiceNo)
          setInvoiceNumber(updatedInvoiceNumber)
          console.log(response)
          const res = "successful"
          return { res, response }
        } else {
          console.log(response)
          const res = "Unsuccessful"
          return { res, response }
        }
      } else {
        const shopNo = JSON.parse(localStorage.getItem("shopId"))
        const saledby = user?.user?.name
        const invoiceNumber = "WithoutFBr"
        const seqNo = ""
        const response = await postSaleProductt(
          invoiceNumber,
          seqNo,
          shopNo,
          clientName,
          clientAddress,
          serialNumber !== "" ? Number(serialNumber) : null, // Ensure it's a number or null
          shopAddress,
          shopPhoneNo,
          saledby,
          payments,
          paymentStatus,
          remainingDuesDate,
          list,
          total,
          tempLocQuantityList,
          tempSaleMainId,
        )
        console.log("afhei")
        console.log(response)
        if (response?.data?.message === "Sales Invoice created successfully") {
          dispatch({ type: POST_TEMP_SALE_SUCCESS, payload: [] })
          dispatch(deleteTempSaleItem(tempSaleMainId))
          // setSerialNumber(null)
          const updatedInvoiceNumber = response?.data?.invoiceNo
          setInvoiceNumber(updatedInvoiceNumber)
          updateInvoiceNumber(response?.data?.invoiceNo)
          const res = "successful"
          return { res, response }
        } else {
          console.log(response)
          const res = "Unsuccessful"
          return { res, response }
        }
      }
    } catch (error) {
      console.log("heelo3")
      console.log(error)
      variableForPrint = "Unsuccessful"
      return variableForPrint
    } finally {
      // buttonRef.current.blur();
    }
  }

  /**************************************************************************************/
  /**********************************************************************************/
  /************ Handle Print For Laser Printer **********/
  /**********************************************************************************/
  /**********************************************************************************/

  const handlePrintDownload = async () => {
    try {
      setButtonClicked(true)
      const errors = []
      list.forEach((item, index) => {
        const missingFields = []

        // Check each field for missing values
        if (!item.Code) missingFields.push("Code") //
        if (!item.color) missingFields.push("color") //
        if (!item.Namee) missingFields.push("Namee") //
        if (!item.Company) missingFields.push("Company") //
        if (!item.PCTCode) missingFields.push("PCTCode") //
        if (!item.productColor) missingFields.push("productColor") //
        if (
          Number(item.PurchaseQuantity == null) ||
          Number(item.PurchaseQuantity) === undefined ||
          Number(item.PurchaseQuantity) < 0
        )
          missingFields.push("PurchaseQuantity") //
        if (Number(item.amount == null) || Number(item.amount) === undefined || Number(item.amount) < 0)
          missingFields.push("amount") //
        if (!item.quantityidset) missingFields.push("quantityidset") //
        if (!item.locationsetid) missingFields.push("locationsetid") //
        if (!item.shopIdForData) missingFields.push("shopIdForData")
        if (Number(item.Discount == null) || Number(item.Discount) === undefined || Number(item.Discount) < 0)
          missingFields.push("Discount") //
        if (
          Number(item.excludeTaxPrice == null) ||
          Number(item.excludeTaxPrice) === undefined ||
          Number(item.excludeTaxPrice) < 0
        )
          missingFields.push("excludeTaxPrice") //
        if (
          Number(item.taxPercentage == null) ||
          Number(item.taxPercentage) === undefined ||
          Number(item.taxPercentage) < 0
        )
          missingFields.push("taxPercentage") //
        if (
          Number(item.totalAmounnt == null) ||
          Number(item.totalAmounnt) === undefined ||
          Number(item.totalAmounnt) < 0
        )
          missingFields.push("totalAmounnt") //
        if (Number(item.taxAmount == null) || Number(item.taxAmount) === undefined || Number(item.taxAmount) < 0)
          missingFields.push("taxAmount") //
        if (
          Number(item.salesmanSalePrice == null) ||
          Number(item.salesmanSalePrice) === undefined ||
          Number(item.salesmanSalePrice) < 0
        )
          missingFields.push("salesmanSalePrice") //
        if (
          Number(item.minimumSalePrice == null) ||
          Number(item.minimumSalePrice) === undefined ||
          Number(item.minimumSalePrice) < 0
        )
          missingFields.push("minimumSalePrice") //
        if (
          Number(item.purchasePrice == null) ||
          Number(item.purchasePrice) === undefined ||
          Number(item.purchasePrice) < 0
        )
          missingFields.push("purchasePrice") //
        if (
          Number(item.purchaseInvoicePrice == null) ||
          Number(item.purchaseInvoicePrice) === undefined ||
          Number(item.purchaseInvoicePrice) < 0
        )
          missingFields.push("purchaseInvoicePrice") //
        // If any missing fields, store an error message with the index number
        if (missingFields.length > 0) {
          errors.push({
            index: index + 1, // To show index number starting from 1
            fields: missingFields,
          })
        }
      })

      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => `Item No ${error.index}: Missing fields frontend - ${error.fields.join(", ")}`)
          .join("\n")

        swal
          .fire({
            icon: "error",
            title: t("titleAlert"),
            html: `<pre>${errorMessages}</pre>`, // Use <pre> for better formatting of multiline text
            showConfirmButton: true,
            customClass: {
              popup: "custom-swal-popup", // This is the custom class you're adding
            },
          })
          .then(async (result) => {
            if (result.value) {
              setButtonClicked(false)
            }
          })
        buttonRef?.current.cancel()
      }

      console.log(payments, remainingDuesDate)
      const missingFields = []

      // Check for missing fields and add to the error message list
      if (!clientName) missingFields.push(t("clientName"))
      if (!clientAddress) missingFields.push(t("clientAddress"))
      if (!shopAddress) missingFields.push(t("shopAddress"))
      if (!shopPhoneNo) missingFields.push(t("shopPhoneNo"))
      if (!remainingDuesDate) missingFields.push(t("remainingDuesDate"))
      if (!payments.downPayment) missingFields.push(t("initialPayment"))

      console.log(payments, remainingDuesDate)
      if (missingFields.length > 0) {
        const errorMessage = `${t("pleaseInsert")}: ${missingFields.join(", ")}`

        swal.fire({
          icon: "error",
          title: t("titleAlert"),
          text: errorMessage,
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        })

        buttonRef?.current.cancel()
      }

      setVariableForButtonLoader(true)
      setIsModelOpen(false)
      const result = await handleSaveData()

      await new Promise((resolve) => setTimeout(resolve, 3000 + 1 * 1000))

      console.log(result)
      console.log(result.postResponse)
      // buttonRef?.current.cancel()
      if (!result?.response?.response?.data?.success && result?.res === "Unsuccessful") {
        console.log("error")
        swal.fire({
          icon: "warning",
          title: t("titleAlert"),
          text:
            result?.response?.response?.data?.output?.Code === "102"
              ? "FBR: " + result?.response?.response?.data?.message
              : result?.response?.response?.data?.message,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        })

        setVariableForButtonLoader(false)
        buttonRef?.current.cancel()
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**************************************************************************************/
  /**********************************************************************************/
  /************ Handle Print For Thermal Printer **********/
  /**********************************************************************************/
  /**********************************************************************************/
  const handlePrint = async () => {
    setButtonClicked(true)
    setVariableForButtonLoader(true)
    const errors = []
    list.forEach((item, index) => {
      const missingFields = []

      // Check each field for missing values
      if (!item.Code) missingFields.push("Code") //
      if (!item.color) missingFields.push("color") //
      if (!item.Namee) missingFields.push("Namee") //
      if (!item.Company) missingFields.push("Company") //
      if (!item.PCTCode) missingFields.push("PCTCode") //
      if (!item.productColor) missingFields.push("productColor") //
      if (
        Number(item.PurchaseQuantity == null) ||
        Number(item.PurchaseQuantity) === undefined ||
        Number(item.PurchaseQuantity) < 0
      )
        missingFields.push("PurchaseQuantity") //
      if (Number(item.amount == null) || Number(item.amount) === undefined || Number(item.amount) < 0)
        missingFields.push("amount") //
      if (!item.quantityidset) missingFields.push("quantityidset") //
      if (!item.locationsetid) missingFields.push("locationsetid") //
      if (!item.shopIdForData) missingFields.push("shopIdForData")
      if (Number(item.Discount == null) || Number(item.Discount) === undefined || Number(item.Discount) < 0)
        missingFields.push("Discount") //
      if (
        Number(item.excludeTaxPrice == null) ||
        Number(item.excludeTaxPrice) === undefined ||
        Number(item.excludeTaxPrice) < 0
      )
        missingFields.push("excludeTaxPrice") //
      if (
        Number(item.taxPercentage == null) ||
        Number(item.taxPercentage) === undefined ||
        Number(item.taxPercentage) < 0
      )
        missingFields.push("taxPercentage") //
      if (Number(item.totalAmounnt == null) || Number(item.totalAmounnt) === undefined || Number(item.totalAmounnt) < 0)
        missingFields.push("totalAmounnt") //
      if (Number(item.taxAmount == null) || Number(item.taxAmount) === undefined || Number(item.taxAmount) < 0)
        missingFields.push("taxAmount") //
      if (
        Number(item.salesmanSalePrice == null) ||
        Number(item.salesmanSalePrice) === undefined ||
        Number(item.salesmanSalePrice) < 0
      )
        missingFields.push("salesmanSalePrice") //
      if (
        Number(item.minimumSalePrice == null) ||
        Number(item.minimumSalePrice) === undefined ||
        Number(item.minimumSalePrice) < 0
      )
        missingFields.push("minimumSalePrice") //
      if (
        Number(item.purchasePrice == null) ||
        Number(item.purchasePrice) === undefined ||
        Number(item.purchasePrice) < 0
      )
        missingFields.push("purchasePrice") //
      if (
        Number(item.purchaseInvoicePrice == null) ||
        Number(item.purchaseInvoicePrice) === undefined ||
        Number(item.purchaseInvoicePrice) < 0
      )
        missingFields.push("purchaseInvoicePrice") //

      // If any missing fields, store an error message with the index number
      if (missingFields.length > 0) {
        errors.push({
          index: index + 1, // To show index number starting from 1
          fields: missingFields,
        })
      }
    })

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => `Item No ${error.index}: Missing fields frontend- ${error.fields.join(", ")}`)
        .join("\n")

      swal
        .fire({
          icon: "error",
          title: t("titleAlert"),
          html: `<pre>${errorMessages}</pre>`, // Use <pre> for better formatting of multiline text
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        })
        .then(async (result) => {
          if (result.value) {
            setButtonClicked(false)
          }
        })
      buttonRef?.current?.cancel()
    }

    const missingFields = []

    // Check for missing fields and add to the error message list
    if (!clientName) missingFields.push(t("clientName"))
    if (!clientAddress) missingFields.push(t("clientAddress"))
    if (!shopAddress) missingFields.push(t("shopAddress"))
    if (!shopPhoneNo) missingFields.push(t("shopPhoneNo"))
    if (!remainingDuesDate) missingFields.push(t("remainingDuesDate"))
    if (!payments.downPayment) missingFields.push(t("downPayment"))

    console.log(payments, remainingDuesDate)
    if (missingFields.length > 0) {
      const errorMessage = `${t("pleaseInsert")}: ${missingFields.join(", ")}`

      swal.fire({
        icon: "error",
        title: t("titleAlert"),
        text: errorMessage,
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      })

      buttonRef?.current.cancel()
    }

    const result = await handleSaveData()

    await new Promise((resolve) => setTimeout(resolve, 3000 + 1 * 1000))

    console.log(result)
    console.log(result.postResponse)
    // buttonRef?.current.cancel()
    if (result?.res === "Unsuccessful" && result?.postResponse) {
      swal.fire({
        icon: "warning",
        title: t("titleAlert"),
        text: result.postResponse,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      })
      buttonRef?.current.cancel()
    } else if (result?.res === "Unsuccessful" && result?.response.Response) {
      swal.fire({
        icon: "warning",
        title: t("titleAlert"),
        text: "FBR, " + result?.response.Response,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      })
      buttonRef?.current.cancel()
    } else if (result === "Unsuccessful") {
      swal.fire({
        icon: "warning",
        title: t("titleAlert"),
        text: "Error Occured ",
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      })
      // buttonRef?.current.cancel()
    }
    printJS({
      printable: "invoice",
      type: "html",
      targetStyles: ["*"],
      font_size: "10pt",
      font_family: "Courier New",
      css: "../Components/Printer/thermalPrinter.css",
      scanStyles: false,
    })

    setList([])
    setClientName("")
    setSerialNumber("")
    setClientAddress("")
    setVariableForButtonLoader(false)
    setInvoiceNumber("")
    setFbrInvoiceNumber("")
  }

  // useEffect(() => {
  //   if (isGenerated) {
  //     const locListQauntityLength = locQuantityList?.length;
  //     for (let i = 0; i < locListQauntityLength; i++) {
  //       dispatch(updateProductLocationOnSale(
  //         locQuantityList[i].quantityidset,
  //         locQuantityList[i].productColor,
  //         locQuantityList[i].shopIdForData,
  //         locQuantityList[i].productQuantity
  //       ))
  //     }
  //   }
  // }, [locQuantityList, isGenerated]);

  useEffect(() => {
    totalTaxAmount = list
      ?.reduce((sum, product) => {
        const taxAmount = Number.parseInt(product.taxAmount, 10)
        return isNaN(taxAmount) ? sum : sum + taxAmount
      }, 0)
      .toString()

    totalPrice = list
      ?.reduce((sum, product) => {
        const price = Number.parseInt(product.excludeTaxPrice, 10)
        return isNaN(price) ? sum : sum + price
      }, 0)
      .toString()

    totalDiscount = list
      ?.reduce((sum, product) => {
        const disc = Number.parseInt(product.Discount, 10)
        return isNaN(disc) ? sum : sum + disc
      }, 0)
      .toString()

    totalQuantity = list
      ?.reduce((sum, product) => {
        const quantity = Number.parseInt(product.PurchaseQuantity, 10)
        return isNaN(quantity) ? sum : sum + quantity
      }, 0)
      .toString()

    totalAmount = list
      ?.reduce((sum, product) => {
        const total = Number.parseInt(product.amount, 10)
        return isNaN(total) ? sum : sum + total
      }, 0)
      .toString()
  }, [list])

  const thermalPrinterData = [
    { label: "Customer Name:", key: "clientName" },
    { label: "Cell No:", key: "clientAddress" },
    { label: "Invoice number:", key: "invoiceNumber" },
    { label: "Invoice date:", key: "invoiceDate" },
    { label: "FBR Invoice number:", key: "fbrInvoiceNumber" },
    { label: "Generated By:", key: "generatedBy" },
  ]

  const thermalPrinterFooter = [
    { label: "Total Price :", key: "totalPrice" },
    { label: "Total Discount :", key: "totalDiscount" },
    { label: "Total Quantity :", key: "totalQuantity" },
    { label: "Total Tax :", key: "totalTaxAmount" },
    { label: "Total Amount:", key: "totalAmount" },
  ]

  const headerLabel = [
    { label: "", key: "shopAddress" },
    { label: "Phone No", key: "shopPhoneNo" },
  ]

  const action4 = "salepage"

  const columns = [
    { field: "Code", label: "Code" },
    { field: "Namee", label: "Name" },
    { field: "color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "PurchaseQuantity", label: "Qty" },
    { field: "excludeTaxPrice", label: "Price" },
    { field: "totalAmounnt", label: "Total" },
    { field: "Discount", label: "Disc" },
    { field: "taxAmount", label: "Tax" },
    { field: "amount", label: "Due Amount" },
  ]

  const withoutFBRColumns = [
    { field: "Code", label: "Code" },
    { field: "Namee", label: "Name" },
    { field: "color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "PurchaseQuantity", label: "Qty" },
    { field: "excludeTaxPrice", label: "Price" },
    { field: "totalAmounnt", label: "Total" },
    { field: "Discount", label: "Disc" },
    { field: "amount", label: "Due Amount" },
  ]

  const invoiceData = {
    invoiceTitle: "Sale Invoice",
    companyTitle: COMPANYHEADER,
    address: user?.user?.shopNo?.shopAddress,
    contact: user?.user?.shopNo?.phoneNo,

    customerTitle: "Name",
    customerTitleValue: `${clientName}`,
    customerPhoneTitle: "Contact",
    customerPhoneValue: `${clientAddress}`,
    generatedBy: `${user?.user?.name}`,

    billingDetailsFirstTitle: "FBR Invoice Number",
    billingDetailsSecondTitle: `Invoice Number`,
    billingDetailsThirdTitle: `Dated`,
    billingDetailsFirstValue: fbrInvoiceNumber,
    billingDetailsSecondValue: invoiceNumber,
    billingDetailsThirdValue: `${invoiceDate}`,

    columns,
    listData: list,

    FBRInvoiceNumber: fbrInvoiceNumber,
    totalFirstTitle: "Total Tax Charged",
    totalSecondTitle: "Total Sale Value",
    totalThirdTitle: "Total Discount",
    totalFourthTitle: "Due Amount",
    totalFifthTitle: "Initial Payment",
    totalSixthTitle: "Remaining Dues Date",
    totalFirstValue: GrandTotalTax,
    totalSecondValue: GrandTotalExludeTex,
    totalThirdValue: GrandDiscount,
    totalFourthValue: total,
    totalFifthValue: initialPayment,
    totalSixthValue: remainingDuesDate,
    terms: "Qureshi Electronics Corporation",
    paymentStatus: paymentStatus, // Add this line
  }

  const withoutFBRinvoiceData = {
    invoiceTitle: "Sale Invoice",
    companyTitle: COMPANYHEADER,
    address: user?.user?.shopNo?.shopAddress,
    contact: user?.user?.shopNo?.phoneNo,

    customerTitle: "Name",
    customerTitleValue: `${clientName}`,
    customerPhoneTitle: "Contact",
    customerPhoneValue: `${clientAddress}`,
    generatedBy: `${user?.user?.name}`,

    // billingDetailsFirstTitle: "FBR Invoice Number",
    billingDetailsSecondTitle: `Invoice Number`,
    billingDetailsThirdTitle: `Dated`,
    // billingDetailsFirstValue: fbrInvoiceNumber,
    billingDetailsSecondValue: invoiceNumber,
    billingDetailsThirdValue: `${invoiceDate}`,

    columns: withoutFBRColumns,
    listData: list,

    FBRInvoiceNumber: fbrInvoiceNumber,
    totalFirstTitle: "Total Sale Value",
    totalSecondTitle: "Total Discount",
    totalThirdTitle: "Due Amount",
    totalFourthTitle: "Initial Payment",
    totalFifthTitle: "Remaining Balance",
    totalSixthTitle: "Remaining Dues Date",
    totalFirstValue: GrandTotalExludeTex,
    totalSecondValue: GrandDiscount,
    totalThirdValue: total,
    totalFourthValue: initialPayment,
    totalFifthValue: total - initialPayment,
    totalSixthValue: remainingDuesDate,
    terms: "Qureshi Electronics Corporation",
    paymentStatus: paymentStatus,
  }
  return (
    <>
      <MetaData title="QE ~~SaleProduct" />
      <div className={`Sale ${colorTheme}`}>
        <div className="secondContainer">
          {saleProductPermission && (
            <>
              <div className="contentt-box">
                <div className="heading-container">
                  <h3>{t("saleProduct")}</h3>
                </div>
              </div>
              <div className="Sale-Input-Section">
                <div className="formApp">
                  <div className="formRow">
                    <div className="inputSection">
                      <label>{t("customerName")}</label>
                      <input
                        type="text"
                        className="saleInputField"
                        placeholder={t("customerName")}
                        name="productType"
                        autoComplete="off"
                        maxLength="40"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        disabled={list?.length > 0}
                      />
                    </div>
                    <div className="inputSection">
                      <label>{t("contactNo")}</label>
                      <input
                        label={t("productCode")}
                        className="saleInputField"
                        type="text"
                        placeholder={t("enterContactNo")}
                        name="productCode"
                        autoComplete="off"
                        value={clientAddress}
                        maxLength="11"
                        onChange={handleInputChange}
                        disabled={list?.length > 0}
                      />
                    </div>
                    <div className="inputSection">
                      <label>{t("serialNumber")}</label>
                      <input
                        type="number"
                        className="saleInputField"
                        placeholder={t("serialNumber")}
                        name="serialNumber"
                        autoComplete="off"
                        maxLength="40"
                        value={serialNumber}
                        onChange={handleSerialNumberChange}
                        disabled={list?.length > 0}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="formAppSecondSection">
                {clientName && clientAddress ? (
                  <>
                    <div className="buttonAppRow">
                      {barLoader ? (
                        <Loader active inline="centered" />
                      ) : (
                        <>
                          <Button
                            className={`button button-add-product`}
                            onClick={() => {
                              navigate("/saleproductpage")
                            }}
                          >
                            {t("sellProduct")}&nbsp;
                            <Inventory2Icon />
                          </Button>
                        </>
                      )}
                      {list && list?.length > 0 && (
                        <>
                          {isChooseOnPrint ? (
                            <>
                              {/* <div className="action-container"> */}

                              <Button
                                className={`button button-add-product`}
                                onClick={() => {
                                  setIsModelOpen(true)
                                }}
                              >
                                Generate Invoice &nbsp;&nbsp;
                                <SaveAltIcon />
                              </Button>
                              {/* </div> */}
                              <div className="printer-select-container">
                                <select
                                  value={selectedPrinter}
                                  onChange={(e) => setSelectedPrinter(e.target.value)}
                                  className="printer-select"
                                >
                                  <option value="">Select Printer</option>
                                  <option value="laser">Laser Printer</option>
                                  <option value="thermal">Thermal Printer</option>
                                </select>
                              </div>
                            </>
                          ) : (
                            <Button
                              className={`button button-add-product`}
                              onClick={() => {
                                setIsModelOpen(true)
                              }}
                            >
                              Generate Invoice &nbsp;&nbsp;
                              <SaveAltIcon />
                            </Button>
                          )}
                        </>
                      )}
                      {isModelOpen && (
                        <>
                          <PaymentModel
                            isModelOpen={isModelOpen}
                            setIsModelOpen={setIsModelOpen}
                            buttonRef={buttonRef}
                            buttonClicked={buttonClicked}
                            handlePrintDownload={handlePrintDownload}
                            handlePrint={handlePrint}
                            variableForButtonLoader={variableForButtonLoader}
                            setVariableForButtonLoader={setVariableForButtonLoader}
                            selectedPrinter={selectedPrinter}
                          />
                        </>
                      )}
                    </div>
                    {!variableForButtonLoader ? (
                      <div className="table-container">
                        <TableForm setIsInputFilled={setIsInputFilled} />
                      </div>
                    ) : (
                      <PageLoader />
                    )}
                  </>
                ) : (
                  <h1 style={{ fontSize: "1rem", fontWeight: "bold" }}>{t("purchaseMessage")}</h1>
                )}
              </div>

              {user?.user?.printerId?.printerType === "Laser" || (isChooseOnPrint && selectedPrinter === "laser") ? (
                <>
                  <div className="print-only-container">
                    <div id="invoice" ref={componentRef} className="p-5">
                      {QURESHI_ELECTRONICS === "QURESHI_ELECTRONICS_WITH_FBR" ? (
                        <>
                          <MainInvoice invoiceData={invoiceData} />
                        </>
                      ) : (
                        <>
                          <MainInvoice invoiceData={withoutFBRinvoiceData} />
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="print-only-container">
                    <div id="invoice" ref={componentRef} className="invoice">
                      <ThermalPrinter
                        headerLabel={headerLabel}
                        headerData={{ shopAddress, shopPhoneNo }}
                        labelData={thermalPrinterData}
                        data={{
                          clientName,
                          clientAddress,
                          invoiceNumber,
                          invoiceDate,
                          generatedBy: user?.user?.name,
                          fbrInvoiceNumber,
                        }}
                        tableData={list}
                        tableColumns={columns}
                        action={action4}
                        footerLabel={thermalPrinterFooter}
                        footerData={{
                          totalPrice,
                          totalDiscount,
                          totalTaxAmount,
                          totalQuantity,
                          totalAmount,
                        }}
                      />

                      <div style={{ paddingTop: "10px" }}>
                        <p
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Powered by Soft Wise Solutions +92 334 096 0444{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App
