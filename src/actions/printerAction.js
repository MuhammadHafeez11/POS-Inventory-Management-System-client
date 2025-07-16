import axiosInstance from "./baseURL";

export const PrintContent =async () => {
    try {
    //   dispatch({ type: ALL_COLOR_REQUEST });
    console.log('confe')
    const content = 'Content to be printed';
      const { data } = await axiosInstance.post(`/api/printer/print`, content, {
        headers: {
        
          "Content-Type": "application/json"
        },
      }
      );
      console.log(data)
    //   dispatch({
    //     type: ALL_COLOR_SUCCESS,
    //     payload: data,
    //   });
    } catch (error) {
    //   dispatch({
    //     type: ALL_COLOR_FAIL,
    //     payload: error.response,
    //   });
    }
  };