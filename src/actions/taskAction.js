// import axios from "axios";
import {
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAIL,
  GET_TASK_REQUEST,
  GET_TASK_SUCCESS,
  GET_TASK_FAIL,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAIL,
  GET_TASKS_BY_GROUP_REQUEST,
  GET_TASKS_BY_GROUP_SUCCESS,
  GET_TASKS_BY_GROUP_FAIL,
  CLEAR_ERRORS
} from "../constants/taskConstants";
import axios from './baseURL'

// Get all tasks
export const getTask = () => async (dispatch) => {
  try {
    dispatch({ type: GET_TASK_REQUEST });

    const { data } = await axios.get("/api/task/get");

    dispatch({
      type: GET_TASK_SUCCESS,
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: GET_TASK_FAIL,
      payload: error.response.data.message
    });
  }
};

// Create task
export const createTask = (taskData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_TASK_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    console.log(taskData)
    const { data } = await axios.post(
      "/api/task/post",
      taskData,
      config
    );

    dispatch({
      type: CREATE_TASK_SUCCESS,
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: CREATE_TASK_FAIL,
      payload: error.response.data.message
    });
  }
};

// Get tasks by group
export const getTasksByGroup = (groupName) => async (dispatch) => {
  try {
    dispatch({ type: GET_TASKS_BY_GROUP_REQUEST });

    const { data } = await axios.get(`/api/task/group/${groupName}`);

    dispatch({
      type: GET_TASKS_BY_GROUP_SUCCESS,
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: GET_TASKS_BY_GROUP_FAIL,
      payload: error.response.data.message
    });
  }
};

// Add or update the updateTask action
export const updateTask = (id, taskData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TASK_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const { data } = await axios.put(
      `/api/task/${id}`,
      taskData,
      config
    );

    dispatch({
      type: UPDATE_TASK_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: UPDATE_TASK_FAIL,
      payload: error.response.data.message
    });
  }
};

// Delete task
export const deleteTask = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TASK_REQUEST });

    const { data } = await axios.delete(`/api/task/${id}`);

    dispatch({
      type: DELETE_TASK_SUCCESS,
      payload: data.success
    });
  } catch (error) {
    dispatch({
      type: DELETE_TASK_FAIL,
      payload: error.response.data.message
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};