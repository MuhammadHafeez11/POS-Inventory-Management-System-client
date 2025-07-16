import React from "react";
import ReactDOM from "react-dom/client";
import "semantic-ui-css/semantic.min.css";
// import StateContext from "./salesRecipt/context/stateContext";
import StateContext from "./Pages/SaleComponent/salesRecipt/context/stateContext";
import ContextSales from "./Pages/SaleComponent/salesRecord/context/ContextSales";

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import ReturnContext from "./Pages/returnComponent/context/ContextReturn";
import {ReturnStateProvider} from "./Pages/returnComponent/ReturnInvoice/context/returnContext";
// import TransferStateContect from "./Transfer Recipt/context/stateContext";
import TransferStateContect from "./Pages/TransferComponent/Transfer Recipt/context/stateContext";
import TransferReoprtStateContect from "./Pages/TransferComponent/Transfer Record/context/ContextSales";
import PurchaseStateContext from "./Pages/PurchaseComponent/purchaseRecipt/context/stateContext";
import PurchaseReportStateContext from "./Pages/PurchaseComponent/purchaseRecord/context/ContextSales";

import ExpensePaymentStateContext from "./Pages/ExpenseComponent/CashDeposit/context/paymentStateContext";
import ExpenseStateeContext from "./Pages/ExpenseComponent/Expensee/context/stateContext";
import TableStateContext from "./Components/tableComponent/tableContext"
// import { HistoryProvider } from "./HistoryContext";
import { HistoryProvider } from "./HistoryContext";
import AlertTemplate from "react-alert-template-basic"
import {positions, transitions, Provider as AlertProvider} from "react-alert"
// import "./index.css";
import './SaasStyling/app.scss'
// import { store } from "./app/store";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor } from "./store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from "./actionHooks/queryClient";
import { BrowserRouter } from "react-router-dom";
const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <ContextSales>
        <StateContext>
          <TransferStateContect>
            <TransferReoprtStateContect>
              <PurchaseStateContext>
                <PurchaseReportStateContext>
                  <ExpenseStateeContext>
                  <ExpensePaymentStateContext>
                    <ReturnStateProvider>
                    <TableStateContext>
                      <HistoryProvider>
                        <ReturnContext >
                          <QueryClientProvider client={queryClient}>
                          <AlertProvider template={AlertTemplate} {...options}>
                            {/* <BrowserRouter> */}
                              <App />
                            {/* </BrowserRouter> */}
                          </AlertProvider>
                          </QueryClientProvider>
                        </ReturnContext>
                      </HistoryProvider>
                    </TableStateContext>
                    </ReturnStateProvider>
                    </ExpensePaymentStateContext>
                  </ExpenseStateeContext>
                </PurchaseReportStateContext>
              </PurchaseStateContext>
            </TransferReoprtStateContect>
          </TransferStateContect>
        </StateContext>
      </ContextSales>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide} // Use Slide component here
      /> 
      {/* </PersistGate> */}
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
