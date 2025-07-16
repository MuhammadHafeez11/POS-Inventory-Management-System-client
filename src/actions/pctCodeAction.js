import axios from "axios";

import  axiosInstance  from "./baseURL";
import Cookies from "js-cookie";
import { ALL_DISTINCT_COMPANIES_FROM_PCTCODE_FAIL, ALL_DISTINCT_COMPANIES_FROM_PCTCODE_REQUEST, ALL_DISTINCT_COMPANIES_FROM_PCTCODE_SUCCESS, ALL_PCTCODE_COMPANY_DETAILS_FAIL, ALL_PCTCODE_COMPANY_DETAILS_REQUEST, ALL_PCTCODE_COMPANY_DETAILS_SUCCESS, ALL_PCTCODE_COMPANY_FAIL, ALL_PCTCODE_COMPANY_REQUEST, ALL_PCTCODE_COMPANY_SUCCESS, ALL_PCTCODE_DESCRIPTION_DETAILS_FAIL, ALL_PCTCODE_DESCRIPTION_DETAILS_REQUEST, ALL_PCTCODE_DESCRIPTION_DETAILS_SUCCESS, ALL_PCTCODE_DESCRIPTION_FAIL, ALL_PCTCODE_DESCRIPTION_REQUEST, ALL_PCTCODE_DESCRIPTION_SUCCESS, ALL_PCTCODE_DETAILS_FAIL, ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_FAIL, ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_REQUEST, ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_SUCCESS, ALL_PCTCODE_DETAILS_REQUEST, ALL_PCTCODE_DETAILS_SUCCESS, ALL_PCTCODE_FAIL, ALL_PCTCODE_REQUEST, ALL_PCTCODE_SUCCESS } from "../constants/pctCodesContants";

export const getPCTCodes = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_PCTCODE_REQUEST });
    const { data } = await axiosInstance.get(`/api/PCTCode/getPCTCodes`,
    );
    dispatch({
      type: ALL_PCTCODE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PCTCODE_FAIL,
      payload: error.response,
    });
  }
};

export const getPCTCodeDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PCTCODE_DETAILS_REQUEST });
    const { data } = await axiosInstance.get(`/api/PCTCode/details/${id}`);
    dispatch({
      type: ALL_PCTCODE_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PCTCODE_DETAILS_FAIL,
      payload: error.response,
    });
  }
};


export const getDistinctCompaniesOnPCTCode = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_DISTINCT_COMPANIES_FROM_PCTCODE_REQUEST });
    const { data } = await axiosInstance.get(`/api/PCTCode/getDistinctCompanies`);
    dispatch({
      type: ALL_DISTINCT_COMPANIES_FROM_PCTCODE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_DISTINCT_COMPANIES_FROM_PCTCODE_FAIL,
      payload: error.response,
    });
  }
};

export const getPCTCodeOnCompanyAndTypeDetails = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_REQUEST });
    // console.log(productTypeId)
    const { data } = await axiosInstance.get(`/api/PCTCode/getPCTCodesOnId/${companyId}`);
    dispatch({
      type: ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_FAIL,
      payload: error.response,
    });
  }
};

export const postPCTCodes = async (pctCodeDescription, companyId, pctCode) => {
  try {
    console.log(pctCodeDescription, companyId, pctCode)
    const { data } = await axiosInstance.post(
      `/api/PCTCode/post`,
      {
        pctCodeDescription, companyId, pctCode
      }, {
        headers: {
        
          "Content-Type": "application/json"
        },
      }
    );
    console.log(data)
    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const updatePCTCode = async (id,
  companyId,
  pctCode,
  pctCodeDescription) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.put(
      `/api/PCTCode/put/${id}`,
      {
        companyId,
        pctCode,
        pctCodeDescription
      },
      config
    );
    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const deletePCTCode = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/api/PCTCode/delete/${id}`);
    return data;
  } catch (error) {
    return error.response;
    console.log(error.response);
  }
};



export const getPCTCodeCompany = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_PCTCODE_COMPANY_REQUEST });
    const { data } = await axiosInstance.get("/api/pctcodecompany/get");
    dispatch({
      type: ALL_PCTCODE_COMPANY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PCTCODE_COMPANY_FAIL,
      payload: error.response,
    });
  }
};

export const getPCTCodeCompanyDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PCTCODE_COMPANY_DETAILS_REQUEST });
    const { data } = await axiosInstance.get(`/api/pctcodecompany/get/${id}`);
    dispatch({
      type: ALL_PCTCODE_COMPANY_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PCTCODE_COMPANY_DETAILS_FAIL,
      payload: error.response,
    });
  }
};

export const postPCTCodeCompany = async (companyName, address) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      "/api/pctcodecompany/post",
      {
        companyName,
      },
      config
    );
    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const updatePCTCodeCompany = async (id, companyName, address) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.put(
      `/api/pctcodecompany/put/${id}`,
      {
        companyName,
        address,
      },
      config
    );
    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const deletePCTCodeCompany = async (id) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.delete(`/api/pctcodecompany/delete/${id}`);
    return data;
  } catch (error) {
    //    console.log(error.response)
    return error.response;
  }
};



export const getPCTCodeDescription = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_PCTCODE_DESCRIPTION_REQUEST });
    const { data } = await axiosInstance.get("/api/pctcodedescription/get");
    dispatch({
      type: ALL_PCTCODE_DESCRIPTION_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PCTCODE_DESCRIPTION_FAIL,
      payload: error.response,
    });
  }
};

export const getPCTCodeDescriptionDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PCTCODE_DESCRIPTION_DETAILS_REQUEST });
    const { data } = await axiosInstance.get(`/api/pctcodedescription/get/${id}`);
    dispatch({
      type: ALL_PCTCODE_DESCRIPTION_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PCTCODE_DESCRIPTION_DETAILS_FAIL,
      payload: error.response,
    });
  }
};

export const postPCTCodeDescription = async (pctDescription) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      "/api/pctcodedescription/post",
      {
        pctDescription,
      },
      config
    );
    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const updatePCTCodeDescription = async (id, companyName, address) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.put(
      `/api/pctcodedescription/put/${id}`,
      {
        companyName,
        address,
      },
      config
    );
    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const deletePCTCodeDescription = async (id) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.delete(`/api/pctcodedescription/delete/${id}`);
    return data;
  } catch (error) {
    //    console.log(error.response)
    return error.response;
  }
};
