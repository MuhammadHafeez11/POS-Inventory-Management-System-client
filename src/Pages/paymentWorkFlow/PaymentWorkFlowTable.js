import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import PageLoader from "../../Components/Loader/PageLoader"
import TableComponentId from "../../Components/tableComponent/tableComponentId"
import { useTranslation } from "react-i18next"
import AsyncSelect from "react-select/async"
import Select from "react-select"
import InvoiceDetailsModal from "./paymentWorkFlowTableModel"
import { getUsers } from "../../actions/userAction"
import { getShop } from "../../actions/shopAction"
import {
  getPaymentWorkFlow,
  getPaymentWorkFlowOnShop,
  getPaymentWorkFlowOnUser,
} from "../../actions/paymentWorkFlowAction"

const PaymentWorkFlowTable = (props) => {
  const componentRef = useRef()
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const { paymentWorkFlow, paymentWorkFlowLoading } = useSelector((state) => state.paymentWorkFlow)
  const [dataLoading, setDataLoading] = useState(true)
  const [singleRecord, setSingleRecord] = useState()
  const [salesRecord, setSalesRecord] = useState()
  const [purchaseRecord, setPurchaseRecord] = useState() // Added purchase state
  const [expenseRecord, setExpenseRecord] = useState()
  const [depositByRecord, setDepositByRecord] = useState()
  const [depositToRecord, setDepositToRecord] = useState()
  const [returnRecord, setReturnRecord] = useState()
  const [openModel, setOpenModel] = useState(false)
  const [selectedValue, setSelectedValue] = useState()
  const [usersDataList, setUsersDataList] = useState()
  const [shopDataList, setShopDataList] = useState()
  const [userName, setUserName] = useState()
  const [userValue, setUserValue] = useState()
  const [usersData, setUsersData] = useState()
  const [shopName, setShopName] = useState()
  const [shopValue, setShopValue] = useState()
  const [timePeriod, setTimePeriod] = useState()
  const { shop, loading } = useSelector((state) => state.shop)
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const timePeriodOptions = [
    { value: "today", label: "Today" },
    { value: "thisWeek", label: "Current Week" },
    { value: "thisMonth", label: "Current Month" },
    { value: "last3Months", label: "Last Three Months" },
    { value: "thisYear", label: "Current Year" },
    { value: "lastYear", label: "Last Year" },
  ]

  useEffect(() => {
    if (!paymentWorkFlowLoading) {
      console.log("paymentflow" + paymentWorkFlow)
      setSalesRecord(paymentWorkFlow?.totals?.sales)
      setPurchaseRecord(paymentWorkFlow?.totals?.purchases)
      setExpenseRecord(paymentWorkFlow?.totals?.expenses)
      setDepositByRecord(paymentWorkFlow?.totals?.depositsBy)
      setDepositToRecord(paymentWorkFlow?.totals?.depositsTo)
      setSingleRecord(paymentWorkFlow?.data?.transactions)
      setReturnRecord(paymentWorkFlow?.totals?.returns)
      setDataLoading(false)
    }
  }, [paymentWorkFlow, paymentWorkFlowLoading])

  const handleOpenModal = (item) => {
    setSelectedValue(item)
    setOpenModel(!openModel)
    console.log(item)
  }

  useEffect(() => {
    dispatch(getShop())
    getUserRecord()
  }, [])

  useEffect(() => {
    if (!loading && shop) {
      console.log(shop)
      setShopDataList(
        shop?.map((shops) => ({
          value: shops._id,
          label: shops.shopCode,
        })),
      )
    }
  }, [shop, loading])

  useEffect(() => {
    if (user?.user?.roles?.roleName === "Admin") {
      const data = usersData?.filter(
        (users) =>
          users?.shopNo?._id === user?.user?.shopNo?._id &&
          users?.roles?.roleName !== "Administrator" &&
          users?.roles?.roleName !== "superAdmin",
      )
      setUsersDataList(
        data?.map((users) => ({
          name: "users",
          value: users._id,
          label: users?.name,
        })),
      )
    }
  }, [usersData])

  const getUserRecord = async () => {
    const res = await getUsers()
    console.log(res)
    setUsersData(res)
  }

  const loadShopOptions = (search, callBack) => {
    setTimeout(() => {
      const filterOptions = shopDataList?.filter((option) => option?.label.toLowerCase().includes(search.toLowerCase()))
      console.log(filterOptions)
      callBack(filterOptions)
    }, 3000)
  }

  const handleShopChange = (e) => {
    setDataLoading(true)
    setUserName("")
    setShopName(e.label)
    setShopValue(e.value)
    const data = usersData?.filter((users) => users?.shopNo?._id === e.value && users?.roles?.roleName !== "superAdmin")
    setUsersDataList(
      data?.map((users) => ({
        name: "users",
        value: users._id,
        label: users?.name,
      })),
    )
    console.log(data)
    dispatch(getPaymentWorkFlowOnShop(e.value))
  }

  const loadUserOptions = (search, callBack) => {
    setTimeout(() => {
      const filterOptions = usersDataList?.filter((option) =>
        option?.label.toLowerCase().includes(search.toLowerCase()),
      )
      console.log(filterOptions)
      callBack(filterOptions)
    }, 3000)
  }

  const handleUserChange = (e) => {
    setDataLoading(true)
    setUserValue(e.value)
    setUserName(e.label)
    dispatch(getPaymentWorkFlowOnUser(e.value))
  }

  const handleCloseModal = () => {
    setOpenModel(!openModel)
  }

  const handleClear = () => {
    setDataLoading(true)
    setShopName("")
    setUserName("")
    setTimePeriod("")
    dispatch(getPaymentWorkFlow())
  }

  const handleTimePeriodChange = (e) => {
    setDataLoading(true)
    console.log(userName, e.value)
    if (userName) {
      dispatch(getPaymentWorkFlowOnUser(userValue, e.value))
    } else if (shopName) {
      dispatch(getPaymentWorkFlowOnShop(shopValue, e.value))
    } else {
      dispatch(getPaymentWorkFlow(e.value))
    }
    setTimePeriod(e.label)
  }

  const columns = [
    { field: "type", label: t("Type") },
    { field: "invoiceNumber", label: t("invoiceNumber") },
    { field: "beneficiary", label: t("payee") },
    { field: "payee", label: t("beneficiary") },
    { field: "status", label: t("status") },
    { field: "amount", label: t("amount") },
    { field: "date", label: t("Date"), format: "date" },
    { field: "date", label: t("time"), format: "time" },
  ]

  return (
    <>
      <div className="search-box">
        {(user?.user?.roles?.roleName === "superAdmin" || user?.user?.roles?.roleName === "Administrator") && (
          <>
            <AsyncSelect
              value={shopName ? { label: shopName } : { label: t("selectShop") }}
              loadOptions={shopDataList?.length > 0 && loadShopOptions}
              defaultOptions={shopDataList}
              onChange={handleShopChange}
            />

            <AsyncSelect
              placeholder={"Select Employee Name"}
              value={userName ? { label: userName } : { label: t("selectEmployee") }}
              loadOptions={usersDataList?.length > 0 && loadUserOptions}
              defaultOptions={usersDataList}
              onChange={handleUserChange}
            />

            <Select
              value={timePeriod ? { label: timePeriod } : { label: t("selectDuration") }}
              options={timePeriodOptions}
              onChange={handleTimePeriodChange}
            />

            <button className="buttonClearPaymentFlow" onClick={handleClear}>
              clear
            </button>
          </>
        )}

        {user?.user?.roles?.roleName === "Admin" && (
          <>
            <AsyncSelect
              placeholder={"Select Employee Name"}
              value={userName ? { label: userName } : { label: t("selectEmployee") }}
              loadOptions={usersDataList?.length > 0 && loadUserOptions}
              defaultOptions={usersDataList}
              onChange={handleUserChange}
            />

            <Select
              value={timePeriod ? { label: timePeriod } : { label: t("selectDuration") }}
              options={timePeriodOptions}
              onChange={handleTimePeriodChange}
            />

            <button className="buttonClearPaymentFlow" onClick={handleClear}>
              {t("clear")}
            </button>
          </>
        )}
      </div>

      <div className="todaysBalance">
        <h6>Opening Balance: &nbsp;&nbsp;</h6>
        {paymentWorkFlow?.totals?.recentDayBalance?.balance} &nbsp;<h6>Closing Balance: &nbsp;&nbsp;</h6>
        {paymentWorkFlow?.totals?.todayBalance?.balance}
      </div>

      {!dataLoading ? (
        <>
          <div className="table-container">
            <TableComponentId data={singleRecord} columns={columns} onRowClick={handleOpenModal} />
            {openModel && (
              <>
                <InvoiceDetailsModal
                  open={openModel}
                  handleClose={handleCloseModal}
                  record={selectedValue}
                  sales={salesRecord?.records}
                  purchase={purchaseRecord?.records} 
                  depositedBy={depositByRecord?.records}
                  expense={expenseRecord?.records}
                  depositTo={depositToRecord?.records}
                  returns={returnRecord?.records}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div>
            <PageLoader />
          </div>
        </>
      )}
    </>
  )
}

export default PaymentWorkFlowTable
