import {
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAIL,
  CREATE_TASK_RESET,
  GET_TASK_REQUEST,
  GET_TASK_SUCCESS,
  GET_TASK_FAIL,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  UPDATE_TASK_RESET,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAIL,
  DELETE_TASK_RESET,
  GET_TASKS_BY_GROUP_REQUEST,
  GET_TASKS_BY_GROUP_SUCCESS,
  GET_TASKS_BY_GROUP_FAIL,
  CLEAR_ERRORS
} from "../constants/taskConstants";

// Get all tasks reducer
export const taskReducer = (state = { task: [] }, action) => {
  switch (action.type) {
    case GET_TASK_REQUEST:
      return {
        loading: true,
        task: []
      };
    case GET_TASK_SUCCESS:
      return {
        loading: false,
        task: action.payload
      };
    case GET_TASK_FAIL:
      return {
        loading: false,
        error: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create task reducer
export const newTaskReducer = (state = { task: {} }, action) => {
  switch (action.type) {
    case CREATE_TASK_REQUEST:
      return {
        ...state,
        loading: true
      };
    case CREATE_TASK_SUCCESS:
      return {
        loading: false,
        success: true,
        task: action.payload
      };
    case CREATE_TASK_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case CREATE_TASK_RESET:
      return {
        ...state,
        success: false
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Get tasks by group reducer
export const tasksByGroupReducer = (state = { tasks: [] }, action) => {
  switch (action.type) {
    case GET_TASKS_BY_GROUP_REQUEST:
      return {
        loading: true,
        tasks: []
      };
    case GET_TASKS_BY_GROUP_SUCCESS:
      return {
        loading: false,
        tasks: action.payload
      };
    case GET_TASKS_BY_GROUP_FAIL:
      return {
        loading: false,
        error: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Update and delete task reducer
export const taskUpdateDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_TASK_REQUEST:
    case DELETE_TASK_REQUEST:
      return {
        ...state,
        loading: true
      };
    case UPDATE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload
      };
    case DELETE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload
      };
    case UPDATE_TASK_FAIL:
    case DELETE_TASK_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case UPDATE_TASK_RESET:
      return {
        ...state,
        isUpdated: false
      };
    case DELETE_TASK_RESET:
      return {
        ...state,
        isDeleted: false
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};