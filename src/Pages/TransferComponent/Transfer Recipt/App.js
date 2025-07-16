import { useContext, useEffect, useRef, useState } from "react"
import MetaData from "../../../MetaData"
import { useNavigate, useLocation } from "react-router-dom"
import SaveAltIcon from "@mui/icons-material/SaveAlt"
import AsyncSelect from "react-select/async"
import printJS from "print-js"
import { Button } from "semantic-ui-react"
import MoveUpIcon from "@mui/icons-material/MoveUp"
import TableForm from "./TableForm"
import ReactToPrint from "react-to-print"
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation"
import { Statte } from "./context/stateContext"
import swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import {
  updateAndPostProductInLocationUsingPurchase,
  updateProductLocationOnGodownId,
  updateProductLocationOnSale,
} from "../../../actions/productLocationAction"
import { useSelector, useDispatch } from "react-redux"
import { deleteTempTransferAll, getTemporaryTransfer } from "../../../actions/tempTransferAction"
import { getStorage } from "../../../actions/storageAction"
import { getProductLocationOnGodownAndProductId, postTransferProduct } from "../../../actions/transferAction"
import { refreshTokken } from "../../../actions/userAction"
import { TEMP_TRANSFER_DETIALS_SUCCESS } from "../../../constants/tempTransferConstants"
import { getProductLocationOnShopAndProductId } from "../../../actions/saleProductAction"
import { getShop } from "../../../actions/shopAction"
import PageLoader from "../../../Components/Loader/PageLoader"
import ThermalPrinter from "../../../Components/Printer/ThermalPrinter"
import Invoice from "../../../Components/Printer/MainPrinter"
import { COMPANYHEADER } from "../../../constants/companyNameContants"
let productAvalibility = null
const productLocationQuantityUpdateId = null
// let itemAdded="false"
// let selectedId = null;
const conditionMet = false
const tempProductResult = []
let variableForPrint
let selectedShop = []
let seletedGodown = []
const selectedGodown = []
let mergedArray = []
let transferToList = []
const locItemsArray = []
const transferFromm = ""
let isCalled = "false"
let tempTransferProductResult
function App() {
  /////////// ============================================= /////////////////////////////////
  ////////////////////// All useState variables ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const [locQuantityList, setLocQuantityList] = useState([])
  const [locMinusQuantityList, setLocMinusQuantityList] = useState([])
  const [colorTheme, setColorTheme] = useState("theme-white")
  const { tempTransfer, loadingTempTransfer } = useSelector((state) => state.tempTransfer)
  const dispatch = useDispatch()
  const { shop } = useSelector((state) => state.shop)
  const { storage } = useSelector((state) => state.storage)
  const { tempTransferDetails } = useSelector((state) => state.tempTransferDetails)
  const { postTempTransferProduct } = useSelector((state) => state.postTempTransferProduct)
  const { user } = useSelector((state) => state.user)
  const selectInputRef1 = useRef()
  const selectInputRef2 = useRef()
  const [StorageLocation, setStorageLocation] = useState([])
  const [transferLocationName, setTransferLocationName] = useState("")
  const [buttonClicked, setButtonClicked] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [variableForButtonLoader, setVariableForButtonLoader] = useState(false)
  const [transferFromOpen, setTransferFromOpen] = useState(false)
  const [transferToOpen, setTransferToOpen] = useState(false)
  const [transferProductPermission, setTransferProductPermission] = useState(false)
  // Add state for printer selection
  const [selectedPrinter, setSelectedPrinter] = useState("")
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const haveListItems = "false"
  const isGetProductCalled = "false"
  const prevListLength = useRef(0)
  const buttonRef = useRef(null)
  const navigate = useNavigate()
  const { postTransferRecord, postTransferRecordLoading, postTransferRecordError } = useSelector(
    (state) => state.postTransferRecord,
  )
  const {
    isListHaveItem,
    setIsListHaveItem,
    setTempTransferId,
    transferFrom,
    setTransferFrom,
    transferTo,
    setTransferTo,
    setDisableDropdowns,
    shopNo,
    setShopNo,
    invoiceNumber,
    setInvoiceNumber,
    invoiceDate,
    setInvoiceDate,
    componentRef,
    listTransfer,
    setListTransfer,
    setLocationsetid,
    selectedId,
    setItemsAdded,
    setItemsAvailable,
    tempDeleteId,
    selectedRadioOption,
    setSelectedRadioOption,
    transferShopId,
    setTransferShopId,
    setTransferGodownId,
    setTransferToShopId,
    setTransferToGodownId,
    shopAddress,
    setShopAddress,
    shopPhoneNo,
    setShopPhoneNo,
    tempTransferMainId,
    setTempTransferMainId,
    defaultTransferFrom,
    setDefaultTransferFrom,
    defaultTransferTo,
    setDefaultTransferTo,
  } = useContext(Statte)

  // Check if user has "Choose on Print" printer type
  const isChooseOnPrint = user?.user?.printerId?.printerType === "Choose on Print"

  useEffect(() => {
    setTransferProductPermission(false)
    getPermission()
  }, [])

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color")
    if (currentColorTheme) {
      setColorTheme(currentColorTheme)
    }
  }, [colorTheme])

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true"
      getToken()
    }
  }, [])

  useEffect(() => {
    const previousPath = location.state ? location.state : null
    const isPreviousPathMatching =
      previousPath === "/TranferProductPage" ||
      previousPath === "/DiscountModelTransfer" ||
      previousPath === "/tempTransferPendings"
    console.log("Is previous path matching:", isPreviousPathMatching)
    if (!isPreviousPathMatching) {
      console.log("ahfeli")
      setDefaultTransferFrom("")
      setDefaultTransferTo("")
      setTransferFrom("")
      setTransferTo("")
      setListTransfer([])
    }
  }, [location.state])

  useEffect(() => {
    selectedShop = JSON.parse(localStorage.getItem("shopId"))
    seletedGodown = JSON.parse(localStorage.getItem("godownId"))
    console.log(selectedShop)
    console.log(seletedGodown)
  }, [])

  useEffect(() => {
    const currentLang = localStorage.getItem("lang")
    i18n.changeLanguage(currentLang)
  }, [])

  useEffect(() => {
    variableForPrint = ""
    setVariableForButtonLoader(false)
    console.log(isGetProductCalled)
    if (isGetProductCalled === "false") {
    }
  }, [])

  useEffect(() => {
    setButtonClicked(false)
    const today = new Date()
    const yyyy = today.getFullYear()
    let mm = today.getMonth() + 1 // Months start at 0!
    let dd = today.getDate()

    if (dd < 10) dd = "0" + dd
    if (mm < 10) mm = "0" + mm

    setInvoiceDate(dd + "/" + mm + "/" + yyyy)
  }, [])
  useEffect(() => {
    if (listTransfer?.length > 0) {
      setDisableDropdowns(true)
      setItemsAdded(false)
    } else {
      setDisableDropdowns(false)
    }
  }, [listTransfer])

  useEffect(() => {
    console.log()
  }, [transferFromm])

  useEffect(() => {
    if (transferTo && StorageLocation) {
      const matchingItem = StorageLocation.find((item) => item.storageCode === transferTo)
      if (matchingItem) {
        productAvalibility = matchingItem._id
        // console.log(productAvalibility);
      }
    }
    if (StorageLocation) {
      const filteredElement = StorageLocation?.filter((data) => {
        return data.storageCode.includes(JSON.parse(localStorage.getItem("shopId")))
      })
      if (filteredElement?.length > 0) {
        if (!JSON.parse(localStorage.getItem("isAdministrator"))) {
          setTransferLocationName(filteredElement[0].storageAddress)
        }
      }
    }
  }, [transferTo, StorageLocation])

  useEffect(() => {
    if (!loadingTempTransfer) {
      console.log(tempTransfer)
      setItemsAvailable(false)
    }
  }, [loadingTempTransfer])

  useEffect(() => {
    if (shop && storage?.length > 0) {
      console.log(storage)
      console.log(shop)
      const renamedArray = storage?.map((item) => ({
        shopCode: item.storageCode,
        shopAddress: item.storageAddress,
        shopDescription: item.storageDescription,
      }))
      console.log(renamedArray)
      mergedArray = [...renamedArray, ...shop]

      console.log(mergedArray)
    } else {
      mergedArray = [...shop]
    }
  }, [storage, shop])

  useEffect(() => {
    console.log(mergedArray)
  }, [defaultTransferFrom])
  //////////////============================================================////////////////////
  ////////////////////////// Handle Temporary Transfer Table logic //////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    console.log(postTempTransferProduct)
    if (postTempTransferProduct) {
      setTempTransferMainId(postTempTransferProduct?._id)
    }
  }, [postTempTransferProduct])

  useEffect(() => {
    console.log(tempTransferDetails?.length)

    if (tempTransferDetails?.length === 0) {
      console.log(tempTransferDetails)
    } else {
      console.log(tempTransferDetails)
      handleTempLocationData()
    }
  }, [tempTransferDetails])

  useEffect(() => {
    if (isGenerated && locQuantityList?.length > 0 && locMinusQuantityList?.length > 0) {
      const locListQauntityLength = locQuantityList?.length
      console.log(locListQauntityLength)
      for (let i = 0; i < locListQauntityLength; i++) {
        dispatch(
          updateAndPostProductInLocationUsingPurchase(
            locQuantityList[i]?.quantityidset,
            locQuantityList[i]?.productColor,
            locQuantityList[i]?.transferToShopId,
            locQuantityList[i]?.transferToGodownId,
            locQuantityList[i]?.productQuantity,
          ),
        )
      }
    }
  }, [locQuantityList, locMinusQuantityList])

  useEffect(() => {
    if (isGenerated && locMinusQuantityList?.length > 0 && locQuantityList?.length > 0) {
      const locListQauntityLength = locMinusQuantityList?.length
      console.log(locListQauntityLength)
      for (let i = 0; i < locListQauntityLength; i++) {
        if (transferShopId) {
          dispatch(
            updateProductLocationOnSale(
              locMinusQuantityList[i]?.quantityidset,
              locMinusQuantityList[i]?.productColor,
              locMinusQuantityList[i]?.transferShopId,
              locMinusQuantityList[i]?.productQuantity,
            ),
          )
        } else {
          dispatch(
            updateProductLocationOnGodownId(
              locMinusQuantityList[i]?.quantityidset,
              locMinusQuantityList[i]?.productColor,
              locMinusQuantityList[i]?.transferGodownId,
              locMinusQuantityList[i]?.productQuantity,
            ),
          )
        }
      }
    }
  }, [locMinusQuantityList, locQuantityList])

  useEffect(() => {
    if (listTransfer?.length > 0) {
      setIsListHaveItem(true)
    } else {
      setIsListHaveItem(false)
    }
  }, [listTransfer])

  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles("Can Transfer Product")
      setTransferProductPermission(permissionForAdd)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  ////////////// =============================== //////////////
  ///////////////////// All Hooks ////////////////////////////
  ////////////////////////////////////////////////////////////

  ////////////// =============================== //////////////
  ///////////////////// All Radio Options ////////////////////////////
  ////////////////////////////////////////////////////////////
  const options = [
    { value: selectedShop, label: selectedShop },
    { value: seletedGodown, label: seletedGodown },
    // Add more options as needed
  ]

  const getToken = async () => {
    dispatch(getStorage())
    dispatch(getShop())
    const token = await refreshTokken()
    if (token.data === "Please login to acces this resource") {
      navigate("/login")
    }
    console.log(token)
  }

  ////////////==================================//////////
  /////////////////  shop selection ///////////////////////
  //////////==================================/////////
  console.log(selectedShop)
  const shopAsArray = [selectedShop]
  console.log(shopAsArray)
  const shopCodes = shopAsArray?.map((shop) => shop)
  const godownCodes = seletedGodown?.map((godown) => godown)
  const combinedOptions = [...shopCodes, ...godownCodes]
  console.log(combinedOptions)
  const storageList = combinedOptions?.map((storage) => ({
    value: storage,
    label: storage,
  }))

  const loadStorageOption = (search, callBack) => {
    setTimeout(() => {
      const filterOptions = storageList?.filter((option) => option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  const loadTransferToOptions = (search, callBack) => {
    setTimeout(() => {
      const filterOptions = storageList?.filter((option) => option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  ////////////==================================//////////
  ///////////////// New Logic ///////////////////////
  //////////==================================/////////

  const handleSelectChange = (value) => {
    setDefaultTransferTo([])
    console.log(mergedArray)

    transferToList = mergedArray
      ?.filter((element) => element.shopCode !== value?.value)
      .map((storage) => ({
        value: storage.shopCode,
        label: storage.shopCode,
        addres: storage.shopAddress,
        description: storage.shopDescription,
      }))
    setDefaultTransferFrom(value)
    setTransferTo("")
    setTempTransferId(value.value)
    setSelectedRadioOption(value.value)
    setTransferFrom(value.value)
    if (value?.value?.startsWith("G_")) {
      storage?.map((store) => {
        if (store?.storageCode === value?.value) {
          console.log(store._id)
          setLocationsetid(store._id)
          setTransferGodownId(store._id)
          setShopAddress(store?.shopId?.shopAddress)
          setShopPhoneNo(store?.shopId?.phoneNo)
          setTransferShopId(null)
        }
      })
      console.log("cellfie")
    } else {
      shop?.map((shopp) => {
        if (shopp?.shopCode === value?.value) {
          console.log(shopp?._id)
          setShopAddress(shopp?.shopAddress)
          setShopPhoneNo(shopp?.phoneNo)
          setTransferShopId(shopp?._id)
          setLocationsetid(shopp?._id)
          setTransferGodownId(null)
        }
      })
    }
    // storeIn = value.value;
  }

  const handleTransferToChange = (value) => {
    setDefaultTransferTo(value)
    setTransferTo(value.value)

    if (value?.value.startsWith("G_")) {
      storage?.map((store) => {
        if (store?.storageCode === value?.value) {
          console.log(store._id)
          setTransferToGodownId(store._id)
          setTransferToShopId(null)
          setTransferToOpen(!transferToOpen)
        }
      })
      console.log("cellfie")
    } else {
      shop?.map((shopp) => {
        if (shopp?.shopCode === value?.value) {
          console.log(shopp?._id)
          setTransferToShopId(shopp?._id)
          setTransferToGodownId(null)
          setTransferToOpen(!transferToOpen)
        }
      })
    }
  }

  const handleTempLocationData = async () => {
    setTransferFrom("")
    setTransferTo("")
    setListTransfer([])
    for (let i = 0; i < tempTransferDetails?.products?.length; i++) {
      console.log(tempTransferDetails?.products[i].transferGodownId)
      console.log(tempTransferDetails?.products[i]._id)
      if (tempTransferDetails?.products[i]?.transferGodownId) {
        const resp = await getProductLocationOnGodownAndProductId(
          tempTransferDetails?.products[i].quantityidset,
          tempTransferDetails?.products[i].productColor,
          tempTransferDetails?.products[i].transferGodownId,
        )
        const godownId = resp?.godownAvalibility
        const productId = resp?.product
        const productColor = resp?.colorId
        const shopId = null
        const quantity = resp?.productQuantity
        const locItems = {
          godownId,
          productColor,
          productId,
          shopId,
          quantity,
        }
        locItemsArray.push(locItems)
      } else {
        if (tempTransferDetails?.products[i].transferShopId) {
          const resp = await getProductLocationOnShopAndProductId(
            tempTransferDetails?.products[i].quantityidset,
            tempTransferDetails?.products[i].productColor,
            tempTransferDetails?.products[i].transferShopId,
          )
          console.log(resp)
          const shopId = resp?.shopAvalibility
          const productId = resp?.product
          console.log(resp?.colorId)
          const productColor = resp?.colorId
          const godownId = null
          const quantity = resp?.productQuantity
          const locItems = {
            shopId,
            productColor,
            productId,
            godownId,
            quantity,
          }
          locItemsArray.push(locItems)
        }
      }
    }
    handleTransfer()
  }

  const handleTransfer = async () => {
    console.log(locItemsArray)
    console.log(tempTransferDetails)
    let originalLength
    if (tempTransferDetails === "No Temporary Purchase Record Found By Id") {
    } else {
      originalLength = tempTransferDetails?.products?.length
      tempTransferDetails.products = tempTransferDetails?.products?.filter((tempSale) => {
        return !locItemsArray.some((locItems) => {
          if (locItems?.godownId) {
            // return !locItemsArray.some(locItems => {
            console.log("godhie")
            return (
              tempSale.quantityidset === locItems.productId &&
              tempSale.transferGodownId === locItems.godownId &&
              tempSale.productColor === locItems.productColor &&
              Number.parseInt(tempSale.PurchaseQuantity) > locItems.quantity
            )
            // });
          } else if (locItems?.shopId) {
            // return !locItemsArray.some(locItems => {
            console.log("afje")
            return (
              tempSale.quantityidset === locItems.productId &&
              tempSale.transferShopId === locItems.shopId &&
              tempSale.productColor === locItems.productColor &&
              Number.parseInt(tempSale.PurchaseQuantity) > locItems.quantity
            )
            // });
          }
          return false
        })
      })
    }

    console.log(tempTransferDetails)
    const newLength = tempTransferDetails?.products?.length
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

    if (tempTransferDetails) {
      setShopNo(tempTransferDetails.shopNo)
      setTempTransferMainId(tempTransferDetails?._id)
      console.log(tempTransferDetails.transferFrom)
      const transferFrom = {
        label: tempTransferDetails.transferFrom,
        value: tempTransferDetails.transferFrom,
      }
      setDefaultTransferFrom(transferFrom)
      setTransferFrom(tempTransferDetails.transferFrom)
      const transferTo = {
        label: tempTransferDetails.transferTo,
        value: tempTransferDetails.transferTo,
      }
      setDefaultTransferTo(transferTo)
      transferToList = mergedArray
        ?.filter((element) => element.shopCode !== tempTransferDetails.transferFrom)
        .map((storage) => ({
          value: storage.shopCode,
          label: storage.shopCode,
          addres: storage.shopAddress,
          description: storage.shopDescription,
        }))
      setTransferTo(tempTransferDetails.transferTo)
      setShopAddress(tempTransferDetails.address)
      setShopPhoneNo(tempTransferDetails.phoneNo)
      setSelectedRadioOption(tempTransferDetails.transferFrom)
      const productLength = tempTransferDetails.products?.length
      for (let j = 0; j < productLength; j++) {
        setTransferShopId(tempTransferDetails.products[j].transferShopId)

        setTransferGodownId(tempTransferDetails.products[j].transferGodownId)
        setLocationsetid(tempTransferDetails.products[j].locationsetid)
        const Code = tempTransferDetails.products[j].Code
        const Color = tempTransferDetails.products[j].Color
        const Company = tempTransferDetails.products[j].Company
        const Namee = tempTransferDetails.products[j].Namee
        const PurchaseQuantity = Number.parseInt(tempTransferDetails.products[j].PurchaseQuantity)
        const id = tempTransferDetails.products[j].id
        const quantityidset = tempTransferDetails.products[j].quantityidset
        const locationsetid = tempTransferDetails.products[j].locationsetid
        const productColor = tempTransferDetails.products[j].productColor
        const transferToShopId = tempTransferDetails.products[j].transferToShopId
        const transferToGodownId = tempTransferDetails.products[j].transferToGodownId
        const transferShopId = tempTransferDetails.products[j].transferShopId
        const transferGodownId = tempTransferDetails.products[j].transferGodownId

        const newItems = {
          id,
          Namee,
          Code,
          PurchaseQuantity,
          Color,
          Company,
          quantityidset,
          locationsetid,
          productColor,
          transferToShopId,
          transferToGodownId,
          transferShopId,
          transferGodownId,
        }
        setListTransfer((prevList) => [...prevList, newItems])
        setIsListHaveItem(true)
        console.log(Code)
      }
      dispatch({
        type: TEMP_TRANSFER_DETIALS_SUCCESS,
        payload: [],
      })
    }
  }

  ////////////// =============================== //////////////
  ///////////////////// handle downloading and updating quanitity in the database  ////////////////////////////
  ////////////////////////////////////////////////////////////

  const handlePrint = async () => {
    console.log("hfeijidfe")
    setButtonClicked(true)
    setVariableForButtonLoader(true)
    const result = await handleSaveData()

    await new Promise((resolve) => setTimeout(resolve, 3000 + 1 * 1000))
    setVariableForButtonLoader(false)
    console.log(result)
    console.log(result.postResponse)
    // buttonRef?.current.cancel()
    if (result.res === "unsuccess" && !result.response?.success) {
      swal.fire({
        icon: "warning",
        title: t("titleAlert"),
        text: result.postResponse,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      })
      // buttonRef?.current.cancel()
    } else if (result?.res === "Unsuccessful" && result?.response.Response) {
      swal.fire({
        icon: "warning",
        title: t("titleAlert"),
        text: result.response.message,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      })
      // buttonRef?.current.cancel()
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

    setListTransfer([])
    setLocQuantityList([])
    setIsGenerated(false)
    setLocMinusQuantityList([])
    setTransferTo("")
    setTransferFrom("")
    setInvoiceNumber("")
    setDefaultTransferFrom("")
    setDefaultTransferTo("")
    setDisableDropdowns(false)
    setVariableForButtonLoader(false)
    // setFbrInvoiceNumber("");
  }

  const handlePrintDownload = async () => {
    try {
      setButtonClicked(true)
      setVariableForButtonLoader(true)
      const result = await handleSaveData()
      console.log(result)
      await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 1000))
      if (result.res === "unsuccess" && !result.response?.success) {
        swal.fire({
          icon: "warning",
          title: t("titleAlert"),
          text: result.response.message,
          showConfirmButton: true,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        })
        buttonRef.current.cancel()
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  ////////////// =============================== //////////////
  ///////////////////// handle saving data in the database of transfer invoice table  ////////////////////////////
  ////////////////////////////////////////////////////////////
  const handleSaveData = async () => {
    // let tempTransferProductResult = await GetTempTransfer();
    tempTransferProductResult = await getTemporaryTransfer()
    console.log(tempTransferProductResult)

    const roleName = JSON.parse(localStorage.getItem("roles"))
    console.log(roleName)
    if (!JSON.parse(localStorage.getItem("isAdministrator"))) {
      tempTransferProductResult = tempTransferProductResult?.reduce((filteredProducts, product) => {
        if (product?.transferFrom === selectedRadioOption && product?.transferTo === transferTo) {
          filteredProducts.push(product)
        }
        return filteredProducts
      }, [])
    }
    console.log(tempDeleteId)

    try {
      const outgoingQuantityList = []
      const incommingQuantityList = []
      listTransfer.map((temp) => {
        const productQuantity = Number.parseInt(temp?.PurchaseQuantity)
        const productId = temp?.quantityidset
        const colorId = temp?.productColor
        const shopId = temp?.transferToShopId
        const godownId = temp?.transferToGodownId
        const newItems = {
          productQuantity,
          productId,
          colorId,
          godownId,
          shopId,
        }

        incommingQuantityList.push(newItems)
      })

      listTransfer.map((temp) => {
        const prodQuantity = Number.parseInt(temp?.PurchaseQuantity)
        const productQuantity = -prodQuantity
        const productId = temp?.quantityidset
        const colorId = temp?.productColor
        const shopId = temp?.transferShopId
        const godownId = temp?.transferGodownId
        const newItems = {
          productQuantity,
          productId,
          colorId,
          godownId,
          shopId,
        }
        outgoingQuantityList.push(newItems)
      })
      const transferedBy = user?.user?.name
      const shop = JSON.parse(localStorage.getItem("shopId"))
      if (
        shopNo ||
        transferFrom ||
        transferTo ||
        transferedBy ||
        shopAddress ||
        shopPhoneNo ||
        listTransfer?.length > 0
      ) {
        const response = await postTransferProduct(
          shop,
          transferFrom,
          transferTo,
          transferedBy,
          shopAddress,
          shopPhoneNo,
          listTransfer,
          incommingQuantityList,
          outgoingQuantityList,
        )
        console.log(response)
        if (response.success) {
          setIsGenerated(true)
          dispatch(deleteTempTransferAll(tempTransferMainId))
          setInvoiceNumber(response?.newTranferProduct?.id)
          // listTransfer.map((temp) => {
          //   let productQuantity = parseInt(temp?.PurchaseQuantity);
          //   let quantityidset = temp?.quantityidset;
          //   let locationsetid = selectedId;
          //   let productColor = temp?.productColor;
          //   let transferToShopId = temp?.transferToShopId;
          //   let transferToGodownId = temp?.transferToGodownId;
          //   const newItems = {
          //     productQuantity,
          //     productColor,
          //     quantityidset,
          //     transferToShopId,
          //     transferToGodownId,
          //   };
          //   setLocQuantityList((prevList) => [...prevList, newItems]);
          // });

          // listTransfer.map((temp) => {
          //   let prodQuantity = parseInt(temp?.PurchaseQuantity);
          //   let productQuantity = -prodQuantity;
          //   let quantityidset = temp?.quantityidset;
          //   let locationsetid = selectedId;
          //   let productColor = temp?.productColor;
          //   let transferShopId = temp?.transferShopId;
          //   let transferGodownId = temp?.transferGodownId;
          //   const newItems = {
          //     productQuantity,
          //     productColor,
          //     quantityidset,
          //     transferShopId,
          //     transferGodownId,
          //   };
          //   setLocMinusQuantityList((prevList) => [...prevList, newItems]);
          // });
          const res = "success"
          return { res, response }
        } else {
          const res = "unsuccess"
          return { res, response }
        }
      }
    } catch (error) {
      console.log("heelo3")
      variableForPrint = "unsuccess"
      return variableForPrint
      // console.error("Error posting data:", error);
    } finally {
      // Set the focus out of the button
      buttonRef?.current?.blur()
    }
  }

  const transferFromToggleDropdown = () => {
    if (listTransfer?.length < 1) return setTransferFromOpen(!transferFromOpen)
  }
  const transferToToggleDropdown = () => {
    if (listTransfer?.length < 1) return setTransferToOpen(!transferToOpen)
  }

  const headerLabel = [
    { label: "", key: "shopAddress" },
    { label: "Phone No", key: "shopPhoneNo" },
  ]

  const thermalPrinterData = [
    { label: "Transfer From:", key: "selectedRadioOption" },
    { label: "Transfer To:", key: "transferTo" },
    { label: "Invoice Number:", key: "invoiceNumber" },
    { label: "Invoice date:", key: "invoiceDate" },
    { label: "Generated By:", key: "generatedBy" },
  ]

  const columns = [
    { field: "Code", label: "Code" },
    { field: "Namee", label: "Name" },
    { field: "Color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "PurchaseQuantity", label: "Qty" },
  ]

  const invoiceData = {
    invoiceTitle: "Transfer Invoice",
    companyTitle: COMPANYHEADER,
    address: user?.user?.shopNo?.shopAddress,
    contact: user?.user?.shopNo?.phoneNo,

    customerTitle: "Transfer From",
    customerTitleValue: `${selectedRadioOption}`,
    customerPhoneTitle: "Transfer To",
    customerPhoneValue: `${transferTo}`,
    generatedBy: `${user?.user?.name}`,

    billingDetailsFirstTitle: `Invoice Number`,
    billingDetailsSecondTitle: `Dated`,
    billingDetailsFirstValue: invoiceNumber,
    billingDetailsSecondValue: invoiceDate,

    columns,
    listData: listTransfer,

    // FBRInvoiceNumber: fbrInvoiceNumber,
    // totalFirstTitle: "Total Tax Charged",
    // totalSecondTitle: "Total Sale Value",
    // totalThirdTitle: "Total Discount",
    // totalFourthTitle: "Due Amount",
    // totalFirstValue: GrandTotalTax,
    // totalSecondValue: GrandTotalExludeTex,
    // totalThirdValue: GrandDiscount,
    // totalFourthValue: total,
    // terms: 'Qureshi Electronics Corporation',
  }

  return (
    <>
      <MetaData title="QE ~~TransferProduct" />
      <div className={`Transfer ${colorTheme}`}>
        <div className="secondContainer">
          {transferProductPermission && (
            <>
              {" "}
              <div className="contentt-box">
                <div className="heading-container">
                  <h3>{t("transferProduct")}</h3>
                </div>{" "}
              </div>
              <div className="Transfer-Input-Section">
                <div className="formApp">
                  <div className="formRow">
                    <div className="inputSection">
                      <label> {t("transferFrom")}</label>
                      <AsyncSelect
                        ref={selectInputRef1}
                        loadOptions={storageList?.length > 0 && loadStorageOption}
                        defaultOptions={storageList}
                        onChange={handleSelectChange}
                        isDisabled={isListHaveItem}
                        defaultValue={defaultTransferFrom}
                        value={defaultTransferFrom}
                      />
                    </div>

                    <div className="inputSection">
                      <label> {t("transferTo")}</label>
                      <AsyncSelect
                        ref={selectInputRef2}
                        loadOptions={transferToList?.length > 0 && loadTransferToOptions}
                        defaultOptions={transferToList}
                        onChange={handleTransferToChange}
                        isDisabled={isListHaveItem}
                        defaultValue={defaultTransferTo}
                        value={defaultTransferTo}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="formAppSecondSection">
                {transferTo && selectedRadioOption ? (
                  <>
                    <div className="buttonAppRow">
                      <Button
                        className={`ui button button-add-product`}
                        onClick={() => {
                          navigate("/TranferProductPage")
                        }}
                      >
                        {t("transferProduct")}&nbsp;&nbsp;
                        <MoveUpIcon />
                      </Button>

                      {isChooseOnPrint ? (
                        // <div className="action-container">
                        <>
                          {selectedPrinter === "laser" && (
                            <ReactToPrint
                              trigger={() =>
                                listTransfer && listTransfer?.length > 0 ? (
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
                                setListTransfer([])
                                setLocQuantityList([])
                                setIsGenerated(false)
                                setLocMinusQuantityList([])
                                setTransferTo("")
                                setTransferFrom("")
                                setInvoiceNumber("")
                                setDisableDropdowns(false)
                                setDefaultTransferFrom("")
                                setDefaultTransferTo("")
                                setVariableForButtonLoader(false)
                              }}
                            />
                          )}
                          {selectedPrinter === "thermal" && (
                            <>
                              {listTransfer && listTransfer?.length > 0 ? (
                                <Button className={`ui button button-add-product`} onClick={handlePrint}>
                                  Generate Invoice&nbsp;&nbsp;
                                  <SaveAltIcon />
                                </Button>
                              ) : (
                                <h1></h1>
                              )}
                            </>
                          )}
                          <div className="printer-select-container">
                            {listTransfer && listTransfer?.length > 0 && (
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
                            )}
                          </div>
                        </>
                        // </div>
                      ) : user?.user?.printerId?.printerType === "Laser" ? (
                        <>
                          <ReactToPrint
                            trigger={() =>
                              listTransfer && listTransfer?.length > 0 ? (
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
                              setListTransfer([])
                              setLocQuantityList([])
                              setIsGenerated(false)
                              setLocMinusQuantityList([])
                              setTransferTo("")
                              setTransferFrom("")
                              setInvoiceNumber("")
                              setDisableDropdowns(false)
                              setDefaultTransferFrom("")
                              setDefaultTransferTo("")
                              setVariableForButtonLoader(false)
                            }}
                          />
                        </>
                      ) : (
                        <>
                          {listTransfer && listTransfer?.length > 0 ? (
                            <Button className={`ui button button-add-product`} onClick={handlePrint}>
                              Generate Invoice&nbsp;&nbsp;
                              <SaveAltIcon />
                            </Button>
                          ) : (
                            <h1></h1>
                          )}
                        </>
                      )}
                    </div>
                    {!variableForButtonLoader ? (
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
                  <div ref={componentRef} className="p-5">
                    <Invoice invoiceData={invoiceData} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="print-only-container">
                    <div id="invoice" ref={componentRef} className="invoice">
                      <ThermalPrinter
                        headerLabel={headerLabel}
                        headerData={{ shopAddress, shopPhoneNo }}
                        labelData={thermalPrinterData}
                        data={{
                          selectedRadioOption,
                          transferTo,
                          invoiceNumber,
                          invoiceDate,
                          generatedBy: user?.user?.name,
                        }}
                        tableData={listTransfer}
                        tableColumns={columns}
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
                // <div className="print-only-container">
                //   <div ref={componentRef} className="p-5">
                //     <Header />
                //     <Dates />
                //     <Table />
                //     <div style={{ paddingTop: "10px" }}>
                //         <p
                //           style={{
                //             display: "flex",
                //             justifyContent: "center",
                //             fontSize: "12px",
                //             fontWeight: "bold",
                //           }}
                //         >
                //           Powered By Soft Wise Solutions +92 334 096 0444{" "}
                //         </p>
                //       </div>
                //   </div>
                // </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App