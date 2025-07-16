import { ALL_EXPENSE_TYPE_FAIL, ALL_EXPENSE_TYPE_REQUEST, ALL_EXPENSE_TYPE_SUCCESS, CLEAR_ERRORS } from "../constants/expenseTypeConstants";

export const getExpenseTypeReducer = (state = { expenseType: []}, action)=>{
    switch (action.type){
        case ALL_EXPENSE_TYPE_REQUEST:
            return{
                expenseTypeLoading: true,
                expenseType: [],
            };
        case ALL_EXPENSE_TYPE_SUCCESS: 
            return {
                expenseTypeLoading: false,
                expenseType: action.payload
            }
        case ALL_EXPENSE_TYPE_FAIL:
            return {
                expenseTypeLoading: false,
                expenseTypeError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                expenseTypeError: null,
            }
            default:
            return state;
            
    }
}