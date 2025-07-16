import { GET_RETURN_PRODUCTS_FAIL, GET_RETURN_PRODUCTS_REQUEST, GET_RETURN_PRODUCTS_SUCCESS } from "../constants/returnConstants";
import axiosInstance from "./baseURL";


export const postReturnProducts = async( 
  customerName,
  customerNumber,
  address,
  phoneNo,
  total,
  returnBy,
  saleInvoiceNo,
  TotalQuantity,
  totalDiscount,
  TotalSaleValue,
  TotalTaxCharged,
  products,
  shopNo,
  fbrTotalReturnAmount, fbrTotalBillAmount
     )=> {
      try {
        console.log( 
          "name", customerName,
          "number",customerNumber,
          "address",address,
          "no",phoneNo,
          "total",total,
          "return", returnBy,
          "totalQuantity",TotalQuantity,
          "totalDiscount", totalDiscount,
          "totalSale", TotalSaleValue,
          "totalTax",TotalTaxCharged,
          "products", products,
          "shop",shopNo
        )
          const response = await axiosInstance.post(
            "/api/returnProduct/newReturn",
            {      
              customerName,
              customerNumber,
              address,
              phoneNo,
              total,
              returnBy,
              saleInvoiceNo,
              TotalQuantity,
              totalDiscount,
              TotalSaleValue,
              TotalTaxCharged,
              products,
              shopNo,
              fbrTotalReturnAmount, fbrTotalBillAmount
            }
          );
          console.log(response)
          return response?.data
     
      } catch (error) {
         console.log(error)
      }
     }


  
export const postWithoutFBRReturn = async( 
  customerName,
  customerNumber,
  address,
  phoneNo,
  total,
  returnBy,
  saleInvoiceNo,
  TotalQuantity,
  totalDiscount,
  TotalSaleValue,
  TotalTaxCharged,
  products,
  shopNo
     )=> {
      try {
        console.log( 
          "name", customerName,
          "number",customerNumber,
          "address",address,
          "no",phoneNo,
          "total",total,
          "return", returnBy,
          "totalQuantity",TotalQuantity,
          "totalDiscount", totalDiscount,
          "totalSale", TotalSaleValue,
          "totalTax",TotalTaxCharged,
          "products", products,
          "shop",shopNo
        )
          const response = await axiosInstance.post(
            "/api/returnProduct/newWithoutFBRReturn",
            {      
              customerName,
              customerNumber,
              address,
              phoneNo,
              total,
              returnBy,
              saleInvoiceNo,
              TotalQuantity,
              totalDiscount,
              TotalSaleValue,
              TotalTaxCharged,
              products,
              shopNo
            }
          );
          console.log(response)
          return response?.data
     
      } catch (error) {
         console.log(error)
      }
     }
     
     export const getReturnRecord = () => async (dispatch) => {
      try {
        dispatch({ type: GET_RETURN_PRODUCTS_REQUEST });
        const { data } = await axiosInstance.get("/api/returnProduct/get");
        dispatch({
          type: GET_RETURN_PRODUCTS_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: GET_RETURN_PRODUCTS_FAIL,
          payload: error.response,
        });
      }
    };

    export const getSpecificReturnProduct = async (id) => {
      try {
        const data = await axiosInstance.get(`/api/returnProduct/get/${id}`);
        return data;
      } catch (error) {
        // console.warn(error);
        // throw new Error("Failed to fetch specific sale product");
      }
    };