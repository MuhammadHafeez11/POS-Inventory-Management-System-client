"use client"

import { useEffect } from "react"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import { useTranslation } from "react-i18next"
import { refreshTokken } from "../../actions/userAction"
import { useNavigate } from "react-router-dom"
import TableToExcel from "../tableComponent/tableToExcelTable"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import { Button, Dropdown, Select } from "semantic-ui-react"
import TableComponentId from "../tableComponent/tableComponentId"
import ClearAllIcon from "@mui/icons-material/ClearAll"
import PrintIcon from "@mui/icons-material/Print"
import PageLoader from "../Loader/PageLoader"
import { FaSearchengin } from "react-icons/fa6"
import { FaBarcode } from "react-icons/fa6"

const InventoryTable = ({
  title,
  recordCount,
  downloadXLSPermission,
  AddItemPermission,
  navigateLinks,
  isLoading,
  data,
  actions,
  onFilterChange,
  filters,
  filterFields,
  tableColumns,
  tableToExcelColumns,
  actionLinks,
  printPermissions,
  handleBeforePrint,
  handleAfterPrint,
  componentRef,
  handleSearch,
  handleClear,
  clearButton,
  searchButton,
  selectedShop,
  selectedGodown,
  // Add these new props for multi-barcode selection
  showMultiSelectUI = false,
  enableMultiSelectFeature = false,
  selectedProducts = [],
  handleProductSelect,
  handleGenerateMultipleBarcodes,
  toggleMultiSelectMode,
  handleSelectAll
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    console.log(data)
    getToken()
  }, [])

  const getToken = async () => {
    const token = await refreshTokken()
    if (token?.data === "Please login to acces this resource") {
      navigate("/login")
    }
    console.log(token)
  }

  return (
    <div className="secondContainer">
      <div className="contentt-box">
        <div className="heading-container">
          <h3>{`${title}`}</h3>
          <h5>
            <span className="total-records">
              {t(`totalRecords`)} <EventAvailableIcon fontSize="small" />
            </span>
            <span className="rowCount">{recordCount}</span>
          </h5>
        </div>
        <div className="excelDiv">
          {data?.length > 0 && downloadXLSPermission && (
            <>
              <TableToExcel className="button-styled" data={data} columns={tableToExcelColumns} />
            </>
          )}
          {AddItemPermission && (
            <button
              className="button-styled"
              variant="outlined"
              endIcon={<AddOutlinedIcon fontSize="small" color="error" />}
              onClick={() => {
                console.log(navigateLinks.addItem)
                navigate(`${navigateLinks.addItem}`)
              }}
            >
              {t("addItem")}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="search-box">
        {filterFields.map((field) =>
          field.type === "text" ? (
            <input
              key={field.name}
              type="text"
              name={field.name}
              placeholder={field.placeholder}
              value={filters[field.name]}
              onChange={onFilterChange}
            />
          ) : field.type === "select" ? (
            <Dropdown
              key={field.name}
              control={Select}
              placeholder={t(`${field.placeholder}`)}
              // className="productLocationDropdown"
              fluid
              selection
              value={filters[field.name]}
              options={field.options.map((option) => ({
                key: option,
                text: option,
                value: option,
              }))}
              onChange={(e, data) => {
                // Call onFilterChange and pass the field name and value
                onFilterChange({
                  target: { name: data.name, value: data.value },
                })
              }}
              name={field.name}
            />
          ) : field.type === "categoryOptions" ? (
            <Dropdown
              key={field.name}
              control={Select}
              placeholder={t(`${field.placeholder}`)}
              // className="productLocationDropdown"
              fluid
              selection
              value={filters[field.name]}
              options={field.options}
              onChange={(e, data) => {
                // Call onFilterChange and pass the field name and value
                onFilterChange({
                  target: { name: data.name, value: data.value },
                })
              }}
              name={field.name}
            />
          ) : field.type === "shopSelect" && selectedShop ? (
            <Dropdown
              key={field.name}
              control={Select}
              placeholder={t(`${field.placeholder}`)}
              // className="productLocationDropdown"
              fluid
              selection
              value={filters[field.name]}
              options={field.options.map((option) => ({
                key: option.shopCode,
                text: option.shopCode,
                value: option._id,
              }))}
              onChange={(e, data) => {
                // Call onFilterChange and pass the field name and value
                onFilterChange({
                  target: { name: data.name, value: data.value },
                })
              }}
              name={field.name}
            />
          ) : field.type === "godownSelect" && selectedGodown ? (
            <Dropdown
              key={field.name}
              control={Select}
              placeholder={t(`${field.placeholder}`)}
              // className="productLocationDropdown"
              fluid
              selection
              value={filters[field.name]}
              options={field.options.map((option) => ({
                key: option.storageCode,
                text: option.storageCode,
                value: option._id,
              }))}
              onChange={(e, data) => {
                // Call onFilterChange and pass the field name and value
                onFilterChange({
                  target: { name: data.name, value: data.value },
                })
              }}
              name={field.name}
            />
          ) : field.type === "productCode" ? (
            <Dropdown
              key={field.name}
              control={Select}
              placeholder={t(`${field.placeholder}`)}
              // className="productLocationDropdown"
              fluid
              selection
              search
              value={filters[field.name]}
              options={field?.options?.map((option) => ({
                key: option.productCode,
                text: option.productCode,
                value: option.productCode,
              }))}
              onChange={(e, data) => {
                // Call onFilterChange and pass the field name and value
                onFilterChange({
                  target: { name: data.name, value: data.value },
                })
              }}
              name={field.name}
            />
          ) : null,
        )}
        {searchButton && (
          <>
            <Button className="buttonProductLocation" onClick={handleSearch}>
              {t("search")}&nbsp;&nbsp;{<FaSearchengin />}
            </Button>
          </>
        )}
        {clearButton && (
          <>
            <Button className="buttonProductLocation" onClick={handleClear}>
              {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
            </Button>
          </>
        )}

        {printPermissions && (
          <Button variant="outlined" color="error" onClick={handleBeforePrint} className="buttonProductLocation">
            {t("print")}&nbsp;&nbsp;
            <PrintIcon />
          </Button>
        )}
        { enableMultiSelectFeature
        &&
        <Button onClick={toggleMultiSelectMode} className="buttonProductLocation">
            {showMultiSelectUI ? t("cancelMultiSelect") : t("enableMultiSelect")}
          </Button>
          }
        {/* Add Generate Multiple Barcodes button - only visible when products are selected */}
        {enableMultiSelectFeature
        &&showMultiSelectUI && selectedProducts.length > 0 && (
          <Button
            variant="outlined"
            // color="primary"
            onClick={handleGenerateMultipleBarcodes}
            className="buttonProductLocation"
          >
             {t("generateMultipleBarcodes")} {/*({selectedProducts.length})&nbsp;&nbsp; */}
            {/* <FaBarcode /> */}
          </Button>
        )}
      </div>
      <div className="table-container">
        {!isLoading ? (
          <>
            <TableComponentId
              data={data}
              columns={tableColumns}
              actions={actions}
              linkk={actionLinks?.action1}
              actionUpdate={actionLinks?.action2}
              action3={actionLinks?.action3}
              link2={actionLinks?.action4}
              action1={actionLinks?.action5}
              // Add these new props for multi-barcode selection
              showMultiSelectUI={showMultiSelectUI}
              selectedProducts={selectedProducts}
              handleProductSelect={handleProductSelect}
              handleSelectAll={handleSelectAll}
            />
          </>
        ) : (
          <>
            <PageLoader />
          </>
        )}
      </div>
    </div>
  )
}

export default InventoryTable

// import { useEffect } from "react"
// import EventAvailableIcon from "@mui/icons-material/EventAvailable"
// import { useTranslation } from "react-i18next"
// import { refreshTokken } from "../../actions/userAction"
// import { useNavigate } from "react-router-dom"
// import TableToExcel from "../tableComponent/tableToExcelTable"
// import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
// import { Button, Dropdown, Select } from "semantic-ui-react"
// import TableComponentId from "../tableComponent/tableComponentId"
// import ClearAllIcon from "@mui/icons-material/ClearAll"
// import PrintIcon from "@mui/icons-material/Print"
// import PageLoader from "../Loader/PageLoader"
// import { FaSearchengin } from "react-icons/fa6"

// const InventoryTable = ({
//   title,
//   recordCount,
//   downloadXLSPermission,
//   AddItemPermission,
//   navigateLinks,
//   isLoading,
//   data,
//   actions,
//   onFilterChange,
//   filters,
//   filterFields,
//   tableColumns,
//   tableToExcelColumns,
//   actionLinks,
//   printPermissions,
//   handleBeforePrint,
//   handleAfterPrint,
//   componentRef,
//   handleSearch,
//   handleClear,
//   clearButton,
//   searchButton,
//   selectedShop,
//   selectedGodown,
// }) => {
//   const { t, i18n } = useTranslation()
//   const navigate = useNavigate()

//   useEffect(() => {
//     console.log(data)
//     getToken()
//   }, [])

//   const getToken = async () => {
//     const token = await refreshTokken()
//     if (token?.data === "Please login to acces this resource") {
//       navigate("/login")
//     }
//     console.log(token)
//   }

//   return (
//     <div className="secondContainer">
//       <div className="contentt-box">
//         <div className="heading-container">
//           <h3>{`${title}`}</h3>
//           <h5>
//             <span className="total-records">
//               {t(`totalRecords`)} <EventAvailableIcon fontSize="small" />
//             </span>
//             <span className="rowCount">{recordCount}</span>
//           </h5>
//         </div>
//         <div className="excelDiv">
//           {data?.length > 0 && downloadXLSPermission && (
//             <>
//               <TableToExcel className="button-styled" data={data} columns={tableToExcelColumns} />
//             </>
//           )}
//           {AddItemPermission && (
//             <button
//               className="button-styled"
//               variant="outlined"
//               endIcon={<AddOutlinedIcon fontSize="small" color="error" />}
//               onClick={() => {
//                 console.log(navigateLinks.addItem)
//                 navigate(`${navigateLinks.addItem}`)
//               }}
//             >
//               {t("addItem")}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="search-box">
//         {filterFields.map((field) =>
//           field.type === "text" ? (
//             <input
//               key={field.name}
//               type="text"
//               name={field.name}
//               placeholder={field.placeholder}
//               value={filters[field.name]}
//               onChange={onFilterChange}
//             />
//           ) : field.type === "select" ? (
//             <Dropdown
//               key={field.name}
//               control={Select}
//               placeholder={t(`${field.placeholder}`)}
//               // className="productLocationDropdown"
//               fluid
//               selection
//               value={filters[field.name]}
//               options={field.options.map((option) => ({
//                 key: option,
//                 text: option,
//                 value: option,
//               }))}
//               onChange={(e, data) => {
//                 // Call onFilterChange and pass the field name and value
//                 onFilterChange({
//                   target: { name: data.name, value: data.value },
//                 })
//               }}
//               name={field.name}
//             />
//           ) : field.type === "categoryOptions" ? (
//             <Dropdown
//               key={field.name}
//               control={Select}
//               placeholder={t(`${field.placeholder}`)}
//               // className="productLocationDropdown"
//               fluid
//               selection
//               value={filters[field.name]}
//               options={field.options}
//               onChange={(e, data) => {
//                 // Call onFilterChange and pass the field name and value
//                 onFilterChange({
//                   target: { name: data.name, value: data.value },
//                 })
//               }}
//               name={field.name}
//             />
//           ) : field.type === "shopSelect" && selectedShop ? (
//             <Dropdown
//               key={field.name}
//               control={Select}
//               placeholder={t(`${field.placeholder}`)}
//               // className="productLocationDropdown"
//               fluid
//               selection
//               value={filters[field.name]}
//               options={field.options.map((option) => ({
//                 key: option.shopCode,
//                 text: option.shopCode,
//                 value: option._id,
//               }))}
//               onChange={(e, data) => {
//                 // Call onFilterChange and pass the field name and value
//                 onFilterChange({
//                   target: { name: data.name, value: data.value },
//                 })
//               }}
//               name={field.name}
//             />
//           ) : field.type === "godownSelect" && selectedGodown ? (
//             <Dropdown
//               key={field.name}
//               control={Select}
//               placeholder={t(`${field.placeholder}`)}
//               // className="productLocationDropdown"
//               fluid
//               selection
//               value={filters[field.name]}
//               options={field.options.map((option) => ({
//                 key: option.storageCode,
//                 text: option.storageCode,
//                 value: option._id,
//               }))}
//               onChange={(e, data) => {
//                 // Call onFilterChange and pass the field name and value
//                 onFilterChange({
//                   target: { name: data.name, value: data.value },
//                 })
//               }}
//               name={field.name}
//             />
//           ) : field.type === "productCode" ? (
//             <Dropdown
//               key={field.name}
//               control={Select}
//               placeholder={t(`${field.placeholder}`)}
//               // className="productLocationDropdown"
//               fluid
//               selection
//               search
//               value={filters[field.name]}
//               options={field?.options?.map((option) => ({
//                 key: option.productCode,
//                 text: option.productCode,
//                 value: option.productCode,
//               }))}
//               onChange={(e, data) => {
//                 // Call onFilterChange and pass the field name and value
//                 onFilterChange({
//                   target: { name: data.name, value: data.value },
//                 })
//               }}
//               name={field.name}
//             />
//           ) : null,
//         )}
//         {searchButton && (
//           <>
//             <Button className="buttonProductLocation" onClick={handleSearch}>
//               {t("search")}&nbsp;&nbsp;{<FaSearchengin />}
//             </Button>
//           </>
//         )}
//         {clearButton && (
//           <>
//             <Button className="buttonProductLocation" onClick={handleClear}>
//               {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
//             </Button>
//           </>
//         )}

//         {printPermissions && (
//           <Button variant="outlined" color="error" onClick={handleBeforePrint} className="buttonProductLocation">
//             {t("print")}&nbsp;&nbsp;
//             <PrintIcon />
//           </Button>
//         )}
//       </div>
//       <div className="table-container">
//         {!isLoading ? (
//           <>
//             <TableComponentId
//               data={data}
//               columns={tableColumns}
//               actions={actions}
//               linkk={actionLinks?.action1}
//               actionUpdate={actionLinks?.action2}
//               action3={actionLinks?.action3}
//               link2={actionLinks?.action4}
//               action1={actionLinks?.action5}
//             />
//           </>
//         ) : (
//           <>
//             <PageLoader />
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default InventoryTable
