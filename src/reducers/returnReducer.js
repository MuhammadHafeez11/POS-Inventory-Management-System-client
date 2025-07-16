import { CLEAR_ERRORS, GET_RETURN_PRODUCTS_FAIL, GET_RETURN_PRODUCTS_REQUEST, GET_RETURN_PRODUCTS_SUCCESS } from "../constants/returnConstants";

export const getReturnReducer = (state = { returnRecord: []}, action)=>{
    switch (action.type){
        case GET_RETURN_PRODUCTS_REQUEST:
            return{
                returnRecordLoading: true,
                returnRecord: [],
            };
        case GET_RETURN_PRODUCTS_SUCCESS: 
            return {
                returnRecordLoading: false,
                returnRecord: action.payload,
                // newSalesProduct: action?.payload?.newSalesProduct
            }
        case GET_RETURN_PRODUCTS_FAIL:
            return {
                returnRecordLoading: false,
                returnRecordError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                returnRecordError: null,
            }
            default:
            return state;
            
    }
}