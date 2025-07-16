import React, { useContext, useEffect, useState } from "react";
import { DepositPaymentStatee } from "../context/paymentStateContext";
import PrintLaserTable from "../../../../Components/tableComponent/printLaserTable"

import { getDepositPaymentOnId } from "../../../../actions/depositAction";


export default function Tablee({ selectedPrinter }) {

  const { depositPaymentsId, setDepositPaymentsId } = useContext(DepositPaymentStatee);
  const [invoicedata, setInvoicedata] = useState([]);
  const [productss, setProductss] = useState([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getspecificDataforInvoice();
  }, []);
  
  const getspecificDataforInvoice = async () => {
    let result = await getDepositPaymentOnId(depositPaymentsId);
    console.log(result)
    setInvoicedata(result)
    setLoading(true);
  };

  const columns = [
    { field: "status", label: "Status" },
    { field: "paymentMode", label: "Payment Mode" },
    { field: "amount", label: "Amount" },
  
  ]

  return (
    <>
      {loading ? (
        <>
          <div>
            {/* {selectedPrinter === "thermal" ? (
              <PrintTableComponent
                data={productss}
                columns={columns}
                column2={column2}
                action4={action4}
                ConsolidatedInvoiceTotalquantity={quantity}
                ConsolidatedInvoiceTotaldiscount={discount}
                ConsolidatedInvoiceTotaltotalPriceExculdingTax={totalAmount}
                ConsolidatedInvoiceTotaltotalTaxAmount={taxAmount}
                ConsolidatedInvoiceTotalIncludingAllPrices={amount}
              />
            ) : ( */}
              <PrintLaserTable
                data={invoicedata}
                columns={columns}
          
              />
            {/* )} */}
          </div>
          <div>
        <h2
          className="flex items-end justify-end text-gray-800 font-bold"
          style={{ fontSize: "16px" }}
        >
          Grand Total. {invoicedata[0]?.amount}
        </h2>
      </div>  
        
        </>
      ) : (
        <h1></h1>
      )}

    
    </>
  );
}
