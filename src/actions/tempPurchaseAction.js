import {
  ALL_TEMP_PURCHASE_DELETE_FAIL,
  ALL_TEMP_PURCHASE_DELETE_REQUEST,
  ALL_TEMP_PURCHASE_DELETE_SUCCESS,
  ALL_TEMP_PURCHASE_FAIL,
  ALL_TEMP_PURCHASE_REQUEST,
  ALL_TEMP_PURCHASE_SUCCESS,
  POST_TEMP_PURCHASE_FAIL,
  POST_TEMP_PURCHASE_REQUEST,
  POST_TEMP_PURCHASE_SUCCESS,
  TEMP_PURCHASE_DETAILS_FAIL,
  TEMP_PURCHASE_DETAILS_REQUEST,
  TEMP_PURCHASE_DETAILS_SUCCESS,
  TEMP_PURCHASE_ITEM_DELETE_FAIL,
  TEMP_PURCHASE_ITEM_DELETE_REQUEST,
  TEMP_PURCHASE_ITEM_DELETE_SUCCESS,
  TEMP_PURCHASE_ON_SHOP_FAIL,
  TEMP_PURCHASE_ON_SHOP_REQUEST,
  TEMP_PURCHASE_ON_SHOP_SUCCESS,
  UPDATE_TEMP_PURCHASE_PRODUCTS_FAIL,
  UPDATE_TEMP_PURCHASE_PRODUCTS_REQUEST,
  UPDATE_TEMP_PURCHASE_PRODUCTS_SUCCESS,
} from "../constants/tempPurchaseConstants";
import axios from "axios";
import axiosInstance from "./baseURL"
export const getTempPurchase = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_TEMP_PURCHASE_REQUEST });
    const { data } = await axiosInstance.get("/api/purchaseProduct/getTemp");
    console.log(data);
    dispatch({
      type: ALL_TEMP_PURCHASE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_TEMP_PURCHASE_FAIL,
      payload: error.response,
    });
  }
};

export const getTemporaryPurchase = async () => {
  try {
    const { data } = await axiosInstance.get("/api/purchaseProduct/getTemp");
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getTemporaryPurchaseOnShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: TEMP_PURCHASE_ON_SHOP_REQUEST });
    const { data } = await axiosInstance.get(
      `/api/purchaseProduct/getTemporaryPurchase/${id}`
    );
    console.log(data);
    dispatch({
      type: TEMP_PURCHASE_ON_SHOP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TEMP_PURCHASE_ON_SHOP_FAIL,
      payload: error.response,
    });
  }
};

export const getTemporaryPurchaseDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: TEMP_PURCHASE_DETAILS_REQUEST });
    const { data } = await axiosInstance.get(
      `/api/purchaseProduct/getTempPurchase/${id}`
    );
    console.log(data);
    dispatch({
      type: TEMP_PURCHASE_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TEMP_PURCHASE_DETAILS_FAIL,
      payload: error.response,
    });
  }
};

export const postTempPurchase =
  (
    clientName,
    purchaseReceiptNumber,
    purchaseCompany,
    purchaseDate,
    shopNo,
    storeIn,
    address,
    phoneNo,
    shopId,
    godownId,
    purchasedBy,
    products
  ) =>
  async (dispatch) => {
    try {
      
      dispatch({ type: POST_TEMP_PURCHASE_REQUEST });
      console.log(products);
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axiosInstance.post(
        "/api/purchaseProduct/createTemporaryPurcahse",
        {
          clientName,
          purchaseReceiptNumber,
          purchaseCompany,
          purchaseDate,
          address,
          phoneNo,
          shopNo,
          storeIn,
          shopId,
          godownId,
          purchasedBy,
          products,
        },
        config
      );
      dispatch({ type: POST_TEMP_PURCHASE_SUCCESS, payload: data });
    } catch (error) {
      console.log(error.response);
      dispatch({ type: POST_TEMP_PURCHASE_FAIL, payload: error.response });
    }
  };

export const deleteTempPendingsFromTable = async (id) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.delete(
      `/api/purchaseProduct/deleteFromPendings/${id}`
    );
    return data;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

export const deleteAllTempPurchase = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_TEMP_PURCHASE_DELETE_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.delete(
      `/api/purchaseProduct/deletePurchaseTemp/${id}`
    );
    dispatch({ type: ALL_TEMP_PURCHASE_DELETE_SUCCESS, payload: data });
  } catch (error) {
    console.log(error.response);
    dispatch({ type: ALL_TEMP_PURCHASE_DELETE_FAIL, payload: error.response });
  }
};

export const deleteTempPurchaseItem = (id) => async (dispatch) => {
  try {
    dispatch({ type: TEMP_PURCHASE_ITEM_DELETE_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.delete(
      `/api/purchaseProduct/deleteTempPurchaseProduct/${id}`
    );
    dispatch({ type: TEMP_PURCHASE_ITEM_DELETE_SUCCESS, payload: data });
  } catch (error) {
    console.log(error.response);
    dispatch({ type: TEMP_PURCHASE_ITEM_DELETE_FAIL, payload: error.response });
  }
};

export const updateTempPurchaseProducts =
  (
    id1,
    id,
    Code,
    Color,
    Namee,
    Company,
    productColor,
    PurchaseQuantity,
    purchasePrice,
    MRP,
    purchaseQuantityPrice,
    purchaseTotalTax,
    expeseTotal,
    discountValue,
    purchaseProductTotalAmount,
    invoicePrice,
    purchaseProductPriceExcludeTax,
    purchaseProductDiscount,
    expense,
    purchaseProductTax,
    purchaseTotalAmount,
    amount,
    quantityidset,
    locationsetid,
    salesmanSalePrice,
    minimumSalePrice
  ) =>
  async (dispatch) => {
    try {
      dispatch({ type: UPDATE_TEMP_PURCHASE_PRODUCTS_REQUEST });
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axiosInstance.put(
        `/api/purchaseProduct/updateTempPurchase/${id1}`,
        {
          id,
          Code,
          Color,
          Namee,
          Company,
          productColor,
          PurchaseQuantity,
          purchasePrice,
          MRP,
          purchaseQuantityPrice,
          purchaseTotalTax,
          expeseTotal,
          discountValue,
          purchaseProductTotalAmount,
          invoicePrice,
          purchaseProductPriceExcludeTax,
          purchaseProductDiscount,
          expense,
          purchaseProductTax,
          purchaseTotalAmount,
          amount,
          quantityidset,
          locationsetid,
          salesmanSalePrice,
          minimumSalePrice
        },
        config
      );
      dispatch({ type: UPDATE_TEMP_PURCHASE_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: UPDATE_TEMP_PURCHASE_PRODUCTS_FAIL,
        payload: error.response,
      });
    }
  };
