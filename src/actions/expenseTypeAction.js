import axios from "axios";
import  axiosInstance  from "./baseURL";
import { ALL_EXPENSE_TYPE_FAIL, ALL_EXPENSE_TYPE_REQUEST, ALL_EXPENSE_TYPE_SUCCESS } from "../constants/expenseTypeConstants";
export const getExpenses = async () => {
  try {
    const { data } = await axiosInstance.get("/api/expenseType/get");
    console.log(data);
    return data;
  } catch (error) {
    console.warn(error);
    // throw new Error("Failed to fetch expenses");
  }
};


export const getExpenseType = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_EXPENSE_TYPE_REQUEST });
    const { data } = await axiosInstance.get(`/api/expenseType/get`,
    );
    dispatch({
      type: ALL_EXPENSE_TYPE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_EXPENSE_TYPE_FAIL,
      payload: error.response,
    });
  }
};


export const getExpenseDetails = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/api/expenseType/get/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    // console.warn(error);
    throw new Error("Failed to fetch expenses");
  }
};

export const updateExpenseType = async (
  id,
  expenseType,
  expenseDescription
) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.put(
      `/api/expenseType/put/${id}`,
      {
        expenseType,
        expenseDescription,
      },
      config
    );
    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const deleteExpenseType = async (id) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.delete(`/api/expenseType/delete/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postExpenseType = async (expenseType, expenseDescription) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = axiosInstance.post(
      "/api/expenseType/post",
      {
        expenseType,
        expenseDescription,
      },
      config
    );
    return data;
  } catch (error) {
    // console.warn(error);
    throw new Error("Failed to add expenses");
  }
};
