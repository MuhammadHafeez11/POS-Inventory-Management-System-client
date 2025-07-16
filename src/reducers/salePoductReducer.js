import { CLEAR_ERRORS, GET_SALE_CONSOLIDATED_FOR_SHOPS_FAIL, GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL, GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST, GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS, GET_SALE_CONSOLIDATED_FOR_SHOPS_REQUEST, GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS, GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL, GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL, GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST, GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS, GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST, GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS, GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_FAIL, GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_REQUEST, GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_SUCCESS, GET_SALE_CREDIT_FAIL, GET_SALE_CREDIT_ON_SHOP_FAIL, GET_SALE_CREDIT_ON_SHOP_REQUEST, GET_SALE_CREDIT_ON_SHOP_SUCCESS, GET_SALE_CREDIT_REQUEST, GET_SALE_CREDIT_SINGLE_RECORD_FAIL, GET_SALE_CREDIT_SINGLE_RECORD_REQUEST, GET_SALE_CREDIT_SINGLE_RECORD_SUCCESS, GET_SALE_CREDIT_SUCCESS, GET_SALE_ON_INVOICE_NO_FAIL, GET_SALE_ON_INVOICE_NO_REQUEST, GET_SALE_ON_INVOICE_NO_SHOP_NO_FAIL, GET_SALE_ON_INVOICE_NO_SHOP_NO_REQUEST, GET_SALE_ON_INVOICE_NO_SHOP_NO_SUCCESS, GET_SALE_ON_INVOICE_NO_SUCCESS, GET_SALE_PRODUCT_FAIL, GET_SALE_PRODUCT_REQUEST, GET_SALE_PRODUCT_SUCCESS, POST_SALE_FBR_PRODUCT_FAIL, POST_SALE_FBR_PRODUCT_REQUEST, POST_SALE_FBR_PRODUCT_SUCCESS, POST_SALE_PRODUCT_FAIL, POST_SALE_PRODUCT_REQUEST, POST_SALE_PRODUCT_SUCCESS, UPDATE_SALE_CREDIT_FAIL, UPDATE_SALE_CREDIT_REQUEST, UPDATE_SALE_CREDIT_SUCCESS } from "../constants/saleConstants";

export const postFBRSaleReducer = (state = { postFBRSaleProduct: []}, action)=>{
    switch (action.type){
        case POST_SALE_FBR_PRODUCT_REQUEST:
            return{
                postFBRSaleProductLoading: true,
                postFBRSaleProduct: [],
            };
        case POST_SALE_FBR_PRODUCT_SUCCESS: 
            return {
                postFBRSaleProductLoading: false,
                postFBRSaleProduct: action.payload,
            }
        case POST_SALE_FBR_PRODUCT_FAIL:
            return {
                postFBRSaleProductLoading: false,
                postFBRSaleProductError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                postFBRSaleProductError: null,
            }
            default:
            return state;
            
    }
}
export const postSaleReducer = (state = { postSaleProduct: []}, action)=>{
    switch (action.type){
        case POST_SALE_PRODUCT_REQUEST:
            return{
                postSaleProductLoading: true,
                postSaleProduct: [],
            };
        case POST_SALE_PRODUCT_SUCCESS: 
            return {
                postSaleProductLoading: false,
                postSaleProduct: action.payload,
                newSalesProduct: action?.payload?.newSalesProduct
            }
        case POST_SALE_PRODUCT_FAIL:
            return {
                postSaleProductLoading: false,
                postSaleProductError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                postSaleProductError: null,
            }
            default:
            return state;
            
    }
}


export const getSaleReducer = (state = { saleRecord: []}, action)=>{
    switch (action.type){
        case GET_SALE_PRODUCT_REQUEST:
            return{
                saleRecordLoading: true,
                saleRecord: [],
            };
        case GET_SALE_PRODUCT_SUCCESS: 
            return {
                saleRecordLoading: false,
                saleRecord: action.payload,
                // newSalesProduct: action?.payload?.newSalesProduct
            }
        case GET_SALE_PRODUCT_FAIL:
            return {
                saleRecordLoading: false,
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

export const getSaleOnInvoiceNoAndShopNoReducer = (state = { saleRecordOnInvoiceNo: []}, action)=>{
    switch (action.type){
        case GET_SALE_ON_INVOICE_NO_REQUEST:
            return{
                saleRecordOnInvoiceNoLoading: true,
                saleRecordOnInvoiceNo: [],
            };
        case GET_SALE_ON_INVOICE_NO_SUCCESS: 
            return {
                saleRecordOnInvoiceNoLoading: false,
                saleRecordOnInvoiceNo: action.payload,
            }
        case GET_SALE_ON_INVOICE_NO_FAIL:
            return {
                saleRecordOnInvoiceNoLoading: false,
                saleRecordOnInvoiceNoError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                saleRecordOnInvoiceNoError: null,
            }
            default:
            return state;
            
    }
}


export const getSaleConsolidatedForShopsReducer = (state = { saleConsolidateForShopsRecord: []}, action)=>{
    switch (action.type){
        case GET_SALE_CONSOLIDATED_FOR_SHOPS_REQUEST:
            return{
                saleConsolidateForShopsRecordLoading: true,
                saleConsolidateForShopsRecord: [],
            };
        case GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS: 
            return {
                saleConsolidateForShopsRecordLoading: false,
                saleConsolidateForShopsRecord: action.payload
            }
        case GET_SALE_CONSOLIDATED_FOR_SHOPS_FAIL:
            return {
                saleConsolidateForShopsRecordLoading: false,
                saleConsolidateForShopsRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                saleConsolidateForShopsRecordError: null,
            }
            default:
            return state;
            
    }
}

export const getSaleConsolidatedForSpecificShopsReducer = (state = { saleConsolidateForSpecificShopsRecord: []}, action)=>{
    switch (action.type){
        case GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST:
            return{
                saleConsolidateForSpecificShopsRecordLoading: true,
                saleConsolidateForSpecificShopsRecord: [],
            };
        case GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS: 
            return {
                saleConsolidateForSpecificShopsRecordLoading: false,
                saleConsolidateForSpecificShopsRecord: action.payload
            }
        case GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL:
            return {
                saleConsolidateForSpecificShopsRecordLoading: false,
                saleConsolidateForSpecificShopsRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                saleConsolidateForSpecificShopsRecordError: null,
            }
            default:
            return state;
            
    }
}

export const getSaleConsolidatedForShopsOnDateReducer = (state = { saleConsolidateForShopsOnShopRecord: []}, action)=>{
    switch (action.type){
        case GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST:
            return{
                saleConsolidateForShopsOnShopRecordLoading: true,
                saleConsolidateForShopsOnShopRecord: [],
            };
        case GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS: 
            return {
                saleConsolidateForShopsOnShopRecordLoading: false,
                saleConsolidateForShopsOnShopRecord: action.payload
            }
        case GET_SALE_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL:
            return {
                saleConsolidateForShopsOnShopRecordLoading: false,
                saleConsolidateForShopsOnShopRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                saleConsolidateForShopsOnShopRecordError: null,
            }
            default:
            return state;
            
    }
}

export const getSaleConsolidatedForSpecificShopsOnDateReducer = (state = { saleConsolidateForSpecificShopsOnDateRecord: []}, action)=>{
    switch (action.type){
        case GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST:
            return{
                saleConsolidateForSpecificShopsOnDateRecordLoading: true,
                saleConsolidateForSpecificShopsOnDateRecord: [],
            };
        case GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS: 
            return {
                saleConsolidateForSpecificShopsOnDateRecordLoading: false,
                saleConsolidateForSpecificShopsOnDateRecord: action.payload
            }
        case GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL:
            return {
                saleConsolidateForSpecificShopsOnDateRecordLoading: false,
                saleConsolidateForSpecificShopsOnDateRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                saleConsolidateForSpecificShopsOnDateRecordError: null,
            }
            default:
            return state;
            
    }
}

export const getSaleConsolidatedProfitForShopsReducer = (state = { saleConsolidateProiftForShopsRecord: []}, action)=>{
    switch (action.type){
        case GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_REQUEST:
            return{
                saleConsolidateProiftForShopsRecordLoading: true,
                saleConsolidateProiftForShopsRecord: [],
            };
        case GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_SUCCESS: 
            return {
                saleConsolidateProiftForShopsRecordLoading: false,
                saleConsolidateProiftForShopsRecord: action.payload
            }
        case GET_SALE_CONSOLIDATED_PROFIT_FOR_SHOPS_FAIL:
            return {
                saleConsolidateProiftForShopsRecordLoading: false,
                saleConsolidateProiftForShopsRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                saleConsolidateProiftForShopsRecordError: null,
            }
            default:
            return state;
            
    }
}

export const getSingleSaleCreditReducer = (state = { singleSaleCreditRecord: []}, action)=>{
    switch (action.type){
        case GET_SALE_CREDIT_SINGLE_RECORD_REQUEST:
            return{
                singleSaleCreditRecordLoading: true,
                singleSaleCreditRecord: [],
            };
        case GET_SALE_CREDIT_SINGLE_RECORD_SUCCESS: 
            return {
                singleSaleCreditRecordLoading: false,
                singleSaleCreditRecord: action.payload,
                // newSalesProduct: action?.payload?.newSalesProduct
            }
        case GET_SALE_CREDIT_SINGLE_RECORD_FAIL:
            return {
                singleSaleCreditRecordLoading: false,
                singleSaleCreditRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                singleSaleCreditRecordError: null,
            }
            default:
            return state;
            
    }
}

export const getSaleCreditReducer = (state = { saleCreditRecord: []}, action)=>{
    switch (action.type){
        case GET_SALE_CREDIT_REQUEST:
            return{
                saleCreditRecordLoading: true,
                saleCreditRecord: [],
            };
        case GET_SALE_CREDIT_SUCCESS: 
            return {
                saleCreditRecordLoading: false,
                saleCreditRecord: action.payload,
                // newSalesProduct: action?.payload?.newSalesProduct
            }
        case GET_SALE_CREDIT_FAIL:
            return {
                saleCreditRecordLoading: false,
                saleCreditRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                saleCreditRecordError: null,
            }
            default:
            return state;
            
    }
}


export const getSaleCreditOnShopReducer = (state = { saleCreditOnShopRecord: []}, action)=>{
    switch (action.type){
        case GET_SALE_CREDIT_ON_SHOP_REQUEST:
            return{
                saleCreditOnShopRecordLoading: true,
                saleCreditOnShopRecord: [],
            };
        case GET_SALE_CREDIT_ON_SHOP_SUCCESS: 
            return {
                saleCreditOnShopRecordLoading: false,
                saleCreditOnShopRecord: action.payload,
                // newSalesProduct: action?.payload?.newSalesProduct
            }
        case GET_SALE_CREDIT_ON_SHOP_FAIL:
            return {
                saleCreditOnShopRecordLoading: false,
                saleCreditOnShopRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                saleCreditOnShopRecordError: null,
            }
            default:
            return state;
            
    }
}


export const updateSaleCreditOnShopReducer = (state = { updateSaleCreditRecord: []}, action)=>{
    switch (action.type){
        case UPDATE_SALE_CREDIT_REQUEST:
            return{
                updateSaleCreditRecordLoading: true,
                updateSaleCreditRecord: [],
            };
        case UPDATE_SALE_CREDIT_SUCCESS: 
            return {
                updateSaleCreditRecordLoading: false,
                updateSaleCreditRecord: action.payload,
                // newSalesProduct: action?.payload?.newSalesProduct
            }
        case UPDATE_SALE_CREDIT_FAIL:
            return {
                updateSaleCreditRecordLoading: false,
                updateSaleCreditRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                updateSaleCreditRecordError: null,
            }
            default:
            return state;
            
    }
}
