import {
  CREATE_TASK_GROUP_REQUEST,
  CREATE_TASK_GROUP_SUCCESS,
  CREATE_TASK_GROUP_FAIL,
  GET_ALL_TASK_GROUPS_REQUEST,
  GET_ALL_TASK_GROUPS_SUCCESS,
  GET_ALL_TASK_GROUPS_FAIL,
  GET_TASK_GROUP_DETAILS_REQUEST,
  GET_TASK_GROUP_DETAILS_SUCCESS,
  GET_TASK_GROUP_DETAILS_FAIL,
  UPDATE_TASK_GROUP_REQUEST,
  UPDATE_TASK_GROUP_SUCCESS,
  UPDATE_TASK_GROUP_FAIL,
  DELETE_TASK_GROUP_REQUEST,
  DELETE_TASK_GROUP_SUCCESS,
  DELETE_TASK_GROUP_FAIL,
  CLEAR_ERRORS
} from "../constants/taskGroupConstant";
import axios from "./baseURL"

// Create task group
export const createTaskGroup = (taskGroupData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_TASK_GROUP_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const { data } = await axios.post(
      "/api/taskgroup",
      taskGroupData,
      config
    );

    dispatch({
      type: CREATE_TASK_GROUP_SUCCESS,
      payload: data.taskGroup
    });
  } catch (error) {
    dispatch({
      type: CREATE_TASK_GROUP_FAIL,
      payload: error.response.data.message
    });
  }
};

// Get all task groups
export const getAllTaskGroups = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_TASK_GROUPS_REQUEST });

    const { data } = await axios.get("/api/taskgroup");

    dispatch({
      type: GET_ALL_TASK_GROUPS_SUCCESS,
      payload: data.taskGroups
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_TASK_GROUPS_FAIL,
      payload: error.response.data.message
    });
  }
};

// Get task group details
export const getTaskGroupDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_TASK_GROUP_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/taskgroup/${id}`);

    dispatch({
      type: GET_TASK_GROUP_DETAILS_SUCCESS,
      payload: data.taskGroup
    });
  } catch (error) {
    dispatch({
      type: GET_TASK_GROUP_DETAILS_FAIL,
      payload: error.response.data.message
    });
  }
};

// Update task group
export const updateTaskGroup = (id, taskGroupData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TASK_GROUP_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const { data } = await axios.put(
      `/api/taskgroup/${id}`,
      taskGroupData,
      config
    );

    dispatch({
      type: UPDATE_TASK_GROUP_SUCCESS,
      payload: data.success
    });
  } catch (error) {
    dispatch({
      type: UPDATE_TASK_GROUP_FAIL,
      payload: error.response.data.message
    });
  }
};

// Delete task group
export const deleteTaskGroup = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TASK_GROUP_REQUEST });

    const { data } = await axios.delete(`/api/v1/taskgroup/${id}`);

    dispatch({
      type: DELETE_TASK_GROUP_SUCCESS,
      payload: data.success
    });
  } catch (error) {
    dispatch({
      type: DELETE_TASK_GROUP_FAIL,
      payload: error.response.data.message
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};