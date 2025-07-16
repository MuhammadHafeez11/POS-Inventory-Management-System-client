import axios from "axios";
import axiosInstance from "./baseURL";
import { ALL_EXPENSE_POST_FAIL, ALL_EXPENSE_POST_REQUEST, ALL_EXPENSE_POST_SUCCESS, ALL_EXPENSE_REQUEST, GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_FAIL, GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_REQUEST, GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS, GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL, GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST, GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS } from "../constants/expenseConstants";
export const getExpenseRecord = async () => {
  try {
    const { data } = await axiosInstance.get("/api/expense/get");
    return data;
  } catch (error) {}
};

export const getExpenses = async () => {
  try {
    const { data } = await axiosInstance.get("/api/expenseType/get");
    return data;
  } catch (error) {
    // console.warn(error);
    throw new Error("Failed to fetch expenses");
  }
};
export const postExpenseSeqNo = async () => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      "/api/expense/postSeqNo",
      {},
      config
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postExpense = async(
  seqId,
  paidTo,
  paymentMode,
  transferFromObjectId,
  expenseCategory,
  expenses,
  expenseTotal
)  =>{
  try {
    // dispatch({ type: ALL_EXPENSE_POST_REQUEST });
    console.log(transferFromObjectId)
    console.log(expenses)
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      "/api/expense/post",
      {
        seqId,
        paidTo,
        paymentMode,
        transferFromObjectId,
        expenseCategory,
        expenses,
        expenseTotal,
      },
      config
    );
    // dispatch({
    //   type: ALL_EXPENSE_POST_SUCCESS,
    //   payload: data,
    // });
    console.log(data)
    return data;
  } catch (error) {
    console.log(error.response)
    // dispatch({
    //   type: ALL_EXPENSE_POST_FAIL,
    //   payload: error.response,
    // });
  }
};

export const getExpenseDetailsForPreview = async (id) => {
  try {
    console.log(id);
    const data = await axiosInstance.get(`/api/expenseType/get/${id}`);
    return data;
  } catch (error) {
    // console.warn(error);
    throw new Error("Failed to fetch expense details");
  }
};

export const getExpenseDetail = async (salesId) => {
  try {
    const data = await axiosInstance.get(`/api/expense/get/${salesId}`);
    return data;
  } catch (error) {
    // console.warn(error);
    throw new Error("Failed to fetch purchase details");
  }
};


export const getExpenseRecordForConsolidated = (timePeriod)=> async (dispatch) => {
  try {
    dispatch({ type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_REQUEST });
    const { data } = await axiosInstance.get(`/api/expense/getExpenseConsolidatedRecord?option=${timePeriod}`);
    dispatch({
      type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_FAIL,
      payload: error.response,
    });
  }
};


export const getExpenseRecordForConsolidatedForSpecificShop = (shopNo, timePeriod) =>async (dispatch) => {
  try {
    console.log(timePeriod)
    dispatch({ type: GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST });
    const { data } = await axiosInstance.get(`/api/expense/getExpenseConsolidateRecordForShop/${shopNo}?option=${timePeriod}`);
    console.log(data)
    dispatch({
      type: GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL,
      payload: error.response,
    });
  }
};


export const getExpenseRecordForConsolidatedForSpecificShopOnDate = (shopNo, startingDate, endingDate)=> async (dispatch) => {
  try {
    dispatch({ type: GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST });
    const { data } = await axiosInstance.get(`/api/expense/getExpenseConsolidateRecordForShop/${shopNo}?starting=${startingDate}&ending=${endingDate}`);
    dispatch({
      type: GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL,
      payload: error.response,
    });
  }
};


export const getExpenseRecordForConsolidatedOnDates = (startingDate, endingDate)=>  async (dispatch) => {
  try {
    dispatch({ type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_REQUEST });
    console.log(startingDate, endingDate)
    const { data } = await axiosInstance.get(`/api/expense/getExpenseConsolidatedRecord?starting=${startingDate}&ending=${endingDate}`);
    dispatch({
      type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_FAIL,
      payload: error.response,
    });
  }
};