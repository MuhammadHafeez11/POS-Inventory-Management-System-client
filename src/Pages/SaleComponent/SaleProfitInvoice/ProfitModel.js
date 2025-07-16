import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { CSSTransition } from 'react-transition-group';
import PrintLaserTable from "../../../Components/tableComponent/printLaserTable";
import { MdOutlineClose } from "react-icons/md";
const Modal = ({ isOpen, onClose,modelTitle,columns, expenseColumns,  tableData, expenseTableData, commissionColumns, commissionTableData  }) => {
  const [data, setData] = useState(null);

  if (!isOpen) return null;

  return (

    <div className="modal">
      <div className="modal-content">
        <div className='buttonDiv'>
          <h1>{modelTitle}</h1>
            <button onClick={onClose}><MdOutlineClose /></button>
        </div>
        {/* <div className='modelHeadingContainer'>
          <h1>{modelTitle}</h1>
        </div> */}
        <div className='model-search-box'></div>
        <div className='modelTableContainer'>
          {
            modelTitle === "View Details" ?   
               (<> <PrintLaserTable data={tableData?.products}
                columns={columns}/> </>):( <>
                  {modelTitle === "View Expense Details"
               ? (<PrintLaserTable data={expenseTableData}
                    columns={expenseColumns}/> )
                        : <PrintLaserTable data={commissionTableData} columns = {commissionColumns} />}   
                </>)
          }
       
        </div>
      </div>
    </div>
  );
};

export default Modal;
