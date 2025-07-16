import { ALL_DEPOSIT_GET_FAIL, ALL_DEPOSIT_GET_REQUEST, ALL_DEPOSIT_GET_SUCCESS, ALL_DEPOSIT_POST_FAIL, ALL_DEPOSIT_POST_REQUEST, ALL_DEPOSIT_POST_SUCCESS } from "../constants/depositConstants";
import axiosInstance from "./baseURL";

export const postDepositPayment  = ( 
    shop_id,
    amount,
    avatar,
    status,
    paymentMode,
    paidTo,
    accountNo
  ) => async (dispatch) =>{
    try {
      dispatch({type: ALL_DEPOSIT_POST_REQUEST})
      console.log(avatar)
      console.log(shop_id)
      const config = {headers: {
        "Content-Type": "multipart/form-data", // Important for sending FormData
      }};
      const { data } = await axiosInstance.post(
        "/api/depositPayment/post",
        {
          shop_id,
          amount,
          avatar,
          status,
          paymentMode,
          paidTo,
          accountNo
        },
        config
      );
      dispatch({
        type: ALL_DEPOSIT_POST_SUCCESS,
        payload: data,
      });
      // return data;
    } catch (error) {
      dispatch({
        type: ALL_DEPOSIT_POST_FAIL,
        payload: error.response,
      });
    }
  };

  export const getDepositPayment  = () => async (dispatch) =>{
    try {
      dispatch({type: ALL_DEPOSIT_GET_REQUEST})
      const { data } = await axiosInstance.get("/api/depositPayment/get");
      dispatch({
        type: ALL_DEPOSIT_GET_SUCCESS,
        payload: data,
      });
      // return data;
    } catch (error) {
      dispatch({
        type: ALL_DEPOSIT_GET_FAIL,
        payload: error.response,
      });
    }
  };

  export const getDepositPaymentForLoginUser  = () => async (dispatch) =>{
    try {
      dispatch({type: ALL_DEPOSIT_GET_REQUEST})
      const { data } = await axiosInstance.get("/api/depositPayment/me");
      dispatch({
        type: ALL_DEPOSIT_GET_SUCCESS,
        payload: data,
      });
      // return data;
    } catch (error) {
      dispatch({
        type: ALL_DEPOSIT_GET_FAIL,
        payload: error.response,
      });
    }
  };

  export const getDepositPaymentForUser  = (userId) => async (dispatch) =>{
    try {
      dispatch({type: ALL_DEPOSIT_GET_REQUEST})
      const { data } = await axiosInstance.get(`/api/depositPayment/OnUser/${userId}`);
      dispatch({
        type: ALL_DEPOSIT_GET_SUCCESS,
        payload: data,
      });
      // return data;
    } catch (error) {
      dispatch({
        type: ALL_DEPOSIT_GET_FAIL,
        payload: error.response,
      });
    }
  };

  export const getDepositPaymentForShop  = (shopId) => async (dispatch) =>{
    try {
      dispatch({type: ALL_DEPOSIT_GET_REQUEST})
      const { data } = await axiosInstance.get(`/api/depositPayment/OnShop/${shopId}`);
      dispatch({
        type: ALL_DEPOSIT_GET_SUCCESS,
        payload: data,
      });
      // return data;
    } catch (error) {
      dispatch({
        type: ALL_DEPOSIT_GET_FAIL,
        payload: error.response,
      });
    }
  };

  export const getDepositPaymentOnId  = async(shopId) => {
    try {
      const { data } = await axiosInstance.get(`/api/depositPayment/getOnId/${shopId}`);
      return data;
    } catch (error) {
     
    }
  };