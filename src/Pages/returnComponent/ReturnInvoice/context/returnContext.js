import { createContext, useState } from "react"

export const ReturnStatee = createContext()

export const ReturnStateProvider = ({ children }) => {
  const [returnId, setReturnId] = useState("")
  const [returnRef, setReturnRef] = useState()

  return (
    <ReturnStatee.Provider
      value={{
        returnId,
        setReturnId,
        returnRef,
        setReturnRef,
      }}
    >
      {children}
    </ReturnStatee.Provider>
  )
}
