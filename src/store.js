import { createStore, combineReducers, applyMiddleware } from "redux";

import thunk from "redux-thunk";import storage from 'redux-persist/lib/storage'; 
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productDetailsReducer,
  productReducer,
  updatePurchaseProductPriceReducer,
  getProductsOnCompanyNameReducer,
  getProductOnBarcodeReducer,
} from "./reducers/productReducer";

import { persistStore, persistReducer } from 'redux-persist';
import {
  colorDetailsReducer,
  colorReducer,
  deleteColorReducer,
  postColorReducer,
  updateColorReducer,
} from "./reducers/colorReducer";


// purchase Approval
import {
  createPurchaseApprovalReducer,
  allPurchaseApprovalsReducer,
  purchaseApprovalDetailsReducer,
  approvePurchaseReducer,
  rejectPurchaseReducer,
  deletePurchaseApprovalReducer,
  deleteProductFromApprovalReducer,
  filteredPurchaseApprovalsReducer
} from "./reducers/purchaseApprovalReducer";

import {
  companyDetailsReducer,
  companyReducer,
  deleteCompanyReducer,
  postCompanyReducer,
  updateCompanyReducer,
} from "./reducers/companyReducer";
import { forgotPasswordReducer, getUsersOnShopCodeReducer, setDeviceIdReducer, userReducer } from "./reducers/userReducer";
import {
  getActiveUsersReducer,
  getExpensesThisMonthForShopReducer,
  getExpensesThisMonthReducer,
  getPurchaseRecordForCurrentMonthForShopReducer,
  getPurchaseRecordForCurrentMonthReducer,
  getSalesDataForDashBoardReducer,
  getSalesDataForDashBoardWithUserReducer,
  getTopSalesForDashBoardWithUserReducer,
  topProductDashboardReducer,
} from "./reducers/dashboardReducer";
import {
  LocationOnGodownTypeReducer,
  LocationOnShopTypeReducer,
  LocationOnStorageCodeReducer,
  LocationReducer,
  productLocationOnIdReducer,
  updateAndPostProductInLocationReducer,
  updateAndPostProductInLocationUsingPurchaseReducer,
  updateMinusQuantityUsingTransferReducer,
  updateProductInLocationUsingSaleReducer,
  updateQuantityInLocationReducer,
  updateQuantityUsingTransferReducer,
} from "./reducers/productLocationReducer";
import {
  deleteStorageReducer,
  postStorageReducer,
  storageDetailsReducer,
  storageReducer,
  updateStorageReducer,
} from "./reducers/storageReducer";
import {
  deleteProductTypeReducer,
  postProductTypeReducer,
  productTypeDetailsReducer,
  productTypeReducer,
  updateProductTypeReducer,
} from "./reducers/productTypeReducer";
import {
  deleteTempPurchaseItemReducer,
  deleteTempPurchaseReducer,
  getTempPurchasOnShopReducer,
  getTempPurchaseDetialsReducer,
  getTempPurchaseReducer,
  postTempPurchaseReducer,
  updateTempPurchaseProductsReducer,
} from "./reducers/tempPurchaseReducer";
import {
  deleteTempSaleItemListReducer,
  deleteTempSaleItemReducer,
  getTempSaleOnShopNoReducer,
  tempSaleDetailsReducer,
  tempSalePostReducer,
  tempSaleReducer,
  updateTempSaleProductsReducer,
  updateTempSaleQuantityInListReducer,
} from "./reducers/tempSaleReducer";
import { postSaleToFiscalReducer } from "./reducers/saleProductWithFiscalReducer";
import { getSaleConsolidatedForShopsOnDateReducer, getSaleConsolidatedForShopsReducer, getSaleConsolidatedForSpecificShopsOnDateReducer, getSaleConsolidatedForSpecificShopsReducer, getSaleConsolidatedProfitForShopsReducer, getSaleCreditOnShopReducer, getSaleCreditReducer, getSaleOnInvoiceNoAndShopNoReducer, getSaleReducer, getSingleSaleCreditReducer, postFBRSaleReducer, postSaleReducer, updateSaleCreditOnShopReducer } from "./reducers/salePoductReducer";
import {
  deleteTempTransferAllReducer,
  deleteTempTransferProductsReducer,
  postTempTransferReducer,
  tempTransferDetailsReducer,
  tempTransferOnShopReducer,
  tempTransferReducer,
  updateTempTransferItemReducer,
  updateTempTransferReducer,
} from "./reducers/tempTransferReducer";
import { getPurchaseConsolidatedForShopsOnDateReducer, getPurchaseConsolidatedForShopsReducer, getPurchaseConsolidatedForSpecificShopsOnDateReducer, getPurchaseConsolidatedForSpecificShopsReducer, getPurchaseReducer, postPurchaseReducer } from "./reducers/purchaseReducer";
import { getTransferConsolidatedForShopsOnDateReducer, getTransferConsolidatedForShopsReducer, getTransferConsolidatedForSpecificShopsOnDateReducer, getTransferConsolidatedForSpecificShopsReducer, getTransferReducer, postTransferReducer } from "./reducers/transferReducer";
import { shopDeatailReducer, shopReducer } from "./reducers/shopReducer";
import { roleReducer } from "./reducers/roleReducer";
import { AssignTaskByIdNameReducer } from "./reducers/assignTaskReducer";
import {
  taskGroupReducer,
  allTaskGroupsReducer,
  taskGroupDetailsReducer,
  taskGroupUpdateDeleteReducer
} from "./reducers/taskGroupReducer";

import {
  taskReducer,
  newTaskReducer,
  tasksByGroupReducer,
  taskUpdateDeleteReducer
} from "./reducers/taskReducer";
import { subscriptionDateReducer, subscriptionReducer, subscriptionsDisplayReducer } from "./reducers/subscriptionReducer";
import { deleteExpensePaymentReducer, expensePaymentDetailsReducer, expensePaymentReducer, postExpensePaymentReducer, updateExpensePaymentReducer } from "./reducers/expensePaymentReducer";
import { deleteExpenseReducer, expenseDetailsReducer, expenseReducer, getExpenseConsolidatedForShopsReducer, getExpenseConsolidatedForSpecificShopsReducer, postExpenseReducer, updateExpenseReducer } from "./reducers/expenseReducer";
import { getDepositPaymentReducer, postDepositPaymentReducer } from "./reducers/depositReducer";
import { getPaymentWorkFlowReducer } from "./reducers/paymentWorkFlowReducer";
import { getExpenseTypeReducer } from "./reducers/expenseTypeReducer";
import { getPaidCommissionConsolidatedForShopsReducer, getPaidCommissionConsolidatedForSpecificShopsReducer } from "./reducers/employeeCommissionReducer";
import { getReturnReducer } from "./reducers/returnReducer";
import { deletePCTCodeReducer, distinctCompaniesOnPCTCodeReducer, getPCTCodeDetialsOnComapnyAndTypeReducer, pctCodeCompanyReducer, pctCodeDescriptionReducer, pctCodeDetailsReducer, pctCodeReducer, postPCTCodeReducer, updatePCTCodeReducer } from "./reducers/pctCodesReducer";
// import { productReducer } from "./reducers/productReducer"
// import { userReducer } from "./reducers/userReducer"

const reducer = combineReducers({
  
 // New purchase approval reducers
 createPurchaseApproval: createPurchaseApprovalReducer,
 allPurchaseApprovals: allPurchaseApprovalsReducer,
 purchaseApprovalDetails: purchaseApprovalDetailsReducer,
 approvePurchase: approvePurchaseReducer,
 rejectPurchase: rejectPurchaseReducer,
 deletePurchaseApproval: deletePurchaseApprovalReducer,
 deleteProductFromApproval: deleteProductFromApprovalReducer,
 filteredPurchaseApprovals: filteredPurchaseApprovalsReducer,

  deviceIdData: setDeviceIdReducer,
  products: productReducer,
  color: colorReducer,
  company: companyReducer,
  user: userReducer,
  usersOnShopCode: getUsersOnShopCodeReducer,
  topProducts: topProductDashboardReducer,
  topProductsUser: getTopSalesForDashBoardWithUserReducer,
  activeUser: getActiveUsersReducer,
  allSalesData: getSalesDataForDashBoardReducer,
  allSalesDataWithUser: getSalesDataForDashBoardWithUserReducer,
  allPurchaseData: getPurchaseRecordForCurrentMonthReducer,
  allPurchaseDataForShop: getPurchaseRecordForCurrentMonthForShopReducer,
  allExpenseData: getExpensesThisMonthReducer,
  allExpenseDataForShop: getExpensesThisMonthForShopReducer,
  productType: productTypeReducer,
  productLocation: LocationReducer,
  productLocationOnStorageCode: LocationOnStorageCodeReducer,
  colorRes: postColorReducer,
  colorUpdate: updateColorReducer,
  colorDetails: colorDetailsReducer,
  colorDelete: deleteColorReducer,
  companyRes: postCompanyReducer,
  companyUpdate: updateCompanyReducer,
  companyDetails: companyDetailsReducer,
  companyDelete: deleteCompanyReducer,
  storage: storageReducer,
  storageRes: postStorageReducer,
  storageUpdate: updateStorageReducer,
  storageDetails: storageDetailsReducer,
  storageDelete: deleteStorageReducer,
  productTypeRes: postProductTypeReducer,
  productTypeUpdate: updateProductTypeReducer,
  productTypeDetails: productTypeDetailsReducer,
  productTypeDelete: deleteProductTypeReducer,
  purcahseProductPriceUpdateInProduct: updatePurchaseProductPriceReducer,
  tempPurchase: getTempPurchaseReducer,
  tempPurchaseDelete: deleteTempPurchaseReducer,
  quantityUpdateOnProductAndAvailId: updateQuantityInLocationReducer,
  updateAndPostProduct: updateAndPostProductInLocationReducer,
  productDetails: productDetailsReducer,
  productsOnCompanyName: getProductsOnCompanyNameReducer,
  postTempPurchase: postTempPurchaseReducer,
  tempPurchaseItemDelete: deleteTempPurchaseItemReducer,
  updateTempPurchaseProducts: updateTempPurchaseProductsReducer,
  productOnBarcode: getProductOnBarcodeReducer,
  productLocationOnId: productLocationOnIdReducer,
  tempSale: tempSaleReducer,
  tempSaleItemDelete: deleteTempSaleItemReducer,
  postFBRSaleProduct: postFBRSaleReducer,
  postSaleProduct: postSaleReducer,
  tempSalePost: tempSalePostReducer,
  updateTempSaleProducts: updateTempSaleProductsReducer,
  updateTempSaleQuantityInList: updateTempSaleQuantityInListReducer,
  tempSaleItemListDelete: deleteTempSaleItemListReducer,
  tempTransfer: tempTransferReducer,
  tempTransferAllDelete: deleteTempTransferAllReducer,
  updateQuantityUsingTransfer: updateQuantityUsingTransferReducer,
  updateMinusQuantityUsingTransfer: updateMinusQuantityUsingTransferReducer,
  tempTransferProductDelete: deleteTempTransferProductsReducer,
  postTempTransferProduct: postTempTransferReducer,
  updateTempTransferProductItem: updateTempTransferItemReducer,
  updateTempTransferProduct: updateTempTransferReducer,
  purchaseRecord: getPurchaseReducer,
  saleRecord: getSaleReducer,
  saleRecordOnInvoiceNo: getSaleOnInvoiceNoAndShopNoReducer,
  transferRecord: getTransferReducer,
  shop: shopReducer,
  shopDetails: shopDeatailReducer,
  tempPurchaseDetails: getTempPurchaseDetialsReducer,
  tempSaleDetails: tempSaleDetailsReducer,
  tempPurchaseOnShop: getTempPurchasOnShopReducer,
  tempSaleOnShopNo: getTempSaleOnShopNoReducer,
  tempTransferDetails: tempTransferDetailsReducer,
  productLocationOnShopType: LocationOnShopTypeReducer,
  productLocationOnGodownType: LocationOnGodownTypeReducer,
  forgotPassword: forgotPasswordReducer,
  role: roleReducer,
  assignTask: AssignTaskByIdNameReducer,
 // Your existing reducers
 task: taskReducer,
 newTask: newTaskReducer,
 tasksByGroup: tasksByGroupReducer,
 taskUpdateDelete: taskUpdateDeleteReducer,
 taskGroup: taskGroupReducer,
 allTaskGroups: allTaskGroupsReducer,
 taskGroupDetails: taskGroupDetailsReducer,
 taskGroupUpdateDelete: taskGroupUpdateDeleteReducer,
 // ...other reducers
  purchasePost: postPurchaseReducer,
  updateAndPostProductPurchase: updateAndPostProductInLocationUsingPurchaseReducer,
  updateProductQuantitySale: updateProductInLocationUsingSaleReducer,
  postTransferRecord: postTransferReducer,
  tempTransferOnShop: tempTransferOnShopReducer,
  subscriptionDetail: subscriptionReducer,
  subscriptionDateDetail: subscriptionDateReducer,
  subscriptionsDisplay: subscriptionsDisplayReducer,
  
  purchaseConsolidateForShopsRecord: getPurchaseConsolidatedForShopsReducer,
  purchaseConsolidateForSpecificShopsRecord: getPurchaseConsolidatedForSpecificShopsReducer,
  purchaseConsolidateForShopsOnDateRecord: getPurchaseConsolidatedForShopsOnDateReducer,
  purchaseConsolidateForSpecificShopsOnDateRecord: getPurchaseConsolidatedForSpecificShopsOnDateReducer,


  saleConsolidateForShopsRecord: getSaleConsolidatedForShopsReducer,
  saleConsolidateForSpecificShopsRecord: getSaleConsolidatedForSpecificShopsReducer,
  saleConsolidateForShopsOnDateRecord: getSaleConsolidatedForShopsOnDateReducer,
  saleConsolidateForSpecificShopsOnDateRecord: getSaleConsolidatedForSpecificShopsOnDateReducer,
  saleConsolidateProiftForShopsRecord: getSaleConsolidatedProfitForShopsReducer,
  singleSaleCreditRecord: getSingleSaleCreditReducer,
  saleCreditOnShopRecord: getSaleCreditOnShopReducer,
  saleCreditRecord: getSaleCreditReducer,
  updateSaleCreditRecord: updateSaleCreditOnShopReducer,

  paidCommissionConsolidateForShopsRecord: getPaidCommissionConsolidatedForShopsReducer,


  transferConsolidateForShopsRecord: getTransferConsolidatedForShopsReducer,
  transferConsolidateForSpecificShopsRecord: getTransferConsolidatedForSpecificShopsReducer,
  transferConsolidateForShopsOnShopRecord: getTransferConsolidatedForShopsOnDateReducer,
  transferConsolidateForSpecificShopsOnDateRecord: getTransferConsolidatedForSpecificShopsOnDateReducer,


  expenseType: getExpenseTypeReducer,
  expenseConsolidateForShopsRecord: getExpenseConsolidatedForShopsReducer,
  expenseConsolidateForSpecificShopsRecord: getExpenseConsolidatedForSpecificShopsReducer,
  expensePayment: expensePaymentReducer,
  expensePaymentPost: postExpensePaymentReducer,
  expensePaymentUpdate: updateExpensePaymentReducer,
  expensePaymentDetails: expensePaymentDetailsReducer,
  expensePaymentDelete: deleteExpensePaymentReducer,

  expense: expenseReducer,
  expensePost: postExpenseReducer,
  expenseUpdate: updateExpenseReducer,
  expenseDetails: expenseDetailsReducer,
  expenseDelete: deleteExpenseReducer,

  depositPaymentPost: postDepositPaymentReducer,
  paymentWorkFlow: getPaymentWorkFlowReducer,
  depositPayment: getDepositPaymentReducer,

  returnRecord: getReturnReducer,

  pctCode: pctCodeReducer,
  pctCodeRes: postPCTCodeReducer,
  pctCodeUpdate: updatePCTCodeReducer,
  pctCodeDetails: pctCodeDetailsReducer,
  pctCodeDelete: deletePCTCodeReducer,
  pctCodeOnCompanyType:getPCTCodeDetialsOnComapnyAndTypeReducer,
  distictCompanies:distinctCompaniesOnPCTCodeReducer,
  pctCodeCompany: pctCodeCompanyReducer,
  pctCodeDescription: pctCodeDescriptionReducer
  
});

let initialState = {
  // deviceIdData: [], // Set an empty string as the initial state for deviceId
  products: [], // Set an empty array as the initial state for products
  color: [],
  company: [],
  user: [],
  usersOnShopCode: [],
  productType: [],
  role: [],
  assignTask: [],
  task: [],
  purchasePost: [],
  updateAndPostProductPurchase: [],
  purcahseProductPriceUpdateInProduct: [],
  postFBRSaleProduct: [],
  postSaleProduct: [],
  updateProductQuantitySale: [],
  postTransferRecord: [],
  updateMinusQuantityUsingTransfer: [],
  tempTransferOnShop: [],
  subscriptionDetail: [],
  subscriptionDateDetail: [],
  purchaseConsolidateForShopsRecord: [],
  purchaseConsolidateForSpecificShopsRecord: [],
  purchaseConsolidateForShopsOnDateRecord: [],
  purchaseConsolidateForSpecificShopsOnDateRecord: [],


  saleConsolidateForShopsRecord: [],
  saleConsolidateForSpecificShopsRecord: [],
  saleConsolidateForShopsOnDateRecord: [],
  saleConsolidateForSpecificShopsOnDateRecord: [],
  singleSaleCreditRecord: [],
  saleCreditOnShopRecord: [],
  saleCreditRecord: [],
  updateSaleCreditRecord: [],

  paidCommissionConsolidateForShopsRecord: [],
  transferConsolidateForShopsRecord: [],
  transferConsolidateForSpecificShopsRecord: [],
  transferConsolidateForShopsOnShopRecord: [],
  transferConsolidateForSpecificShopsOnDateRecord: [],
  
  expenseType: [],


  expensePayment: [],
  expensePaymentPost: [],
  expensePaymentUpdate: [],
  expensePaymentDetails: [],
  expensePaymentDelete: [],

  expense: [],
  expensePost: [],
  expenseUpdate: [],
  expenseDetails: [],
  expenseDelete: [],

  depositPaymentPost: [],
  paymentWorkFlow: [],
  depositPayment: [],
  
  saleConsolidateProiftForShopsRecord: [],

  pctCode: [],
  pctCodeRes: [],
  pctCodeUpdate: [],
  pctCodeDetails: [],
  pctCodeDelete: [],
  pctCodeOnCompanyType:[],
  distictCompanies:[],
  pctCodeCompany: [],
  pctCodeDescription: []
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "deviceIdData"], // Only persist the user reducer
};

// Apply the persistence reducer
const persistedReducer = persistReducer(persistConfig, reducer);

const middleware = [thunk];

const store = createStore(
  persistedReducer, // Use persistedReducer instead of reducer
  composeWithDevTools(applyMiddleware(...middleware))
);

// Persistor to handle store persistence
const persistor = persistStore(store);

export { store, persistor };

// const store = createStore(
//   reducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store;
