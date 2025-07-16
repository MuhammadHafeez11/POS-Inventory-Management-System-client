import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";
import swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useCustomState } from "../../../../Variables/stateVariables";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../../../MetaData";
import { TextField, Typography, Box, ButtonGroup } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import {  postCompany } from "../../../../actions/companyAction";
import { refreshTokken } from "../../../../actions/userAction";
import TableComponentId from "../../../../Components/tableComponent/tableComponentId";
import { SearchCompanyData } from "../../../../Components/searchComponent/companySearch/SearchCompanyData";
import PageLoader from "../../../../Components/Loader/PageLoader";
let productMatch = "false";
let companys = [];
let isCalledd = "false";
let companyy;
const FormCompany = () => {
  const { companyName, setcompanyName, companyAddress, setCompanyAddress } =
    useCustomState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const location = useLocation()
  // const translationFunctions = useTranslationForFunctions();
  const dispatch = useDispatch();
  const { companyRes } = useSelector((state) => state.companyRes);
  const { company, loading } = useSelector((state) => state.company);
  const [data, setData] = useState()
  const [companyLoading, setCompanyLoading] = useState()
  const backPage = () => {
    navigate(location.state);
  };

  useEffect(() => {
    productMatch = "false";
  });

  useEffect(() => {
    isCalledd = "false";
  }, [isCalledd, companyName, companyAddress, company]);

  useEffect(() => {
    console.log(isCalledd);
    if (isCalledd === "false") {
      console.log("hfie");
      isCalledd = "true";
      getToken();
    }
  }, [isCalledd, companyName, companyAddress, company]);

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

  const AddCompany = async () => {
    // companys= await getCompany()
    console.log(company);
    company !== "No Record Found" && company?.map((company) => {
      const companyNam = company?.companyName
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
      if (
        companyNam === companyName?.replace(/\s+/g, " ").trim().toLowerCase()
      ) {
        productMatch = "true";
      }
    });

    if (productMatch === "true") {
      return swal.fire({
        icon: "error",
        title: t("titleError"),
        text: t("dataIsAlreadyAvailable"),
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else {
      const response = await postCompany(companyName, companyAddress);
      console.log(response);
      if (response) {
        navigate("/company");
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
    }
  };

  useEffect(() => {
    if (company?.length > 0) {
      console.log(company);
      setData(company);
      setCompanyLoading(false);
    }else 
      if(!loading) {
        setCompanyLoading(false)
      }
  }, [loading, company]);

  const handleSearch = async (companyName) => {
    console.log(companyName);
    const dataa = await SearchCompanyData(company, companyName);
    setData(dataa);
  };


  const columns = [
    { field: "companyName", label: t("companyName") },
    { field: "address", label: t("companyAddress") },
  ];
  return (
    <>
      <MetaData title="QE ~~AddCompany" />
      <div className={`Company ${colorTheme}`}>
        <div className="secondContainer">
        <div className="contentt-box">
              <div className="heading-container">
                <h3>{t("add-company")}</h3>
              
              </div>
              </div>
          <div className="form">
            <div className="formRow">
            <div className="inputSection">
              <label>{t("companyName")}</label>
              <input
                type="text"
                placeholder={t("enterCompanyName")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={companyName}
                onChange={(e) => {setcompanyName(e.target.value)
                  companyy = e.target.value
                  handleSearch(companyy)}}
              />
            </div>
            <div className="inputSection">
              <label>{t("companyAddress")}</label>
              <input
                label={t("enterCompanyAddress")}
                type="text"
                placeholder={t("enterCompanyAddress")}
                name="productCode"
                autoComplete="off"
                maxLength="40"
                required
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </div>
            </div>
        
          <div className="buttonRow">
            <Button
              onClick={backPage}
              className="button button-back"
              type="button"
            >
              <ArrowBackIcon />
              &nbsp; &nbsp;&nbsp;{t("back")}
            </Button>
            <Button
              className={`button button-add-product`}
              onClick={AddCompany}
              type="button"
            >
              {t("add-company")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
          </div>
          <div className="table-container">
          {!companyLoading && company !== "No Record Found" ? (
            <TableComponentId
              data={data}
              columns={columns}
            />
          ) : 
          (<>
            {
              companyLoading ? (
                <PageLoader />
              ) : (
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  {t("noRecordFound")}
                </Typography>
              )
            }
          </>
          //  <PageLoader />
          )}
        </div>
        </div>
      </div>  </div>
    </>
    // <Modal open dimmer="inverted" size="tiny" closeIcon="close">
    //    <Stack  backgroundColor="#ECECEC">
    //    <Stack spacing={2} direction="row" marginLeft={2} alignItems="center" marginTop={1}>
    //       <Typography variant="h5" gutterBottom style={{ color: "#000000"}}>{t("add-company")}</Typography>
    //     </Stack>

    //   <Stack padding={3}>
    //   <Modal.Content>
    //     <Form className={"formCompany"}>
    //       <Form.Group widths="equal">
    //         <Form.Input
    //           label={t("companyName")}
    //           type="text"
    //           placeholder={t("enterCompanyName")}
    //           name="companyName"
    //           autoComplete="off"
    //           maxLength="40"
    //           required
    //           value={companyName}
    //           onChange={(e) => setcompanyName(e.target.value)}
    //         />
    //         <Form.Input
    //           label={t("companyAddress")}
    //           type="text"
    //           placeholder={t("enterCompanyAddress")}
    //           name="companyAddress"
    //           maxLength="100"
    //           autoComplete="off"
    //           required
    //           value={companyAddress}
    //           onChange={(e) => setCompanyAddress(e.target.value)}
    //         />
    //       </Form.Group>

    //       <Button
    //         color={"green"}
    //         onClick={AddCompany}
    //         type="button"
    //         style={{fontSize: "17px", paddingLeft: "10px", paddingRight: "5px", paddingTop: "5px", paddingBottom: "5px" }}
    //         className="button"
    //         floated="right"
    //       >
    //         {t("add-company")}&nbsp;&nbsp;<AddIcon />
    //       </Button>
    //       <Button
    //         color={"green"}
    //         onClick={backPage}
    //         style={{fontSize: "17px", paddingLeft: "5px", paddingRight: "10px", paddingTop: "5px", paddingBottom: "5px" }}
    //         type="button"
    //         className="button"
    //         floated="left"
    //       >
    //         <ArrowBackIcon />&nbsp;{t("back")}
    //       </Button>
    //       <br />
    //       <br />
    //     </Form>
    //   </Modal.Content>
    //   </Stack>
    //   </Stack>
    // </Modal>
  );
};

export default FormCompany;
