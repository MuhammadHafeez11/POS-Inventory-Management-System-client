import React, { useContext, useEffect, useState } from "react";
import MetaData from "../../../../MetaData";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Dropdown,
} from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from "react-select/async"
import swal from "sweetalert2";
import Select from "react-select"
import "../../../../SaasStyling/_cashDeposit.scss"
import {getUser, getUserdata, getUsers} from "../../../../actions/userAction"
// import { getExpenses } from "../../Api";
// import { State } from "../../purchaseRecipt/context/stateContext";
import { DepositPaymentStatee } from "../context/paymentStateContext";
import { useTranslation } from "react-i18next";
// import "../../../src/Styling/AllStyle.css";
import Stack from "@mui/material/Stack";
import { TextField, Typography, Box, ButtonGroup } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { getExpenses } from "../../../../actions/expenseTypeAction";
import { postDepositPayment } from "../../../../actions/depositAction";
import { ALL_DEPOSIT_POST_SUCCESS } from "../../../../constants/depositConstants";
let expenseeType = [];
const ExpenseFormm = () => {
  const {
    expenses,
    setExpense,
    expenseType,
    setExpenseType,
    expenseDescription,
    setExpenseDescription,
    expenseAmount,
    setExpenseAmount,
    expenseTotal,
    setExpenseTotal,
    userName, setUserName,
    handleSubmitt,
  } = useContext(DepositPaymentStatee);
  const [shop_id, setShop_id] = useState()
  const [amount, setAmount] = useState()
  const [paidTo, setPaidTo] = useState()
  const [paidToValue, setPaidToValue] = useState()
  const [status, setStatus] = useState()
  const [paymentMode, setPaymentMode] = useState()
  const [accountNo, setAccountNo] = useState()
  const [avatar, setAvatar] = useState()
  const {user} = useSelector((state)=> state.user)
  const {depositPaymentPost, depositPaymentPostLoading} = useSelector((state)=> state.depositPaymentPost)
  const dispatch = useDispatch()

  const [usersDataList, setUsersDataList] = useState()
  const [expenseTypee, setExpenseTypee] = useState();
  const [user_id, setUser_id] = useState()
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [usersData, setUsersData] = useState()
  const PaidToStatusOptions = [
    { value: "WithInOrganization", label: "WithIn Organization"},
    { value: "OutsideOrganization", label: "Outside Organization"},
  ]  
  const [manualName, setManualName] = useState('')

  const paymentModeOptions = [
    { value: "Cash", label: "Cash"},
    { value: "Bank Deposit", label: "Bank Deposit"},
    { value: "Cheque", label: "Cheque"},
    { value: "Online Transfer", label: "Online Transfer"},
  ]  

  const handleUserName = (event, {value}) => {
    setUserName(value)
  }
  const handleTypeSelectChange = (event, { value }) => {
    setExpenseType(value);
  };

  const backPage = async () => {
    navigate("/recordCashDeposit");
  };
  useEffect(() => {
    callExpenseType();
    //  console.warn(expenseAmount)
  },[]);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  async function callExpenseType() {
    const userData = await getUserdata()
    console.log(userData)
    setUsersData(userData)
    expenseeType = await getExpenses();
    setExpenseTypee(expenseeType);
  }
  const addDeposit = async () => {
    console.log(avatar)
    // Use manualName if Outside Organization, otherwise use selected user ID
    const finalPaidTo = status === "OutsideOrganization" ? manualName : paidTo;
    console.log(finalPaidTo);
    
    dispatch(postDepositPayment(
      shop_id,
      amount,
      avatar || null, // Make avatar optional
      status,
      paymentMode,
      finalPaidTo,
      accountNo))
};

  useEffect(()=>{
    if(!depositPaymentPostLoading && depositPaymentPost?.success)
    {
      successMessage()
    }

  }, [depositPaymentPost, depositPaymentPostLoading])

  const successMessage = () => {
    setStatus('')
    setAccountNo('')
    setAmount('')
    setPaidTo('')
    setPaidToValue('')
    setManualName('')
    setPaymentMode('')
    setAvatar(null)
    navigate('/recordCashDeposit')
    dispatch({
      type: ALL_DEPOSIT_POST_SUCCESS,
      payload: [],
    });
    return swal.fire({
      icon: "success",
      title: t("titleAdded"),
      text: t("successMessage"),
      showConfirmButton: false,
      timer: 2000,
      customClass: {
        popup: "custom-swal-popup",
      },
    });
  }
  

  useEffect(()=>{
    console.log(user)
    console.log(user?.user?.shopNo?._id)
    setShop_id(user?.user?.shopNo?._id)
  }, [user])

  useEffect(()=>{
    getUserRecord()
  }, [])

  const getUserRecord = async() => {
    const res = await getUsers()
    console.log(res)
    const userData = res.filter((users)=> users._id !== user?.user?._id && users?.roles?.roleName !== "superAdmin")
    setUsersDataList(userData?.map(users =>({
            name:"users",
            value: users._id,
            label: users?.name
          })))
  }
  const handlePaidToStatusChange = (value) => {
    console.log(value.value)
    setStatus(value.value)
    // Reset beneficiary values when status changes
    setPaidTo('')
    setPaidToValue('')
    setManualName('')
  }

  const handlePaymentModeToChange = (value) =>{
    setPaymentMode(value.value)
  }

  const loadUserOptions = (search, callBack) => {
    
    setTimeout(()=>{
      const filterOptions = usersDataList?.filter(option=> option?.label.toLowerCase().includes(search.toLowerCase()))
      console.log(filterOptions)
      callBack(filterOptions)
    }, 3000)
  }

  const handleUserChange = (e) => {
    setPaidToValue(e.label)
    setPaidTo(e.value)
    }

  const handleImageValue = (e) =>{
    const file= e.target.files?.[0];
    console.log(file)
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          // setPhotoPrev(reader.result);
          console.log('hfei')
          console.log(file)
          setAvatar(file);
        }
      };
    }
  }
  return (
    <>
      <MetaData title="QE ~~AddExpense" />
      <div className={`CashDeposits ${colorTheme}`}>
        <div className="secondContainer">
        <div className="form">
          <div className="formRow">
            <div className="inputSection">
            <label>{t("PaidToStatus")}</label>
              {/* <div className="drop"> */}
              <Select
              value={status ? { label: status }  : { label: t('selectPaymentScope') } }
               options={PaidToStatusOptions} onChange={handlePaidToStatusChange} />
              {/* </div> */}
            </div>
            <div className="inputSection">
              <label>{t("beneficiary")}</label>
              {status === "WithInOrganization" ? (
                <AsyncSelect 
                  value={paidToValue ? { label: paidToValue } : { label: t("selectBeneficiary") }}
                  loadOptions={usersDataList?.length > 0 && loadUserOptions}
                  defaultOptions={usersDataList} 
                  onChange={handleUserChange} 
                />
              ) : status === "OutsideOrganization" ? (
                <input
                  type="text"
                  placeholder={t("enterBeneficiaryName")}
                  name="manualName"
                  autoComplete="off"
                  maxLength="40"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                />
              ) : (
                <AsyncSelect 
                  value={{ label: t("selectBeneficiary") }}
                  isDisabled={true}
                  placeholder={t("selectPaymentScopeFirst")}
                />
              )}
            </div>
          </div>
          <div className="formRow">
            <div className="inputSection">
              
            <label>{t("paymentMode")}</label>
            {/* <div className="drop"> */}
              <Select 
                value={paymentMode ? { label: paymentMode }  : { label: t("selectPaymentMode") } }
               options={paymentModeOptions} onChange={handlePaymentModeToChange} />
              {/* </div> */}
            </div>
              <div className="inputSection">
            <label>{t("accountNo")}</label>
              <input
                type="text"
                placeholder={t("enterDescription")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
              />
              </div>
          </div>
            <div className="formRow">
            <div className="inputSection">
              
            <label>{t("amount")}</label>
             <input
                type="number"
                placeholder={t("enterAmount")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
              <div className="inputSection">
            <label>{t("Picture")} ({t("optional")})</label>
              <input
                type="file"
                placeholder={t("enterExpenseDescription")}
                accept="image/*"
                // value={avatar}
                onChange={handleImageValue}
              />
              </div>
          </div>
          <div className="buttonRow">
            <Button
              color={"green"}
              onClick={backPage}
              className="button button-back"
              type="button"
            >
              <ArrowBackIcon />
              &nbsp; &nbsp;&nbsp;{t("back")}
            </Button>
            <Button
              onClick={addDeposit}
              type="button"
              className={`button button-add-product `}
            >
              {t("add-Desposit")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
            {/* {showModalconfirm && <Showconfrm />} */}
          </div>
        </div>
        </div>
      </div>
    </>
    // <Modal open dimmer="inverted" size="tiny" closeIcon="close">
    //    <Stack  backgroundColor="#ECECEC">
    //     <Stack spacing={2} direction="row" marginLeft={2} alignItems="center" marginTop={1}>
    //       <Typography variant="h5" gutterBottom style={{ color: "#000000"}}>{t("add-expenses")}</Typography>
    //     </Stack>
    //   <Stack padding={3}>

    //   <Modal.Content>
    //     <Form className={"formColorUser"}>
    //       <Form.Group widths="equal">
    //         <Form.Field
    //           control={Select}
    //           label={t("expenseType")}
    //           options={expenseTypee?.map((element) => ({
    //             key: element.expenseType,
    //             text: element.expenseType,
    //             value: element.expenseType,
    //           }))}
    //           required
    //           placeholder={t("enterExpenseType")}
    //           selection
    //           value={expenseType}
    //           onChange={handleTypeSelectChange}
    //         />
    //         <Form.Input
    //           label={t("expenseAmount")}
    //           type="Number"
    //           placeholder={t("enterExpenseAmount")}
    //           name="Expense Amount"
    //           maxLength="40"
    //           autoComplete="off"
    //           required
    //           value={expenseAmount}
    //           onChange={(e) => setExpenseAmount(e.target.value)}
    //         />
    //       </Form.Group>
    //       <Form.Group widths="equal">
    //         <Form.Input
    //           label={t("expenseDescription")}
    //           type="text"
    //           placeholder={t("enterExpenseDescription")}
    //           name="Expense Description"
    //           maxLength="40"
    //           autoComplete="off"
    //           value={expenseDescription}
    //           onChange={(e) => setExpenseDescription(e.target.value)}
    //         />
    //       </Form.Group>
    //       <Button
    //         color={"green"}
    //         onClick={addExpense}
    //         style={{fontSize: "17px", paddingLeft: "10px", paddingRight: "5px", paddingTop: "5px", paddingBottom: "5px" }}
    //         type="button"
    //         className="button"
    //         floated="right"
    //       >
    //         {t("add-expenses")}&nbsp;&nbsp;<AddIcon />
    //       </Button>
    //       <Button
    //         color={"green"}
    //         onClick={backPage}
    //         style={{fontSize: "17px", paddingLeft: "5px", paddingRight: "10px", paddingTop: "5px", paddingBottom: "5px" }}
    //         type="button"
    //         className="button"
    //         floated="left"
    //       >
    //         <ArrowBackIcon />&nbsp;{t("back")}
    //       </Button>
    //       <br />
    //       <br />
    //     </Form>
    //   </Modal.Content>
    //   </Stack>
    //   </Stack>
    // </Modal>
  );
};

export default ExpenseFormm;