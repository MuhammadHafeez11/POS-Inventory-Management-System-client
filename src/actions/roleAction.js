import axios from "axios";
import {
  ROLE_REQUEST,
  ROLE_SUCCESS,
  ROLE_FAIL,
  POST_ROLE_REQUEST,
  POST_ROLE_SUCCESS,
  POST_ROLE_FAIL,
} from "../constants/roleConstants";
import axiosInstance from "./baseURL"
export const getRole = () => async (dispatch) => {
  try {
    dispatch({ type: ROLE_REQUEST });
    const { data } = await axiosInstance.get("/api/role/get");
    dispatch({
      type: ROLE_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: ROLE_FAIL,
      payload: error.response,
    });
  }
};

export const postRole = (values) => async (dispatch) => {
  try {
    dispatch({ type: POST_ROLE_REQUEST });
    const { data } = await axiosInstance.post("/api/role/post", values);
    dispatch({
      type: POST_ROLE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: POST_ROLE_FAIL,
      payload: error.response,
    });
  }
};
