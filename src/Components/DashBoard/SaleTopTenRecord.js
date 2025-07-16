import React, { useEffect,useState } from 'react';
import {Bar} from "react-chartjs-2"
import {Chart as ChartJs,
    BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js';
    import { ResponsiveContainer } from 'recharts';
import { getTopFourForDashBoard, getTopFourForDashBoardDaily, getTopFourForDashBoardDailyOnShop, getTopFourForDashBoardMonthly, getTopFourForDashBoardMonthlyOnShop, getTopFourForDashBoardOnShop, getTopFourForDashBoardYearly, getTopFourForDashBoardYearlyOnShopId } from '../../actions/dashboardAction';
    ChartJs.register(
        BarElement,
        CategoryScale,
        LinearScale,
        Tooltip,
        Legend
      )

const SaleTopTenRecord = ({ props }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(135, 206, 250, 0.7)',
          },
        ],
      });
      const [secondChartData, setSecondChartData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(135, 206, 250, 0.7)',
          },
        ],
      });
      const [dailyChartData, setDailyChartData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(135, 206, 250, 0.7)',
          },
        ],
      });
      const [yearlyChartData, setYearlyChartData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(135, 206, 250, 0.7)',
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
       overAllData= await getTopFourForDashBoard()
      }else{
        overAllData= await getTopFourForDashBoardOnShop(JSON.parse(localStorage.getItem('shopId')))
      }
       
        console.log(overAllData)
        const labels = overAllData?.map(product => `${product?._id?.productCode}`);

        const saleAmounts = overAllData?.map(product => parseFloat(product?.totalAmount));
        setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Total Sale Amount(OverAll)',
                data: saleAmounts,
                backgroundColor: 'rgba(135, 206, 250, 0.7)',
              },
            ],
          });
    let monthlyData;
    if(JSON.parse(localStorage.getItem("isAdministrator"))|| JSON.parse(localStorage.getItem("isSuperAdmin"))){
      monthlyData = await getTopFourForDashBoardMonthly()
    }else{
     monthlyData = await getTopFourForDashBoardMonthlyOnShop(JSON.parse(localStorage.getItem("shopId")))
    }
   
    const labels1 = monthlyData?.map(product => `${product?._id?.productCode}`);

        const salesAmounts = monthlyData?.map(product => parseFloat(product?.totalAmount));
        setSecondChartData({
            labels: labels1,
            datasets: [
              {
                label: 'Total Sale Amount(Monthly)',
                data: salesAmounts,
                backgroundColor: 'rgba(135, 206, 250, 0.7)',
              },
            ],
          });

          let dailyRecord;
          if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin"))){
             dailyRecord = await getTopFourForDashBoardDaily()
          }else{
            dailyRecord = await getTopFourForDashBoardDailyOnShop(JSON.parse(localStorage.getItem("shopId")))
          }
          
          const labels2 = dailyRecord?.map(product => `${product?._id?.productCode}`);
      
              const salesAmountDaily = dailyRecord?.map(product => parseFloat(product?.totalAmount));
              setDailyChartData({
                  labels: labels2,
                  datasets: [
                    {
                      label: 'Total Sale Amount(Daily)',
                      data: salesAmountDaily,
                      backgroundColor: 'rgba(135, 206, 250, 0.7)',
                    },
                  ],
                });
          let yearlyData;
          if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem('isSuperAdmin')) ){
            yearlyData= await getTopFourForDashBoardYearly()
          }else{
            yearlyData = await getTopFourForDashBoardYearlyOnShopId(JSON.parse(localStorage.getItem("shopId")))
          }
          const labels3 = yearlyData?.map(product => `${product?._id?.productCode}`);
      
              const salesAmountYearly = yearlyData?.map(product => parseFloat(product?.totalAmount));
              setYearlyChartData({
                  labels: labels3,
                  datasets: [
                    {
                      label: 'Total Sale Amount(Yearly)',
                      data: salesAmountYearly,
                      backgroundColor: 'rgba(135, 206, 250, 0.7)',
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
        {/* <div style={{width: '24%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={dailyChartData} options={options} />
        </div>
        <div style={{width: '24%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={secondChartData} options={options} />
        </div>
        <div style={{width: '24%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={yearlyChartData} options={options} />
        </div> */}
        <div style={{width: '50%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={chartData} options={options} />
        </div>
       
       
        
        </div>
      {/* </div>
        </div> */}
        </ResponsiveContainer>
      </>
    );
  };
  
  export default SaleTopTenRecord;
    