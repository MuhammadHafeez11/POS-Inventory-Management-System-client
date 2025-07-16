import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Select, Modal } from "semantic-ui-react";
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
let isCalledd = "false";
const UpdateColor = () => {
  const {
    colorName,
    setColorName,
    colorDescription,
    setColorDescription,
    isCalled,
    setIsCalled,
  } = useCustomState();
  const params = useParams();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { colorUpdate } = useSelector((state) => state.colorUpdate);
  const { loading, colorDetails } = useSelector((state) => state.colorDetails);
  const backPage = () => {
    navigate("/color");
  };

  useEffect(() => {
    isCalledd = "false";
  }, [isCalledd, colorName, colorDescription]);

  useEffect(() => {
    if (isCalledd === "false") {
      isCalledd = "true";
      getToken();
    }
  }, [colorName, colorDescription]);
  const getToken = async () => {
    const token = await refreshTokken();
    if (token.data === "Please login to acces this resource") {
      navigate("/login");
    }
  };

  useEffect(() => {
    isCalled ? call() : call3();
  }, []);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  async function call() {
    dispatch(getColorDetails(params.id));
  }
  useEffect(() => {
    if (colorDetails) {
      console.log("called");
      console.log(colorDetails);
      setColorName(colorDetails.colorName);
      setColorDescription(colorDetails.colorDescription);
    }
  }, [colorDetails]);

  async function call3() {
    // console.warn("hi");
  }
  const UpdateColordata = async () => {
    if (!colorName || !colorDescription) {
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
      const response = await updateColor(
        params.id,
        colorName,
        colorDescription
      );
      console.log(response);
      if (response) {
        navigate("/color");
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
      <MetaData title="QE ~~UpdateColor" />
      <div className={`Color ${colorTheme}`}>
        <div className="secondContainer">
        <div className="contentt-box">
        {/* <div className="FormHeading-box"> */}
              <div className="heading-container">
                <h3>{t("updateColor")}</h3>
              
              </div>
              </div>
          <div className="form">
            <div className="formRow">
            <div className="inputSection">
              <label>{t("colorName")}</label>
              <input
                label={t("colorName")}
                type="text"
                placeholder={t("enterColorName")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
              />
            </div>
            <div className="inputSection">
              <label>{t("colorDescription")}</label>
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
              onClick={UpdateColordata}
              type="button"
              className={`button button-add-product `}
            >
              {t("updateColor")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
          </div>
        </div>
      </div> 
    </div>
    </>
 
  );
};

export default UpdateColor;
