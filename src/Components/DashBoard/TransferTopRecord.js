import React, { useEffect,useState } from 'react';
import {Bar} from "react-chartjs-2"
import {Chart as ChartJs,
    BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js';
    import { ResponsiveContainer } from 'recharts';
import { getTopFourForDashBoard, getTopFourForDashBoardDaily, getTopFourForDashBoardDailyOnShop, getTopFourForDashBoardMonthly, getTopFourForDashBoardMonthlyOnShop, getTopFourForDashBoardOnShop, getTopFourForDashBoardYearly, getTopFourForDashBoardYearlyOnShopId, getTopFourForPurchasdDashBoardOnShop, getTopFourForPurchaseDashBoard, getTopFourForPurchaseDashBoardDaily, getTopFourForPurchaseDashBoardDailyOnShop, getTopFourForPurchaseDashBoardMonthly, getTopFourForPurchaseDashBoardMonthlyOnShop, getTopFourForPurchaseDashBoardYearly, getTopFourForPurchaseDashBoardYearlyOnShopId, getTopFourForTransferFromDashBoardOnShopId, getTopFourForTransferFromDashBoardYearlyOnShopId, getTopFourForTransferToDashBoardOnShopId, getTopTransferFromCurrentMonthOnShop, getTopTransferFromYearlyOnShop, getTopTransferToCurrentMonthOnShop, getTopTransferToYearlyOnShop } from '../../actions/dashboardAction';
    ChartJs.register(
        BarElement,
        CategoryScale,
        LinearScale,
        Tooltip,
        Legend
      )

const TransferTopRecord = ({ selectedDropDownValue }) => {
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
        ]
      });
      const [chartTransferInData, setChartTransferInData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
            borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
            borderWidth: 1,
          },
        ]
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
      const [chartTransferInDailyData, setChartTransferInDailyData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
            borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
            borderWidth: 1,
          },
        ]
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
      const [chartTransferInMonthlyData, setChartTransferInMonthlyData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
            borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
            borderWidth: 1,
          },
        ]
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
      const [chartTransferInYearlyData, setChartTransferInYearlyData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Total Sale Amount',
            data: [],
            backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
            borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
            borderWidth: 1,
          },
        ]
      });
    useEffect(() => {
      getTopProducts()
    }, [selectedDropDownValue]);

    const getTopProducts = async() =>{



      let overAllData;
      let overAllTransferTo;
      if(selectedDropDownValue)
      {
       overAllData= await getTopFourForTransferFromDashBoardOnShopId(selectedDropDownValue)
       overAllTransferTo= await getTopFourForTransferToDashBoardOnShopId(selectedDropDownValue)
      }else{
        overAllData= await getTopFourForTransferFromDashBoardOnShopId(JSON.parse(localStorage.getItem('shopId')))
        overAllTransferTo= await getTopFourForTransferToDashBoardOnShopId(JSON.parse(localStorage.getItem('shopId')))
      }
       
        console.log(overAllData)

        const labelsTransferFrom = overAllData?.map(product => `${product?._id?.productCode}`);
        const transferFromData = overAllData?.map(product => parseFloat(product?.totalQuantity));

        const labelsTranferTo = overAllTransferTo?.map(product => `${product?._id?.productCode}`)
        const transferToData = overAllTransferTo?.map(product => parseFloat(product?.totalQuantity))
        setChartData({
            labels: labelsTranferTo,
            datasets: [
              {
                label: 'Top Transfer Out Qty (OverAll)',
                data: transferToData,
                backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
                borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
                borderWidth: 1,
              }
            ],
          });

          setChartTransferInData({
            labels: labelsTransferFrom,
            datasets: [
              {
                label: 'Top Transfer In Qty (OverAll)',
                data: transferFromData,
                backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
                borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
                borderWidth: 1,
              }
            ],
          });



     let monthlyData;
      let monthlyTransferTo;
      if(selectedDropDownValue)
      {
        monthlyData= await getTopTransferFromCurrentMonthOnShop(selectedDropDownValue)
       monthlyTransferTo= await getTopTransferToCurrentMonthOnShop(selectedDropDownValue)
      }else{
        monthlyData= await getTopTransferFromCurrentMonthOnShop(JSON.parse(localStorage.getItem('shopId')))
        monthlyTransferTo= await getTopTransferToCurrentMonthOnShop(JSON.parse(localStorage.getItem('shopId')))
      }
   
      const labelsMontlyTransferFrom = monthlyData?.map(product => `${product?._id?.productCode}`);
      const transferFromMonthlyData = monthlyTransferTo?.map(product => parseFloat(product?.totalQuantity));

      const labelsMonthlyTranferTo = monthlyData?.map(product => `${product?._id?.productCode}`)
      const transferToMonthlyData = monthlyTransferTo?.map(product => parseFloat(product?.totalQuantity))
      setSecondChartData({
            labels: labelsMonthlyTranferTo,
            datasets: [
              {
                label: 'Top Transfer Out Qty (Monthly)',
                data: transferToMonthlyData,
                backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
      borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
      borderWidth: 1,
              },
            ],
          });

      setChartTransferInMonthlyData({
            labels: labelsMontlyTransferFrom,
            datasets: [
              {
                label: 'Top Transfer In Qty (Monthly)',
                data: transferFromMonthlyData,
                backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
      borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
      borderWidth: 1,
              },
            ],
          });



      let dailyData;
      let dailyTransferTo;
      if(selectedDropDownValue)
      {
        dailyData= await getTopTransferFromCurrentMonthOnShop(selectedDropDownValue)
        dailyTransferTo= await getTopTransferToCurrentMonthOnShop(selectedDropDownValue)
      }else{
        dailyData= await getTopTransferFromCurrentMonthOnShop(JSON.parse(localStorage.getItem('shopId')))
        dailyTransferTo= await getTopTransferToCurrentMonthOnShop(JSON.parse(localStorage.getItem('shopId')))
      }
   
      const labelsDailyTransferFrom = dailyData?.map(product => `${product?._id?.productCode}`);
      const transferFromDailyData = dailyTransferTo?.map(product => parseFloat(product?.totalQuantity));

      const labelsDailyTranferTo = dailyData?.map(product => `${product?._id?.productCode}`)
      const transferToDailyData = dailyTransferTo?.map(product => parseFloat(product?.totalQuantity))
      setDailyChartData({
            labels: labelsDailyTransferFrom,
            datasets: [
              {
                label: 'Top Transfer Out Qty (Daily)',
                data: transferFromDailyData,
                backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
      borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
      borderWidth: 1,
              },
            ],
          });
          setChartTransferInDailyData({
            labels: labelsDailyTranferTo,
            datasets: [
              {
                label: 'Top Transfer In Qty (Daily)',
                data: transferToDailyData,
                backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
      borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
      borderWidth: 1,
              },
            ],
          });

       let yearlyTransferFromData;
      let yearlyTransferToData;
      if(selectedDropDownValue)
      {
        yearlyTransferFromData= await getTopTransferFromYearlyOnShop(selectedDropDownValue)
        yearlyTransferToData= await getTopTransferToYearlyOnShop(selectedDropDownValue)
      }else{
        yearlyTransferFromData= await getTopTransferFromYearlyOnShop(JSON.parse(localStorage.getItem('shopId')))
        yearlyTransferToData= await getTopTransferToYearlyOnShop(JSON.parse(localStorage.getItem('shopId')))
      }
      const labelsYearlyTransferFrom = yearlyTransferFromData?.map(product => `${product?._id?.productCode}`);
      const transferFromYearlyData = yearlyTransferToData?.map(product => parseFloat(product?.totalQuantity));

      const labelsYearlyTranferTo = yearlyTransferFromData?.map(product => `${product?._id?.productCode}`)
      const transferToYearlyData = yearlyTransferToData?.map(product => parseFloat(product?.totalQuantity))
              setYearlyChartData({
                  labels: labelsYearlyTransferFrom,
                  datasets: [
                    {
                      label: 'Top Transfer Out Qty(Yearly)',
                      data: transferFromYearlyData,
                      backgroundColor: 'rgba(144, 238, 144, 0.7)', // Light green color
                      borderColor: 'rgba(144, 238, 144, 1)', // Border color for the bars
                      borderWidth: 1,
                    },
                  ],
                });

                setChartTransferInYearlyData({
                  labels: labelsYearlyTranferTo,
                  datasets: [
                    {
                      label: 'Top Transfer In Qty(Yearly)',
                      data: transferToYearlyData,
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
        <div style={{display: "flex", marginTop: "1vh"}}>
        <div style={{width: '24%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={chartTransferInDailyData} options={options} />
        </div>
        <div style={{width: '24%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={chartTransferInMonthlyData} options={options} />
        </div>
        <div style={{width: '24%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={chartTransferInYearlyData} options={options} />
        </div>
        <div style={{width: '24%', marginLeft: "1.3vh", backgroundColor: "white"}}>
        <Bar  data={chartTransferInData} options={options} />
        </div>
        </div>
        </ResponsiveContainer>
      </>
    );
  };
  
  export default TransferTopRecord;
    