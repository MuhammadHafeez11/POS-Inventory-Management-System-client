import React, { useEffect, useState } from "react";
import "./Updates.css";
import { UpdatesData } from "../Data/Data";
import { getRecentPurchase, getRecentSale } from "../../../actions/dashboardAction";
let data
const PurchaseUpdates = () => {
  const [dataAdded, setDataAdded]= useState(false)
  useEffect(()=>{
    call()
  }, [])

const call = async()=>{
   data = await getRecentPurchase()
  console.log(data)
  setDataAdded(true)
}
  return (
    <div className="Updates">
      {console.log(data)}
      {dataAdded && (<> {data?.map((datee)=>{
         return (
          <div className="update">
              {/* <div className="dot" /> */}
            <div className="noti">
              <div  style={{marginBottom: '0.5rem'}}>
                <span>{datee.name}</span>
                <span> {datee.noti}</span>
              </div>
                <span>{datee.time}</span>
            </div>
          </div>
        );
        
        
      })}
      </>)}
    </div>
  );
};

export default PurchaseUpdates;
