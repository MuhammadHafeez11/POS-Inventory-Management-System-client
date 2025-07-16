import { ALL_EXPENSEPAYMENT_FAIL, ALL_EXPENSEPAYMENT_POST_FAIL, ALL_EXPENSEPAYMENT_POST_REQUEST, ALL_EXPENSEPAYMENT_POST_SUCCESS, ALL_EXPENSEPAYMENT_REQUEST, ALL_EXPENSEPAYMENT_SUCCESS } from "../constants/expensePaymentConstants";
import axiosInstance from "./baseURL";

export const postExpensePayement = (
    user_id,
    totalPaymentAmount,
    paymentAmount,
    lastPaymentReceived,
  ) =>async(dispatch) =>{
    try {
      dispatch({ type: ALL_EXPENSEPAYMENT_POST_REQUEST });
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axiosInstance.post(
        "/api/expensePayment/createExpensePayment",
        {
            user_id,
            totalPaymentAmount,
            paymentAmount,
            lastPaymentReceived,
        },
        config
      );
      dispatch({
        type: ALL_EXPENSEPAYMENT_POST_SUCCESS,
        payload: data,
      });
      // return data;
    } catch (error) {
      dispatch({
        type: ALL_EXPENSEPAYMENT_POST_FAIL,
        payload: error.response,
      });
    }
  };

  export const getExpensePayment = () => async (dispatch) => {
    try {
      dispatch({ type: ALL_EXPENSEPAYMENT_REQUEST });

      const { data } = await axiosInstance.get(`/api/expensePayment/getExpensePayment`,
      );
      dispatch({
        type: ALL_EXPENSEPAYMENT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_EXPENSEPAYMENT_FAIL,
        payload: error.response,
      });
    }
  };