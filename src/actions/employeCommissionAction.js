import axios from "axios";
import axiosInstance from "./baseURL";
import { GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_FAIL, GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_REQUEST,
   GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_SUCCESS } from "../constants/employeeCommissionConstants";
export const postEmployeeComssionData = async (
  employeName,
  totalCommission,
  percentage,
  shopNo,
  startingDate, 
  endingDate,
  records
) => {
  try {

    console.log(startingDate)
    console.log(endingDate)
    const record = records?.map(
      ({
        Code: productCode,
        Namee: productName,
        Company: productCompany,
        PurchaseQuantity: quantity,
        excludeTaxPrice: Price,
        Discount: discount,
        totalAmounnt: totalPrice,
        taxAmount: taxAmount,
        amount: totalAmount,
        profit: commission,
        ...rest
      }) => ({
        productCode,
        productName,
        productCompany,
        quantity,
        Price,
        discount,
        totalPrice,
        taxAmount,
        totalAmount,
        commission, // Assign a constant value
        ...rest,
      })
    );

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      "/api/employeCommission/post",
      {
        employeName,
        totalCommission,
        percentage,
        shopNo,
        startingDate, 
        endingDate,
        record,
      },
      config
    );
    return data;
  } catch (error) {
    return error.response;
    console.log(error.response);
  }
};

export const getEmployeCommission = async () => {
  try {
    const { data } = await axiosInstance.get("/api/employeCommission/get");
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getEmployeCommissionOnId = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/api/employeCommission/getPaid/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};


export const getPaidCommissionRecordForConsolidatedForProfit = (timePeriod)=> async (dispatch) => {
  try {
    dispatch({ type: GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_REQUEST });
    const { data } = await axiosInstance.get(`/api/employeCommission/getRecordForConsolidatedForPaidCommission?option=${timePeriod}`);
    dispatch({
      type: GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_FAIL,
      payload: error.response,
    });
  }
};


export const getPaidCommissionRecordForConsolidatedProfitForSpecificShop = (shopNo, timePeriod) =>async (dispatch) => {
  try {
    console.log(timePeriod)
    dispatch({ type: GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_REQUEST });
    const { data } = await axiosInstance.get(`/api/employeCommission/getRecordForConsolidatedForPaidCommissionOnShop/${shopNo}?option=${timePeriod}`);
    console.log(data)
    dispatch({
      type: GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_FAIL,
      payload: error.response,
    });
  }
};