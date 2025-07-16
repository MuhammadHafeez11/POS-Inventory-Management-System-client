import {
  ALL_ACTIVE_DASHBOARD_USER_REQUEST,
  ALL_ACTIVE_TOP_DASHBOARD_USER_FAIL,
  ALL_ACTIVE_TOP_DASHBOARD_USER_SUCCESS,
  ALL_DASHBOARD_FAIL,
  ALL_DASHBOARD_REQUEST,
  ALL_DASHBOARD_SUCCESS,
  ALL_EXPENSEDATA_FAIL,
  ALL_EXPENSEDATA_FORSHOP_FAIL,
  ALL_EXPENSEDATA_FORSHOP_REQUEST,
  ALL_EXPENSEDATA_FORSHOP_SUCCESS,
  ALL_EXPENSEDATA_REQUEST,
  ALL_EXPENSEDATA_SUCCESS,
  ALL_PURCHASEDATAFORDASHBOARD_FAIL,
  ALL_PURCHASEDATAFORDASHBOARD_FORSHOP_FAIL,
  ALL_PURCHASEDATAFORDASHBOARD_FORSHOP_REQUEST,
  ALL_PURCHASEDATAFORDASHBOARD_FORSHOP_SUCCESS,
  ALL_PURCHASEDATAFORDASHBOARD_REQUEST,
  ALL_PURCHASEDATAFORDASHBOARD_SUCCESS,
  ALL_SALESDATAFORDASHBOARD_FAIL,
  ALL_SALESDATAFORDASHBOARD_REQUEST,
  ALL_SALESDATAFORDASHBOARD_SUCCESS,
  ALL_SALESDATAFORDASHBOARD_WITHUSER_FAIL,
  ALL_SALESDATAFORDASHBOARD_WITHUSER_REQUEST,
  ALL_SALESDATAFORDASHBOARD_WITHUSER_SUCCESS,
} from "../constants/dashboardConstants";

import  axiosInstance  from "./baseURL";
import axios from "axios";

export const getTopSalesForDashBoard = () => async (dispatch) => {
  try {
    console.log('apiCalled')
    dispatch({ type: ALL_DASHBOARD_REQUEST });
    const { data } = await axiosInstance.get(`/api/saleProduct/gets`);
    dispatch({ type: ALL_DASHBOARD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ALL_DASHBOARD_FAIL, payload: error.response });
  }
};

export const getTopSalesForDashBoardWithUser = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_DASHBOARD_REQUEST });

    const { data } = await axiosInstance.get(
      `/api/saleProduct/gets/${JSON.parse(localStorage.getItem("shopId"))}`
    );
    dispatch({ type: ALL_DASHBOARD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ALL_DASHBOARD_FAIL, payload: error.response });
  }
};

export const getActiveUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ACTIVE_DASHBOARD_USER_REQUEST });

    const { data } = await axiosInstance.get("/api/user/activeUsers");
    dispatch({ type: ALL_ACTIVE_TOP_DASHBOARD_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ALL_ACTIVE_TOP_DASHBOARD_USER_FAIL,
      payload: error.response,
    });
  }
};

export const getSalesDataForDashBoard = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_SALESDATAFORDASHBOARD_REQUEST });

    const { data } = await axiosInstance.get(`/api/saleProduct/getTotalSaleThisMonth`);
    dispatch({ type: ALL_SALESDATAFORDASHBOARD_SUCCESS, payload: data });
  } catch (error) {
    // console.warn(error);
    dispatch({ type: ALL_SALESDATAFORDASHBOARD_FAIL, payload: error.response });
  }
};

export const getSalesDataForDashBoardWithUser = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_SALESDATAFORDASHBOARD_WITHUSER_REQUEST });

    const { data } = await axiosInstance.get(
      `/api/saleProduct/getTotalSaleThisMonth/${JSON.parse(
        localStorage.getItem("shopId")
      )}`
    );

    dispatch({
      type: ALL_SALESDATAFORDASHBOARD_WITHUSER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    // console.warn(error);
    dispatch({
      type: ALL_SALESDATAFORDASHBOARD_WITHUSER_FAIL,
      payload: error.response,
    });
  }
};

export const getPurchaseRecordForCurrentMonth = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_PURCHASEDATAFORDASHBOARD_REQUEST });

    const { data } = await axiosInstance.get(
      `/api/purchaseProduct/getTotalPurcahseThisMonth`
    );
    dispatch({ type: ALL_PURCHASEDATAFORDASHBOARD_SUCCESS, payload: data });
  } catch (error) {
    // console.warn(error);
    dispatch({
      type: ALL_PURCHASEDATAFORDASHBOARD_FAIL,
      payload: error.response,
    });
  }
};

export const getPurchaseRecordForCurrentMonthForShop =
  () => async (dispatch) => {
    try {
      dispatch({ type: ALL_PURCHASEDATAFORDASHBOARD_FORSHOP_REQUEST });

      const { data } = await axiosInstance.get(
        `/api/purchaseProduct/getTotalPurcahseThisMonth/${JSON.parse(
          localStorage.getItem("shopId")
        )}`
      );
      dispatch({
        type: ALL_PURCHASEDATAFORDASHBOARD_FORSHOP_SUCCESS,
        payload: data,
      });
    } catch (error) {
      // console.warn(error);
      dispatch({
        type: ALL_PURCHASEDATAFORDASHBOARD_FORSHOP_FAIL,
        payload: error.response,
      });
    }
  };

export const getExpensesThisMonth = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_EXPENSEDATA_REQUEST });

    const { data } = await axiosInstance.get(`/api/expense/getTotalExpenseThisMonth`);
    dispatch({ type: ALL_EXPENSEDATA_SUCCESS, payload: data });
  } catch (error) {
    // console.warn(error);
    dispatch({ type: ALL_EXPENSEDATA_FAIL, payload: error.response });
  }
};

export const getExpensesThisMonthForShop = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_EXPENSEDATA_FORSHOP_REQUEST });

    const { data } = await axiosInstance.get(
      `/api/expense/getTotalExpenseThisMonth/${JSON.parse(
        localStorage.getItem("shopId")
      )}`
    );
    dispatch({ type: ALL_EXPENSEDATA_FORSHOP_SUCCESS, payload: data });
  } catch (error) {
    // console.warn(error);
    dispatch({ type: ALL_EXPENSEDATA_FORSHOP_FAIL, payload: error.response });
  }
};


export const getTopFourForDashBoard =async (selectedDuration) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/saleProduct/getTopFour?option=${selectedDuration}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForDashBoardOnShop =async (id, selectedDuration) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/saleProduct/getTopFourOnShop/${id}?option=${selectedDuration}`);
    return data;
    } catch (error) {
  
  }
};
export const getTopFourForDashBoardMonthly =async () => {
  try {
   
    const { data } = await axiosInstance.get(`/api/saleProduct/getTopFourForCurrentMonth`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForDashBoardMonthlyOnShop =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/saleProduct/getTopFourForCurrentMonthOnShop/${id}`);
    return data;
    } catch (error) {
  
  }
};
export const getTopFourForDashBoardDaily =async () => {
  try {
   
    const { data } = await axiosInstance.get(`/api/saleProduct/getTopFourForDaily`);
    return data;
    } catch (error) {
  
  }
};
export const getTopFourForDashBoardDailyOnShop =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/saleProduct/getTopFourForDailyOnShop/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForDashBoardYearly =async () => {
  try {
   
    const { data } = await axiosInstance.get(`/api/saleProduct/getTopFourForYearly`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForDashBoardYearlyOnShopId =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/saleProduct/getTopFourForYearly/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForPurchaseDashBoard =async (selectedDuration) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getTopFourPurchase?option=${selectedDuration}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForPurchasdDashBoardOnShop =async (id, selectedDuration) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getTopFourPurchase/${id}?option=${selectedDuration}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForPurchaseDashBoardMonthly =async () => {
  try {
   
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getTopFourPurchaseForCurrentMonth`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForPurchaseDashBoardMonthlyOnShop =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getTopFourPurchaseForCurrentMonthOnShop/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForPurchaseDashBoardDaily =async () => {
  try {
   
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getTopFourForPurchaseDaily`);
    return data;
    } catch (error) {
  
  }
};
export const getTopFourForPurchaseDashBoardDailyOnShop =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getTopFourForPurchaseDailyOnShop/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForPurchaseDashBoardYearly =async () => {
  try {
   
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getTopFourPurchaseForYearly`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForPurchaseDashBoardYearlyOnShopId =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getTopFourPurchaseForYearlyOnShop/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForTransferFromDashBoardOnShopId =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/transferProduct/getTopFourOnShopFrom/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopFourForTransferToDashBoardOnShopId =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/transferProduct/getTopFourOnShopTo/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopTransferFromCurrentMonthOnShop =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/transferProduct/getTopFourForCurrentMonthTransferFromOnShop/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopTransferToCurrentMonthOnShop =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/transferProduct/getTopFourForCurrentMonthTransferToOnShop/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopTransferFromYearlyOnShop =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/transferProduct/getTopTransferFromYearly/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopTransferToYearlyOnShop =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/transferProduct/getTopTransferToYearly/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopTransferFromDailyOnShop =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/transferProduct/getTopFourForTransferFromDailyOnShop/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getTopTransferToOnShop =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/transferProduct/getTopFourForTransferToDailyOnShop/${id}`);
    return data;
    } catch (error) {
  
  }
};

export const getRecentSale =async () => {
  try {
   
    const { data } = await axiosInstance.get(`/api/saleProduct/getRecentData`);
    return data;
    } catch (error) {
  
  }
};

export const getRecentPurchase =async () => {
  try {
   
    const { data } = await axiosInstance.get(`/api/purchaseProduct/getRecentPurchaseData`);
    return data;
    } catch (error) {
  
  }
};
export const getTopTransfer =async () => {
  try {
   
    const { data } = await axiosInstance.get(`/api/transferProduct/getTopFour`);
    return data;
    } catch (error) {
  
  }
};

export const getTopTransferOnShop =async (id) => {
  try {
   
    const { data } = await axiosInstance.get(`/api/transferProduct/getTopFourOnShop/${id}`);
    return data;
    } catch (error) {
  
  }
};