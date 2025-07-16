import React, { Fragment, useEffect, useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import swal from "sweetalert2";
import { ReturnState } from "../context/ContextReturn";
import { useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";

const ReturnQuantityModel = ({}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    returnQuantity,
    setReturnQuantity,
    setIsModelOpen,
    listMaxQuantity,
    handleSubmit,
  } = useContext(ReturnState);

  const submitRecord = () => {
    if (returnQuantity > listMaxQuantity) {
      return swal.fire({
        icon: "error",
        title: t("titleQuantityError"),
        text: `${t("textQuantityError")} ${listMaxQuantity}`,
        confirmButtonText: "Ok",
      });
    }
    if (returnQuantity <= 0 ) {
      return swal.fire({
        icon: "error",
        title: t("titleQuantityError"),
        text: `${t("Quantity should not be zero")}! Current Qty: ${listMaxQuantity}`,
        confirmButtonText: "Ok",
      });
    }
    swal
      .fire({
        icon: "warning",
        title: t("titleAreYouSure"),
        text: t("purConfirmMessage"),
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Add it!",
        cancelButtonText: "Cancel",
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleSubmit();
          setIsModelOpen(false);
          navigate("/returnProducts", { state: "/returnProductpage" });
        }
      });
  };

  return (
    <Fragment>
      <div className="modal">
        <div className="modal-content">
          <div className="buttonDiv">
            <button onClick={() => setIsModelOpen()}>
              <CloseIcon />
            </button>
          </div>
          <div className="form">
            <div className="formRow">
              <div className="inputSection">
                <label>
                  {" "}
                  {t("quantity")}{" "}
                  <span style={{ color: "red", margin: 0 }}>*</span>
                </label>
                <input
                  type="number"
                  placeholder={t("returnQuantity")}
                  required
                  min={1}
                  max={listMaxQuantity}
                  value={returnQuantity}
                  onChange={(e) => setReturnQuantity(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="buttonRow">
              <Button
                onClick={submitRecord}
                color={"green"}
                className="button button-back"
                type="button"
              >
                {t("add-product")}&nbsp;&nbsp;
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ReturnQuantityModel;
