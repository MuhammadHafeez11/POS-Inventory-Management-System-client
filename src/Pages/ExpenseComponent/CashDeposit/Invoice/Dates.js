"use client"

import { useContext, useEffect } from "react"
import { useCustomState } from "../../../../Variables/stateVariables"
import { DepositPaymentStatee } from "../context/paymentStateContext"
// import { getSpecificSaleProduct } from "../../actions/saleProductAction";
import { getDepositPaymentOnId } from "../../../../actions/depositAction"

export default function Dates({ selectedPrinter }) {
  const { invoicedata, setInvoicedata, loading, setLoading } = useCustomState()
  const { depositPaymentsId, setDepositPaymentsId } = useContext(DepositPaymentStatee)

  useEffect(() => {
    // console.log(salesId);
    getspecificDataforInvoice()
  }, [depositPaymentsId])

  const getspecificDataforInvoice = async () => {
    console.log(depositPaymentsId)
    const result = await getDepositPaymentOnId(depositPaymentsId)
    console.log("hice")
    console.log(result[0])
    setInvoicedata(result[0])
    setLoading(true)
  }

  // Helper function to get beneficiary name based on deposit status
  const getBeneficiaryName = () => {
    if (!invoicedata) return "N/A"

    // New data structure
    if (invoicedata.status === "WithInOrganization" && invoicedata.paidTo) {
      return invoicedata.paidTo.name || "N/A"
    } else if (invoicedata.status === "OutsideOrganization" && invoicedata.paidToName) {
      return invoicedata.paidToName || "N/A"
    }
    // // Old data structure for backward compatibility
    // else if (invoicedata.paidTo && invoicedata.paidTo.name) {
    //   return invoicedata.paidTo.name
    // }

    return "N/A"
  }

  // Helper function to get beneficiary type for display
  const getBeneficiaryType = () => {
    if (!invoicedata) return ""

    if (invoicedata.status === "WithInOrganization") {
      return " (Within Organization)"
    } else if (invoicedata.status === "OutsideOrganization") {
      return " (Outside Organization)"
    }

    return ""
  }

  return (
    <>
      {loading ? (
        <>
          <>
            {/* <div className="InvoiceLaserFirstRecordDiv"> */}
            <div style={{ margin: "20px" }} className="mainDiv">
              <div className="DatesFirstDiv">
                <div className="firstDiv">
                  <h5 style={{ fontFamily: "Calibri" }}>Paid By:</h5>
                  <p>{invoicedata?.paidBy?.name}</p>
                </div>
                <div className="secondDiv">
                  <h5 style={{ fontFamily: "Calibri" }}>Paid To:</h5>
                  <p>
                    {getBeneficiaryName()}
                    {/* <span style={{ fontSize: "0.8em", color: "#666" }}>{getBeneficiaryType()}</span> */}
                  </p>
                </div>
                {/* Additional field to show payment status */}
                {/* {invoicedata?.status && (
                  <div className="thirdDiv">
                    <h5 style={{ fontFamily: "Calibri" }}>Payment Scope:</h5>
                    <p>{invoicedata.status}</p>
                  </div>
                )} */}
              </div>
              <div className="DatesFirstDiv">
                <div className="firstDiv">
                  <h5 style={{ fontFamily: "Calibri" }}>Invoice Number:</h5>
                  <p>{invoicedata?.invoiceNo}</p>
                </div>
                <div className="secondDiv">
                  <h5 style={{ fontFamily: "Calibri" }}>Invoice Date:</h5>
                  <p>{new Date(invoicedata?.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
                {/* Show payment mode if available */}
                {/* {invoicedata?.paymentMode && (
                  <div className="thirdDiv">
                    <h5 style={{ fontFamily: "Calibri" }}>Payment Mode:</h5>
                    <p>{invoicedata.paymentMode}</p>
                  </div>
                )} */}
              </div>
              {/* Additional row for account number if available */}
              {/* {invoicedata?.accountNo && (
                <div className="DatesFirstDiv">
                  <div className="firstDiv">
                    <h5 style={{ fontFamily: "Calibri" }}>Account Number:</h5>
                    <p>{invoicedata.accountNo}</p>
                  </div>
                  <div className="secondDiv">
                    <h5 style={{ fontFamily: "Calibri" }}>Amount:</h5>
                    <p style={{ fontWeight: "bold", fontSize: "1.1em" }}>PKR {invoicedata?.amount}</p>
                  </div>
                </div>
              )} */}
            </div>
            {/* </div> */}
          </>
        </>
      ) : (
        <h1></h1>
      )}
    </>
  )
}
