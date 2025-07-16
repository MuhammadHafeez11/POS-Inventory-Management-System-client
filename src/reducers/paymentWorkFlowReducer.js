import { ALL_PAYMENTWORKFLOW_FAIL, ALL_PAYMENTWORKFLOW_REQUEST, ALL_PAYMENTWORKFLOW_SUCCESS, CLEAR_ERRORS } from "../constants/paymentWorkFlowConstants";

export const getPaymentWorkFlowReducer = (state = { paymentWorkFlow: []}, action)=>{
    switch (action.type){
        case ALL_PAYMENTWORKFLOW_REQUEST:
            return{
                paymentWorkFlowLoading: true,
                paymentWorkFlow: [],
            };
        case ALL_PAYMENTWORKFLOW_SUCCESS: 
            return {
                paymentWorkFlowLoading: false,
                paymentWorkFlow: action.payload
            }
        case ALL_PAYMENTWORKFLOW_FAIL:
            return {
                paymentWorkFlowLoading: false,
                paymentWorkFlowError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                paymentWorkFlowError: null,
            }
            default:
            return state;
            
    }
}
