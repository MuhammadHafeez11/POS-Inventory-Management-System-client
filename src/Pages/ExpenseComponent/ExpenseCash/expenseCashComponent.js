import React from 'react';
import { useState } from 'react';
import ExpenseCashForm from './expenseCashForm';
import ExpenseCashTable from './expenseCashTable';

const ExpenseCashComponent = () => {
  const [documentTypes, setDocumentTypes] = useState([]);

  const handleAddDocumentType = (type) => {
    setDocumentTypes([...documentTypes, type]);
  };

  return (
    <div >
      <ExpenseCashForm onAdd={handleAddDocumentType} />
      <ExpenseCashTable documentTypes={documentTypes} />
    </div>
  );
};

export default ExpenseCashComponent;