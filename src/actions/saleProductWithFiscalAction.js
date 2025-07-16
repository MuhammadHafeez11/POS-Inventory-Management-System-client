
import { POST_SALE_FBR_PRODUCT_FAIL, POST_SALE_FBR_PRODUCT_REQUEST, POST_SALE_FBR_PRODUCT_SUCCESS, POST_SALE_PRODUCT_FAIL, POST_SALE_PRODUCT_REQUEST, POST_SALE_PRODUCT_SUCCESS, POST_SALE_PRODUCT_TO_FISCAL_FAIL, POST_SALE_PRODUCT_TO_FISCAL_REQUEST, POST_SALE_PRODUCT_TO_FISCAL_SUCCESS } from "../constants/saleConstants";

import fbrAxiosInstance from "./FBRBaseURl";
import axiosInstance from "./baseURL"
import axios from "axios";
// import https from "https";

export const postSaleProductWithFiscal = async(  
  // fbrAccessToken,
  InvoiceNumber,
  POSID,
  USIN,
  DateTime,
  TotalBillAmount,
  TotalQuantity,
  Discount,
  TotalSaleValue,
  TotalTaxCharged,
  PaymentMode,
  RefUSIN,
  InvoiceType,
  Items
   )=> {
    try {
      console.log(  
        InvoiceNumber,
        POSID,
        USIN,
        DateTime,
        TotalBillAmount,
        TotalQuantity,
        Discount,
        TotalSaleValue,
        TotalTaxCharged,
        PaymentMode,
        RefUSIN,
        InvoiceType,
        Items
      )
      // console.log(fbrAccessToken)
      // const response = await axiosInstance.post("/IMSFiscal/GetInvoiceNumberByModel", {
        // const fbrUrl = "https://esp.fbr.gov.pk:8244/FBR/v1/api/Live/PostData";
        // const response = await axios.post(
        //   fbrUrl,
        //   {
        //     InvoiceNumber,
        //     POSID,
        //     USIN,
        //     DateTime,
        //     TotalBillAmount,
        //     TotalQuantity,
        //     Discount,
        //     TotalSaleValue,
        //     TotalTaxCharged,
        //     PaymentMode,
        //     RefUSIN,
        //     InvoiceType,
        //     Items,
        //   },{
        //     headers: {
        //             "Content-Type": "application/json",
        //            Authorization: `Bearer ${fbrAccessToken}`
        //           },
        //   }
        // );
        // console.log(response)
        // const response = await fetch(
        //   "https://esp.fbr.gov.pk:8244/FBR/v1/api/Live/PostData",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${fbrAccessToken}`
        //     },
        //     body: JSON.stringify({
        //       InvoiceNumber,
        //       POSID,
        //       USIN,
        //       DateTime,
        //       TotalBillAmount,
        //       TotalQuantity,
        //       Discount,
        //       TotalSaleValue,
        //       TotalTaxCharged,
        //       PaymentMode,
        //       RefUSIN,
        //       InvoiceType,
        //       Items,
        //     }),
        //   }
        // );
        // const data = await response.json();
        const response = await fetch(
          "http://localhost:8524/api/IMSFiscal/GetInvoiceNumberByModel",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              InvoiceNumber,
              POSID,
              USIN,
              DateTime,
              TotalBillAmount,
              TotalQuantity,
              Discount,
              TotalSaleValue,
              TotalTaxCharged,
              PaymentMode,
              RefUSIN,
              InvoiceType,
              Items,
            }),
          }
        );
        const data = await response.json();
        console.log(data)
        return data
   
    } catch (error) {
       console.log(error)
      //  dispatch({type: POST_SALE_PRODUCT_TO_FISCAL_FAIL, payload: error.response.data.message})
    }
   }


   export const postFBRData = async(  
    // fbrAccessToken,
    InvoiceNumber,
    POSID,
    USIN,
    DateTime,
    TotalBillAmount,
    TotalQuantity,
    Discount,
    TotalSaleValue,
    TotalTaxCharged,
    PaymentMode,
    RefUSIN,
    InvoiceType,
    shopNo,
    customerName,
    customerNumber,
    serialNumber,
    address,
    phoneNo,
    saleBy,
    payments,
    paymentStatus,
    remainingDuesDate,
    list,
    total,
    tempLocQuantityList,
    pendingId,
    fbrTotalSaleAmount,
    fbrTotalBillAmount,
     )=> {
      try {
        // console.log(  
        //   InvoiceNumber,
        //   POSID,
        //   USIN,
        //   DateTime,
        //   TotalBillAmount,
        //   TotalQuantity,
        //   Discount,
        //   TotalSaleValue,
        //   TotalTaxCharged,
        //   PaymentMode,
        //   RefUSIN,
        //   InvoiceType,
        //   shopNo,
        //   customerName,
        //   customerNumber,
        //   serialNumber,
        //   address,
        //   phoneNo,
        //   fbrTotalSaleAmount,
        //   fbrTotalBillAmount,
        // )
        // console.log(fbrAccessToken)
          const response = await axiosInstance.post(
            "/api/saleProduct/postFBRData",
            {
              InvoiceNumber,
              POSID,
              USIN,
              DateTime,
              TotalBillAmount,
              TotalQuantity,
              Discount,
              TotalSaleValue,
              TotalTaxCharged,
              PaymentMode,
              RefUSIN,
              InvoiceType,
              shopNo,
              customerName,
              customerNumber,
              serialNumber,
              address,
              phoneNo,
              saleBy,
              payments,
              paymentStatus,
              remainingDuesDate,
              list,
              total,
              tempLocQuantityList,
              pendingId,
              fbrTotalSaleAmount,
          fbrTotalBillAmount,
            }
          );
          console.log(response)
          return response?.data
     
      } catch (error) {
         console.log(error)
         return error
      }
     }
  

   export const postSaleProductWithFiscalFBR = (  
    InvoiceNumber,
    POSID,
    USIN,
    DateTime,
    TotalBillAmount,
    TotalQuantity,
    Discount,
    TotalSaleValue,
    TotalTaxCharged,
    PaymentMode,
    RefUSIN,
    InvoiceType,
    Items
    )=> async(dispatch)=>{
     try {

      dispatch({ type: POST_SALE_FBR_PRODUCT_REQUEST });
      // const url = "https://esp.fbr.gov.pk:8244/FBR/v1/api/Live/PostData"
      const url = "http://localhost:8524/api/IMSFiscal/GetInvoiceNumberByModel"
      // const url = "https://gw.fbr.gov.pk/imsp/v1/api/Live/PostData"
      
       const response = await fetch(
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 1298b5eb-b252-3d97-8622-a4a69d5bf818` 
              // Authorization: `Bearer 87dde0c9-d949-305e-8e2c-e6a74a610c38`
            },
            body: JSON.stringify({
              InvoiceNumber,
              POSID,
              USIN,
              DateTime,
              TotalBillAmount,
              TotalQuantity,
              Discount,
              TotalSaleValue,
              TotalTaxCharged,
              PaymentMode,
              RefUSIN,
              InvoiceType,
              Items,
            }),
          }
        );
        const data = await response.json();
        console.log(data)
        dispatch({
          type: POST_SALE_FBR_PRODUCT_SUCCESS,
          payload: data,
        });
     } catch (error) {
        console.log(error.response)
        dispatch({type: POST_SALE_FBR_PRODUCT_FAIL, payload: error.response.data.message})
     }
    }