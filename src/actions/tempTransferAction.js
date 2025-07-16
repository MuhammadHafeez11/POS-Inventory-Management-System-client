import axios from "axios";
import {
  ALL_TEMP_TRANSFER_DELETE_FAIL,
  ALL_TEMP_TRANSFER_DELETE_REQUEST,
  ALL_TEMP_TRANSFER_DELETE_SUCCESS,
  ALL_TEMP_TRANSFER_FAIL,
  ALL_TEMP_TRANSFER_REQUEST,
  ALL_TEMP_TRANSFER_SUCCESS,
  DELETE_TEMP_TRANSFER_PRODUCT_FAIL,
  DELETE_TEMP_TRANSFER_PRODUCT_REQUEST,
  DELETE_TEMP_TRANSFER_PRODUCT_SUCCESS,
  POST_TEMP_TRANSFER_FAIL,
  POST_TEMP_TRANSFER_REQUEST,
  POST_TEMP_TRANSFER_SUCCESS,
  TEMP_TRANSFER_DETIALS_FAIL,
  TEMP_TRANSFER_DETIALS_REQUEST,
  TEMP_TRANSFER_DETIALS_SUCCESS,
  TEMP_TRANSFER_ON_SHOP_FAIL,
  TEMP_TRANSFER_ON_SHOP_REQUEST,
  TEMP_TRANSFER_ON_SHOP_SUCCESS,
  UPDATE_TEMP_TRANSFER_PRODUCT_ITEM_FAIL,
  UPDATE_TEMP_TRANSFER_PRODUCT_ITEM_REQUEST,
  UPDATE_TEMP_TRANSFER_PRODUCT_ITEM_SUCCESS,
} from "../constants/tempTransferConstants";
import axiosInstance from "./baseURL"
export const getTemppTransfer = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_TEMP_TRANSFER_REQUEST });
    const { data } = await axiosInstance.get("/api/transferProduct/getTemp");
    console.log(data);
    dispatch({
      type: ALL_TEMP_TRANSFER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_TEMP_TRANSFER_FAIL,
      payload: error.response,
    });
  }
};

export const getTemporaryTransfer = async () => {
  try {
    const { data } = await axiosInstance.get("/api/transferProduct/getTemp");
    return data;
    console.log(data);
  } catch (error) {}
};

export const getTemporaryTransferDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: TEMP_TRANSFER_DETIALS_REQUEST });
    const { data } = await axiosInstance.get(
      `/api/transferProduct/getTempTransfer/${id}`
    );
    console.log(data);
    dispatch({
      type: TEMP_TRANSFER_DETIALS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TEMP_TRANSFER_DETIALS_FAIL,
      payload: error.response,
    });
  }
};


export const getTemporaryTransferOnShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: TEMP_TRANSFER_ON_SHOP_REQUEST });
    const { data } = await axiosInstance.get(
      `/api/transferProduct/getTempTransferOnShop/${id}`
    );
    console.log(data);
    dispatch({
      type: TEMP_TRANSFER_ON_SHOP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TEMP_TRANSFER_ON_SHOP_FAIL,
      payload: error.response,
    });
  }
};

export const postTempTransfer = (shopNo, transferFrom, transferTo, transferBy, address, phoneNo, products) =>
  async (dispatch) => {
    try {
      dispatch({ type: POST_TEMP_TRANSFER_REQUEST });
      console.log(shopNo)
      console.log(transferFrom);
      console.log(transferTo);
      console.log(transferBy);
      console.log(address);
      console.log(phoneNo);
      console.log(products);
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axiosInstance.post(
        "/api/transferProduct/createTemporaryTransfer",
        {
          shopNo,
          transferFrom,
          transferTo,
          transferBy,
          address,
          phoneNo,
          products,
        },
        config
      );
      console.log(data);
      dispatch({ type: POST_TEMP_TRANSFER_SUCCESS, payload: data });
    } catch (error) {
      console.log(error.response);
      dispatch({ type: POST_TEMP_TRANSFER_FAIL, payload: error.response });
    }
  };

export const udpateTempTransferProductItem =
  (
    id1,
    id,
    Namee,
    Code,
    PurchaseQuantity,
    Color,
    Company,
    locationsetid,
    quantityidset,
    productColor,
    transferShopId,
    transferGodownId,
    transferToGodownId,
    transferToShopId
  ) =>
  async (dispatch) => {
    try {
      dispatch({ type: UPDATE_TEMP_TRANSFER_PRODUCT_ITEM_REQUEST });
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axiosInstance.put(
        `/api/transferProduct/updateTempTransfer/${id1}`,
        {
          id,
          Namee,
          Code,
          PurchaseQuantity,
          Color,
          Company,
          locationsetid,
          quantityidset,
          productColor,
          transferShopId,
          transferGodownId,
          transferToGodownId,
          transferToShopId,
        }
      );
      console.log(data);
      dispatch({
        type: UPDATE_TEMP_TRANSFER_PRODUCT_ITEM_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: UPDATE_TEMP_TRANSFER_PRODUCT_ITEM_FAIL,
        payload: error.response,
      });
    }
  };

export const udpateTempTransferProductQuantity = async (
  PurchaseQuantity,
  colorId,
  quantityidset,
  locationsetid
) => {
  try {
    console.log(PurchaseQuantity);
    console.log(colorId);
    console.log(quantityidset);
    console.log(locationsetid);
    //  dispatch({type: UPDATE_TEMP_TRANSFER_PRODUCT_ITEM_REQUEST})
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.put(
      `/api/transferProduct/updateTempTransferProductQuantity/${quantityidset}/${colorId}/${locationsetid}`,
      { PurchaseQuantity }
    );
    console.log(data);
    //  dispatch({type: UPDATE_TEMP_TRANSFER_PRODUCT_ITEM_SUCCESS, payload: data})
  } catch (error) {
    console.log(error.response);
    //  dispatch({type: UPDATE_TEMP_TRANSFER_PRODUCT_ITEM_FAIL, payload: error.response})
  }
};

export const deleteTempTransferAll = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_TEMP_TRANSFER_DELETE_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.delete(`/api/transferProduct/delete/${id}`);
    console.log(data);
    dispatch({ type: ALL_TEMP_TRANSFER_DELETE_SUCCESS, payload: data });
  } catch (error) {
    console.log(error.response);
    dispatch({ type: ALL_TEMP_TRANSFER_DELETE_FAIL, payload: error.response });
  }
};

export const deleteTempTransferProducts =
  (tempProductId, tempLocationId) => async (dispatch) => {
    try {
      dispatch({ type: DELETE_TEMP_TRANSFER_PRODUCT_REQUEST });
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axiosInstance.delete(
        `/api/transferProduct/deleteTempTransferProduct/${tempProductId}/${tempLocationId}`
      );
      console.log(data);
      dispatch({ type: DELETE_TEMP_TRANSFER_PRODUCT_SUCCESS, payload: data });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: DELETE_TEMP_TRANSFER_PRODUCT_FAIL,
        payload: error.response,
      });
    }
  }
