import { useContext, useEffect, useRef, useState } from "react"
import MetaData from "../../../MetaData"
import { CgAdd } from "react-icons/cg"
import TableForm from "./TableForm"
import printJS from "print-js"
import AsyncSelect from "react-select/async"
import ReactToPrint from "react-to-print"
import { useLocation } from "react-router-dom"
import { State } from "./context/stateContext"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { Button } from "semantic-ui-react"
import swal from "sweetalert2"
import { useSelector, useDispatch } from "react-redux"
import { getProductsOnCompanyName } from "../../../actions/productActions"
import { getCompany } from "../../../actions/companyAction"
import { getStorage, gettStorage } from "../../../actions/storageAction"
import { deleteAllTempPurchase, getTemporaryPurchase } from "../../../actions/tempPurchaseAction"
import SaveAltIcon from "@mui/icons-material/SaveAlt"
import { getProductType } from "../../../actions/productTypeAction"
import { addPurchase } from "../../../actions/purchaseAction"
import { refreshTokken } from "../../../actions/userAction"
import { TEMP_PURCHASE_DETAILS_SUCCESS } from "../../../constants/tempPurchaseConstants"
import { getColor } from "../../../actions/colorAction"
import PageLoader from "../../../Components/Loader/PageLoader"
import ThermalPrinter from "../../../Components/Printer/ThermalPrinter"
import Invoice from "../../../Components/Printer/MainPrinter"
import { COMPANYHEADER } from "../../../constants/companyNameContants"
// Import the createPurchaseApproval action
import {
  createPurchaseApproval,
  resetCreatePurchaseApproval,
  getPurchaseApprovalById,
} from "../../../actions/purchaseApprovalAction"
let invoicenumberr
// let company = [];
let shopNo
const tempProductResult = []
let variableForPrint
let selectedShop = []
let seletedGodown = []
const selectedTempShop = ""
let storeIn
let isCalled = "false"
let totalTaxAmount
let totalQuantity
let totalAmount
let totalPrice
let totalDiscount
// let time=new Date().toLocaleTimeString()
function App() {
  ///////===========================/////////////
  ////////// useState Variables /////////////////
  ///////=========================///////////////
  const [buttonClicked, setButtonClicked] = useState(false)
  const [StorageLocation, setStorageLocation] = useState([])
  const [isListHaveItem, setIsListHaveItem] = useState(false)
  const [error, setError] = useState(false)
  const [checkCompleted, setCheckCompleted] = useState(false)
  const [purchaseBy, setPurchaseBy] = useState()
  const [purchaseProductPermission, setPurchaseProductPermission] = useState(false)
  const companyDropdownRef = useRef(null)
  const branchDropdownRef = useRef(null)
  // const [purchaseBy, setPurchaseBy] = useState()
  const [variableForButtonLoader, setVariableForButtonLoader] = useState(false)
  const [companyRecordList, setCompanyRecordList] = useState()
  const [storageRecordList, setStorageRecordList] = useState()
  const {
    clientName,
    setClientName,
    companyDefaultValue,
    setComapnyDefaultValue,
    invoiceNumber,
    setInvoiceNumber,
    setInvoiceDate,
    componentRef,
    listpurchase,
    total,
    setListpurchase,
    setTotal,
    setLocationsetid,
    purchaseDate,
    setPurchaseDate,
    purchaseReceiptNumber,
    setPurchaseReceiptNumber,
    purchaseCompany,
    setPurchaseCompany,
    purchaseFor,
    setPurchaseFor,
    selectedCompany,
    setSelectedCompany,
    // setPurchasedBy,
    purchasedBy,
    setTempPurchaseId,
    clearData,
    selectedRadioOption,
    setSelectedRadioOption,
    godownId,
    setGodownId,
    shopId,
    setShopId,
    shopAddress,
    setShopAddress,
    shopPhoneNo,
    setShopPhoneNo,
    postTempPurchaseMainId,
    setPostTempPurchaseMainId,
    invoiceShopAddress,
    selectedShopDefaultValue,
    setSelectedShopDefaultValue,
    setInvoiceShopAddress,
    priceExcludingTax,
    setPriceExcludingTax,
  } = useContext(State)
  const [locQuantityList, setLocQuantityList] = useState([])
  const [locProductItemlist, setLocProductItemlist] = useState([])
  const [permissionForPrint, setPermissionForPrint] = useState(null)
  const [isStorageOpen, setIsStorageOpen] = useState(false)
  const [isCompanyOpen, setIsCompanyOpen] = useState(false)
  const [permissionAddCompany, setPermisionAddCompany] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  // Add a new state for the printer selection dropdown
  const [selectedPrinter, setSelectedPrinter] = useState("")
  const [colorTheme, setColorTheme] = useState("theme-white")
  const isGetProductCalled = "false"
  const dispatch = useDispatch()
  const { company, loading } = useSelector((state) => state.company)
  const { storage } = useSelector((state) => state.storage)
  const { shop } = useSelector((state) => state.shop)
  const { user } = useSelector((state) => state.user)
  const { tempPurchaseDetails, tempPurchaseDetailsLoading } = useSelector((state) => state.tempPurchaseDetails)
  const { purchasePost, purchasePostLoading, purchasePostError } = useSelector((state) => state.purchasePost)
  const {
    purcahseProductPriceUpdateInProduct,
    purcahseProductPriceUpdateInProductLoading,
    purcahseProductPriceUpdateInProductError,
  } = useSelector((state) => state.purcahseProductPriceUpdateInProduct)
  const { postTempPurchase } = useSelector((state) => state.postTempPurchase)
  // Add the createPurchaseApproval reducer to the component
  const {
    loading: createPurchaseApprovalLoading,
    success: createPurchaseApprovalSuccess,
    error: createPurchaseApprovalError,
  } = useSelector((state) => state.createPurchaseApproval)
  const [loadingApprovalData, setLoadingApprovalData] = useState(false)
  // Add the purchaseApproval reducer to access approval details
  const { purchaseApproval, loading: purchaseApprovalLoading } = useSelector((state) => state.purchaseApprovalDetails)
  const onBeforeGetContentResolve = useRef()
  const [dataLoaded, setDataLoaded] = useState(false)
  const currentDate = new Date()
  const formattedDate = currentDate?.toLocaleDateString()
  // const history = useHistory();
  const location = useLocation()

  const firstDropdownRef = useRef(null)
  const secondDropdownRef = useRef(null)
  const thirdDropdownRef = useRef(null)
  // This will check if the user has selected "Choose on Print" in their settings
  const isChooseOnPrint = user?.user?.printerId?.printerType === "Choose on Print"

  useEffect(() => {
    const previousPath = location.state ? location.state : null
    const isPreviousPathMatching = previousPath === "/purchaseProductPage" || previousPath === "/purchaseDiscount"
    console.log("Is previous path matching:", isPreviousPathMatching)
    if (!isPreviousPathMatching) {
      setPurchaseCompany("")
      setClientName("")
      setPurchaseReceiptNumber("")
      setSelectedRadioOption("")
      setListpurchase([])
      setPurchaseDate("")
      setSelectedShopDefaultValue("")
      // setSelectedShopDefaultValue({value: "", label: "select.."})
      setComapnyDefaultValue("")
    }
  }, [location.state])

  useEffect(() => {
    setPurchaseProductPermission(false)
    getPermission()
  }, [])

  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles("Can Purchase Product")
      const permissionforCompany = await getPermissionForRoles("Add Company")
      setPermisionAddCompany(permissionforCompany)

      setPurchaseProductPermission(permissionForAdd)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  ///////////////////////////////////////////////////////
  ////////=============================////////////////////
  /////////////// Hooks ///////////////////////////////////
  ///////==============================/////////////////
  const { t, i18n } = useTranslation()
  const buttonRef = useRef(null)
  const navigate = useNavigate()
  const invoiceNumberRef = useRef(invoiceNumber)

  ////////////==================================//////////
  ///////////////// New Logic ///////////////////////
  //////////==================================/////////

  const handleSelectChange = (value) => {
    setSelectedShopDefaultValue(value)
    setSelectedRadioOption(value.value)
    setPurchaseFor(JSON.parse(localStorage.getItem("shopId")))
    console.log(value.value)
    console.log(shop)
    console.log(storage)
    if (value?.value.startsWith("G_")) {
      storage?.map((store) => {
        if (store?.storageCode === value.value) {
          console.log(store?._id)
          setLocationsetid(store?._id)
          console.log(store?.shopId?.shopAddress)
          setShopAddress(store?.shopId?.shopAddress)
          setShopPhoneNo(store?.shopId?.phoneNo)
          setGodownId(store?._id)
          setShopId(null)
          setIsStorageOpen(!isStorageOpen)
        }
      })
      console.log("cellfie")
    } else {
      shop?.map((shopp) => {
        if (shopp?.shopCode === value.value) {
          console.log(shopp?._id)
          console.log(shopp)
          setLocationsetid(shopp?._id)
          setShopAddress(shopp?.shopAddress)
          setShopPhoneNo(shopp?.phoneNo)
          setShopId(shopp?._id)
          setGodownId(null)
          setIsStorageOpen(!isStorageOpen)
        }
      })
    }
    storeIn = value.value
  }

  ////////////==================================//////////
  /////////////////  shop selection ///////////////////////
  //////////==================================/////////
  const shopAsArray = [selectedShop]
  const shopCodes = shopAsArray?.map((shop) => shop)
  const godownCodes = seletedGodown?.map((godown) => godown)
  const combinedOptions = [...shopCodes, ...godownCodes]
  const storageList = combinedOptions?.map((storage) => ({
    value: storage,
    label: storage,
  }))
  // setStorageRecordList(combinedOptions?.map(storage =>({
  //         value: storage,
  //         label: storage
  //       })))
  useEffect(() => {
    selectedShop = JSON.parse(localStorage.getItem("shopId"))
    seletedGodown = JSON.parse(localStorage.getItem("godownId"))
    console.log(selectedShop)
    console.log(seletedGodown)
  }, [])

  //////////=====================================//////////////
  //////////// Functions for Dropdown fields /////////////////
  //////////=====================================////////////

  const handlePurchaseDateChange = (date) => {
    setPurchaseDate(date)
  }

  const handleCompanySelectChange = (value) => {
    console.log(value)
    setComapnyDefaultValue(value)
    // setSelectedCompany(value.value)
    dispatch(getProductsOnCompanyName(value.value))
    setPurchaseCompany(value.value)
    setIsCompanyOpen(!isCompanyOpen)
  }

  ////////========================================///////////////
  ////////// All UseEffects  /////////////////
  //////////=====================================////////////

  useEffect(() => {
    isCalled = "false"
  }, [clientName, purchaseDate, purchaseCompany, purchaseReceiptNumber, purchaseFor])

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true"
      getToken()
    }
  }, [isCalled])

  useEffect(() => {
    // setPurchasedBy(JSON.parse(localStorage.getItem("username")))
    if (purchaseCompany) {
      dispatch(getProductsOnCompanyName(purchaseCompany))
    }
  }, [purchaseCompany])

  const getToken = async () => {
    // setPurchasedBy(JSON.parse(localStorage.getItem("username")))

    dispatch(getStorage())
    const token = await refreshTokken()
    if (token?.data === "Please login to acces this resource") {
      navigate("/login")
    }
    console.log(token)
  }

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color")
    if (currentColorTheme) {
      setColorTheme(currentColorTheme)
    }
  }, [colorTheme])

  useEffect(() => {
    const currentLang = localStorage.getItem("lang")
    i18n.changeLanguage(currentLang)
  }, [])

  useEffect(() => {
    variableForPrint = ""
    setVariableForButtonLoader(false)
  }, [])

  useEffect(() => {
    setButtonClicked(false)
    dispatch(getProductType())
    dispatch(getCompany())
    dispatch(getColor())
    getStoagelocation()
    const today = new Date()
    const yyyy = today.getFullYear()
    let mm = today.getMonth() + 1 // Months start at 0!
    let dd = today.getDate()

    if (dd < 10) dd = "0" + dd
    if (mm < 10) mm = "0" + mm

    setInvoiceDate(dd + "/" + mm + "/" + yyyy)
  }, [])

  //use Effect just for disable the purchase For ...if it has item in list
  useEffect(() => {
    if (listpurchase?.length > 0) {
      console.log("hfeiji")
      setIsListHaveItem(true)
    } else {
      setIsListHaveItem(false)
    }

    if (listpurchase?.length < 1 && !clearData) {
      setPurchaseFor("")
      setClientName("")
      setPurchaseDate("")
      setPurchaseReceiptNumber("")
      setPurchaseCompany("")
    }
  }, [listpurchase])

  const getStoagelocation = async () => {
    const result = await gettStorage()
    setStorageLocation(result)
  }

  //////////////============================================================////////////////////
  ////////////////////////// Handle Purchase Approval Table logic //////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////

  // Check if we're coming from the approval page and load approval data
  // useEffect(() => {
  //   if (location.state?.fromApproval && location.state?.approvalId) {
  //     setLoadingApprovalData(true)
  //     // Fetch the approval details
  //     dispatch(getPurchaseApprovalById(location.state.approvalId))
  //   }
  // }, [location.state, dispatch])

  // // Process approval data when it's loaded
  // useEffect(() => {
  //   if (purchaseApproval && location.state?.fromApproval && !purchaseApprovalLoading) {
  //     // Set all the form fields from the approval data
  //     setListpurchase([])
  //     setClientName(purchaseApproval.clientName)
  //     setPurchaseDate(purchaseApproval.purchaseDate)
  //     setShopAddress(purchaseApproval.address)
  //     setShopPhoneNo(purchaseApproval.phoneNo)
  //     setGodownId(purchaseApproval.godownId)
  //     setShopId(purchaseApproval.shopId)
  //     setPurchaseCompany(purchaseApproval.purchaseCompany)
  //     setComapnyDefaultValue({
  //       value: purchaseApproval.purchaseCompany,
  //       label: purchaseApproval.purchaseCompany,
  //     })
  //     setPurchaseReceiptNumber(purchaseApproval.purchaseReceiptNumber)
  //     setSelectedShopDefaultValue({
  //       value: purchaseApproval.storeIn,
  //       label: purchaseApproval.storeIn,
  //     })
  //     setPurchaseFor(purchaseApproval.shopNo)
  //     storeIn = purchaseApproval.storeIn
  //     setSelectedRadioOption(purchaseApproval.storeIn)

  //     if (purchaseApproval.godownId) {
  //       setLocationsetid(purchaseApproval.godownId)
  //     } else {
  //       setLocationsetid(purchaseApproval.shopId)
  //     }

  //     // Set products
  //     const products = purchaseApproval.products.map((product) => ({
  //       id: product.id,
  //       Namee: product.Namee,
  //       Code: product.Code,
  //       PurchaseQuantity: Number.parseInt(product.PurchaseQuantity),
  //       productColor: product.productColor,
  //       godownId: purchaseApproval.godownId,
  //       shopId: purchaseApproval.shopId,
  //       amount: Number.parseInt(product.amount || 0),
  //       purchaseTotalDiscount: Number.parseInt(product.purchaseTotalDiscount || product.discountValue || 0),
  //       expenseTotal: Number.parseInt(product.expenseTotal || 0),
  //       purchasePrice: Number.parseInt(product.purchasePrice || 0),
  //       MRP: Number.parseInt(product.MRP || 0),
  //       purchaseProductTotalAmount: Number.parseInt(product.purchaseProductTotalAmount || 0),
  //       purchaseQuantityPrice: Number.parseInt(product.purchaseQuantityPrice || 0),
  //       purchaseTotalAmount: Number.parseInt(product.purchaseTotalAmount || 0),
  //       discountValue: Number.parseInt(product.discountValue || 0),
  //       invoicePrice: Number.parseInt(product.invoicePrice || 0),
  //       purchaseProductPriceExcludeTax: Number.parseInt(product.purchaseProductPriceExcludeTax || 0),
  //       purchaseProductDiscount: Number.parseInt(product.purchaseProductDiscount || 0),
  //       purchaseDiscount: Number.parseInt(product.purchaseDiscount || product.discountValue || 0),
  //       expense: Number.parseInt(product.expense || 0),
  //       purchaseProductTax: Number.parseInt(product.purchaseProductTax || 0),
  //       purchaseTaxPercentage: Number.parseInt(product.purchaseTaxPercentage || 0),
  //       purchaseTotalTax: Number.parseInt(product.purchaseTotalTax || 0),
  //       Color: product.Color,
  //       Company: product.Company,
  //       quantityidset: product.quantityidset,
  //       locationsetid: product.locationsetid,
  //       salesmanSalePrice: product.salesmanSalePrice,
  //       minimumSalePrice: product.minimumSalePrice,
  //     }))

  //     // console.log(products);
      
  //     setListpurchase(products)
  //     setTotal(purchaseApproval.total)
  //     setLoadingApprovalData(false)
  //   }
  // }, [purchaseApproval, purchaseApprovalLoading, location.state])

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////============================================================////////////////////
  ////////////////////////// Handle Temporary Purchase Table logic //////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (postTempPurchase) {
      setPostTempPurchaseMainId(postTempPurchase?._id)
    }
  }, [postTempPurchase])

  useEffect(() => {
    console.log(tempPurchaseDetails?.length)
    console.log(tempPurchaseDetailsLoading)

    if (tempPurchaseDetails?.length === 0) {
      console.log(tempPurchaseDetails)
    } else {
      console.log(tempPurchaseDetails)
      getProducts()
    }
  }, [tempPurchaseDetails])

  const getProducts = async () => {
    setListpurchase([])
    console.log("caefihe")
    if (tempPurchaseDetails) {
      setPostTempPurchaseMainId(tempPurchaseDetails?._id)
      setClientName(tempPurchaseDetails?.clientName)
      const purDate = tempPurchaseDetails?.purchaseDate
      setPurchaseDate(purDate)
      // setPurchaseDate(new Date(purDate));
      console.log(tempPurchaseDetails?.address)
      setShopAddress(tempPurchaseDetails?.address)
      setShopPhoneNo(tempPurchaseDetails?.phoneNo)
      setGodownId(tempPurchaseDetails?.godownId)
      setShopId(tempPurchaseDetails?.shopId)
      setPurchaseCompany(tempPurchaseDetails?.purchaseCompany)
      console.log(tempPurchaseDetails.purchaseCompany)
      setComapnyDefaultValue({
        value: tempPurchaseDetails?.purchaseCompany,
        label: tempPurchaseDetails?.purchaseCompany,
      })
      setPurchaseReceiptNumber(tempPurchaseDetails?.purchaseReceiptNumber)
      setSelectedShopDefaultValue({ value: tempPurchaseDetails?.storeIn, label: tempPurchaseDetails?.storeIn })
      setPurchaseFor(tempPurchaseDetails?.shopNo)
      setPostTempPurchaseMainId(tempPurchaseDetails?._id)
      storeIn = tempPurchaseDetails?.storeIn
      setSelectedRadioOption(tempPurchaseDetails?.storeIn)
      const productLength = tempPurchaseDetails?.products?.length
      if (tempPurchaseDetails?.godownId) {
        setLocationsetid(tempPurchaseDetails?.godownId)
      } else {
        setLocationsetid(tempPurchaseDetails?.shopId)
      }
      const godownId = tempPurchaseDetails?.godownId
      const shopId = tempPurchaseDetails?.shopId
      console.log(productLength)
      console.log(productLength)
      for (let j = 0; j < productLength; j++) {
        console.log(tempPurchaseDetails?.products[j].Code)
        const Code = tempPurchaseDetails?.products[j].Code
        const Color = tempPurchaseDetails?.products[j].Color
        const Company = tempPurchaseDetails?.products[j].Company
        const Namee = tempPurchaseDetails?.products[j].Namee

        const PurchaseQuantity = Number.parseInt(tempPurchaseDetails?.products[j].PurchaseQuantity)

        const amount = Number.parseInt(tempPurchaseDetails?.products[j].amount)
        const expenseTotal = Number.parseInt(tempPurchaseDetails?.products[j].expenseTotal)
        const id = tempPurchaseDetails.products[j].id
        const locationsetid = tempPurchaseDetails.products[j].locationsetid
        const purchasePrice = Number.parseInt(tempPurchaseDetails.products[j].purchasePrice)
        const MRP = Number.parseInt(tempPurchaseDetails.products[j].MRP)
        const productColor = tempPurchaseDetails.products[j].productColor
        const purchaseProductTotalAmount = Number.parseInt(tempPurchaseDetails.products[j].purchaseProductTotalAmount)
        const purchaseQuantityPrice = Number.parseInt(tempPurchaseDetails.products[j].purchaseQuantityPrice)
        const invoicePrice = Number.parseInt(tempPurchaseDetails.products[j].invoicePrice)
        const purchaseProductPriceExcludeTax = Number.parseInt(
          tempPurchaseDetails.products[j].purchaseProductPriceExcludeTax,
        )
        const purchaseProductDiscount = Number.parseInt(tempPurchaseDetails.products[j].purchaseProductDiscount)
        const expense = Number.parseInt(tempPurchaseDetails.products[j].expense)
        const purchaseProductTax = Number.parseInt(tempPurchaseDetails.products[j].purchaseProductTax)
        const purchaseTaxPercentage = Number.parseInt(tempPurchaseDetails.products[j].purchaseProductTax)
        const purchaseTotalAmount = Number.parseInt(tempPurchaseDetails.products[j].purchaseTotalAmount)
        const discountValue = Number.parseInt(tempPurchaseDetails.products[j].discountValue)
        const purchaseDiscount = Number.parseInt(tempPurchaseDetails.products[j].discountValue)
        const purchaseTotalDiscount = Number.parseInt(tempPurchaseDetails.products[j].discountValue)
        const purchaseTotalTax = Number.parseInt(tempPurchaseDetails.products[j].purchaseTotalTax)
        const quantityidset = tempPurchaseDetails.products[j].quantityidset
        const salesmanSalePrice = tempPurchaseDetails.products[j].salesmanSalePrice
        const minimumSalePrice = tempPurchaseDetails.products[j].minimumSalePrice
        const newItems = {
          id,
          Namee,
          Code,
          PurchaseQuantity,
          productColor,
          godownId,
          shopId,
          amount,
          purchaseTotalDiscount,
          expenseTotal,
          purchasePrice,
          MRP,
          purchaseProductTotalAmount,
          purchaseQuantityPrice,
          purchaseTotalAmount,
          discountValue,
          invoicePrice,
          purchaseProductPriceExcludeTax,
          purchaseProductDiscount,
          purchaseDiscount,
          expense,
          purchaseProductTax,
          purchaseTaxPercentage,
          purchaseTotalTax,
          Color,
          Company,
          quantityidset,
          locationsetid,
          salesmanSalePrice,
          minimumSalePrice,
        }
        console.log(newItems)
        setListpurchase((prevlistpurchase) => [...prevlistpurchase, newItems])
      }
      dispatch({
        type: TEMP_PURCHASE_DETAILS_SUCCESS,
        payload: [],
      })
    }
  }

  const updateInvoiceNumber = (newInvoiceNumber) => {
    setInvoiceNumber(newInvoiceNumber)
    invoicenumberr = newInvoiceNumber
    invoiceNumberRef.current = newInvoiceNumber
  }

  ///////////==============================================================////////////////
  ////////////// Handle downloading and updation of quanity in database //////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   if (dataLoaded) {
  //     onBeforeGetContentResolve.current();
  //   }
  // }, [dataLoaded, onBeforeGetContentResolve]);

  useEffect(() => {
    const fetchPermission = async () => {
      const permission = await getPermissionForRoles("Print Purchase Invoice")
      console.log(permission)
      setPermissionForPrint(permission)
    }
    fetchPermission()
  }, [])

  useEffect(() => {
    if (createPurchaseApprovalSuccess) {
      swal
        .fire({
          icon: "success",
          title: t("Success"),
          text: "Purchase sent for approval successfully",
          customClass: {
            popup: "custom-swal-popup",
          },
        })
        .then(() => {
          // Clear all the states and variables
          setListpurchase([])
          setClientName("")
          setInvoiceNumber("")
          setSelectedRadioOption("")
          setPurchaseReceiptNumber("")
          setPurchaseCompany("")
          setPurchaseDate("")
          setTotal("")
          setPurchaseFor("")
          setComapnyDefaultValue("")
          setSelectedShopDefaultValue("")
        })
    }

    if (createPurchaseApprovalError) {
      swal.fire({
        icon: "error",
        title: t("Error"),
        text: createPurchaseApprovalError,
        customClass: {
          popup: "custom-swal-popup",
        },
      })
    }

    // Cleanup function that runs on unmount or when dependencies change
    return () => {
      dispatch(resetCreatePurchaseApproval())
    }
  }, [createPurchaseApprovalSuccess, createPurchaseApprovalError])

  const handleSaveData = async () => {
    try {
      setCheckCompleted(true)
      !JSON.parse(localStorage.getItem("isAdministrator")) && (shopNo = JSON.parse(localStorage.getItem("shopId")))

      let tempProductResultDelete = await getTemporaryPurchase()
      if (!JSON.parse(localStorage.getItem("isAdministrator"))) {
        tempProductResultDelete = tempProductResultDelete?.reduce((filteredProducts, product) => {
          if (product?.shopNo === JSON.parse(localStorage.getItem("shopId")) && product?.clientName === clientName) {
            filteredProducts.push(product)
          }
          return filteredProducts
        }, [])
      }

      setIsGenerated(true)
      const tempLocQuantityList = []
      const tempLocProductItemlist = []

      listpurchase.forEach((list) => {
        const purchaseProductTotalAmount = list?.purchaseProductTotalAmount
        const godownId = list?.godownId
        const colorId = list?.productColor
        const shopId = list?.shopId
        const invoicePrice = list?.invoicePrice
        const productExpenses = list?.expense
        const MRP = list?.MRP
        const amount = list?.amount
        const purchasePrice = list?.purchasePrice
        const productDiscount = list?.purchaseDiscount
        const purchaseExpenses = list?.purchaseExpenses
        const productTaxPercentage = list?.purchaseTaxPercentage
        const productQuantity = Number.parseInt(list?.PurchaseQuantity)
        const productId = list?.quantityidset
        const locationId = list?.locationsetid
        const salesmanSalePrice = list?.salesmanSalePrice
        const minimumSalePrice = list?.minimumSalePrice

        // Create the new items based on the filtered properties
        const newItems = {
          productQuantity,
          productId,
          colorId,
          locationId,
          godownId,
          shopId,
        }

        const newItems2 = {
          productId,
          purchaseProductTotalAmount,
          productExpenses,
          invoicePrice,
          MRP,
          purchasePrice,
          productDiscount,
          purchaseExpenses,
          productTaxPercentage,
          salesmanSalePrice,
          minimumSalePrice,
        }

        // Push to temporary arrays
        tempLocQuantityList.push(newItems)
        tempLocProductItemlist.push(newItems2)
      })

      const purchaseby = JSON.parse(localStorage.getItem("username"))

      // Validate all required fields are present
      if (
        clientName &&
        purchaseReceiptNumber &&
        purchaseCompany &&
        purchaseDate &&
        shopAddress &&
        shopPhoneNo &&
        shopNo &&
        purchaseby &&
        listpurchase?.length > 0 &&
        total
      ) {
        // Check if user has permission to print purchase invoice
        if (!permissionForPrint) {
          // Create purchase approval data object
          const purchaseApprovalData = {
            clientName,
            purchaseReceiptNumber,
            purchaseCompany,
            purchaseDate,
            address: shopAddress,
            phoneNo: shopPhoneNo,
            shopNo,
            storeIn,
            shopId: shopId || null,
            godownId: godownId || null,
            purchasedBy: purchaseby,
            products: listpurchase,
            total,
          }

          console.log(purchaseApprovalData);
          

          // Dispatch the action to create purchase approval
          dispatch(createPurchaseApproval(purchaseApprovalData))

          // Delete the temporary purchase if it exists
          if (postTempPurchaseMainId) {
            dispatch(deleteAllTempPurchase(postTempPurchaseMainId))
          }

          return {
            data: {
              success: "true",
              message: "Purchase sent for approval successfully",
            },
          }
        } else {
          // If user has permission, proceed with normal purchase flow
          const response = await addPurchase(
            clientName,
            purchaseReceiptNumber,
            purchaseCompany,
            purchaseDate,
            shopAddress,
            shopPhoneNo,
            shopNo,
            storeIn,
            purchaseby,
            listpurchase,
            total,
            tempLocQuantityList,
            tempLocProductItemlist,
            postTempPurchaseMainId,
          )

          if (response?.data?.success) {
            invoicenumberr = response?.data?.newPurchaseProduct?.id
            setInvoiceNumber(response?.data?.newPurchaseProduct?.id)
            updateInvoiceNumber(response?.data?.newPurchaseProduct?.id)

            return response
          } else {
            return response
          }
        }
      } else {
        swal.fire({
          icon: "warning",
          title: t("titleAlert"),
          text: t("something is missing in data"),
          customClass: {
            popup: "custom-swal-popup",
          },
        })

        variableForPrint = "unsuccess"
        setButtonClicked(false)
        return variableForPrint
      }
    } catch (error) {
      console.error("Error in handleSaveData:", error)
      variableForPrint = "unsuccess"
      setButtonClicked(false)
      return variableForPrint
    }
  }

  const handlePrint = async () => {
    // Validate form data
    const errors = []
    listpurchase.forEach((item, index) => {
      const missingFields = []

      // Check each field for missing values
      if (!item.Code) missingFields.push("Code")
      if (!item.Color) missingFields.push("Color")
      if (!item.Namee) missingFields.push("Namee")
      if (!item.Company) missingFields.push("Company")
      if (!item.productColor) missingFields.push("productColor")
      if (Number(item.PurchaseQuantity) == null || Number(item.PurchaseQuantity) < 1)
        missingFields.push("PurchaseQuantity")
      if (Number(item.purchaseQuantityPrice) == null || Number(item.purchaseQuantityPrice) < 0)
        missingFields.push("purchaseQuantityPrice")
      if (Number(item.purchasePrice) == null || Number(item.purchasePrice) < 0) missingFields.push("purchasePrice")
      if (Number(item.purchaseTotalTax) == null || Number(item.purchaseTotalTax) < 0)
        missingFields.push("purchaseTotalTax")
      if (Number(item.discountValue) == null || Number(item.discountValue) < 0) missingFields.push("discountValue")
      if (Number(item.purchaseProductTotalAmount) == null || Number(item.purchaseProductTotalAmount) < 0)
        missingFields.push("purchaseProductTotalAmount")
      if (Number(item.invoicePrice) == null || Number(item.invoicePrice) < 0) missingFields.push("invoicePrice")
      if (Number(item.purchaseTotalAmount) == null || Number(item.purchaseTotalAmount) < 0)
        missingFields.push("purchaseTotalAmount")
      if (!item.quantityidset) missingFields.push("quantityidset")
      if (!item.locationsetid) missingFields.push("locationsetid")
      if (Number(item.purchaseTotalDiscount) == null || Number(item.purchaseTotalDiscount) < 0)
        missingFields.push("purchaseTotalDiscount")
      if (Number(item.MRP) == null || Number(item.MRP) < 0) missingFields.push("MRP")

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
        .map((error) => `Item No ${error.index}: Missing fields - ${error.fields.join(", ")}`)
        .join("\n")

      swal.fire({
        icon: "error",
        title: t("titleAlert"),
        html: `<pre>${errorMessages}</pre>`,
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup",
        },
      })
      buttonRef?.current.cancel()
      return
    }

    setButtonClicked(true)
    setVariableForButtonLoader(true)

    const result = await handleSaveData()

    // Handle different result scenarios
    if (result === "unsuccess") {
      swal.fire({
        icon: "warning",
        title: t("titleAlert"),
        text: t("something is missing in data"),
        customClass: {
          popup: "custom-swal-popup",
        },
      })
      setVariableForButtonLoader(false)
    } else if (result.data.success === "true" && !permissionForPrint) {
      // This will be handled by the useEffect that watches createPurchaseApprovalSuccess
      setVariableForButtonLoader(false)
    } else if (result?.data?.success) {
      setVariableForButtonLoader(false)

      // Print the invoice
      printJS({
        printable: "invoice",
        type: "html",
        targetStyles: ["*"],
        font_size: "10pt",
        font_family: "Courier New",
        css: "../Components/Printer/thermalPrinter.css",
        scanStyles: false,
      })

      // Clear form after successful print
      setListpurchase([])
      setComapnyDefaultValue("")
      setSelectedShopDefaultValue({ value: "", label: "select.." })
      setClientName("")
      setInvoiceNumber("")
      setSelectedRadioOption("")
      setPurchaseReceiptNumber("")
      setPurchaseCompany("")
      setPurchaseDate("")
      setTotal("")
      setPurchaseFor("")
      setComapnyDefaultValue("")
      setSelectedShopDefaultValue("")
      invoicenumberr = ""
    } else {
      // Handle other error cases
      swal.fire({
        icon: "error",
        title: t("Error"),
        text: result?.data?.message || "An error occurred",
        customClass: {
          popup: "custom-swal-popup",
        },
      })
      setVariableForButtonLoader(false)
    }
  }

  const handlePrintDownload = async () => {
    try {
      // Validate form data
      const errors = []
      listpurchase.forEach((item, index) => {
        const missingFields = []

        // Check each field for missing values
        if (!item.Code) missingFields.push("Code")
        if (!item.Color) missingFields.push("Color")
        if (!item.Namee) missingFields.push("Namee")
        if (!item.Company) missingFields.push("Company")
        if (!item.productColor) missingFields.push("productColor")
        if (Number(item.PurchaseQuantity) == null || Number(item.PurchaseQuantity) < 1)
          missingFields.push("PurchaseQuantity")
        if (Number(item.purchaseQuantityPrice) == null || Number(item.purchaseQuantityPrice) < 0)
          missingFields.push("purchaseQuantityPrice")
        if (Number(item.purchasePrice) == null || Number(item.purchasePrice) < 0) missingFields.push("purchasePrice")
        if (Number(item.purchaseTotalTax) == null || Number(item.purchaseTotalTax) < 0)
          missingFields.push("purchaseTotalTax")
        if (Number(item.discountValue) == null || Number(item.discountValue) < 0) missingFields.push("discountValue")
        if (Number(item.purchaseProductTotalAmount) == null || Number(item.purchaseProductTotalAmount) < 0)
          missingFields.push("purchaseProductTotalAmount")
        if (Number(item.invoicePrice) == null || Number(item.invoicePrice) < 0) missingFields.push("invoicePrice")
        if (Number(item.purchaseTotalAmount) == null || Number(item.purchaseTotalAmount) < 0)
          missingFields.push("purchaseTotalAmount")
        if (!item.quantityidset) missingFields.push("quantityidset")
        if (!item.locationsetid) missingFields.push("locationsetid")
        if (Number(item.purchaseTotalDiscount) == null || Number(item.purchaseTotalDiscount) < 0)
          missingFields.push("purchaseTotalDiscount")
        if (Number(item.MRP) == null || Number(item.MRP) < 0) missingFields.push("MRP")

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
          .map((error) => `Item No ${error.index}: Missing fields - ${error.fields.join(", ")}`)
          .join("\n")

        swal.fire({
          icon: "error",
          title: t("titleAlert"),
          html: `<pre>${errorMessages}</pre>`,
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup",
          },
        })
        buttonRef?.current.cancel()
        return
      }

      setButtonClicked(true)
      setVariableForButtonLoader(true)

      const result = await handleSaveData()

      if (!result?.data?.success) {
        console.log(result?.data?.message)

        swal.fire({
          icon: "warning",
          title: t("titleAlert"),
          text: result?.data?.message,
          customClass: {
            popup: "custom-swal-popup",
          },
        })
        setButtonClicked(false)
        setVariableForButtonLoader(false)
        buttonRef?.current.cancel()
      } else if (result?.data?.success === "true" && !permissionForPrint) {
        // This will be handled by the useEffect that watches createPurchaseApprovalSuccess
        setButtonClicked(false)
        setVariableForButtonLoader(false)
        buttonRef?.current.cancel()
      }

      await new Promise((resolve) => setTimeout(resolve, 5000 + 1 * 1000))
      setVariableForButtonLoader(false)
    } catch (error) {
      console.error("Error in handlePrintDownload:", error)
      setVariableForButtonLoader(false)
      return Promise.reject(error)
    }
  }

  useEffect(() => {
    const handleClickBranchOutside = (event) => {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target)) {
        setIsStorageOpen(false)
      }
      console.log("clikced")
    }
    window.addEventListener("click", handleClickBranchOutside)
    return () => {
      window.removeEventListener("click", handleClickBranchOutside)
    }
  }, [])

  useEffect(() => {
    const handleClickCompanyOutside = (event) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setIsCompanyOpen(false)
      }
      console.log("clikced")
    }
    window.addEventListener("click", handleClickCompanyOutside)
    return () => {
      window.removeEventListener("click", handleClickCompanyOutside)
    }
  }, [])

  const storageToggleDropdown = () => {
    if (!isListHaveItem) return setIsStorageOpen(!isStorageOpen)
  }

  const companyToggleDropdown = () => {
    if (!isListHaveItem) return setIsCompanyOpen(!isCompanyOpen)
  }

  useEffect(() => {
    setPurchaseBy(JSON.parse(localStorage.getItem("username")))
  }, [])

  useEffect(() => {
    console.log(listpurchase)
    totalTaxAmount = listpurchase
      ?.reduce((sum, product) => {
        const taxAmount = Number.parseInt(product.purchaseTotalTax, 10)
        return isNaN(taxAmount) ? sum : sum + taxAmount
      }, 0)
      .toString()

    totalPrice = listpurchase
      ?.reduce((sum, product) => {
        const price = Number.parseInt(product.purchasePrice, 10)
        return isNaN(price) ? sum : sum + price
      }, 0)
      .toString()

    totalDiscount = listpurchase
      ?.reduce((sum, product) => {
        const disc = Number.parseInt(product.purchaseDiscount, 10)
        return isNaN(disc) ? sum : sum + disc
      }, 0)
      .toString()

    totalQuantity = listpurchase
      ?.reduce((sum, product) => {
        const quantity = Number.parseInt(product.PurchaseQuantity, 10)
        return isNaN(quantity) ? sum : sum + quantity
      }, 0)
      .toString()

    totalAmount = listpurchase
      ?.reduce((sum, product) => {
        const total = Number.parseInt(product.purchaseTotalAmount, 10)
        return isNaN(total) ? sum : sum + total
      }, 0)
      .toString()
  }, [listpurchase])

  useEffect(() => {
    console.log(company)
    if (company?.length > 0 && !loading && company !== "No Record Found") {
      setCompanyRecordList(
        company?.map((companyData) => ({
          value: companyData.companyName,
          label: companyData?.companyName,
        })),
      )
    }
  }, [company, loading])

  // useEffect(()=>{
  //     setStorageRecordList(combinedOptions?.map(storage =>({
  //       value: storage,
  //       label: storage
  //     })))

  // }, [combinedOptions])

  const loadStorageOption = (search, callBack) => {
    setTimeout(() => {
      const filterOptions = storageList?.filter((option) => option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  const loadCompanyOptions = (search, callBack) => {
    setTimeout(() => {
      const filterOptions = companyRecordList?.filter((option) =>
        option?.value.toLowerCase().includes(search.toLowerCase()),
      )
      callBack(filterOptions)
    }, 3000)
  }

  useEffect(() => {
    // setSelectedCompany(purchaseCompany)
  }, [purchaseCompany])

  const colorStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return { ...styles, color: data.color }
    },
  }

  const headerLabel = [
    { label: "", key: "shopAddress" },
    { label: "Phone No", key: "shopPhoneNo" },
  ]

  const thermalPrinterData = [
    { label: "Purchase From:", key: "clientName" },
    { label: "Invoice number:", key: "invoiceNumber" },
    { label: "Purchase Rcpt Number:", key: "purchaseReceiptNumber" },
    { label: "Invoice date:", key: "formattedDate" },
    { label: "Company:", key: "purchaseCompany" },
    { label: "Purchase Rcpt date:", key: "purchaseDate" },
    { label: "Generated By:", key: "generatedBy" },
  ]

  const columns = [
    { field: "Code", label: "Code" },
    { field: "Color", label: "Color" },
    { field: "purchasePrice", label: "Purchase Price" },
    { field: "MRP", label: "MRP" },
    { field: "PurchaseQuantity", label: "Qty" },
    { field: "purchaseQuantityPrice", label: "Total" },
    { field: "purchaseTotalTax", label: "Tax" },
    { field: "purchaseTotalDiscount", label: "Disc." },
    { field: "purchaseTotalAmount", label: "Due Amount" },
  ]
  const thermalPrinterFooter = [
    { label: "Total Price :", key: "totalPrice" },
    { label: "Total Discount :", key: "totalDiscount" },
    { label: "Total Quantity :", key: "totalQuantity" },
    { label: "Total Tax :", key: "totalTaxAmount" },
    { label: "Total Amount:", key: "totalAmount" },
  ]

  const invoiceData = {
    invoiceTitle: "Purchase Invoice",
    companyTitle: COMPANYHEADER,
    address: user?.user?.shopNo?.shopAddress,
    contact: user?.user?.shopNo?.phoneNo,
    customerTitle: "Name",
    customerTitleValue: `${clientName}`,
    customerPhoneTitle: "Purchase Receipt Number",
    customerPhoneValue: `${purchaseReceiptNumber}`,
    generatedBy: `${user?.user?.name}`,
    billingDetailsFirstTitle: "Invoice Number",
    billingDetailsSecondTitle: `Company`,
    billingDetailsThirdTitle: `Dated`,
    billingDetailsFirstValue: invoiceNumber,
    billingDetailsSecondValue: purchaseCompany,
    billingDetailsThirdValue: `${purchaseDate}`,
    columns,
    listData: listpurchase,
    totalFirstTitle: "Due Amount",
    totalFirstValue: total,
    terms: "Qureshi Electronics Corporation",
  }

  return (
    <>
      <MetaData title="QE ~~PurchaseProduct" />
      <div className={`Purchase ${colorTheme}`}>
        <div className="secondContainer">
          {purchaseProductPermission && (
            <>
              <div className="contentt-box">
                <div className="heading-container">
                  <h3>{t("purchaseProduct")}</h3>
                </div>
              </div>
              <div className="Purchase-Input-Section">
                <div className="formApp">
                  <div className="formRow">
                    <div className="inputSection">
                      <label>{t("purchaseFrom")}</label>
                      <input
                        label={"Enter Customer Name"}
                        className="purchaseInputField"
                        type="text"
                        placeholder={t("enterPurchaserName")}
                        // name="customerName"
                        autoComplete="off"
                        maxLength="40"
                        required
                        value={clientName}
                        disabled={isListHaveItem}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                    <div className="inputSection">
                      <label>{t("purchaseReceiptNumber")}</label>
                      <input
                        label={"Enter Customer Name"}
                        className="purchaseInputField"
                        type="text"
                        placeholder={t("purchaseReceiptNumber")}
                        autoComplete="off"
                        maxLength="40"
                        required
                        value={purchaseReceiptNumber}
                        // onKeyDown={handleKeyDown}
                        disabled={isListHaveItem}
                        onChange={(e) => setPurchaseReceiptNumber(e.target.value)}
                      />
                    </div>
                    <div className="inputSection">
                      <label> {t("selectStorage")}</label>
                      <AsyncSelect
                        loadOptions={storageList?.length > 0 && loadStorageOption}
                        defaultOptions={storageList}
                        onChange={handleSelectChange}
                        isDisabled={isListHaveItem}
                        defaultValue={selectedShopDefaultValue}
                        value={selectedShopDefaultValue}
                      />
                    </div>
                    <div className="inputSection">
                      <label>{t("company")}</label>
                      <AsyncSelect
                        loadOptions={companyRecordList?.length > 0 && loadCompanyOptions}
                        defaultOptions={companyRecordList}
                        onChange={handleCompanySelectChange}
                        isDisabled={isListHaveItem}
                        defaultValue={companyDefaultValue}
                        value={companyDefaultValue}
                      />
                    </div>
                    {permissionAddCompany && (
                      <>
                        <div style={{ marginTop: "30px", cursor: "pointer" }}>
                          <CgAdd
                            disabled={isListHaveItem}
                            onClick={() => {
                              navigate("/addcompany", { state: "/PurchaseRecipt" })
                            }}
                          />
                        </div>
                      </>
                    )}

                    <div className="inputSection">
                      <label> {t("purchaseDate")}</label>
                      <input
                        label={"Enter Customer Name"}
                        className="purchaseDatePicker"
                        type="date"
                        placeholder={t("choosePurchaseDate")}
                        // name="customerName"
                        autoComplete="off"
                        maxLength="40"
                        required
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        disabled={isListHaveItem}
                        max={new Date().toISOString().split("T")[0]}
                        dateFormat="dd/MM/yyyy"
                        ref={thirdDropdownRef}
                        tabIndex={0}
                        // onKeyDown={handleKeyDown}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="formAppSecondSection">
                {clientName && purchaseDate && purchaseCompany && purchaseReceiptNumber && selectedRadioOption ? (
                  <>
                    <div className="buttonAppRow">
                      <Button
                        className={`ui button button-add-product`}
                        onClick={() => {
                          navigate("/purchaseProductPage")
                        }}
                      >
                        {t("purchaseProduct")}&nbsp;
                        <ShoppingCartIcon />
                      </Button>
                      {isChooseOnPrint ? (
                        <>
                          {listpurchase && listpurchase?.length > 0 ? (
                            <div className="buttonAppRow">
                              {/* <Button
                                className={`button button-add-product`}
                                onClick={() => {
                                  navigate("/purchaseProductPage")
                                }}
                              >
                                {t("purchaseProduct")}&nbsp;
                                <ShoppingCartIcon />
                              </Button>       */}

                              
                              {selectedPrinter === "laser" ? (
                                <ReactToPrint
                                  trigger={() => (
                                    <button
                                      ref={buttonRef}
                                      disabled={buttonClicked}
                                      className={`ui button button-add-product`}
                                    >
                                      Generate Invoice &nbsp;&nbsp;
                                      <SaveAltIcon />
                                    </button>
                                  )}
                                  content={() => componentRef.current}
                                  onBeforeGetContent={handlePrintDownload}
                                  onAfterPrint={() => {
                                    setListpurchase([])
                                    setClientName("")
                                    setInvoiceNumber("")
                                    setSelectedRadioOption("")
                                    setPurchaseReceiptNumber("")
                                    setPurchaseCompany("")
                                    setPurchaseDate("")
                                    setTotal("")
                                    setPurchaseFor("")
                                    setComapnyDefaultValue("")
                                    setSelectedShopDefaultValue("")
                                  }}
                                />
                              ) : selectedPrinter === "thermal" ? (
                                <Button onClick={handlePrint} className="ui button button-add-product">
                                  Generate Invoice &nbsp;&nbsp;
                                  <SaveAltIcon />
                                </Button>
                              ) : null}
                              {(
                                <div className="printer-select-container">
                                  <select
                                    value={selectedPrinter}
                                    onChange={(e) => setSelectedPrinter(e.target.value)}
                                    className="printer-select"
                                  >
                                    <option value="">
                                      Select Printer
                                    </option>
                                    <option value="laser">Laser Printer</option>
                                    <option value="thermal">Thermal Printer</option>
                                  </select>
                                </div>
                              )}
                            </div>
                            
                          ) : (
                            <h1></h1>
                          )}
                        </>
                      ) : user?.user?.printerId?.printerType === "Laser" ? (
                        <>
                          <ReactToPrint
                            trigger={() =>
                              listpurchase && listpurchase?.length > 0 ? (
                                <button
                                  ref={buttonRef}
                                  disabled={buttonClicked}
                                  className={`ui button button-add-product`}
                                >
                                  Generate Invoice &nbsp;&nbsp;
                                  <SaveAltIcon />
                                </button>
                              ) : (
                                <h1></h1>
                              )
                            }
                            content={() => componentRef.current}
                            onBeforeGetContent={handlePrintDownload}
                            onAfterPrint={() => {
                              setListpurchase([])
                              setClientName("")
                              setInvoiceNumber("")
                              setSelectedRadioOption("")
                              setPurchaseReceiptNumber("")
                              setPurchaseCompany("")
                              setPurchaseDate("")
                              setTotal("")
                              setPurchaseFor("")
                              setComapnyDefaultValue("")
                              setSelectedShopDefaultValue("")
                            }}
                          />
                        </>
                      ) : (
                        <>
                          {listpurchase && listpurchase?.length > 0 ? (
                            <>
                              {/* <div> */}
                                <button onClick={handlePrint} className={`ui button button-add-product`}>
                                  Generate Invoice &nbsp;&nbsp;
                                  <SaveAltIcon />
                                </button>
                              {/* </div> */}
                            </>
                          ) : (
                            <h1></h1>
                          )}
                        </>
                      )}
                    </div>
                    {!variableForButtonLoader && !loadingApprovalData ? (
                      <div className="table-container">
                        <TableForm />
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
                <div className="print-only-container">
                  <div ref={componentRef} className="p-5 ">
                    <Invoice invoiceData={invoiceData} />
                  </div>
                </div>
              ) : (
                // </div>
                <div className="print-only-container">
                  <div id="invoice" ref={componentRef} className="p-5 ">
                    <ThermalPrinter
                      headerLabel={headerLabel}
                      headerData={{ shopAddress, shopPhoneNo }}
                      labelData={thermalPrinterData}
                      data={{
                        clientName,
                        invoiceNumber,
                        purchaseReceiptNumber,
                        formattedDate,
                        purchaseCompany,
                        purchaseDate,
                        generatedBy: purchaseBy,
                        // fbrInvoiceNumber,
                      }}
                      tableData={listpurchase}
                      tableColumns={columns}
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
                        Powered By Soft Wise Solutions +92 334 096 0444{" "}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App
