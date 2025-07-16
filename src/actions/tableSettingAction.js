import axios from 'axios'
import axiosInstance from "./baseURL"
export const postTableRows = async(noOfRows) =>  {
  try {
     const config = { headers: { "Content-Type": "application/json" } };
     const { data } = await axiosInstance.post(
         `/api/tableSetting/post`,
         {noOfRows},
         config
     )
      return data;
  } catch (error) {
     console.log(error.response)
  }
 }



export const getAllTableSetting = async () => {
    try {
    const {data} =await axiosInstance.get("/api/tableSetting/getTableRowsRecord")
    console.log(data)
      return data;
    } catch (error) {
      // console.warn(error);
      console.log(error)
      // throw new Error("Failed to fetch geting printer Record");
    }
  };
  export const getSingleTableRecord = async (id) => {
    try {
    const {data} =await axiosInstance.get(`/api/tableSetting/getSingleTableRows/${id}`)
    console.log(data)
      return data;
    } catch (error) {
      // console.warn(error)
      console.log(error)
      // throw new Error("Failed to fetch geting printer Record");
    }
  };
  