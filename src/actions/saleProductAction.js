import {
  GET_SALE_CONSOLIDATED_FOR_SHOPS_FAIL,
  GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL,
  GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST,
  GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS,
  GET_SALE_CONSOLIDATED_FOR_SHOPS_REQUEST,
  GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
  GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL,
  GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL,
  GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST,
  GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS,
  GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST,
  GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
  GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_FAIL,
  GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_REQUEST,
  GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_SUCCESS,
  GET_SALE_CREDIT_FAIL,
  GET_SALE_CREDIT_ON_SHOP_FAIL,
  GET_SALE_CREDIT_ON_SHOP_REQUEST,
  GET_SALE_CREDIT_ON_SHOP_SUCCESS,
  GET_SALE_CREDIT_REQUEST,
  GET_SALE_CREDIT_SINGLE_RECORD_FAIL,
  GET_SALE_CREDIT_SINGLE_RECORD_REQUEST,
  GET_SALE_CREDIT_SINGLE_RECORD_SUCCESS,
  GET_SALE_CREDIT_SUCCESS,
  GET_SALE_ON_INVOICE_NO_FAIL,
  GET_SALE_ON_INVOICE_NO_REQUEST,
  GET_SALE_ON_INVOICE_NO_SUCCESS,
  GET_SALE_PRODUCT_FAIL,
  GET_SALE_PRODUCT_REQUEST,
  GET_SALE_PRODUCT_SUCCESS,
  POST_SALE_PRODUCT_FAIL,
  POST_SALE_PRODUCT_REQUEST,
  POST_SALE_PRODUCT_SUCCESS,
  UPDATE_SALE_CREDIT_FAIL,
  UPDATE_SALE_CREDIT_REQUEST,
  UPDATE_SALE_CREDIT_SUCCESS,
} from "../constants/saleConstants";
import axios from "axios";
import axiosInstance from "./baseURL"
export const postSaleProductt = async (
  invoiceNumber,
  seqNo,
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
  pendingId
) => {
  try {
    console.log(  invoiceNumber,
      seqNo,
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
      pendingId)
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      "/api/saleProduct/post",
      {
        invoiceNumber,
        seqNo,
        shopNo,
        customerName,
        customerNumber,
        serialNumber: serialNumber !== "" ? Number(serialNumber) : null,
        address,
        phoneNo,
        saleBy,
        payments,
        paymentStatus,
        remainingDuesDate,
        list,
        total,
        tempLocQuantityList
      },
      config
    );

    return data;
  } catch (error) {
    console.log(error.response);
    return error
  }
};

export const postSaleProductRecord =  (
  InvoiceNumber,
  shopNo,
  clientName,
  clientAddress,
  serialNumber,
  address,
  phoneNo,
  saleBy,
  list,
  total
) => async(dispatch)=> {
  try {
    dispatch({ type: POST_SALE_PRODUCT_FAIL });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      "/api/saleProduct/post",
      {
        InvoiceNumber,
        shopNo,
        clientName,
        clientAddress,
        serialNumber,
        address,
        phoneNo,
        saleBy,
        list,
        total,
      },
      config
    );
    dispatch({
      type: POST_SALE_PRODUCT_SUCCESS,
      payload: data,
    });
    // return data;
  } catch (error) {
    console.log(error.response);
    dispatch({type: POST_SALE_PRODUCT_FAIL, payload: error.response.data.message})
  }
};

export const getSaleRecord = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_PRODUCT_REQUEST });
    const { data } = await axiosInstance.get("/api/saleProduct/get");
    dispatch({
      type: GET_SALE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_PRODUCT_FAIL,
      payload: error.response,
    });
  }
};

export const getSaleRecordOnShopCode = (shopCode) => async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_PRODUCT_REQUEST });
    const { data } = await axiosInstance.get(`/api/saleProduct/getOnShopCode/${shopCode}`);
    dispatch({
      type: GET_SALE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_PRODUCT_FAIL,
      payload: error.response,
    });
  }
};



export const getSaleOnInvoiceNo = (saleId) => async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_ON_INVOICE_NO_REQUEST });
    const { data } = await axiosInstance.get(`/api/returnProduct/getProductOnSaleId/${saleId}`);
    dispatch({
      type: GET_SALE_ON_INVOICE_NO_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_ON_INVOICE_NO_FAIL,
      payload: error.response,
    });
  }
};


export const getSaleConsolidatedRecord = async () => {
  try {
    const { data } = await axiosInstance.get("/api/saleProduct/get");
    return data;
  } catch (error) {}
};

export const getProductLocationOnShopAndProductId = async (
  productId,
  colorId,
  shopAvalibilityId
) => {
  try {
    console.log(productId);
    console.log(shopAvalibilityId);
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.get(
      `/api/saleProduct/getProductLocationOnShopAndProductId/${productId}/${colorId}/${shopAvalibilityId}`,
      config
    );
    return data;
  } catch (error) {}
};

export const getSpecificSaleProduct = async (salesId) => {
  try {
    const data = await axiosInstance.get(`/api/saleProduct/get/${salesId}`);
    return data;
  } catch (error) {
    // console.warn(error);
    // throw new Error("Failed to fetch specific sale product");
  }
};

// export const getSaleRecordForConsolidated = async (timePeriod) => {
//   try {
//     const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidated?option=${timePeriod}`);
//     return data;
//   } catch (error) {}
// };

export const getSaleRecordForConsolidated = (timePeriod)=> async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_CONSOLIDATED_FOR_SHOPS_REQUEST });
    const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidated?option=${timePeriod}`);
    dispatch({
      type: GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_CONSOLIDATED_FOR_SHOPS_FAIL,
      payload: error.response,
    });
  }
};



// export const getSaleRecordForConsolidatedForSpecificShop = async (shopNo, timePeriod) => {
//   try {
//     console.log(timePeriod)
//     const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidatedOnShop/${shopNo}?option=${timePeriod}`);
//     console.log(data)
//     return data;
//   } catch (error) {}
// };

export const getSaleRecordForConsolidatedForSpecificShop = (shopNo, timePeriod) =>async (dispatch) => {
  try {
    console.log(timePeriod)
    dispatch({ type: GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST });
    const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidatedOnShop/${shopNo}?option=${timePeriod}`);
    console.log(data)
    dispatch({
      type: GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL,
      payload: error.response,
    });
  }
};

// export const getSaleRecordForConsolidatedOnDates = async (startingDate, endingDate) => {
//   try {
//     console.log(startingDate, endingDate)
//     const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidated?starting=${startingDate}&ending=${endingDate}`);
//     return data;
//   } catch (error) {}
// };

export const getSaleRecordForConsolidatedOnDates = (startingDate, endingDate)=>  async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST });
    console.log(startingDate, endingDate)
    const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidated?starting=${startingDate}&ending=${endingDate}`);
    dispatch({
      type: GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL,
      payload: error.response,
    });
  }
};
// export const getSaleRecordForConsolidatedForSpecificShopOnDate = async (shopNo, startingDate, endingDate) => {
//   try {
//     const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidatedOnShop/${shopNo}?starting=${startingDate}&ending=${endingDate}`);
//     return data;
//   } catch (error) {}
// };

export const getSaleRecordForConsolidatedForSpecificShopOnDate = (shopNo, startingDate, endingDate)=> async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST });
    const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidatedOnShop/${shopNo}?starting=${startingDate}&ending=${endingDate}`);
    dispatch({
      type: GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL,
      payload: error.response,
    });
  }
};


export const getSaleRecordForConsolidatedForProfit = (timePeriod)=> async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_REQUEST });
    const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidatedForProfit?option=${timePeriod}`);
    dispatch({
      type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_FAIL,
      payload: error.response,
    });
  }
};


export const getSaleRecordForConsolidatedProfitForSpecificShop = (shopNo, timePeriod) =>async (dispatch) => {
  try {
    console.log(timePeriod)
    dispatch({ type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_REQUEST });
    const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidatedForProfitOnShop/${shopNo}?option=${timePeriod}`);
    console.log(data)
    dispatch({
      type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_FAIL,
      payload: error.response,
    });
  }
};

export const getSaleRecordForConsolidatedProfitOnDates = (startingDate, endingDate)=>  async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_REQUEST });
    console.log(startingDate, endingDate)
    const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidatedForProfit?starting=${startingDate}&ending=${endingDate}`);
    dispatch({
      type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_FAIL,
      payload: error.response,
    });
  }
};

export const getSaleRecordForConsolidatedProfitForSpecificShopOnDate = (shopNo, startingDate, endingDate)=> async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_REQUEST });
    const { data } = await axiosInstance.get(`/api/saleProduct/getRecordForConsolidatedForProfitOnShop/${shopNo}?starting=${startingDate}&ending=${endingDate}`);
    dispatch({
      type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_FAIL,
      payload: error.response,
    });
  }
};

export const getSingleSaleCreditRecord = (saleId) => async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_CREDIT_SINGLE_RECORD_REQUEST });
    const { data } = await axiosInstance.get(`/api/saleProduct/saleCredit/getSingleOnId/${saleId}`);
    dispatch({
      type: GET_SALE_CREDIT_SINGLE_RECORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_CREDIT_SINGLE_RECORD_FAIL,
      payload: error.response,
    });
  }
};

export const getSaleCreditRecord = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_CREDIT_REQUEST });
    const { data } = await axiosInstance.get("/api/saleProduct/saleCredit/getDataOnStatus");
    dispatch({
      type: GET_SALE_CREDIT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_CREDIT_FAIL,
      payload: error.response,
    });
  }
};

export const getSaleCreditOnShopRecord = (shopNo) => async (dispatch) => {
  try {
    dispatch({ type: GET_SALE_CREDIT_ON_SHOP_REQUEST });
    const { data } = await axiosInstance.get(`/api/saleProduct/saleCredit/getOnStatusAndShop/${shopNo}`);
    dispatch({
      type: GET_SALE_CREDIT_ON_SHOP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SALE_CREDIT_ON_SHOP_FAIL,
      payload: error.response,
    });
  }
};

export const updateSaleCreditPayment = (id,  payments, paymentStatus) => async (dispatch) => {
  try {
    console.log(payments)
    dispatch({ type: UPDATE_SALE_CREDIT_REQUEST });
    console.log(payments)
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } =await axiosInstance.put(`/api/saleProduct/saleCredit/updateSaleCreditPayment/${id}`, {
      payments,
      paymentStatus
    },
    config);
    dispatch({
      type: UPDATE_SALE_CREDIT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_SALE_CREDIT_FAIL,
      payload: error.response,
    });
  }
};