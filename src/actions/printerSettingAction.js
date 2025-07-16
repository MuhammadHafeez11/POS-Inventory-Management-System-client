import axios from "axios";
import axiosInstance from "./baseURL";
export const getAllPrinters = async () => {
  try {
    const { data } = await axiosInstance.get("/api/printer/getPrinter");
    console.log(data);
    return data;
  } catch (error) {
    // console.warn(error);
    console.log(error);
  }
};

export const getSinglePrinter = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/api/printer/getSinglePrinter/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    // console.warn(error);
    console.log(error);
  }
};

export const updatePrinterStatus = async (id) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.put(`/api/printer/putPrinter/${id}`);
    return data;
  } catch (error) {
    console.log(error.response);
  }
};
