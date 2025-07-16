import react, { useEffect, useContext, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import MetaData from '../../MetaData';
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { getPaymentWorkFlow } from '../../actions/paymentWorkFlowAction'
import { tableState } from "../../Components/tableComponent/tableContext";
import { useTranslation } from "react-i18next";
import PaymentWorkFlowTable from './PaymentWorkFlowTable';
const PaymentWorkFlow= () =>{
    const dispatch = useDispatch()
    const { rowCount, setRowCount } = useContext(tableState);
    const [colorTheme, setColorTheme] = useState("theme-white");
    const { t, i18n } = useTranslation();
    const {paymentWorkFlow, paymentWorkFlowLoading} = useSelector((state)=> state.paymentWorkFlow);

    useEffect(() => {
        const currentThemeColor = localStorage.getItem("theme-color");
        if (currentThemeColor) {
          setColorTheme(currentThemeColor);
        }
      }, [colorTheme]);
    useEffect(()=>{
        dispatch(getPaymentWorkFlow())
    },[])

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
                  <h3>{t("cashFlow")}</h3>
                  <h5>
                    <span className="total-records">
                      {t("totalRecords")}&nbsp;&nbsp;
                      <EventAvailableIcon fontSize="small" />
                    </span>
                    <span className="rowCount">{rowCount}</span>
                  </h5>
                </div>
              </div>
              <PaymentWorkFlowTable />
              </div>
            </>
        </div>
      </>)
}
export default PaymentWorkFlow;