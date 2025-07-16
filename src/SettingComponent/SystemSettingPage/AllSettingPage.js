import { useState, useEffect } from "react"
import { BsDot } from "react-icons/bs"
import { useTranslation } from "react-i18next"
import { Loader } from "semantic-ui-react"
import { getAllPrinters, getSinglePrinter, updatePrinterStatus } from "../../actions/printerSettingAction"
import { useSelector, useDispatch } from "react-redux"
import { getLoadUser, updatePrinterStatusId, updateTableRowsId, loadUser } from "../../actions/userAction"
import { getAllTableSetting, getSingleTableRecord, postTableRows } from "../../actions/tableSettingAction"
import PageLoader from "../../Components/Loader/PageLoader"

const AllSettingPage = () => {
  // Language and theme states
  const [showThirdDiv, setShowThirdDiv] = useState(false)
  const [dataToShow, setDataToShow] = useState("")
  const [colorTheme, setColorTheme] = useState("theme-white")
  
  // Printer states (refactored)
  const [printers, setPrinters] = useState([])
  const [selectedOption, setSelectedOption] = useState("")
  const [optionSelected, setOptionSelected] = useState(false)
  const [printerLoadUser, setPrinterLoadUser] = useState(null)

  // Table settings states
  const [showAddRowInput, setShowAddRowInput] = useState(false)
  const [newRowValue, setNewRowValue] = useState("")
  const [tableRows, setTableRows] = useState([])
  const [tableDefaultOption, setTableDefaultOption] = useState(null)
  const [tableSelectedOption, setTableSelectedOption] = useState("")
  const [tableOptionSelected, setTableOptionSelected] = useState(false)

  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()

  const languageOptions = [
    { key: "en", value: "en", text: "English" },
    { key: "ur", value: "ur", text: "Urdu" },
  ]

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem("lang", lng)
  }

  // Theme effect
  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color")
    if (currentThemeColor) {
      setColorTheme(currentThemeColor)
      document.body.className = currentThemeColor
      document.body.style.backgroundColor = currentThemeColor
    }
  }, [])
  
  // Table settings effect
  useEffect(() => {
    getTableRowsFromDatabase()
  }, [])
  
  // Printer effect
  useEffect(() => {
    getPrintersFromDatabase()
  }, [])

  // Printer functions (refactored to use state)
  const getPrintersFromDatabase = async () => {
    const loadUserData = await getLoadUser()
    setPrinterLoadUser(loadUserData)
    const allPrinters = await getAllPrinters()
    setPrinters(allPrinters)
    const singlePrinter = await getSinglePrinter(loadUserData?.data?.user?.printerId?._id)
    const defaultPrinter = allPrinters?.find(
      (data) => data.status === "active" && data?._id === singlePrinter?._id
    )
    if (defaultPrinter) {
      setSelectedOption(defaultPrinter.printerType)
      setOptionSelected(true)
    }
  }

  const handleOptionChange = async (event) => {
    const selectedValue = event.target.value
    setSelectedOption(selectedValue)
    setOptionSelected(true)
    const selectedPrinter = printers.find(
      (data) => data.printerType === selectedValue
    )
    if (selectedPrinter && printerLoadUser) {
      await updatePrinterStatusId(printerLoadUser?.data?.user?._id, selectedPrinter?._id)
      await updatePrinterStatus(selectedPrinter?._id)
      // Optionally, re-fetch printer data if needed:
      await getPrintersFromDatabase()
    }
    dispatch(loadUser())
  }

  // Theme function
  const handleClick = async (theme) => {
    setColorTheme(theme)
    document.body.style.backgroundColor = theme
    localStorage.setItem("theme-color", theme)
    window.location.reload()
  }

  // Table settings functions
  const getTableRowsFromDatabase = async () => {
    const loadUserData = await getLoadUser()
    const tableResp = await getAllTableSetting()
    const singleTableRecord = await getSingleTableRecord(loadUserData?.data?.user?.tableRows?._id)
    console.log(loadUserData?.data?.user?.tableRows?._id)
    
    const defaultOpt = tableResp?.find((data) => data?._id === singleTableRecord?._id)
    if (defaultOpt) {
      setTableSelectedOption(defaultOpt.noOfRows.toString())
      setTableDefaultOption(defaultOpt)
      setTableOptionSelected(true)
    }
    setTableRows(tableResp)
  }

  const handleTableOptionChange = async (event) => {
    const value = event.target.value
    setTableSelectedOption(value)
    setTableOptionSelected(true)
    const selectedRow = tableRows.find((data) => data.noOfRows === Number.parseInt(value))
    if (selectedRow) {
      await updateTableRowsId(user?.user?._id, selectedRow?._id)
      // Optionally, you can re-fetch table settings if needed:
      // await getTableRowsFromDatabase();
    }
  }

  const handleAddNewRow = async () => {
    if (newRowValue) {
      await postTableRows(newRowValue)
      setNewRowValue("")
      setShowAddRowInput(false)
      getTableRowsFromDatabase()
    }
  }

  const handleFirstDivClick = () => {
    setShowThirdDiv(!showThirdDiv)
    setDataToShow("Data to show in the third div")
  }

  return (
    <div className={`settingSecondContainer`}>
      <div className="settings-layout">
        <div className="settings-left-panel">
          {/* Language Settings */}
          <div className="settings-section">
            <div className="DropdownDiv">
              <BsDot />
              <p>{t('PreferredLanguage')}</p>
            </div>
            <div className="language-options">
              <div
                className={`language-option ${i18n.language === "en" ? "active" : ""}`}
                onClick={() => changeLanguage("en")}
              >
                English
              </div>
              <div
                className={`language-option ${i18n.language === "ur" ? "active" : ""}`}
                onClick={() => changeLanguage("ur")}
              >
                Urdu
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="settings-section">
            <div className="DropdownDiv">
              <BsDot />
              <p>{t("Select Theme")}</p>
            </div>
            <div className="theme-container">
              <div
                id="theme-gradient"
                onClick={() => handleClick("theme-gradient")}
                className={`${colorTheme === "theme-gradient" ? "active" : ""}`}
              />
              <div
                id="theme-white"
                onClick={() => handleClick("theme-white")}
                className={`${colorTheme === "theme-white" ? "active" : ""}`}
              />
              <div
                id="theme-blue"
                onClick={() => handleClick("theme-blue")}
                className={`${colorTheme === "theme-blue" ? "active" : ""}`}
              />
            </div>
          </div>

          {/* Printer Settings */}
          <div className="settings-section">
            <div className="DropdownDiv">
              <BsDot />
              <p>{t("Select Printer")}</p>
            </div>
            {optionSelected ? (
              <div className="printer-options">
                {printers?.map((data) => (
                  <label key={data.printerType} className="radio-option">
                    <input
                      type="radio"
                      value={data.printerType}
                      checked={selectedOption === data.printerType}
                      onChange={handleOptionChange}
                    />
                    <span>{data.printerType}</span>
                  </label>
                ))}
              </div> 
            ) : (
              <div className="loaders-container">
                <Loader active inline="centered"/>
              </div>
            )}
          </div>
        </div>

        {/* Table Settings */}
        <div className="settings-right-panel">
          <div className="settings-section table-settings-section">
            <div className="DropdownDiv">
              <BsDot />
              <p>{t("Table Settings")}</p>
            </div>
            <div className="table-content">
              {tableOptionSelected ? (
                <div className="table-settings">
                  <div className="table-rows-options">
                    {tableRows.map((data) => (
                      <label key={data._id} className="radio-option">
                        <input
                          type="radio"
                          value={data.noOfRows.toString()}
                          checked={tableSelectedOption === data.noOfRows.toString()}
                          onChange={handleTableOptionChange}
                        />
                        <span>{data.noOfRows} Rows</span>
                      </label>
                    ))}
                  </div>
                  <div className="table-actions">
                    <button onClick={() => setShowAddRowInput(!showAddRowInput)} className="add-row-button">
                      {showAddRowInput ? "Cancel" : "Add New Row Option"}
                    </button>
                    {showAddRowInput && (
                      <div className="add-row-form">
                        <input
                          type="number"
                          placeholder="Enter number of rows"
                          value={newRowValue}
                          onChange={(e) => setNewRowValue(e.target.value)}
                        />
                        <button onClick={handleAddNewRow}>Add</button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="loader-container">
                  <PageLoader />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllSettingPage;

// import React, { useState, useEffect } from "react";
// import ChangeLanguage from "./changeLanguage";
// import LanguageSwitcher from "../../locales/localeDropDownOption/LanguageDropDown";
// import DarkMode from "../ThemeSetting/DarkMode";

// const LanguageSettingPage = () => {
//   const [showThirdDiv, setShowThirdDiv] = useState(false);
//   const [dataToShow, setDataToShow] = useState(""); // You can set the data here
//   const [colorTheme, setColorTheme] = useState("theme-white");
//   useEffect(() => {
//     const currentThemeColor = localStorage.getItem("theme-color");
//     console.log(localStorage.getItem("theme-color"));
//     if (currentThemeColor) {
//       setColorTheme(currentThemeColor);
//       document.body.className = currentThemeColor;
//     }
//   }, [colorTheme]);

//   const handleFirstDivClick = () => {
//     // Toggle the visibility of the third div and set data when the first div is clicked
//     setShowThirdDiv(!showThirdDiv);
//     setDataToShow("Data to show in the third div"); // Replace with your data
//   };

//   return (
//     <div className={`Permission ${colorTheme}`}>
//       <div className="settingSecondContainer">
//       {/* <div className="search-box">

//       </div> */}
//        <div className="customchange">
//       { <LanguageSwitcher />}
      
//       </div>
//       </div>
//     </div>
//   );
// };

// export default LanguageSettingPage;
