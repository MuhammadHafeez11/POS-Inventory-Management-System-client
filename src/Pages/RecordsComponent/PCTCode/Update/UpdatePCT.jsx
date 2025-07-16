import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button,Dropdown, Form, Select, Modal } from "semantic-ui-react";
import { useCustomState } from "../../../../Variables/stateVariables";
// import { getColorDetails } from "../../../Api";
import MetaData from "../../../../MetaData";
import swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import Stack from "@mui/material/Stack";
import { TextField, Typography, Box, ButtonGroup } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import { getColorDetails, updateColor } from "../../../../actions/colorAction";
import { refreshTokken } from "../../../../actions/userAction";
import { getPCTCodeDetails, updatePCTCode } from "../../../../actions/pctCodeAction";
let isCalledd = "false";
const UpdatePCT = () => {
  const [pctCode, setPCTCode] = useState()
  const [pctCodeDescription, setPCTCodeDescription] = useState()
  const [companyId, setCompanyId] = useState()
  const [companyName, setCompanyName] = useState()
  const { company } = useSelector((state) => state.company);
  const params = useParams();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { colorUpdate } = useSelector((state) => state.colorUpdate);
  const { pctCodeDetailsLoading, pctCodeDetails } = useSelector((state) => state.pctCodeDetails);
  const backPage = () => {
    navigate("/ViewPCTCodes");
  };

  useEffect(() => {
    dispatch(getPCTCodeDetails(params.id));

  }, []);

  useEffect(() => {
      getToken();
    // }
  }, []);
  const getToken = async () => {
    const token = await refreshTokken();
    if (token.data === "Please login to acces this resource") {
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
    if (pctCodeDetails && !pctCodeDetailsLoading) {
      console.log("called");
      console.log(pctCodeDetails);
      setPCTCodeDescription(pctCodeDetails.pctCodeDescription);
      setPCTCode(pctCodeDetails.pctCode);
      setCompanyId(pctCodeDetails?.companyId?._id);
      setCompanyName(pctCodeDetails?.companyId?.companyName)
    }
  }, [pctCodeDetails, pctCodeDetailsLoading]);

 
  const UpdateColordata = async () => {
    if (!pctCode || !pctCodeDescription) {
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
      const response = await updatePCTCode(
        params.id,
        companyId,
        pctCode,
        pctCodeDescription
      );
      console.log(response);
      if (response) {
        navigate("/ViewPCTCodes");
        return swal.fire({
          icon: "success",
          title: t("titleUpdated"),
          text: t("recordUpdated"),
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "custom-swal-popup", // This is the custom class you're adding
          },
        });
      }
    }
  };

  return (
    <>
      <MetaData title="QE ~~UpdatePCTCode" />
      <div className={`Color ${colorTheme}`}>
        <div className="secondContainer">
        <div className="contentt-box">
              <div className="heading-container">
                <h3>{t("updatePCTCode")}</h3>
              
              </div>
              </div>
              <div className="form">
            <div className="formRow">
            <div className="inputSection">
            <label>{t("productCompany")}</label>
              <Dropdown
                options={
                  company !== "No Record Found" &&
                  company?.map((comp) => ({
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
                disabled
                value={companyName}
                // onChange={handleCompanySelectChange}
              />
            </div>
            <div className="inputSection">
              <label>{t("pctCodeDescription")}</label>
              <input
                type="text"
                placeholder={t("enterPCTCode")}
                name="productCode"
                autoComplete="off"
                maxLength="40"
                required
                value={pctCode}
                onChange={(e) => setPCTCode(e.target.value)}
              />
            </div> </div>
            <div className="formRow">
            <div className="inputSection">
              <label>{t("pctCodeDescription")}</label>
              <input
                type="text"
                placeholder={t("enterPCTCodeDescription")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={pctCodeDescription}
                onChange={(e) => setPCTCodeDescription(e.target.value)}
              />
            </div>
            <div className="inputSection">
             
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
              onClick={UpdateColordata}
              type="button"
              className={`button button-add-product `}
            >
              {t("updateRecord")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
          </div>
        </div>
      </div> </div>
      {/* </div> */}
    </>
    // <Modal open dimmer="inverted" size="tiny" closeIcon="close">
    //     <Stack  backgroundColor="#ECECEC">
    //     <Stack spacing={2} direction="row" marginLeft={2} alignItems="center" marginTop={1}>
    //       <Typography variant="h5" gutterBottom style={{ color: "#000000"}}>{t("updateColor")}</Typography>
    //     </Stack>
    //   {/* <Modal.Header>{t("updateColor")}</Modal.Header> */}
    //   <Stack padding={3}>
    //   <Modal.Content>
    //     <Form className={"color"}>
    //       <Form.Group widths="equal">
    //         <Form.Input
    //           label={t("colorName")}
    //           type="text"
    //           placeholder={t("enterColorName")}
    //           name="colorName"
    //           autoComplete="off"
    //           maxLength="40"
    //           required
    //           value={colorName}
    //           onChange={(e) => setColorName(e.target.value)}
    //         />

    //         <Form.Input
    //           label={t("colorDescription")}
    //           type="text"
    //           placeholder={t("enterColorDescription")}
    //           name="colorDescription"
    //           maxLength="40"
    //           autoComplete="off"
    //           required
    //           value={colorDescription}
    //           onChange={(e) => setColorDescription(e.target.value)}
    //         />
    //       </Form.Group>
    //       <Button
    //         color={"green"}
    //         onClick={UpdateColordata}
    //         style={{fontSize: "17px", paddingLeft: "10px", paddingRight: "5px", paddingTop: "5px", paddingBottom: "5px" }}
    //         type="button"
    //         className="button"
    //         floated="right"
    //       >
    //         {t("updateColor")}&nbsp;&nbsp;<UpdateIcon />
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

export default UpdatePCT;
