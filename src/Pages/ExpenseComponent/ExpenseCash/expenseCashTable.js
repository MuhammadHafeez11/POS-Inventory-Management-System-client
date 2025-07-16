import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import GenericTable from '../../Components/tableComponent/Generic Table/genericTableComponent';
import PageLoader from '../../Components/Loader/PageLoader';
import { getExpensePayment } from '../../actions/expensePaymentAction';

const ExpenseCashTable = () => {
const dispatch = useDispatch() 
  const [documentTypes, setDocumentTypes] = useState([]);
  const {expensePayment, expensePaymentLoading}= useSelector((state)=> state.expensePayment)
  const handleAddDocumentType = (type) => {
    setDocumentTypes([...documentTypes, type]);
  };

  useEffect(()=>{
    dispatch(getExpensePayment())
  }, [])

 
  const columns = React.useMemo(() => [
    {
      Header: 'Employee Name',
      accessor: 'user_id.name',
    },
    {
      Header: 'Available Amount',
      accessor: 'totalPaymentAmount',
    },
    // add other columns as needed
  ], []);

  const handleEditComplete =()=>{
    console.log('hi')
  }

  const handleDelete = async (itemToDelete) => {
   console.log(itemToDelete)
  };


  return (
    <div className='expenseCash'>
        {
            !expensePaymentLoading &&  expensePayment?.expensePaymentData?.length > 0 ? (
                <>
                {
                  <GenericTable
                  columns={columns}
                  data={expensePayment?.expensePaymentData}
                  onEditComplete={handleEditComplete}
                  onDelete={handleDelete}
                />
                  // console.log(documentTypeRecord?.documentTypeData)
                }
                
                {/* */}
                </>
            ) : (<PageLoader />  )
        }
        
    </div>
  );
};

export default ExpenseCashTable;