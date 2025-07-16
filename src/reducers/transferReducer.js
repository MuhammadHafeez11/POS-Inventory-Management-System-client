import { CLEAR_ERRORS, GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_FAIL, GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL, GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST, GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS, GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_REQUEST, GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_SUCCESS, GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL, GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL, GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST, GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS, GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST, GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS, GET_TRANSFER_PRODUCT_FAIL, GET_TRANSFER_PRODUCT_REQUEST, GET_TRANSFER_PRODUCT_SUCCESS, POST_TRANSFER_PRODUCT_FAIL, POST_TRANSFER_PRODUCT_REQUEST, POST_TRANSFER_PRODUCT_SUCCESS } from "../constants/transferConstants";


export const postTransferReducer = (state = { postTransferRecord: []}, action)=>{
    switch (action.type){
        case POST_TRANSFER_PRODUCT_REQUEST:
            return{
                postTransferRecordLoading: true,
                postTransferRecord: [],
            };
        case POST_TRANSFER_PRODUCT_SUCCESS: 
            return {
                postTransferRecordLoading: false,
                postTransferRecord: action.payload,
                // newSalesProduct: action?.payload?.newSalesProduct
            }
        case POST_TRANSFER_PRODUCT_FAIL:
            return {
                postTransferRecordLoading: false,
                postTransferRecordError: action.payload,
            }
      
            default:
            return state;
    }
}
export const getTransferReducer = (state = { transferRecord: []}, action)=>{
    switch (action.type){
        case GET_TRANSFER_PRODUCT_REQUEST:
            return{
                loading: true,
                transferRecord: [],
            };
        case GET_TRANSFER_PRODUCT_SUCCESS: 
            return {
                loading: false,
                transferRecord: action.payload,
                // newSalesProduct: action?.payload?.newSalesProduct
            }
        case GET_TRANSFER_PRODUCT_FAIL:
            return {
                loading: false,
                error: action.payload,
            }
      
            default:
            return state;
            
    }
}



export const getTransferConsolidatedForShopsReducer = (state = { transferConsolidateForShopsRecord: []}, action)=>{
    switch (action.type){
        case GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_REQUEST:
            return{
                transferConsolidateForShopsRecordLoading: true,
                transferConsolidateForShopsRecord: [],
            };
        case GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_SUCCESS: 
            return {
                transferConsolidateForShopsRecordLoading: false,
                transferConsolidateForShopsRecord: action.payload
            }
        case GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_FAIL:
            return {
                transferConsolidateForShopsRecordLoading: false,
                transferConsolidateForShopsRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                transferConsolidateForShopsRecordError: null,
            }
            default:
            return state;
            
    }
}

export const getTransferConsolidatedForSpecificShopsReducer = (state = { transferConsolidateForSpecificShopsRecord: []}, action)=>{
    switch (action.type){
        case GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST:
            return{
                transferConsolidateForSpecificShopsRecordLoading: true,
                transferConsolidateForSpecificShopsRecord: [],
            };
        case GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS: 
            return {
                transferConsolidateForSpecificShopsRecordLoading: false,
                transferConsolidateForSpecificShopsRecord: action.payload
            }
        case GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL:
            return {
                transferConsolidateForSpecificShopsRecordLoading: false,
                transferConsolidateForSpecificShopsRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                transferConsolidateForSpecificShopsRecordError: null,
            }
            default:
            return state;
            
    }
}

export const getTransferConsolidatedForShopsOnDateReducer = (state = { transferConsolidateForShopsOnShopRecord: []}, action)=>{
    switch (action.type){
        case GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST:
            return{
                transferConsolidateForShopsOnShopRecordLoading: true,
                transferConsolidateForShopsOnShopRecord: [],
            };
        case GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS: 
            return {
                transferConsolidateForShopsOnShopRecordLoading: false,
                transferConsolidateForShopsOnShopRecord: action.payload
            }
        case GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL:
            return {
                transferConsolidateForShopsOnShopRecordLoading: false,
                transferConsolidateForShopsOnShopRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                transferConsolidateForShopsOnShopRecordError: null,
            }
            default:
            return state;
            
    }
}

export const getTransferConsolidatedForSpecificShopsOnDateReducer = (state = { transferConsolidateForSpecificShopsOnDateRecord: []}, action)=>{
    switch (action.type){
        case GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST:
            return{
                transferConsolidateForSpecificShopsOnDateRecordLoading: true,
                transferConsolidateForSpecificShopsOnDateRecord: [],
            };
        case GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS: 
            return {
                transferConsolidateForSpecificShopsOnDateRecordLoading: false,
                transferConsolidateForSpecificShopsOnDateRecord: action.payload
            }
        case GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL:
            return {
                transferConsolidateForSpecificShopsOnDateRecordLoading: false,
                transferConsolidateForSpecificShopsOnDateRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                transferConsolidateForSpecificShopsOnDateRecordError: null,
            }
            default:
            return state;
            
    }
}