import React, { useState, useEffect,lazy, Suspense, startTransition  } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import webFont from "webfontloader"
import "./SaasStyling/app.scss";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from "i18next";
import {
  initReactI18next,
} from "react-i18next";
import tEnglish from "../src/locales/english/translation.json";
import tUrdu from "../src/locales/urdu/translation.json";
// import {store} from "./store";
import {store} from "./store";
import {  useDispatch, useSelector } from "react-redux";
import { loadUser, refreshTokken } from "./actions/userAction";
import ReturnPreview from "./Pages/returnComponent/ReturnInvoice/PreviewInvoice";
const RecordLocation = lazy(()=>import("./Pages/RecordsComponent/ProductLocation/LocationTable/OtherRolesLocTable"))
const AdministratorRecordLocation = lazy(()=>import("./Pages/RecordsComponent/ProductLocation/LocationTable/AdministratorLocationTable"))
const UpdateLocation = lazy(()=>import("./Pages/RecordsComponent/ProductLocation/updateLocation/Update"))
const GlobalLocationSearch = lazy(()=>import("./Pages/RecordsComponent/GlobalLocationSearch/GlobalLocationSearch"))

const Record = lazy(()=>import("./Pages/RecordsComponent/Product/TableUser/TableUser"))
const UpdateData = lazy(()=>import("./Pages/RecordsComponent/Product/Update/UpdateData"))
const TableUser = lazy(()=>import("./Pages/RecordsComponent/Product/TableUser/TableUser"))
const FormUser = lazy(()=>import("./Pages/RecordsComponent/Product/FormUser/FormUser"))
const Barcodegenerate = lazy(()=>import("./Pages/RecordsComponent/Product/BarcodeGenerate/Barcodegenerate"))
const MultiBarcodeGenerator = lazy(()=>import("./Pages/RecordsComponent/Product/BarcodeGenerate/MultiBarcodeGenerator"))


const RecordPCT = lazy(()=>import("./Pages/RecordsComponent/PCTCode/Record/RecordPCT"))
const UpdatePCT = lazy(()=>import("./Pages/RecordsComponent/PCTCode/Update/UpdatePCT"))
const PCTCodesTable = lazy(()=>import("./Pages/RecordsComponent/PCTCode/TableUser/PCTCodesTable"))
const PCTCodeForm = lazy(()=>import("./Pages/RecordsComponent/PCTCode/PCTForm/PCTCodeForm"))
//Color Page Routes

const Color = lazy(()=>import("./Pages/RecordsComponent/Color/Record/RecordColor"))
const ColorForm = lazy(()=>import("./Pages/RecordsComponent/Color/formUser/FormUserColor"))
const UpdateColor = lazy(()=>import("./Pages/RecordsComponent/Color/Update/updateColor"))

//Company Page Routes
const FormCompany = lazy(()=>import("./Pages/RecordsComponent/company/formCompany/FormCompany"))
const Company = lazy(()=>import("./Pages/RecordsComponent/company/CompanyRecord/CompanyRexord"))
const UpdateCompany = lazy(()=>import("./Pages/RecordsComponent/company/UpdateCompany/UpdateCompany"))


const FBRFormCompany = lazy(()=>import("./Pages/RecordsComponent/FBR-Components/company/formCompany/FormCompany"))
const FBRCompany = lazy(()=>import("./Pages/RecordsComponent/FBR-Components/company/CompanyRecord/CompanyRexord"))
const FBRUpdateCompany = lazy(()=>import("./Pages/RecordsComponent/FBR-Components/company/UpdateCompany/UpdateCompany"))


const FBRFormDescription = lazy(()=>import("./Pages/RecordsComponent/FBR-Components/PCTDescription/FormPCTCodeDescription/FormPCTCodeDescription"))
const FBRDescription = lazy(()=>import("./Pages/RecordsComponent/FBR-Components/PCTDescription/PCTCodeDescriptionRecord/PCTCodeDescription"))
const FBRUpdateDescription = lazy(()=>import("./Pages/RecordsComponent/FBR-Components/PCTDescription/FormPCTCodeDescription/FormPCTCodeDescription"))
//Godown Page Routes

const StockLocation = lazy(()=>import("./Pages/RecordsComponent/Godown/GodownRecord/StockLocation"))
const StockForm = lazy(()=>import("./Pages/RecordsComponent/Godown/FormGodown/StockForm"))
const StockUpdate = lazy(()=>import("./Pages/RecordsComponent/Godown/UpdateGodown/StockUpdate"))


//Shop Page Routes
const Shop = lazy(()=>import("./Pages/RecordsComponent/Shop/ShopRecord/ShopRecord"))
const ShopForm = lazy(()=>import("./Pages/RecordsComponent/Shop/ShopForm/ShopForm"))
const ShopUpdate = lazy(()=>import("./Pages/RecordsComponent/Shop/ShopUpdate/UpdateShop"))


//Product Type Page Routes
const TypeRecord = lazy(()=>import("./Pages/RecordsComponent/ProductType/Record/TypeRecord"))
const UpdateType = lazy(()=>import("./Pages/RecordsComponent/ProductType/UpdateProdType/UpdateType"))
const FormType = lazy(()=>import("./Pages/RecordsComponent/ProductType/TypeForm/FormType"))


//Transfer Recipt Page Routes
// const TransferRecorddd = lazy(()=>import("./Pages/TransferComponent/Transfer Recipt/TransferProduct/TransferRecord"))
const TransferRecordd = lazy(()=>import("./Pages/TransferComponent/Transfer Recipt/App"))
const TranferProductPage = lazy(()=>import("./Pages/TransferComponent/Transfer Recipt/TransferProductPage"))
const DiscountModelTransfer = lazy(()=>import("./Pages/TransferComponent/Transfer Recipt/DiscountModel"))


//Transfer Record Page Routes
const TranferPreview = lazy(()=>import("./Pages/TransferComponent/Transfer Record/Transferrecord"))
const TranferPreviewBill = lazy(()=>import("./Pages/TransferComponent/Transfer Record/InvoicePreview/preview"))
// import TranferPreview from "./Transfer Record/Transferrecord";
// import TranferPreviewBill from "./Transfer Record/InvoicePreview/preview";

//Sales Recipt Page Routes
const Invoice = lazy(()=>import("./Pages/SaleComponent/salesRecipt/App"))
const SalesProductPage = lazy(()=>import("./Pages/SaleComponent/salesRecipt/SellProductPage"))
const DiscountModel = lazy(()=>import("./Pages/SaleComponent/salesRecipt/DiscountModel"))
const SaleCreditRecord = lazy(()=>import("./Pages/SaleComponent/SaleCredit/SaleCredit"))
const SaleCreditRecordPreview = lazy(()=>import("./Pages/SaleComponent/SaleCredit/PreviewRecord"))

//Return Recipt Page Routes
const returnInvoice = lazy(()=>import("./Pages/returnComponent/returnRecipt/App"))
const ReturnProductPage = lazy(()=>import("./Pages/returnComponent/returnRecipt/ReturnProductPage"))
const ReturnInvoice = lazy(()=>import("./Pages/returnComponent/ReturnInvoice/ReturnInvoice"))


//Sales Record Page Routes
const Salerecord = lazy(()=>import("./Pages/SaleComponent/salesRecord/Salerecord"))
const Preview = lazy(()=>import("./Pages/SaleComponent/salesRecord/InvoicePreview/preview"))


//Purchase Approval Routes

const PurchaseApproval = lazy(() =>
  import("./Pages/PurchaseComponent/purchaseApproval/PurchaseApproval")
);

//Purchase Recipt Page Routes

// const SellProductPage = lazy(()=>import("./purchaseRecipt/SellProductPage"))
const SellProductPage = lazy(()=>import("./Pages/PurchaseComponent/purchaseRecipt/SellProductPage"))
const DiscountModelPur = lazy(()=>import("./Pages/PurchaseComponent/purchaseRecipt/DiscountModel"))
const PurchaseRecipt = lazy(()=>import("./Pages/PurchaseComponent/purchaseRecipt/App"))


//Purchase Record Page Routes

const TableTransfer = lazy(()=>import("./Pages/PurchaseComponent/purchaseRecord/Purchaserecord"))
const PreviewPurchase = lazy(()=>import("./Pages/PurchaseComponent/purchaseRecord/InvoicePreview/preview"))


//Expense Page Routes
const ExpenseApp = lazy(()=>import("./Pages/ExpenseComponent/Expensee/App"))
const ExpenseFormm = lazy(()=>import("./Pages/ExpenseComponent/Expensee/ExpenseFormm"))
const CashDepositForm = lazy(()=>import("./Pages/ExpenseComponent/CashDeposit/CashDepositForm/CashDepositForm"))
const ExpenseInvoice = lazy(()=>import("./Pages/ExpenseComponent/Expensee/ExpenseInvoice/ExpenseInvoice"))
const ExpensePreview = lazy(()=>import("./Pages/ExpenseComponent/Expensee/ExpenseInvoice/Preview/InvoicePreview"))


//Expense Type Page Routes
const ExpenseForm = lazy(()=>import("./Pages/ExpenseComponent/ExpenseType/expenseForm/expense"))
const ExpenseTable = lazy(()=>import("./Pages/ExpenseComponent/ExpenseType/expenseTable/ExpenseTable"))
const RecordExpense = lazy(()=>import("./Pages/ExpenseComponent/ExpenseType/Record/RecordExpense"))
const UpdateExpense = lazy(()=>import("./Pages/ExpenseComponent/ExpenseType/Update/updateExpense"))


///Pengings Pages
const PurchaseRecord = lazy(()=>import("./Pages/Pending Invoices/Purchase Invoices/Record"))
const SaleRecord = lazy(()=>import("./Pages/Pending Invoices/Sale Invoices/SaleRecord"))
const RecordTempTransfer = lazy(()=>import("./Pages/Pending Invoices/TrabsferInvoices/TransferRecord"))


//Login Page Routes

const LoginPage = lazy(()=>import("./features/auth/Login"))
const ForgotPasswordEmail = lazy(()=>import("./features/auth/ForgotPasswordEmail"))
const ResetPassword = lazy(()=>import("./features/auth/ResetPassword"))


//Users Routes
const EditUser = lazy(()=>import("./features/users/EditUser"))
const NewUserForm = lazy(()=>import("./features/users/NewUserForm"))
const UsersList = lazy(()=>import("./features/users/UsersList"))
const UpdateProfileUser = lazy(()=>import("./features/users/updateProfileUser"))


//Consolidated Reports
const ConsolidatedPuchaseReport = lazy(()=>import("./Pages/consolidatedReports/consolidatedPurchaseReport/consolidatedPuchaseReport"))
const ConsolidatedSalesReport = lazy(()=>import("./Pages/consolidatedReports/consolidatedSalesReport/consolidatedSalesReport"))
const ConsolidatedTransferReport = lazy(()=>import("./Pages/consolidatedReports/consolidatedTransferReport/consolidatedTransferReport"))
const ConsolidatedExpenseReport = lazy(()=>import("./Pages/consolidatedReports/consolidatedExpenseReport/ConsolidatedExpenseReport"))

///Profit Report
const ProfitSalesMan = lazy(()=>import("./Pages/profitSalesMan/ProfitSalesMan"))
const PaidDataTable = lazy(()=>import("./Pages/profitSalesMan/PaidRecord/paidData"))
const PaidPreviewDataTable = lazy(()=>import("./Pages/profitSalesMan/PaidRecord/previewPaidData"))


//DashBoard

const DashBoard = lazy(()=>import("./Components/DashBoard/dashBoard/DashBoard"))
// const ProtectedRoute = lazy(()=>import("./features/auth/ProtectedRoute"))
const Concept = lazy(()=>import("./Components/Side_NavBar/Concept"))

const SettingMainPage = lazy(()=>import("./SettingComponent/settingMainPage"))
// const PrinterSettingPage = lazy(()=>import("./SettingComponent/Printer Setting/printerPageSetting"))
// const DarkMode = lazy(()=>import("./SettingComponent/ThemeSetting/DarkMode"))
// const TablePageSetting = lazy(()=>import("./SettingComponent/TableSetting/tablePageSetting"))
// const ChangeTableSetting = lazy(()=>import("./SettingComponent/TableSetting/changeTableSetting"))
// const LanguageSettingPage = lazy(()=>import("./SettingComponent/Language Setting/LanguageSettingPage"))


const RolesTable = lazy(()=>import("./Pages/user/roles/RolesTable"))
const TasksTable = lazy(()=>import("./Pages/user/tasks/TasksTable"))
const RolesAssign = lazy(()=>import("./Pages/user/rolesAssigned/RolesAssign"))


const NewRole = lazy(()=>import("./Pages/user/roles/NewRole"))
const ProductsTableToExcel = lazy(()=>import("./Pages/TableToExcelPages/ProductsTableToExcel"))
const ColorTableToExcel = lazy(()=>import("./Pages/TableToExcelPages/colorTableToExcel"))

const CompanyTableToExcel = lazy(()=>import("./Pages/TableToExcelPages/companyTableToExcel"))
const ProductTypeTableToExcel = lazy(()=>import("./Pages/TableToExcelPages/productTypeTableToExcel"))
const ProductLocationTableToExcel = lazy(()=>import("./Pages/TableToExcelPages/ProductLocation"))

const PaymentWorkFlow = lazy(()=>import("./Pages/paymentWorkFlow/paymentWorkFlow"))
const DepositPayment = lazy(()=>import("./Pages/ExpenseComponent/CashDeposit/CashDeopsitTable/DepositPayment"))
const ProfitSalesReport = lazy(()=>import("./Pages/SaleComponent/SaleProfitInvoice/consolidatedSalesReport"))
const ProtectedRouteNew = lazy(()=>import("./ProtectedRoute/ProtectedRoute"))
const {LanguageSwitcher} = lazy(()=>import("../src/locales/localeDropDownOption/LanguageDropDown"))
const PageLoader = lazy(()=>import("./Components/Loader/PageLoader"))


i18n.use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: tEnglish,
      },
      ur: {
        translation: tUrdu,
      },
    },
    lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });


function App() {

  const [colorTheme, setColorTheme] = useState("theme-white");
  // const navigate = useNavigate()
  const { user} = useSelector((state)=> state.user)

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme, localStorage.getItem("color-theme")]);

  useEffect(() => {
    store.dispatch(loadUser());
    getData();    
  },[]);

  React.useEffect(()=>{
    webFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka", "Oswald"]
      }
    })
  },[])

  const getData = async () => {
    console.log("hii");
  };
  const userRoles = ["Admin", "Salesman", "Administrator"];
  const queryClient = new QueryClient();
  return (
    <>
        {/* <QueryClientProvider client={queryClient}> */}
          <Router>
            <Concept />
            {/* <NavBar /> */}
            <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/newrole" element={<NewRole />} />
              <Route
                exact
                path="/passwordForgot"
                element={<ForgotPasswordEmail />}
              />
              <Route
                exact
                path="/password/reset/:token"
                element={<ResetPassword />}
              />
            

          <Route path="/dashboard" element={
              <ProtectedRouteNew component={DashBoard}  allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]} />
            } />


          <Route path="/Record" element={
              <ProtectedRouteNew component={Record} allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

          <Route path="/color" element={
              <ProtectedRouteNew component={Color} allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/rolesTable" element={
              <ProtectedRouteNew component={RolesTable}   allowedRoles={["superAdmin",
                "Stock Manager"]}/>
            } />

            <Route path="/taskTable" element={
              <ProtectedRouteNew component={TasksTable}   allowedRoles={["superAdmin",
                "Stock Manager"]}/>
            } />

          <Route path="/rolesAssign" element={
              <ProtectedRouteNew component={RolesAssign}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/tableuser" element={
              <ProtectedRouteNew component={TableUser}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route path="/additem" element={
              <ProtectedRouteNew component={FormUser}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route   path="/generate/:id" element={
              <ProtectedRouteNew component={Barcodegenerate}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 
            <Route   path="/generate-multiple" element={
              <ProtectedRouteNew component={MultiBarcodeGenerator}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route   path="/update/:id" element={
              <ProtectedRouteNew component={UpdateData}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route   path="/addPCT" element={
              <ProtectedRouteNew component={PCTCodeForm}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route   path="/updatePCT/:id" element={
              <ProtectedRouteNew component={UpdatePCT}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route   path="/viewPCTCodes" element={
              <ProtectedRouteNew component={RecordPCT}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/FBR-Company" element={
              <ProtectedRouteNew component={FBRCompany}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/FBR-addcompany" element={
              <ProtectedRouteNew component={FBRFormCompany}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/FBR-updatecompany/:id" element={
              <ProtectedRouteNew component={FBRUpdateCompany}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/FBR-PCTDescription" element={
              <ProtectedRouteNew component={FBRDescription}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/FBR-addPCTDescription" element={
              <ProtectedRouteNew component={FBRFormDescription}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/FBR-updatePCTDescription/:id" element={
              <ProtectedRouteNew component={FBRUpdateDescription}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 



            <Route   path="/addcolor" element={
              <ProtectedRouteNew component={ColorForm}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/updatecolor/:id" element={
              <ProtectedRouteNew component={UpdateColor}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/Company" element={
              <ProtectedRouteNew component={Company}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/addcompany" element={
              <ProtectedRouteNew component={FormCompany}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/updatecompany/:id" element={
              <ProtectedRouteNew component={UpdateCompany}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

          <Route  path="/shopRecord" element={
              <ProtectedRouteNew component={Shop}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/shopform" element={
              <ProtectedRouteNew component={ShopForm}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route path="/shopUpdate/:id" element={
              <ProtectedRouteNew component={ShopUpdate}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route   path="/godownrecord" element={
              <ProtectedRouteNew component={StockLocation}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route path="/stockform" element={
              <ProtectedRouteNew component={StockForm}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route  path="/stockUpdate/:id" element={
              <ProtectedRouteNew component={StockUpdate}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route path="/recordType" element={
              <ProtectedRouteNew component={TypeRecord}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route path="/Updatetype/:id" element={
              <ProtectedRouteNew component={UpdateType}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            <Route path="/formType" element={
              <ProtectedRouteNew component={FormType}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> 

            
<Route
              path="/purchaseApproval"
              element={
                <ProtectedRouteNew
                  component={PurchaseApproval}
                  allowedRoles={[
                    "superAdmin",
                    "Administrator",
                    "Admin",
                    "Salesman",
                    "Stock Manager",
                  ]}
                />
              }
            />

            <Route path="/purchaseProductPage" element={
              <ProtectedRouteNew component={SellProductPage}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            
            <Route path="/purchaseDiscount" element={
              <ProtectedRouteNew component={DiscountModelPur}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/PurchaseRecipt" element={
              <ProtectedRouteNew component={PurchaseRecipt}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

          <Route path="/saleCreditRecord" element={
              <ProtectedRouteNew component={SaleCreditRecord}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

          <Route path="/saleCreditRecordPreview/:id" element={
              <ProtectedRouteNew component={SaleCreditRecordPreview}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />


            <Route path="/saleproduct" element={
              <ProtectedRouteNew component={Invoice}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/saleproductpage" element={
              <ProtectedRouteNew component={SalesProductPage}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/discountmodel" element={
              <ProtectedRouteNew component={DiscountModel}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

          <Route path="/returnProducts" element={
              <ProtectedRouteNew component={returnInvoice}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />
            <Route path="/returnproductpage" element={
              <ProtectedRouteNew component={ReturnProductPage}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />
             <Route path="/returnInvoice" element={
              <ProtectedRouteNew component={ReturnInvoice}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />
              <Route path="/returnPreview/:id" element={
              <ProtectedRouteNew component={ReturnPreview}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />
            <Route path="/administrator/recordLocation" element={
              <ProtectedRouteNew component={AdministratorRecordLocation}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />
            <Route path="/globalSearchRecord" element={
              <ProtectedRouteNew component={GlobalLocationSearch}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />
            
            <Route path="/admin/recordLocation" element={
              <ProtectedRouteNew component={RecordLocation}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />
         



            <Route  path="/updateLoc/:id" element={
              <ProtectedRouteNew component={UpdateLocation}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

          


            <Route   path="/TranferProductPage" element={
              <ProtectedRouteNew component={TranferProductPage}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/DiscountModelTransfer" element={
              <ProtectedRouteNew component={DiscountModelTransfer}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/DiscountModelTransfer" element={
              <ProtectedRouteNew component={DiscountModelTransfer}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/TransferRecordd" element={
              <ProtectedRouteNew component={TransferRecordd}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/purchaseRecord" element={
              <ProtectedRouteNew component={TableTransfer}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/Previewpurchase" element={
              <ProtectedRouteNew component={PreviewPurchase}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/Salerecord" element={
              <ProtectedRouteNew component={Salerecord}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/Preview" element={
              <ProtectedRouteNew component={Preview}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/TranferPreview" element={
              <ProtectedRouteNew component={TranferPreview}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/TranferPreviewBill" element={
              <ProtectedRouteNew component={TranferPreviewBill}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/expenseForm" element={
              <ProtectedRouteNew component={ExpenseForm}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/expenseTable" element={
              <ProtectedRouteNew component={ExpenseTable}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route   path="/expense" element={
              <ProtectedRouteNew component={RecordExpense}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/updateExpense/:id" element={
              <ProtectedRouteNew component={UpdateExpense}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/expensee" element={
              <ProtectedRouteNew component={ExpenseApp}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/expens" element={
              <ProtectedRouteNew component={ExpenseFormm}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/depositForm" element={
              <ProtectedRouteNew component={CashDepositForm}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

           

            <Route path="/expenseInvoice" element={
              <ProtectedRouteNew component={ExpenseInvoice}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/expensePreview" element={
              <ProtectedRouteNew component={ExpensePreview}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/consolidatedPuchaseReport" element={
              <ProtectedRouteNew component={ConsolidatedPuchaseReport}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/consolidatedPuchaseReport" element={
              <ProtectedRouteNew component={ConsolidatedPuchaseReport}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/consolidatedSalesReport" element={
              <ProtectedRouteNew component={ConsolidatedSalesReport}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/consolidatedTransferReport" element={
              <ProtectedRouteNew component={ConsolidatedTransferReport}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/consolidatedExpenseReport" element={
              <ProtectedRouteNew component={ConsolidatedExpenseReport}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/ProfitSalesman" element={
              <ProtectedRouteNew component={ProfitSalesMan}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/paidEmployeCommission" element={
              <ProtectedRouteNew component={PaidDataTable}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/paidEmployePreviewCommission/:id" element={
              <ProtectedRouteNew component={PaidPreviewDataTable}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/editUser/:id" element={
              <ProtectedRouteNew component={EditUser}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/newUserForm" element={
              <ProtectedRouteNew component={NewUserForm}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/usersList" element={
              <ProtectedRouteNew component={UsersList}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/updateUserProfile" element={
              <ProtectedRouteNew component={UpdateProfileUser}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/tempPurchasePendings" element={
              <ProtectedRouteNew component={PurchaseRecord}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/tempSalePendings" element={
              <ProtectedRouteNew component={SaleRecord}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/tempTransferPendings" element={
              <ProtectedRouteNew component={RecordTempTransfer}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/settings" element={
              <ProtectedRouteNew component={SettingMainPage}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            {/* <Route path="/printerSettings" element={
              <ProtectedRouteNew component={PrinterSettingPage}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/tablePageSetting" element={
              <ProtectedRouteNew component={TablePageSetting}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/darkModeSetting" element={
              <ProtectedRouteNew component={DarkMode}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />
             <Route path="/changeTableSetting" element={
              <ProtectedRouteNew component={ChangeTableSetting}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/changeLanguageSetting" element={
              <ProtectedRouteNew component={LanguageSettingPage}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } /> */}

            <Route path="/productsTableToExcel" element={
              <ProtectedRouteNew component={ProductsTableToExcel}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/colorTableToExcel" element={
              <ProtectedRouteNew component={ColorTableToExcel}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/companyTableToExcel" element={
              <ProtectedRouteNew component={CompanyTableToExcel}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/productTypeTableToExcel" element={
              <ProtectedRouteNew component={ProductTypeTableToExcel}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/productLocationTableToExcel" element={
              <ProtectedRouteNew component={ProductLocationTableToExcel}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />

            <Route path="/paymentWorkFlow" element={
              <ProtectedRouteNew component={PaymentWorkFlow}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />
             <Route path="/recordCashDeposit" element={
              <ProtectedRouteNew component={DepositPayment}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />
             <Route path="/consolidateShopProfit" element={
              <ProtectedRouteNew component={ProfitSalesReport}   allowedRoles={[
                "superAdmin",
                "Administrator",
                "Admin",
                "Salesman",
                "Stock Manager"
              ]}/>
            } />
            </Routes>
            </Suspense>
          </Router>
          {/* </QueryClientProvider> */}
        {/* </div>
      </div> */}
    </>
  );
}
export default App;
