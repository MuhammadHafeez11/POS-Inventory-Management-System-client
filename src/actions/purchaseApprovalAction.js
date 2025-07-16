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
  REJECT_PURCHASE_REQUEST,
  REJECT_PURCHASE_SUCCESS,
  REJECT_PURCHASE_FAIL,
  DELETE_PURCHASE_APPROVAL_REQUEST,
  DELETE_PURCHASE_APPROVAL_SUCCESS,
  DELETE_PURCHASE_APPROVAL_FAIL,
  DELETE_PRODUCT_FROM_APPROVAL_REQUEST,
  DELETE_PRODUCT_FROM_APPROVAL_SUCCESS,
  DELETE_PRODUCT_FROM_APPROVAL_FAIL,
  UPDATE_APPROVAL_PRODUCTS_REQUEST,
  UPDATE_APPROVAL_PRODUCTS_SUCCESS,
  UPDATE_APPROVAL_PRODUCTS_FAIL,
  GET_FILTERED_PURCHASE_APPROVALS_REQUEST,
  GET_FILTERED_PURCHASE_APPROVALS_SUCCESS,
  GET_FILTERED_PURCHASE_APPROVALS_FAIL,
  CLEAR_ERRORS
} from "../constants/purchaseApprovalConstant";
import axiosInstance from "./baseURL";

// Create Purchase Approval
export const createPurchaseApproval = (purchaseData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PURCHASE_APPROVAL_REQUEST });

    const config = {
      headers: {"Content-Type": "application/json" }
    };

    console.log(purchaseData);
    
    const { data } = await axiosInstance.post(
      "/api/purchase-approval/new",
      purchaseData,
      config
    );

    console.log(data);
    
    dispatch({
      type: CREATE_PURCHASE_APPROVAL_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: CREATE_PURCHASE_APPROVAL_FAIL,
      payload: error.response.data.message
    });
  }
};

// Reset Create Purchase Approval
export const resetCreatePurchaseApproval = () => async (dispatch) => {
  dispatch({ type: CREATE_PURCHASE_APPROVAL_RESET });
};

// Add this new action to update products in an approval
export const updateApprovalProducts = (approvalId, products, total) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_APPROVAL_PRODUCTS_REQUEST })

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }

    const { data } = await axiosInstance.put(
      `/api/purchase-approval/${approvalId}/update-products`,
      { products, total },
      config,
    )

    dispatch({
      type: UPDATE_APPROVAL_PRODUCTS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: UPDATE_APPROVAL_PRODUCTS_FAIL,
      payload: error.response.data.message,
    })
  }
}

// Get All Purchase Approvals
export const getAllPurchaseApprovals = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_PURCHASE_APPROVALS_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };

    const { data } = await axiosInstance.get("/api/purchase-approvals", config);

    dispatch({
      type: GET_ALL_PURCHASE_APPROVALS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_PURCHASE_APPROVALS_FAIL,
      payload: error.response.data.message
    });
  }
};

// Get Purchase Approval By ID
export const getPurchaseApprovalById = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_PURCHASE_APPROVAL_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };

    const { data } = await axiosInstance.get(`/api/purchase-approval/${id}`, config);

    dispatch({
      type: GET_PURCHASE_APPROVAL_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GET_PURCHASE_APPROVAL_FAIL,
      payload: error.response.data.message
    });
  }
};

export const getFilteredPurchaseApprovals = (params) => async (dispatch) => {
  try {
    dispatch({ type: GET_FILTERED_PURCHASE_APPROVALS_REQUEST })

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }

    // Build query string from params
    const queryParams = new URLSearchParams()

    if (params.searchTerm) {
      queryParams.append("searchTerm", params.searchTerm)
    }

    if (params.status && params.status !== "all") {
      queryParams.append("status", params.status)
    }

    if (params.shopCode) {
      queryParams.append("shopCode", params.shopCode)
    }

    const queryString = queryParams.toString()
    const url = `/api/purchase-approvals/filtered${queryString ? `?${queryString}` : ""}`

    const { data } = await axiosInstance.get(url, config)
    console.log(data);
    

    dispatch({
      type: GET_FILTERED_PURCHASE_APPROVALS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: GET_FILTERED_PURCHASE_APPROVALS_FAIL,
      payload: error.response?.data?.message || "Failed to fetch filtered purchase approvals",
    })
  }
}

// Direct API call to get purchase approval details (already exists but renamed for clarity)
// export const fetchPurchaseApprovalDirect = async (id) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     };

//     const response = await axiosInstance.get(`/api/purchase-approval/${id}`, config);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching purchase approval:", error);
//     throw error;
//   }
// };

 // Direct API call to get purchase approval details
 export const fetchPurchaseApprovalDirect = async (id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }

    const response = await axiosInstance.get(`/api/purchase-approval/${id}`, config)
    return response.data
  } catch (error) {
    console.error("Error fetching purchase approval:", error)
    throw error
  }
}

// Approve Purchase
export const approvePurchase = (id, approvedBy) => async (dispatch) => {
  try {
    dispatch({ type: APPROVE_PURCHASE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };

    const { data } = await axiosInstance.put(
      `/api/purchase-approval/${id}/approve`,
      { approvedBy },
      config
    );

    dispatch({
      type: APPROVE_PURCHASE_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: APPROVE_PURCHASE_FAIL,
      payload: error.response.data.message
    });
  }
};

// Reject Purchase
export const rejectPurchase = (id, rejectedBy, rejectionReason) => async (dispatch) => {
  try {
    dispatch({ type: REJECT_PURCHASE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };

    const { data } = await axiosInstance.put(
      `/api/purchase-approval/${id}/reject`,
      { rejectedBy, rejectionReason },
      config
    );

    dispatch({
      type: REJECT_PURCHASE_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: REJECT_PURCHASE_FAIL,
      payload: error.response.data.message
    });
  }
};

// Delete Purchase Approval
export const deletePurchaseApproval = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PURCHASE_APPROVAL_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };

    const { data } = await axiosInstance.delete(`/api/purchase-approval/${id}`, config);

    dispatch({
      type: DELETE_PURCHASE_APPROVAL_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: DELETE_PURCHASE_APPROVAL_FAIL,
      payload: error.response.data.message
    });
  }
};

// Delete Product From Approval
export const deleteProductFromApproval = (approvalId, productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_FROM_APPROVAL_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };

    const { data } = await axiosInstance.delete(
      `/api/purchase-approval/${approvalId}/product/${productId}`,
      config
    );

    dispatch({
      type: DELETE_PRODUCT_FROM_APPROVAL_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FROM_APPROVAL_FAIL,
      payload: error.response.data.message
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};