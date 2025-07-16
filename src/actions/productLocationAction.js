import axios from "axios"
import { ALL_PRODUCT_LOCATION_FAIL, ALL_PRODUCT_LOCATION_ON_STORAGECODE_REQUEST, 
    ALL_PRODUCT_LOCATION_ON_STORAGECODE_SUCCESS, ALL_PRODUCT_LOCATION_REQUEST, 
    ALL_PRODUCT_LOCATION_SUCCESS, ALL_PRODUCT_LOCATION_ON_STORAGECODE_FAIL,
     UPDATE_AND_POST_PRODUCT_IN_LOCATION_REQUEST, UPDATE_AND_POST_PRODUCT_IN_LOCATION_SUCCESS,
      UPDATE_AND_POST_PRODUCT_IN_LOCATION_FAIL, PRODUCT_LOCATION_ON_ID_REQUEST, PRODUCT_LOCATION_ON_ID_SUCCESS, PRODUCT_LOCATION_ON_ID_FAIL, 
      UPDATE_QUANTITY_USING_TRANSFER_REQUEST, UPDATE_QUANTITY_USING_TRANSFER_SUCCESS, UPDATE_QUANTITY_USING_TRANSFER_FAIL, UPDATE_MINUS_QUANTITY_USING_TRANSFER_REQUEST, UPDATE_MINUS_QUANTITY_USING_TRANSFER_SUCCESS, UPDATE_MINUS_QUANTITY_USING_TRANSFER_FAIL, UPDATE_AND_POST_QUANTITY_USING_TRANSFER_REQUEST, UPDATE_AND_POST_QUANTITY_USING_TRANSFER_SUCCESS, UPDATE_AND_POST_QUANTITY_USING_TRANSFER_FAIL, PRODUCT_LOCATION_ON_SHOPTYPE_REQUEST, PRODUCT_LOCATION_ON_SHOPTYPE_SUCCESS, PRODUCT_LOCATION_ON_SHOPTYPE_FAIL, PRODUCT_LOCATION_ON_GODOWNTYPE_REQUEST, PRODUCT_LOCATION_ON_GODOWNTYPE_SUCCESS, PRODUCT_LOCATION_ON_GODOWNTYPE_FAIL, UPDATE_AND_POST_PRODUCT_IN_LOCATION_PURCHASE_REQUEST, UPDATE_AND_POST_PRODUCT_IN_LOCATION_PURCHASE_SUCCESS, UPDATE_AND_POST_PRODUCT_IN_LOCATION_PURCHASE_FAIL, UPDATE_PRODUCT_IN_LOCATION_SALE_REQUEST, UPDATE__PRODUCT_IN_LOCATION_SALE_SUCCESS, UPDATE_PRODUCT_IN_LOCATION_SALE_FAIL } from "../constants/productLocationConstants"
import axiosInstance from "./baseURL"


export const getProductLocation = ()=>async(dispatch)=>{
    try{
        dispatch({type: ALL_PRODUCT_LOCATION_REQUEST})
        const {data}= await axiosInstance.get("/api/productLocation/get")
        dispatch({
            type: ALL_PRODUCT_LOCATION_SUCCESS,
            payload: data,
        })
    }
    catch(error){
        dispatch({
            type: ALL_PRODUCT_LOCATION_FAIL,
            payload: error.response
        })
    }
}

export const getGlobalProductLoc = async(code)=>{
    try{
        console.log(code)
        const data= await axiosInstance.get(`/api/productLocation/getGlobalAvailableProductsOnSearch?code=${code}`)
        console.log(data)
        return data;
    }
    catch(error){
       console.log(error)
    }
}

export const getProductLoc = async( shopType, godownType, shopId, godownId, code, type, company )=>{
    try{
        console.log(shopType, godownType, shopId, godownId, code, type, company)
        const data= await axiosInstance.get(`/api/productLocation/get?shopType=${shopType}&godownType=${godownType}&shopId=${shopId}&godownId=${godownId}&code=${code}&type=${type}&company=${company}`)
        console.log(data)
        return data;
    }
    catch(error){
       console.log(error)
    }
}


export const getSearchAvailableProducts = async(queryParams)=>{
    try{
        console.log('function')
        console.log("consolelog", queryParams)
        console.log(queryParams.shopOption)
        const { shopOption, godownOption, shopId, godownId, productCode, productType, productCompany } = queryParams;
        console.log(shopOption, godownOption, shopId, godownId, productCode, productType, productCompany)
    let baseQuery;
    if (shopOption) baseQuery += `&shopOption=${shopOption}`;
    if (godownOption) baseQuery += `&godownOption=${godownOption}`;
    if (shopId) baseQuery += `&shopId=${shopId}`;
    if (godownId) baseQuery += `&godownId=${godownId}`;
    if (productCode) baseQuery += `&productCode=${productCode}`;
    if (productType) baseQuery += `&productType=${productType}`;
    if (productCompany) baseQuery += `&productCompany=${productCompany}`;
    console.log(baseQuery);
        // const data= await axiosInstance.get(`/api/productLocation/getAvailableProductsOnSearch?shopOption=${shopOption}&godownOption=${godownOption}
        //     &shopId=${shopId}&godownId=${godownId}&productCode=${productCode}&productType=${productType}&productCompany=${productCompany}`);
        const data= await axiosInstance.get(`/api/productLocation/getAvailableProductsOnSearch?${baseQuery}`);
            
        console.log(data)
        return data;
    }
    catch(error){
       console.log(error)
    }
}


export const getProductLocationOnShopType = ()=>async(dispatch)=>{
    try{
        dispatch({type: PRODUCT_LOCATION_ON_SHOPTYPE_REQUEST})
        const {data}= await axiosInstance.get("/api/productLocation/getProductLocationOnShopType")
        console.log(data)
        dispatch({
            type: PRODUCT_LOCATION_ON_SHOPTYPE_SUCCESS,
            payload: data,
        })
    }
    catch(error){
        dispatch({
            type: PRODUCT_LOCATION_ON_SHOPTYPE_FAIL,
            payload: error.response
        })
    }
}

export const getProductLocationOnGodownType = ()=>async(dispatch)=>{
    try{
        dispatch({type: PRODUCT_LOCATION_ON_GODOWNTYPE_REQUEST})
        const {data}= await axiosInstance.get("/api/productLocation/getProductLocationOnGodownType")
        console.log(data)
        dispatch({
            type: PRODUCT_LOCATION_ON_GODOWNTYPE_SUCCESS,
            payload: data,
        })
    }
    catch(error){
        dispatch({
            type: PRODUCT_LOCATION_ON_GODOWNTYPE_FAIL,
            payload: error.response
        })
    }
}



export const getProductLocationOnShopId = async(id)=>{
    try{
        console.log(id)
        const {data}= await axiosInstance.get(`/api/productLocation/getForShop/${id}`)
        return data;
    }
    catch(error){
       console.log(error)
    }
}

export const getProductLocationOnGodownAndShop = async(id1, id2)=>{
    try{
        const {data}= await axiosInstance.get(`/api/productLocation/getProductLocationOnTwoLocations/${id1}/${id2}`)
        return data;
    }
    catch(error){
       console.log(error)
    }
}

export const getProductLocationOnGodownId = async(id)=>{
    try{
        console.log(id)
        const {data}= await axiosInstance.get(`/api/productLocation/getForGodown/${id}`)
        return data;
    }
    catch(error){
       console.log(error)
    }
}

export const getProductLocationOnStorageCode = async(storageCode)=>{
    try{
        const {data}= await axiosInstance.get(`/api/productLocation/getProductForStorageCode/${storageCode}`)
        return data;
    }
    catch(error){
        console.log(error)
    }
}
export const getProductLocationOnBarcode = async (barcode) => {
    try {
      console.log(barcode)
      const  result  = await axiosInstance.get(`/api/productLocation/barcode/${barcode}`);
      console.log(result)
      return result;
    } catch (error) {}
  };
  
  export const getProductLocationProductColorAndLocation = async (id1, id2, id3) => {
    try {
        console.log(id1)
      const  result  = await axiosInstance.get(`/api/productLocation/getProductLocationOnProductColorAndLocation/${id1}/${id2}/${id3}`);
      console.log(result)
      return result;
    } catch (error) {}
  };
export const getProductLocationOnId = async(id)=>{
    try{
        // dispatch({type: PRODUCT_LOCATION_ON_ID_REQUEST})
        console.log(id)
        const data= await axiosInstance.get(`/api/productLocation/getId/${id}`)
        return data;
    }
    catch(error){
       console.log(error)
    }
}
export const getProductLocationForBarcode = async(id)=>{
    try{
        // dispatch({type: PRODUCT_LOCATION_ON_ID_REQUEST})
        console.log(id)
        const data= await axiosInstance.get(`/api/productlocation/getProductLocationForBarcode/${id}`)
        return data;
    }
    catch(error){
       console.log(error)
    }
}
export const deleteLocation =async (id)=>{
    try {
        const { data } = await axiosInstance.delete(
            `/api/productLocation/delete/${id}`
        )
        return data;
     } catch (error) {
        console.log(error.response)

     }
}


   export const updateAndPostProductInLocation = async(
    quantityidset,
    colorId,
    shopAvalibility,
    godownAvalibility,
    PurchaseQuantity) =>  {
    try {
     
        console.log(quantityidset)
        console.log(colorId)
        console.log(shopAvalibility)
        console.log(godownAvalibility)
        console.log(PurchaseQuantity)
       const config = { headers: { "Content-Type": "application/json" } };
       const { data } = await axiosInstance.post(
        "/api/productLocation/updateAndPostProduct",
           { 
            quantityidset,
            colorId,
            shopAvalibility,
            godownAvalibility,
            PurchaseQuantity },
           config
       )
    console.log(data)
   
    } catch (error) {
       console.log(error.response)
    }
   }

   export const updateAndPostProductInLocationUsingPurchase = (
    quantityidset,
    colorId,
    shopAvalibility,
    godownAvalibility,
    PurchaseQuantity) => async(dispatch) => {
        try {
            dispatch({ type: UPDATE_AND_POST_PRODUCT_IN_LOCATION_PURCHASE_REQUEST });
            const config = { headers: { "Content-Type": "application/json" } };
            const { data } = await axiosInstance.post(
                "/api/productLocation/updateAndPostProduct",
                   { 
                    quantityidset,
                    colorId,
                    shopAvalibility,
                    godownAvalibility,
                    PurchaseQuantity },
                   config
               )
            dispatch({
              type: UPDATE_AND_POST_PRODUCT_IN_LOCATION_PURCHASE_SUCCESS,
              payload: data,
            });
          } catch (error) {
            dispatch({
              type: UPDATE_AND_POST_PRODUCT_IN_LOCATION_PURCHASE_FAIL,
              payload: error.response,
            });
          }
   }



   
//    export const updateProductLocationOnSale = async(
//     quantityidset,
//     colorId,
//     shopAvalibility,
//     PurchaseQuantity) =>  {
//     try {
     
//         console.log(quantityidset)
//         console.log(colorId)
//         console.log(shopAvalibility)
//         console.log(PurchaseQuantity)
//        const config = { headers: { "Content-Type": "application/json" } };
//        const { data } = await axiosInstance.put(
//         "/api/productLocation/updateProductLocOnSale",
//            { quantityidset,
//             colorId,
//             shopAvalibility,
//             PurchaseQuantity },
//            config
//        )
//     console.log(data)
   
//     } catch (error) {
//        console.log(error.response)
//     }
//    }

   export const updateProductLocationOnSale = (
    quantityidset,
    colorId,
    shopAvalibility,
    PurchaseQuantity) =>  async(dispatch) => {
    try {
        dispatch({type: UPDATE_PRODUCT_IN_LOCATION_SALE_REQUEST})
       const config = { headers: { "Content-Type": "application/json" } };
       const { data } = await axiosInstance.put(
        "/api/productLocation/updateProductLocOnSale",
           { quantityidset,
            colorId,
            shopAvalibility,
            PurchaseQuantity },
           config
       )
    console.log(data)
    dispatch({type: UPDATE__PRODUCT_IN_LOCATION_SALE_SUCCESS,
            payload: data})
    } catch (error) {
       console.log(error.response)
       dispatch({type: UPDATE_PRODUCT_IN_LOCATION_SALE_FAIL,
        payload: error.response})
    }
   }



   export const updateProductLocationOnGodownId = (
    quantityidset,
    colorId,
    godownAvalibility,
    PurchaseQuantity) =>  async(dispatch)=>{
    try {
        dispatch({type: UPDATE_MINUS_QUANTITY_USING_TRANSFER_REQUEST
            })
        console.log(quantityidset)
        console.log(colorId)
        console.log(godownAvalibility)
        console.log(PurchaseQuantity)
       const config = { headers: { "Content-Type": "application/json" } };
       const { data } = await axiosInstance.put(
        "/api/productLocation/updateProductLocOnGodownIdUsingTransfer",
           { quantityidset,
            colorId,
            godownAvalibility,
            PurchaseQuantity },
           config
       )
       dispatch({type: UPDATE_MINUS_QUANTITY_USING_TRANSFER_SUCCESS,
       payload: data})
   
    } catch (error) {
       console.log(error.response)
       dispatch({type: UPDATE_MINUS_QUANTITY_USING_TRANSFER_FAIL,
        payload: error.response})
    }
   }


   export const updateAndPostQuantityUsingTransfer = async( quantityidset,
    locationsetid,
    PurchaseQuantity) =>  {
    try {
    //    dispatch({type: UPDATE_AND_POST_QUANTITY_USING_TRANSFER_REQUEST})
       console.log()
       const config = { headers: { "Content-Type": "application/json" } };
       const { data } = await axiosInstance.post(
        "/api/productLocation/updateAndPostProduct",
           {   locationsetid,
            quantityidset,
            PurchaseQuantity,},
           config
       )
       return data;
    //    dispatch({type: UPDATE_AND_POST_QUANTITY_USING_TRANSFER_SUCCESS, payload: data})
   
    } catch (error) {
       console.log(error.response)
    }
   }

   export const updateLocation = async( id, productQuantity) => {
    try {
    //    dispatch({type: UPDATE_MINUS_QUANTITY_USING_TRANSFER_REQUEST})
       const config = { headers: { "Content-Type": "application/json" } };
       const { data } = await axiosInstance.put(
        `/api/productLocation/putId/${id}`,
           { productQuantity},
           config
       )
       return data;
    //    dispatch({type: UPDATE_MINUS_QUANTITY_USING_TRANSFER_SUCCESS, payload: data})
   
    } catch (error) {
       console.log(error.response)
    }
   }

   export const updateMinusQuantityUsingTransfer = async( productQuantity, quantityidset, locationsetid) => {
    try {
    //    dispatch({type: UPDATE_MINUS_QUANTITY_USING_TRANSFER_REQUEST})
       console.log(productQuantity)
       console.log(quantityidset)
       console.log(locationsetid)
       const config = { headers: { "Content-Type": "application/json" } };
       const { data } = await axiosInstance.put(
        `/api/productLocation/updateQuantity/${quantityidset}/${locationsetid}`,
           { productQuantity},
           config
       )
    //    dispatch({type: UPDATE_MINUS_QUANTITY_USING_TRANSFER_SUCCESS, payload: data})
   
    } catch (error) {
       console.log(error.response)
    }
   }

     ////**** Update and Post Color from Excel to MongoDb Server */

export const updateProductLocationTableUsingExcelData = async (updatedJokes) => {
    try {
      console.log("called0");
      console.log(updatedJokes);
      const config = { headers: { "Content-Type": "application/json" } };
      const result = await axiosInstance.post(
        "/api/productLocation/updateProductLocationExcelToMongoDB",
        { updatedJokes },
        config
      );
  
      return result;
    } catch (error) {
      console.log(error.response);
    }
  };
  
  export const postNewProductLocationTableUsingExcel = async (newJokes) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      console.log(newJokes);
      const result = await axiosInstance.post(
        "/api/productLocation/postProductLocationExcelToMongoDB",
        { newJokes },
        config
      );
  
      return result;
    } catch (error) {
      console.log(error.response);
    }
  };