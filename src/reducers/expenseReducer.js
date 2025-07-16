// import { ALL_COLOR_REQUEST, ALL_COLOR_FAIL, ALL_COLOR_SUCCESS, CLEAR_ERRORS, ALL_COLOR_POST_REQUEST, ALL_COLOR_POST_SUCCESS, ALL_COLOR_POST_FAIL, ALL_COLOR_UPDATE_REQUEST, ALL_COLOR_UPDATE_SUCCESS, ALL_COLOR_UPDATE_FAIL, ALL_COLOR_DETAILS_REQUEST, ALL_COLOR_DETAILS_SUCCESS, ALL_COLOR_DETAILS_FAIL, ALL_COLOR_DELETE_REQUEST, ALL_COLOR_DELETE_SUCCESS, ALL_COLOR_DELETE_FAIL } from "../constants/colorConstants";
import { ALL_EXPENSE_DELETE_FAIL, ALL_EXPENSE_DELETE_REQUEST, ALL_EXPENSE_DELETE_SUCCESS, ALL_EXPENSE_DETAILS_FAIL, ALL_EXPENSE_DETAILS_REQUEST, ALL_EXPENSE_DETAILS_SUCCESS, ALL_EXPENSE_FAIL, ALL_EXPENSE_POST_FAIL, ALL_EXPENSE_POST_REQUEST, ALL_EXPENSE_POST_SUCCESS, ALL_EXPENSE_REQUEST, ALL_EXPENSE_SUCCESS, ALL_EXPENSE_UPDATE_FAIL, ALL_EXPENSE_UPDATE_REQUEST, ALL_EXPENSE_UPDATE_SUCCESS, CLEAR_ERRORS, GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_FAIL, GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_REQUEST, GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS, GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL, GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST, GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS } from "../constants/expenseConstants";
// import { ALL_EXPENSEPAYMENT_DELETE_FAIL, ALL_EXPENSEPAYMENT_DELETE_REQUEST, ALL_EXPENSEPAYMENT_DELETE_SUCCESS, ALL_EXPENSEPAYMENT_DETAILS_FAIL, ALL_EXPENSEPAYMENT_DETAILS_REQUEST, ALL_EXPENSEPAYMENT_DETAILS_SUCCESS, ALL_EXPENSEPAYMENT_FAIL, ALL_EXPENSEPAYMENT_POST_FAIL, ALL_EXPENSEPAYMENT_POST_REQUEST, ALL_EXPENSEPAYMENT_POST_SUCCESS, ALL_EXPENSEPAYMENT_REQUEST, ALL_EXPENSEPAYMENT_SUCCESS, ALL_EXPENSEPAYMENT_UPDATE_FAIL, ALL_EXPENSEPAYMENT_UPDATE_REQUEST, ALL_EXPENSEPAYMENT_UPDATE_SUCCESS, CLEAR_ERRORS } from "../constants/expensePaymentConstants";

export const expenseReducer = (state = { expense: []}, action)=>{
    switch (action.type){
        case ALL_EXPENSE_REQUEST:
            return{
                expenseLoading: true,
                expense: [],
            };
        case ALL_EXPENSE_SUCCESS: 
            return {
                expenseLoading: false,
                expense: action.payload
            }
        case ALL_EXPENSE_FAIL:
            return {
                expenseLoading: false,
                expenseError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expenseError: null,
            }
            default:
            return state;
            
    }
}

export const postExpenseReducer = (state = { expensePost: []}, action)=>{
    switch (action.type){
        case ALL_EXPENSE_POST_REQUEST:
            return{
                expensePostLoading: true,
                expensePost: [],
            };
        case ALL_EXPENSE_POST_SUCCESS: 
            return {
                expensePostLoading: false,
                expensePost: action.payload
            }
        case ALL_EXPENSE_POST_FAIL:
            return {
                expensePostLoading: false,
                expensePostError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expensePostError: null,
            }
            default:
            return state;
            
    }
}

export const updateExpenseReducer = (state = { expenseUpdate: []}, action)=>{
    switch (action.type){
        case ALL_EXPENSE_UPDATE_REQUEST:
            return{
                expenseUpdateLoading: true,
                expenseUpdate: [],
            };
        case ALL_EXPENSE_UPDATE_SUCCESS: 
            return {
                expenseUpdateLoading: false,
                expenseUpdate: action.payload
            }
        case ALL_EXPENSE_UPDATE_FAIL:
            return {
                expenseUpdateLoading: false,
                expenseUpdateError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expenseUpdateError: null,
            }
            default:
            return state;
            
    }
}

export const expenseDetailsReducer = (state = { expenseDetails: []}, action)=>{
    switch (action.type){
        case ALL_EXPENSE_DETAILS_REQUEST:
            return{
                expenseDetailLoading: true,
                expenseDetails: [],
            };
        case ALL_EXPENSE_DETAILS_SUCCESS: 
            return {
                expenseDetailLoading: false,
                expenseDetails: action.payload
            }
        case ALL_EXPENSE_DETAILS_FAIL:
            return {
                expenseDetailLoading: false,
                expenseDetailError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expenseDetailError: null,
            }
            default:
            return state;
            
    }
}

export const deleteExpenseReducer = (state = { expenseDelete: []}, action)=>{
    switch (action.type){
        case ALL_EXPENSE_DELETE_REQUEST:
            return{
                expenseDeleteLoading: true,
                expenseDelete: [],
            };
        case ALL_EXPENSE_DELETE_SUCCESS: 
            return {
                expenseDeleteLoading: false,
                expenseDelete: action.payload
            }
        case ALL_EXPENSE_DELETE_FAIL:
            return {
                expenseDeleteloading: false,
                expenseDeleteError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expenseDeleteError: null,
            }
            default:
            return state;
            
    }
}


export const getExpenseConsolidatedForSpecificShopsReducer = (state = { expenseConsolidateForSpecificShopsRecord: []}, action)=>{
    switch (action.type){
        case GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST:
            return{
                expenseConsolidateForSpecificShopsRecordLoading: true,
                expenseConsolidateForSpecificShopsRecord: [],
            };
        case GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS: 
            return {
                expenseConsolidateForSpecificShopsRecordLoading: false,
                expenseConsolidateForSpecificShopsRecord: action.payload
            }
        case GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL:
            return {
                expenseConsolidateForSpecificShopsRecordLoading: false,
                expenseConsolidateForSpecificShopsRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expenseConsolidateForSpecificShopsRecordError: null,
            }
            default:
            return state;
            
    }
}



export const getExpenseConsolidatedForShopsReducer = (state = { expenseConsolidateForShopsRecord: []}, action)=>{
    switch (action.type){
        case GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_REQUEST:
            return{
                expenseConsolidateForShopsRecordLoading: true,
                expenseConsolidateForShopsRecord: [],
            };
        case GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS: 
            return {
                expenseConsolidateForShopsRecordLoading: false,
                expenseConsolidateForShopsRecord: action.payload
            }
        case GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_FAIL:
            return {
                expenseConsolidateForShopsRecordLoading: false,
                expenseConsolidateForShopsRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expenseConsolidateForShopsRecordError: null,
            }
            default:
            return state;
            
    }
}