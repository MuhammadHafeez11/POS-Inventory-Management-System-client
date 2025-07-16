"use client"

import { useContext, useEffect, useRef, useState } from "react"
import ReactToPrint from "react-to-print"
import MetaData from "../../../MetaData"
import { useTranslation } from "react-i18next"
import printJS from "print-js"
import Inventory2Icon from "@mui/icons-material/Inventory2"
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation"
import { useDispatch, useSelector } from "react-redux"
import SaveAltIcon from "@mui/icons-material/SaveAlt"
import { Button } from "semantic-ui-react"
import { useLocation, useNavigate } from "react-router-dom"
import { getSaleOnInvoiceNo, getSaleRecordOnShopCode } from "../../../actions/saleProductAction"
import AsyncSelect from "react-select/async"
import swal from "sweetalert2"
import TableForm from "./TableForm"
import { ReturnState } from "../context/ContextReturn"
import { postReturnProducts, postWithoutFBRReturn } from "../../../actions/returnProductAction"
import ThermalPrinter from "../../../Components/Printer/ThermalPrinter"
import MainInvoice from "../../../Components/Printer/MainPrinter"
import { COMPANYHEADER, QURESHI_ELECTRONICS } from "../../../constants/companyNameContants"

function App() {
  const location = useLocation()
  const [saleProductPermission, setSaleProductPermission] = useState(false)
  const [saleRecordList, setSaleRecordList] = useState()
  const buttonRef = useRef(null)
  const componentRef = useRef()
  const { t, i18n } = useTranslation()
  const [colorTheme, setColorTheme] = useState("theme-white")
  const { user } = useSelector((state) => state.user)
  const { saleRecord, saleRecordLoading } = useSelector((state) => state.saleRecord)
  const { saleRecordOnInvoiceNo, saleRecordOnInvoiceNoLoading, saleRecordOnInvoiceNoError } = useSelector(
    (state) => state.saleRecordOnInvoiceNo,
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // Add state for printer selection
  const [selectedPrinter, setSelectedPrinter] = useState("")
  // Check if user has "Choose on Print" printer type
  const isChooseOnPrint = user?.user?.printerId?.printerType === "Choose on Print"
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)

  const {
    products,
    setProducts,
    saleId,
    setSaleId,
    invoiceNoDefault,
    setInvoiceNoDefault,
    totalQuantity,
    setTotalQuantity,
    total,
    TotalSaleValue,
    TotalTaxCharged,
    customerName,
    customerNumber,
    address,
    phoneNo,
    grandPriceTotal,
    setGrandPriceTotal,
    totalSaleValue,
    setTotalSaleValue,
    totalTaxCharged,
    setTotalTaxCharged,
    totalAmount,
    invoiceNo,
    setInvoiceNo,
    totalDiscount,
    setTotalDiscount,
    saleInvoiceNo,
    fbrInvoiceNumber,
    setFbrInvoiceNumber,
    fbrTotalReturnAmount,
    fbrTotalBillAmount,
  } = useContext(ReturnState)
  const [showPDF, setShowPDF] = useState(false)
  const linkRef = useRef(null)

  useEffect(() => {
    // Automatically trigger the download once the link is available
    if (linkRef.current) {
      linkRef.current.click()
    }
  }, [])

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color")
    if (currentColorTheme) {
      setColorTheme(currentColorTheme)
    }
  }, [colorTheme])

  useEffect(() => {
    const previousPath = location.state ? location.state : null
    const isPreviousPathMatching = previousPath === "/returnProductpage"
    console.log("Is previous path matching:", isPreviousPathMatching)
    if (!isPreviousPathMatching) {
      setProducts([])
      setInvoiceNoDefault("")
    }
  }, [location.state])

  useEffect(() => {
    setSaleProductPermission(false)
    getPermission()
  }, [])

  useEffect(() => {
    dispatch(getSaleRecordOnShopCode(user?.user?.shopNo?.shopCode))
  }, [user])

  useEffect(() => {
    if (saleRecord?.length > 0 && !saleRecordLoading) {
      setSaleRecordList(
        saleRecord?.map((sale) => ({
          value: sale?.id,
          label: sale.id,
        })),
      )
    }
  }, [saleRecord, saleRecordLoading])

  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles("Can Sale Product")
      setSaleProductPermission(permissionForAdd)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const loadSaleData = (search, callBack) => {
    setTimeout(() => {
      const filterOptions = saleRecordList?.filter((option) =>
        option?.value.toLowerCase().includes(search.toLowerCase()),
      )
      callBack(filterOptions)
    }, 3000)
  }

  const handleSaleIdSelect = (value) => {
    console.log(value.value)
    setSaleId(value.value)
    setInvoiceNoDefault(value)
    // setSelectedCompany(value.value)
    dispatch(getSaleOnInvoiceNo(value.value))
  }

  const handlePrintDownload = async () => {
    if (isGeneratingInvoice) return // Prevent multiple clicks

    setIsGeneratingInvoice(true)
    try {
      const result = await handleSaveData()

      setInvoiceNo(result?.newSalesProduct?.id)
      setFbrInvoiceNumber(result?.newSalesProduct?.invoiceNumber)

      await new Promise((resolve) => setTimeout(resolve, 3000 + 1 * 1000))

      if (!result) {
        swal.fire({
          icon: "warning",
          title: t("titleAlert"),
          text: `Something went wrong`,
          customClass: {
            popup: "custom-swal-popup",
          },
        })
        return
      }

      // The actual printing will be handled by ReactToPrint
      return true
    } catch (error) {
      swal.fire({
        icon: "error",
        title: t("titleAlert"),
        text: `Error generating invoice`,
        customClass: {
          popup: "custom-swal-popup",
        },
      })
      return Promise.reject(error)
    } finally {
      setIsGeneratingInvoice(false)
    }
  }

  const handlePrint = async () => {
    if (isGeneratingInvoice) return // Prevent multiple clicks

    setIsGeneratingInvoice(true)
    try {
      const result = await handleSaveData()

      setInvoiceNo(result?.newSalesProduct?.id)
      setFbrInvoiceNumber(result?.newSalesProduct?.invoiceNumber)
      await new Promise((resolve) => setTimeout(resolve, 3000 + 1 * 1000))
      console.log(result)

      if (!result) {
        swal.fire({
          icon: "warning",
          title: t("titleAlert"),
          text: `Something went wrong`,
          customClass: {
            popup: "custom-swal-popup",
          },
        })
        return
      }

      if (result?.success) {
        printJS({
          printable: "invoice",
          type: "html",
          targetStyles: ["*"],
          font_size: "10pt",
          font_family: "Courier New",
          scanStyles: false,
        })
        setShowPDF(true)
        setProducts([])
        setSaleId("")
        setInvoiceNoDefault("")
      }
    } catch (error) {
      swal.fire({
        icon: "error",
        title: t("titleAlert"),
        text: `Error generating invoice`,
        customClass: {
          popup: "custom-swal-popup",
        },
      })
    } finally {
      setIsGeneratingInvoice(false)
    }
  }

  const handleSaveData = async () => {
    const returnBy = user?.user?.name
    console.log(saleRecordOnInvoiceNo)
    console.log(products)
    if (QURESHI_ELECTRONICS === "QURESHI_ELECTRONICS_WITH_FBR") {
      const response = await postReturnProducts(
        customerName,
        customerNumber,
        address,
        phoneNo,
        total,
        returnBy,
        saleInvoiceNo,
        totalQuantity,
        totalDiscount,
        totalSaleValue,
        totalTaxCharged,
        products,
        user?.user?.shopNo?.shopCode,
        fbrTotalReturnAmount,
        fbrTotalBillAmount,
      )
      console.log(response)

      return response
    } else {
      const response = await postWithoutFBRReturn(
        customerName,
        customerNumber,
        address,
        phoneNo,
        total,
        returnBy,
        saleInvoiceNo,
        totalQuantity,
        totalDiscount,
        totalSaleValue,
        totalTaxCharged,
        products,
        user?.user?.shopNo?.shopCode,
      )
      console.log(response)

      return response
    }
  }

  const headerLabel = [
    { label: "", key: "address" },
    { label: "Phone No", key: "phoneNo" },
  ]

  const thermalPrinterData = [
    { label: "Customer Name:", key: "customerName" },
    { label: "Cell No:", key: "customerNumber" },
    { label: "Invoice number:", key: "invoiceNo" },
    { label: "Invoice date:", key: "invoiceDate" },
    { label: "FBR Invoice number:", key: "fbrInvoiceNumber" },
    { label: "Generated By:", key: "generatedBy" },
  ]

  const thermalPrinterFooter = [
    { label: "Total Price :", key: "totalSaleValue" },
    { label: "Total Discount :", key: "totalDiscount" },
    { label: "Total Quantity :", key: "totalQuantity" },
    { label: "Total Tax :", key: "totalTaxCharged" },
    { label: "Total Amount:", key: "total" },
  ]
  const action4 = "salepage"

  const columns = [
    { field: "Code", label: "Code" },
    { field: "name", label: "Name" },
    { field: "color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "returnQuantity", label: "Qty" },
    { field: "excludeTaxPrice", label: "Price" },
    { field: "totalAmounnt", label: "Total" },
    { field: "Discount", label: "Disc" },
    { field: "taxAmount", label: "Tax" },
    ,
    // { field: "amount", label: "Due Amount" }
  ]
  const withoutFBRColumns = [
    { field: "Code", label: "Code" },
    { field: "name", label: "Name" },
    { field: "color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "returnQuantity", label: "Qty" },
    { field: "excludeTaxPrice", label: "Price" },
    { field: "totalAmounnt", label: "Total" },
    { field: "Discount", label: "Disc" },
    { field: "amount", label: "Due Amount" },
  ]

  const invoiceData = {
    invoiceTitle: "Return Invoice",
    companyTitle: COMPANYHEADER,
    address: user?.user?.shopNo?.shopAddress,
    contact: user?.user?.shopNo?.phoneNo,

    customerTitle: "Name",
    customerTitleValue: `${customerName}`,
    customerPhoneTitle: "Contact",
    customerPhoneValue: `${customerNumber}`,
    generatedBy: `${user?.user?.name}`,

    billingDetailsFirstTitle: "FBR Invoice Number",
    billingDetailsSecondTitle: `Invoice Number`,
    billingDetailsThirdTitle: `Dated`,
    billingDetailsFirstValue: fbrInvoiceNumber,
    billingDetailsSecondValue: invoiceNo,
    billingDetailsThirdValue: `${new Date().toLocaleDateString()}`,

    columns,
    listData: products,

    FBRInvoiceNumber: fbrInvoiceNumber,
    totalFirstTitle: "Total Tax Charged",
    totalSecondTitle: "Total Return Value",
    totalThirdTitle: "Total Discount",
    totalFourthTitle: "Due Amount",
    totalFirstValue: totalTaxCharged,
    totalSecondValue: totalSaleValue,
    totalThirdValue: totalDiscount,
    totalFourthValue: total,
    terms: "Qureshi Electronics Corporation",
  }

  const withoutFBRinvoiceData = {
    invoiceTitle: "Return Invoice",
    companyTitle: COMPANYHEADER,
    address: user?.user?.shopNo?.shopAddress,
    contact: user?.user?.shopNo?.phoneNo,

    customerTitle: "Name",
    customerTitleValue: `${customerName}`,
    customerPhoneTitle: "Contact",
    customerPhoneValue: `${customerNumber}`,
    generatedBy: `${user?.user?.name}`,

    // billingDetailsFirstTitle: "FBR Invoice Number",
    billingDetailsSecondTitle: `Invoice Number`,
    billingDetailsThirdTitle: `Dated`,
    // billingDetailsFirstValue: fbrInvoiceNumber,
    billingDetailsSecondValue: invoiceNo,
    billingDetailsThirdValue: `${new Date().toLocaleDateString()}`,

    columns: withoutFBRColumns,
    listData: products,

    FBRInvoiceNumber: fbrInvoiceNumber,
    totalFirstTitle: "Total Return Value",
    totalSecondTitle: "Total Discount",
    totalThirdTitle: "Due Amount",
    totalFirstValue: totalSaleValue,
    totalSecondValue: totalDiscount,
    totalThirdValue: total,
    terms: "Qureshi Electronics Corporation",
  }

  // Current date for invoice
  const currentDate = new Date().toLocaleDateString()

  return (
    <>
      <MetaData title="QE ~~SaleProduct" />
      <div className={`Sale ${colorTheme}`}>
        <div className="secondContainer">
          {saleProductPermission && (
            <>
              <div className="contentt-box">
                <div className="heading-container">
                  <h3>{t("returnProduct")}</h3>
                </div>
              </div>
              <div className="Sale-Input-Section">
                <div className="formApp">
                  <div className="formRow">
                    <div className="inputSection">
                      <label> {t("selectInvoiceId")}</label>
                      <AsyncSelect
                        loadOptions={saleRecordList?.length > 0 && loadSaleData}
                        defaultOptions={saleRecordList}
                        onChange={handleSaleIdSelect}
                        defaultValue={invoiceNoDefault}
                        isDisabled={products?.length > 0}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="formAppSecondSection">
                {saleId ? (
                  <>
                    <div className="buttonAppRow">
                      <Button
                        className={`ui button button-add-product`}
                        onClick={() => {
                          navigate("/returnProductpage")
                        }}
                      >
                        {t("returnProduct")}&nbsp;
                        <Inventory2Icon />
                      </Button>

                      {isChooseOnPrint ? (
                        // <div className="action-container">
                        <>
                          {products && products?.length > 0 && (
                            <>
                              {selectedPrinter === "laser" && (
                                <ReactToPrint
                                  trigger={() => (
                                    <button
                                      ref={buttonRef}
                                      className={`ui button button-add-product`}
                                      disabled={isGeneratingInvoice}
                                    >
                                      {isGeneratingInvoice ? "Generating..." : "Generate Invoice"} &nbsp;&nbsp;
                                      <SaveAltIcon />
                                    </button>
                                  )}
                                  content={() => componentRef.current}
                                  onBeforeGetContent={handlePrintDownload}
                                  onAfterPrint={() => {
                                    setProducts([])
                                    setSaleId("")
                                    setInvoiceNoDefault("")
                                  }}
                                />
                              )}
                              {selectedPrinter === "thermal" && (
                                <Button
                                  className={`ui button button-add-product`}
                                  onClick={handlePrint}
                                  disabled={isGeneratingInvoice}
                                  // loading={isGeneratingInvoice}
                                >
                                  {isGeneratingInvoice ? "Generating..." : "Generate Invoice"} &nbsp;&nbsp;
                                  <SaveAltIcon />
                                </Button>
                              )}
                            </>
                          )}
                          <div className="printer-select-container">
                            {products && products.length > 0 && (
                              <select
                                value={selectedPrinter}
                                onChange={(e) => setSelectedPrinter(e.target.value)}
                                className="printer-select"
                              >
                                <option value="">Select Printer</option>
                                <option value="laser">Laser Printer</option>
                                <option value="thermal">Thermal Printer</option>
                              </select>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {user?.user?.printerId?.printerType === "Laser" ? (
                            <>
                              {products && products?.length > 0 && (
                                <ReactToPrint
                                  trigger={() => (
                                    <button
                                      ref={buttonRef}
                                      className={`ui button button-add-product`}
                                      disabled={isGeneratingInvoice}
                                    >
                                      {isGeneratingInvoice ? "Generating..." : "Generate Invoice"} &nbsp;&nbsp;
                                      <SaveAltIcon />
                                    </button>
                                  )}
                                  content={() => componentRef.current}
                                  onBeforeGetContent={handlePrintDownload}
                                  onAfterPrint={() => {
                                    setProducts([])
                                    setSaleId("")
                                    setInvoiceNoDefault("")
                                  }}
                                />
                              )}
                            </>
                          ) : (
                            <>
                              {products && products?.length > 0 ? (
                                <Button
                                  className={`ui button button-add-product`}
                                  onClick={handlePrint}
                                  disabled={isGeneratingInvoice}
                                  // loading={isGeneratingInvoice}
                                >
                                  {isGeneratingInvoice ? "Generating..." : "Generate Invoice"} &nbsp;&nbsp;
                                  <SaveAltIcon />
                                </Button>
                              ) : (
                                <h1></h1>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <div className="table-container">
                      <TableForm />
                    </div>
                  </>
                ) : (
                  <h1 style={{ fontSize: "1rem", fontWeight: "bold" }}>{t("purchaseMessage")}</h1>
                )}
              </div>

              {user?.user?.printerId?.printerType === "Laser" || (isChooseOnPrint && selectedPrinter === "laser") ? (
                <div className="print-only-container">
                  <div ref={componentRef} className="p-5">
                    {QURESHI_ELECTRONICS === "QURESHI_ELECTRONICS_WITH_FBR" ? (
                      <MainInvoice invoiceData={invoiceData} />
                    ) : (
                      <MainInvoice invoiceData={withoutFBRinvoiceData} />
                    )}
                  </div>
                </div>
              ) : (
                <div className="print-only-container">
                  <div id="invoice" ref={componentRef} className="invoice">
                    <ThermalPrinter
                      headerLabel={headerLabel}
                      headerData={{
                        address: address || user?.user?.shopNo?.shopAddress,
                        phoneNo: phoneNo || user?.user?.shopNo?.phoneNo,
                      }}
                      labelData={thermalPrinterData}
                      data={{
                        customerName: customerName,
                        customerNumber: customerNumber,
                        invoiceNo: invoiceNo,
                        invoiceDate: currentDate,
                        generatedBy: user?.user?.name,
                        fbrInvoiceNumber: fbrInvoiceNumber,
                      }}
                      tableData={products}
                      tableColumns={columns}
                      action={action4}
                      footerLabel={thermalPrinterFooter}
                      footerData={{
                        totalSaleValue: totalSaleValue,
                        totalDiscount: totalDiscount,
                        totalQuantity: totalQuantity,
                        totalTaxCharged: totalTaxCharged,
                        total: total,
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
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App
