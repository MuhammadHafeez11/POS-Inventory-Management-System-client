import { useState, useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { COMPANYHEADER } from "../../../constants/companyNameContants"
import { getSpecificReturnProduct } from "../../../actions/returnProductAction"
import { ReturnStatee } from "./context/returnContext"

export default function Header({ selectedPrinter }) {
  const [storageAddress, setStorageAddress] = useState("")
  const [storagePhoneNo, setStoragePhoneNo] = useState("")
  const params = useParams()

  // Use context for modal, fallback to params for direct page access
  const { returnId } = useContext(ReturnStatee) || {}
  const currentId = returnId || params.id

  useEffect(() => {
    if (currentId) {
      getspecificDataforInvoice()
    }
  }, [currentId])

  const getspecificDataforInvoice = async () => {
    if (!currentId) return

    const result = await getSpecificReturnProduct(currentId)
    setStorageAddress(result?.data?.address)
    setStoragePhoneNo(result?.data?.phoneNo)
    console.log(result)
    console.log(result?.data?.phoneNo)
  }

  return (
    <>
      <div className="headerHeading">
        <h1 className="invoiceTitle">{COMPANYHEADER}</h1>
        <p className="invoiceAddress"> {storageAddress}</p>
        <p className="invoicePhoneNo">
          <p>
            Phone No:
            {storagePhoneNo}
          </p>
        </p>
      </div>
    </>
  )
}
