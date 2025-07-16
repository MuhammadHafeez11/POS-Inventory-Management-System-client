import React, { useContext, useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Table } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "./DeleteModal";
import { Link, Navigate, useNavigate } from "react-router-dom";
// import { State } from "./context/stateContext";
import { Statte } from "./context/stateContext";
import { useTranslation } from "react-i18next";
import {
  Button,
  Form,
  Select,
  Modal,
  Message,
  Dropdown,
} from "semantic-ui-react";
import Showconfrm from "./showConfirmDialogsubmitBox";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import { TextField, Typography, Box, ButtonGroup } from "@mui/material";
import swal from "sweetalert2";

// import back-button from ".."
const SellProductPage = () => {
  const [maxQuantity, setMaxQuantity] = useState(0);
  const {
    description,
    setDescription,
    quantity,
    setQuantity,
    price,
    setPrice,
    amount,
    listTransfer,
    total,
    isEditing,
    showModall,
    setShowModall,
    handleSubmit,
    editRow,
    Code,
    setCode,
    Namee,
    setNamee,
    Company,
    setCompany,
    Color,
    setColor,
    ActualPrice,
    setActualPrice,
    CurrentPrice,
    setCurrentPrice,
    Quantity,
    setQuantitye,
    quantityidset,
    setQuantityidset,
    PurchaseQuantity,
    setPurchaseQuantity,
    Discount,
    setDiscount,
    showModalconfirm,
    setShowModalconfirm,
    productColor,
    selectedItems,
    setSelectedItems,
    tempProductQuantity,
    setTempProductQuantity,
  } = useContext(Statte);
  const { t } = useTranslation();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const navigate = useNavigate();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  useEffect(() => {
    console.log(selectedItems);
    setPurchaseQuantity("");
    const max = Quantity;
    setMaxQuantity(max);
  }, []);

  const sellProduct = () => {
    // if (quantity > PurchaseQuantity){
    console.log(PurchaseQuantity);
    console.log(listTransfer)
    let quantityAmount;
    listTransfer?.map((temp) => {
      if (temp?.quantityidset === quantityidset && temp?.productColor === productColor) {
        console.log(temp?.quantityidset);
        console.log(quantityidset);
        quantityAmount = temp?.PurchaseQuantity + PurchaseQuantity;
      }
    });
    console.log(quantityAmount);
    if (PurchaseQuantity == null) {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("textQuantityNull"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else if (PurchaseQuantity <= 0) {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: t("textQuantityGreaterThan0"),
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else if (PurchaseQuantity > Quantity) {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: `${t("textOnly")} ${Quantity} ${t("textAvalibleItems")}`,
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else if (parseInt(quantityAmount) > parseInt(Quantity)) {
      return swal.fire({
        icon: "error",
        title: t("titleOops"),
        text: `${t("textOnly")} ${Quantity} ${t("textAvalibleItems")}`,
        showConfirmButton: true,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    } else {
      handleSubmit();
      navigate("/TransferRecordd", {state: '/DiscountModelTransfer'});
    }
  };

  const Sellproductpage = () => {
    navigate("/saleproductpage");
  };
  const checkchange = (data) => {
    // console.log(data);
    setPurchaseQuantity(data);
    // console.log(PurchaseQuantity);
    // console.log(Quantity);
  };

  return (
    <>
      <div className={`Transfer ${colorTheme}`}>
        <div className="secondContainer">
        <div className="form">
          <div className="formRow">
            <div className="inputSection">
              <label>{t("quantity")}
              <span style={{ color: "red", margin: 0 }}>*</span> (Available
                Item(s)={Quantity})</label>
              <input
                label={t("transferQuantity")}
                type="number"
                placeholder={t("transferQuantity")}
                name="productType"
                autoComplete="off"
                maxLength="40"
                required
                value={PurchaseQuantity}
                onChange={(e) => setPurchaseQuantity(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="buttonRow">
            <Button
              color={"green"}
              onClick={() => {
                navigate("/TranferProductPage");
              }}
              className="button button-back"
              type="button"
            >
              <ArrowBackIcon />
              &nbsp; &nbsp;&nbsp;{t("back")}
            </Button>
            <Button
              onClick={() => {
                sellProduct();
              }}
              type="button"
              className={`button button-add-product `}
            >
              {t("add-product")}&nbsp;&nbsp;
              <AddIcon />
            </Button>
            {/* {showModalconfirm && <Showconfrm />} */}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default SellProductPage;
