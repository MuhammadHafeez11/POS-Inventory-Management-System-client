"use client"

import { Fragment, useContext, useEffect, useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import { useDispatch, useSelector } from "react-redux"
import { Statee } from "./context/stateContext"
import { useAlert } from "react-alert"
import ReactToPrint from "react-to-print"
import SaveAltIcon from "@mui/icons-material/SaveAlt"
import { Button } from "semantic-ui-react"
const PaymentModel = ({
  isModelOpen,
  selectedPrinter,
  setIsModelOpen,
  buttonRef,
  buttonClicked,
  handlePrintDownload,
  handlePrint,
  variableForButtonLoader,
  setVariableForButtonLoader,
}) => {
  const alert = useAlert()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [isFullPayment, setIsFullPayment] = useState(true)
  const { user } = useSelector((state) => state.user)
  const {
    initialPayment,
    setInitialPayment,
    total,
    remainingAmount,
    setRemainingAmount,
    payments,
    setPayments,
    remainingDuesDate,
    setRemainingDuesDate,
    list,
    setList,
    setClientName,
    setClientAddress,
    setInvoiceNumber,
    setSerialNumber,
    paymentStatus,
    setPaymentStatus,
    setFbrInvoiceNumber,
    componentRef,
  } = useContext(Statee)

  const handleInitialAmount = (e) => {
    if (e.target.value > total) {
      return alert.error(`Initial Payment should less than Total Amount`)
    } else if (Number.parseInt(total - e.target.value) < 1) {
      setPaymentStatus("Paid")
    } else {
      setPaymentStatus("Unpaid")
    }

    setPayments((prevState) => ({
      ...prevState, // Spread the previous state object
      downPayment: Number.parseInt(e.target.value), // Update the value of the specified field
      paymentPayed: Number.parseInt(e.target.value),
      remaining: total - Number.parseFloat(e.target.value),
    }))

    setInitialPayment(e.target.value)
    setRemainingAmount(total - e.target.value)
  }

  useEffect(() => {
    if (isFullPayment) {
      setPaymentStatus("Paid") //
      setInitialPayment(total)
      setRemainingAmount(0)
      setRemainingDuesDate(new Date().toISOString().split("T")[0])
      setPayments({
        downPayment: total,
        paymentPayed: total,
        remaining: 0,
      })
    }
  }, [isFullPayment, total])

  const handleCheckboxChange = () => {
    console.log(isFullPayment)
    setIsFullPayment(!isFullPayment) // Toggle checkbox state
    if (!isFullPayment) {
      console.log(isFullPayment)
      // If checking the box, set amounts to total
      setInitialPayment(total)
      setRemainingAmount(0)
      setPaymentStatus("Paid")
      // Set today's date in YYYY-MM-DD format
      const today = new Date()
      const formattedDate = today.toISOString().split("T")[0] // Get YYYY-MM-DD format
      setRemainingDuesDate(formattedDate) // Set remaining dues date to today
      setPayments({
        downPayment: total,
        paymentPayed: total,
        remaining: 0,
      })
    } else {
      console.log(isFullPayment)
      // If unchecking, reset the values
      setInitialPayment("")
      setPaymentStatus("Unpaid")
      setRemainingAmount(total) // Reset to total amount
      setRemainingDuesDate("") // Reset date
      setPayments({
        downPayment: 0,
        paymentPayed: 0,
        remaining: total,
      })
    }
  }

  const handleDateChange = (e) => {
    setRemainingDuesDate(e.target.value)
  }
  const closeIconClick = () => {
    setIsModelOpen(false)
  }

  // Add styles for the printer selection message
  const printerSelectionMessageStyle = {
    color: "#e74c3c",
    fontWeight: "bold",
    marginBottom: "10px",
    padding: "8px 12px",
    border: "1px solid #e74c3c",
    borderRadius: "4px",
    backgroundColor: "#fef5f5",
    textAlign: "center",
  }

  // Apply the style to the printer-selection-message div
  useEffect(() => {
    const messageElement = document.querySelector(".printer-selection-message")
    if (messageElement) {
      Object.assign(messageElement.style, printerSelectionMessageStyle)
    }
  }, [isModelOpen])

  return (
    <Fragment>
      <div className="modal">
        <div className="modal-content">
          {loading ? (
            <></>
          ) : (
            <>
              <div className="buttonDiv">
                <button onClick={closeIconClick}>
                  <CloseIcon />
                </button>
              </div>
              <div className="form">
                <div className="formRow">
                  <label>
                    <input type="checkbox" checked={isFullPayment} onChange={handleCheckboxChange} />
                    <span style={{ fontWeight: "bold" }}>&nbsp;&nbsp;Received full payment</span>
                  </label>
                </div>
                <div className="formRow">
                  <div className="inputSection">
                    <label>{"Total Payment"}</label>
                    <input
                      type="Number"
                      placeholder={"Enter Total Payment"}
                      name="productCode"
                      autoComplete="off"
                      required
                      value={total}
                      disabled
                    />
                  </div>
                  <div className="inputSection">
                    <label>
                      Initial Payment <span style={{ color: "red", margin: 0 }}>*</span>
                    </label>
                    <input
                      label={"productCode"}
                      type="Number"
                      className="customerInputField"
                      placeholder={"Enter Initial Payment"}
                      name="productCode"
                      autoComplete="off"
                      maxLength="40"
                      max={total}
                      required
                      value={initialPayment}
                      onChange={handleInitialAmount}
                      disabled={isFullPayment}
                    />
                  </div>
                </div>
                <div className="formRow">
                  <div className="inputSection">
                    <label>
                      Remaining Dues Date<span style={{ color: "red", margin: 0 }}>*</span>
                    </label>
                    <input type="date" onChange={handleDateChange} value={remainingDuesDate} disabled={isFullPayment} />
                  </div>
                </div>

                <div className="buttonRow">
                  {user?.user?.printerId?.printerType === "Choose on Print" ? (
                    <>
                      {selectedPrinter ? (
                        selectedPrinter === "laser" ? (
                          <ReactToPrint
                            trigger={() => (
                              <button ref={buttonRef} disabled={buttonClicked} className={`button button-add-product`}>
                                Generate Invoice &nbsp;&nbsp;
                                <SaveAltIcon />
                              </button>
                            )}
                            content={() => componentRef.current}
                            onBeforeGetContent={handlePrintDownload}
                            onAfterPrint={() => {
                              setList([])
                              setClientName("")
                              setClientAddress("")
                              setInvoiceNumber("")
                              setSerialNumber("")
                              setFbrInvoiceNumber("")
                              setRemainingDuesDate("")
                              setInitialPayment("")
                              setPayments("")
                              setVariableForButtonLoader(false)
                            }}
                          />
                        ) : (
                          <Button
                            className={`button button-add-product`}
                            disabled={buttonClicked}
                            onClick={handlePrint}
                          >
                            Generate Invoice&nbsp;&nbsp;
                            <SaveAltIcon />
                          </Button>
                        )
                      ) : (
                        <div className="printer-selection-message">
                          Please select a printer type before generating invoice
                        </div>
                      )}
                    </>
                  ) : user?.user?.printerId?.printerType === "Laser" ? (
                    <ReactToPrint
                      trigger={() => (
                        <button ref={buttonRef} disabled={buttonClicked} className={`button button-add-product`}>
                          Generate Invoice &nbsp;&nbsp;
                          <SaveAltIcon />
                        </button>
                      )}
                      content={() => componentRef.current}
                      onBeforeGetContent={handlePrintDownload}
                      onAfterPrint={() => {
                        setList([])
                        setClientName("")
                        setClientAddress("")
                        setInvoiceNumber("")
                        setSerialNumber("")
                        setFbrInvoiceNumber("")
                        setRemainingDuesDate("")
                        setInitialPayment("")
                        setPayments("")
                        setVariableForButtonLoader(false)
                      }}
                    />
                  ) : (
                    <Button className={`button button-add-product`} disabled={buttonClicked} onClick={handlePrint}>
                      Generate Invoice&nbsp;&nbsp;
                      <SaveAltIcon />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default PaymentModel