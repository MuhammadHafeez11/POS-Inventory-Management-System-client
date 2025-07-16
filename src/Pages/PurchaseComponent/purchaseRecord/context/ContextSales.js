import { createContext, useEffect, useRef, useState } from "react";

export const State = createContext();

export default function StateContext({ children }) {
  const [purchaseId, setPurchaseId] = useState("sss");

  const purchaseRef = useRef();
  const context = {
    purchaseId,
    setPurchaseId,
    purchaseRef,
  };

  return <State.Provider value={context}>{children}</State.Provider>;
}
