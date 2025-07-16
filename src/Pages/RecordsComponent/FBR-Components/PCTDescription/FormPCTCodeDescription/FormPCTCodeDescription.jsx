import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";
import swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useCustomState } from "../../../../../Variables/stateVariables";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../../../../MetaData";
import { TextField, Typography, Box, ButtonGroup } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import {  postCompany } from "../../../../../actions/companyAction";
import { refreshTokken } from "../../../../../actions/userAction";
import TableComponentId from "../../../../../Components/tableComponent/tableComponentId";
import { SearchCompanyData, SearchPCTCodeDescriptionData } from "../../../../../Components/searchComponent/companySearch/SearchCompanyData";
import PageLoader from "../../../../../Components/Loader/PageLoader";
import { postPCTCodeDescription } from "../../../../../actions/pctCodeAction";
let productMatch = "false";
let companys = [];
let isCalledd = "false";
let description;
const FormCompany = () => {
  const { companyName, setcompanyName, companyAddress, setCompanyAddress } =
    useCustomState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const location = useLocation()
  const[pctDescription, setPCTDescriptions] = useState("")
  const { pctCodeDescription, pctCodeDescriptionLoading } = useSelector((state) => state.pctCodeDescription);
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
  }, [isCalledd, companyName, pctCodeDescription]);

  useEffect(() => {
    console.log(isCalledd);
    if (isCalledd === "false") {
      console.log("hfie");
      isCalledd = "true";
      getToken();
    }
  }, [isCalledd, companyName, pctCodeDescription]);

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
    console.log(pctCodeDescription);
    pctCodeDescription !== "No Record Found" && pctCodeDescription?.map((description) => {
      const descriptionName = description?.pctDescription.replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
      if (
        pctDescription === descriptionName?.replace(/\s+/g, " ").trim().toLowerCase()
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
      const response = await postPCTCodeDescription(pctDescription);
      console.log(response);
      if (response) {
        navigate(location.state);
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
    if (pctCodeDescription?.length > 0) {
      console.log(pctCodeDescription);
      setData(pctCodeDescription);
      setCompanyLoading(false);
    }else 
      if(!pctCodeDescriptionLoading) {
        setCompanyLoading(false)
      }
  }, [pctCodeDescriptionLoading, pctCodeDescription]);

  const handleSearch = async (description) => {
    console.log(description);
    const dataa = await SearchPCTCodeDescriptionData(pctCodeDescription, description);
    setData(dataa);
  };


  const columns = [
    { field: "pctDescription", label: t("pctDescription") },
  ];
  return (
    <>
      <MetaData title="QE ~~AddCompany" />
      <div className={`Company ${colorTheme}`}>
        <div className="secondContainer">
        <div className="contentt-box">
              <div className="heading-container">
                <h3>{t("add-Description")}</h3>
              
              </div>
              </div>
          <div className="form">
            <div className="formRow">
            <div className="inputSection">
              <label>{t("pctCodeDescription")}</label>
              <input
                type="text"
                placeholder={t("enterpctCodeDescription")}
                name="productType"
                autoComplete="off"
                maxLength="120"
                required
                value={pctDescription}
                onChange={(e) => {setPCTDescriptions(e.target.value)
                  description = e.target.value
                  handleSearch(description)}}
              />
            </div>
            <div className="inputSection">
            
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
              {t("add-Description")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
          </div>
          <div className="table-container">
          {!companyLoading && pctCodeDescription !== "No Record Found" ? (
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
