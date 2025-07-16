// import { ALL_COLOR_REQUEST, ALL_COLOR_FAIL, ALL_COLOR_SUCCESS, CLEAR_ERRORS, ALL_COLOR_POST_REQUEST, ALL_COLOR_POST_SUCCESS, ALL_COLOR_POST_FAIL, ALL_COLOR_UPDATE_REQUEST, ALL_COLOR_UPDATE_SUCCESS, ALL_COLOR_UPDATE_FAIL, ALL_COLOR_DETAILS_REQUEST, ALL_COLOR_DETAILS_SUCCESS, ALL_COLOR_DETAILS_FAIL, ALL_COLOR_DELETE_REQUEST, ALL_COLOR_DELETE_SUCCESS, ALL_COLOR_DELETE_FAIL } from "../constants/colorConstants";
import { ALL_EXPENSEPAYMENT_DELETE_FAIL, ALL_EXPENSEPAYMENT_DELETE_REQUEST, ALL_EXPENSEPAYMENT_DELETE_SUCCESS, ALL_EXPENSEPAYMENT_DETAILS_FAIL, ALL_EXPENSEPAYMENT_DETAILS_REQUEST, ALL_EXPENSEPAYMENT_DETAILS_SUCCESS, ALL_EXPENSEPAYMENT_FAIL, ALL_EXPENSEPAYMENT_POST_FAIL, ALL_EXPENSEPAYMENT_POST_REQUEST, ALL_EXPENSEPAYMENT_POST_SUCCESS, ALL_EXPENSEPAYMENT_REQUEST, ALL_EXPENSEPAYMENT_SUCCESS, ALL_EXPENSEPAYMENT_UPDATE_FAIL, ALL_EXPENSEPAYMENT_UPDATE_REQUEST, ALL_EXPENSEPAYMENT_UPDATE_SUCCESS, CLEAR_ERRORS } from "../constants/expensePaymentConstants";

export const expensePaymentReducer = (state = { expensePayment: []}, action)=>{
    switch (action.type){
        case ALL_EXPENSEPAYMENT_REQUEST:
            return{
                expensePaymentLoading: true,
                expensePayment: [],
            };
        case ALL_EXPENSEPAYMENT_SUCCESS: 
            return {
                expensePaymentLoading: false,
                expensePayment: action.payload
            }
        case ALL_EXPENSEPAYMENT_FAIL:
            return {
                expensePaymentLoading: false,
                expensePaymentError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expensePaymentError: null,
            }
            default:
            return state;
            
    }
}

export const postExpensePaymentReducer = (state = { expensePaymentPost: []}, action)=>{
    switch (action.type){
        case ALL_EXPENSEPAYMENT_POST_REQUEST:
            return{
                expensePaymentPostLoading: true,
                expensePaymentPost: [],
            };
        case ALL_EXPENSEPAYMENT_POST_SUCCESS: 
            return {
                expensePaymentPostLoading: false,
                expensePaymentPost: action.payload
            }
        case ALL_EXPENSEPAYMENT_POST_FAIL:
            return {
                expensePaymentPostLoading: false,
                expensePaymentPostError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expensePaymentPostError: null,
            }
            default:
            return state;
            
    }
}

export const updateExpensePaymentReducer = (state = { expensePaymentUpdate: []}, action)=>{
    switch (action.type){
        case ALL_EXPENSEPAYMENT_UPDATE_REQUEST:
            return{
                expensePaymentUpdateLoading: true,
                expensePaymentUpdate: [],
            };
        case ALL_EXPENSEPAYMENT_UPDATE_SUCCESS: 
            return {
                expensePaymentUpdateLoading: false,
                expensePaymentUpdate: action.payload
            }
        case ALL_EXPENSEPAYMENT_UPDATE_FAIL:
            return {
                expensePaymentUpdateLoading: false,
                expensePaymentUpdateError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expensePaymentUpdateError: null,
            }
            default:
            return state;
            
    }
}

export const expensePaymentDetailsReducer = (state = { expensePaymentDetails: []}, action)=>{
    switch (action.type){
        case ALL_EXPENSEPAYMENT_DETAILS_REQUEST:
            return{
                expensePaymentDetailLoading: true,
                expensePaymentDetails: [],
            };
        case ALL_EXPENSEPAYMENT_DETAILS_SUCCESS: 
            return {
                expensePaymentDetailLoading: false,
                expensePaymentDetails: action.payload
            }
        case ALL_EXPENSEPAYMENT_DETAILS_FAIL:
            return {
                expensePaymentDetailLoading: false,
                expensePaymentDetailError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expensePaymentDetailError: null,
            }
            default:
            return state;
            
    }
}

export const deleteExpensePaymentReducer = (state = { expensePaymentDelete: []}, action)=>{
    switch (action.type){
        case ALL_EXPENSEPAYMENT_DELETE_REQUEST:
            return{
                expensePaymentDeleteLoading: true,
                expensePaymentDelete: [],
            };
        case ALL_EXPENSEPAYMENT_DELETE_SUCCESS: 
            return {
                expensePaymentDeleteLoading: false,
                expensePaymentDelete: action.payload
            }
        case ALL_EXPENSEPAYMENT_DELETE_FAIL:
            return {
                expensePaymentDeleteloading: false,
                expensePaymentDeleteError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expensePaymentDeleteError: null,
            }
            default:
            return state;
            
    }
}