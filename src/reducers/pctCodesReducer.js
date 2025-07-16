
import { ALL_DISTINCT_COMPANIES_FROM_PCTCODE_FAIL, ALL_DISTINCT_COMPANIES_FROM_PCTCODE_REQUEST, ALL_DISTINCT_COMPANIES_FROM_PCTCODE_SUCCESS, ALL_PCTCODE_COMPANY_FAIL, ALL_PCTCODE_COMPANY_REQUEST, ALL_PCTCODE_COMPANY_SUCCESS, ALL_PCTCODE_DELETE_FAIL, ALL_PCTCODE_DELETE_REQUEST, ALL_PCTCODE_DELETE_SUCCESS, ALL_PCTCODE_DESCRIPTION_FAIL, ALL_PCTCODE_DESCRIPTION_REQUEST, ALL_PCTCODE_DESCRIPTION_SUCCESS, ALL_PCTCODE_DETAILS_FAIL, ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_FAIL, ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_REQUEST, ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_SUCCESS, ALL_PCTCODE_DETAILS_REQUEST, ALL_PCTCODE_DETAILS_SUCCESS, ALL_PCTCODE_FAIL, ALL_PCTCODE_POST_FAIL, ALL_PCTCODE_POST_REQUEST, ALL_PCTCODE_POST_SUCCESS, ALL_PCTCODE_REQUEST, ALL_PCTCODE_SUCCESS, ALL_PCTCODE_UPDATE_FAIL, ALL_PCTCODE_UPDATE_REQUEST, ALL_PCTCODE_UPDATE_SUCCESS, CLEAR_ERRORS } from "../constants/pctCodesContants";

export const pctCodeReducer = (state = { pctCode: []}, action)=>{
    switch (action.type){
        case ALL_PCTCODE_REQUEST:
            return{
                pctCodeLoading: true,
                pctCode: [],
            };
        case ALL_PCTCODE_SUCCESS: 
            return {
                pctCodeLoading: false,
                pctCode: action.payload
            }
        case ALL_PCTCODE_FAIL:
            return {
                pctCodeLoading: false,
                pctCodeError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                pctCodeError: null,
            }
            default:
            return state;
            
    }
}

export const postPCTCodeReducer = (state = { pctCodeRes: []}, action)=>{
    switch (action.type){
        case ALL_PCTCODE_POST_REQUEST:
            return{
                pctCodeResLoading: true,
                pctCodeRes: [],
            };
        case ALL_PCTCODE_POST_SUCCESS: 
            return {
                pctCodeResLoading: false,
                pctCodeRes: action.payload
            }
        case ALL_PCTCODE_POST_FAIL:
            return {
                pctCodeResLoading: false,
                pctCodeResError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                pctCodeResError: null,
            }
            default:
            return state;
            
    }
}

export const updatePCTCodeReducer = (state = { pctCodeUpdate: []}, action)=>{
    switch (action.type){
        case ALL_PCTCODE_UPDATE_REQUEST:
            return{
                pctCodeUpdateLoading: true,
                pctCodeUpdate: [],
            };
        case ALL_PCTCODE_UPDATE_SUCCESS: 
            return {
                pctCodeUpdateLoading: false,
                pctCodeUpdate: action.payload
            }
        case ALL_PCTCODE_UPDATE_FAIL:
            return {
                pctCodeUpdateLoading: false,
                pctCodeUpdateError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                pctCodeUpdateError: null,
            }
            default:
            return state;
            
    }
}

export const pctCodeDetailsReducer = (state = { pctCodeDetails: []}, action)=>{
    switch (action.type){
        case ALL_PCTCODE_DETAILS_REQUEST:
            return{
                pctCodeDetailsLoading: true,
                pctCodeDetails: [],
            };
        case ALL_PCTCODE_DETAILS_SUCCESS: 
            return {
                pctCodeDetailsLoading: false,
                pctCodeDetails: action.payload
            }
        case ALL_PCTCODE_DETAILS_FAIL:
            return {
                pctCodeDetailsLoading: false,
                pctCodeDetailsError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                pctCodeDetailsError: null,
            }
            default:
            return state;
            
    }
}

export const deletePCTCodeReducer = (state = { pctCodeDelete: []}, action)=>{
    switch (action.type){
        case ALL_PCTCODE_DELETE_REQUEST:
            return{
                pctCodeDeleteLoading: true,
                pctCodeDelete: [],
            };
        case ALL_PCTCODE_DELETE_SUCCESS: 
            return {
                pctCodeDeleteLoading: false,
                pctCodeDelete: action.payload
            }
        case ALL_PCTCODE_DELETE_FAIL:
            return {
                pctCodeDeleteLoading: false,
                pctCodeDeleteError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                pctCodeDeleteError: null,
            }
            default:
            return state;
            
    }
}

export const getPCTCodeDetialsOnComapnyAndTypeReducer = (state = { pctCodeOnCompanyAndType: []}, action)=>{
    switch (action.type){
        case ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_REQUEST:
            return{
                pctCodeOnCompanyAndTypeLoading: true,
                pctCodeOnCompanyAndType: [],
            };
        case ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_SUCCESS: 
            return {
                pctCodeOnCompanyAndTypeLoading: false,
                pctCodeOnCompanyAndType: action.payload
            }
        case ALL_PCTCODE_DETAILS_ONCOMPANYANDTYPE_FAIL:
            return {
                pctCodeOnCompanyAndTypeLoading: false,
                pctCodeOnCompanyAndTypeError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                pctCodeOnCompanyAndTypeError: null,
            }
            default:
            return state;
            
    }
}


export const distinctCompaniesOnPCTCodeReducer = (state = { distictCompanies: []}, action)=>{
    switch (action.type){
        case ALL_DISTINCT_COMPANIES_FROM_PCTCODE_REQUEST:
            return{
                distictCompaniesLoading: true,
                distictCompanies: [],
            };
        case ALL_DISTINCT_COMPANIES_FROM_PCTCODE_SUCCESS: 
            return {
                distictCompaniesLoading: false,
                distictCompanies: action.payload
            }
        case ALL_DISTINCT_COMPANIES_FROM_PCTCODE_FAIL:
            return {
                distictCompaniesLoading: false,
                distictCompaniesError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                distictCompaniesError: null,
            }
            default:
            return state;
            
    }
}


export const pctCodeCompanyReducer = (state = { pctCodeCompany: []}, action)=>{
    switch (action.type){
        case ALL_PCTCODE_COMPANY_REQUEST:
            return{
                pctCodeCompanyLoading: true,
                pctCodeCompany: [],
            };
        case ALL_PCTCODE_COMPANY_SUCCESS: 
            return {
                pctCodeCompanyLoading: false,
                pctCodeCompany: action.payload
            }
        case ALL_PCTCODE_COMPANY_FAIL:
            return {
                pctCodeCompanyLoading: false,
                pctCodeCompanyError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                pctCodeCompanyError: null,
            }
            default:
            return state;
            
    }
}


export const pctCodeDescriptionReducer = (state = { pctCodeDescription: []}, action)=>{
    switch (action.type){
        case ALL_PCTCODE_DESCRIPTION_REQUEST:
            return{
                pctCodeDescriptionLoading: true,
                pctCodeDescription: [],
            };
        case ALL_PCTCODE_DESCRIPTION_SUCCESS: 
            return {
                pctCodeDescriptionLoading: false,
                pctCodeDescription: action.payload
            }
        case ALL_PCTCODE_DESCRIPTION_FAIL:
            return {
                pctCodeDescriptionLoading: false,
                pctCodeDescriptionError: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                pctCodeDescriptionError: null,
            }
            default:
            return state;
            
    }
}