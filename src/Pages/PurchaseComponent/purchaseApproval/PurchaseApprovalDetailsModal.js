"use client"

import { Modal, Button, Icon } from "semantic-ui-react"
import { useTranslation } from "react-i18next"
import { useRef, useState, useEffect, useCallback } from "react"
import printJS from "print-js"
import ReactToPrint from "react-to-print"
import PageLoader from "../../../Components/Loader/PageLoader"
import TableComponentId from "../../../Components/tableComponent/printLaserTable"
import ThermalPrinter from "../../../Components/Printer/ThermalPrinter"
import Invoice from "../../../Components/Printer/MainPrinter"
import { COMPANYHEADER } from "../../../constants/companyNameContants"

const PurchaseApprovalDetailsModal = ({
  isOpen,
  onClose,
  purchaseApproval,
  loading,
  onApprove,
  onReject,
  onContinueToPurchase,
  approveButtonLoading,
  rejectLoading,
  user,
  onApproveWithInvoice,
  activeTab,
}) => {
  const { t } = useTranslation()
  const componentRef = useRef(null)
  const [invoiceNum, setInvoiceNum] = useState("")
  const [isPrintReady, setIsPrintReady] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [printTrigger, setPrintTrigger] = useState(false)
  // Add state for printer selection
  const [selectedPrinter, setSelectedPrinter] = useState("")
  const [highlightPrinterDropdown, setHighlightPrinterDropdown] = useState(false)

  // Check if user has "Choose on Print" printer type
  const isChooseOnPrint = user?.user?.printerId?.printerType === "Choose on Print"

  // Utility functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }, [])

  const calculateTotal = useCallback((products) => {
    return products?.reduce((sum, product) => {
      return sum + (Number.parseInt(product.purchaseTotalAmount) || 0)
    }, 0)
  }, [])

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "pending":
        return "status-pending"
      case "approved":
        return "status-approved"
      case "rejected":
        return "status-rejected"
      default:
        return ""
    }
  }, [])

  // Calculate totals for invoice
  const calculateTotals = useCallback((products) => {
    if (!products || products.length === 0)
      return { totalTaxAmount: 0, totalPrice: 0, totalDiscount: 0, totalQuantity: 0, totalAmount: 0 }

    const totalTaxAmount = products.reduce((sum, product) => {
      const taxAmount = Number.parseInt(product.purchaseTotalTax, 10)
      return isNaN(taxAmount) ? sum : sum + taxAmount
    }, 0)

    const totalPrice = products.reduce((sum, product) => {
      const price = Number.parseInt(product.purchasePrice, 10)
      return isNaN(price) ? sum : sum + price
    }, 0)

    const totalDiscount = products.reduce((sum, product) => {
      const disc = Number.parseInt(product.purchaseDiscount || product.discountValue, 10)
      return isNaN(disc) ? sum : sum + disc
    }, 0)

    const totalQuantity = products.reduce((sum, product) => {
      const quantity = Number.parseInt(product.PurchaseQuantity, 10)
      return isNaN(quantity) ? sum : sum + quantity
    }, 0)

    const totalAmount = products.reduce((sum, product) => {
      const total = Number.parseInt(product.purchaseTotalAmount, 10)
      return isNaN(total) ? sum : sum + total
    }, 0)

    return { totalTaxAmount, totalPrice, totalDiscount, totalQuantity, totalAmount }
  }, [])

  // Process approval and get invoice number
  const processApprovalAndGetInvoice = useCallback(async () => {
    if (isProcessing) return null

    setIsProcessing(true)
    try {
      // Call the approve function and wait for the invoice number to be returned
      const invoiceNumber = await onApproveWithInvoice(purchaseApproval._id)

      if (!invoiceNumber) {
        throw new Error("Failed to generate invoice number")
      }

      console.log("Received invoice number:", invoiceNumber)

      // Set the invoice number in state
      setInvoiceNum(invoiceNumber)

      // Wait for state to update
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Mark as ready for printing
      setIsPrintReady(true)

      return invoiceNumber
    } catch (error) {
      console.error("Error during approval process:", error)
      setIsProcessing(false)
      throw error
    }
  }, [isProcessing, onApproveWithInvoice, purchaseApproval])

  // Handle thermal printer print button click
  const handleThermalPrint = useCallback(async () => {
    try {
      await processApprovalAndGetInvoice()
      setPrintTrigger(true)
    } catch (error) {
      console.error("Error in thermal print process:", error)
    }
  }, [processApprovalAndGetInvoice])

  // Handle before print content
  const handleBeforeGetContent = useCallback(async () => {
    try {
      const invoiceNumber = await processApprovalAndGetInvoice()
      console.log("Before print, invoice number:", invoiceNumber)
      console.log("Before print, invoiceNum state:", invoiceNum)

      // Force a small delay to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 500))

      return Promise.resolve()
    } catch (error) {
      console.error("Error in onBeforeGetContent:", error)
      return Promise.reject(error)
    }
  }, [processApprovalAndGetInvoice, invoiceNum])

  // Handle after print
  const handleAfterPrint = useCallback(() => {
    console.log("After print, invoiceNum:", invoiceNum)
    setIsProcessing(false)
    setIsPrintReady(false)
    onClose()
  }, [invoiceNum, onClose])

  // Effect to trigger printing when ready (for thermal printer)
  useEffect(() => {
    if (
      isPrintReady &&
      printTrigger &&
      user?.user?.printerId?.printerType !== "Laser" &&
      (!isChooseOnPrint || (isChooseOnPrint && selectedPrinter === "thermal"))
    ) {
      // Print the invoice now that we have the invoice number
      printJS({
        printable: "invoice",
        type: "html",
        targetStyles: ["*"],
        font_size: "10pt",
        font_family: "Courier New",
        css: "../Components/Printer/thermalPrinter.css",
        scanStyles: false,
      })

      // Reset states
      setPrintTrigger(false)
      setIsPrintReady(false)
      setIsProcessing(false)

      // Close the modal after printing
      onClose()
    }
  }, [isPrintReady, printTrigger, user?.user?.printerId?.printerType, isChooseOnPrint, selectedPrinter, onClose])

  // Log when invoice number changes
  useEffect(() => {
    if (invoiceNum) {
      console.log("Invoice number updated:", invoiceNum)
    }
  }, [invoiceNum])

  useEffect(() => {
    setIsProcessing(false)
  }, [purchaseApproval?._id, isOpen])

  // Handle printer selection
  const handlePrinterChange = (e) => {
    setSelectedPrinter(e.target.value)
    setHighlightPrinterDropdown(false)
  }

  // Handle approve button click when no printer is selected
  const handleApproveButtonClick = () => {
    if (!selectedPrinter && isChooseOnPrint) {
      setHighlightPrinterDropdown(true)
      // Auto-scroll to the printer dropdown
      const printerDropdown = document.querySelector(".printer-select")
      if (printerDropdown) {
        printerDropdown.scrollIntoView({ behavior: "smooth", block: "center" })
        printerDropdown.focus()
      }
    }
  }

  // Define table columns for the products table
  const productColumns = [
    { field: "Code", label: t("Code") },
    { field: "Namee", label: t("Name") },
    { field: "Color", label: t("Color") },
    { field: "PurchaseQuantity", label: t("Qty") },
    { field: "purchasePrice", label: t("Price") },
    { field: "MRP", label: t("MRP") },
    { field: "purchaseTotalTax", label: t("Tax") },
    { field: "discountValue", label: t("Discount") },
    { field: "purchaseTotalAmount", label: t("Total") },
  ]

  // Prepare data for invoice
  const totals = calculateTotals(purchaseApproval?.products)
  const currentDate = new Date()
  const formattedDate = currentDate?.toLocaleDateString()

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
    { field: "discountValue", label: "Disc." },
    { field: "purchaseTotalAmount", label: "Due Amount" },
  ]

  const thermalPrinterFooter = [
    { label: "Total Price :", key: "totalPrice" },
    { label: "Total Discount :", key: "totalDiscount" },
    { label: "Total Quantity :", key: "totalQuantity" },
    { label: "Total Tax :", key: "totalTaxAmount" },
    { label: "Total Amount:", key: "totalAmount" },
  ]

  // Create invoice data with the current invoice number
  const invoiceData = {
    invoiceTitle: "Purchase Invoice",
    companyTitle: COMPANYHEADER,
    address: user?.user?.shopNo?.shopAddress,
    contact: user?.user?.shopNo?.phoneNo,
    customerTitle: "Name",
    customerTitleValue: purchaseApproval?.clientName,
    customerPhoneTitle: "Purchase Receipt Number",
    customerPhoneValue: purchaseApproval?.purchaseReceiptNumber,
    generatedBy: user?.user?.name,
    billingDetailsFirstTitle: "Invoice Number",
    billingDetailsSecondTitle: "Company",
    billingDetailsThirdTitle: "Dated",
    billingDetailsFirstValue: invoiceNum || "", // Ensure this is not undefined
    billingDetailsSecondValue: purchaseApproval?.purchaseCompany,
    billingDetailsThirdValue: formatDate(purchaseApproval?.purchaseDate),
    columns,
    listData: purchaseApproval?.products,
    totalFirstTitle: "Due Amount",
    totalFirstValue: purchaseApproval?.total || calculateTotal(purchaseApproval?.products),
    terms: "Qureshi Electronics Corporation",
  }

  // Render the modal content
  const renderModalContent = () => {
    if (loading) {
      return <PageLoader />
    }

    if (!purchaseApproval) {
      return (
        <div className="no-data-message">
          <Icon name="search" size="large" />
          <p>{t("No approval details available")}</p>
        </div>
      )
    }

    return (
      <div className="approval-details">
        <div className="info-container">
          <div className="info-column">
            <div className="info-item">
              <div className="info-label">{t("Supplier")}:</div>
              <div className="info-value">{purchaseApproval.clientName}</div>
            </div>

            <div className="info-item">
              <div className="info-label">{t("Company")}:</div>
              <div className="info-value">{purchaseApproval.purchaseCompany}</div>
            </div>

            <div className="info-item">
              <div className="info-label">{t("Status")}:</div>
              <div className={`info-value ${getStatusColor(purchaseApproval.approvalStatus)}`}>
                {purchaseApproval.approvalStatus === "pending" && t("Pending")}
                {purchaseApproval.approvalStatus === "approved" && t("Approved")}
                {purchaseApproval.approvalStatus === "rejected" && t("Rejected")}
              </div>
            </div>
          </div>

          <div className="info-column">
            <div className="info-item">
              <div className="info-label">{t("Receipt Number")}:</div>
              <div className="info-value">{purchaseApproval.purchaseReceiptNumber}</div>
            </div>

            <div className="info-item">
              <div className="info-label">{t("Purchase Date")}:</div>
              <div className="info-value">{formatDate(purchaseApproval.purchaseDate)}</div>
            </div>

            <div className="info-item">
              <div className="info-label">{t("Requested By")}:</div>
              <div className="info-value">{purchaseApproval.purchasedBy}</div>
            </div>
          </div>
        </div>

        {purchaseApproval.approvalStatus === "approved" && (
          <div className="approval-info">
            <div className="info-item">
              <div className="info-label">{t("Approved By")}:</div>
              <div className="info-value">{purchaseApproval.approvedBy}</div>
            </div>
            <div className="info-item">
              <div className="info-label">{t("Approval Date")}:</div>
              <div className="info-value">{formatDate(purchaseApproval.approvalDate)}</div>
            </div>
          </div>
        )}

        {purchaseApproval.approvalStatus === "rejected" && (
          <div className="rejection-info">
            <div className="info-item">
              <div className="info-label">{t("Rejected By")}:</div>
              <div className="info-value">{purchaseApproval.approvedBy}</div>
            </div>
            <div className="info-item">
              <div className="info-label">{t("Rejection Date")}:</div>
              <div className="info-value">{formatDate(purchaseApproval.approvalDate)}</div>
            </div>
          </div>
        )}

        <div className="products-table-container">
          <TableComponentId data={purchaseApproval.products} columns={productColumns} />
        </div>
        <div className="total-container">
          <div className="total-label">{t("Total Amount")}:</div>
          <div className="total-value">{purchaseApproval.total || calculateTotal(purchaseApproval.products)}</div>
        </div>
      </div>
    )
  }

  // Render the action buttons
  const renderActionButtons = () => {
    if (!purchaseApproval || purchaseApproval.approvalStatus !== "pending") {
      return null
    }

    // For "Choose on Print" printer type
    if (isChooseOnPrint) {
      return (
        <div className="action-buttons">
          {selectedPrinter === "laser" ? (
            <ReactToPrint
              trigger={() => (
                <Button
                  className="approve-btn"
                  disabled={approveButtonLoading || isProcessing || !selectedPrinter}
                  onClick={!selectedPrinter ? handleApproveButtonClick : undefined}
                  title={!selectedPrinter ? t("Please select a printer first") : ""}
                >
                  <Icon name={selectedPrinter ? "check" : "ban"} />
                  {isProcessing ? t("Processing...") : t("Approve & Generate Invoice")}
                </Button>
              )}
              content={() => componentRef.current}
              onBeforeGetContent={handleBeforeGetContent}
              onAfterPrint={handleAfterPrint}
            />
          ) : selectedPrinter === "thermal" ? (
            <Button
              className="approve-btn"
              onClick={handleThermalPrint}
              loading={approveButtonLoading || isProcessing}
              disabled={approveButtonLoading || isProcessing}
            >
              <Icon name="check" />
              {t("Approve & Generate Invoice")}
            </Button>
          ) : (
            <div className="button-with-tooltip">
              <Button
                className="approve-btn-disabled"
                onClick={handleApproveButtonClick}
                disabled={approveButtonLoading || isProcessing}
              >
                <Icon name="ban" />
                {t("Approve & Generate Invoice")}
              </Button>
              <span className="button-tooltip">{t("Please select a printer first")}</span>
            </div>
          )}

          <Button
            className="reject-btn"
            onClick={() => onReject(purchaseApproval._id)}
            loading={rejectLoading}
            disabled={approveButtonLoading || isProcessing}
          >
            <Icon name="ban" />
            {t("Reject")}
          </Button>
        </div>
      )
    }

    // For fixed printer types
    return (
      <>
        <div className="action-buttons">
          {user?.user?.printerId?.printerType === "Laser" ? (
            <ReactToPrint
              trigger={() => (
                <Button className="approve-btn" disabled={approveButtonLoading || approveButtonLoading}>
                  <Icon name="check" />
                  {isProcessing ? t("Processing...") : t("Approve & Generate Invoice")}
                </Button>
              )}
              content={() => componentRef.current}
              onBeforeGetContent={handleBeforeGetContent}
              onAfterPrint={handleAfterPrint}
            />
          ) : (
            <Button
              className="approve-btn"
              onClick={handleThermalPrint}
              loading={approveButtonLoading || isProcessing}
              disabled={approveButtonLoading || isProcessing}
            >
              <Icon name="check" />
              {t("Approve & Generate Invoice")}
            </Button>
          )}

          <Button
            className="reject-btn"
            onClick={() => onReject(purchaseApproval._id)}
            loading={rejectLoading}
            disabled={approveButtonLoading || isProcessing}
          >
            <Icon name="ban" />
            {t("Reject")}
          </Button>
        </div>
      </>
    )
  }

  // Render the hidden invoice for printing
  const renderHiddenInvoice = () => {
    if (!purchaseApproval) return null

    // For "Choose on Print" with laser selected or fixed Laser printer type
    if (user?.user?.printerId?.printerType === "Laser" || (isChooseOnPrint && selectedPrinter === "laser")) {
      return (
        <div ref={componentRef} className="p-5">
          <Invoice invoiceData={invoiceData} />
        </div>
      )
    }

    // For thermal printer
    return (
      <div id="invoice" ref={componentRef} className="p-5">
        <ThermalPrinter
          headerLabel={headerLabel}
          headerData={{
            shopAddress: purchaseApproval?.address,
            shopPhoneNo: purchaseApproval?.phoneNo,
          }}
          labelData={thermalPrinterData}
          data={{
            clientName: purchaseApproval?.clientName,
            invoiceNumber: invoiceNum,
            purchaseReceiptNumber: purchaseApproval?.purchaseReceiptNumber,
            formattedDate,
            purchaseCompany: purchaseApproval?.purchaseCompany,
            purchaseDate: formatDate(purchaseApproval?.purchaseDate),
            generatedBy: user?.user?.name,
          }}
          tableData={purchaseApproval?.products}
          tableColumns={columns}
          footerLabel={thermalPrinterFooter}
          footerData={totals}
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
    )
  }

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        size="large"
        className={`purchase-approval-modal ${purchaseApproval?.approvalStatus !== "pending" || activeTab !== "pending" ? "non-pending-modal" : ""}`}
      >
        <div className="modal-header">
          <h2>{t("Purchase Approval Details")}</h2>
          <button className="close-button" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        {/* Only show printer selection for pending approvals from pending tab */}
        {isChooseOnPrint && purchaseApproval?.approvalStatus === "pending" && activeTab === "pending" && (
          <div className={`printer-selection-container ${highlightPrinterDropdown ? "highlight-printer" : ""}`}>
            <div className="printer-select-wrapper">
              <select
                value={selectedPrinter}
                onChange={handlePrinterChange}
                className={`printer-select ${!selectedPrinter ? "printer-not-selected" : ""}`}
              >
                <option value="">
                  {t("Select Printer")}
                </option>
                <option value="laser">{t("Laser Printer")}</option>
                <option value="thermal">{t("Thermal Printer")}</option>
              </select>
              {!selectedPrinter && (
                <div className="printer-select-message">
                  {highlightPrinterDropdown ? (
                    <span className="printer-select-required">{t("Please select a printer type first!")}</span>
                  ) : (
                    <span className="printer-select-hint">{t("Select a printer to enable approval")}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <Modal.Content scrolling className="custom-modal-content">
          {renderModalContent()}
        </Modal.Content>

        {/* Only show action buttons for pending approvals from pending tab */}
        {purchaseApproval?.approvalStatus === "pending" && activeTab === "pending" && (
          <div className="modal-actions">{renderActionButtons()}</div>
        )}
      </Modal>

      {/* Hidden invoice for printing */}
      <div style={{ display: "none" }}>{renderHiddenInvoice()}</div>
    </>
  )
}

export default PurchaseApprovalDetailsModal
