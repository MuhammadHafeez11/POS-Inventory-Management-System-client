import React, { useEffect, useState } from "react";
import "./Cards.css";
import { cardsData } from "../Data/Data";
import {
  Message,
  Button,
  Dropdown,
  Form,
  Select,
  Modal,
  Dimmer,
  Loader,
  Image,
  Segment,
} from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilUsdSquare,
  UilMoneyWithdrawal,
  UilPackage,
  UilChart,
  UilSignOutAlt
} from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import Card from "../Card/Card";
import { getTopFourForDashBoard, getTopFourForDashBoardOnShop, getTopFourForPurchasdDashBoardOnShop, getTopFourForPurchaseDashBoard } from "../../../actions/dashboardAction";
import { getShop } from "../../../actions/shopAction";
let dataa;
const Cards = () => {
  const [dataAdded, setDataAdded] = useState(false)
  const {t}= useTranslation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { shop } = useSelector((state) => state.shop);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedDurationText, setSelectedDurationText] = useState('')
  const [selectedShop, setSelectedShop] = useState('');
  const dispatch = useDispatch()


  const handleDropdownChange = (event, { value }) => {
    const selectedOption = categoryOptions.find(option => option.value === value);
  // if (selectedOption) {
    if(selectedOption)
    {
      const { text } = selectedOption;
      setSelectedDurationText(text)
    }else{
      setSelectedDurationText('')
    }
    setDataAdded(false);
    setSelectedDuration(value);
  };


  const handleShopDropdownChange = (event, { value }) => {
    setDataAdded(false)
    setSelectedShop(value);
    
  };
  const categoryOptions = [
    { key: "1", text: "Today", value: "today" },
    { key: "2", text: "This Week", value: "thisWeek" },
    { key: "3", text: "This Month", value: "thisMonth" },
    { key: "4", text: "Last 3 Months", value: "last3Months" },
    { key: "5", text: "This Year", value: "thisYear" },
    { key: "6", text: "Last Year", value: "lastYear" },
  ];

  useEffect(()=>{
    dispatch(getShop())
  }, [])
  useEffect(()=>{
    Call()
  }, [selectedDuration, selectedShop])

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCardSelect = (selectedValue) => {
    console.log('Selected value in Cards.js:', selectedValue);
    // Do something with the selected value in the parent component
  };

  const Call=async() =>{
    console.log(selectedShop)
    console.log(selectedDuration)
    let overAllData;
    let overAllPurchaseData;

    if(selectedDuration || selectedShop){
      if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
      {
        if(selectedDuration && selectedShop)
        {
          overAllData= await getTopFourForDashBoardOnShop(selectedShop, selectedDuration)
          overAllPurchaseData = await getTopFourForPurchasdDashBoardOnShop(selectedShop, selectedDuration)
        }else
        if(selectedShop){
          overAllData= await getTopFourForDashBoardOnShop(selectedShop)
          overAllPurchaseData = await getTopFourForPurchasdDashBoardOnShop(selectedShop)
        }else if(selectedDuration){
          overAllData= await getTopFourForDashBoard(selectedDuration)
          overAllPurchaseData = await getTopFourForPurchaseDashBoard(selectedDuration)
        }
      }else{
        if(selectedDuration)
        {
          overAllData= await getTopFourForDashBoardOnShop(JSON.parse(localStorage.getItem("shopId")), selectedDuration)
          overAllPurchaseData = await getTopFourForPurchasdDashBoardOnShop(JSON.parse(localStorage.getItem("shopId")), selectedDuration)
        }
      }
    }else{
      if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
      {
        overAllData= await getTopFourForDashBoard()
        overAllPurchaseData = await getTopFourForPurchaseDashBoard()
      }else{
        overAllData= await getTopFourForDashBoardOnShop(JSON.parse(localStorage.getItem('shopId')))
        overAllPurchaseData = await getTopFourForPurchasdDashBoardOnShop(JSON.parse(localStorage.getItem('shopId')))
      }
    }
   

    if(overAllData?.length > 0 && overAllPurchaseData?.length > 0){
    const salesData = overAllData[0].data.map(entry =>entry.y);
    const salesDatesData = overAllData[0].data.map(entry =>entry.x);

    const purchaseData = overAllPurchaseData[0].data.map(entry =>entry.y);
    const purchaseDatesData = overAllPurchaseData[0].data.map(entry =>entry.x);
    dataa = [{
      title: "Sales",
      color: {
        backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      barValue: 70,
      value: overAllData[0]?.totalAmountSum,
      png: UilUsdSquare,
      series: [
        {
          name: "Sales",
          data: salesData,
        },
      ],
      date: salesDatesData,
      duration: selectedDurationText || "Over All"
    },
    {
      title: "Purchase",
      color: {
        backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
        boxShadow: "0px 10px 20px 0px #FDC0C7",
      },
      barValue: 80,
      value: overAllPurchaseData[0]?.totalAmountSum,
      png: UilMoneyWithdrawal,
      series: [
        {
          name: "Purchase",
          data: purchaseData,
        },
      ],
      date: purchaseDatesData,
      duration: selectedDurationText || "Over All"
    },
    {
      title: "Expenses",
      color: {
        backGround:
          "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
        boxShadow: "0px 10px 20px 0px #F9D59B",
      },
      barValue: 60,
      value: "4,270",
      png: UilClipboardAlt,
      series: [
        {
          name: "Expenses",
          data: [10, 25, 15, 30, 12, 15, 20],
        },
      ],
      date: salesDatesData,
      duration: selectedDurationText || "Over All"
    }]
      setDataAdded(true)
    }
    
  }
  return (<>
  {/* <div className="cards-container"> */}
    {dataAdded && (<>
      <div className="dropdown-box ">
        {(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin"))) ? (
          <>
            <Dropdown
            control={Select}
            placeholder={t("selectTimePeriod")}
            className="dashboardDropdown1"
            fluid
            selection
            clearable
            value={selectedDuration}
            options={categoryOptions}
            onChange={handleDropdownChange}
          />
           <Dropdown
            control={Select}
            placeholder={t("selectShop")}
            className="dashboardDropdown2"
            fluid
            selection
            clearable
            value={selectedShop}
            options={shop.map((option) => ({
              key: option.shopCode,
              text: option.shopCode,
              value: option.shopCode,
            }))}
            onChange={handleShopDropdownChange}
          />
          </>
        ): (<><Dropdown
          control={Select}
          placeholder={t("selectTimePeriod")}
          className="AdmindashboardDropdown1"
          fluid
          selection
          clearable
          value={selectedDuration}
          options={categoryOptions}
          onChange={handleDropdownChange}
        /></>)}
      
        {/* Your dropdown content goes here */}
       
      </div>
    {/* )} */}
    <div className="Cards">
        {dataa?.map((card, id) => {
        return (
          <div className={`parentContainer ${card.title}`} key={id}>
            <Card
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={card.value}
              png={card.png}
              series={card.series}
              date={card.date}
              duration={card.duration}
              onSelectDropdown={handleCardSelect}
            />
          </div>
        );
      })}
      
      </div></>)}
      {/* </div> */}
      </>);
};

export default Cards;
