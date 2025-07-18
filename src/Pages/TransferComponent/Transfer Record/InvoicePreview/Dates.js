import { useContext, useState, useEffect } from "react";
import { State } from "../context/ContextSales";
// import { getTransferDetailsForPreview } from "../../actions/transferAction";
import { getTransferDetailsForPreview } from "../../../../actions/transferAction";
export default function Dates({ selectedPrinter }) {
  const [invoicedata, setInvoicedata] = useState([]);
  const [loading, setLoading] = useState(false);
  const { salesId, setSalesId, salesRef } = useContext(State);
  useEffect(() => {
    getspecificDataforInvoice();
  }, []);

  const getspecificDataforInvoice = async () => {
    try {
      // const response = await baseQuery(
      //   {
      //     url: `/api/transferProduct/get/${salesId}`,
      //     method: "GET",
      //   },
      //   {
      //     getState: () => ({
      //       auth: {
      //         token: JSON.parse(localStorage.getItem("accessToken")),
      //       },
      //     }),
      //   }
      // );
      // const result = await response.data;
      const result = await getTransferDetailsForPreview(salesId)
      console.log(result);
      setInvoicedata(result?.data);
      setLoading(true);
    } catch (error) {
      console.error("Failed to get specific data for invoice:", error);
      throw new Error("Failed to get specific data for invoice");
    }
  };
  return (
    <>
      {loading ? (
        <>
          {selectedPrinter === "thermal" ? (
            <>
              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginTop: "-30px",
                  marginBottom: "0px",
                  whiteSpace: "nowrap",
                }}
              ></div>
              <table
                className="table1"
                style={{ fontSize: "10px", whiteSpace: "nowrap" }}
              >
                <tr style={{ marginTop: "-10px", marginBottom: "0px" }}>
                  <td className=" td1">
                    <span className="font-bold td1"> Transfer from : </span>{" "}
                    {invoicedata?.tranferFrom}
                  </td>
                </tr>
                <tr style={{ marginTop: "-10px", marginBottom: "0px" }}>
                  <td>
                    <span className="font-bold td1">Invoicer number:</span>{" "}
                    {invoicedata?.id}
                  </td>
                </tr>
                <tr style={{ marginTop: "-10px", marginBottom: "0px" }}>
                  <td className=" td1">
                    <span className="font-bold td1">Transfer To : </span>{" "}
                    {invoicedata?.transferTo}
                  </td>
                </tr>
                <tr style={{ marginTop: "-10px", marginBottom: "0px" }}>
                  <td>
                    <span className="font-bold td1">Invoice date:</span>
                    {new Date(invoicedata?.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                </tr>
                <tr style={{ marginTop: "-10px", marginBottom: "0px" }}>
                  <td className=" td1">
                    <span className="font-bold td1">Generated By: </span>{" "}
                    {invoicedata?.transferBy}
                  </td>
                </tr>
              </table>
            </>
          ) : (
            <>
             <div style={{margin: "20px"}} className="mainDiv">
          <div className="DatesFirstDiv">
            <div className="firstDiv">
              <h5 style={{fontFamily: "Calibri"}}>Transfer from:</h5>
              <p>{invoicedata?.tranferFrom}</p>
            </div>
            <div className="secondDiv">
              <h5 style={{fontFamily: "Calibri"}}>Transfer To:</h5>
              <p>{invoicedata?.transferTo}</p>
            </div>
          </div>
          <div className="DatesFirstDiv">
            <div className="firstDiv">
              <h5 style={{fontFamily: "Calibri"}}>Generated By:</h5>
              <p> {invoicedata?.transferBy}</p>
            </div>
            <div className="secondDiv">
              <h5 style={{fontFamily: "Calibri"}}>Invoicer number:</h5>
              <p> {invoicedata?.id}</p>
            </div>
          </div>
          <div className="DatesFirstDiv">
            <div className="firstDiv">
              <h5>Invoice date:</h5>
              <p> {new Date(invoicedata?.createdAt).toLocaleDateString(
                      "en-GB"
                    )}</p>
            </div>
          
       
          </div>
          
          </div>
            {/* <div className="InvoiceSecondCont">
                <div className="InvoiceThirdCont">
                  <div className="consolidatetransferLaserdivs">
                  <h5>Transfer from:&nbsp;</h5>
                  <p>{invoicedata?.tranferFrom}</p>
                  </div>
                  <div className="consolidatetransferLaserdivs">
                  <h5>Transfer To:&nbsp;</h5>
                  <p> {invoicedata?.transferTo}</p>
                  </div>
                  <div className="consolidatetransferLaserdivs">
                  <h5>Generated By:&nbsp;</h5>
                  <p> {invoicedata?.transferBy}</p>
                  </div>
                </div>
                <div className="InvoicefourCont">
                  <div className="consolidatetransferSecondLaserdivs">
                    <h5>Invoicer number:&nbsp;</h5>
                    <p> {invoicedata?.id}</p>
                  </div>
                  <div className="consolidatetransferSecondLaserdivs">
                  <h5>Invoice date:&nbsp;</h5>
                  <p>{new Date(invoicedata?.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>
                </div>
              </div> */}
              {/* <div className="InvoiceLaserFirstRecordDiv">
                <div className="consolidateLaserQuantity">
                  <h5>Transfer from :</h5>
                  <p>{invoicedata?.tranferFrom}</p>
                </div>
                <div className="consolidateLaserProductCode">
                  <h5>Invoicer number:</h5>
                  <p> {invoicedata?.id}</p>
                </div>
              </div>
              <div className="InvoiceLaserFirstRecordDiv">
                <div className="consolidateLaserQuantity">
                  <h5>Transfer To :</h5>
                  <p> {invoicedata?.transferTo}</p>
                </div>
                <div className="consolidateLaserProductCode">
                  <h5>Invoice date:</h5>
                  <p>
                    {new Date(invoicedata?.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  </p>
                </div>
              </div>
              <div className="InvoiceLaserFirstRecordDiv">
                <div className="consolidateLaserQuantity">
                  <h5>Generated By:</h5>
                  <p> {invoicedata?.transferBy}</p>
                </div>
              </div> */}
            </>
           
          )}
        </>
      ) : (
        <h1></h1>
      )}
    </>
  );
}
