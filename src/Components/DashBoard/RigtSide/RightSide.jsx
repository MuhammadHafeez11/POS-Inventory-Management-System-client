import React from "react";
import CustomerReview from "../CustomerReview/CustomerReview";
import Updates from "../Updates/Updates";
import "./RightSide.css";
import { useTranslation } from "react-i18next";
import PurchaseUpdates from "../Updates/PurchaseUpdates";

const RightSide = () => {
  const { t } = useTranslation();
  return (
    <div className="RightSide">
      <div className="UpdateHeading1">
        <div className="headingContainer">
          <h3 className="Updatesheading">{t("saleUpdates")}</h3>
        </div>
        <Updates />
      </div>
      <div className="UpdateHeading1">
        <div className="headingContainer">
          <h3 className="Updatesheading">{t("purchaseUpdates")}</h3>
        </div>
        <PurchaseUpdates />
      </div>
    </div>
  );
};

export default RightSide;
