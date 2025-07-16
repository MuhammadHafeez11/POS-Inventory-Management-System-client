import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Select, Modal } from "semantic-ui-react";
import MetaData from "../../../../MetaData";
import { useCustomState } from "../../../../Variables/stateVariables";
import swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import {
  getProductTypeDetails,
  updateProducType,
} from "../../../../actions/productTypeAction";
import { useSelector, useDispatch } from "react-redux";
import { refreshTokken } from "../../../../actions/userAction";
let isCalled = "false";
const UpdateType = () => {
  const { t } = useTranslation();
  const {
    productName,
    setProductName,
    productDescription,
    setProductDescription,
  } = useCustomState();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { productTypeDetails } = useSelector(
    (state) => state.productTypeDetails
  );
  const backPage = () => {
    navigate("/recordType");
  };

  useEffect(() => {
    isCalled = "false";
  }, [productName, productDescription]);

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
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  useEffect(() => {
    call();
  }, []);

  async function call() {
    dispatch(getProductTypeDetails(params.id));
  }

  useEffect(() => {
    if (productTypeDetails) {
      setProductName(productTypeDetails.productName);
      setProductDescription(productTypeDetails.productDescription);
    }
  }, [productTypeDetails]);
  const Updateproduct = async () => {
    if (!productName || !productDescription) {
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
      const response = await updateProducType(
        params.id,
        productName,
        productDescription
      );
      console.log(response);
      if (response) {
        navigate("/recordType");
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
      // updateProductTypeDetails(params.id, productName, productDescription);?
    }
  };

  return (
    <>
      <MetaData title="QE ~~UpdateProductType" />
      <div className={`ProductType ${colorTheme}`}>
        <div className="secondContainer"> 
          <div className="contentt-box">
            <div className="heading-container">
              <h3>{t("updateProductType")}</h3>
            </div>
          </div>
         
          <div className="form">
          <div className="formRow">
            <div className="inputSection">
              <label>{t("productType")}</label>
              <input
                type="text"
                placeholder={t("typeItems")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="inputSection">
              <label>{t("productTypeDescription")}</label>
              <input
                type="text"
                placeholder={t("productTypeDescription")}
                name="productCode"
                autoComplete="off"
                maxLength="40"
                required
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
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
              className={`button button-add-product `}
              onClick={Updateproduct}
              type="button"
            >
              {t("updateProductType")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
          </div> 
        </div>
        </div>
      </div>
    </>
  );
};

export default UpdateType;
