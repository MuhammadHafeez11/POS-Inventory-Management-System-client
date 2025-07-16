import { 
    CLEAR_ERRORS, 
    GET_SUBSCRIPTION_FAIL,
     GET_SUBSCRIPTION_REQUEST,
      GET_SUBSCRIPTION_SUCCESS, 
      GET_SUBSCRIPTIONDATE_FAIL,
       GET_SUBSCRIPTIONDATE_REQUEST,
     GET_SUBSCRIPTIONDATE_SUCCESS,
     GET_SUBSCRIPTIONS_DISPLAY_REQUEST,
     GET_SUBSCRIPTIONS_DISPLAY_SUCCESS,
     GET_SUBSCRIPTIONS_DISPLAY_FAIL,
    } from "../constants/subscriptionConstants";

export const subscriptionsDisplayReducer = (state = { subscriptionsDisplay: [] }, action) => {
    switch (action.type) {
      case GET_SUBSCRIPTIONS_DISPLAY_REQUEST:
        return { loading: true, subscriptionsDisplay: [] };
      case GET_SUBSCRIPTIONS_DISPLAY_SUCCESS:
        return { loading: false, subscriptionsDisplay: action.payload };
      case GET_SUBSCRIPTIONS_DISPLAY_FAIL:
        return { loading: false, error: action.payload, subscriptionsDisplay: [] };
      default:
        return state;
    }
  };

export const subscriptionReducer = (state = { subscriptionDetail: []}, action)=>{
    switch (action.type){
        case GET_SUBSCRIPTION_REQUEST:
            return{
                subscriptionDetailLoading: true,
                subscriptionDetail: [],
            };
        case GET_SUBSCRIPTION_SUCCESS: 
            return {
                subscriptionDetailLoading: false,
                subscriptionDetail: action.payload
            }
        case GET_SUBSCRIPTION_FAIL:
            return {
                subscriptionDetailLoading: false,
                error: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            }
            default:
            return state;
            
    }
}


export const subscriptionDateReducer = (state = { subscriptionDateDetail: []}, action)=>{
    switch (action.type){
        case GET_SUBSCRIPTIONDATE_REQUEST:
            return{
                subscriptionDateDetailLoading: true,
                subscriptionDateDetail: [],
            };
        case GET_SUBSCRIPTIONDATE_SUCCESS: 
            return {
                subscriptionDateDetailLoading: false,
                subscriptionDateDetail: action.payload
            }
        case GET_SUBSCRIPTIONDATE_FAIL:
            return {
                subscriptionDateDetailLoading: false,
                error: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            }
            default:
            return state;
            
    }
}