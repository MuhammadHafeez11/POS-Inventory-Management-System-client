import {
    CREATE_TASK_GROUP_REQUEST,
    CREATE_TASK_GROUP_SUCCESS,
    CREATE_TASK_GROUP_FAIL,
    CREATE_TASK_GROUP_RESET,
    GET_ALL_TASK_GROUPS_REQUEST,
    GET_ALL_TASK_GROUPS_SUCCESS,
    GET_ALL_TASK_GROUPS_FAIL,
    GET_TASK_GROUP_DETAILS_REQUEST,
    GET_TASK_GROUP_DETAILS_SUCCESS,
    GET_TASK_GROUP_DETAILS_FAIL,
    UPDATE_TASK_GROUP_REQUEST,
    UPDATE_TASK_GROUP_SUCCESS,
    UPDATE_TASK_GROUP_FAIL,
    UPDATE_TASK_GROUP_RESET,
    DELETE_TASK_GROUP_REQUEST,
    DELETE_TASK_GROUP_SUCCESS,
    DELETE_TASK_GROUP_FAIL,
    DELETE_TASK_GROUP_RESET,
    CLEAR_ERRORS
  } from "../constants/taskGroupConstant";
  
  // Create task group reducer
  export const taskGroupReducer = (state = { taskGroup: {} }, action) => {
    switch (action.type) {
      case CREATE_TASK_GROUP_REQUEST:
        return {
          ...state,
          loading: true
        };
      case CREATE_TASK_GROUP_SUCCESS:
        return {
          loading: false,
          success: true,
          taskGroup: action.payload
        };
      case CREATE_TASK_GROUP_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      case CREATE_TASK_GROUP_RESET:
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
  
  // Get all task groups reducer
  export const allTaskGroupsReducer = (state = { taskGroups: [] }, action) => {
    switch (action.type) {
      case GET_ALL_TASK_GROUPS_REQUEST:
        return {
          loading: true,
          taskGroups: []
        };
      case GET_ALL_TASK_GROUPS_SUCCESS:
        return {
          loading: false,
          taskGroups: action.payload
        };
      case GET_ALL_TASK_GROUPS_FAIL:
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
  
  // Task group details reducer
  export const taskGroupDetailsReducer = (state = { taskGroup: {} }, action) => {
    switch (action.type) {
      case GET_TASK_GROUP_DETAILS_REQUEST:
        return {
          ...state,
          loading: true
        };
      case GET_TASK_GROUP_DETAILS_SUCCESS:
        return {
          loading: false,
          taskGroup: action.payload
        };
      case GET_TASK_GROUP_DETAILS_FAIL:
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
  
  // Update and delete task group reducer
  export const taskGroupUpdateDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case UPDATE_TASK_GROUP_REQUEST:
      case DELETE_TASK_GROUP_REQUEST:
        return {
          ...state,
          loading: true
        };
      case UPDATE_TASK_GROUP_SUCCESS:
        return {
          ...state,
          loading: false,
          isUpdated: action.payload
        };
      case DELETE_TASK_GROUP_SUCCESS:
        return {
          ...state,
          loading: false,
          isDeleted: action.payload
        };
      case UPDATE_TASK_GROUP_FAIL:
      case DELETE_TASK_GROUP_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      case UPDATE_TASK_GROUP_RESET:
        return {
          ...state,
          isUpdated: false
        };
      case DELETE_TASK_GROUP_RESET:
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