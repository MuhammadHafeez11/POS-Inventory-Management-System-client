import React, { useContext, useEffect, useState } from "react";
import MetaData from "../../../MetaData";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
 
} from "semantic-ui-react";
import swal from "sweetalert2";
import AsyncSelect from "react-select/async"
import { getUserdata} from "../../../actions/userAction"
import { Statee } from "./context/stateContext";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { getExpenses } from "../../../actions/expenseTypeAction";
import CameraComponent from "../../../WebCamera/webCam";
let expenseeType = [];
const ExpenseFormm = () => {
  const {
    expenses,
    setExpense,
    expenseType,
    setExpenseType,
    expenseDescription,
    setExpenseDescription,
    expenseAmount,
    setExpenseAmount,
    expenseTotal,
    setExpenseTotal,
    userName, setUserName,
    handleSubmitt,avatar, setAvatar
  } = useContext(Statee);
  const [cameraOpen, setCameraOpen] = useState()
  const [expenseTypeId, setExpenseTypeId] = useState()
  const [expenseTypeDataList, setExpenseTypeDataList] = useState()
  const [expenseTypee, setExpenseTypee] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [imagePath, setImagePath] = useState(null);
  const [image, setImage] = useState()
  const [usersData, setUsersData] = useState()
  

  const handleUserName = (event, {value}) => {
    setUserName(value)
  }
  const handleTypeSelectChange = (event, { value }) => {
    setExpenseType(value);
  };

  const backPage = async () => {
    navigate("/expensee");
  };
  useEffect(() => {
    callExpenseType();
    //  console.warn(expenseAmount)
  },[]);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  async function callExpenseType() {
    const userData = await getUserdata()
    console.log(userData)
    setUsersData(userData)
    expenseeType = await getExpenses();
    setExpenseTypee(expenseeType);
    console.log(expenseeType)
    setExpenseTypeDataList(expenseeType?.map(expensetype =>({
      name:"expenseType",
      value: expensetype.expenseType,
      label: expensetype?.expenseType
    })))
  }
  const addExpense = async () => {
    if (!expenseType || !expenseAmount) {
      swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("textExpenseAmountNOtNull"),
        confirmButtonText: "ok",
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else {
      handleSubmitt();
      navigate("/expensee");
    }
  };

  const handleExpenseTypeChange = (e) => {
    console.log(e)
    setExpenseType(e.value);
    setExpenseTypeId(e.value)
    }

  // useEffect(()=>{
  //   console.log(documentTypeRecord)
  //   if(documentTypeRecord?.success && !documentTypeRecordLoading)
  //   {
  //     setDocumentTypeDataList(documentTypeRecord?.documentTypeData?.map(documentype =>({
  //       name:"documentTypeId",
  //       value: documentype._id,
  //       label: documentype?.documentTypeName
  //     })))
  //   }
  // }, [documentTypeRecord])

  const loadExpenseTypeOptions = (search, callBack) => {
    console.log('ajfe')
    console.log(expenseTypeDataList)
  
    setTimeout(()=>{
      console.log(expenseTypeDataList)
      const filterOptions = expenseTypeDataList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      console.log(filterOptions)
      callBack(filterOptions)
    }, 3000)
  }

  const handleImageCapture = (imageSrc) => {
    setImagePath(imageSrc);  // Save the image source path to state
    setCameraOpen(false)
};

const cancelPicture = () => {
  setCameraOpen(false)
}


const handleImageValue = (e) =>{
  const file= e.target.files?.[0];
  console.log(file)
  const reader = new FileReader();
  if (file) {
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        // setPhotoPrev(reader.result);
        console.log('hfei')
        console.log(file)
        setAvatar(file);
      }
    };
  }
}
  return (
    <>
      <MetaData title="QE ~~AddExpense" />
      <div className={`Expense ${colorTheme}`}>
        <div className="secondContainer">
        <div className="form">
          {
            !cameraOpen ? (<>
       
            <div className="formRow">
            <div className="inputSection">
              <label>{t("expenseType")}</label>
              {/* */}
              <AsyncSelect 
                loadOptions={expenseTypeDataList?.length > 0 && loadExpenseTypeOptions}
                defaultOptions={expenseTypeDataList} onChange={handleExpenseTypeChange} />
              </div>
              <div className="inputSection">
              <label>{t("expenseAmount")}</label>
              <input
                type="number"
                placeholder={t("enterExpenseAmount")}
                name="productCode"
                autoComplete="off"
                maxLength="40"
                required
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>
            </div>
       
          <div className="formRow">
          <div className="inputSection">
              <label>{t("expenseDescription")}</label>
              <input
                type="text"
                placeholder={t("enterExpenseDescription")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
              />
            </div>
            {/* <div className="form1">
              <div className="pictureDiv">
              <button onClick={()=> setCameraOpen(true)}>
                Take Picture
            </button>
            <input 
            type="file"
            placeholder={t("enterExpenseDescription")}
            name="avatar"
            accept="image/*"
            // value={avatar}
            onChange={handleImageValue}
           
            />
              </div>
            
            </div> */}
          </div>
  
          <div className="buttonRow">
            <Button
              color={"green"}
              onClick={backPage}
              className="button button-back"
              type="button"
            >
              <ArrowBackIcon />
              &nbsp; &nbsp;&nbsp;{t("back")}
            </Button>
            <Button
              onClick={addExpense}
              type="button"
              className={`button button-add-product `}
            >
              {t("add-expenses")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
            {/* {showModalconfirm && <Showconfrm />} */}
          </div>
            </>) : (<>
              <CameraComponent onCapture={handleImageCapture} onCancelPicture = {cancelPicture} /> 
            </>)
          }
           </div>
        </div>
      </div>
    </>
  
  );
};

export default ExpenseFormm;
