import React, { useContext, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import MetaData from "../../../MetaData";
import { useState } from "react";
import { Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Tablee from "./table";
import Header from './Header'
import Dates from './Dates'
// import { getSpecificSaleProduct } from "../../../../actions/saleProductAction";
import { getSpecificReturnProduct } from "../../../actions/returnProductAction";
export default function ReturnPreview() {
//   const { salesId, salesRef } = useContext(State);
const returnRef = useRef(null)
  const [productss, setProductss] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const navigate = useNavigate();
  const params = useParams()

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);

  useEffect(()=>{
    getspecificDataforInvoice()
  }, [])

  const getspecificDataforInvoice = async () => {
    let result = await getSpecificReturnProduct(params.id);
    setProductss(result?.products);
    setLoading(true);
  };
  const backHandle = () => {
    navigate("/returnInvoice");
  };

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
      <ReactToPrint
        trigger={() => (
              // selected ? (
              <button className="printButton">
                Print / Download
              </button>
              // ):(<h1></h1>)
            )}
            content={() => returnRef.current}
          />
     </div>
     <div  className="previewTableContent"> 
          <div  ref={returnRef} className="previewInvoice"  
                    style={{  border: "2px solid black",
                      margin: '10px',
                      display: "flex",
                      padding: "15px",
                      paddingBottom: "0px",
                      flexDirection: "column",
                      alignItems: "center",
                      }} >
            <Header  />
            <Dates />
            <Tablee />
            
          </div>
          </div>
 
      </div>
      </div>
    </>
  );
}
