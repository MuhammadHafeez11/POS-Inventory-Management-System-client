
// import {  LOGIN_SUCCESS, LOGIN_FAIL, REGISTER_FAIL,REGISTER_REQUEST, REGISTER_SUCCESS, CLEAR_ERRORS } from "../constants/userConstants"
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL, REGISTER_FAIL,REGISTER_REQUEST, REGISTER_SUCCESS, 
    CLEAR_ERRORS, LOGOUT_SUCCESS, LOGOUT_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS,
     LOAD_USER_FAIL, TOKEN_REFRESH_SUCCESS, TOKEN_REFRESH_FAIL, TOKEN_REFRESH_REQUEST, FORGOTPASSWORD_REQUEST, FORGOTPASSWORD_SUCCESS, FORGOTPASSWORD_FAIL, LOGOUT_REQUEST,  
     GET_USERS_ON_SHOPCODE_SUCCESS,
     GET_USERS_ON_SHOPCODE_REQUEST,
     GET_USERS_ON_SHOPCODE_FAIL,
     SET_DEVICE_ID,
     CLEAR_DEVICE_ID,
     DEVICE_ID_REQUEST} from "../constants/userConstants"

export const userReducer =(state = { user: {}}, action)=>{
    switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
        case LOAD_USER_REQUEST:
        case LOGOUT_REQUEST:
        case TOKEN_REFRESH_REQUEST:
            return {
                loading: true,
                isAuthenticated: false
            }
        case LOGIN_SUCCESS: 
        case REGISTER_SUCCESS: 
        case LOAD_USER_SUCCESS:
        return {
            ...state, 
            loading: false,
            isAuthenticated: true,
            user: action.payload,
        }

        case LOGOUT_SUCCESS:
        return {
            loading: false,
            isAuthenticated: false,
            user: null
        }

        case TOKEN_REFRESH_SUCCESS: 
        return {
            ...state,
            loading: false,
            isAuthenticated: true,
        }
        case TOKEN_REFRESH_FAIL: 
        return {
            loading: false,
            isAuthenticated: false,
            error: action.payload,
        }
        case LOAD_USER_FAIL: 
        return {
            loading: false,
            isAuthenticated: false,
            user: null,
            error: action.payload,
        }
        case LOGIN_FAIL: 
        return {
            ...state,
            loading: false,
            error: action.payload
        }
        case REGISTER_FAIL: 
        return {
            ...state, 
            loading: false,
            isAuthenticated: false,
            user: null,
            error: action.payload,
        }

        case LOGOUT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
           return state;
    }
}


export const forgotPasswordReducer =(state = { forgotPassword: {}}, action)=>{
    switch (action.type) {
        case FORGOTPASSWORD_REQUEST:
            return {
                loading: true,
                forgotPassword: []
            }
        case FORGOTPASSWORD_SUCCESS: 
        return {
            ...state, 
            loading: false,
            forgotPassword: action.payload,
        }
        case FORGOTPASSWORD_FAIL: 
        return {
            loading: false,
            error: action.payload,
        }
        
       
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
           return state;
    }
}


export const getUsersOnShopCodeReducer = (state = { usersOnShopCode: []}, action)=>{
    switch (action.type){
        case GET_USERS_ON_SHOPCODE_REQUEST:
            return{
                usersOnShopCodeLoading: true,
                usersOnShopCode: [],
            };
        case GET_USERS_ON_SHOPCODE_SUCCESS: 
            return {
                usersOnShopCodeLoading: false,
                usersOnShopCode: action.payload
            }
        case GET_USERS_ON_SHOPCODE_FAIL:
            return {
                usersOnShopCodeLoading: false,
                usersOnShopCodeError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                usersOnShopCodeError: null,
            }
            default:
            return state;
            
    }
}


export const setDeviceIdReducer = (state = { deviceId: null}, action)=>{
    switch (action.type){
        case DEVICE_ID_REQUEST:
            return{
                deviceIdLoading: true,
                deviceId: null,
            };
        case SET_DEVICE_ID: 
            return {
                deviceIdLoading: false,
                deviceId: action.payload
            }
        case CLEAR_DEVICE_ID:
            return {
                ...state,
                deviceId: null,
            }
            default:
            return state;
            
    }
}
