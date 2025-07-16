// Printer.js
import React, { useEffect } from 'react';
// import "./thermalPrinter.css"
import PrintLaserTable from "../tableComponent/printLaserTable"
import logo from "./pos.png";
import QRCode from "react-qr-code";
import PrintTableComponent from '../tableComponent/printTableComponent';
import { COMPANYHEADER } from '../../constants/companyNameContants';
const ThermalPrinter = ({ headerLabel, headerData, labelData, labelData2, data, tableData, tableColumns, action,footerLabel, footerData }) => {

    useEffect(()=>{
      console.log(labelData)
      console.log(data)
      console.log(headerData)
        console.log(tableData)
        console.log(tableColumns)
    }, [tableData, tableColumns])
  return (<>
        <div className="headerr" style={{ alignContent:"center", alignItems:"center", height: "100px"}}>
          <h3 style={{ marginTop: "0px"}}>{COMPANYHEADER}</h3>
          {headerLabel?.map((label, index) => (
              // <div  key={index} >
                  <p key={index} style={{marginTop:"-10px", fontSize: "12px",}}>{label.label}&nbsp;&nbsp;{headerData[label.key]}</p>
              // </div>
          ))}
        </div>
        <div style={{width: "100%", border: "1px solid black", marginTop: "-8px"}}></div>
      <div className="dates">
      {labelData?.map((label, index) => (
        <div key={index}>
          {/* <div > */}
          {data[label.key] !== "" &&
            <p style={{fontSize: "12px", whiteSpace: "nowrap", marginTop: "8px", fontStyle: "bold"}}>{label.label}&nbsp;{data[label.key]}</p>
          }
        </div>
      ))}
    </div>
    <div style={{width: "100%", border: "1px solid black", marginTop: "-8px"}}></div>
    <PrintTableComponent data={tableData} columns={tableColumns} action4={action} />
    {data?.fbrInvoiceNumber === "" ? (
        <h1></h1>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "row",}} 
        >
          <div style={{ display: "flex", flexDirection: "row", border: "1px solid black", width: "100%", paddingTop: "15px"}}>
            <div>
            {footerLabel?.map((label, index) => (
              <div key={index}>
                <div>
                  <p style={{fontSize: "12px",marginLeft: "5px",marginTop: "-10px",  fontStyle: "bold"}}>{label.label}&nbsp;  {footerData[label.key]}</p>
                </div>
              </div>
            ))}
            </div>
            <div   style={{ marginLeft: "15px" }}>
            {data?.fbrInvoiceNumber && ( <QRCode
            style={{ height: "77px", width: "77px", marginLeft: "15px" }}
            value={data?.fbrInvoiceNumber}
          />)}
           

            </div>
             
          </div>
          {/* <img src={logo} alt="Logo" style={{ height: "80px" }} /> */}
         
        </div>
      )} 
        {/* <div className="headerHeading">
          <h1 className="invoiceTitle">Qureshi Electronics</h1>
          {headerLabel.map((label, index) => (
              <div key={index} className='consolidateHeaderThermalColumn'>
                  <p className="invoiceAddress">{label.label}&nbsp;{headerData[label.key]}</p>
                
              </div>
          ))}
        </div>
     <div className="ThermalPrinter">
      <div className='InvoiceThermalFirstRecord'>
      {labelData.map((label, index) => (
        <div key={index} className='consolidateThermalColumn'>
          <div className="consolidateThermalQuantity">
            <h5>{label.label}&nbsp;</h5>
            <p>{data[label.key]}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
    <PrintTableComponent data={tableData} columns={tableColumns} action4={action} />
    {data?.fbrInvoiceNumber === "" ? (
        <h1></h1>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "30px" }} 
        >
          <img src={logo} alt="Logo" style={{ height: "80px" }} />
          <QRCode
            style={{ height: "77px", width: "77px", marginLeft: "10px" }}
            value={data?.fbrInvoiceNumber}
          />
        </div>
      )} */}
    </>
  );
};

export default ThermalPrinter;
