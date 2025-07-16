import {
    CREATE_PURCHASE_APPROVAL_REQUEST,
    CREATE_PURCHASE_APPROVAL_SUCCESS,
    CREATE_PURCHASE_APPROVAL_FAIL,
    CREATE_PURCHASE_APPROVAL_RESET,
    GET_ALL_PURCHASE_APPROVALS_REQUEST,
    GET_ALL_PURCHASE_APPROVALS_SUCCESS,
    GET_ALL_PURCHASE_APPROVALS_FAIL,
    GET_PURCHASE_APPROVAL_REQUEST,
    GET_PURCHASE_APPROVAL_SUCCESS,
    GET_PURCHASE_APPROVAL_FAIL,
    APPROVE_PURCHASE_REQUEST,
    APPROVE_PURCHASE_SUCCESS,
    APPROVE_PURCHASE_FAIL,
    APPROVE_PURCHASE_RESET,
    REJECT_PURCHASE_REQUEST,
    REJECT_PURCHASE_SUCCESS,
    REJECT_PURCHASE_FAIL,
    REJECT_PURCHASE_RESET,
    DELETE_PURCHASE_APPROVAL_REQUEST,
    DELETE_PURCHASE_APPROVAL_SUCCESS,
    DELETE_PURCHASE_APPROVAL_FAIL,
    DELETE_PURCHASE_APPROVAL_RESET,
    DELETE_PRODUCT_FROM_APPROVAL_REQUEST,
    DELETE_PRODUCT_FROM_APPROVAL_SUCCESS,
    DELETE_PRODUCT_FROM_APPROVAL_FAIL,
    DELETE_PRODUCT_FROM_APPROVAL_RESET, 
    UPDATE_APPROVAL_PRODUCTS_REQUEST,
    UPDATE_APPROVAL_PRODUCTS_SUCCESS,
    UPDATE_APPROVAL_PRODUCTS_FAIL,
    UPDATE_APPROVAL_PRODUCTS_RESET,
    GET_FILTERED_PURCHASE_APPROVALS_REQUEST,
    GET_FILTERED_PURCHASE_APPROVALS_SUCCESS,
    GET_FILTERED_PURCHASE_APPROVALS_FAIL,
    RESET_PURCHASE_APPROVALS,
    CLEAR_ERRORS
  } from "../constants/purchaseApprovalConstant";
  

// Get Filtered Purchase Approvals Reducer
export const filteredPurchaseApprovalsReducer = (state = { purchaseApprovals: [] }, action) => {
  switch (action.type) {
    case GET_FILTERED_PURCHASE_APPROVALS_REQUEST:
      return {
        ...state,
        loading: true,
        // Keep the previous data while loading new data
      }
    case GET_FILTERED_PURCHASE_APPROVALS_SUCCESS:
      return {
        loading: false,
        purchaseApprovals: action.payload.purchaseApprovals,
        success: action.payload.success,
      }
    case GET_FILTERED_PURCHASE_APPROVALS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
      case RESET_PURCHASE_APPROVALS:
      return {
        ...state,
        purchaseApprovals: [],
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

  // Create Purchase Approval Reducer
  export const createPurchaseApprovalReducer = (state = {}, action) => {
    switch (action.type) {
      case CREATE_PURCHASE_APPROVAL_REQUEST:
        return {
          ...state,
          loading: true
        };
      case CREATE_PURCHASE_APPROVAL_SUCCESS:
        return {
          loading: false,
          success: true,
          purchaseApproval: action.payload.purchaseApproval
        };
      case CREATE_PURCHASE_APPROVAL_FAIL:
        return {
          loading: false,
          error: action.payload
        };
      case CREATE_PURCHASE_APPROVAL_RESET:
        return {};
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };
  
  // Get All Purchase Approvals Reducer
  export const allPurchaseApprovalsReducer = (state = { purchaseApprovals: [] }, action) => {
    switch (action.type) {
      case GET_ALL_PURCHASE_APPROVALS_REQUEST:
        return {
          loading: true,
          purchaseApprovals: []
        };
      case GET_ALL_PURCHASE_APPROVALS_SUCCESS:
        return {
          loading: false,
          purchaseApprovals: action.payload.purchaseApprovals,
          count: action.payload.count
        };
      case GET_ALL_PURCHASE_APPROVALS_FAIL:
        return {
          loading: false,
          error: action.payload
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };
  
  // Get Purchase Approval By ID Reducer
  export const purchaseApprovalDetailsReducer = (state = { purchaseApproval: {} }, action) => {
    switch (action.type) {
      case GET_PURCHASE_APPROVAL_REQUEST:
        return {
          ...state,
          loading: true
        };
      case GET_PURCHASE_APPROVAL_SUCCESS:
        return {
          loading: false,
          purchaseApproval: action.payload.purchaseApproval
        };
      case GET_PURCHASE_APPROVAL_FAIL:
        return {
          loading: false,
          error: action.payload
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };
  
  // Approve Purchase Reducer
  export const approvePurchaseReducer = (state = {}, action) => {
    switch (action.type) {
      case APPROVE_PURCHASE_REQUEST:
        return {
          ...state,
          loading: true
        };
      case APPROVE_PURCHASE_SUCCESS:
        return {
          loading: false,
          success: true,
          message: action.payload.message
        };
      case APPROVE_PURCHASE_FAIL:
        return {
          loading: false,
          error: action.payload
        };
      case APPROVE_PURCHASE_RESET:
        return {};
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };
  
  // Reject Purchase Reducer
  export const rejectPurchaseReducer = (state = {}, action) => {
    switch (action.type) {
      case REJECT_PURCHASE_REQUEST:
        return {
          ...state,
          loading: true
        };
      case REJECT_PURCHASE_SUCCESS:
        return {
          loading: false,
          success: true,
          message: action.payload.message
        };
      case REJECT_PURCHASE_FAIL:
        return {
          loading: false,
          error: action.payload
        };
      case REJECT_PURCHASE_RESET:
        return {};
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };
  
  // Delete Purchase Approval Reducer
  export const deletePurchaseApprovalReducer = (state = {}, action) => {
    switch (action.type) {
      case DELETE_PURCHASE_APPROVAL_REQUEST:
        return {
          ...state,
          loading: true
        };
      case DELETE_PURCHASE_APPROVAL_SUCCESS:
        return {
          loading: false,
          success: true,
          message: action.payload.message
        };
      case DELETE_PURCHASE_APPROVAL_FAIL:
        return {
          loading: false,
          error: action.payload
        };
      case DELETE_PURCHASE_APPROVAL_RESET:
        return {};
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };
  
  // Delete Product From Approval Reducer
  export const deleteProductFromApprovalReducer = (state = {}, action) => {
    switch (action.type) {
      case DELETE_PRODUCT_FROM_APPROVAL_REQUEST:
        return {
          ...state,
          loading: true
        };
      case DELETE_PRODUCT_FROM_APPROVAL_SUCCESS:
        return {
          loading: false,
          success: true,
          message: action.payload.message
        };
      case DELETE_PRODUCT_FROM_APPROVAL_FAIL:
        return {
          loading: false,
          error: action.payload
        };
      case DELETE_PRODUCT_FROM_APPROVAL_RESET:
        return {};
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };

  
// Add this new reducer for updating products in an approval
export const updateApprovalProductsReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_APPROVAL_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case UPDATE_APPROVAL_PRODUCTS_SUCCESS:
      return {
        loading: false,
        success: true,
        message: action.payload.message,
        purchaseApproval: action.payload.purchaseApproval,
      }
    case UPDATE_APPROVAL_PRODUCTS_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case UPDATE_APPROVAL_PRODUCTS_RESET:
      return {}
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

