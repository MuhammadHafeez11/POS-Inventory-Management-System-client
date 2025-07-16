// HistoryContext.js
import React, { createContext, useContext, useState } from 'react';
const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [previousPath, setPreviousPath] = useState(null);

  const updatePreviousPath = (path) => {
    setPreviousPath(path);
  };

  return (
    <HistoryContext.Provider value={{ previousPath, updatePreviousPath, setPreviousPath }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryContext = () => useContext(HistoryContext);
