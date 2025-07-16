import { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select"
import MetaData from "../../../MetaData";
import ReactToPrint from "react-to-print";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Dropdown,
} from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import TableForm from "./TableForm";
import { Statee } from "./context/stateContext";
import Header from "./Headers";
import Table from "./Table";
import Dates from "./Dates";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postExpense, postExpenseSeqNo } from "../../../actions/expenseAction";
import { refreshTokken } from "../../../actions/userAction";
import { gettShop } from "../../../actions/shopAction";
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation";
import PageLoader from "../../../Components/Loader/PageLoader";

let storage = [];
let isCalledd = "false";
function App() {
  const dispatch = useDispatch()
  const [listHasValues, setListHasValues] = useState(false)
  const [variableForButtonLoader, setVariableForButtonLoader] = useState(false)
  const [isCalled, setIsCalled] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { t, i18n } = useTranslation();
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    receiptImage: null
});
  const { user } = useSelector((state) => state.user);
  const [canViewExpenses, setCanViewExpenses] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setCanViewExpenses(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles("Can Add Expense");
      setCanViewExpenses(permissionForAdd);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  // const [selectedPrinter, setSelectedPrinter] = useState("laser");

  // const handleSelectPrinter = (printer) => {
  //   setSelectedPrinter(printer);
  // };



  const categoryOptions = [
    { key: "1", label: "Monthly", value: "Monthly" },
    { key: "2", label: "Daily", value: "Daily" },
    { key: "3", label: "None", value: "None" },
  ];

  const paymentModeOptions = [
    { key: "1", label: "Cash", value: "Cash" },
    { key: "2", label: "Bank Deposit", value: "Bank Deposit" },
    { key: "3", label: "Cheque", value: "Cheque" },
    { key: "4", label: "Online Transfer", value: "Online Transfer" },
  ];
  // const [expenses, setExpenses]=useState([]);
  const {
    expenses,
    setExpense,
    setExpenseType,
    setExpenseDescription,
    setExpenseAmount,
    expenseTotal,
    setExpenseTotal,
    expenseCategory,
    setExpenseCategory,
    componentRef,
    transferFrom,
    setTransferFrom,
    transferLocationName,
    setTransferLocationName,
    StorageLocation,
    setStorageLocation,
    transferFromObjectId,
    setTransferFromObjectId,
    setInvoiceNumber,
    paidTo, setPaidTo, paymentMode, setPaymentMode
  } = useContext(Statee);
  const buttonRef = useRef(null);

  useEffect(()=>{
    console.log()
    if(expenses?.length > 0)
      {
        setListHasValues(true)
      }else{
        setListHasValues(false)
      }
  }, [expenses])

  const handleCategoryChange = (value ) => {
    setExpenseCategory(value.value);
  };

  const handlePaymentMode = (value ) => {
    setPaymentMode(value.value);
  };

  useEffect(() => {
    if (isCalledd === "false") {
      isCalledd = "true";
      getToken();
    }
  }, [expenses, expenseCategory]);
  const getToken = async () => {
    const token = await refreshTokken();
    if (token?.data === "Please login to acces this resource") {
      navigate("/login");
    }
    console.log(token);
  };

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);

  useEffect(() => {
    isCalledd = "false";
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, [expenses, expenseCategory]);

  useEffect(() => {
    callStorage();
  },[]);
  
  async function callStorage() {
    let result = await gettShop();

    setStorageLocation(result);
    storage = result;
    console.log(result);
    if (
      (!JSON.parse(localStorage.getItem("isAdministrator"))) || !JSON.parse(localStorage.getItem("isSuperAdmin"))) 
      {
        setTransferFrom(JSON.parse(localStorage.getItem("shopId")));
        setTransferFromObjectId(JSON.parse(localStorage.getItem("shopId")))
      
      }
    setIsCalled(false);
  }

  //handle expense Location
  const handleExpenseLocation = (event, { value }) => {
    console.log(value);
    setTransferFromObjectId(value);
  };

  const handlePrintDownload = async () => {
    try {
      setButtonClicked(true);
      setVariableForButtonLoader(true)
      await addExpense();
      return new Promise((resolve) => {
        // Delay the resolution of the promise to ensure state update
        setTimeout(() => {
          resolve();
        }, 0);
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const addExpense = async () => {
    try {
      if (!expenses || !expenseCategory) {
        return swal.fire({
          icon: "error",
          title: t("titleError"),
          text: t("textNoExpenseAddedYet"),
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        });
      } else {
        const response = await postExpenseSeqNo()
        console.log(response);
        if (response?.success) {
          setInvoiceNumber(response?.seqId);
          setVariableForButtonLoader(false)
          const res = await postExpense(
              response?.seqId,
              paidTo, 
              paymentMode,
              transferFromObjectId,
              expenseCategory,
              expenses,
              expenseTotal
            )
            console.log(res)
          // if(res.success)
          // {
          //   const success = true
          //   dispatch(postExpensePayement(user?.user?._id, -expenseTotal, expenseTotal, expenseTotal))
          //   return success
          // }
        }
      }
    } catch (error) {
    } finally {
      // Set the focus out of the button
      buttonRef.current.blur();
    }
  }



  

  return (
    <>
      <MetaData title="QE ~~Expense" />
      <div className={`Expense ${colorTheme}`}>
      <div className="secondContainer">
        {canViewExpenses && (
          <><div className="contentt-box">
            <div className="heading-container">
            <h3> {t("expenses")}</h3>
            </div>
            </div>
            <div className="expense-Input-Section">
            <div className="formApp">
              <div className="formRow">
              <div className="inputSection">
                  <label htmlFor="transferfrom">{t("Name(paidTo)")}</label>
                  <input   
                      type="text"
                      // style={{ padding: "10px" }}
                      placeholder={t("Name(paidTo)")}
                      value={paidTo}
                      disabled={listHasValues}
                      onChange={(e)=> setPaidTo(e.target.value)}
                      // disabled
                      required
                      
                  />
                </div>
                <div className="inputSection">
                  <label htmlFor="transferfrom">{t("invoiceType")}</label>
                  <div>
                  <Select 
                  value={expenseCategory ? {label: expenseCategory} :{label: t("Select")}} isDisabled={listHasValues}
                  options={categoryOptions} onChange={handleCategoryChange}
                  />
                  </div>
                </div>
                <div className="inputSection">
                  <label htmlFor="transferfrom">{t("paymentMode")}</label>
                  <div>
                  <Select 
                  value={paymentMode ? {label: paymentMode} : {label: t("Select")}} isDisabled={listHasValues}
                  options={paymentModeOptions} onChange={handlePaymentMode}
                  />
                  </div>
                </div>
                <div className="inputSection">
                  <label>{t("shop")}</label>
                  {JSON.parse(localStorage.getItem("isAdministrator")) ||
                  JSON.parse(localStorage.getItem("isSuperAdmin")) ? (
                    <Dropdown
                      // control={Select}
                      placeholder={t("location")}
                      className="productActivityDropdown"
                      fluid
                      selection
                      clearable
                      disabled={listHasValues}
                      options={storage?.map((data) => ({
                        key: data.shopCode,
                        text: data.shopCode,
                        value: data.shopCode,
                      }))}
                      value={transferFromObjectId}
                      onChange={handleExpenseLocation}
                      required
                    />
                  ) : (
                    <input
                    type="text"
                      // style={{ padding: "10px" }}
                      placeholder={t("location")}
                      value={`${transferFrom}`}
                      disabled
                      required
                    />
                  )}
                  
                
                </div>
                </div>
              </div>
            </div>
            <div className="formAppSecondSection">
              {expenseCategory ? 
                (
                  <>
                    <div className="buttonAppRow">  
                      <Button
                        className={`button button-add-product`}
                        onClick={() => {
                        setExpenseAmount("");
                        setExpenseDescription("");
                        setExpenseType("");
                        navigate("/expens");
                        }}   
                      > {t("enterExpense")}&nbsp; </Button>
                      <ReactToPrint
                        trigger={() =>
                          expenses && expenses?.length > 0 ? (
                            <button
                              ref={buttonRef}
                              disabled={buttonClicked}
                              className={`button button-add-product`} >
                                Generate Invoice
                            </button>
                            ) : (<h1></h1>)}
                        content={() => componentRef.current}
                        onBeforeGetContent={handlePrintDownload}
                        onAfterPrint={() => {
                          setExpense([]);
                          setExpenseAmount("");
                          setExpenseType("");
                          setExpenseDescription("");
                          setExpenseCategory("");
                          setExpenseTotal("");
                          setInvoiceNumber("");
                        }}
                      />
                    </div>
                        {!variableForButtonLoader ? (
                          <div className="table-container">
                            <TableForm />
                          </div>
                            ) : (
                              <PageLoader />
                            )}
                <div>
              </div>
                </>
              ) : (
                <h1 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  {t("purchaseMessage")}
                </h1>
              )}
          
            </div>
            {user?.user?.printerId?.printerTyper === "Laser" ? (
              <div className="print-only-container">
                <div ref={componentRef} className="p-5">
                  <div
                    style={{
                      border: "2px solid black",
                      marginRight: "20px",
                      padding: "15px",
                      paddingBottom: "0px",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Header />
                    <Dates />
                    <Table />
                    <div style={{ paddingTop: "550px" }}>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Powered By Soft Wise Solutions +92 334 096 0444{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="print-only-container">
                <div ref={componentRef} className="p-5">
                  <Header />
                  <Dates />
                  <Table />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </>
  );
}
export default App;
