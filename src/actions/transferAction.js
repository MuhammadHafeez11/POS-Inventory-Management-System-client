import {
  GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_FAIL,
  GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL,
  GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST,
  GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS,
  GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_REQUEST,
  GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_SUCCESS,
  GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL,
  GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL,
  GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST,
  GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS,
  GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST,
  GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
  GET_TRANSFER_PRODUCT_FAIL,
  GET_TRANSFER_PRODUCT_REQUEST,
  GET_TRANSFER_PRODUCT_SUCCESS,
  POST_TRANSFER_PRODUCT_FAIL,
  POST_TRANSFER_PRODUCT_REQUEST,
  POST_TRANSFER_PRODUCT_SUCCESS,
} from "../constants/transferConstants";
import axios from "axios";
import axiosInstance from "./baseURL"
export const getTransferRecord = async () => {
  try {
    const { data } = await axiosInstance.get("/api/transferProduct/get");
    return data;
  } catch (error) {}
};

export const postTransferProduct = async (
  shopNo,
  transferFrom,
  transferTo,
  transferBy,
  address,
  phoneNo,
  list,
  incommingQuantityList, 
  outgoingQuantityList
) => {
  try {
    console.log(shopNo)
    console.log(transferFrom)
    console.log(transferTo)
    console.log(address)
    console.log(transferBy)
    console.log(phoneNo)
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      "/api/transferProduct/post",
      {
        shopNo,
        transferFrom,
        transferTo,
        transferBy,
        address,
        phoneNo,
        list,
        incommingQuantityList, 
        outgoingQuantityList
      },
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    return error?.response?.data
  }
};

// export const postTransferProduct =  (
//   transferFrom,
//   transferTo,
//   transferBy,
//   address,
//   phoneNo,
//   list
// ) =>async(dispatch) =>{
//   try {
//     dispatch({type: POST_TRANSFER_PRODUCT_REQUEST})
//     const config = { headers: { "Content-Type": "application/json" } };
//     const { data } = await axiosInstance.post(
//       "/api/transferProduct/post",
//       {
//         transferFrom,
//         transferTo,
//         transferBy,
//         address,
//         phoneNo,
//         list,
//       },
//       config
//     );
//     // return data;
//     dispatch({type: POST_TRANSFER_PRODUCT_SUCCESS,
//     payload: data})
//   } catch (error) {
//     console.log(error);
//     dispatch({type: POST_TRANSFER_PRODUCT_FAIL,
//       payload: error})
//   }
// };

export const deleteTempTransferPendingsFromTable = async (id) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.delete(
      `/api/transferProduct/deleteFromTransferPendings/${id}`
    );
    return data;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

export const getTransferInvoiceRecord = async (storageCode) => {
  try {
    const { data } = await axiosInstance.get(
      `/api/transferProduct/getInvoiceRecordOnStorageCode/${storageCode}`
    );
    return data;
  } catch (error) {}
};

export const getTransferInvoiceRecordOnMultipleShops = async (id1, id2) => {
  try {
    const { data } = await axiosInstance.get(
      `/api/transferProduct/getInvoiceRecordOnMultipleShops/${id1}/${id2}`
    );
    return data;
  } catch (error) {}
};

export const getProductLocationOnGodownAndProductId = async (
  productId,
  colorId,
  godownAvalibilityId
) => {
  try {
    console.log(productId);
    console.log(godownAvalibilityId);
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.get(
      `/api/transferProduct/getProductLocationOnGodownAndProductId/${productId}/${colorId}/${godownAvalibilityId}`,
      config
    );
    return data;
  } catch (error) {}
};

export const getTransferDetailsForPreview = async (salesId) => {
  try {
    const data = await axiosInstance.get(`/api/transferProduct/get/${salesId}`);
    return data;
  } catch (error) {
    console.log("Failed to fetch purchase details");
  }
};


// export const getTransferRecordForConsolidated = async (timePeriod) => {
//   try {
//     const { data } = await axiosInstance.get(`/api/transferProduct/getTransferRecordForConsolidated?option=${timePeriod}`);
//     return data;
//   } catch (error) {}
// };

export const getTransferRecordForConsolidated =  (timePeriod) =>async(dispatch)=> {
  try {
    dispatch({ type: GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_REQUEST });
    const { data } = await axiosInstance.get(`/api/transferProduct/getTransferRecordForConsolidated?option=${timePeriod}`);
    dispatch({
      type: GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_FAIL,
      payload: error.response,
    });
  }
};

export const getTransferRecordForConsolidatedOnDates =  (startingDate, endingDate) =>async (dispatch)=> {
  try {
    dispatch({ type: GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_REQUEST });
    console.log(startingDate, endingDate)
    const { data } = await axiosInstance.get(`/api/transferProduct/getTransferRecordForConsolidated?starting=${startingDate}&ending=${endingDate}`);
    dispatch({
      type: GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_ON_DATE_FAIL,
      payload: error.response,
    });
  }
};

// export const getTransferRecordForConsolidatedForSpecificShop = async (shopNo, timePeriod) => {
//   try {
//     console.log(shopNo)
//     console.log(timePeriod)
//     const { data } = await axiosInstance.get(`/api/transferProduct/getTransferRecordForConsolidatedForShop/${shopNo}?option=${timePeriod}`);
//     console.log(data)
//     return data;
//   } catch (error) {}
// };

export const getTransferRecordForConsolidatedForSpecificShop =  (shopNo, timePeriod)=> async(dispatch) => {
  try {
    dispatch({ type: GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_REQUEST });
    const { data } = await axiosInstance.get(`/api/transferProduct/getTransferRecordForConsolidatedForShop/${shopNo}?option=${timePeriod}`);
    dispatch({
      type: GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_FAIL,
      payload: error.response,
    });
  }
};

// export const getTransferRecordForConsolidatedForSpecificShopOnDate = async (shopNo, startingDate, endingDate) => {
//   try {
//     const { data } = await axiosInstance.get(`/api/transferProduct/getTransferRecordForConsolidatedForShop/${shopNo}?starting=${startingDate}&ending=${endingDate}`);
//     return data;
//   } catch (error) {}
// };

export const getTransferRecordForConsolidatedForSpecificShopOnDate =  (shopNo, startingDate, endingDate)=> async(dispatch) => {
  try {
    dispatch({ type: GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_REQUEST });
    const { data } = await axiosInstance.get(`/api/transferProduct/getTransferRecordForConsolidatedForShop/${shopNo}?starting=${startingDate}&ending=${endingDate}`);
    // return data;
    dispatch({
      type: GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_ON_DATE_FAIL,
      payload: error.response,
    });
  }
};