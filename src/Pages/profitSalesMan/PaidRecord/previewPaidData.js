import React, { useContext, useEffect } from "react";
import ReactToPrint from "react-to-print";
import { useState } from "react";
import { Dropdown, Button } from "semantic-ui-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import MetaData from "../../../MetaData";
import PrintLaserTable from "../../../Components/tableComponent/printLaserTable";
import { getEmployeCommissionOnId } from "../../../actions/employeCommissionAction";
let quantityy = [];
let Discount = [];
let totalAmounnt = [];
let taxAmount = [];
let Price = [];
let amount = [];
let totalProfit = [];
const PaidPreviewDataTable = () => {
  const [storageAddress, setStorageAddress] = useState("");
  const [storagePhoneNo, setStoragePhoneNo] = useState("");
  const [selected, setselected] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [data, setData] = useState();
  const [colorTheme, setColorTheme] = useState("theme-white");
  let action4 = "ProfitEmployee";
  const [selectedPrinter, setSelectedPrinter] = useState();

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);

  useEffect(() => {
    console.log("calih");
    getPaidData();
  }, []);

  const getPaidData = async () => {
    console.log("called");
    let result = await getEmployeCommissionOnId(params.id);
    console.log(result);
    console.log(result?.record);
    setData(result?.record);

    quantityy = result?.record
      ?.reduce((sum, product) => sum + parseInt(product.quantity, 10), 0)
      .toString();
    Price = result?.record
      ?.reduce((sum, product) => sum + parseFloat(product.Price), 0)
      .toString();
    Discount = result?.record
      ?.reduce((sum, product) => sum + parseFloat(product.discount), 0)
      .toString();
    totalAmounnt = result?.record
      ?.reduce((sum, product) => sum + parseFloat(product.totalPrice), 0)
      ?.toString();
    taxAmount = result?.record
      ?.reduce((sum, product) => sum + parseFloat(product.taxAmount), 0)
      .toString();
    taxAmount = Number(taxAmount);
    taxAmount = taxAmount.toFixed(2);
    amount = result?.record
      ?.reduce((sum, product) => sum + parseFloat(product.totalAmount), 0)
      ?.toString();
    totalProfit = result?.record
      ?.reduce((sum, product) => sum + parseFloat(product.commission), 0)
      ?.toString();
  };
  const backHandle = () => {
    navigate("/paidEmployeCommission");
  };

  const columns = [
    { field: "productCode", label: "Code" },
    { field: "productName", label: "Name" },
    { field: "productCompany", label: "Company" },
    { field: "quantity", label: "Quantity" },
    { field: "Price", label: "Price" },
    { field: "totalPrice", label: "Total Price" },
    { field: "discount", label: "Discount" },
    { field: "totalAmount", label: "TotalAmount" },
    { field: "taxAmount", label: "Tax Amount" },
    { field: "commission", label: "Total Commission" },
  ];

  return (
    <>
      <MetaData title="QE ~~InvoicePreview" />
      <div className={`Purchase ${colorTheme}`}>
      <div className="secondContainer">
      <div className="purchaseProduct-box">
      <Button
        positive
        onClick={backHandle}
      >
        Back
      </Button>
      </div>
      <div  className="previewTableContent"> 
          <div className="previewInvoice"  style={{  border: "2px solid black",
                      margin: '10px',
                      display: "flex",
                      padding: "15px",
                      paddingBottom: "0px",
                      flexDirection: "column",
                      alignItems: "center",
                      }} >
            <div className="printTable">
            <PrintLaserTable
              data={data}
              columns={columns}
              action4={action4}
              quantityy={quantityy}
              Price={Price}
              Discount={Discount}
              totalAmounnt={totalAmounnt}
              taxAmount={taxAmount}
              amount={amount}
              totalProfit={totalProfit}
            />
            </div>
          </div>
          </div>
      {/* <div
       className="previewInvoice"
      >
        <div className="p-5">
          <div
            style={{
              // border: "2px solid black",
              marginRight: "20px",
              // padding: "15px",
              paddingBottom: "0px",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              overflow: "scroll",
              height: "400px"
            }}
          >
            <PrintLaserTable
              data={data}
              columns={columns}
              action4={action4}
              quantityy={quantityy}
              Price={Price}
              Discount={Discount}
              totalAmounnt={totalAmounnt}
              taxAmount={taxAmount}
              amount={amount}
              totalProfit={totalProfit}
            />
          </div>
        </div>
      </div>     */}
      </div>
      </div>
    </>
  );
};
export default PaidPreviewDataTable;
