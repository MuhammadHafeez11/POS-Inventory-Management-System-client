import { useContext, useState, useEffect } from "react";
import { Statee } from "../../context/stateContext";

export default function Header({ selectedPrinter }) {
  const { salesId,expenseId, setSalesId, storageAddress, storagePhoneNo } =
    useContext(Statee);
    console.log(storageAddress, storagePhoneNo);
    
  return (
    <>
      <div className="headerHeading">
          <h1 className="invoiceTitle">Qureshi Electronics</h1>
          {/* <p className="invoiceAddress"> {storageAddress}</p>
          <p className="invoicePhoneNo">
            <p>
              Phone No:
              {storagePhoneNo}
            </p>
          </p> */}
        </div>
    {/* {
      selectedPrinter === "laser" ?
      (<header  style={{ display: "flex", justifyContent: "center", borderBottom: "2px solid black" }}>
      <div>
        <h1
          className="font-bold uppercase tracking-wide text-4xl mb-3"
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "20px", 
            marginTop: "-15px",
            marginBottom: "-5px",
          }}
        >
          Qureshi Electronics
        </h1>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "16px", // Decrease the font size to 16px
            marginTop: "0px",
            marginTop: "0px",
          }}
        >
          {storageAddress}
        </p>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "16px", // Decrease the font size to 16px
            marginTop: "0px",
            marginBottom: "0px",
          }}
        >
          {storagePhoneNo && (
            <span
              style={{
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                fontSize: "16px", // Decrease the font size to 16px
                marginTop: "0px",
                marginBottom: "0px",
              }}
            >
              Phone No: &nbsp;
            </span>
          )}
          {storagePhoneNo}
        </p>
      </div>
    </header>
    ) : (
      <header style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <h1
            className="font-bold uppercase tracking-wide text-4xl mb-3"
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "14px", // Decrease the font size to 16px
              marginTop: "-15px",
              marginBottom: "-5px",
            }}
          >
            Qureshi Electronics
          </h1>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "10px", // Decrease the font size to 16px
              marginTop: "0px",
              marginTop: "0px",
            }}
          >
            {storageAddress}
          </p>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "10px", // Decrease the font size to 16px
              marginTop: "0px",
              marginBottom: "0px",
            }}
          >
            {storagePhoneNo && (
              <span
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "10px", // Decrease the font size to 16px
                  marginTop: "0px",
                  marginBottom: "0px",
                }}
              >
                Phone No: &nbsp;
              </span>
            )}
            {storagePhoneNo}
          </p>
        </div>
      </header>
    )
    } */}
      
    </>
  );
}
