"use client"

import { useEffect, useContext, useState } from "react"
import Header from "../SaleComponent/salesRecord/InvoicePreview/Header"
import ExpenseHeader from "../ExpenseComponent/Expensee/ExpenseInvoice/Preview/headers"
import ExpenseDates from "../ExpenseComponent/Expensee/ExpenseInvoice/Preview/Dates"
import ExpenseTable from "../ExpenseComponent/Expensee/ExpenseInvoice/Preview/table"
import { State } from "../SaleComponent/salesRecord/context/ContextSales"
import Dates from "../SaleComponent/salesRecord/InvoicePreview/Dates"
import Tablee from "../SaleComponent/salesRecord/InvoicePreview/table"
import { Statee } from "../ExpenseComponent/Expensee/context/stateContext"
import DepositDates from "../ExpenseComponent/CashDeposit/Invoice/Dates"
import DepositHeader from "../ExpenseComponent/CashDeposit/Invoice/Header"
import DepositTable from "../ExpenseComponent/CashDeposit/Invoice/Table"
import { DepositPaymentStatee } from "../ExpenseComponent/CashDeposit/context/paymentStateContext"
import PurchaseHeader from "../PurchaseComponent/purchaseRecord/InvoicePreview/headers"
import PurchaseDates from "../PurchaseComponent/purchaseRecord/InvoicePreview/dates"
import Table from "../PurchaseComponent/purchaseRecord/InvoicePreview/table"
import { State as purchaseState } from "../PurchaseComponent/purchaseRecord/context/ContextSales"
import { ReturnStatee } from "../returnComponent/ReturnInvoice/context/returnContext"
// Import Return Components
import ReturnHeader from "../returnComponent/ReturnInvoice/Header"
import ReturnDates from "../returnComponent/ReturnInvoice/Dates"
import ReturnTable from '../returnComponent/ReturnInvoice/table'

const InvoiceDetailsModal = ({
  open,
  handleClose,
  record,
  sales,
  purchase,
  depositedBy,
  expense,
  depositTo,
  returns,
}) => {
  const { salesId, setSalesId, salesRef } = useContext(State)
  const { purchaseId, setPurchaseId, purchaseRef } = useContext(purchaseState)

  const { expenseId, setExpenseId, storageAddress, storagePhoneNo } = useContext(Statee)
  const { depositPaymentsId, setDepositPaymentsId } = useContext(DepositPaymentStatee)

  // Add return state
  // const [returnId, setReturnId] = useState()
  const { setReturnId } = useContext(ReturnStatee);

  const [salesRecord, setSalesRecord] = useState()
  const [expenseRecord, setExpenseRecord] = useState()
  const [purchaseRecord, setPurchaseRecord] = useState()
  const [returnRecord, setReturnRecord] = useState()

  const [salesLoading, setSalesLoading] = useState(false)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [expenseLoading, setExpenseLoading] = useState(false)
  const [depositByLoading, setDepositByLoading] = useState(false)
  const [depositToLoading, setDepositToLoading] = useState(false)
  const [returnLoading, setReturnLoading] = useState(false)

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handlePrint = () => {
    document.body.classList.add("printing")

    const style = document.createElement("style")
    style.id = "print-styles"
    style.innerHTML = `
      @media print {
        @page {
          size: auto;
          margin: 10mm;
        }
        
        body * {
          visibility: hidden;
        }
        
        .invoice-modal__invoice-content,
        .invoice-modal__invoice-content * {
          visibility: visible;
        }
        
        .invoice-modal__invoice-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `
    document.head.appendChild(style)

    setTimeout(() => {
      window.print()

      setTimeout(() => {
        document.body.classList.remove("printing")
        const printStyles = document.getElementById("print-styles")
        if (printStyles) {
          printStyles.remove()
        }
      }, 1000)
    }, 100)
  }

  // Reset all loading states when modal opens/closes
  const resetLoadingStates = () => {
    setSalesLoading(false)
    setPurchaseLoading(false)
    setExpenseLoading(false)
    setDepositByLoading(false)
    setDepositToLoading(false)
    setReturnLoading(false)
  }

  useEffect(() => {
    if (!record) return

    // Reset all loading states first
    resetLoadingStates()

    console.log("Processing record:", record)

    if (record?.type === "Sale") {
      console.log("Processing Sale")
      sales?.forEach((sale) => {
        if (sale._id === record._id) {
          setSalesLoading(true)
          setSalesId(record.invoiceNumber)
          setSalesRecord(sale)
        }
      })
    } else if (record?.type === "Purchase") {
      console.log("Processing Purchase")
      purchase?.forEach((purchaseItem) => {
        if (purchaseItem._id === record._id) {
          setPurchaseLoading(true)
          setPurchaseId(purchaseItem?.id)
          setPurchaseRecord(purchaseItem)
        }
      })
    } else if (record?.type === "Return") {
      console.log("Processing Return")
      console.log("Returns data:", returns)
      returns?.forEach((returnItem) => {
        if (returnItem._id === record._id) {
          console.log("Found matching return:", returnItem)
          setReturnLoading(true)
          console.log(returnItem?.id)
          setReturnId(returnItem?.id)
          setReturnRecord(returnItem)
        }
      })
    } else if (record?.type === "Expense") {
      console.log("Processing Expense")
      expense?.forEach((expenses) => {
        if (expenses._id === record._id) {
          setExpenseLoading(true)
          setExpenseId(record.invoiceNumber)
          setExpenseRecord(expenses)
        }
      })
    } else if (record?.type === "Cash Deposit") {
      if (record?.status === "Debit") {
        console.log("Processing Deposit By")
        depositedBy?.forEach((deposite) => {
          if (deposite._id === record._id) {
            setDepositByLoading(true)
            setDepositPaymentsId(deposite._id)
          }
        })
      } else if (record?.status === "Credit") {
        console.log("Processing Deposit To")
        depositTo?.forEach((deposite) => {
          if (deposite._id === record._id) {
            setDepositToLoading(true)
            setDepositPaymentsId(deposite._id)
          }
        })
      }
    }
  }, [record, sales, purchase, expense, depositedBy, depositTo, returns])

  if (!open) return null

  const getInvoiceTypeBadge = () => {
    const type = record?.type || record?.status
    let badgeClass = "invoice-badge "

    switch (type) {
      case "Sale":
        badgeClass += "invoice-badge--sale"
        break
      case "Purchase":
        badgeClass += "invoice-badge--purchase"
        break
      case "Return":
        badgeClass += "invoice-badge--return"
        break
      case "Expense":
        badgeClass += "invoice-badge--expense"
        break
      case "Credit":
        badgeClass += "invoice-badge--credit"
        break
      case "Debit":
        badgeClass += "invoice-badge--debit"
        break
      default:
        badgeClass += "invoice-badge--default"
    }
    return badgeClass
  }

  return (
    <div className="invoice-modal">
      {/* Backdrop */}
      <div className="invoice-modal__backdrop" onClick={handleOverlayClick} />

      {/* Modal Content */}
      <div className="invoice-modal__content">
        {/* Header */}
        <div className="invoice-modal__header">
          <h2 className="invoice-modal__title">Invoice Details - {record?.invoiceNumber}</h2>
          <button className="invoice-modal__close-btn" onClick={handleClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="invoice-modal__body">
          {/* Invoice Type Badge */}
          <div className="invoice-modal__badge-container">
            <span className={getInvoiceTypeBadge()}>{record?.type || record?.status} Invoice</span>
          </div>

          {/* Invoice Content */}
          <div className="invoice-modal__invoice-content">
            {salesLoading && (
              <div className="invoice-section">
                <Header />
                <Dates />
                <Tablee />
              </div>
            )}

            {purchaseLoading && (
              <div className="invoice-section">
                <PurchaseHeader />
                <PurchaseDates />
                <Table />
              </div>
            )}

            {returnLoading && (
              <div className="invoice-section">
                <ReturnHeader />
                <ReturnDates />
                <ReturnTable />
              </div>
            )}

            {expenseLoading && (
              <div className="invoice-section">
                <ExpenseHeader />
                <ExpenseDates />
                <ExpenseTable />
              </div>
            )}

            {depositByLoading && (
              <div className="invoice-section">
                <DepositHeader />
                <DepositDates />
                <DepositTable />
              </div>
            )}

            {depositToLoading && (
              <div className="invoice-section">
                <DepositHeader />
                <DepositDates />
                <DepositTable />
              </div>
            )}

            {/* Show message if no content is loading */}
            {!salesLoading &&
              !purchaseLoading &&
              !returnLoading &&
              !expenseLoading &&
              !depositByLoading &&
              !depositToLoading && (
                <div className="invoice-section">
                  <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                    <h3>No invoice data available</h3>
                    <p>Unable to load invoice details for this transaction.</p>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-modal__footer">
          <button className="invoice-modal__btn invoice-modal__btn--secondary" onClick={handleClose}>
            Close
          </button>
          <button className="invoice-modal__btn invoice-modal__btn--primary" onClick={handlePrint}>
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetailsModal
