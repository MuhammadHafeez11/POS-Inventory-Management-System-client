// DocumentTypeForm.js
import React, { useEffect, useState } from 'react';
import swal from 'sweetalert2';
import AsyncSelect from "react-select/async"
import { useTranslation } from "react-i18next";
import { getUsers } from '../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { postExpensePayement } from '../../actions/expensePaymentAction';
const ExpenseCashForm = ({ onAdd }) => {
  const [payment, setPayment] = useState();
  const [user_id, setUser_id] = useState()
  const { t, i18n } = useTranslation();
  const [usersDataList, setUsersDataList] = useState()
  const {expensePaymentPost, expensePaymentPostLoading, expensePaymentPostError} = useSelector((state)=> state.expensePaymentPost)

  const dispatch = useDispatch()
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(postExpensePayement(user_id, payment, payment, payment))
    // onAdd();
    // setDocumentType(''); // Clear the input after adding
  };

   useEffect(()=>{
    if(!expensePaymentPostLoading && expensePaymentPost)
    {
      console.log('fei')
      successMessage(expensePaymentPost?.message)
    }
   
  }, [expensePaymentPost, expensePaymentPostLoading])

  const successMessage = (message) =>{
    return swal.fire({
      icon: "success",
      title: t("titleSuccess"),
      text: message,
      showConfirmButton: false,
      timer: 2000,
      customClass: {
        popup: "custom-swal-popup", // This is the custom class you're adding
      },
    });
  }

  useEffect(()=>{
    if(!expensePaymentPostLoading && expensePaymentPostError)
    {
     
    }
   
  }, [expensePaymentPostError, expensePaymentPostLoading])


  const handleUserChange = (e) => {
    setUser_id(e.value)
    }

  useEffect(()=>{
    getUserRecord()
  }, [])

  const getUserRecord = async() => {
    const res = await getUsers()
    console.log(res)
    setUsersDataList(res?.map(users =>({
            name:"users",
            value: users._id,
            label: users?.name
          })))
  }
  // useEffect(()=>{
  //   console.log(documentTypeRecord)
  //   if(documentTypeRecord?.success && !documentTypeRecordLoading)
  //   {
  //     setUsersDataList(documentTypeRecord?.documentTypeData?.map(documentype =>({
  //       name:"documentTypeId",
  //       value: documentype._id,
  //       label: documentype?.documentTypeName
  //     })))
  //   }
  // }, [documentTypeRecord])

  const loadDocumentTypeOptions = (search, callBack) => {
    // console.log('ajfe')
    // console.log()
  
    setTimeout(()=>{
      const filterOptions = usersDataList?.filter(option=> option?.label.toLowerCase().includes(search.toLowerCase()))
      console.log(filterOptions)
      callBack(filterOptions)
    }, 3000)
  }

  return (
    <form onSubmit={handleSubmit}>
    
      <label htmlFor="document-type-input">Add Cash</label>
      <div className='documentType'>
      <div className="drop">
      <AsyncSelect placeholder={'Select Employee Name'}
                loadOptions={usersDataList?.length > 0 && loadDocumentTypeOptions}
                defaultOptions={usersDataList} onChange={handleUserChange} />
      </div>
      <input
        id="document-type-input"
        type="numbers"
        placeholder='Enter Amount'
        value={payment}
        onChange={(e) => setPayment(e.target.value)}
      />
      <button className='buttons' type="submit">Add</button>
      </div>
    </form>
  );
};

export default ExpenseCashForm;
