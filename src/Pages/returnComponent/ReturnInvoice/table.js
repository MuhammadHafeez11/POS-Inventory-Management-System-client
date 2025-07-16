import { useContext, useEffect, useState } from "react"
import PrintLaserTable from "../../../Components/tableComponent/printLaserTable"
import { getSpecificReturnProduct } from "../../../actions/returnProductAction"
import { useParams } from "react-router-dom"
import { ReturnStatee } from "./context/returnContext"

let quantity = []
let discount = []
let totalAmount = []
let taxAmount = []
let amount = []
let excludeTaxPrice = []

export default function Tablee({ selectedPrinter }) {
  const params = useParams()
  const action4 = "salesRecipt"
  let productsforlisting = []
  const [invoicedata, setInvoicedata] = useState([])
  const [productss, setProductss] = useState([""])
  const [loading, setLoading] = useState(false)

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
    console.log(result)
    setInvoicedata(result?.data)
    productsforlisting = result?.data?.products

    quantity = productsforlisting
      ?.reduce((sum, product) => sum + Number.parseInt(product.returnQuantity, 10), 0)
      .toString()
    discount = productsforlisting?.reduce((sum, product) => sum + Number.parseFloat(product.Discount), 0).toString()
    totalAmount = productsforlisting
      ?.reduce((sum, product) => sum + Number.parseFloat(product.totalAmounnt), 0)
      .toString()
    taxAmount = productsforlisting?.reduce((sum, product) => sum + Number.parseFloat(product.taxAmount), 0)?.toString()
    excludeTaxPrice = productsforlisting
      ?.reduce((sum, product) => sum + Number.parseFloat(product.excludeTaxPrice), 0)
      ?.toString()
    amount = productsforlisting?.reduce((sum, product) => sum + Number.parseFloat(product.amount), 0).toString()
    taxAmount = Number(taxAmount)
    taxAmount = taxAmount.toFixed(2)
    setProductss(result?.data?.products)
    setLoading(true)
  }

  const columns = [
    { field: "Code", label: "Code" },
    { field: "name", label: "Name" },
    { field: "color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "returnQuantity", label: "Quantity" },
    { field: "excludeTaxPrice", label: "MRP" },
    { field: "totalAmounnt", label: "Total" },
    { field: "Discount", label: "Discount" },
    { field: "taxAmount", label: "Tax" },
    { field: "amount", label: "Due Amount" },
  ]

  const columns1 = [
    { field: "Code", label: "Code" },
    { field: "name", label: "Name" },
    { field: "color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "returnQuantity", label: "Quantity" },
    { field: "excludeTaxPrice", label: "MRP" },
    { field: "totalAmounnt", label: "Total" },
    { field: "Discount", label: "Discount" },
    { field: "amount", label: "Due Amount" },
  ]

  return (
    <>
      {loading ? (
        <>
          <div className="printTable">
            {JSON.parse(localStorage.getItem("SoftwareWithFBR")) ? (
              <PrintLaserTable
                data={productss}
                columns={columns}
                action4={action4}
                ConsolidatedInvoiceTotalquantity={quantity}
                ConsolidatedInvoiceTotaldiscount={discount}
                ConsolidatedInvoiceTotaltotalPriceExculdingTax={totalAmount}
                ConsolidatedInvoiceTotaltotalTaxAmount={taxAmount}
                ConsolidatedInvoiceTotalIncludingAllPrices={amount}
                consolidateInvoiceExcludeTaxPrice={excludeTaxPrice}
              />
            ) : (
              <>
                <PrintLaserTable
                  data={productss}
                  columns={columns1}
                  action4={action4}
                  ConsolidatedInvoiceTotalquantity={quantity}
                  ConsolidatedInvoiceTotaldiscount={discount}
                  ConsolidatedInvoiceTotaltotalPriceExculdingTax={totalAmount}
                  ConsolidatedInvoiceTotaltotalTaxAmount={taxAmount}
                  ConsolidatedInvoiceTotalIncludingAllPrices={amount}
                  consolidateInvoiceExcludeTaxPrice={excludeTaxPrice}
                />
              </>
            )}
          </div>
          <div className="bottomGrand">
            <h2>Grand Total. {invoicedata?.total}</h2>
          </div>
        </>
      ) : (
        <h1></h1>
      )}
    </>
  )
}
