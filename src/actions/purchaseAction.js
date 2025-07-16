import {
  ALL_PURCHASE_FAIL,
  ALL_PURCHASE_POST_FAIL,
  ALL_PURCHASE_POST_REQUEST,
  ALL_PURCHASE_POST_SUCCESS,
  ALL_PURCHASE_REQUEST,
  ALL_PURCHASE_SUCCESS,
  GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_FAIL,
  GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL,
  GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST,
  GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS,
  GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_REQUEST,
  GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
  GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL,
  GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL,
  GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST,
  GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS,
  GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST,
  GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
} from "../constants/puchaseConstants";
import axios from "axios";
import axiosInstance from "./baseURL"
export const postPurchase =
  (productName, productDescription) => async (dispatch) => {
    try {
      dispatch({ type: ALL_PURCHASE_POST_REQUEST });
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axiosInstance.post(
        "/api/purchaseProduct/post",
        { productName, productDescription },
        config
      );
      dispatch({ type: ALL_PURCHASE_POST_SUCCESS, payload: data });
    } catch (error) {
      console.log(error.response);
      dispatch({ type: ALL_PURCHASE_POST_FAIL, payload: error.response });
    }
  };

export const addPurchase = async (
  clientName,
  purchaseReceiptNumber,
  purchaseCompany,
  purchaseDate,
  address,
  phoneNo,
  shopNo,
  storeIn,
  purchasedBy,
  listpurchase,
  total,
  tempLocQuantityList,
  tempLocProductItemlist,
  pendingId
) => {
  try {
    console.log(listpurchase, tempLocQuantityList)
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      "/api/purchaseProduct/post",
      {
        clientName,
        purchaseReceiptNumber,
        purchaseCompany,
        purchaseDate,
        address,
        phoneNo,
        shopNo,
        storeIn,
        purchasedBy,
        listpurchase,
        total,
        tempLocQuantityList,
        tempLocProductItemlist,
        pendingId
      },
      config
    );

    return data;
  } catch (error) {
    console.log(error);
    return error?.response
  }
};

export const postPurchaseRecord = (  clientName,
  purchaseReceiptNumber,
  purchaseCompany,
  purchaseDate,
  address,
  phoneNo,
  shopNo,
  storeIn,
  purchasedBy,
  listpurchase,
  total) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PURCHASE_POST_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post("/api/purchaseProduct/post",
    {
      clientName,
      purchaseReceiptNumber,
      purchaseCompany,
      purchaseDate,
      address,
      phoneNo,
      shopNo,
      storeIn,
      purchasedBy,
      listpurchase,
      total,
    },
    config);
    dispatch({
      type: ALL_PURCHASE_POST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PURCHASE_POST_FAIL,
      payload: error.response,
    });
  }
};

export const getPurchaseRecord = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_PURCHASE_REQUEST });
    const { data } = await axiosInstance.get("/api/purchaseProduct/get");
    dispatch({
      type: ALL_PURCHASE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PURCHASE_FAIL,
      payload: error.response,
    });
  }
};
export const getPurchaseConsolidatedRecord = async () => {
  try {
    const { data } = await axiosInstance.get("/api/purchaseProduct/get");
    return data;
  } catch (error) {}
};

export const getPurchaseDetailForPreview = async (salesId) => {
  try {
    const data = await axiosInstance.get(`/api/purchaseProduct/get/${salesId}`);
    return data;
  } catch (error) {
    // console.warn(error);
    throw new Error("Failed to fetch purchase details");
  }
};

// export const getPurchaseRecordForConsolidated = async () => {
//   try {
//     const { data } = await axiosInstance.get("/api/purchaseProduct/get");
//     return data;
//   } catch (error) {}
// };

// export const getPurchaseRecordForConsolidated = async (timePeriod) => {
//   try {
//     const { data } = await axiosInstance.get(`/api/purchaseProduct/getPurchaseRecordForConsolidated?option=${timePeriod}`);
//     return data;
//   } catch (error) {}
// };

export const getPurchaseRecordForConsolidated = (timePeriod)=>async (dispatch) => {
  try {
    dispatch({ type: GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_REQUEST });
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getPurchaseRecordForConsolidated?option=${timePeriod}`);
    // return data;
    dispatch({
      type: GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
      payload: data,
    });
    
  } catch (error) {
    dispatch({
      type: GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_FAIL,
      payload: error.response,
    });
  }
};






// export const getPurchaseRecordForConsolidatedForSpecificShop = async (shopNo, timePeriod) => {
//   try {
//     console.log(timePeriod)
//     const { data } = await axiosInstance.get(`/api/purchaseProduct/getPurchaseRecordForConsolidatedForShop/${shopNo}?option=${timePeriod}`);
//     console.log(data)
//     return data;
//   } catch (error) {}
// };

export const getPurchaseRecordForConsolidatedForSpecificShop =(shopNo, timePeriod)=> async (dispatch) => {
  try {
    console.log(timePeriod)
    dispatch({ type: GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST });
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getPurchaseRecordForConsolidatedForShop/${shopNo}?option=${timePeriod}`);
    console.log(data)
    dispatch({
      type: GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL,
      payload: error.response,
    });
  }
};

// export const getPurchaseRecordForConsolidatedOnDates = async (startingDate, endingDate) => {
//   try {
//     console.log(startingDate, endingDate)
//     const { data } = await axiosInstance.get(`/api/purchaseProduct/getPurchaseRecordForConsolidated?starting=${startingDate}&ending=${endingDate}`);
//     return data;
//   } catch (error) {}
// };
export const getPurchaseRecordForConsolidatedOnDates =(startingDate, endingDate)=> async (dispatch) => {
  try {
    dispatch({ type: GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST });
    console.log(startingDate, endingDate)
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getPurchaseRecordForConsolidated?starting=${startingDate}&ending=${endingDate}`);
    dispatch({
      type: GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL,
      payload: error.response,
    });
  }
};

export const getPurchaseRecordForConsolidatedForSpecificShopOnDate =(shopNo, startingDate, endingDate)=> async (dispatch) => {
  try {
    dispatch({ type: GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST });
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getPurchaseRecordForConsolidatedForShop/${shopNo}?starting=${startingDate}&ending=${endingDate}`);
    dispatch({
      type: GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL,
      payload: error.response,
    });
  }
};