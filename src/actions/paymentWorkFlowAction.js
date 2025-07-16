import { ALL_PAYMENTWORKFLOW_FAIL, ALL_PAYMENTWORKFLOW_REQUEST, ALL_PAYMENTWORKFLOW_SUCCESS } from "../constants/paymentWorkFlowConstants";
import axiosInstance from "./baseURL";

export const getPaymentWorkFlow = (timePeriod) => async (dispatch) => {
    try {
      dispatch({ type: ALL_PAYMENTWORKFLOW_REQUEST });
      console.log(timePeriod)
      const { data } = await axiosInstance.get(`/api/paymentWorkflow/getTodaysTransactions?option=${timePeriod}`);
      dispatch({
        type: ALL_PAYMENTWORKFLOW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PAYMENTWORKFLOW_FAIL,
        payload: error.response,
      });
    }
  };

  export const getPaymentWorkFlowOnUser = (userId, timePeriod) => async (dispatch) => {
    try {
      dispatch({ type: ALL_PAYMENTWORKFLOW_REQUEST });
      console.log(userId)
      const { data } = await axiosInstance.get(`/api/paymentWorkflow/getTodaysTransactionsOnUser/${userId}?option=${timePeriod}`);
      dispatch({
        type: ALL_PAYMENTWORKFLOW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PAYMENTWORKFLOW_FAIL,
        payload: error.response,
      });
    }
  };

  export const getPaymentWorkFlowOnShop = (shopId, timePeriod) => async (dispatch) => {
    try {
      dispatch({ type: ALL_PAYMENTWORKFLOW_REQUEST });
      console.log(shopId)
      const { data } = await axiosInstance.get(`/api/paymentWorkflow/getTodaysTransactionsOnShop/${shopId}?option=${timePeriod}`);
      dispatch({
        type: ALL_PAYMENTWORKFLOW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PAYMENTWORKFLOW_FAIL,
        payload: error.response,
      });
    }
  };
  
  
  