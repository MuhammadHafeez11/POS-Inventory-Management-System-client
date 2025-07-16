import { GET_SUBSCRIPTION_FAIL,
  GET_SUBSCRIPTIONS_DISPLAY_REQUEST,
  GET_SUBSCRIPTIONS_DISPLAY_SUCCESS,
  GET_SUBSCRIPTIONS_DISPLAY_FAIL,
   GET_SUBSCRIPTION_REQUEST,
    GET_SUBSCRIPTION_SUCCESS,
     GET_SUBSCRIPTIONDATE_FAIL,
      GET_SUBSCRIPTIONDATE_REQUEST, 
      GET_SUBSCRIPTIONDATE_SUCCESS
     } from "../constants/subscriptionConstants";
import axiosInstance from "./baseURL";

export const getSubscriptionsDisplay = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SUBSCRIPTIONS_DISPLAY_REQUEST });
    const { data } = await axiosInstance.get("/api/subscription/subscriptionsDisplay");
    console.log(data);
    dispatch({
      type: GET_SUBSCRIPTIONS_DISPLAY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SUBSCRIPTIONS_DISPLAY_FAIL,
      payload: error.response ? error.response.data : error.message,
    });
  }
};

export const getSubscriptionDetails = () => async (dispatch) => {
    try {
      dispatch({ type: GET_SUBSCRIPTION_REQUEST });
      const { data } = await axiosInstance.get(`/api/subscription/subscriptionGet`,
      );
      dispatch({
        type: GET_SUBSCRIPTION_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_SUBSCRIPTION_FAIL,
        payload: error.response,
      });
    }
  };


  
export const getSubscriptionDateDetails = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SUBSCRIPTIONDATE_REQUEST });
    console.log('hkuh')
    const  data  = await axiosInstance.get(`/api/subscription/getSubscriptionDate`
    );
    console.log(data?.data)
    dispatch({
      type: GET_SUBSCRIPTIONDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log(error)
    dispatch({
      type: GET_SUBSCRIPTIONDATE_FAIL,
      payload: error.response,
    });
  }
};