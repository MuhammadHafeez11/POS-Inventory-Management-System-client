import react, { useEffect, useContext, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import MetaData from '../../../../MetaData';
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { tableState } from "../../../../Components/tableComponent/tableContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button,  } from "@mui/material";
import { getDepositPayment, getDepositPaymentForLoginUser } from '../../../../actions/depositAction';
import DepositPaymentTable from './DepositPaymentsTable';
const DepositPayment= () =>{
    const dispatch = useDispatch()
    const { rowCount, setRowCount } = useContext(tableState);
    const [colorTheme, setColorTheme] = useState("theme-white");
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const {user} = useSelector((state)=> state.user)
    const {paymentWorkFlow, paymentWorkFlowLoading} = useSelector((state)=> state.paymentWorkFlow);

    useEffect(() => {
        const currentThemeColor = localStorage.getItem("theme-color");
        if (currentThemeColor) {
          setColorTheme(currentThemeColor);
        }
      }, [colorTheme]);
    useEffect(()=>{
      if(user)
      {
        if(user?.user?.roles?.roleName === "superAdmin" || user?.user?.roles?.roleName === "Administrator")
        {
          dispatch(getDepositPayment())
        }else{
          dispatch(getDepositPaymentForLoginUser())
        }
      }
    },[user])

    useEffect(()=>{
        console.log(paymentWorkFlow)
    }, [paymentWorkFlow])

    return( <>
        <MetaData title="QE ~~PaymentWorkFlow" />
        <div className={`CashDeposits ${colorTheme}`}>
            <>
            <div className="secondContainer">
              <div className="contentt-box">
                <div className="heading-container">
                  <h3>{t("cashDeposit")}</h3>
                  <h5>
                    <span className="total-records">
                      {t("totalRecords")}&nbsp;&nbsp;
                      <EventAvailableIcon fontSize="small" />
                    </span>
                    <span className="rowCount">{rowCount}</span>
                  </h5>
                </div>
                <div className="excelDiv">
                 
                {/* {addColorPermission && ( */}
                  <Button
                    className="button-styled" /* Apply the CSS class to the button */
                    variant="outlined"
                    color="error"
                    endIcon={<AddOutlinedIcon fontSize="small" color="error" />}
                    onClick={() => {
                      navigate("/depositForm");
                    }}
                  >
                    {t("add-Deposits")}
                  </Button>
                {/* )} */}
              </div>
              </div>
              <DepositPaymentTable />
              </div>
            </>
        </div>
      </>)
}
export default DepositPayment;