// Printer.js
import React, { useEffect } from 'react';
// import "./laserPrinter.css"
import PrintLaserTable from "../tableComponent/printLaserTable"
import logo from "./pos.png";
// import QRCodee from "./QRCode";
import QRCode from "react-qr-code";
import { COMPANYHEADER } from '../../constants/companyNameContants';
const Printer = ({ headerLabel, headerData, labelData,labelData2,labelData3, data, tableData, tableColumns, action }) => {

    useEffect(()=>{
        console.log(tableData)
        console.log(tableColumns)
    }, [tableData, tableColumns])
  return (<>

        <div className="headerHeading">
          <h1 className="invoiceTitle">{COMPANYHEADER}</h1>
          {headerLabel.map((label, index) => (
              <div key={index} className='consolidateHeaderLaserColumn'>
                  <p className="invoiceAddress">{label.label}&nbsp;{headerData[label.key]}</p>
                  {/* <h4></h4> */}
              </div>
          ))}
        </div>
     <div className="lasePrinter">
      <div className='InvoiceLaserFirstRecord'>
      {
        JSON.parse(localStorage.getItem('SoftwareWithFBR')) ? (<>
        {labelData?.map((label, index) => (
        <div key={index} className='consolidateLaserColumn'>
          <div className="consolidateLaserQuantity">
            <h5>{label.label}</h5>
            <p>{data[label.key]}</p>
          </div>
        </div>
      ))}
        </>): (<>
          {labelData3?.map((label, index) => (
        <div key={index} className='consolidateLaserColumn'>
          <div className="consolidateLaserQuantity">
            <h5>{label.label}</h5>
            <p>{data[label.key]}</p>
          </div>
        </div>
      ))}</>)
      }
      
      </div>
      <div className='InvoiceLaserFirstRecord'>
      { JSON.parse(localStorage.getItem('SoftwareWithFBR')) &&(<> 
      {labelData2?.map((label, index) => (
        <div key={index} className="consolidateLaserColumn">
          <div className="consolidateLaserQuantity">
            <h5>{label.label}</h5>
            <p>{data[label.key]}</p>
          </div>
        </div>
      ))}</>)  }
     
       
       </div>
    </div>
    <div className="printTable">
    <PrintLaserTable data={tableData} columns={tableColumns} action4={action} />
    </div>
    {
      JSON.parse(localStorage.getItem('SoftwareWithFBR')) && (<>
    {data?.fbrInvoiceNumber === "" ? (
        <h1></h1>
      ) : (
        <div className="bottomGrand">
          <img src={logo} alt="Logo" style={{ height: "80px" }} />
          <QRCode
            style={{ height: "77px", width: "77px", marginLeft: "10px" }}
            value={data?.fbrInvoiceNumber}
          />
        </div>
      )}
      </>)
    }
    
    </>
  );
};

export default Printer;
