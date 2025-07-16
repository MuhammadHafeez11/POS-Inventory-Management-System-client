import { GET_COMMISSION_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS, GET_COMMISSION_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL, GET_COMMISSION_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST, GET_COMMISSION_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS, GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_FAIL, GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_REQUEST, GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_SUCCESS, CLEAR_ERRORS } from "../constants/employeeCommissionConstants";

export const getPaidCommissionConsolidatedForSpecificShopsReducer = (state = { paidCommissionConsolidateForSpecificShopsRecord: []}, action)=>{
    switch (action.type){
        case GET_COMMISSION_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST:
            return{
                paidCommissionConsolidateForSpecificShopsRecordLoading: true,
                paidCommissionConsolidateForSpecificShopsRecord: [],
            };
        case GET_COMMISSION_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS: 
            return {
                paidCommissionConsolidateForSpecificShopsRecordLoading: false,
                paidCommissionConsolidateForSpecificShopsRecord: action.payload
            }
        case GET_COMMISSION_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL:
            return {
                paidCommissionConsolidateForSpecificShopsRecordLoading: false,
                paidCommissionConsolidateForSpecificShopsRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                paidCommissionConsolidateForSpecificShopsRecordError: null,
            }
            default:
            return state;
            
    }
}


export const getPaidCommissionConsolidatedForShopsReducer = (state = { paidCommissionConsolidateForShopsRecord: []}, action)=>{
    switch (action.type){
        case GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_REQUEST:
            return{
                paidCommissionConsolidateForShopsRecordLoading: true,
                paidCommissionConsolidateForShopsRecord: [],
            };
        case GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_SUCCESS: 
            return {
                paidCommissionConsolidateForShopsRecordLoading: false,
                paidCommissionConsolidateForShopsRecord: action.payload
            }
        case GET_PAID_COMMISSION_CONSOLIDATED_FOR_SHOPS_FAIL:
            return {
                paidCommissionConsolidateForShopsRecordLoading: false,
                paidCommissionConsolidateForShopsRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                paidCommissionConsolidateForShopsRecordError: null,
            }
            default:
            return state;
            
    }
}