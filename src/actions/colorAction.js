import axios from "axios";
import {
  ALL_COLOR_DELETE_FAIL,
  ALL_COLOR_DELETE_REQUEST,
  ALL_COLOR_DELETE_SUCCESS,
  ALL_COLOR_DETAILS_FAIL,
  ALL_COLOR_DETAILS_REQUEST,
  ALL_COLOR_DETAILS_SUCCESS,
  ALL_COLOR_FAIL,
  ALL_COLOR_POST_FAIL,
  ALL_COLOR_POST_REQUEST,
  ALL_COLOR_POST_SUCCESS,
  ALL_COLOR_REQUEST,
  ALL_COLOR_SUCCESS,
  ALL_COLOR_UPDATE_FAIL,
  ALL_COLOR_UPDATE_REQUEST,
  ALL_COLOR_UPDATE_SUCCESS,
} from "../constants/colorConstants";
import  axiosInstance  from "./baseURL";
import Cookies from "js-cookie";
export const getColor = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_COLOR_REQUEST });
    const link = "http://localhost:4500"
    const abc = Cookies.get('token')
    console.log(abc)
    const token = JSON.parse(localStorage.getItem('token'))
    const { data } = await axiosInstance.get(`/api/color/get`,
    );
    dispatch({
      type: ALL_COLOR_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_COLOR_FAIL,
      payload: error.response,
    });
  }
};

export const getColorr = async () => {
  try {
    const link = "http://localhost:4500"
    const abc = Cookies.get('token')
    console.log(abc)
    const token = JSON.parse(localStorage.getItem('token'))
    const { data } = await axiosInstance.get(`/api/color/get`
    );
    return data;
  } catch (error) {
    console.log("chie");
  }
};

export const getColorDetails = (id) => async (dispatch) => {
  try {
    const link = "http://localhost:4500"
    dispatch({ type: ALL_COLOR_DETAILS_REQUEST });
    const token = JSON.parse(localStorage.getItem('token'))
    const { data } = await axiosInstance.get(`/api/color/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({
      type: ALL_COLOR_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_COLOR_DETAILS_FAIL,
      payload: error.response,
    });
  }
};

export const postColor = async (colorName, colorDescription) => {
  try {
    const token = JSON.parse(localStorage.getItem('token'))
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      `/api/color/post`,
      {
        colorName,
        colorDescription,
      }, {
        headers: {
        
          "Content-Type": "application/json"
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const updateColor = async (id, colorName, colorDescription) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.put(
      `/api/color/put/${id}`,
      {
        colorName,
        colorDescription,
      },
      config
    );
    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const deleteColor = async (id) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.delete(`/api/color/delete/${id}`);
    return data;
  } catch (error) {
    return error.response;
    console.log(error.response);
  }
};
