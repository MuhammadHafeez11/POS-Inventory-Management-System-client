import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import PageLoader from "../../../../Components/Loader/PageLoader"
import TableComponentId from "../../../../Components/tableComponent/tableComponentId"
import { useTranslation } from "react-i18next"
// import "../cashDeposit.css"
import "../../../../SaasStyling/_cashDeposit.scss"
import AsyncSelect from "react-select/async"
// import InvoiceDetailsModal from "./paymentWorkFlowTableModel";
import { getUsers } from "../../../../actions/userAction"
import { getShop } from "../../../../actions/shopAction"
import {
  getPaymentWorkFlow,
  getPaymentWorkFlowOnShop,
  getPaymentWorkFlowOnUser,
} from "../../../../actions/paymentWorkFlowAction"
import {
  getDepositPayment,
  getDepositPaymentForLoginUser,
  getDepositPaymentForShop,
  getDepositPaymentForUser,
} from "../../../../actions/depositAction"
const DepositPaymentTable = (props) => {
  const componentRef = useRef()
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const { paymentWorkFlow, paymentWorkFlowLoading } = useSelector((state) => state.paymentWorkFlow)
  const [dataLoading, setDataLoading] = useState(true)
  const [depositPaymentsData, setDepositPaymentsData] = useState()
  // const [salesRecord, setSalesRecord] = useState()
  // const [expenseRecord, setExpenseRecord] = useState()
  // const [depositByRecord, setDepositByRecord] = useState()
  // const [depositToRecord, setDepositToRecord] = useState()
  const [openModel, setOpenModel] = useState(false)
  const [selectedValue, setSelectedValue] = useState()
  const [usersDataList, setUsersDataList] = useState()
  const [shopDataList, setShopDataList] = useState()
  const [userName, setUserName] = useState()
  const [usersData, setUsersData] = useState()
  const [shopName, setShopName] = useState()
  const [shopValue, setShopValue] = useState()
  const [timePeriod, setTimePeriod] = useState()
  const { shop, loading } = useSelector((state) => state.shop)
  const { depositPayment, depositPaymentLoading } = useSelector((state) => state.depositPayment)
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
    if (!depositPaymentLoading) {
      console.log(depositPayment)
      setDepositPaymentsData(depositPayment)
      setDataLoading(false)
    }
  }, [depositPayment, depositPaymentLoading])

  const handleOpenModal = (item) => {
    setSelectedValue(item)
    setOpenModel(!openModel)
    console.log(item)
  }

  useEffect(() => {
    console.log("hfei")
    dispatch(getShop())
    getUserRecord()
  }, [])

  useEffect(() => {
    if (!loading && shop?.length > 0) {
      console.log(shop)
      setShopDataList(
        shop?.map((shops) => ({
          value: shops?._id,
          label: shops?.shopCode,
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
    dispatch(getDepositPaymentForShop(e.value))
    // setPaidTo(e.value)
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
    // setPaidTo(e.value)
    setUserName(e.label)
    dispatch(getDepositPaymentForUser(e.value))
  }

  const handleCloseModal = () => {
    setOpenModel(!openModel)
  }

  const handleClear = () => {
    setDataLoading(true)
    setShopName("")
    setUserName("")
    setTimePeriod("")
    if (user?.user?.roles?.roleName === "superAdmin" || user?.user?.roles?.roleName === "Administrator") {
      dispatch(getDepositPayment())
    } else {
      dispatch(getDepositPaymentForLoginUser())
    }
  }

  const handleTimePeriodChange = (e) => {
    setDataLoading(true)
    if (userName) {
      dispatch(getPaymentWorkFlowOnUser(userName, e.value))
    } else if (shopName) {
      dispatch(getPaymentWorkFlowOnShop(shopValue, e.value))
    } else {
      dispatch(getPaymentWorkFlow(e.value))
    }
    setTimePeriod(e.label)
  }

  const columns = [
    { field: "invoiceNo", label: t("InvoiceNo") },
    { field: "shop_id.shopCode", label: t("shop") },
    { field: "paidBy.name", label: t("PaidBy") },
    {
      field: "custom_paidTo",
      label: t("PaidTo"),
      render: (row) => {
        // Handle both old and new data structure
        if (row.status === "WithInOrganization" && row.paidTo) {
          return row.paidTo.name || "N/A"
        } else if (row.status === "OutsideOrganization" && row.paidToName) {
          return row.paidToName || "N/A"
        }
        //  else if (row.status === "WithInOrganization" && row.paidTo && row.paidTo.name) {
        //   // For backward compatibility with old data
        //   return row.paidTo.name
        // }
        return "N/A"
      },
    },
    { field: "status", label: t("status") },
    { field: "paymentMode", label: t("paymentMode") },
    { field: "amount", label: t("amount") },
    { field: "createdAt", label: t("date"), format: "date" },
    { field: "createdAt", label: t("time"), format: "time" },
  ]

  return (
    <>
      <div className="search-box">
        {(user?.user?.roles?.roleName === "superAdmin" || user?.user?.roles?.roleName === "Administrator") && (
          <>
            <div className="superSearchDiv">
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

              <button onClick={handleClear}>clear</button>
            </div>
          </>
        )}

        {user?.user?.roles?.roleName === "Admin" && (
          <>
            <div className="superSearchDiv">
              <AsyncSelect
                value={userName ? { label: userName } : { label: t("selectEmployee") }}
                loadOptions={usersDataList?.length > 0 && loadUserOptions}
                defaultOptions={usersDataList}
                onChange={handleUserChange}
              />

              <button onClick={handleClear}>clear</button>
            </div>
          </>
        )}
      </div>
      {/* <div className="CashDepositTableComponents"> */}
      {!dataLoading ? (
        <>
          <div className="table-container">
            <TableComponentId
              data={depositPaymentsData}
              columns={columns}
              // onRowClick={handleOpenModal}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <PageLoader />
          </div>
        </>
      )}
      {/* <div className="todaysBalance">
            <h6>Opening Balance: &nbsp;&nbsp;</h6>{paymentWorkFlow?.totals?.recentDayBalance?.balance} &nbsp;<h6>Closing Balance: &nbsp;&nbsp;</h6>{paymentWorkFlow?.totals?.todayBalance?.balance}
            </div> */}

      {/* </div> */}
    </>
  )
}

export default DepositPaymentTable
