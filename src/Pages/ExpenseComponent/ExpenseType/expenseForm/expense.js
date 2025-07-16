import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, } from "semantic-ui-react";
import swal from "sweetalert2";
import MetaData from "../../../../MetaData";
import PageLoader from "../../../../Components/Loader/PageLoader"
import { useCustomState } from "../../../../Variables/stateVariables";
import { useTranslation } from "react-i18next";
import {
  getExpenses,
  postExpenseType,
} from "../../../../actions/expenseTypeAction";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { refreshTokken } from "../../../../actions/userAction";
import TableComponentId from "../../../../Components/tableComponent/tableComponentId";
let productMatch = "false";
let isCalled = "false";
const ExpenseForm = () => {
  const {
    expenseType,
    setExpenseType,
    expenseDescription,
    setExpenseDescription,
    guestExpenses,
    setGuestExpenses,
    billExpenses,
    setBillExpenses,
    otherExpenses,
    setOtherExpenses,
    total,
    setTotal,
  } = useCustomState();
  const [data, setData] = useState()
  const [loading, setLoading] = useState()
  const { t } = useTranslation();
  const [colorTheme, setColorTheme] = useState("theme-white");
  // const translationFunctions = useTranslationForFunctions();
  const navigate = useNavigate();

  useEffect(() => {
    isCalled = "false";
  }, [expenseType, expenseDescription]);

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true";
      getToken();
    }
  }, [isCalled]);
  const getToken = async () => {
    const token = await refreshTokken();
    if (token.data === "Please login to acces this resource") {
      navigate("/login");
    }
    console.log(token);
  };

  useEffect(() => {
    console.log("called");
    call();
  }, []);

  const call = async () => {
    console.log("call");
    const resp = await getExpenses();
    // console.warn(resp);
    setData(resp);
    setLoading(true);
  };

  useEffect(() => {
    productMatch = "false";
  });

  const backPage = async () => {
    navigate("/expense");
  };

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  const handleSubmit = async () => {
    const expenseData = await getExpenses();
    console.log(expenseData);

    if (!expenseType || !expenseDescription) {
      return swal.fire({
        icon: "error",
        title: t("titleError"),
        text: t("textAllFieldsAreRequired"),
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else {
      expenseData?.map((expnse) => {
        const expenseNam = expnse.expenseType
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase();
        if (
          expenseNam === expenseType.replace(/\s+/g, " ").trim().toLowerCase()
        ) {
          productMatch = "true";
        }
      });
    }
    if (productMatch === "true") {
      return swal.fire({
        icon: "error",
        title: t("titleError"),
        text: "Product Type is already Available",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else {
      const resp = await postExpenseType(expenseType, expenseDescription);
      console.log(resp);
      // console.warn(resp);
      navigate("/expense");
    }
  };

  const columns = [
    { field: "expenseType", label: t("expenseType") },
    { field: "expenseDescription", label: t("expenseDescription") },
  ];
  return (
    <>
      <MetaData title="QE ~~AddExpenseType" />
      <div className={`ExpenseType ${colorTheme}`}>
        <div className="secondContainer">
        <div className="contentt-box">
              <div className="heading-container">
                <h3>{t("Expense Type")}</h3>
              
              </div>
              </div>
        <div className="form">
          <div className="formRow">
            <div className="inputSection">
              <label>{t("expenseType")}</label>
              <input
                type="text"
                placeholder={t("enterExpenseType")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={expenseType}
                onChange={(e) => setExpenseType(e.target.value)}
              />
            </div>
            <div className="inputSection">
              <label>{t("expenseDescription")}</label>
              <input
                label={t("colorDescription")}
                type="text"
                placeholder={t("enterExpenseDescription")}
                name="productCode"
                autoComplete="off"
                maxLength="40"
                required
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
              />
            </div>
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
              onClick={handleSubmit}
              type="button"
              className={`button button-add-product `}
            >
              {t("add-expenses")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
          </div>
        </div>
        <div className="table-container">
        {loading ? (
          
            <TableComponentId
              data={data}
              columns={columns}
            />
          ) : (
            <PageLoader />
          )}
        </div>  </div>
      </div>
    </>
  );
};

export default ExpenseForm;
