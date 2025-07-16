import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Dropdown, Select, Modal, Message } from "semantic-ui-react";
import swal from "sweetalert2";
// import { AddColor,getcolor,useTranslationForFunctions  } from "../../../Api";
import { useTranslation, initReactI18next } from "react-i18next";

import { useLocation } from "react-router-dom";
import MetaData from "../../../../MetaData";
import Stack from "@mui/material/Stack";
import { TextField, Typography, Box, ButtonGroup } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { getColor, postColor } from "../../../../actions/colorAction";
import { refreshTokken } from "../../../../actions/userAction";
import { Loader } from "semantic-ui-react";
import TableComponentId from "../../../../Components/tableComponent/tableComponentId";
import { SearchColorData, SearchPCTCodeData } from "../../../../Components/searchComponent/colorSearch/SearchColorData";
import PageLoader from "../../../../Components/Loader/PageLoader"
import { getPCTCodeCompany, getPCTCodeDescription, postPCTCodes } from "../../../../actions/pctCodeAction";
let colorrName;
let productMatch = "false";
let colors = [];
let isCalled = "false";
const PCTCodeForm = () => {
  // const translationFunctions = useTranslationForFunctions();
  const [colorName, setColorName] = useState();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [colorDescription, setColorDescription] = useState();
  const [productCompany, setProductCompany] = useState()
  const [producttType, setProducttType]= useState()
  const [pctCodeValue, setPCTCodeValue] = useState()
  const [pctCodeDescriptionValue, setPCTCodeDescriptionValue] = useState()
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation()
  
  const { pctCodeCompany } = useSelector((state) => state.pctCodeCompany);
  
  const { pctCodeDescriptionLoading, pctCodeDescription } = useSelector((state) => state.pctCodeDescription);
  const { productType } = useSelector((state) => state.productType);
  // const { color } = useSelector((state) => state.color);
  const { colorRes } = useSelector((state) => state.colorRes);
  const { pctCodeLoading, pctCode } = useSelector((state) => state.pctCode);
  const [colorRecord, setColorRecord] = useState()
  const [data, setData] = useState()
  const [colorLoading, setColorLoading] = useState()
  const backPage = async () => {
    navigate("/ViewPCTCodes");
  };

  const handleDescriptionSelectChange = (event, { value, options }) => {
    console.log(value)
    setPCTCodeDescriptionValue(value)
    // handleSearch(productCode, selectedOptions.text, productCompany)
  };

  const handleCompanySelectChange = (event, { value, options  }) => {
    console.log(value)
    setProductCompany(value)
    // handleSearch(productCode, producttType, selectedOption.text)
  };

  useEffect(() => {
    isCalled = "false";
  }, [isCalled, producttType, productCompany]);

  useEffect(() => {
    console.log(isCalled);
    if (isCalled === "false") {
      console.log("hfie");
      isCalled = "true";
      getToken();
    }
  }, [isCalled, producttType, pctCodeValue]);
  const getToken = async () => {
    const token = await refreshTokken();
    if (token?.data === "Please login to acces this resource") {
      navigate("/login");
    }
  };

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  useEffect(() => {
    productMatch = "false";
  });

  const handleSubmit = async () => {
    console.log(pctCodeDescription, productCompany, pctCodeValue);
    if (!pctCodeDescription || !productCompany || !pctCodeValue) {
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
    } 
      // dispatch(postColor(colorName, colorDescription))
      const response = await postPCTCodes(pctCodeDescriptionValue, productCompany, pctCodeValue);
      console.log(response);
      if (response) {
        navigate("/ViewPCTCodes");
        return swal.fire({
          icon: "success",
          title: t("titleAdded"),
          text: t("successMessage"),
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        });
      }
    
  };

  useEffect(() => {
    if (pctCode?.length > 0) {
      console.log(pctCode);
      setData(pctCode);
      // setColorRecord(pctCode)
      setColorLoading(false);
    }
  }, [pctCode, pctCodeLoading]);

  const handleSearch = async (colorName) => {
    console.log(colorName);
    const dataa = await SearchPCTCodeData(pctCode, pctCodeValue);
    // console.log(dataa)
    // // console.warn(dataa);
    setData(dataa);
  };
  useEffect(()=>{

    dispatch(getPCTCodeDescription());
    dispatch(getPCTCodeCompany());
  }, [])




  const columns = [
    { field: "companyId.companyName", label: t("Company") },
    { field: "pctCodeDescription.pctDescription", label: t("pctCodeDescription") },
    { field: "pctCode", label: t("pctCode") },
  ]; 
  return (
    <>
      <MetaData title="QE ~~AddColors" />
      <div className={`Color ${colorTheme}`}>
        
        <div className="secondContainer">
        <div className="contentt-box">
              <div className="heading-container">
                <h3>{t("add-pctCode")}</h3>
              
              </div>
        </div>
        <div className="form">
            <div className="formRow">
              <div className="inputSection">
              <label>{t("productCompany")}</label>
              <Dropdown
                options={
                  pctCodeCompany !== "No Record Found" &&
                  pctCodeCompany?.map((comp) => ({
                    key: comp.companyName,
                    text: comp.companyName,
                    value: comp._id,
                  }))
                }
                placeholder={t("enterProdCompany")}
                selection
                search
                required
                autoComplete="off"
                value={productCompany}
                onChange={handleCompanySelectChange}
              />
               {/* <input
                label={t("productCompany")}
                type="text"
                placeholder={t("enterCompany")}
                name="companyName"
                autoComplete="off"
                maxLength="40"
                required
                value={productCompany}
                onChange={(e) => {
                  setProductCompany(e.target.value)
                  let value = e.target.value
                  handleSearch(value)}}
              /> */}
              </div>
              <div className="inputSection">
              <label>{t("pctCodeDescription")}</label>
              <Dropdown
                options={
                  !pctCodeDescriptionLoading &&
                  pctCodeDescription !== "No Record Found" &&
                  pctCodeDescription?.map((comp) => ({
                    key: comp.pctDescription,
                    text: comp.pctDescription,
                    value: comp._id,
                  }))
                }
                placeholder={t("enterPCTDescription")}
                selection
                search
                required
                autoComplete="off"
                value={pctCodeDescriptionValue}
                onChange={handleDescriptionSelectChange}
              />
               </div> 
            </div>
         
            <div className="formRow">
            <div className="inputSection">
              <label>{t("pctCode")}</label>
              <input
                label={t("pctCode")}
                type="text"
                placeholder={t("enterPCTCode")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={pctCodeValue}
                onChange={(e) => {
                  setPCTCodeValue(e.target.value)
                  let value = e.target.value
                  handleSearch(value)}}
              />
            </div>
            <div className="inputSection">
              {/* <label>{t("colorDescription")}</label>
              <input
                label={t("colorDescription")}
                type="text"
                placeholder={t("enterColorDescription")}
                name="productCode"
                autoComplete="off"
                maxLength="40"
                required
                value={colorDescription}
                onChange={(e) => setColorDescription(e.target.value)}
              /> */}
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
              color={buttonClicked ? "green" : "white"}
              onClick={handleSubmit}
              type="button"
              className={`button button-add-product`}
              disabled={buttonClicked}
            >
              {t("add-pctCode")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
          </div>
          <div className="table-container">
          {!pctCodeLoading && pctCode !== "No Record Found" ? (
            <TableComponentId
              data={data}
              columns={columns}
            />
          ) : (
            // <div style={{marginTop: "10%"}}>
            <PageLoader />
            // </div>

            // <Loader active>Loading</Loader>
          )}
        </div>
        </div>   </div>
      </div>
    </>
  );
};

export default PCTCodeForm;
