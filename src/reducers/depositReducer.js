import { ALL_DEPOSIT_GET_FAIL, ALL_DEPOSIT_GET_REQUEST, ALL_DEPOSIT_GET_SUCCESS, ALL_DEPOSIT_POST_FAIL, ALL_DEPOSIT_POST_REQUEST, ALL_DEPOSIT_POST_SUCCESS, CLEAR_ERRORS } from "../constants/depositConstants";

export const postDepositPaymentReducer = (state = { depositPaymentPost: []}, action)=>{
    switch (action.type){
        case ALL_DEPOSIT_POST_REQUEST:
            return{
                depositPaymentPostLoading: true,
                depositPaymentPost: [],
            };
        case ALL_DEPOSIT_POST_SUCCESS: 
            return {
                depositPaymentPostLoading: false,
                depositPaymentPost: action.payload
            }
        case ALL_DEPOSIT_POST_FAIL:
            return {
                depositPaymentPostLoading: false,
                depositPaymentPostError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                depositPaymentPostError: null,
            }
            default:
            return state;
            
    }
}

export const getDepositPaymentReducer = (state = { depositPayment: []}, action)=>{
    switch (action.type){
        case ALL_DEPOSIT_GET_REQUEST:
            return{
                depositPaymentLoading: true,
                depositPayment: [],
            };
        case ALL_DEPOSIT_GET_SUCCESS: 
            return {
                depositPaymentLoading: false,
                depositPayment: action.payload
            }
        case ALL_DEPOSIT_GET_FAIL:
            return {
                depositPaymentLoading: false,
                depositPaymentError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                depositPaymentError: null,
            }
            default:
            return state;
            
    }
}
