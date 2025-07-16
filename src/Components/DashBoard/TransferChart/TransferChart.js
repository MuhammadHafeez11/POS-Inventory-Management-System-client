import React, { useEffect, useState } from "react";
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
import { CircularProgressbar } from "react-circular-progressbar";
import { useSelector, useDispatch } from "react-redux";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";
import { getSalesDataForDashBoard, getTopSalesForDashBoard, getTopSalesForDashBoardWithUser, getTopTransfer, getTopTransferOnShop } from "../../../actions/dashboardAction";
import SalesBreakDown from "../SalesBreakDown"
import "./TransferChart.css"
// parent Card
let data;
let dataa
let optionData
const TransferCard = (props) => {
    const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
  const [dataAdded, setDataAdded] = useState(false)
  const { topProducts } = useSelector((state) => state.topProducts);
  const [topProductSalesPerformance, setTopProductSalesPerformance] = useState(
    []
  );



  useEffect(() => {
    if (topProducts) {
      console.log("called");
      console.log(topProducts);
      setTopProductSalesPerformance(topProducts);
    }
  }, [topProducts]);

    useEffect(()=>{
        transferCall()
    }, [])

    const transferCall =async()=>
    {
      if (
        JSON.parse(localStorage.getItem("isAdministrator")) ||
        JSON.parse(localStorage.getItem("isSuperAdmin"))
      ) {
        console.log('calld')
        dispatch(getTopSalesForDashBoard())
        data = await getTopTransfer()
        // dispatch(getActiveUsers())
      } else{
        dispatch(getTopSalesForDashBoardWithUser())
        data = await getTopTransferOnShop(JSON.parse(localStorage.getItem('shopId')))
      }
       
        console.log(data)
        let transferData;
        let transferDatesData
        if(data?.length > 0){
           transferData = data[0].data.map(entry =>entry.y);
           transferDatesData = data[0].data.map(entry =>entry.x);
        }
       
        setDataAdded(true)
        if(data?.length > 0)
        {
        dataa = [{
            title: "Transfer",
            color: {
              backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
              boxShadow: "0px 10px 20px 0px #e0c6f5",
            },
            barValue: 80,
            value: data[0]?.totalQuantitySum,
            png: UilUsdSquare,
            series: [
              {
                name: "Transfers",
                data: transferData,
              },
            ],
            date: transferDatesData
          }]

        optionData = {
            options: {
              chart: {
                type: "area",
                height: "auto",
              },
        
              dropShadow: {
                enabled: false,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 3,
                color: "#000",
                opacity: 0.35,
              },
        
              fill: {
                colors: ["#fff"],
                type: "gradient",
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "smooth",
                colors: ["white"],
              },
              tooltip: {
                x: {
                  format: "dd/MM/yy HH:mm",
                },
              },
              grid: {
                show: true,
              },
              xaxis: {
                type: "datetime",
                categories: transferDatesData
              },
              toolbar: {
                show: true,
                offsetX: 0,
                offsetY: 0,
                tools: {
                  download: false,
                  selection: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  reset: true,
                },
                autoSelected: 'zoom',
                position: 'bottom',
              }
            }}}
          
    }

  return (
    <div className="transferChartContainer">
    <div className="transferBarChart">
    {(dataAdded && dataa?.length > 0 ) && (<>
      {/* <span>{dataa[0].title}</span> */}
    <Chart options={optionData?.options} series={dataa[0].series} type="area" /></>)}
    </div>
    <div className="transferPieChart">
    {topProducts?.length > 0 && (
              <SalesBreakDown
                props={{
                  sale: topProducts,
                }}
              />
            )}
            </div>
    {/*  */}
  </div>
  );

    };


export default TransferCard;
