import { ALL_PURCHASE_FAIL, ALL_PURCHASE_POST_FAIL, ALL_PURCHASE_POST_REQUEST, ALL_PURCHASE_POST_SUCCESS, ALL_PURCHASE_REQUEST, ALL_PURCHASE_SUCCESS, CLEAR_ERRORS, GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_FAIL, GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL, GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST, GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS, GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_REQUEST, GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_SUCCESS, GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL, GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL, GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST, GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS, GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST, GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS } from "../constants/puchaseConstants";

export const postPurchaseReducer = (state = { purchasePost: []}, action)=>{
    switch (action.type){
        case ALL_PURCHASE_POST_REQUEST:
            return{
                purchasePostLoading: true,
                purchasePost: [],
            };
        case ALL_PURCHASE_POST_SUCCESS: 
            return {
                purchasePostLoading: false,
                purchasePost: action.payload
            }
        case ALL_PURCHASE_POST_FAIL:
            return {
                purchasePostLoading: false,
                purchasePostError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                purchasePostError: null,
            }
            default:
            return state;
            
    }
}


export const getPurchaseReducer = (state = { purchaseRecord: []}, action)=>{
    switch (action.type){
        case ALL_PURCHASE_REQUEST:
            return{
                loading: true,
                purchaseRecord: [],
            };
        case ALL_PURCHASE_SUCCESS: 
            return {
                loading: false,
                purchaseRecord: action.payload
            }
        case ALL_PURCHASE_FAIL:
            return {
                loading: false,
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

export const getPurchaseConsolidatedForShopsReducer = (state = { purchaseConsolidateForShopsRecord: []}, action)=>{
    switch (action.type){
        case GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_REQUEST:
            return{
                purchaseConsolidateForShopsRecordLoading: true,
                purchaseConsolidateForShopsRecord: [],
            };
        case GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_SUCCESS: 
            return {
                purchaseConsolidateForShopsRecordLoading: false,
                purchaseConsolidateForShopsRecord: action.payload
            }
        case GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_FAIL:
            return {
                purchaseConsolidateForShopsRecordLoading: false,
                purchaseConsolidateForShopsRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                purchaseConsolidateForShopsRecordError: null,
            }
            default:
            return state;
            
    }
}

export const getPurchaseConsolidatedForSpecificShopsReducer = (state = { purchaseConsolidateForSpecificShopsRecord: []}, action)=>{
    switch (action.type){
        case GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST:
            return{
                purchaseConsolidateForSpecificShopsRecordLoading: true,
                purchaseConsolidateForSpecificShopsRecord: [],
            };
        case GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS: 
            return {
                purchaseConsolidateForSpecificShopsRecordLoading: false,
                purchaseConsolidateForSpecificShopsRecord: action.payload
            }
        case GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL:
            return {
                purchaseConsolidateForSpecificShopsRecordLoading: false,
                purchaseConsolidateForSpecificShopsRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                purchaseConsolidateForSpecificShopsRecordError: null,
            }
            default:
            return state;
            
    }
}


export const getPurchaseConsolidatedForShopsOnDateReducer = (state = { purchaseConsolidateForShopsOnDateRecord: []}, action)=>{
    switch (action.type){
        case GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST:
            return{
                purchaseConsolidateForShopsOnDateRecordLoading: true,
                purchaseConsolidateForShopsOnDateRecord: [],
            };
        case GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS: 
            return {
                purchaseConsolidateForShopsOnDateRecordLoading: false,
                purchaseConsolidateForShopsOnDateRecord: action.payload
            }
        case GET_PURCHASE_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL:
            return {
                purchaseConsolidateForShopsOnDateRecordLoading: false,
                purchaseConsolidateForShopsOnDateRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                purchaseConsolidateForShopsOnDateRecordError: null,
            }
            default:
            return state;
            
    }
}

export const getPurchaseConsolidatedForSpecificShopsOnDateReducer = (state = { purchaseConsolidateForSpecificShopsOnDateRecord: []}, action)=>{
    switch (action.type){
        case GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST:
            return{
                purchaseConsolidateForSpecificShopsOnDateRecordLoading: true,
                purchaseConsolidateForSpecificShopsOnDateRecord: [],
            };
        case GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS: 
            return {
                purchaseConsolidateForSpecificShopsOnDateRecordLoading: false,
                purchaseConsolidateForSpecificShopsOnDateRecord: action.payload
            }
        case GET_PURCHASE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL:
            return {
                purchaseConsolidateForSpecificShopsOnDateRecordLoading: false,
                purchaseConsolidateForSpecificShopsOnDateRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                purchaseConsolidateForSpecificShopsOnDateRecordError: null,
            }
            default:
            return state;
            
    }
}