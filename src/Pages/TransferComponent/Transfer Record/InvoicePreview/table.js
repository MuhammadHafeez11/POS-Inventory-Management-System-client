import React, { useContext, useEffect, useState } from "react";
import { State } from "../context/ContextSales";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCustomState } from "../../../../Variables/stateVariables";
import PrintTableComponent from "../../../../Components/tableComponent/printTableComponent";
import PrintLaserTable from "../../../../Components/tableComponent/printLaserTable";
import { getTransferDetailsForPreview } from "../../../../actions/transferAction";
export default function Tablee({ selectedPrinter }) {
  const { salesId, setSalesId, salesRef } = useContext(State);

  const {
    invoicedata,
    setInvoicedata,
    Products,
    setProducts,
    loading,
    setLoading,
  } = useCustomState();
  const [productss, setProductss] = useState([]);
  // const [selectedPrinter, setSelectedPrinter] = useState('thermal');
  const navigate = useNavigate();

  useEffect(() => {
    getspecificDataforInvoice();
  }, []);

  const getspecificDataforInvoice = async () => {
    console.log(salesId);
    const result = await getTransferDetailsForPreview(salesId);
    console.log(result);
    setInvoicedata(result);
    setProductss(result?.data?.products);
    setLoading(true);
  };
  const columns = [
    { field: "Code", label: "Code" },
    { field: "Namee", label: "Name" },
    { field: "Company", label: "Company" },
    { field: "Color", label: "Color" },
    { field: "PurchaseQuantity", label: "Quantity" },
  ];
  return (
    <>
      {loading ? (
     
     <>
          {selectedPrinter === "thermal" ? (
            <PrintTableComponent data={productss} columns={columns} />
          ) : (
            <div className="printTable">
            <PrintLaserTable data={productss} columns={columns} />
            </div>
          )}
     </>
      ) : (
        <h1></h1>
      )}
    </>
  );
}
