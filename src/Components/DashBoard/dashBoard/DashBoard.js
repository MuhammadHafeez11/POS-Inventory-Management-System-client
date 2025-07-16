import React, { useState, useEffect } from "react";
import MetaData from "../../../MetaData";
import MainDash from "../MainDash/MainDash"
import RightSide from "../RigtSide/RightSide"
// import "../Components/DashBoard/NewDash.css"
import { useSelector, useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getTopSalesForDashBoard,
  getTopSalesForDashBoardWithUser,
  getSalesDataForDashBoard,
  getSalesDataForDashBoardWithUser,
  getActiveUsers,
  getPurchaseRecordForCurrentMonth,
  getPurchaseRecordForCurrentMonthForShop,
  getExpensesThisMonthForShop,
  getExpensesThisMonth,
} from "../../../actions/dashboardAction";
import { refreshTokken } from "../../../actions/userAction";
let isCalled = "false";
const DashBoard = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [colorTheme, setColorTheme] = useState();
  const [selectedDropDownValue, setSelectedDropDownValue] = useState('');

  //useStates
  const navigate = useNavigate();
  const [topProductSalesPerformance, setTopProductSalesPerformance] = useState(
    []
  );
  const { user } = useSelector((state) => state.user)
  const { storage } = useSelector((state) => state.storage);
  const { shop } = useSelector((state) => state.shop);
  //USer Data useStates
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  //Sales Data USe States
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSalesItem, setTotalSalesItem] = useState(0);

  //PurchaseData Use States
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalPurchaseItem, setTotalPurchaseItem] = useState(0);

  //TransferData UserStates
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);
  const [totalExpenseItem, setTotalExpenseItem] = useState(0);

  const { topProducts } = useSelector((state) => state.topProducts);
  const { topProductsUser } = useSelector((state) => state.topProductsUser);
  const { allSalesData } = useSelector((state) => state.allSalesData);
  const { allSalesDataWithUser } = useSelector(
    (state) => state.allSalesDataWithUser
  );
  const { activeUser } = useSelector((state) => state.activeUser);
  const { allPurchaseData } = useSelector((state) => state.allPurchaseData);
  const { allPurchaseDataForShop } = useSelector(
    (state) => state.allPurchaseDataForShop
  );
  const { allExpenseData } = useSelector((state) => state.allExpenseData);
  const { allExpenseDataForShop } = useSelector(
    (state) => state.allExpenseDataForShop
  );

 
  // useEffect(() => {
  //   callFunctionForTopProducts();
  // }, []);

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);

  useEffect(() => {
    isCalled = "false";
  }, []);
  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true";
      getToken();
    }
  }, []);
  const getToken = async () => {
    const token = await refreshTokken(user?.user?._id);
    if (token?.data === "Please login to acces this resource") {
      navigate("/login");
      console.log("hii");
    }
    console.log(token);
  };


  const callFunctionForTopProducts = async () => {
    dispatch(getActiveUsers());
    if (
      JSON.parse(localStorage.getItem("isAdministrator")) ||
      JSON.parse(localStorage.getItem("isSuperAdmin"))
    ) {
      dispatch(getTopSalesForDashBoard()); 
      dispatch(getSalesDataForDashBoard());
      dispatch(getPurchaseRecordForCurrentMonth());
      dispatch(getExpensesThisMonth());
   
    } else {
      dispatch(getTopSalesForDashBoardWithUser());
      dispatch(getSalesDataForDashBoardWithUser());
      dispatch(getPurchaseRecordForCurrentMonthForShop());
      dispatch(getExpensesThisMonthForShop());
      
    }
  };

  return (
    <>
    <MetaData title="~~Dashboard" />
    <div className={`Dashboard  ${colorTheme}`}>
      <div className="dashboardSecondContainer">
        {/* <Sidebar/> */}
        <MainDash/>
        <RightSide />
      </div>
    </div>
    
    </>
  );
};

export default DashBoard;
