import {
  ROLE_REQUEST,
  ROLE_SUCCESS,
  ROLE_FAIL,
  POST_ROLE_REQUEST,
  POST_ROLE_SUCCESS,
  POST_ROLE_FAIL,
  CLEAR_ERRORS,
} from "../constants/roleConstants";
// import { useNavigate } from "react-router-dom";
export const roleReducer = (state = { role: [] }, action) => {
  // const navigate = useNavigate()
  console.log(action.payload);
  // if(action?.payload?.data === "Please login to acces this resource"){
  //   console.log('hcie')
  // }
  switch (action.type) {
    case ROLE_REQUEST:
      return {
        loading: true,
        role: [],
      };
    case ROLE_SUCCESS:
      return {
        loading: false,
        role: action.payload,
      };
    case ROLE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
