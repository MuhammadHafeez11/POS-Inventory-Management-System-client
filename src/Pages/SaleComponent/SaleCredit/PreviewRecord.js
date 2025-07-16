import React, { useContext, useEffect, useState } from "react";
import { UseDispatch, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import { getSpecificCustomerVisaRecord, updateCustomerVisaRecord, updateCustomerVisaStatus } from "../../../Actions/visaCustomerPaymentAction";
// import MainTableComponent from "../../TableComponent/MainTableComponent";
// import "./customerVisa.css"
import { useRef } from "react";

import PrintLaserTable from "../../../Components/tableComponent/printLaserTable"
import ReactToPrint from "react-to-print";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { getSingleSaleCreditRecord, updateSaleCreditPayment, updateSaleCreditRecord } from "../../../actions/saleProductAction";
import MetaData from "../../../MetaData";
import { Button } from "semantic-ui-react";
import { UPDATE_SALE_CREDIT_SUCCESS } from "../../../constants/saleConstants";
import Dates from "./Dates";
import { State } from "../salesRecord/context/ContextSales";
// import LaserPrintTable from "../../TableComponent/LaserPrintTable"
// import { UPDATE_VISACUSTOMERPAYMENT_DETAIL_SUCCESS } from "../../../Constants/visaCustomerPaymentConstants";
// import Dates from "./Dates";
// import Header from "./Header";
let legnthOfPrevData;
let payedAmount;
let remains;
let initialPayments;
const PreviewSaleCredit = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const statusDropdownRef = useRef(null);
    const visaRef = useRef();
    const params = useParams()
    const alert = useAlert()
    const { salesId,setSalesId, salesRef } = useContext(State);
    const [colorTheme, setColorTheme] = useState()
    const { singleSaleCreditRecord, singleSaleCreditRecordLoading } = useSelector((state)=> state.singleSaleCreditRecord)
    // const {visaCustomerPaymentDetailRecord, visaCustomerPaymentDetailRecordLoading} = useSelector((state)=> state.visaCustomerPaymentDetailRecord)
    const {updateSaleCreditRecord, updateSaleCreditRecordLoading, updateSaleCreditRecordError} = useSelector((state)=> state.updateSaleCreditRecord)
    const [payments, setPayments] = useState([]);
    const [isOptionSelectedOpen, setIsOptionSelectedOpen] = useState(false)
    const [isStatusSelectedOpen, setIsStatusSelectedOpen] = useState(false)
    const [recordUpdate, setRecordUpdate] = useState('paymentUpdate')
    const [selectedValue, setSelectedValue] = useState('Payments Update')
    const [paymentStatus, setPaymentStatus] = useState("Unpaid")
    const [statusUpdate, setStatusUpdate] = useState()
    const [selectedStatus, setSelectedStatus] = useState()

    const handleDownPaymentValue = (e) => {
        console.log(e)
      
        console.log(singleSaleCreditRecord?.data?.payments[legnthOfPrevData])



        const prevValue = singleSaleCreditRecord?.data?.payments[legnthOfPrevData]
        console.log(prevValue?.paymentPayed)
        payedAmount = parseFloat(prevValue?.paymentPayed) + parseFloat(e.target.value)
        // const discount = singleSaleCreditRecord?.data?.discount
        remains = singleSaleCreditRecord?.data?.total - payedAmount
        if(payedAmount > singleSaleCreditRecord?.data?.total){
            return alert.error(`Payed Amount should less than Total Amount`)
          }
          if(remains < 0){
            initialPayments=0
            payedAmount=0
            remains=0
            return alert.error(`Payment Completed`)
          }
        
        console.log(payedAmount)
        console.log(remains)
        if(remains < 1){
          console.log('fe')
          setPaymentStatus("Paid")
        }else{
          setPaymentStatus("Unpaid")
        }
        const newPayments = [
            ...singleSaleCreditRecord?.data?.payments, // Copy previous array
            {
              downPayment: e.target.value, // Default value for down payment
              paymentPayed: payedAmount, // Default value for payment payed
              remaining: remains, // Default value for remaining payment
            }
          ];
          console.log(newPayments)
          setPayments(newPayments);
          initialPayments = parseInt(e.target.value)
    }

    const updateCustomerVisa= () => {
        dispatch(updateSaleCreditPayment(singleSaleCreditRecord?.data?._id, payments, paymentStatus))
    }
 
    
    const updateCustomerVisStatus= () => {
      // dispatch(updateCustomerVisaStatus(params.id, selectedStatus))
  }

  useEffect(()=> {
    if(!updateSaleCreditRecordLoading && updateSaleCreditRecord?.success)
    {
      console.log(updateSaleCreditRecord)
      updateSuccessMessage()
    }
  }, [updateSaleCreditRecord, updateSaleCreditRecordLoading])

  useEffect(()=> {
    if(!updateSaleCreditRecordLoading && updateSaleCreditRecordError)
    {
      updateErrorMessage(updateSaleCreditRecordError?.data?.message)
    }
  }, [updateSaleCreditRecordLoading, updateSaleCreditRecordError])

  useEffect(()=>{
    remains = ''
    initialPayments = ''
    payedAmount = ''
  }, [])

  const updateSuccessMessage =() => {
    initialPayments = ''
    payedAmount = ''
    remains = ''
    // dispatch(getSpecificCustomerVisaRecord(params.id))
    dispatch({
      type: UPDATE_SALE_CREDIT_SUCCESS,
      payload: [],
    });
    return alert.success('Record Updated Successfully')
  }
  
  const updateErrorMessage = (message) => {
    return alert.error(message)
  }
  

      useEffect(()=>{
        setColorTheme(localStorage.getItem('theme-color'))
      }, [localStorage.getItem('theme-color')])

    useEffect(()=>{
        dispatch(getSingleSaleCreditRecord(params.id))
    }, [])

    useEffect(()=>{
        if(!singleSaleCreditRecordLoading && singleSaleCreditRecord)
        {
        legnthOfPrevData = singleSaleCreditRecord?.data?.payments.length - 1
        const initialPayments =singleSaleCreditRecord?.data?.payments
        payedAmount = singleSaleCreditRecord?.data?.payments[legnthOfPrevData]?.paymentPayed
        setPayments(initialPayments)
        console.log(legnthOfPrevData)
        }
    

    }, [singleSaleCreditRecordLoading, singleSaleCreditRecord])

    const optionToggleDropdown = () => {
      setIsOptionSelectedOpen(!isOptionSelectedOpen)
    }

    const statusOptionToggleDropdown = () => {
      setIsStatusSelectedOpen(!isStatusSelectedOpen)
    }

    const handleOptionSelection = (value, text) => {
      console.log(value)
      if(value.startsWith("p"))
      {
        console.log('p')
        setRecordUpdate(value)
        setStatusUpdate('')
        setSelectedValue(text)
        setIsOptionSelectedOpen(!isOptionSelectedOpen)
      }else{
        console.log('s')
        setStatusUpdate(value)
        setRecordUpdate('')
        setSelectedValue(text)
        setIsOptionSelectedOpen(!isOptionSelectedOpen)
      }
    }

    const back = () =>{
      navigate("/saleCreditRecord")
    }
    
    const viewInvoice = () =>{
    console.log(singleSaleCreditRecord?.data)
    setSalesId(singleSaleCreditRecord?.data?.id)
    navigate("/Preview", {state: '/Salerecord'});
    }

    const handleStatusOptionSelection = (value) => {
      console.log(value)
      setIsStatusSelectedOpen(!isStatusSelectedOpen)
      setSelectedStatus(value)
    }

    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
          console.log('fie')
          setIsOptionSelectedOpen(false);
        }
        console.log('clikced')
      };
      window.addEventListener('click', handleClickOutside);
      return () => {
        window.removeEventListener('click', handleClickOutside);
      };
    }, []); 
    const columns = [
        { field: "downPayment", label: "Amount Payed" },
         { field: "paymentPayed", label: "Total Payed Amount" },
        { field: "remaining", label: "Remaining" },
        {field: "createdAt", label: "Date", format: "date"},
        {field: "createdAt", label: "Time", format: "time"}
      ];
    return(
        <>
      <MetaData title="QE ~~SaleCredit" />
      <div className={`Sale ${colorTheme}`}>
        <div className="secondContainer">
          <div className="saleProduct-box">
            <Button
              positive
              onClick={back}
            >
              Back
            </Button>
            <Button
            className="printButton"
              onClick={viewInvoice}
            >
              View Invoice
            </Button>
            {/* <ReactToPrint
              trigger={() => (
                <button className="printButton">
                  Print / Download
                </button>
              )}
              content={() => salesRef.current}
            /> */}
          </div>
          {/* <div className="previewCustomerRecordVisa-Inputfields-box"> */}
            <div className="saleCreditUpdateInputBox">
            <input
              label={"productCode"}
              type="Number"
              className="customerVisaInputField"
              placeholder={"Enter Initial Payment"}
              name="productCode"
              autoComplete="off"
              maxLength="40"
              value={initialPayments}
              disabled={singleSaleCreditRecord?.data?.paymentStatus === "Paid"}
              required
              onChange={handleDownPaymentValue}
              />
             <input
              label={"totalPayment"}
              type="Number"
              className="customerVisaInputField"
              placeholder={"Total Payed Payment"}
              name="productCode"
              autoComplete="off"
              maxLength="40"
              required
              value = {payedAmount}
              disabled
              />
                <input
              label={"productCode"}
              type="Number"
              className="customerVisaInputField"
              placeholder={"Remaining Payment"}
              name="productCode"
              autoComplete="off"
              maxLength="40"
             
              required
              value = {remains}
              disabled
              />
              <button className="customerVisaUpdateButton" 
              disabled={singleSaleCreditRecord?.data?.paymentStatus === "Paid"} onClick={updateCustomerVisa}>Update Record</button>
            </div>
            {/* </div> */}
          <div  className="previewTableContent"> 
            <div className="previewInvoice"  
              style={{  border: "2px solid black",
              margin: '10px',
              display: "flex",
              padding: "15px",
              paddingBottom: "0px",
              flexDirection: "column",
              alignItems: "center",
              }} >
                 <Dates data={singleSaleCreditRecord?.data}/>
                <PrintLaserTable
                     data={singleSaleCreditRecord?.data?.payments}
                     columns={columns}/>
              {/* <Header  />
              <Dates />
              <Tablee /> */}
            </div>
          </div>
          <div className="print-only-container">
            
          </div>
      </div>
    </div>
          
      
        </>
    )
}
export default PreviewSaleCredit