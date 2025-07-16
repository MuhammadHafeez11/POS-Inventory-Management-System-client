import React, { useEffect,useState } from 'react';
import {Bar} from "react-chartjs-2"
import {Chart as ChartJs,
    BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js';
    import { ResponsiveContainer } from 'recharts';
import { getTopFourForDashBoard, getTopFourForDashBoardDaily, getTopFourForDashBoardDailyOnShop, getTopFourForDashBoardMonthly, getTopFourForDashBoardMonthlyOnShop, getTopFourForDashBoardOnShop, getTopFourForDashBoardYearly, getTopFourForDashBoardYearlyOnShopId, getTopFourForPurchasdDashBoardOnShop, getTopFourForPurchaseDashBoard, getTopFourForPurchaseDashBoardDaily, getTopFourForPurchaseDashBoardDailyOnShop, getTopFourForPurchaseDashBoardMonthly, getTopFourForPurchaseDashBoardMonthlyOnShop, getTopFourForPurchaseDashBoardYearly, getTopFourForPurchaseDashBoardYearlyOnShopId } from '../../actions/dashboardAction';
    ChartJs.register(
        BarElement,
        CategoryScale,
        LinearScale,
        Tooltip,
        Legend
      )

const PurchaseTopRecord = ({ props }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
            borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
            borderWidth: 1,
          },
        ],
      });
      const [secondChartData, setSecondChartData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
      borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
      borderWidth: 1,
          },
        ],
      });
      const [dailyChartData, setDailyChartData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
            borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
            borderWidth: 1,
          },
        ],
      });
      const [yearlyChartData, setYearlyChartData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
            borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
            borderWidth: 1,
          },
        ],
      });
    useEffect(() => {
      getTopProducts()
    }, []);

    const getTopProducts = async() =>{
      let overAllData;
      if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
      {
       overAllData= await getTopFourForPurchaseDashBoard()
      }else{
        overAllData= await getTopFourForPurchasdDashBoardOnShop(JSON.parse(localStorage.getItem('shopId')))
      }
       
        console.log(overAllData)
        const labels = overAllData?.map(product => `${product?._id?.productCode}`);

        const purchaseRecord = overAllData?.map(product => parseFloat(product?.totalAmount));
        setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Top Purchase Amount(OverAll)',
                data: purchaseRecord,
                backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
                borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
                borderWidth: 1,
              },
            ],
          });
    let monthlyData;
    if(JSON.parse(localStorage.getItem("isAdministrator"))|| JSON.parse(localStorage.getItem("isSuperAdmin"))){
      monthlyData = await getTopFourForPurchaseDashBoardMonthly()
    }else{
     monthlyData = await getTopFourForPurchaseDashBoardMonthlyOnShop(JSON.parse(localStorage.getItem("shopId")))
    }
   
    const labels1 = monthlyData?.map(product => `${product?._id?.productCode}`);

        const purchaseRecordMonthly = monthlyData?.map(product => parseFloat(product?.totalAmount));
        setSecondChartData({
            labels: labels1,
            datasets: [
              {
                label: 'Top Purchase Amount(Monthly)',
                data: purchaseRecordMonthly,
                backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
      borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
      borderWidth: 1,
              },
            ],
          });

          let dailyRecord;
          if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin"))){
             dailyRecord = await getTopFourForPurchaseDashBoardDaily()
          }else{
            dailyRecord = await getTopFourForPurchaseDashBoardDailyOnShop(JSON.parse(localStorage.getItem("shopId")))
          }
          
          const labels2 = dailyRecord?.map(product => `${product?._id?.productCode}`);
      
              const purchaseAmountDaily = dailyRecord?.map(product => parseFloat(product?.totalAmount));
              setDailyChartData({
                  labels: labels2,
                  datasets: [
                    {
                      label: 'Top Purchase Amount(Daily)',
                      data: purchaseAmountDaily,
                      backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
                      borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
                      borderWidth: 1,
                    },
                  ],
                });
          let yearlyData;
          if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem('isSuperAdmin')) ){
            yearlyData= await getTopFourForPurchaseDashBoardYearly()
          }else{
            yearlyData = await getTopFourForPurchaseDashBoardYearlyOnShopId(JSON.parse(localStorage.getItem("shopId")))
          }
          const labels3 = yearlyData?.map(product => `${product?._id?.productCode}`);
            const salesAmountYearly = yearlyData?.map(product => parseFloat(product?.totalAmount))
              setYearlyChartData({
                  labels: labels3,
                  datasets: [
                    {
                      label: 'Top Purchase Amount(Yearly)',
                      data: salesAmountYearly,
                      backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
                      borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
                      borderWidth: 1,
                    },
                  ],
                });
    }   

    
   
      const options = {
        maintainAspectRatio: false, // Set this to false to control the width and height manually
        responsive: true, // Set this to true for automatic responsiveness
      
        // Set width and height in pixels
        // For example:
        width: 400,
        height: 100,
      };
    return (
      <>
      <ResponsiveContainer >
        {/* <div className="records-container">
           <div className="records-container"> */}
        <div style={{display: "flex"}}>
        <div style={{width: '24%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={dailyChartData} options={options} />
        </div>
        <div style={{width: '24%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={secondChartData} options={options} />
        </div>
        <div style={{width: '24%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={yearlyChartData} options={options} />
        </div>
        <div style={{width: '24%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={chartData} options={options} />
        </div>
       
       
        
        </div>
      {/* </div>
        </div> */}
        </ResponsiveContainer>
      </>
    );
  };
  
  export default PurchaseTopRecord;
    